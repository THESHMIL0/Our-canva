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

    // Existing tools
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
    socket.on('stamp', (data) => socket.broadcast.emit('stamp', data));
    socket.on('text', (data) => socket.broadcast.emit('text', data));
    socket.on('image', (data) => socket.broadcast.emit('image', data));
    socket.on('clear', () => socket.broadcast.emit('clear'));
    socket.on('bgColor', (color) => socket.broadcast.emit('bgColor', color));
    socket.on('pointer', (data) => socket.broadcast.emit('pointer', data));
    socket.on('undo', () => socket.broadcast.emit('undo'));
    socket.on('shape', (data) => socket.broadcast.emit('shape', data));
    
    // NEW: Broadcast Paint Bucket fills
    socket.on('fill', (data) => socket.broadcast.emit('fill', data));
    
    // NEW: Broadcast Canva Coloring Templates
    socket.on('template', (data) => socket.broadcast.emit('template', data));

    socket.on('disconnect', () => console.log('An artist disconnected:', socket.id));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
