// js/features/mailbox/player-mailbox.js
import { APP_URL } from '../../core/config.js';
import { getAuthToken } from '../../core/auth/authentication.js';

document.addEventListener('DOMContentLoaded', () => {
  const createTicketBtn = document.getElementById('createTicketBtn');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const messageBox = document.getElementById('messageBox');
  const chatMessages = document.getElementById('chatMessages');

  const userId = localStorage.getItem('userId');
  if (!userId) {
    createTicketBtn.style.display = 'none';
    chatBox.style.display = 'none';
    return;
  }

  let broadcastMessages = JSON.parse(localStorage.getItem('broadcastMessages')) || [];

  function renderBroadcasts() {
    const container = document.getElementById('broadcastMessages');
    if (!container) return;
    container.innerHTML = "";

    for (let i = broadcastMessages.length - 1; i >= 0; i--) {
      const msg = broadcastMessages[i];
      const p = document.createElement('p');
      p.classList.add('broadcast-message');
      p.textContent = ` ${msg.text}`;
      container.appendChild(p);
    }
  }

  async function loadBroadcasts() {
    try {
      const res = await fetch(`${APP_URL}/api/broadcasts`);
      if (res.ok) {
        const past = await res.json();
        broadcastMessages = past
          .map(b => ({ text: b.body, date: b.sent_at }))
          .reverse();
        localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
        renderBroadcasts();
      }
    } catch {}
  }

  renderBroadcasts();
  loadBroadcasts();

  const socket = io(APP_URL, {
    auth: {
      token: (typeof getAuthToken === 'function') ? getAuthToken() : undefined
    }
  });

  socket.on('connect', () => {
    socket.emit('registerPlayer', userId);
    checkOpenTicket();
  });

  localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
  renderBroadcasts();

  socket.on('adminBroadcast', (data) => {
    broadcastMessages.push({
      text: data.message,
      date: data.date || new Date().toISOString()
    });
    localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
    renderBroadcasts();
  });

  let currentTicketId = null;

  const lastTicketId = localStorage.getItem(`lastTicketId_${userId}`);
  if (lastTicketId) {
    openTicket(lastTicketId, true);
  } else {
    checkOpenTicket();
  }

  function addMessage(senderLabel, text, save = true) {
    const p = document.createElement('p');
    p.textContent = `${senderLabel}: ${text}`;

    if (senderLabel.toLowerCase() === 'you' || senderLabel.toLowerCase() === 'user') {
      p.classList.add('player-message');
    } else if (senderLabel.toLowerCase() === 'admin') {
      p.classList.add('admin-message');
    } else {
      p.classList.add('system-message');
    }

    chatMessages.appendChild(p);
    scrollToBottom();

    if (save && currentTicketId) {
      let savedMessages = JSON.parse(localStorage.getItem(`ticket_${currentTicketId}_messages`)) || [];
      savedMessages.push({ sender: senderLabel, text });
      localStorage.setItem(`ticket_${currentTicketId}_messages`, JSON.stringify(savedMessages));
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function checkOpenTicket() {
    try {
      const res = await fetch(`${APP_URL}/api/tickets/user/${userId}/open`);
      if (res.status === 404) {
        createTicketBtn.style.display = 'block';
        chatBox.style.display = 'flex';
      } else if (res.ok) {
        const ticket = await res.json();
        openTicket(ticket.ticket_id, false);
      }
    } catch {}
  }

  async function openOrCreateTicket() {
    socket.emit('openTicketRequest', { userId }, (response) => {
      if (response?.error) {
        alert('Error opening ticket: ' + response.error);
        return;
      }
      const ticket = response.ticket;
      if (!ticket) {
        alert('Server did not return ticket info.');
        return;
      }
      openTicket(ticket.ticket_id, false);
    });
  }

  // openTicket: set UI, join room (optionally) and load history
async function openTicket(ticketId, skipJoin = false) {
  currentTicketId = ticketId;
  localStorage.setItem(`lastTicketId_${userId}`, ticketId);
  createTicketBtn.style.display = 'none';
  chatBox.style.display = 'flex';

  if (!skipJoin) {
    socket.emit('joinTicketRoom', { ticketId });
  }

  chatMessages.innerHTML = '';

  // Load local messages
  const savedMessages = JSON.parse(localStorage.getItem(`ticket_${ticketId}_messages`)) || [];
  savedMessages.forEach(msg => addMessage(msg.sender, msg.text, false));

  try {
    const res = await fetch(`${APP_URL}/api/tickets/${ticketId}`);
    if (res.ok) {
      const ticket = await res.json();

      // fetch chat history
      const msgsRes = await fetch(`${APP_URL}/api/tickets/${ticketId}/messages`);
      if (msgsRes.ok) {
        const messages = await msgsRes.json();
        messages.forEach(msg => {
          const label = msg.sender === 'admin' ? 'Admin' :
            (msg.sender === 'user' ? (String(msg.user_id) === String(userId) ? 'You' : 'User') : msg.sender);
          const alreadySaved = savedMessages.some(m => m.sender === label && m.text === msg.content);
          if (!alreadySaved) addMessage(label, msg.content);
        });
      }

      // ✅ if server says ticket is closed
      if (ticket.status === 'closed') {
        const closedAlready = localStorage.getItem(`ticket_${ticketId}_closed`) === 'true'; 
        if (!closedAlready) { 
          addMessage('System', `Ticket #${ticketId} was closed by admin.`, false); 
          localStorage.setItem(`ticket_${ticketId}_closed`, 'true'); 
        } 
        sendBtn.disabled = true;
        createTicketBtn.style.display = 'block';
      } else {
        sendBtn.disabled = false;
      }
    }
  } catch (err) {
    console.error('Error loading ticket info:', err);
  }
}

  sendBtn.addEventListener('click', () => {
    const message = messageBox.value.trim();
    if (!message || !currentTicketId) return;

    socket.emit('playerMessage', {
      ticketId: currentTicketId,
      userId,
      text: message
    });

    messageBox.value = '';
  });

  createTicketBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrCreateTicket();
  });

  socket.on('newMessage', (data) => {
    if (data.senderSocketId === socket.id) return;
    if (data.ticketId !== currentTicketId) return;

    const label = data.sender === 'admin' ? 'Admin' : 'User';
    addMessage(label, data.content ?? data.text ?? '');
  });
  

  // Optional: listen for ticket close events from server if you emit them there
socket.on('ticketClosed', ({ ticketId }) => {
  if (ticketId === currentTicketId) {
    const closedAlready = localStorage.getItem(`ticket_${ticketId}_closed`) === 'true'; 
    if (!closedAlready) { 
      addMessage('System', `Ticket #${ticketId} was closed by admin.`); 
      localStorage.setItem(`ticket_${ticketId}_closed`, 'true'); 
    } 
    sendBtn.disabled = true;
    createTicketBtn.style.display = 'block';
  }
});
});
