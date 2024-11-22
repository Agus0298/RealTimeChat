const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Ruta principal
app.get('/', (req, res) => {
    res.send("Servidor de chat en tiempo real con WebSockets");
});

// Evento de conexión
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    // Unirse a una sala
    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        console.log(`Usuario se unió a la sala: ${roomName}`);
        socket.emit('message', `Te has unido a la sala: ${roomName}`);
    });

    // Enviar un mensaje a la sala
    socket.on('chatMessage', (msg, roomName) => {
        io.to(roomName).emit('message', msg);  // Se emite el mensaje solo a la sala
    });

    // Salir de la sala
    socket.on('leaveRoom', (roomName) => {
        socket.leave(roomName);
        console.log(`Usuario salió de la sala: ${roomName}`);
    });

    // Cuando un usuario se desconecta
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
