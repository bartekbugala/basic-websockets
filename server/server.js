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
const users = new Map();

const io = require('socket.io')(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const createPlayerObject = (name) => {
  return {
    name,
    health: 100,
    attack: 10,
    defence: 10,
  };
};

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
    console.log('attack', attack);
    // attack.text = sanitizeHtml(attack.text);
    // attack.id = sanitizeHtml(attack.id);
    // const attacked = users.get(attack.text);
    // const attacker = users.get(attack.id);
    // users.set(attack.text, {
    //   ...attacked,
    //   health: attacked.health - attacker.attack,
    // });
  });
});

// Listener for errors
server.on('error', (err) => {
  /* console.error('Server error:', err); */
});

server.listen(port, () => console.log(`RPS started on port: ${port}`));
