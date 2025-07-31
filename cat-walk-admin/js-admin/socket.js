// socket.js
export const socket = io("https://catwalk-server-eu.onrender.com", {
  auth: {
    token: localStorage.getItem("adminToken"), // Or use a hardcoded token for now if needed
  },
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket.io as admin");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket.io connection failed:", err.message);
});
