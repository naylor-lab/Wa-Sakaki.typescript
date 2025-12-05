
  4 import { Boom } from '@hapi/boom';
  5 import NodeCache from '@cacheable/node-cache';
  6 import readline from 'readline';
  7 import makeWASocket, {
  8   AnyMessageContent,
  9   CacheStore,
 10   delay,
 11   DisconnectReason,
 12   fetchLatestBaileysVersion,
 13   makeCacheableSignalKeyStore,
 14   proto,
 15   useMultiFileAuthState,
 16   WAMessageContent,
 17   WAMessageKey,
 18 } from '@whiskeysockets/baileys';
 19 import P from 'pino';
 20 import axios from 'axios';
 21 import moment from 'moment';
 22 import { downloadContentFromMessage } from '@whiskeysockets/baileys';
 23 import sharp from 'sharp';
 24 import { execSync } from 'child_process';
 25 import fs from 'fs';
 26
 27 /********************************************************************
 28  *  CONSTANTES & CONFIG
 29  ********************************************************************/
 30 const time: string = moment().format('LT');
 31 const qrcode = require('qrcode-terminal');
 32 const logger = P({
 33   level: 'trace',
 34   transport: {
 35     targets: [{ target: 'pino-pretty', options: { colorize: true } }],
 36   },
 37 });
 38 const COMMAND_PREFIX = '/';
 39 const msgRetryCounterCache = new NodeCache() as CacheStore;
 40
 41 /********************************************************************
 42  *  FUNÇÕES AUXILIARES
 43  ********************************************************************/
 44 const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
 45 const question = (txt: string): Promise<string> => new Promise((res) => rl.question(txt, res));
 46
 47 function parseCommand(txt: string): string | null {
 48   const t = txt.trim().toLowerCase();
 49   if (t.startsWith(COMMAND_PREFIX)) return t.slice(COMMAND_PREFIX.length);
 50   if (t === 'open_group' || t === 'close_group') return t;
 51   return null;
 52 }
 53
 54 async function sendWithTyping(sock: any, jid: string, msg: AnyMessageContent) {
 55   await sock.presenceSubscribe(jid);
 56   await delay(500);
 57   await sock.sendPresenceUpdate('composing', jid);
 58   await delay(2000);
 59   await sock.sendPresenceUpdate('paused', jid);
 60   await sock.sendMessage(jid, msg);
 61 }
 62
 63 async function sendWithTypingQ(sock: any, jid: string, msg: AnyMessageContent, quoted: any) {
 64   await sock.presenceSubscribe(jid);
 65   await delay(500);
 66   await sock.sendPresenceUpdate('composing', jid);
 67   await delay(2000);
 68   await sock.sendPresenceUpdate('paused', jid);
 69   await sock.sendMessage(jid, msg, { quoted });
 70 }
 71
 72
 73 /********************************************************************
 74  *  MAIN – inicia a sessão
 75  ********************************************************************/
 76 const App = async () => {
 77   const { state, saveCreds } = await useMultiFileAuthState('registration/tmp');
 78   const { version } = await fetchLatestBaileysVersion();
 79
 80   const sock = makeWASocket({
 81     version,
 82     logger,
 83     auth: {
 84       creds: state.creds,
 85       keys: makeCacheableSignalKeyStore(state.keys, logger),
 86     },
 87     msgRetryCounterCache,
 88     generateHighQualityLinkPreview: true,
 89     getMessage,
 90   });
 91
 92   if (process.argv.includes('--use-pairing-code') && !sock.authState.creds.registered) {
 93     const phone = await question('Phone number (inclua DDI): ');
 94     const code = await sock.requestPairingCode(phone);
 95     console.log(`Pairing code: ${code}`);
 96   }
 97
 98   sock.ev.process(async (events) => {
 99     if (events['connection.update']) {
100       const { connection, lastDisconnect, qr } = events['connection.update'];
101       if (qr) qrcode.generate(qr, { small: true });
102
103       if (connection === 'close') {
104         const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
105         if (shouldReconnect) {
106           console.log('🔄 Reconectando...');
107           App();
108         } else {
109           console.log('❌ Sessão encerrada (logged out).');
110         }
111       }
112     }
113
114     if (events['creds.update']) await saveCreds();
115
116     if (events['messages.upsert']) {
117       const up = events['messages.upsert'];
118       if (up.type !== 'notify') return;
119
120       for (const msg of up.messages) {
121
122         const Msg = msg.message;
123
124         const text =
125           Msg.conversation ??
126           Msg.extendedTextMessage?.text ??
127           Msg.imageMessage?.caption ??
128           Msg.videoMessage?.caption ??
129           Msg.viewOnceMessage?.message?.imageMessage?.caption ??
130           Msg.viewOnceMessage?.message?.videoMessage?.caption ??
131           '';
132         const jid = msg.key.remoteJid!;
133         const cmd = parseCommand(text);
134         if (!cmd) continue;
135
136         console.log('🟢 Comando:', cmd, '| jid:', jid);
137
138         try {
139           switch (cmd) {
140
141            case 'menu':
142            await sendWithTypingQ(sock, jid, { text: '> Menu\n\n/Group\n/Help' }, { quoted: msg });
143            break;
144
145             case 'open_group':
146               await sock.groupSettingUpdate(jid, 'not_announcement');
147               await sendWithTyping(sock, jid, { text: '🔓 Grupo aberto! Todos podem conversar.' });
148               break;
149             case 'close_group':
150               await sock.groupSettingUpdate(jid, 'announcement');
151               await sendWithTyping(sock, jid, { text: '🔒 Grupo fechado! Apenas admins podem enviar.' });
152               break;
153             case 'allow_modify_group':
154               await sock.groupSettingUpdate(jid, 'unlocked');
155               break;
156             case 'block_modify_group':
157               await sock.groupSettingUpdate(jid, 'locked');
158               break;
159             case 'invite_group':
160               const code = await sock.groupInviteCode(jid);
161               await sendWithTyping(sock, jid, {
162                 text: `Follow this link to join my WhatsApp group: https://chat.whatsapp.com/${code}`
163               });
164               break;
165
166
167          // Pv & Group: //
168             case 'sticker': {
169
170               const mediaMsg = Msg.imageMessage ?? Msg.videoMessage;
171
172               if (!mediaMsg) {
173                 await sendWithTypingQ(sock, jid, { text: "❗ Envie uma imagem ou vídeo junto com o comando /sticker." }, { quoted: msg });
174                 break;
175               }
176
177               const stream = await downloadContentFromMessage(mediaMsg, 'image');
178               let buffer = Buffer.alloc(0);
179               for await (const chunk of stream) {
180                 buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
181               }
182
183               let stickerBuf: Buffer;
184
185               if (mediaMsg.mimetype?.startsWith("image")) {
186                 stickerBuf = await sharp(buffer)
187                   .resize(512, 512, { fit: "inside" })
188                   .webp()
189                   .toBuffer();
190               } else if (mediaMsg.mimetype?.startsWith("video")) {
191                 const tmpIn = "/tmp/tmp_input.mp4";
192                 const tmpOut = "/tmp/tmp_output.webp";
193                 fs.writeFileSync(tmpIn, buffer);
194                 execSync(
195                   `ffmpeg -y -i ${tmpIn} -vf "scale=512:512:force_original_aspect_ratio=decrease" -vcodec libwebp -lossless 1 -preset picture -loop 0 -an -vsync 0 -s 512:512 ${tmpOut}`
196                 );
197                 stickerBuf = fs.readFileSync(tmpOut);
198                 fs.unlinkSync(tmpIn);
199                 fs.unlinkSync(tmpOut);
200               } else {
201                 stickerBuf = buffer;
202               }
203
204               await sock.sendMessage(jid, { sticker: stickerBuf }, { quoted: msg });
205               await sendWithTypingQ(sock, jid, { text: "✅ Figurinha enviada!" }, { quoted: msg });
206               break;
207             }
208           }
209         } catch (e) {
210           console.error('❗ Erro:', e);
211         }
212       }
213     }
214   });
215
216   return sock;
217 };
218
219 /********************************************************************
220  *  PLACEHOLDER GET MESSAGE
221  ********************************************************************/
222 async function getMessage(_: WAMessageKey): Promise<WAMessageContent | undefined> {
223   return proto.Message.create({ conversation: '' });
224 }
225
226 /********************************************************************
227  *  INICIA
228  ********************************************************************/
229 App().catch(console.error);
