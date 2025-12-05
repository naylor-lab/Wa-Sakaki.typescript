"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_cache_1 = __importDefault(require("@cacheable/node-cache"));
var readline_1 = __importDefault(require("readline"));
var baileys_1 = __importStar(require("@whiskeysockets/baileys"));
var pino_1 = __importDefault(require("pino"));
var moment_1 = __importDefault(require("moment"));
var baileys_2 = require("@whiskeysockets/baileys");
var sharp_1 = __importDefault(require("sharp"));
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
/********************************************************************
 *  CONSTANTES & CONFIG
 ********************************************************************/
var time = (0, moment_1.default)().format('LT');
var qrcode = require('qrcode-terminal');
var logger = (0, pino_1.default)({
    level: 'trace',
    transport: {
        targets: [{ target: 'pino-pretty', options: { colorize: true } }],
    },
});
var COMMAND_PREFIX = '/';
var msgRetryCounterCache = new node_cache_1.default();
/********************************************************************
 *  FUNÇÕES AUXILIARES
 ********************************************************************/
var rl = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
var question = function (txt) { return new Promise(function (res) { return rl.question(txt, res); }); };
function parseCommand(txt) {
    var t = txt.trim().toLowerCase();
    if (t.startsWith(COMMAND_PREFIX))
        return t.slice(COMMAND_PREFIX.length);
    if (t === 'open_group' || t === 'close_group')
        return t;
    return null;
}
function sendWithTyping(sock, jid, msg) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sock.presenceSubscribe(jid)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, baileys_1.delay)(500)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sock.sendPresenceUpdate('composing', jid)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, baileys_1.delay)(2000)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sock.sendPresenceUpdate('paused', jid)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, sock.sendMessage(jid, msg)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function sendWithTypingQ(sock, jid, msg, quoted) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sock.presenceSubscribe(jid)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, baileys_1.delay)(500)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sock.sendPresenceUpdate('composing', jid)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, baileys_1.delay)(2000)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sock.sendPresenceUpdate('paused', jid)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, sock.sendMessage(jid, msg, { quoted: quoted })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/********************************************************************
 *  MAIN – inicia a sessão
 ********************************************************************/
