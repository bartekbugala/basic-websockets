{
  // Scoped code
  const port = 8080;
  const socket = io();
  let myId;

  // client-side
  socket.on('connect', () => {
    if (myId) return;
    myId = socket.id;
  });

  socket.on('message', (msg) => {
    const el = document.createElement('li');
    el.innerHTML = `${
      myId == msg.id ? `${msg.username}(You): ` : msg.username + ': '
    } ${msg.text}`;
    const container = document.querySelector('#chat-ul');
    container.insertBefore(el, container.firstChild);
  });

  socket.on('users', (users) => {
    const nameUl = document.querySelector('#name-ul');
    const usrsObj = JSON.parse(users);
    const usrKeys = Object.keys(usrsObj);
    nameUl.innerHTML = '';
    usrKeys.forEach((usr) => {
      const li = document.createElement('li');
      li.innerHTML = `${usrsObj?.[usr]}`;
      nameUl.appendChild(li);
    });
  });

  document.getElementById('chat-button').onclick = () => {
    emitInputText();
  };
  document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return;
    emitInputText();
  });
  document.getElementById('name-button').onclick = () => {
    const self = this;
    emitName();
    document.getElementById('name-button').removeEventListener('click', self);
    document.getElementById('name-row').remove();
  };

  function emitInputText() {
    const inputField = document.querySelector('#chat-input');
    const text = inputField.value;
    if (text.length === 0) return;
    socket.emit('message', { text: text, id: myId });
    inputField.value = '';
  }

  function emitName() {
    const inputField = document.querySelector('#name-input');
    const text = inputField.value;
    if (text.length === 0) return;
    socket.emit('name', { text: text, id: myId });
    inputField.value = '';
  }

  function cleanInput() {}
}
