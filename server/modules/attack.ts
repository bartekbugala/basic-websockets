import sanitizeHtml from 'sanitize-html';

export class AttackModule {
  static init(io: any, sharedState: any) {
    const { users } = sharedState;

    io.on('connection', (socket: any) => {
      socket.on('attack', (attack: any) => {
        attack.text = sanitizeHtml(attack.text);
        attack.id = sanitizeHtml(attack.id);
        const victim = users.get(attack.text);
        const attacker = users.get(attack.id);

        if (victim.health <= 0) {
          users.set(attack.text, {
            ...victim,
            name: `☠️ remains`,
          });
        }

        if (victim.health > 0) {
          const effect = victim.health - attacker.attack;
          users.set(attack.text, {
            ...victim,
            health: effect,
            name: effect <= 0 ? `☠️ remains` : victim.name,
          });
        }

        const usersObj = Object.fromEntries(users);
        io.emit('users', JSON.stringify(usersObj));
      });
    });
  }
}

export default AttackModule;
