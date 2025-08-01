import { APP_URL } from "../../js/core/config.js";

console.log("APP_URL:", APP_URL);

document.addEventListener('DOMContentLoaded', async () => {
  const ticketId = localStorage.getItem('ticket');
  if (!ticketId) {
    console.error("No ticket ID found in localStorage.");
    return;
  }

  // Load existing messages (same as before)
  try {
    const res = await fetch(`${APP_URL}/api/admins/messages/${ticketId}`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    const messages = await res.json();

    if (messages.length === 0) {
      console.warn("No messages found for this ticket.");
    } else {
      const playerMessages = document.querySelectorAll('.player-message p');
      const responseMessages = document.querySelectorAll('.response p');

      playerMessages.forEach(pm => pm.textContent = '');
      responseMessages.forEach(rm => rm.textContent = '');

      let playerIndex = 0;
      let responseIndex = 0;

      messages.forEach(msg => {
        if (msg.sender_type === 'player') {
          if (playerMessages[playerIndex]) {
            playerMessages[playerIndex].textContent = msg.body || 'No message body';
            playerIndex++;
          }
        } else if (msg.sender_type === 'admin') {
          if (responseMessages[responseIndex]) {
            responseMessages[responseIndex].textContent = msg.body || 'No response yet';
            responseIndex++;
          }
        }
      });
    }
  } catch (err) {
    console.error("Error loading messages:", err);
  }

  // Editable admin response div
  const myResponseDiv = document.querySelector('.my-curr-response');
  myResponseDiv.setAttribute('contenteditable', 'true');

  // Load saved message from localStorage
  const savedText = localStorage.getItem('myCurrResponseText');
  if (savedText) {
    myResponseDiv.innerText = savedText;
  }

  // Save text on Enter key without clearing
  myResponseDiv.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const text = myResponseDiv.innerText.trim();
      if (text.length > 0) {
        localStorage.setItem('myCurrResponseText', text);
        console.log('Saved to localStorage:', text);
      }
    }
  });

  // Send button click handler
  const sendButton = document.querySelector('.send-button');
  sendButton.addEventListener('click', async () => {
    const messageBody = myResponseDiv.innerText.trim();
    if (!messageBody) {
      alert("Please enter a message before sending.");
      return;
    }

    try {
      const res = await fetch(`${APP_URL}/api/admins/messages/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ body: messageBody }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await res.json();
      console.log("Message sent successfully:", newMessage);

      // Append new message to the .response divs
      // Find the first empty or last .response p
      const responseDiv = document.querySelector('.response');
      if (responseDiv) {
        const p = document.createElement('p');
        p.textContent = newMessage.body;
        // Append as a new response block or update existing? 
        // Here we append a new .response div below content
        const newResponseDiv = document.createElement('div');
        newResponseDiv.classList.add('response');
        newResponseDiv.appendChild(p);

        const contentDiv = document.querySelector('.content');
        contentDiv.insertBefore(newResponseDiv, sendButton);
      }

      // Clear localStorage saved message but keep text visible
      localStorage.removeItem('myCurrResponseText');

      // Optionally clear the editable div or leave text there, here we leave it

    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  });
});
