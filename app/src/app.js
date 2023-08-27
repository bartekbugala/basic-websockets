{
  // Scoped code
  const port = 8080;
  const socket = io();
  console.log('socket', socket)
  let myId;

  // client-side
  socket.on('connect', () => {
    if (myId) return;
    myId = socket.id;
  });

  socket.on('message', (msg) => {
    const el = document.createElement('li');
    el.innerHTML = `${myId == msg.id ? 'You: ' : msg.username + ': '} ${
      msg.text
    }`;
    document.querySelector('ul').appendChild(el);
  });

  /* 
    socket.on('users',(users)=>{
    users.forEach(el => {
      const li = document.createElement('li');
      li.innerHTML = `${el}`
      document.querySelector('ul').appendChild(li);
    });
    
    )
  */
  socket.on('users', (users) => {
    console.log('usrs', users);
    let usersString = 'Users: ';
    users.forEach((element) => {
      usersString += element + ', ';
    });
    const li = document.createElement('li');
    li.innerHTML = `${usersString}`;
    document.querySelector('ul').appendChild(li);
  });

  document.querySelector('#chat-button').onclick = () => {
    emitInputText();
  };
  document.querySelector('#chat-input').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return;
    emitInputText();
  });

  function emitInputText() {
    const inputField = document.querySelector('#chat-input');
    const text = inputField.value;
    if (text.length === 0) return;
    socket.emit('message', { text: text, id: myId });
    inputField.value = '';
  }

  function cleanInput() {}
}
