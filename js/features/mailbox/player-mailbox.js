// player-mailbox.js
import { io } from 'socket.io-client';
import { APP_URL } from "../../core/config.js"; // adjust path if needed

let socket;

// 🟢 Initialize Socket.IO and mailbox
export function setupSocket(userToken, playerId) {
  const roomId = `admin_user_${playerId}`;

  socket = io(APP_URL, {
    auth: { token: userToken },
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    socket.emit('joinRoom', { roomId });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('newMessage', (data) => {
    console.log('📩 New message received:', data);
    displayPlayerMessage(data);
  });

  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');

  messageForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (message === '') return;

    socket.emit('sendMessage', {
      roomId,
      senderId: playerId,
      message
    });

    // Show message instantly on UI
    displayPlayerMessage({
      senderId: playerId,
      message,
      timestamp: new Date().toISOString()
    });

    messageInput.value = '';
  });
}

// 📦 Fetch message history from backend
async function fetchMailboxMessages(playerId) {
  try {
    const res = await fetch(`${APP_URL}/api/mailbox/${playerId}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return await res.json();
  } catch (err) {
    console.error('Failed to load messages:', err);
    return [];
  }
}

// 🔄 Load all past messages on mailbox open
async function loadMailboxMessages(playerId) {
  const messages = await fetchMailboxMessages(playerId);

  messages.forEach(msg => {
    displayPlayerMessage({
      senderId: msg.sender_id,
      message: msg.message_text,
      timestamp: msg.timestamp
    });
  });
}

// 💬 Append a message to mailbox UI
export function displayPlayerMessage({ senderId, message, timestamp }) {
  const messagesContainer = document.getElementById('messagesContainer');
  const mailboxPopup = document.getElementById('mailboxPopup');

  // Show popup if hidden
  if (mailboxPopup?.classList.contains('hidden')) {
    mailboxPopup.classList.remove('hidden');
  }

  if (!messagesContainer) {
    console.warn('Messages container not found');
    return;
  }

  const messageElem = document.createElement('div');
  messageElem.classList.add('message');

  const isAdmin = senderId === 'admin' || senderId === 0;
  messageElem.classList.add(isAdmin ? 'admin-message' : 'player-message');

  const displaySender = isAdmin ? 'Admin' : 'You';
  const timeString = new Date(timestamp).toLocaleTimeString();

  messageElem.textContent = `[${timeString}] ${displaySender}: ${message}`;
  messagesContainer.appendChild(messageElem);

  // 🔽 Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


// 🟢 Initialize mailbox when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const playerId = localStorage.getItem('playerId');
  const userToken = localStorage.getItem('authToken'); // <- make sure it's stored on login

  if (!playerId || !userToken) {
    console.warn("Missing playerId or userToken in localStorage.");
    return;
  }

  await loadMailboxMessages(playerId);
  setupSocket(userToken, playerId);
});


export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications.");
    return;
  }

  let permission = Notification.permission;

  if (permission === "granted") {
    console.log("Notifications already granted.");
    return;
  }

  if (permission === "denied") {
    console.warn("Notifications were previously denied.");
    return;
  }

  try {
    const newPermission = await Notification.requestPermission();
    if (newPermission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (err) {
    console.error("Error requesting notification permission:", err);
  }
}

export function toggleMailbox() {
  if (!mailboxDisplay) return;
  
  const isVisible = mailboxDisplay.classList.contains('show');
  
  if (isVisible) {
    closeMailbox();
  } else {
    openMailbox();
  }
}


async function openMailbox() {
  if (!mailboxDisplay) return;
  
  mailboxDisplay.classList.add('show');
  
  // Load fresh data when opening
  await loadMailboxData();
  
  // Reset to default view
  showView('list');
  setActiveTab('all');
}

/**
 * Close mailbox
 */
function closeMailbox() {
  if (!mailboxDisplay) return;
  
  mailboxDisplay.classList.remove('show');
}

