// js/features/mailbox/player-mailbox.js
import { APP_URL } from '../../core/config.js';
import { getAuthToken } from '../../core/auth/authentication.js';
console.log("using: ", APP_URL);
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

    // show immediately in UI
    addMessage('You', message);

    // send to server via socket so server will persist and broadcast to room
    socket.emit('playerMessage', {
      ticketId: currentTicketId,
      userId,
      text: message
    }, (ack) => {
      // optional ack handling if server supports it
    });

    messageBox.value = '';
    scrollToBottom();
  });

  // ---------- Create ticket button ----------
  createTicketBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openOrCreateTicket();
  });

  // ---------- Receive live messages (admin or user) ----------
  socket.on('newMessage', (data) => {
    // data: { sender, content, ticketId, userId? }
    if (!data) return;
    if (data.ticketId !== currentTicketId) {
      // Optionally show a toast/notification if message is for another ticket
      console.log('Incoming message for other ticket', data.ticketId);
      return;
    }

    // Map server sender to UI label
    const label = data.sender === 'admin' ? 'Admin' : (data.sender === 'user' ? (String(data.userId) === String(userId) ? 'You' : 'User') : data.sender);
    addMessage(label, data.content ?? data.text ?? '');
  });

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








// import { APP_URL } from '../../core/config.js';
// console.log('APP_URL:', APP_URL);

// import { io } from 'socket.io-client';
// import { getAuthToken } from '../../core/auth/authentication.js';

// const socket = io(APP_URL, {
//   auth: {
//     token: getAuthToken(),
//   }
// });

// const userId = localStorage.getItem('userId');
// const sendBtn = document.getElementById('sendBtn');
// const messageBox = document.getElementById('messageBox');
// const chatMessages = document.getElementById('chatMessages');
// const createTicketBtn = document.getElementById('createTicketBtn');
// const chatBox = document.getElementById('chatBox');

// let currentTicketId = null;

// socket.on('connect', () => {
//   console.log('✅ Connected to Socket.IO server with ID:', socket.id);
//   socket.emit('registerPlayer', userId);

//   // Step 3: Check if user has open ticket
//   checkOpenTicket();
// });

// socket.on('connect_error', (err) => {
//   console.error('❌ Socket connection error:', err.message);
// });

// // Step 3: Check for open ticket on server
// async function checkOpenTicket() {
//   try {
//     const res = await fetch(`${APP_URL}/api/tickets/user/${userId}/open`);
//     if (res.status === 404) {
//       // No open ticket found → show create button
//       showCreateTicketButton();
//     } else if (res.ok) {
//       const ticket = await res.json();
//       openTicket(ticket.ticket_id);
//     } else {
//       console.error("Error checking open ticket", await res.text());
//     }
//   } catch (err) {
//     console.error("Failed to check open ticket", err);
//   }
// }

// // Show create ticket button & hide chat
// function showCreateTicketButton() {
//   createTicketBtn.style.display = 'block';
//   chatBox.style.display = 'none';
// }

// // Hide create button & show chat box
// function openTicket(ticketId) {
//   currentTicketId = ticketId;
//   createTicketBtn.style.display = 'none';
//   chatBox.style.display = 'block';
//   fetchChatHistory();
// }

// // Step 4: Create ticket button clicked
// createTicketBtn.addEventListener('click', async () => {
//   try {
//     const res = await fetch(`${APP_URL}/api/tickets`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ user_id: userId })
//     });
//     if (res.ok) {
//       const newTicket = await res.json();
//       openTicket(newTicket.ticket_id);
//     } else {
//       alert('Failed to create ticket.');
//     }
//   } catch (err) {
//     console.error('Error creating ticket', err);
//   }
// });

// // Step 5: Fetch chat messages for current ticket
// async function fetchChatHistory() {
//   try {
//     const res = await fetch(`${APP_URL}/api/tickets/${currentTicketId}/messages`);
//     if (res.ok) {
//       const messages = await res.json();
//       chatMessages.innerHTML = '';
//       messages.forEach(msg => addMessage(msg.sender, msg.content));
//       scrollToBottom();
//     } else {
//       console.error('Failed to load chat messages');
//     }
//   } catch (err) {
//     console.error('Error fetching chat history', err);
//   }
// }

// // Step 6: Send message event
// sendBtn.addEventListener('click', async () => {
//   const message = messageBox.value.trim();
//   if (!message || !currentTicketId) return;

//   // Show message immediately
//   addMessage('You', message);

//   try {
//     const res = await fetch(`${APP_URL}/api/tickets/${currentTicketId}/messages`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ sender: 'user', content: message })
//     });

//     if (!res.ok) {
//       console.error('Failed to send message');
//     }
//   } catch (err) {
//     console.error('Error sending message', err);
//   }

//   messageBox.value = '';
//   scrollToBottom();
// });

// // Add message to chat UI
// function addMessage(sender, text) {
//   const p = document.createElement('p');
//   p.textContent = `${sender}: ${text}`;
//   chatMessages.appendChild(p);
// }

// // Scroll chat to bottom
// function scrollToBottom() {
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// // Optional: You can also listen on socket to get admin replies live and add them to chat here
// socket.on('adminMessage', (data) => {
//   if (data.ticketId === currentTicketId) {
//     addMessage('Admin', data.text);
//     scrollToBottom();
//   }
// });

// console.log('✅ Player Mailbox initialized for user:', userId);
