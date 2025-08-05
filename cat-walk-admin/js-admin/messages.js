// messages.js
import { APP_URL } from "../../js/core/config.js";

console.log("APP_URL:", APP_URL);

// Connect to Socket.IO server
const socket = io(APP_URL, {
  withCredentials: true
});

console.log("Connected as admin:", socket.id);


const tableDiv = document.querySelector(".table");

async function fetchUsers() {
  try {
    const res = await fetch(`${APP_URL}/api/players`); // Adjust this if you use a different endpoint
    const data = await res.json();

    renderUserList(data);
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
}

function renderUserList(users) {
  if (!users.length) {
    tableDiv.innerHTML = "<p>No users found</p>";
    return;
  }

  const html = users.map(user => `
    <div class="user-row" data-id="${user.id}">
      <strong>${user.username}</strong> (ID: ${user.id})
    </div>
  `).join("");

  tableDiv.innerHTML = html;

  document.querySelectorAll(".user-row").forEach(row => {
    row.addEventListener("click", () => {
      const userId = row.dataset.id;
      openChatWithUser(userId);
    });
  });
}

fetchUsers();
