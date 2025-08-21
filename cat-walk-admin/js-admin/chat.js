// import { APP_URL } from "../../js/core/config.js";  // Adjust path if needed

// const socket = io(APP_URL, {
//   withCredentials: true,
// });

// const messagesDiv = document.getElementById("messages");
// const inputMessage = document.getElementById("input-message");
// const sendBtn = document.getElementById("send-btn");

// const roomId = localStorage.getItem("chatRoomId");

// if (!roomId) {
//   alert("No chat room selected.");
//   throw new Error("No chat room selected.");
// }

// socket.emit("joinRoom", { roomId });

// async function loadMessages() {
//   try {
//     const res = await fetch(`${APP_URL}/api/messages/${roomId}/messages`);
//     if (!res.ok) throw new Error("Failed to load messages");
//     const messages = await res.json();

//     messagesDiv.innerHTML = ""; // Clear existing
//     messages.forEach(({ sender_id, message_text, timestamp }) => {
//       addMessageToDOM(sender_id, message_text, timestamp);
//     });

//     scrollToBottom();
//   } catch (err) {
//     console.error(err);
//   }
// }

// function addMessageToDOM(senderId, message, timestamp) {
//   const msgDiv = document.createElement("div");
//   const time = new Date(timestamp).toLocaleTimeString();

//   msgDiv.textContent = `[${time}] ${senderId === "admin" ? "You" : "User " + senderId}: ${message}`;

//   // Style messages differently
//   if (senderId === "admin") {
//     msgDiv.style.backgroundColor = "#DCF8C6";  // light green for admin
//     msgDiv.style.textAlign = "right";
//   } else {
//     msgDiv.style.backgroundColor = "#F1F0F0";  // light gray for user
//     msgDiv.style.textAlign = "left";
//   }

//   msgDiv.style.padding = "5px 10px";
//   msgDiv.style.marginBottom = "8px";
//   msgDiv.style.borderRadius = "8px";
//   msgDiv.style.maxWidth = "80%";
//   messagesDiv.appendChild(msgDiv);
// }

// // Scroll chat to bottom
// function scrollToBottom() {
//   messagesDiv.scrollTop = messagesDiv.scrollHeight;
// }

// // Handle incoming live messages
// socket.on("newMessage", ({ senderId, message, timestamp }) => {
//   addMessageToDOM(senderId, message, timestamp);
//   scrollToBottom();
// });

// // Send new message
// sendBtn.disabled = true;

// sendBtn.onclick = () => {
//   const message = inputMessage.value.trim();
//   if (!message) return;

//   socket.emit("sendMessage", {
//     roomId,
//     senderId: "admin", // Replace with actual admin ID if available
//     message,
//   });

//   inputMessage.value = "";
//   sendBtn.disabled = true;
//   inputMessage.focus();
// };

// // Enable/disable send button based on input
// inputMessage.addEventListener("input", () => {
//   sendBtn.disabled = inputMessage.value.trim() === "";
// });

// // Allow sending message by pressing Enter key
// inputMessage.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     sendBtn.click();
//     event.preventDefault();
//   }
// });

// // Load messages on page load
// loadMessages();
