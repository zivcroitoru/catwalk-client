import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

// ───────────── SOCKET CONNECTION ─────────────
const socket = io(APP_URL);

// ───────────── GLOBAL VARIABLES ─────────────
let currentTicketId = null;
let currentSelectedDiv = null;
let allTickets = [];
let broadcastMessages = [];

const closeBtn = document.getElementById('closeTicketButton');
const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const toggleBtn = document.getElementById('toggleModeButton');
const ticketModeDiv = document.getElementById('ticketMode');
const broadcastModeDiv = document.getElementById('broadcastMode');
const broadcastListContainer = document.getElementById('broadcastList');

// ───────────── INITIALIZATION ─────────────
document.addEventListener('DOMContentLoaded', () => {
  fetchTickets();
  fetchBroadcasts();
  sendButton.addEventListener("click", sendMessage);
  document.getElementById("sortSelect").addEventListener("change", onSortChange);
  document.getElementById("searchInput").addEventListener("input", onSearchInput);
  closeBtn.addEventListener('click', closeCurrentTicket);
  document.getElementById('sendBroadcastButton').addEventListener('click', sendBroadcast);
  updateSendButtonState();
});

// ───────────── SOCKET EVENTS ─────────────
socket.on('connect', () => {
  console.log('Admin connected via socket:', socket.id);
  socket.emit('registerAdmin');
});

socket.on('newMessage', (data) => {
  if (data.ticketId !== currentTicketId) {
    console.log(`New message for ticket #${data.ticketId}:`, data.content);
    return;
  }
  const label = data.sender === 'user' ? 'PLAYER' : 'ADMIN';
  displayMessage({ sender: label, content: data.content });
});

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

socket.on('newTicketCreated', async (ticket) => {
  if (!ticket.username) {
    try {
      const res = await fetch(`${APP_URL}/api/tickets/${ticket.ticket_id}`);
      ticket = res.ok ? await res.json() : { ...ticket, username: 'Unknown' };
    } catch {
      ticket.username = 'Unknown';
    }
  }
  allTickets.unshift(ticket);
  renderTickets(allTickets);
});

// Broadcast real-time listener
// socket.on('adminBroadcast', (data) => {
//   console.log("Broadcast received:", data);
//   const newBroadcast = {
//     text: data.message,
//     date: data.date || new Date().toISOString()
//   };
//   broadcastMessages.push(newBroadcast);
//   renderBroadcasts();
// });

// ───────────── FETCH FUNCTIONS ─────────────
async function fetchTickets() {
  try {
    const res = await fetch(`${APP_URL}/api/tickets`);
    allTickets = await res.json();
    renderTickets(allTickets);
  } catch (err) {
    console.error("Failed to fetch tickets", err);
  }
}

async function fetchBroadcasts() {
  try {
    const res = await fetch(`${APP_URL}/api/broadcasts`);
    broadcastMessages = await res.json();
    renderBroadcasts();
  } catch (err) {
    console.error("Failed to fetch broadcasts", err);
  }
}

