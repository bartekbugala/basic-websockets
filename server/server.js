const http = require('http');
const express = require('express');
const sanitizeHtml = require('sanitize-html');
// init express
const app = express();
const port = 8080;
// start http server
const server = http.createServer(app);

const clientPath = `${__dirname}/../app`;

// SERVE STATIC CLIENT
app.use(express.static(clientPath));
// userNames
const userNames = new Map();

const io = require('socket.io')(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

let state;
io.on('connection', (socket) => {
  userNames.set(`${socket.id}`, `User-${getRandomInt(0, 9999)}`);
  io.fetchSockets()
    .then((sockets) => {
      io.emit('users', JSON.stringify(Object.fromEntries(userNames)));
    })
    .catch(console.log);

  socket.on('message', (message) => {
    message.text = sanitizeHtml(message.text);
    message.id = sanitizeHtml(message.id);
    message.username = sanitizeHtml(userNames.get(`${socket.id}`));
    io.emit('message', message);
  });
  socket.on('name', (name) => {
    userNames.set(`${socket.id}`, `${name.text}`);
    const usersObj = Object.fromEntries(userNames);
    io.emit('users', JSON.stringify(usersObj));
    console.log(name.text, userNames.entries);
  });

  socket.on('disconnect', (message) => {
    io.emit('message', {
      ...message,
      text: `${userNames.get(socket.id)} left the room`,
      username: 'Chat',
    });
    userNames.delete(socket.id);
    io.emit('users', JSON.stringify(Object.fromEntries(userNames)));
  });
});

// Listener for errors
server.on('error', (err) => {
  /* console.error('Server error:', err); */
});

server.listen(port, () => console.log(`RPS started on port: ${port}`));
