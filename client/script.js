document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const username = document.getElementById('username');
    const messageForm = document.getElementById('messageForm');
    const inputMessage = document.getElementById('inputMessage');
    const messages = document.getElementById('messages');

    function addMessage(msg) {
        const item = document.createElement('li');

        item.innerHTML = msg;
        messages.appendChild(item);
        messages.scrollTo(0, messages.scrollHeight);
    }

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputMessage.value) {
            socket.emit('chat message', inputMessage.value);
            inputMessage.value = '';
        }
    });

    socket.on('set username', (msg) => {
        addMessage(msg);
        username.innerHTML = msg;
    });

    socket.on('user join', addMessage);

    socket.on('chat message', addMessage);
});
