{
  const initName = sessionStorage.getItem('chatName') ?? null;

  // Scoped code
  const port = 8080;
  const socket = io();
  let myId;

  // client-side
  socket.on('connect', () => {
    if (myId) return;
    if (initName) {
      socket.emit('name', { text: initName, id: myId });
    }
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
    const usersObj = JSON.parse(users);
    const userKeys = Object.keys(usersObj);
    nameUl.innerHTML = '';
    userKeys.forEach((userKey) => {
      const li = document.createElement('li');
      li.innerHTML = `${usersObj?.[userKey].name}: `;
      const attributes = document.createElement('div');
      const health = document.createElement('div');
      const attack = document.createElement('div');
      const defence = document.createElement('div');
      health.innerHTML = `❤️${usersObj?.[userKey].health}`;
      attack.innerHTML = `⚔️${usersObj?.[userKey].attack}`;
      defence.innerHTML = `🛡️${usersObj?.[userKey].defence}`;
      attributes.appendChild(health).classList.add('attribute', 'health');
      attributes.appendChild(attack).classList.add('attribute', 'attack');
      attributes.appendChild(defence).classList.add('attribute', 'defence');
      li.appendChild(attributes);
      li.id = userKey;
      li.addEventListener('click', (e) => {
        const id = `${e.currentTarget.id}`;
        if (id === socket.id) return;
        socket.emit('attack', { text: id, id: socket.id });
      });
      nameUl.appendChild(li).classList.add('user');
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
    sessionStorage.setItem('chatName', text);
    socket.emit('name', { text: text, id: myId });

    inputField.value = '';
  }

  function cleanInput() {}
}
