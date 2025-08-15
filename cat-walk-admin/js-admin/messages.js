import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

// Create socket connection
const socket = io(APP_URL);

let currentTicketId = null;
let currentSelectedDiv = null;
let allTickets = [];
let broadcastMessages = [];


const closeBtn = document.getElementById('closeTicketButton');
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');



document.addEventListener('DOMContentLoaded', () => {
  fetchTickets();
  sendButton.addEventListener("click", sendMessage);
  document.getElementById("sortSelect").addEventListener("change", onSortChange);
  document.getElementById("searchInput").addEventListener("input", onSearchInput);
  closeBtn.addEventListener('click', closeCurrentTicket);
  updateSendButtonState();
});

function closeCurrentTicket() {
  if (!currentTicketId) return;

  socket.emit('closeTicket', { ticketId: currentTicketId });
}

// ───────────── SOCKET EVENTS ─────────────

// Register admin when socket connects
socket.on('connect', () => {
  console.log('Admin connected via socket:', socket.id);
  socket.emit('registerAdmin'); // Tell server this is an admin
});

// Listen for player messages in real-time
socket.on('newMessage', (data) => {
  if (data.ticketId !== currentTicketId) {
    // Optional: show notification if message is for another ticket
    console.log(`New message for ticket #${data.ticketId}:`, data.content);
    return;
  }
  const label = data.sender === 'user' ? `PLAYER` : `ADMIN`;
  displayMessage({ sender: label, content: data.content });
});

// Listen for ticket close events
socket.on('ticketClosed', ({ ticketId }) => {
  const ticket = allTickets.find(t => t.ticket_id === ticketId);
  if (ticket) {
    ticket.status = 'closed';
    if (ticketId === currentTicketId) {
      closeBtn.disabled = true;
      updateSendButtonState();
      document.getElementById("chatHeader").textContent += " [Closed]";
    }
    renderTickets(allTickets);
  }
});


// ───────────── FETCH & RENDER TICKETS ─────────────
async function fetchTickets() {
  try {
    const res = await fetch(`${APP_URL}/api/tickets`);
    allTickets = await res.json();
    renderTickets(allTickets);
  } catch (err) {
    console.error("Failed to fetch tickets", err);
    alert("Failed to fetch tickets from server.");
  }
}

function renderTickets(tickets) {
  const ticketList = document.getElementById("ticketList");
  ticketList.innerHTML = "";

  tickets.forEach(ticket => {
    const div = document.createElement("div");
    div.className = "ticket-entry";
    div.textContent = `#${ticket.ticket_id} - ${ticket.username} (${ticket.status})`;

    div.onclick = () => {
      selectTicket(ticket.ticket_id, ticket.username);

      // Highlight clicked ticket
      if (currentSelectedDiv) {
        currentSelectedDiv.classList.remove('selected');
      }
      div.classList.add('selected');
      currentSelectedDiv = div;
    };

    if (ticket.ticket_id === currentTicketId) {
      div.classList.add('selected');
      currentSelectedDiv = div;
    }

    ticketList.appendChild(div);
  });
}

// ───────────── TICKET SELECTION ─────────────
async function selectTicket(ticketId, username) {
  currentTicketId = ticketId;
  document.getElementById("chatHeader").textContent = `Chat with ${username} (Ticket #${ticketId})`;
  document.getElementById("chatMessages").innerHTML = "";

  const ticket = allTickets.find(t => t.ticket_id === ticketId);
  closeBtn.disabled = !(ticket && ticket.status === 'open');
  updateSendButtonState();

  // Join ticket room for live chat
  socket.emit('joinTicketRoom', { ticketId });

  await fetchChatHistory(ticketId);
}

// ───────────── CHAT HISTORY ─────────────
async function fetchChatHistory(ticketId) {
  try {
    const res = await fetch(`${APP_URL}/api/tickets/${ticketId}/messages`);
    const messages = await res.json();
    messages.forEach(msg => {
      const label = msg.sender === 'admin' ? 'ADMIN' : `PLAYER`;
      displayMessage({ sender: label, content: msg.content });
    });
    scrollToBottom();
  } catch (err) {
    console.error("Failed to fetch chat history", err);
    alert("Failed to load chat history.");
  }
}

// ───────────── DISPLAY MESSAGE ─────────────
function displayMessage(msg) {
  const div = document.createElement("div");
  div.className = msg.sender.toLowerCase().includes("admin") ? "message admin" : "message user";
  div.textContent = `${msg.sender}: ${msg.content}`;
  document.getElementById("chatMessages").appendChild(div);
  scrollToBottom();
}

// ───────────── SEND MESSAGE ─────────────
function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || !currentTicketId) return;

  messageInput.value = "";
  updateSendButtonState();

  // Only send via socket — no displayMessage here
  socket.emit('adminMessage', { ticketId: currentTicketId, text: content });
}

