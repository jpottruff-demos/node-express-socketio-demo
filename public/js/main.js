const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL (see: https://cdnjs.com/libraries/qs)
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});


// We can access this from the socket io scripts we brought in on chat.html
const socket = io();


// Join Chatroom
socket.emit('joinRoom', {username, room});

// Get Room Users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUserList(users);
});


// Message from Server
socket.on('message', message => {
    outputMessage(message);

    // Scroll down with new messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // Emit a message to the server
    socket.emit('chatMessage', msg);

    // Clear and focus on the input box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus()
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = 
    `
        <p class="meta">${message.username}<span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;

    document.querySelector('.chat-messages').appendChild(div);
}

// Add roomname to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add user list to DOM
function outputUserList(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}`).join('')}
    `
}