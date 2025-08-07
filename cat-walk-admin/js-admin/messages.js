import { APP_URL } from "../../js/core/config.js";
console.log('APP_URL:', APP_URL);

const socket = io(APP_URL);

let currentUserId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchChatUsers();
  document.getElementById("sendButton").addEventListener("click", sendMessage);
});

async function fetchChatUsers() {
  try {
    const res = await fetch(`${APP_URL}/api/messages/users`);
    const users = await res.json();
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    users.forEach(user => {
      const div = document.createElement("div");
      div.className = "user-entry";
      div.textContent = user.username;
      div.onclick = () => selectUser(user.id, user.username);
      userList.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to fetch chat users", err);
  }
}

async function selectUser(userId, username) {
  currentUserId = userId;
  document.getElementById("chatHeader").textContent = `Chat with ${username}`;
  document.getElementById("chatMessages").innerHTML = "";

  // Admin joins the socket room
  const roomId = `admin_user_${userId}`;
  socket.emit("joinRoom", { roomId });

  fetchChatHistory(userId);
}


async function fetchChatHistory(userId) {
  try {
    const res = await fetch(`${APP_URL}/api/messages/${userId}`);
    const messages = await res.json();
    messages.forEach(displayMessage);
    scrollToBottom(); // 💖 auto-scroll after loading history
  } catch (err) {
    console.error("Failed to fetch chat history", err);
  }
}

function displayMessage(msg) {
  const div = document.createElement("div");
  div.className = msg.sender === "admin" ? "message admin" : "message user";
  div.textContent = msg.content;
  document.getElementById("chatMessages").appendChild(div);
  scrollToBottom(); // 💖 auto-scroll on each message
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const content = input.value.trim();
  if (!content || !currentUserId) return;

  const msg = {
    receiverId: currentUserId,
    content
  };

  // Display it instantly
  displayMessage({ sender: "admin", content });

  // Emit to socket room
  socket.emit("sendMessage", {
    roomId: `admin_user_${currentUserId}`,
    senderId: 0,
    message: content
  });

  // Save to DB
  try {
    await fetch(`${APP_URL}/api/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg)
    });
  } catch (err) {
    console.error("Failed to send message", err);
  }

  input.value = "";
}


socket.on("userMessage", (msg) => {
  if (msg.senderId === currentUserId) {
    displayMessage({ sender: "user", content: msg.content });
  }
});

function scrollToBottom() { // 💖 scroll helper
  const container = document.getElementById("chatMessages");
  container.scrollTop = container.scrollHeight;
}
