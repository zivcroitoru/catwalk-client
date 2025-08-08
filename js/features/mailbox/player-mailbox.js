// js/features/mailbox/player-mailbox.js
import { APP_URL } from '../../core/config.js';
import { getAuthToken } from '../../core/auth/authentication.js';
console.log("using: ", APP_URL);
const socket = io();
// NOTE: we rely on the socket.io client script included in mailbox.html
// <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
// so we use the global `io()` function (no import of socket.io-client here).
console.log("--------------1--------------");
document.addEventListener('DOMContentLoaded', () => {
  const createTicketBtn = document.getElementById('createTicketBtn');
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const messageBox = document.getElementById('messageBox');
  const chatMessages = document.getElementById('chatMessages');

  const showPastTicketsBtn = document.getElementById('showPastTicketsBtn');
  const pastTicketsList = document.getElementById('pastTicketsList');
  console.log("--------------2--------------");

  const userId = localStorage.getItem('userId');
  if (!userId) {
    // No user id — show a friendly message and disable UI
    console.warn('No userId in localStorage — user must be logged in to open tickets.');
    createTicketBtn.style.display = 'none';
    chatBox.style.display = 'none';
    return;
  }

  // Connect socket (use auth token if you have one)
  const socket = io(APP_URL, {
    auth: {
      token: (typeof getAuthToken === 'function') ? getAuthToken() : undefined

    }
  });

  let currentTicketId = null;

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
    chatBox.style.display = 'block';

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
});

showPastTicketsBtn.addEventListener('click', async () => {
  try {
    const res = await fetch(`${APP_URL}/api/tickets/user/${userId}/all`);
    if (!res.ok) {
      alert('Failed to load past tickets');
      return;
    }
    const tickets = await res.json();
    renderPastTickets(tickets);
    pastTicketsList.style.display = 'block';
  } catch (err) {
    console.error('Error loading past tickets', err);
    alert('Error loading past tickets');
  }
});

function renderPastTickets(tickets) {
  pastTicketsList.innerHTML = '';
  if (tickets.length === 0) {
    pastTicketsList.textContent = 'No past tickets found.';
    return;
  }
  tickets.forEach(ticket => {
    const div = document.createElement('div');
    div.textContent = `#${ticket.ticket_id} (${ticket.status}) - Created: ${new Date(ticket.created_at).toLocaleString()}`;
    div.style.cursor = 'pointer';
    div.style.marginBottom = '5px';

    div.onclick = () => {
      openTicket(ticket.ticket_id, true); // skipJoin true because you might not want to join room for closed tickets
      pastTicketsList.style.display = 'none';
    };

    pastTicketsList.appendChild(div);
  });
}

