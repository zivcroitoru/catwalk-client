import { io } from 'socket.io-client';
import { APP_URL } from "../../core/config.js"; // adjust path as needed

let socket;

// Initialize socket and join room
export function setupSocket(userToken, playerId) {
  socket = io(APP_URL, {
    auth: { token: userToken },
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    const roomId = `admin_user_${playerId}`;
    socket.emit('joinRoom', { roomId });
  });

  socket.on('newMessage', (data) => {
    console.log('New message received:', data);
    displayPlayerMessage(data);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  // Setup event listener after socket is ready & DOM loaded
  document.addEventListener('DOMContentLoaded', () => {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');

    messageForm?.addEventListener('submit', (event) => {
      event.preventDefault();

      const message = messageInput.value.trim();
      if (message === '') return;

      const roomId = `admin_user_${playerId}`;
      const senderId = playerId;

      socket.emit('sendMessage', { roomId, senderId, message });

      // Show own message immediately
      displayPlayerMessage({
        senderId: senderId,
        message: message,
        timestamp: new Date().toISOString(),
      });

      messageInput.value = '';
    });
  });
}

// Function to display message in mailbox UI
export function displayPlayerMessage({ senderId, message, timestamp }) {
  const messagesContainer = document.getElementById('messagesContainer');
  if (!messagesContainer) {
    console.warn('Messages container not found');
    return;
  }

  const messageElem = document.createElement('div');
  messageElem.classList.add('message');

  if (senderId === 'admin' || senderId === 0) {
    messageElem.classList.add('admin-message');
    senderId = 'Admin'; // nicer display name
  } else {
    messageElem.classList.add('player-message');
  }

  const timeString = new Date(timestamp).toLocaleTimeString();

  messageElem.textContent = `[${timeString}] ${senderId}: ${message}`;
  messagesContainer.appendChild(messageElem);

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
