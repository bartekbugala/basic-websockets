const express = require('express');
const { createServer } = require('http');
const sanitizeHtml = require('sanitize-html');
const socketIo = require('socket.io');
// init express
const port = 8080;
const app = express();

// start http server
const server = createServer(app);

const clientPath = `${__dirname}/../app`;

// SERVE STATIC CLIENT
app.use(express.static(clientPath));
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const users = new Map();

const { getRandomInt, createPlayerObject } = require('./modules/utils.js');

let state;
io.on('connection', (socket) => {
  users.set(
    `${socket.id}`,
    createPlayerObject(`Anonymous-${getRandomInt(0, 9999)}`)
  );

  io.fetchSockets()
    .then((sockets) => {
      io.emit('users', JSON.stringify(Object.fromEntries(users)));
    })
    .catch(console.log);

  socket.on('message', (message) => {
    message.text = sanitizeHtml(message.text);
    message.id = sanitizeHtml(message.id);
    message.username = sanitizeHtml(users.get(`${socket.id}`).name);
    io.emit('message', message);
  });

  socket.on('name', (name) => {
    const userObj = {
      ...users.get(socket.id),
      name: `${name.text}`,
    };
    users.set(`${socket.id}`, userObj);
    const usersObj = Object.fromEntries(users);
    io.emit('users', JSON.stringify(usersObj));
  });

  socket.on('disconnect', (message) => {
    io.emit('message', {
      ...message,
      text: `${users.get(socket.id).name} left the room`,
      username: 'Chat',
    });
    users.delete(socket.id);
    io.emit('users', JSON.stringify(Object.fromEntries(users)));
  });

  socket.on('attack', (attack) => {
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

// Listener for errors
server.on('error', (err) => {
  /* console.error('Server error:', err); */
});

server.listen(port, () => console.log(`RPS started on port: ${port}`));
