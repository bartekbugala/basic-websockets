"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const utils_1 = require("./utils");
class UserModule {
    static init(io, sharedState) {
        const { users } = sharedState;
        io.on('connection', (socket) => {
            users.set(`${socket.id}`, (0, utils_1.createPlayerObject)(`Anonymous-${(0, utils_1.getRandomInt)(0, 9999)}`));
            io.fetchSockets()
                .then((sockets) => {
                io.emit('users', JSON.stringify(Object.fromEntries(users)));
            })
                .catch(console.log);
            socket.on('name', (name) => {
                const userObj = Object.assign(Object.assign({}, users.get(socket.id)), { name: `${name.text}` });
                users.set(`${socket.id}`, userObj);
                const usersObj = Object.fromEntries(users);
                io.emit('users', JSON.stringify(usersObj));
            });
            socket.on('disconnect', (message) => {
                io.emit('message', Object.assign(Object.assign({}, message), { text: `${users.get(socket.id).name} left the room`, username: 'Chat' }));
                users.delete(socket.id);
                io.emit('users', JSON.stringify(Object.fromEntries(users)));
            });
        });
    }
}
exports.UserModule = UserModule;
exports.default = UserModule;
