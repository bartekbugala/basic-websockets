"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const database_1 = __importDefault(require("./modules/database"));
const user_1 = __importDefault(require("./modules/user"));
const message_1 = __importDefault(require("./modules/message"));
const attack_1 = __importDefault(require("./modules/attack"));
const constants_js_1 = require("./constants.js");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
});
app.use(express_1.default.static(constants_js_1.CLIENT_PATH));
server.listen(constants_js_1.PORT, () => console.log(`RPS started on port: ${constants_js_1.PORT}`));
database_1.default.init(constants_js_1.DATABASE);
const sharedState = {
    users: new Map(), // Adjust the type accordingly
};
user_1.default.init(io, sharedState);
message_1.default.init(io, sharedState);
attack_1.default.init(io, sharedState);
