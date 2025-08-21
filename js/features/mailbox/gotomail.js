import { APP_URL } from '../../core/config.js';
import { getAuthToken } from '../../core/auth/authentication.js';

document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  const mailboxDot = document.getElementById('mailbox-dot');
  const mailboxIcon = document.getElementById('mailbox-icon');

  if (!mailboxDot || !mailboxIcon) {
    console.warn('Mailbox elements not found!');
    return;
  }

  function showMailboxDot() {
    mailboxDot.style.display = 'block';
  }

  function clearMailboxDot() {
    mailboxDot.style.display = 'none';
    localStorage.setItem('hasNewMessage', 'false');
  }

  if (localStorage.getItem('hasNewMessage') === 'true') {
    showMailboxDot();
  }

  mailboxIcon.addEventListener('click', () => {
    clearMailboxDot();
    window.location.href = `mailbox.html?id=${userId}`;
  });

  const socket = io(APP_URL, {
    auth: { token: getAuthToken?.() }
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    socket.emit('registerPlayer', userId);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  socket.on('adminBroadcast', (data) => {
    console.log(' Broadcast received:', data);
    localStorage.setItem('hasNewMessage', 'true');
    showMailboxDot();
  });

socket.on('newMessage', (data) => {
  if (data.sender === 'admin') {
    console.log(' New admin ticket message received:', data);
    localStorage.setItem('hasNewMessage', 'true');
    showMailboxDot();
  }
});

  window.socket = socket;
});
