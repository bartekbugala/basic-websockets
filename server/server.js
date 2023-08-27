const http = require('http');
const express = require('express');
const sanitizeHtml = require('sanitize-html');

const app = express();
const port = 8080;

const server = http.createServer(app);

const clientPath = `${__dirname}/../app`;

// SERVE STATIC CLIENT
app.use(express.static(clientPath));
const userNames = new Map();

const io = require('socket.io')(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});
let strMem = '';
io.on('connection', (socket) => {
  userNames.set(`${socket.id}`, `User-${userNames.size}`);
  io.fetchSockets()
    .then((sockets) => {
      const socketsArray = [];
      sockets.forEach((socket) => {
        socketsArray.push(sanitizeHtml(userNames.get(`${socket.id}`)));
      });
      io.emit('users', socketsArray);
    })
    .catch(console.log);

  io.emit('message', { username: 'PYTANIE', text: 'Ile to jest 2+2' });
  socket.on('message', (message) => {
    message.text = sanitizeHtml(message.text);
    if (message.text === '4') {
      message.text = 'Świetnie prosiaku to jest 4';
    }
    if (message.text === 'A') {
      strMem += message.text;
      message.text = strMem + ' ' + strMem.length;
    }
    message.id = sanitizeHtml(message.id);
    message.username = sanitizeHtml(userNames.get(`${socket.id}`));
    io.emit('message', message);
  });
});

// Listener for errors
server.on('error', (err) => {
  /* console.error('Server error:', err); */
});

server.listen(port, () => console.log(`RPS started on port: ${port}`));
