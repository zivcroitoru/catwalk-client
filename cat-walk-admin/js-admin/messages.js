import { APP_URL } from "../../js/core/config.js";
console.log("APP_URL:", APP_URL);

const tableContainer = document.querySelector(".table");
const warningMessage = document.getElementById("warning");
const searchInput = document.querySelector(".search-bar input");
const sortSelect = document.getElementById("sortSelect");
let allTickets = [];

const table = document.createElement("table");
Object.assign(table.style, {
  borderCollapse: "collapse",
  width: "100%",
});
tableContainer.appendChild(table);

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

function goToTicketPage(ticketId) {
  // Save the ticketId to localStorage or URL query param
  localStorage.setItem("chatRoomId", `ticket_${ticketId}`);
  window.location.href = `chat.html`; // Create this page next
}


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
    console.log(`Ticket ${ticketId} deleted`);
  } catch (err) {
    console.error("Failed to delete ticket:", err);
    alert("Failed to delete ticket.");
  }
}

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

  const actionsTd = document.createElement("td");
  actionsTd.style.textAlign = "center";
  actionsTd.style.backgroundColor = "#fff";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.title = "Delete Ticket";
  deleteBtn.style.padding = "4px 8px";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTicket(ticket.id, row);
  });

  actionsTd.appendChild(deleteBtn);
  row.appendChild(actionsTd);

  return row;
}

function renderTickets(tickets) {
  table.querySelectorAll("tr:not(:first-child)").forEach((row) => row.remove());
  tickets.forEach((ticket) => {
    table.appendChild(createTicketRow(ticket));
  });
}

async function loadExistingTickets() {
  try {
    const res = await fetch(`${APP_URL}/api/admins/tickets`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tickets");

    allTickets = await res.json();
    renderTickets(allTickets);
  } catch (err) {
    console.error("Error loading tickets:", err);
    if (warningMessage) warningMessage.textContent = "Failed to load tickets.";
  }
}

function connectToSocket() {
  const socket = io(APP_URL, {
    auth: {
      token: localStorage.getItem("adminToken"),
    },
  });

  socket.on("connect", () => {
    console.log("Connected to ticket server");
  });

  socket.on("connect_error", (err) => {
    console.error(" Socket.io connection error:", err.message);
    if (warningMessage) warningMessage.textContent = "Could not connect to server.";
  });

  socket.on("new_ticket_notification", ({ ticket }) => {
    console.log("New ticket received:", ticket);
    allTickets.push(ticket);
    renderTickets(allTickets);
  });
}

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();

  const filtered = allTickets.filter((ticket) => {
    return (
      String(ticket.id).includes(query) ||
      (ticket.subject && ticket.subject.toLowerCase().includes(query)) ||
      String(ticket.player_id).includes(query) ||
      (ticket.status && ticket.status.toLowerCase().includes(query))
    );
  });

  renderTickets(filtered);
});

sortSelect.addEventListener("change", (e) => {
  const value = e.target.value;

  let sortedTickets = [...allTickets];

  if (value === "ID-asc") {
    sortedTickets.sort((a, b) => a.id - b.id);
  } else if (value === "ID-desc") {
    sortedTickets.sort((a, b) => b.id - a.id);
  }

  renderTickets(sortedTickets);
});

loadExistingTickets();
connectToSocket();
