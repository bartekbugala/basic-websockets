"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
class MessageModule {
    static init(io, sharedState) {
        const { users } = sharedState;
        io.on('connection', (socket) => {
            socket.on('message', (message) => {
                message.text = (0, sanitize_html_1.default)(message.text);
                message.id = (0, sanitize_html_1.default)(message.id);
                message.username = (0, sanitize_html_1.default)(users.get(`${socket.id}`).name);
                io.emit('message', message);
            });
            // ...
        });
    }
}
exports.MessageModule = MessageModule;
exports.default = MessageModule;
