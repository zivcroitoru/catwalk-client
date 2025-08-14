// js/features/mailbox/player-mailbox.js
import { APP_URL } from '../../core/config.js';
import { getAuthToken } from '../../core/auth/authentication.js';
console.log("using: ", APP_URL);

console.log("--------------1--------------");
document.addEventListener('DOMContentLoaded', () => {
  const createTicketBtn = document.getElementById('createTicketBtn');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const messageBox = document.getElementById('messageBox');
  const chatMessages = document.getElementById('chatMessages');

  console.log("--------------2--------------");

  const userId = localStorage.getItem('userId');
  if (!userId) {
    // No user id — show a friendly message and disable UI
    console.warn('No userId in localStorage — user must be logged in to open tickets.');
    createTicketBtn.style.display = 'none';
    chatBox.style.display = 'none';
    return;
  }


  // Fetch past broadcasts from DB
  async function loadBroadcasts() {
    try {
      const res = await fetch(`${APP_URL}/api/messages/broadcasts`);
      if (res.ok) {
        const past = await res.json();
        broadcastMessages = past.map(b => ({ text: b.body, date: b.sent_at }));
        localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
        renderBroadcasts();
      } else {
        console.warn('Failed to fetch past broadcasts', await res.text());
      }
    } catch (err) {
      console.error('Error fetching past broadcasts:', err);
    }
  }

  // Call it on page load
  loadBroadcasts();




  // Connect socket (use auth token if you have one)
  const socket = io(APP_URL, {
    auth: {
      token: (typeof getAuthToken === 'function') ? getAuthToken() : undefined

    }
  });

  let currentTicketId = null;
  // ---------- BROADCAST SETUP ----------
  let broadcastMessages = [];
  localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
  // Render broadcasts function
  function renderBroadcasts() {
    const container = document.getElementById('broadcastMessages'); // <--- Make sure you have this div in HTML
    if (!container) return;
    container.innerHTML = "";
    broadcastMessages.forEach(msg => {
      const p = document.createElement('p');
      p.classList.add('broadcast-message');
      p.textContent = `[Broadcast] ${msg.text} (${new Date(msg.date).toLocaleString()})`;
      container.appendChild(p);
    });
  }


  renderBroadcasts();

  // Receive broadcast from server
  socket.on('adminBroadcast', (data) => {
    console.log("Broadcast received:", data);
    broadcastMessages.push({
      text: data.message,
      date: data.sent_at || new Date().toISOString()
    });
    localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages)); // <--- Added: store in localStorage
    renderBroadcasts();
  });
  // ---------- END BROADCAST SETUP ----------


  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    // register player so server can map sockets -> user and join existing ticket rooms
    socket.emit('registerPlayer', userId);
    console.log("-------------11--------------");

    // Optionally check for an existing open ticket on page load (HTTP route assumed to exist)
    checkOpenTicket(); // will show create button or open chat accordingly
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect_error:', err);
  });

  // ---------- UI helpers ----------
  function addMessage(senderLabel, text) {
    const p = document.createElement('p');
    p.textContent = `${senderLabel}: ${text}`;

    if (senderLabel.toLowerCase() === 'you' || senderLabel.toLowerCase() === 'user') {
      p.classList.add('player-message');
    } else if (senderLabel.toLowerCase() === 'admin') {
      p.classList.add('admin-message');
    } else {
      p.classList.add('system-message'); // optional for system notices
    }

    chatMessages.appendChild(p);
    scrollToBottom();
  }


  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ---------- Check if user already has an open ticket (HTTP) ----------
  async function checkOpenTicket() {
    try {
      console.log("-------------4-------------");

      const res = await fetch(`${APP_URL}/api/tickets/user/${userId}/open`);
      console.log("--------------3--------------");

      if (res.status === 404) {
        // no open ticket
        createTicketBtn.style.display = 'block';
        chatBox.style.display = 'none';
        console.log("--------------55--------------");

      } else if (res.ok) {
        console.log("--------------5--------------");

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
    createTicketBtn.style.display = 'none';
    chatBox.style.display = 'flex';

    if (!skipJoin) {
      socket.emit('joinTicketRoom', { ticketId }); // server will socket.join(room)
      console.log('Emitted joinTicketRoom for', ticketId);
    }

    // Load existing messages via your HTTP endpoint:
    try {
      const res = await fetch(`${APP_URL}/api/tickets/${ticketId}/messages`);
      if (res.ok) {
        const messages = await res.json();
        chatMessages.innerHTML = '';
        messages.forEach(msg => {
          const label = msg.sender === 'admin' ? 'Admin' : (msg.sender === 'user' ? (String(msg.user_id) === String(userId) ? 'You' : 'User') : msg.sender);
          addMessage(label, msg.content);
        });
      } else {
        console.warn('Failed to fetch chat history', await res.text());
      }
    } catch (err) {
      console.error('Error fetching chat history', err);
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
      // disable input
      sendBtn.disabled = true;
    }
  });

  console.log('Player mailbox client ready for user:', userId);


  // Listen for broadcast messages
  socket.on('adminBroadcast', (data) => {
    console.log("Broadcast received:", data);

    // Store in array (could be saved in localStorage if you want persistence)
    broadcastMessages.push({
      text: data.message,
      date: data.date || new Date().toISOString()
    });

    // Render them in a separate broadcast box
    renderBroadcasts();
  });

  function renderBroadcasts() {
    const container = document.getElementById('broadcastMessages');
    container.innerHTML = "";
    broadcastMessages.forEach(msg => {
      const p = document.createElement('p');
      p.classList.add('broadcast-message');
      p.textContent = `[Broadcast] ${msg.text}`;
      container.appendChild(p);
    });
  }

});

