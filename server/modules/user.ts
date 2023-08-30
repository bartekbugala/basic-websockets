import { getRandomInt, createPlayerObject } from './utils';

export class UserModule {
  static init(io: any, sharedState: any) {
    const { users } = sharedState;
    io.on('connection', (socket: any) => {
      users.set(
        `${socket.id}`,
        createPlayerObject(`Anonymous-${getRandomInt(0, 9999)}`)
      );

      io.fetchSockets()
        .then((sockets: any) => {
          io.emit('users', JSON.stringify(Object.fromEntries(users)));
        })
        .catch(console.log);

      socket.on('name', (name: any) => {
        const userObj = {
          ...users.get(socket.id),
          name: `${name.text}`,
        };
        users.set(`${socket.id}`, userObj);
        const usersObj = Object.fromEntries(users);
        io.emit('users', JSON.stringify(usersObj));
      });

      socket.on('disconnect', (message: any) => {
        io.emit('message', {
          ...message,
          text: `${users.get(socket.id).name} left the room`,
          username: 'Chat',
        });
        users.delete(socket.id);
        io.emit('users', JSON.stringify(Object.fromEntries(users)));
      });
    });
  }
}

export default UserModule;
