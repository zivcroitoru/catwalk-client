import { APP_URL } from "../../js/core/config.js";
console.log("APP_URL:", APP_URL);

// Elements
const tableContainer = document.querySelector(".table");
const warningMessage = document.getElementById("warning");

// Create and append table
const table = document.createElement("table");
Object.assign(table.style, {
  borderCollapse: "collapse",
  width: "100%",
});
tableContainer.appendChild(table);

// Create header row
const headers = ["Ticket ID", "Subject", "Player ID", "Status", "Last Activity", "Actions"];
const headerRow = document.createElement("tr");

headers.forEach((header) => {
  const th = document.createElement("th");
  th.textContent = header;
  Object.assign(th.style, {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#838E84",
    color: "white",
  });
  headerRow.appendChild(th);
});

table.appendChild(headerRow);

// Navigate to ticket details
function goToTicketPage(ticketId) {
    localStorage.setItem('ticket', ticketId);
  window.location.href = `chosen-message.html?id=${ticketId}`;
}

// Delete ticket
async function deleteTicket(ticketId, rowElement) {
  const confirmed = confirm("Are you sure you want to delete this ticket?");
  if (!confirmed) return;

  try {
    const res = await fetch(`${APP_URL}/api/admins/tickets/${ticketId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (!res.ok) throw new Error("Delete failed");

    rowElement.remove();
    console.log(`🗑️ Ticket ${ticketId} deleted`);
  } catch (err) {
    console.error("❌ Failed to delete ticket:", err);
    alert("Failed to delete ticket.");
  }
}

// Create row for a ticket
function createTicketRow(ticket) {
  const row = document.createElement("tr");
  row.style.cursor = "pointer";

  const cells = [
    ticket.id,
    ticket.subject || "No subject",
    ticket.player_id || "Unknown",
    ticket.status || "Open",
    new Date(ticket.last_activity_at).toLocaleString(),
  ];

  cells.forEach((text) => {
    const td = document.createElement("td");
    td.textContent = text;
    Object.assign(td.style, {
      border: "1px solid #ccc",
      padding: "8px",
      textAlign: "center",
      backgroundColor: "#fff",
    });
    td.addEventListener("click", () => goToTicketPage(ticket.id));
    row.appendChild(td);
  });

  // Actions column with delete button
  const actionsTd = document.createElement("td");
  actionsTd.style.textAlign = "center";
  actionsTd.style.backgroundColor = "#fff";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Delete Ticket";
  deleteBtn.style.padding = "4px 8px";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent row click
    deleteTicket(ticket.id, row);
  });

  actionsTd.appendChild(deleteBtn);
  row.appendChild(actionsTd);

  return row;
}

// Load existing tickets from backend
async function loadExistingTickets() {
  try {
    const res = await fetch(`${APP_URL}/api/admins/tickets`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tickets");

    const tickets = await res.json();
    tickets.forEach((ticket) => {
      table.appendChild(createTicketRow(ticket));
    });
  } catch (err) {
    console.error("Error loading tickets:", err);
    if (warningMessage) warningMessage.textContent = "⚠️ Failed to load tickets.";
  }
}

// Setup real-time Socket.io connection
function connectToSocket() {
  const socket = io(APP_URL, {
    auth: {
      token: localStorage.getItem("adminToken"),
    },
  });

  socket.on("connect", () => {
    console.log("✅ Connected to ticket server");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket.io connection error:", err.message);
    if (warningMessage) warningMessage.textContent = "❌ Could not connect to server.";
  });

  socket.on("new_ticket_notification", ({ ticket }) => {
    console.log("📩 New ticket received:", ticket);
    const newRow = createTicketRow(ticket);
    table.appendChild(newRow);
  });
}

// Initialize
loadExistingTickets();
connectToSocket();
