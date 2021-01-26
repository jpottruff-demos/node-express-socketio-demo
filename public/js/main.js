const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// We can access this from the socket io scripts we brought in on chat.html
const socket = io();

// Message from Server
socket.on('message', message => {
    console.log(message)
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
        <p class="meta">Brad <span>9:12pm</span></p>
        <p class="text">${message}</p>
    `;

    document.querySelector('.chat-messages').appendChild(div);
}