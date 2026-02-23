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

    // NEW: Join Private Room
    socket.on('joinRoom', (password) => {
        socket.join(password);
        socket.room = password;
        console.log(`An artist securely joined room: ${password}`);
    });

    // Helper function to ONLY broadcast to the specific private room
    const broadcastToRoom = (event, data) => {
        if (socket.room) socket.to(socket.room).emit(event, data);
    };

    // Existing drawing events now locked to the room!
    socket.on('drawing', (data) => broadcastToRoom('drawing', data));
    socket.on('stamp', (data) => broadcastToRoom('stamp', data));
    socket.on('text', (data) => broadcastToRoom('text', data));
    socket.on('image', (data) => broadcastToRoom('image', data));
    socket.on('clear', () => broadcastToRoom('clear'));
    socket.on('bgColor', (color) => broadcastToRoom('bgColor', color));
    socket.on('pointer', (data) => broadcastToRoom('pointer', data));
    socket.on('undo', () => broadcastToRoom('undo'));
    socket.on('shape', (data) => broadcastToRoom('shape', data));
    socket.on('fill', (data) => broadcastToRoom('fill', data));
    socket.on('template', (data) => broadcastToRoom('template', data));

    // NEW: Broadcast Chat and Sticky Notes securely
    socket.on('chat', (msg) => broadcastToRoom('chat', msg));
    socket.on('newNote', (data) => broadcastToRoom('newNote', data));
    socket.on('moveNote', (data) => broadcastToRoom('moveNote', data));

    socket.on('disconnect', () => console.log('An artist disconnected:', socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