var App = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, state, saveCreds, version, sock, phone, code;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)('registration/tmp')];
            case 1:
                _a = _b.sent(), state = _a.state, saveCreds = _a.saveCreds;
                return [4 /*yield*/, (0, baileys_1.fetchLatestBaileysVersion)()];
            case 2:
                version = (_b.sent()).version;
                sock = (0, baileys_1.default)({
                    version: version,
                    logger: logger,
                    auth: {
                        creds: state.creds,
                        keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
                    },
                    msgRetryCounterCache: msgRetryCounterCache,
                    generateHighQualityLinkPreview: true,
                    getMessage: getMessage,
                });
                if (!(process.argv.includes('--use-pairing-code') && !sock.authState.creds.registered)) return [3 /*break*/, 5];
                return [4 /*yield*/, question('Phone number (inclua DDI): ')];
            case 3:
                phone = _b.sent();
                return [4 /*yield*/, sock.requestPairingCode(phone)];
            case 4:
                code = _b.sent();
                console.log("Pairing code: ".concat(code));
                _b.label = 5;
            case 5:
                sock.ev.process(function (events) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, connection, lastDisconnect, qr, shouldReconnect, up, _i, _b, msg, Msg, text, jid, cmd, _c, code, mediaMsg, stream, buffer, _d, stream_1, stream_1_1, chunk, e_1_1, stickerBuf, tmpIn, tmpOut, e_2;
                    var _e, e_1, _f, _g;
                    var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
                    return __generator(this, function (_3) {
                        switch (_3.label) {
                            case 0:
                                if (events['connection.update']) {
                                    _a = events['connection.update'], connection = _a.connection, lastDisconnect = _a.lastDisconnect, qr = _a.qr;
                                    if (qr)
                                        qrcode.generate(qr, { small: true });
                                    if (connection === 'close') {
                                        shouldReconnect = ((_j = (_h = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _h === void 0 ? void 0 : _h.output) === null || _j === void 0 ? void 0 : _j.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                                        if (shouldReconnect) {
                                            console.log('🔄 Reconectando...');
                                            App();
                                        }
                                        else {
                                            console.log('❌ Sessão encerrada (logged out).');
                                        }
                                    }
                                }
                                if (!events['creds.update']) return [3 /*break*/, 2];
                                return [4 /*yield*/, saveCreds()];
                            case 1:
                                _3.sent();
                                _3.label = 2;
                            case 2:
                                if (!events['messages.upsert']) return [3 /*break*/, 44];
                                up = events['messages.upsert'];
                                if (up.type !== 'notify')
                                    return [2 /*return*/];
                                _i = 0, _b = up.messages;
                                _3.label = 3;
                            case 3:
                                if (!(_i < _b.length)) return [3 /*break*/, 44];
                                msg = _b[_i];
                                Msg = msg.message;
                                text = (_z = (_v = (_r = (_p = (_m = (_k = Msg.conversation) !== null && _k !== void 0 ? _k : (_l = Msg.extendedTextMessage) === null || _l === void 0 ? void 0 : _l.text) !== null && _m !== void 0 ? _m : (_o = Msg.imageMessage) === null || _o === void 0 ? void 0 : _o.caption) !== null && _p !== void 0 ? _p : (_q = Msg.videoMessage) === null || _q === void 0 ? void 0 : _q.caption) !== null && _r !== void 0 ? _r : (_u = (_t = (_s = Msg.viewOnceMessage) === null || _s === void 0 ? void 0 : _s.message) === null || _t === void 0 ? void 0 : _t.imageMessage) === null || _u === void 0 ? void 0 : _u.caption) !== null && _v !== void 0 ? _v : (_y = (_x = (_w = Msg.viewOnceMessage) === null || _w === void 0 ? void 0 : _w.message) === null || _x === void 0 ? void 0 : _x.videoMessage) === null || _y === void 0 ? void 0 : _y.caption) !== null && _z !== void 0 ? _z : '';
                                jid = msg.key.remoteJid;
                                cmd = parseCommand(text);
                                if (!cmd)
                                    return [3 /*break*/, 43];
                                console.log('🟢 Comando:', cmd, '| jid:', jid);
                                _3.label = 4;
                            case 4:
                                _3.trys.push([4, 42, , 43]);
                                _c = cmd;
                                switch (_c) {
                                    case 'menu': return [3 /*break*/, 5];
                                    case 'open_group': return [3 /*break*/, 7];
                                    case 'close_group': return [3 /*break*/, 10];
                                    case 'allow_modify_group': return [3 /*break*/, 13];
                                    case 'block_modify_group': return [3 /*break*/, 15];
                                    case 'invite_group': return [3 /*break*/, 17];
                                    case 'sticker': return [3 /*break*/, 20];
                                }
                                return [3 /*break*/, 41];
                            case 5: return [4 /*yield*/, sendWithTypingQ(sock, jid, { text: '> Menu\n\n/Group\n/Help' }, { quoted: msg })];
                            case 6:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 7: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'not_announcement')];
                            case 8:
                                _3.sent();
                                return [4 /*yield*/, sendWithTyping(sock, jid, { text: '🔓 Grupo aberto! Todos podem conversar.' })];
                            case 9:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 10: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'announcement')];
                            case 11:
                                _3.sent();
                                return [4 /*yield*/, sendWithTyping(sock, jid, { text: '🔒 Grupo fechado! Apenas admins podem enviar.' })];
                            case 12:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 13: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'unlocked')];
                            case 14:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 15: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'locked')];
                            case 16:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 17: return [4 /*yield*/, sock.groupInviteCode(jid)];
                            case 18:
                                code = _3.sent();
                                return [4 /*yield*/, sendWithTyping(sock, jid, {
                                        text: "Follow this link to join my WhatsApp group: https://chat.whatsapp.com/".concat(code)
                                    })];
                            case 19:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 20:
                                mediaMsg = (_0 = Msg.imageMessage) !== null && _0 !== void 0 ? _0 : Msg.videoMessage;
                                if (!!mediaMsg) return [3 /*break*/, 22];
                                return [4 /*yield*/, sendWithTypingQ(sock, jid, { text: "❗ Envie uma imagem ou vídeo junto com o comando /sticker." }, { quoted: msg })];
                            case 21:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 22: return [4 /*yield*/, (0, baileys_2.downloadContentFromMessage)(mediaMsg, 'image')];
                            case 23:
                                stream = _3.sent();
                                buffer = Buffer.alloc(0);
                                _3.label = 24;
                            case 24:
                                _3.trys.push([24, 29, 30, 35]);
                                _d = true, stream_1 = (e_1 = void 0, __asyncValues(stream));
                                _3.label = 25;
                            case 25: return [4 /*yield*/, stream_1.next()];
                            case 26:
                                if (!(stream_1_1 = _3.sent(), _e = stream_1_1.done, !_e)) return [3 /*break*/, 28];
                                _g = stream_1_1.value;
                                _d = false;
                                chunk = _g;
                                buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
                                _3.label = 27;
                            case 27:
                                _d = true;
                                return [3 /*break*/, 25];
                            case 28: return [3 /*break*/, 35];
                            case 29:
                                e_1_1 = _3.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 35];
                            case 30:
                                _3.trys.push([30, , 33, 34]);
                                if (!(!_d && !_e && (_f = stream_1.return))) return [3 /*break*/, 32];
                                return [4 /*yield*/, _f.call(stream_1)];
                            case 31:
                                _3.sent();
                                _3.label = 32;
                            case 32: return [3 /*break*/, 34];
                            case 33:
                                if (e_1) throw e_1.error;
                                return [7 /*endfinally*/];
                            case 34: return [7 /*endfinally*/];
                            case 35:
                                stickerBuf = void 0;
                                if (!((_1 = mediaMsg.mimetype) === null || _1 === void 0 ? void 0 : _1.startsWith("image"))) return [3 /*break*/, 37];
                                return [4 /*yield*/, (0, sharp_1.default)(buffer)
                                        .resize(512, 512, { fit: "inside" })
                                        .webp()
                                        .toBuffer()];
                            case 36:
                                stickerBuf = _3.sent();
                                return [3 /*break*/, 38];
                            case 37:
                                if ((_2 = mediaMsg.mimetype) === null || _2 === void 0 ? void 0 : _2.startsWith("video")) {
                                    tmpIn = "/tmp/tmp_input.mp4";
                                    tmpOut = "/tmp/tmp_output.webp";
                                    fs_1.default.writeFileSync(tmpIn, buffer);
                                    (0, child_process_1.execSync)("ffmpeg -y -i ".concat(tmpIn, " -vf \"scale=512:512:force_original_aspect_ratio=decrease\" -vcodec libwebp -lossless 1 -preset picture -loop 0 -an -vsync 0 -s 512:512 ").concat(tmpOut));
                                    stickerBuf = fs_1.default.readFileSync(tmpOut);
                                    fs_1.default.unlinkSync(tmpIn);
                                    fs_1.default.unlinkSync(tmpOut);
                                }
                                else {
                                    stickerBuf = buffer;
                                }
                                _3.label = 38;
                            case 38: return [4 /*yield*/, sock.sendMessage(jid, { sticker: stickerBuf }, { quoted: msg })];
                            case 39:
                                _3.sent();
                                return [4 /*yield*/, sendWithTypingQ(sock, jid, { text: "✅ Figurinha enviada!" }, { quoted: msg })];
                            case 40:
                                _3.sent();
                                return [3 /*break*/, 41];
                            case 41: return [3 /*break*/, 43];
                            case 42:
                                e_2 = _3.sent();
                                console.error('❗ Erro:', e_2);
                                return [3 /*break*/, 43];
                            case 43:
                                _i++;
                                return [3 /*break*/, 3];
                            case 44: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/, sock];
        }
    });
}); };
/********************************************************************
 *  PLACEHOLDER GET MESSAGE
 ********************************************************************/
function getMessage(_) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, baileys_1.proto.Message.create({ conversation: '' })];
        });
    });
}
/********************************************************************
 *  INICIA
 ********************************************************************/
App().catch(console.error);