// ───────────── RENDER FUNCTIONS ─────────────
function renderTickets(tickets) {
  const ticketList = document.getElementById("ticketList");
  ticketList.innerHTML = "";

  tickets.forEach(ticket => {
    const div = document.createElement("div");
    div.className = "ticket-entry";
    div.textContent = `#${ticket.ticket_id} - ${ticket.username} (${ticket.status})`;
    div.onclick = () => {
      selectTicket(ticket.ticket_id, ticket.username);
      if (currentSelectedDiv) currentSelectedDiv.classList.remove('selected');
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

function renderBroadcasts() {
  if (!broadcastListContainer) return;
  broadcastListContainer.innerHTML = '';

  broadcastMessages.forEach(broadcast => {
    const div = document.createElement('div');
    div.className = 'broadcast-entry';
    const dateStr = new Date(broadcast.sent_at).toLocaleString();
    div.textContent = `[${dateStr}] ${broadcast.body}`;
    broadcastListContainer.appendChild(div);
  });

  broadcastListContainer.scrollTop = broadcastListContainer.scrollHeight;
}

// ───────────── TICKET CHAT ─────────────
async function selectTicket(ticketId, username) {
  currentTicketId = ticketId;
  document.getElementById("chatHeader").textContent = `Chat with ${username} (Ticket #${ticketId})`;
  document.getElementById("chatMessages").innerHTML = "";

  const ticket = allTickets.find(t => t.ticket_id === ticketId);
  closeBtn.disabled = !(ticket && ticket.status === 'open');
  updateSendButtonState();

  socket.emit('joinTicketRoom', { ticketId });
  await fetchChatHistory(ticketId);
}

async function fetchChatHistory(ticketId) {
  try {
    const res = await fetch(`${APP_URL}/api/tickets/${ticketId}/messages`);
    const messages = await res.json();
    messages.forEach(msg => {
      const label = msg.sender === 'admin' ? 'ADMIN' : 'PLAYER';
      displayMessage({ sender: label, content: msg.content });
    });
    scrollToBottom('chatMessages');
  } catch (err) {
    console.error("Failed to fetch chat history", err);
  }
}

function displayMessage(msg) {
  const div = document.createElement("div");
  div.className = msg.sender.toLowerCase().includes("admin") ? "message admin" : "message user";
  div.textContent = `${msg.sender}: ${msg.content}`;
  document.getElementById("chatMessages").appendChild(div);
  scrollToBottom('chatMessages');
}

function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || !currentTicketId) return;
  messageInput.value = "";
  updateSendButtonState();
  socket.emit('adminMessage', { ticketId: currentTicketId, text: content });
}

function closeCurrentTicket() {
  if (!currentTicketId) return;
  socket.emit('closeTicket', { ticketId: currentTicketId });
}

// Broadcast real-time listener
socket.on('adminBroadcast', (data) => {
  console.log("Broadcast received:", data);

  // Normalize broadcast object
  const newBroadcast = {
    body: data.message || data.body || '',
    sent_at: data.date || data.sent_at || new Date().toISOString()
  };

  // Add to array and render live
  broadcastMessages.push(newBroadcast);
  renderBroadcasts();
});

// Send broadcast
function sendBroadcast() {
  const msgInput = document.getElementById('broadcastMessage');
  const message = msgInput.value.trim();
  if (!message) return alert('Please enter a message.');

  // Emit to server for live delivery
  socket.emit('adminBroadcast', { message });

  // Immediately show it locally
  const newBroadcast = {
    body: message,
    sent_at: new Date().toISOString()
  };
broadcastMessages.unshift(newBroadcast);
renderBroadcasts();


  msgInput.value = '';
}


// ───────────── TOGGLE MODE ─────────────
let isBroadcastMode = false;
toggleBtn.addEventListener('click', () => {
  isBroadcastMode = !isBroadcastMode;
  ticketModeDiv.style.display = isBroadcastMode ? 'none' : 'flex';
  broadcastModeDiv.style.display = isBroadcastMode ? 'flex' : 'none';
  toggleBtn.textContent = isBroadcastMode ? 'Switch to Tickets' : 'Switch to Broadcast';
});

// ───────────── UTILITIES ─────────────
function scrollToBottom(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.scrollTop = container.scrollHeight;
}

function updateSendButtonState() {
  sendButton.disabled = !currentTicketId || closeBtn.disabled;
}

function onSearchInput(e) {
  const query = e.target.value.toLowerCase();
  const filtered = allTickets.filter(ticket => {
    return ticket.ticket_id.toString().includes(query) ||
           ticket.username.toLowerCase().includes(query);
  });
  renderTickets(filtered);
}

function onSortChange(e) {
  const val = e.target.value;
  if (!val) { renderTickets(allTickets); return; }
  const [field, order] = val.split('-');
  if (field === 'ID') {
    const sorted = [...allTickets].sort((a,b)=> order==='asc'? a.ticket_id-b.ticket_id : b.ticket_id-a.ticket_id);
    renderTickets(sorted);
  } else if (field === 'status') {
    const filtered = allTickets.filter(t => t.status.toLowerCase() === order);
    renderTickets(filtered);
  }
}

