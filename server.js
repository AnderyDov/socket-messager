const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { v4 } = require('uuid');

const users = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static('./client'));

io.on('connection', (socket) => {
    socket.on('registration', (msg) => {
        // console.log(msg);
        const token = v4();
        users[token] = msg;
        io.emit('registration', `${msg}TOKEN${token}`);
    });
    socket.on('chat message', (msg) => {
        // console.log(socket.id, msg);
        console.log(msg);
        console.log(users);
        io.emit(
            'chat message',
            `${users[msg.split('TOKEN')[0]]}TOKEN${msg.split('TOKEN')[1]}`,
        );
    });
});

server.listen(3000, () => {
    console.log('http://localhost:3000');
});
