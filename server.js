const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Moniker = require('moniker');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static('./client'));

io.on('connection', (socket) => {
    socket.username = Moniker.choose();
    socket.emit('set username', socket.username);

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(PORT, () => {
    console.log('http://localhost:3000');
});
