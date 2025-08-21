// js/features/mailbox/player-mailbox.js
import { APP_URL } from '../../core/config.js';
import { getAuthToken } from '../../core/auth/authentication.js';
console.log("using: ", APP_URL);

document.addEventListener('DOMContentLoaded', () => {

  const createTicketBtn = document.getElementById('createTicketBtn');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const messageBox = document.getElementById('messageBox');
  const chatMessages = document.getElementById('chatMessages');


  const userId = localStorage.getItem('userId');
  if (!userId) {
    // No user id — show a friendly message and disable UI
    console.warn('No userId in localStorage — user must be logged in to open tickets.');
    createTicketBtn.style.display = 'none';
    chatBox.style.display = 'none';
    return;
  }


  let broadcastMessages = JSON.parse(localStorage.getItem('broadcastMessages')) || [];

  // Fetch past broadcasts from DB
  function renderBroadcasts() {
    const container = document.getElementById('broadcastMessages');
    if (!container) return;
    container.innerHTML = "";

    // Render newest first
    for (let i = broadcastMessages.length - 1; i >= 0; i--) {
      const msg = broadcastMessages[i];
      const p = document.createElement('p');
      p.classList.add('broadcast-message');
      const dateStr = msg.date ? new Date(msg.date).toLocaleString() : '';
      p.textContent = ` ${msg.text}`;
      container.appendChild(p);
    }
  }




  // Fetch past broadcasts from API
  async function loadBroadcasts() {
    try {
      const res = await fetch(`${APP_URL}/api/broadcasts`);
      if (res.ok) {
        const past = await res.json();
        broadcastMessages = past
          .map(b => ({ text: b.body, date: b.sent_at }))
          .reverse();  // <- newest first
        localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
        renderBroadcasts();
      } else {
        console.warn('Failed to fetch past broadcasts', await res.text());
      }
    } catch (err) {
      console.error('Error fetching past broadcasts:', err);
    }
  }



  // Initial render from localStorage, then refresh from server
  renderBroadcasts();
  loadBroadcasts();

  // Connect socket (use auth token if you have one)
  const socket = io(APP_URL, {
    auth: {
      token: (typeof getAuthToken === 'function') ? getAuthToken() : undefined

    }
  });


  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    // register player so server can map sockets -> user and join existing ticket rooms
    socket.emit('registerPlayer', userId);

    checkOpenTicket(); // will show create button or open chat accordingly
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect_error:', err);
  });

  // ---------- BROADCAST SETUP ----------

  localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
  // Render broadcasts function



  renderBroadcasts();

  // Receive broadcast from server
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
    openTicket(lastTicketId, /*skipJoin=*/true);
  } else {
    checkOpenTicket();
  }


  // ---------- UI helpers ----------
  function addMessage(senderLabel, text, save = true) {
    const p = document.createElement('p');
    p.textContent = `${senderLabel}: ${text}`;

    if (senderLabel.toLowerCase() === 'you' || senderLabel.toLowerCase() === 'user') {
      p.classList.add('player-message');
    } else if (senderLabel.toLowerCase() === 'admin') {
      p.classList.add('admin-message');
    } else {
      p.classList.add('system-message'); // optional
    }

    chatMessages.appendChild(p);
    scrollToBottom();

    // Save locally
    if (save && currentTicketId) {
      let savedMessages = JSON.parse(localStorage.getItem(`ticket_${currentTicketId}_messages`)) || [];
      savedMessages.push({ sender: senderLabel, text });
      localStorage.setItem(`ticket_${currentTicketId}_messages`, JSON.stringify(savedMessages));
    }
  }



  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }



  // ---------- Check if user already has an open ticket (HTTP) ----------
  async function checkOpenTicket() {
    try {
      const res = await fetch(`${APP_URL}/api/tickets/user/${userId}/open`);
      if (res.status === 404) {
        // no open ticket
        createTicketBtn.style.display = 'block';
        chatBox.style.display = 'flex';
      } else if (res.ok) {
        const ticket = await res.json();
        openTicket(ticket.ticket_id, /*skipJoin=*/false);
      } else {
        console.error('checkOpenTicket failed:', await res.text());
      }
    } catch (err) {
      console.error('Failed to check open ticket', err);
    }
  }



  // ---------- Open or create ticket using Socket.IO ----------
  async function openOrCreateTicket() {
    console.log('Requesting openTicketRequest via socket for userId:', userId);
    socket.emit('openTicketRequest', { userId }, (response) => {
      console.log('openTicketRequest response:', response);
      if (response?.error) {
        alert('Error opening ticket: ' + response.error);
        return;
      }
      const ticket = response.ticket;
      if (!ticket) {
        alert('Server did not return ticket info.');
        return;
      }
      // join the ticket room (server has handler joinTicketRoom)
      openTicket(ticket.ticket_id, /*skipJoin=*/false);
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

    // ⬇️ Fetch messages and also check status
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
          addMessage('System', `Ticket #${ticketId} was closed by admin.`, false);
          sendBtn.disabled = true;
          createTicketBtn.style.display = 'block';
          localStorage.setItem(`ticket_${ticketId}_closed`, 'true');
        } else {
          sendBtn.disabled = false;
        }
      }
    } catch (err) {
      console.error('Error loading ticket info:', err);
    }
  }



  // ---------- Send message (use socket) ----------
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


  // ---------- Create ticket button ----------
  createTicketBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrCreateTicket();
  });

  // ---------- Receive live messages (admin or user) ----------
  socket.on('newMessage', (data) => {
    if (data.senderSocketId === socket.id) return; // skip our own
    if (data.ticketId !== currentTicketId) return;

    const label = data.sender === 'admin' ? 'Admin' : 'User';
    addMessage(label, data.content ?? data.text ?? '');
  });
  ;

  // Optional: listen for ticket close events from server if you emit them there
  socket.on('ticketClosed', ({ ticketId }) => {
    if (ticketId === currentTicketId) {
      addMessage('System', `Ticket #${ticketId} was closed by admin.`);
      sendBtn.disabled = true;
      createTicketBtn.style.display = 'block';
    }
    localStorage.setItem(`ticket_${ticketId}_closed`, 'true');
  });


  console.log('Player mailbox client ready for user:', userId);


});
