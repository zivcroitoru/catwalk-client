import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

// Create socket connection
const socket = io(APP_URL);

let currentTicketId = null;
let currentSelectedDiv = null;
let allTickets = [];

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
  const label = data.sender === 'user' ? `Player #${data.userId}` : data.sender;
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
      const label = msg.sender === 'admin' ? 'Admin' : `Player #${msg.user_id}`;
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
// Example: Closing a ticket
socket.on('closeTicket', async (ticketId) => {
    try {
        // 1. Update DB to mark as closed
        await DB.query(
            'UPDATE tickets SET status = $1, closed_at = NOW() WHERE id = $2',
            ['closed', ticketId]
        );

        // 2. Find the user who owns the ticket
        const result = await DB.query(
            'SELECT user_id FROM tickets WHERE id = $1',
            [ticketId]
        );

        if (result.rows.length > 0) {
            const userId = result.rows[0].user_id;

            // 3. Notify the user via Socket.IO
            io.to(`user_${userId}`).emit('ticketClosed', {
                ticketId,
                message: 'Your ticket has been closed by an admin.'
            });
        }

        // 4. Update the admin dashboard for all admins
        io.to('admins').emit('ticketStatusUpdated', {
            ticketId,
            status: 'closed'
        });

    } catch (err) {
        console.error('❌ Error closing ticket:', err);
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
    renderTickets(allTickets);
    return;
  }
  const [field, order] = val.split('-');
  const sorted = [...allTickets].sort((a, b) => {
    if (field === 'ID') {
      return order === 'asc' ? a.ticket_id - b.ticket_id : b.ticket_id - a.ticket_id;
    }
    return 0;
  });
  renderTickets(sorted);
}

function updateSendButtonState() {
  sendButton.disabled = !currentTicketId || closeBtn.disabled;
}








// import { APP_URL } from "../../js/core/config.js";
// console.log('APP_URL:', APP_URL);

// const socket = io(APP_URL);

// let currentTicketId = null;
// let currentSelectedDiv = null;  // Track selected ticket div
// let allTickets = [];            // Store all fetched tickets

// const closeBtn = document.getElementById('closeTicketButton');

// document.addEventListener('DOMContentLoaded', () => {
//   fetchTickets();
//   document.getElementById("sendButton").addEventListener("click", sendMessage);
//   document.getElementById("sortSelect").addEventListener("change", onSortChange);
//   document.getElementById("searchInput").addEventListener("input", onSearchInput);
//   closeBtn.addEventListener('click', closeCurrentTicket);
// });

// // Fetch tickets list from server and render
// async function fetchTickets() {
//   try {
//     const res = await fetch(`${APP_URL}/api/tickets`);
//     allTickets = await res.json();
//     renderTickets(allTickets);
//   } catch (err) {
//     console.error("Failed to fetch tickets", err);
//   }
// }

// // Render tickets in sidebar
// function renderTickets(tickets) {
//   const ticketList = document.getElementById("ticketList");
//   ticketList.innerHTML = "";

//   tickets.forEach(ticket => {
//     const div = document.createElement("div");
//     div.className = "ticket-entry";
//     div.textContent = `#${ticket.ticket_id} - ${ticket.username} (${ticket.status})`;

//     div.onclick = () => {
//       selectTicket(ticket.ticket_id, ticket.username);

//       // Highlight clicked ticket
//       if (currentSelectedDiv) {
//         currentSelectedDiv.classList.remove('selected');
//       }
//       div.classList.add('selected');
//       currentSelectedDiv = div;
//     };

//     // Keep highlight if this is currently selected ticket
//     if (ticket.ticket_id === currentTicketId) {
//       div.classList.add('selected');
//       currentSelectedDiv = div;
//     }

//     ticketList.appendChild(div);
//   });
// }

// // Handle ticket selection, load chat and enable close button if open
// async function selectTicket(ticketId, username) {
//   currentTicketId = ticketId;
//   document.getElementById("chatHeader").textContent = `Chat with ${username} (Ticket #${ticketId})`;
//   document.getElementById("chatMessages").innerHTML = "";

//   const ticket = allTickets.find(t => t.ticket_id === ticketId);
//   closeBtn.disabled = !(ticket && ticket.status === 'open');

//   fetchChatHistory(ticketId);
// }

// // Fetch messages for selected ticket
// async function fetchChatHistory(ticketId) {
//   try {
//     const res = await fetch(`${APP_URL}/api/tickets/${ticketId}/messages`);
//     const messages = await res.json();
//     messages.forEach(displayMessage);
//     scrollToBottom();
//   } catch (err) {
//     console.error("Failed to fetch chat history", err);
//   }
// }

// // Show a message in chat area
// function displayMessage(msg) {
//   const div = document.createElement("div");
//   div.className = msg.sender === "admin" ? "message admin" : "message user";
//   div.textContent = msg.content;
//   document.getElementById("chatMessages").appendChild(div);
//   scrollToBottom();
// }

// // Send a message from admin
// async function sendMessage() {
//   const input = document.getElementById("messageInput");
//   const content = input.value.trim();
//   if (!content || !currentTicketId) return;

//   displayMessage({ sender: "admin", content });

//   try {
//     await fetch(`${APP_URL}/api/tickets/${currentTicketId}/messages`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ sender: "admin", content })
//     });
//     input.value = "";
//   } catch (err) {
//     console.error("Failed to send message", err);
//   }
// }

// // Close the currently selected ticket
// async function closeCurrentTicket() {
//   if (!currentTicketId) return;

//   try {
//     const res = await fetch(`${APP_URL}/api/tickets/${currentTicketId}/close`, {
//       method: 'PATCH',
//     });
//     if (res.ok) {
//       alert(`Ticket #${currentTicketId} closed successfully.`);
//       closeBtn.disabled = true;

//       // Update local tickets and re-render list
//       const ticket = allTickets.find(t => t.ticket_id === currentTicketId);
//       if (ticket) ticket.status = 'closed';
//       renderTickets(allTickets);
//     } else {
//       alert('Failed to close the ticket.');
//     }
//   } catch (err) {
//     console.error('Error closing ticket:', err);
//     alert('Error closing the ticket.');
//   }
// }

// // Scroll chat messages to bottom
// function scrollToBottom() {
//   const container = document.getElementById("chatMessages");
//   container.scrollTop = container.scrollHeight;
// }

// // Search input handler: filter tickets by ID or username
// function onSearchInput(e) {
//   const query = e.target.value.toLowerCase();
//   const filtered = allTickets.filter(ticket => {
//     const idMatch = ticket.ticket_id.toString().includes(query);
//     const usernameMatch = ticket.username.toLowerCase().includes(query);
//     return idMatch || usernameMatch;
//   });
//   renderTickets(filtered);
// }

// // Sort selection handler: sort tickets by ID asc/desc
// function onSortChange(e) {
//   const val = e.target.value;
//   if (!val) {
//     renderTickets(allTickets);
//     return;
//   }

//   const [field, order] = val.split('-'); // e.g. "ID-asc"
//   const sorted = [...allTickets].sort((a, b) => {
//     if (field === 'ID') {
//       return order === 'asc' ? a.ticket_id - b.ticket_id : b.ticket_id - a.ticket_id;
//     }
//     return 0;
//   });

//   renderTickets(sorted);
// }
