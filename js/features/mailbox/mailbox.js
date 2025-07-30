/*-----------------------------------------------------------------------------
  mailbox.js
-----------------------------------------------------------------------------*/
import { $ } from '../../core/utils.js';

// Sample message data - in a real app this would come from a server/database
const messageData = {
  1: {
    title: "Welcome to CatWalk! Your fashion journey begins now.",
    date: "12/06/2025",
    body: `Welcome to CatWalk, the ultimate cat fashion experience!

We're thrilled to have you join our community of cat fashion enthusiasts. Here at CatWalk, you can:

• Collect and customize adorable cats
• Dress them up in the latest fashion trends
• Show off your styling skills in fashion shows
• Earn coins and unlock new outfits
• Connect with other cat lovers

Your journey starts now - explore the shop, customize your cats, and let your creativity shine!

Meow-gnificent adventures await!

- The CatWalk Team`
  },
  2: {
    title: "New outfit collection available in the shop!",
    date: "12/05/2025",
    body: `Exciting news! 

We've just added a brand new collection of outfits to the shop:

🎩 Elegant Top Hats Collection
👗 Summer Breeze Dresses
🕶️ Cool Shades Accessories
👑 Royal Crown Series

Each piece has been carefully designed to make your cats look absolutely stunning. Check out the shop now and give your feline friends the makeover they deserve!

Limited time offer: Get 20% off your first purchase from the new collection!

Happy styling!`
  },
  3: {
    title: "Your cat looks amazing in the latest fashion show!",
    date: "12/04/2025",
    body: `Congratulations!

Your cat absolutely stole the show in yesterday's fashion event! The judges were impressed by your creative styling choices and attention to detail.

Your cat scored:
• Style: 9.5/10
• Creativity: 9.8/10
• Overall Impact: 9.7/10

As a reward for your excellent fashion sense, you've earned 150 bonus coins!

Keep up the fantastic work and we can't wait to see what amazing looks you'll create next.

Strike a pose! 📸`
  },
  4: {
    title: "Reminder: Don't forget to feed your cats daily.",
    date: "12/03/2025",
    body: `Friendly reminder! 🐱

Your cats need daily care to stay happy and healthy. Remember to:

• Feed them their favorite treats
• Give them plenty of attention and pets
• Keep them clean and groomed
• Make sure they get enough rest

Happy cats perform better in fashion shows and are more responsive to styling. A well-cared-for cat is a beautiful cat!

Take good care of your feline friends and they'll reward you with purrs and excellent runway performances.`
  },
  5: {
    title: "System maintenance scheduled for tonight.",
    date: "12/02/2025",
    body: `Important Notice: Scheduled Maintenance

We will be performing system maintenance tonight from 2:00 AM to 4:00 AM EST to improve your CatWalk experience.

During this time:
• The game may be temporarily unavailable
• Fashion shows will be paused
• Shop purchases may be delayed

Expected improvements:
• Faster loading times
• Better outfit rendering
• Enhanced stability
• Bug fixes and performance optimizations

We apologize for any inconvenience and appreciate your patience as we make CatWalk even better!

- Technical Team`
  },
  6: {
    title: "Special event: Double coins weekend starts tomorrow!",
    date: "12/01/2025",
    body: `🎉 DOUBLE COINS WEEKEND! 🎉

Get ready for an amazing weekend event!

Starting tomorrow, you'll earn DOUBLE COINS for:
• Participating in fashion shows
• Completing daily challenges
• Caring for your cats
• Trying new outfit combinations

This is the perfect time to:
• Save up for that expensive outfit you've been eyeing
• Unlock new cat breeds
• Build up your coin reserves

Event runs from Friday 6 PM to Monday 6 AM.

Don't miss out on this incredible opportunity to boost your coin collection!

See you on the runway! ✨`
  },
  7: {
    title: "Got ideas for new outfits or features? Contact us!",
    date: "11/30/2025",
    body: `We Want to Hear From You! 💭

CatWalk is constantly evolving, and YOUR feedback helps shape the future of the game!

We'd love to hear your ideas about:
• New outfit designs and themes
• Fashion show improvements
• Cat breeds you'd like to see
• Quality of life features
• Anything else that would make your experience better!

How to reach us:
• Use the "Contact Us" tab in this mailbox
• Email us at feedback@catwalk-game.com
• Join our community forums

Every suggestion is read and considered by our development team. Some of the best features in CatWalk came directly from player suggestions!

Thank you for helping us make CatWalk purr-fect! 🐾`
  },
  8: {
    title: "Recent outfit loading bugs have been fixed.",
    date: "11/29/2025",
    body: `Bug Fix Update - Version 1.2.3

We've successfully resolved the outfit loading issues that some players experienced last week.

Fixed Issues:
• Outfits not displaying properly after purchase
• Accessories disappearing when switching between cats
• Slow loading times in the customization menu
• Fashion show outfit preview errors

Additional Improvements:
• Smoother transitions between different views
• Better memory management for large outfit collections
• Enhanced compatibility with older devices
• More reliable save system

If you continue to experience any issues, please don't hesitate to contact our support team.

Thank you for your patience and for reporting these bugs!

- Development Team`
  }
};

export function toggleMailbox() {
  const mailboxDisplay = document.getElementById('mailboxDisplay');
  mailboxDisplay.classList.toggle('show');
}

