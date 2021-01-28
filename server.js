const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'CharCord Bot';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Run when client connects
io.on('connection', socket => {
    // When a user joins the room (handled in the main.js)
    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome the current user (only the one user will see this)
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!!'));
    
        // Broadcast when a user connects (NOTE: this will not show to the user who is connecting; they don't need to know)
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });    
    
    
    // Listen for chat messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            // Emits to everyone
            io.to(user.room).emit('message', formatMessage(botName,  `${user.username} has left the chat`));
            
            // Send users and room info (eg. refresh)
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
    
    
})



const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));