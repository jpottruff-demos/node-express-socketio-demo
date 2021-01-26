const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    // Welcome the current user (only the one user will see this)
    socket.emit('message', 'Welcome to ChatCord!!') // the one user

    // Broadcast when a user connects (NOTE: this will not show to the user who is connecting; they don't need to know)
    socket.broadcast.emit('message', 'A user has joined the chat');


    // Listen for chat messages
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    })


    // Runs when client disconnects
    socket.on('disconnect', () => {
        // Emits to everyone
        io.emit('message', 'A user has left the chat')
    })
})



const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));