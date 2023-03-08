document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const cookiesArray = document.cookie.split(';');
    // console.log(cookiesArray);

    const username = document.getElementById('username');
    const messageForm = document.getElementById('messageForm');
    const inputMessage = document.getElementById('inputMessage');
    const messages = document.getElementById('messages');

    let token = null;

    if (
        cookiesArray.filter((item) => item.trim().startsWith('USERNAME='))
            .length
    ) {
        cookiesArray.forEach((el) => {
            if (el.split('=')[0].trim() === 'USERNAME') {
                username.innerText = el.split('=')[1].trim().split('TOKEN')[0];
                token = el.split('=')[1].trim().split('TOKEN')[1];
            }
        });
        console.log('The cookie "USERNAME" exists');
    } else {
        let newName = prompt('Введите ваше имя', 'BARBARIS');
        console.log(newName);
        if (!newName || newName === '') {
            newName = 'BARBARIS';
        }

        username.innerText = newName;
        document.cookie = `USERNAME=${newName}`;
        socket.emit('registration', newName);

        socket.on('registration', (msg) => {
            document.cookie = `USERNAME=${msg}`;
            token = msg.split('TOKEN')[1];
        });
        console.log('The cookie "USERNAME" not found');
    }

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputMessage.value) {
            socket.emit('chat message', `${token}TOKEN${inputMessage.value}`);
            inputMessage.value = '';
        }
    });

    socket.on('chat message', (msg) => {
        const item = document.createElement('li');

        item.innerHTML = `${msg.split('TOKEN')[0]}\n${msg.split('TOKEN')[1]}`;
        messages.appendChild(item);
        messages.scrollTo(0, messages.scrollHeight);
    });
});