// Make toggleMailbox available globally for HTML onclick handlers
window.toggleMailbox = toggleMailbox;

// Handle button clicking and tab switching
document.addEventListener('DOMContentLoaded', function() {
    const mailboxBtns = document.querySelectorAll('.mailbox-btn');
    
    mailboxBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            mailboxBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the tab type
            const tabType = this.getAttribute('data-tab');
            
            // Show appropriate tab content
            showTabContent(tabType);
        });
    });

    // Add click handlers to message boxes
    setupMessageClickHandlers();
    
    // Add click handlers for message view controls
    setupMessageViewControls();
});

// Function to handle tab content switching
function showTabContent(tabType) {
    const messageList = document.getElementById('allMessagesList');
    const messageView = document.getElementById('messageView');
    const contactView = document.getElementById('contactView');
    
    // Hide all views first
    hideAllViews();
    
    if (tabType === 'all') {
        messageList.style.display = 'flex';
    } else if (tabType === 'contact') {
        showContactView();
    } else {
        // For unread and sent tabs, hide content for now
        messageList.style.display = 'none';
    }
}

// Hide all mailbox views
function hideAllViews() {
    const messageList = document.getElementById('allMessagesList');
    const messageView = document.getElementById('messageView');
    const contactView = document.getElementById('contactView');
    
    messageList.style.display = 'none';
    messageView.style.display = 'none';
    contactView.style.display = 'none';
}

// Show contact us view
function showContactView() {
    const contactView = document.getElementById('contactView');
    const contactViewDate = document.getElementById('contactViewDate');
    const contactInput = document.getElementById('contactInput');
    const contactSubjectInput = document.getElementById('contactSubjectInput');
    
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    contactViewDate.textContent = currentDate;
    
    // Clear the input areas
    contactInput.value = '';
    contactSubjectInput.value = '';
    
    // Show the contact view
    contactView.style.display = 'flex';
}

// Setup click handlers for message boxes
function setupMessageClickHandlers() {
    const messageBoxes = document.querySelectorAll('.message-box');
    
    messageBoxes.forEach(messageBox => {
        messageBox.addEventListener('click', function() {
            const messageId = this.getAttribute('data-message-id');
            showMessageView(messageId);
        });
    });
}

// Setup click handlers for message view controls
function setupMessageViewControls() {
    const backBtn = document.getElementById('backToListBtn');
    const markUnreadBtn = document.getElementById('markUnreadBtn');
    const sendBtn = document.getElementById('sendBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', showMessageList);
    }
    
    if (markUnreadBtn) {
        markUnreadBtn.addEventListener('click', function() {
            markMessageAsUnread();
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            handleSendMessage();
        });
    }
}

// Handle send message functionality
function handleSendMessage() {
    const contactInput = document.getElementById('contactInput');
    const contactSubjectInput = document.getElementById('contactSubjectInput');
    const message = contactInput.value.trim();
    const subject = contactSubjectInput.value.trim();
    
    if (message === '' && subject === '') {
        // Could add a toast notification here in the future
        console.log('No message or subject to send');
        return;
    }
    
    // In a real app, this would send the message to a server
    console.log('Message sent:');
    console.log('Subject:', subject || '(No subject)');
    console.log('Message:', message || '(No message)');
    
    // Clear both inputs
    contactInput.value = '';
    contactSubjectInput.value = '';
    
    // Go back to ALL MESSAGES view
    // First, set the ALL MESSAGES button as active
    const allMessagesBtn = document.querySelector('[data-tab="all"]');
    const mailboxBtns = document.querySelectorAll('.mailbox-btn');
    
    mailboxBtns.forEach(b => b.classList.remove('active'));
    allMessagesBtn.classList.add('active');
    
    // Show the message list
    showMessageList();
}

// Show message detail view
function showMessageView(messageId) {
    const messageList = document.getElementById('allMessagesList');
    const messageView = document.getElementById('messageView');
    const contactView = document.getElementById('contactView');
    const messageViewTitle = document.getElementById('messageViewTitle');
    const messageViewDate = document.getElementById('messageViewDate');
    const messageViewBody = document.getElementById('messageViewBody');
    
    // Get message data
    const message = messageData[messageId];
    if (!message) {
        console.error('Message not found:', messageId);
        return;
    }
    
    // Update message view content
    messageViewTitle.textContent = message.title;
    messageViewDate.textContent = message.date;
    messageViewBody.innerHTML = message.body.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');
    
    // Store current message ID for mark as unread functionality
    messageView.setAttribute('data-current-message-id', messageId);
    
    // Hide all other views and show message view
    messageList.style.display = 'none';
    contactView.style.display = 'none';
    messageView.style.display = 'flex';
}

// Show message list (hide other views)
function showMessageList() {
    const messageList = document.getElementById('allMessagesList');
    const messageView = document.getElementById('messageView');
    const contactView = document.getElementById('contactView');
    
    messageList.style.display = 'flex';
    messageView.style.display = 'none';
    contactView.style.display = 'none';
}

// Mark message as unread (add read class to make it grey)
function markMessageAsUnread() {
    const messageView = document.getElementById('messageView');
    const messageId = messageView.getAttribute('data-current-message-id');
    
    if (messageId) {
        const messageBox = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageBox) {
            messageBox.classList.add('read');
        }
        
        // Go back to message list after marking as unread
        showMessageList();
    }
}