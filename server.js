// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Tell the server to serve the frontend files from the "public" folder
app.use(express.static('public'));

// Listen for connections from you and your girlfriend
io.on('connection', (socket) => {
    console.log('A new artist connected:', socket.id);

    // Listen for drawing data from one person, and broadcast it to everyone else
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    // Listen for the clear command and broadcast it
    socket.on('clear', () => {
        socket.broadcast.emit('clear');
    });

    socket.on('disconnect', () => {
        console.log('An artist disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
