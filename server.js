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

    // Broadcast drawing data
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    // Broadcast the clear command
    socket.on('clear', () => {
        socket.broadcast.emit('clear');
    });

    // NEW: Broadcast background color changes
    socket.on('bgColor', (color) => {
        socket.broadcast.emit('bgColor', color);
    });

    socket.on('disconnect', () => {
        console.log('An artist disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
