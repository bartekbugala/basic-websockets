const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req,res)=>{
  res.send('Socket.IO')
})

const httpServer = require('http').createServer(app);

const io = require('socket.io')(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
  });
});

httpServer.listen(port, () => console.log(`Listening on port: ${port}`));