// ───────────── CLOSE TICKET ─────────────
socket.on('closeTicket', async (ticketId) => {
  try {
    // 1. Update ticket status to 'closed' and update updated_at timestamp
    await DB.query(
      `UPDATE tickets_table 
       SET status = 'closed', updated_at = NOW() 
       WHERE ticket_id = $1`,
      [ticketId]
    );

    // 2. Find the user_id who owns the ticket
    const result = await DB.query(
      `SELECT user_id FROM tickets_table WHERE ticket_id = $1`,
      [ticketId]
    );

    if (result.rows.length > 0) {
      const userId = result.rows[0].user_id;

      // 3. Notify the user socket room (assuming room user_<userId>)
      io.to(`user_${userId}`).emit('ticketClosed', {
        ticketId,
        message: 'Your ticket has been closed by an admin.'
      });
    }

    // 4. Notify all admins (assuming they joined room 'admins')
    io.to('admins').emit('ticketClosed', {
      ticketId,
      status: 'closed'
    });

  } catch (err) {
    console.error('Error closing ticket:', err);
    socket.emit('error', { message: 'Failed to close ticket.' });
  }
});

// ───────────── UTILITIES ─────────────
function scrollToBottom() {
  const container = document.getElementById("chatMessages");
  container.scrollTop = container.scrollHeight;
}

function onSearchInput(e) {
  const query = e.target.value.toLowerCase();
  const filtered = allTickets.filter(ticket => {
    const idMatch = ticket.ticket_id.toString().includes(query);
    const usernameMatch = ticket.username.toLowerCase().includes(query);
    return idMatch || usernameMatch;
  });
  renderTickets(filtered);
}

function onSortChange(e) {
  const val = e.target.value;
  if (!val) {
    renderTickets(allTickets); // show all if nothing selected
    return;
  }

  const [field, order] = val.split('-');

  if (field === 'ID') {
    const sorted = [...allTickets].sort((a, b) =>
      order === 'asc' ? a.ticket_id - b.ticket_id : b.ticket_id - a.ticket_id
    );
    renderTickets(sorted);
  }
  else if (field === 'status') {
    // Filter instead of sorting
    const filtered = allTickets.filter(ticket => 
      ticket.status.toLowerCase() === order
    );
    renderTickets(filtered);
  }
}


socket.on('newTicketCreated', async (ticket) => {
  try {
    console.log('Received newTicketCreated event:', ticket);
    const res = await fetch(`${APP_URL}/api/tickets/${ticket.ticket_id}`);
    if (res.ok) {
      const fullTicket = await res.json();
      console.log('Fetched full ticket:', fullTicket);
      allTickets.push(fullTicket);
      renderTickets(allTickets);
    } else {
      console.warn('Failed to fetch full ticket:', await res.text());
      allTickets.push(ticket);
      renderTickets(allTickets);
    }
  } catch (error) {
    console.error('Error fetching full ticket:', error);
    allTickets.push(ticket);
    renderTickets(allTickets);
  }
});




function updateSendButtonState() {
  sendButton.disabled = !currentTicketId || closeBtn.disabled;
}


// ───────────── BROADCAST MODE ─────────────
let isBroadcastMode = false;
const toggleBtn = document.getElementById('toggleModeButton');
const ticketModeDiv = document.getElementById('ticketMode');
const broadcastModeDiv = document.getElementById('broadcastMode');
const broadcastListContainer = document.getElementById('broadcastList');

toggleBtn.addEventListener('click', () => {
  isBroadcastMode = !isBroadcastMode;
  ticketModeDiv.style.display = isBroadcastMode ? 'none' : 'flex';
  broadcastModeDiv.style.display = isBroadcastMode ? 'flex' : 'none';
  toggleBtn.textContent = isBroadcastMode ? 'Switch to Tickets' : 'Switch to Broadcast';
});

// Load stored broadcasts from localStorage at startup
broadcastMessages = JSON.parse(localStorage.getItem('broadcastMessages') || '[]');
renderBroadcasts();

// Listen for broadcasts in real-time
socket.on('adminBroadcast', (data) => {
  console.log("Broadcast received:", data);
  
  const newBroadcast = {
    text: data.message,
    date: data.date || new Date().toISOString()
  };

  broadcastMessages.push(newBroadcast);
  localStorage.setItem('broadcastMessages', JSON.stringify(broadcastMessages));
  renderBroadcasts();
});

// Render all broadcasts in the list
function renderBroadcasts() {
  if (!broadcastListContainer) return;
  broadcastListContainer.innerHTML = '';

  broadcastMessages.forEach(broadcast => {
    const div = document.createElement('div');
    div.className = 'broadcast-entry';
    const dateStr = new Date(broadcast.date).toLocaleString();
    div.textContent = `[${dateStr}] ${broadcast.text}`;
    broadcastListContainer.appendChild(div);
  });

  // Keep scroll at bottom to see the newest broadcast
  broadcastListContainer.scrollTop = broadcastListContainer.scrollHeight;
}

// Send broadcast to server
document.getElementById('sendBroadcastButton').addEventListener('click', () => {
  const msgInput = document.getElementById('broadcastMessage');
  const message = msgInput.value.trim();
  if (!message) return alert('Please enter a message.');

  // Emit via socket for live delivery AND DB saving
  socket.emit('adminBroadcast', { message });

  msgInput.value = '';
});



