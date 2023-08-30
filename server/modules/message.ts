import sanitizeHtml from 'sanitize-html';

export class MessageModule {
  static init(io: any, sharedState: any) {
    const { users } = sharedState;
    io.on('connection', (socket: any) => {
      socket.on('message', (message: any) => {
        message.text = sanitizeHtml(message.text);
        message.id = sanitizeHtml(message.id);
        message.username = sanitizeHtml(users.get(`${socket.id}`).name);
        io.emit('message', message);
      });
      // ...
    });
  }
  // ...
}

export default MessageModule;
