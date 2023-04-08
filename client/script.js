// Когда HTML был загружен ипройден парсером, срабатывает функция
document.addEventListener('DOMContentLoaded', () => {
    // Создаётся сокет, не указывается никакого URL-адреса при вызове io(), так как по умолчанию он пытается подключиться к хосту, который обслуживает страницу
    const socket = io();

    // Переменные для обращения с дом элементами
    const username = document.getElementById('username');
    const messageForm = document.getElementById('messageForm');
    const inputMessage = document.getElementById('inputMessage');
    const messages = document.getElementById('messages');

    // Функция доюавления сообщения на страницу, при добавлении сообщения блок с сообщениями прокручивается до самого нзу
    function addMessage(msg) {
        const item = document.createElement('li');

        item.innerHTML = msg;
        messages.appendChild(item);
        messages.scrollTo(0, messages.scrollHeight);
    }

    // Сокет прослушивает событие "set username", вызывает функцию addMessage аргументом msg, это сообщение пришедшее с сервера, также это сообщение прописывается в блок с именем
    socket.on('set username', (msg) => {
        addMessage(msg);
        username.innerHTML = msg.split(' теперь это ваше имя')[0];
    });

    // при отправек формы, запрещается дефолтное поведение, и при существовании текста в текстовом поле socket испускает событие "chat message" c сообщением тексом из текстового поля
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputMessage.value) {
            socket.emit('chat message', inputMessage.value);
            inputMessage.value = '';
        }
    });

    // socket прослушивает событие "user join", и вызывает функцию addMessage которой в аргумент попадает сообщение с сервера
    socket.on('user join', addMessage);

    // socket прослушивает событие "chat message", и вызывает функцию addMessage которой в аргумент попадает сообщение с сервера
    socket.on('chat message', addMessage);
});
