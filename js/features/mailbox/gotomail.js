
import { APP_URL } from '../../core/config.js';
console.log('APP_URL:', APP_URL);

// mailbox.js
const userId = localStorage.getItem('userId');
console.log('📬 Current user ID:', userId);



document.addEventListener("DOMContentLoaded", () => {
    const mailboxIcon = document.getElementById("mailbox-icon");

    if (mailboxIcon) {
        mailboxIcon.addEventListener("click", () => {
            
            window.location.href = `mailbox.html?id=${userId}`
        });
    }
});

