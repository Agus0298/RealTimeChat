const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let connectedUsers = {}; // Almacena socketId y nombre de usuario

// Sirve el archivo HTML del cliente
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado:', socket.id);

    // Escucha cuando un usuario envía su nombre
    socket.on('set username', (username) => {
        connectedUsers[socket.id] = username;
        console.log(`Usuario registrado: ${username}`);
        io.emit('user list', Object.values(connectedUsers)); // Enviar lista actualizada
    });

    // Escucha mensajes enviados por el cliente
    socket.on('chat message', (msg) => {
        const username = connectedUsers[socket.id] || 'Anónimo';
        io.emit('chat message', `${username}: ${msg}`);
    });

    // Manejo de desconexión
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado:', socket.id);
        delete connectedUsers[socket.id];
        io.emit('user list', Object.values(connectedUsers)); // Actualizar lista
    });
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
