// We can access this from the socket io scripts we brought in on chat.html
const socket = io();

// This is coming from our server.js
socket.on('message', message => {
    console.log(message)
});