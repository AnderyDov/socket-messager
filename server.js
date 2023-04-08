const express = require('express'); // экспрес сервер
const http = require('http'); // http nodejs сервер
const { Server } = require('socket.io'); // класс сервер из библиотеки sovket.io
const Moniker = require('moniker'); // библиотека для созлания рандомных никнэймов

const app = express(); // создаётся экземпляр экспресс сервера
const server = http.createServer(app); // в http сервер передаётся экспресс сервер
const io = new Server(server); // создаётся экземпляр класса Server который принимет в параметр http сервер
const PORT = process.env.PORT || 3000; // переменная порт

// из корня отдаётся файл index.html, главная страница
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

// по этому пути искать статику
app.use(express.static('./client'));

// io прослушивает дефолтное событие при подключении - "connect", вторым параметром принимает коллбэк с аргументом объект socket
io.on('connection', (socket) => {
    // создается рандомный ник и он становится новым свойством объекта socket
    socket.username = Moniker.choose();
    // socket испускает событие "set username" с сообщением
    socket.emit('set username', `${socket.username} теперь это ваше имя`);

    // socket испускает событие "user join" в режиме broadcast, с сообщением
    socket.broadcast.emit(
        'user join',
        `${socket.username} присоеденился к чату`,
    );

    // socket прослушивает событие "chat message", вторым параметром принимает коллбэк с параметром msg прилитевшем с клиента
    socket.on('chat message', (msg) => {
        // в коллбэке io  испускает событие "chat message" с прилитевшем сообщением
        io.emit('chat message', msg);
    });
});

// сервер слушает порт
server.listen(PORT, () => {
    console.log('http://localhost:3000');
});
