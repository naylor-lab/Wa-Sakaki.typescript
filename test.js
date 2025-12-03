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
            case 0: return [4 /*yield*/, (0, baileys_1.useMultiFileAuthState)('baileys_auth_info')];
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
                    var _a, connection, lastDisconnect, qr, shouldReconnect, up, _i, _b, msg, text, jid, cmd, _c, code, mediaMsg, stream, buffer, _d, stream_1, stream_1_1, chunk, e_1_1, stickerBuf, tmpIn, tmpOut, e_2;
                    var _e, e_1, _f, _g;
                    var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
                    return __generator(this, function (_1) {
                        switch (_1.label) {
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
                                _1.sent();
                                _1.label = 2;
                            case 2:
                                if (!events['messages.upsert']) return [3 /*break*/, 46];
                                up = events['messages.upsert'];
                                if (up.type !== 'notify')
                                    return [2 /*return*/];
                                _i = 0, _b = up.messages;
                                _1.label = 3;
                            case 3:
                                if (!(_i < _b.length)) return [3 /*break*/, 46];
                                msg = _b[_i];
                                text = (_v = (_s = (_p = (_l = (_k = msg.message) === null || _k === void 0 ? void 0 : _k.conversation) !== null && _l !== void 0 ? _l : (_o = (_m = msg.message) === null || _m === void 0 ? void 0 : _m.extendedTextMessage) === null || _o === void 0 ? void 0 : _o.text) !== null && _p !== void 0 ? _p : (_r = (_q = msg.message) === null || _q === void 0 ? void 0 : _q.imageMessage) === null || _r === void 0 ? void 0 : _r.caption) !== null && _s !== void 0 ? _s : (_u = (_t = msg.message) === null || _t === void 0 ? void 0 : _t.videoMessage) === null || _u === void 0 ? void 0 : _u.caption) !== null && _v !== void 0 ? _v : '';
                                jid = msg.key.remoteJid;
                                cmd = parseCommand(text);
                                if (!cmd)
                                    return [3 /*break*/, 45];
                                console.log('🟢 Comando:', cmd, '| jid:', jid);
                                _1.label = 4;
                            case 4:
                                _1.trys.push([4, 44, , 45]);
                                _c = cmd;
                                switch (_c) {
                                    case 'open_group': return [3 /*break*/, 5];
                                    case 'close_group': return [3 /*break*/, 8];
                                    case 'menu': return [3 /*break*/, 11];
                                    case 'group': return [3 /*break*/, 13];
                                    case 'allow_modify_group': return [3 /*break*/, 15];
                                    case 'block_modify_group': return [3 /*break*/, 17];
                                    case 'invite_group': return [3 /*break*/, 19];
                                    case 'sticker': return [3 /*break*/, 22];
                                }
                                return [3 /*break*/, 43];
                            case 5: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'not_announcement')];
                            case 6:
                                _1.sent();
                                return [4 /*yield*/, sendWithTyping(sock, jid, { text: '🔓 Grupo aberto! Todos podem conversar.' })];
                            case 7:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 8: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'announcement')];
                            case 9:
                                _1.sent();
                                return [4 /*yield*/, sendWithTyping(sock, jid, { text: '🔒 Grupo fechado! Apenas admins podem enviar.' })];
                            case 10:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 11: return [4 /*yield*/, sendWithTypingQ(sock, jid, { text: '> Menu\n\n/Group\n/Help' }, { quoted: msg })];
                            case 12:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 13: return [4 /*yield*/, sendWithTypingQ(sock, jid, {
                                    text: '> Options:\n\n/open_group\n/close_group\n/allow_modify_group\n/block_modify_group\n/invite_group'
                                }, { quoted: msg })];
                            case 14:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 15: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'unlocked')];
                            case 16:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 17: return [4 /*yield*/, sock.groupSettingUpdate(jid, 'locked')];
                            case 18:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 19: return [4 /*yield*/, sock.groupInviteCode(jid)];
                            case 20:
                                code = _1.sent();
                                return [4 /*yield*/, sendWithTyping(sock, jid, {
                                        text: "Follow this link to join my WhatsApp group: https://chat.whatsapp.com/".concat(code)
                                    })];
                            case 21:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 22:
                                mediaMsg = (_x = (_w = msg.message) === null || _w === void 0 ? void 0 : _w.imageMessage) !== null && _x !== void 0 ? _x : (_y = msg.message) === null || _y === void 0 ? void 0 : _y.videoMessage;
                                if (!!mediaMsg) return [3 /*break*/, 24];
                                return [4 /*yield*/, sendWithTypingQ(sock, jid, { text: "❗ Envie uma imagem ou vídeo junto com o comando /sticker." }, { quoted: msg })];
                            case 23:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 24: return [4 /*yield*/, (0, baileys_2.downloadContentFromMessage)(mediaMsg, 'image')];
                            case 25:
                                stream = _1.sent();
                                buffer = Buffer.alloc(0);
                                _1.label = 26;
                            case 26:
                                _1.trys.push([26, 31, 32, 37]);
                                _d = true, stream_1 = (e_1 = void 0, __asyncValues(stream));
                                _1.label = 27;
                            case 27: return [4 /*yield*/, stream_1.next()];
                            case 28:
                                if (!(stream_1_1 = _1.sent(), _e = stream_1_1.done, !_e)) return [3 /*break*/, 30];
                                _g = stream_1_1.value;
                                _d = false;
                                chunk = _g;
                                buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
                                _1.label = 29;
                            case 29:
                                _d = true;
                                return [3 /*break*/, 27];
                            case 30: return [3 /*break*/, 37];
                            case 31:
                                e_1_1 = _1.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 37];
                            case 32:
                                _1.trys.push([32, , 35, 36]);
                                if (!(!_d && !_e && (_f = stream_1.return))) return [3 /*break*/, 34];
                                return [4 /*yield*/, _f.call(stream_1)];
                            case 33:
                                _1.sent();
                                _1.label = 34;
                            case 34: return [3 /*break*/, 36];
                            case 35:
                                if (e_1) throw e_1.error;
                                return [7 /*endfinally*/];
                            case 36: return [7 /*endfinally*/];
                            case 37:
                                stickerBuf = void 0;
                                if (!((_z = mediaMsg.mimetype) === null || _z === void 0 ? void 0 : _z.startsWith("image"))) return [3 /*break*/, 39];
                                return [4 /*yield*/, (0, sharp_1.default)(buffer)
                                        .resize(512, 512, { fit: "inside" })
                                        .webp()
                                        .toBuffer()];
                            case 38:
                                stickerBuf = _1.sent();
                                return [3 /*break*/, 40];
                            case 39:
                                if ((_0 = mediaMsg.mimetype) === null || _0 === void 0 ? void 0 : _0.startsWith("video")) {
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
                                _1.label = 40;
                            case 40: return [4 /*yield*/, sock.sendMessage(jid, { sticker: stickerBuf }, { quoted: msg })];
                            case 41:
                                _1.sent();
                                return [4 /*yield*/, sendWithTypingQ(sock, jid, { text: "✅ Figurinha enviada!" }, { quoted: msg })];
                            case 42:
                                _1.sent();
                                return [3 /*break*/, 43];
                            case 43: return [3 /*break*/, 45];
                            case 44:
                                e_2 = _1.sent();
                                console.error('❗ Erro:', e_2);
                                return [3 /*break*/, 45];
                            case 45:
                                _i++;
                                return [3 /*break*/, 3];
                            case 46: return [2 /*return*/];
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
