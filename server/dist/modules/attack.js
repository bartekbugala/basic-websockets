"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackModule = void 0;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
class AttackModule {
    static init(io, sharedState) {
        const { users } = sharedState;
        io.on('connection', (socket) => {
            socket.on('attack', (attack) => {
                attack.text = (0, sanitize_html_1.default)(attack.text);
                attack.id = (0, sanitize_html_1.default)(attack.id);
                const victim = users.get(attack.text);
                const attacker = users.get(attack.id);
                if (victim.health <= 0) {
                    users.set(attack.text, Object.assign(Object.assign({}, victim), { name: `☠️ remains` }));
                }
                if (victim.health > 0) {
                    const effect = victim.health - attacker.attack;
                    users.set(attack.text, Object.assign(Object.assign({}, victim), { health: effect, name: effect <= 0 ? `☠️ remains` : victim.name }));
                }
                const usersObj = Object.fromEntries(users);
                io.emit('users', JSON.stringify(usersObj));
            });
        });
    }
}
exports.AttackModule = AttackModule;
exports.default = AttackModule;
