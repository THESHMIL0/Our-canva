// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A new artist connected:', socket.id);

    socket.on('joinRoom', (data) => {
        socket.join(data.roomCode);
        socket.room = data.roomCode; 
        socket.username = data.username || "Artist";
    });

    const broadcast = (event, data) => { if (socket.room) socket.to(socket.room).emit(event, data); };

    socket.on('chatMessage', (data) => broadcast('chatMessage', { text: data.text, sender: socket.username }));
    socket.on('drawing', (data) => broadcast('drawing', data));
    socket.on('fill', (data) => broadcast('fill', data));
    socket.on('stamp', (data) => broadcast('stamp', data));
    socket.on('clear', () => broadcast('clear'));
    socket.on('bgColor', (color) => broadcast('bgColor', color));
    socket.on('pointer', (data) => broadcast('pointer', data));
    socket.on('undo', () => broadcast('undo'));
    socket.on('shape', (data) => broadcast('shape', data));
    socket.on('template', (data) => broadcast('template', data));
    socket.on('bgPattern', (pattern) => broadcast('bgPattern', pattern));
    socket.on('loveBomb', () => broadcast('loveBomb'));
    socket.on('pingRadar', (data) => broadcast('pingRadar', data));
    socket.on('foil', () => broadcast('foil'));
    socket.on('scratch', (data) => broadcast('scratch', data));

    // Object Engine Events
    socket.on('addObj', (data) => broadcast('addObj', data));
    socket.on('moveObj', (data) => broadcast('moveObj', data));
    socket.on('scaleObj', (data) => broadcast('scaleObj', data)); // NEW: Resizing!
    socket.on('deleteObj', (id) => broadcast('deleteObj', id));

    socket.on('disconnect', () => console.log('An artist disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
