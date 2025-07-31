/*-----------------------------------------------------------------------------
  mailbox.js - Fixed mailbox system with better debugging and error handling
-----------------------------------------------------------------------------*/

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

// Sample conversation data for SENT tab
const conversationData = {
  title: "Feedback about cat outfits",
  date: "12/06/2025",
  messages: [
    {
      type: "sent",
      content: "I love the new outfit collections! The summer dresses are particularly cute. However, I noticed that some of the accessories don't quite match the color palette of certain cat breeds. Would it be possible to add more color variations?",
      timestamp: "12/01/2025 10:30 AM"
    },
    {
      type: "received", 
      content: "Thank you so much for your feedback! We're thrilled you're enjoying the summer collection. You make an excellent point about color coordination. Our design team is already working on expanding the color palette for accessories to better complement all cat breeds. Expect to see updates in the next patch!",
      timestamp: "12/01/2025 2:15 PM"
    },
    {
      type: "sent",
      content: "That's fantastic news! While I have your attention, could you also consider adding some winter-themed outfits? My cats would look adorable in little scarves and winter hats!",
      timestamp: "12/02/2025 9:45 AM"
    },
    {
      type: "received",
      content: "Winter collection - what a purr-fect idea! ❄️ We've actually been planning exactly that for the upcoming holiday season. Expect cozy scarves, warm mittens, and festive winter hats. We'll also be adding snow-themed backgrounds for the fashion shows. Stay tuned!",
      timestamp: "12/02/2025 11:20 AM"
    }
  ]
};

// ===== MAIN MAILBOX FUNCTIONS =====

export function toggleMailbox() {
  console.log('🐱 toggleMailbox called');
  const mailboxDisplay = document.getElementById('mailboxDisplay');
  if (mailboxDisplay) {
    const isVisible = mailboxDisplay.classList.contains('show');
    console.log(`Mailbox currently ${isVisible ? 'visible' : 'hidden'}, toggling...`);
    mailboxDisplay.classList.toggle('show');
    
    // If we're showing the mailbox and handlers aren't set up, set them up now
    if (!isVisible && !mailboxDisplay.hasAttribute('data-handlers-setup')) {
      console.log('📧 Setting up handlers as mailbox becomes visible...');
      setupMailboxHandlers();
    }
  } else {
    console.error('❌ Mailbox display element not found!');
  }
}

export function initializeMailbox() {
  console.log('🐱 Initializing mailbox system...');
  
  // Use a more robust approach to ensure DOM is ready
  const init = () => {
    console.log('🐱 DOM ready, setting up mailbox...');
    
    // Add a small delay to ensure all elements are fully rendered
    setTimeout(() => {
      const mailboxDisplay = document.getElementById('mailboxDisplay');
      if (mailboxDisplay) {
        console.log('✅ Mailbox display found, checking for buttons...');
        const buttons = mailboxDisplay.querySelectorAll('.mailbox-btn');
        console.log(`Found ${buttons.length} mailbox buttons`);
        
        if (buttons.length > 0) {
          setupMailboxHandlers();
        } else {
          console.warn('⚠️ No mailbox buttons found during initialization');
        }
      } else {
        console.error('❌ Mailbox display not found during initialization');
      }
    }, 100);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// ===== PRIVATE FUNCTIONS =====

function setupMailboxHandlers() {
  console.log('🐱 Setting up mailbox handlers...');
  
  const mailboxDisplay = document.getElementById('mailboxDisplay');
  if (!mailboxDisplay) {
    console.error('❌ Cannot setup handlers: mailbox display not found');
    return;
  }
  
  // Check if handlers are already set up
  if (mailboxDisplay.hasAttribute('data-handlers-setup')) {
    console.log('✅ Handlers already set up, skipping...');
    return;
  }
  
  // Setup tab button handlers
  const mailboxBtns = mailboxDisplay.querySelectorAll('.mailbox-btn');
  console.log(`🔍 Found ${mailboxBtns.length} mailbox buttons`);
  
  if (mailboxBtns.length === 0) {
    console.error('❌ No mailbox buttons found!');
    return;
  }
  
  mailboxBtns.forEach((btn, index) => {
    const tabType = btn.getAttribute('data-tab');
    console.log(`📝 Setting up button ${index + 1}: ${tabType}`);
    
    // Remove any existing listeners to prevent duplicates
    btn.removeEventListener('click', handleTabClick);
    
    // Add the click handler
    btn.addEventListener('click', handleTabClick);
  });
  
  // Setup message click handlers
  setupMessageClickHandlers();
  
  // Setup control button handlers
  setupMessageViewControls();
  setupSentViewControls();
  
  // Mark handlers as set up
  mailboxDisplay.setAttribute('data-handlers-setup', 'true');
  
  console.log('✅ Mailbox handlers initialized successfully');
}

// Separate function for tab click handling to avoid closure issues
function handleTabClick(event) {
  const clickedBtn = event.currentTarget;
  const tabType = clickedBtn.getAttribute('data-tab');
  
  console.log(`🔄 Tab clicked: ${tabType}`);
  
  // Remove active class from all buttons
  const allBtns = document.querySelectorAll('.mailbox-btn');
  allBtns.forEach(b => b.classList.remove('active'));
  
  // Add active class to clicked button
  clickedBtn.classList.add('active');
  
  // Show appropriate content
  showTabContent(tabType);
}

function showTabContent(tabType) {
  console.log(`🔄 Showing tab content: ${tabType}`);
  
  const messageList = document.getElementById('allMessagesList');
  const messageView = document.getElementById('messageView');
  const contactView = document.getElementById('contactView');
  const sentView = document.getElementById('sentView');
  
  // Hide all views first
  hideAllViews();
  
  if (tabType === 'all') {
    if (messageList) {
      messageList.style.display = 'flex';
      console.log('✅ Showing all messages');
    } else {
      console.error('❌ All messages list not found');
    }
  } else if (tabType === 'contact') {
    showContactView();
  } else if (tabType === 'sent') {
    showSentView();
  } else if (tabType === 'unread') {
    // For unread tab, show empty for now
    if (messageList) messageList.style.display = 'none';
    console.log('✅ Showing unread (empty for now)');
  }
}

function hideAllViews() {
  const views = ['allMessagesList', 'messageView', 'contactView', 'sentView'];
  views.forEach(viewId => {
    const view = document.getElementById(viewId);
    if (view) view.style.display = 'none';
  });
}

function showContactView() {
  console.log('📧 Showing contact view');
  const contactView = document.getElementById('contactView');
  const contactViewDate = document.getElementById('contactViewDate');
  const contactInput = document.getElementById('contactInput');
  const contactSubjectInput = document.getElementById('contactSubjectInput');
  
  if (!contactView) {
    console.error('❌ Contact view not found');
    return;
  }
  
  // Set current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  if (contactViewDate) contactViewDate.textContent = currentDate;
  
  // Clear inputs
  if (contactInput) contactInput.value = '';
  if (contactSubjectInput) contactSubjectInput.value = '';
  
  contactView.style.display = 'flex';
  console.log('✅ Contact view shown');
}

function showSentView() {
  console.log('📤 Showing sent view');
  const sentView = document.getElementById('sentView');
  const sentViewTitle = document.getElementById('sentViewTitle');
  const sentViewDate = document.getElementById('sentViewDate');
  const conversationContainer = document.getElementById('conversationContainer');
  const replyInput = document.getElementById('replyInput');
  
  if (!sentView) {
    console.error('❌ Sent view not found');
    return;
  }
  
  // Set conversation title and date
  if (sentViewTitle) sentViewTitle.textContent = conversationData.title;
  if (sentViewDate) sentViewDate.textContent = conversationData.date;
  
  // Clear previous content
  if (conversationContainer) conversationContainer.innerHTML = '';
  if (replyInput) replyInput.value = '';
  
  // Populate conversation messages
  if (conversationContainer) {
    conversationData.messages.forEach(message => {
      const messageBubble = document.createElement('div');
      messageBubble.className = `message-bubble ${message.type}`;
      messageBubble.textContent = message.content;
      conversationContainer.appendChild(messageBubble);
    });
  }
  
  sentView.style.display = 'flex';
  
  // Scroll to bottom
  setTimeout(() => {
    if (conversationContainer) {
      conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }
  }, 100);
  
  console.log('✅ Sent view shown');
}

function setupMessageClickHandlers() {
  const messageBoxes = document.querySelectorAll('.message-box');
  console.log(`📨 Setting up ${messageBoxes.length} message click handlers`);
  
  messageBoxes.forEach(messageBox => {
    messageBox.addEventListener('click', function() {
      const messageId = this.getAttribute('data-message-id');
      console.log(`📧 Message clicked: ${messageId}`);
      if (messageId) showMessageView(messageId);
    });
  });
}

function setupMessageViewControls() {
  const backBtn = document.getElementById('backToListBtn');
  const markUnreadBtn = document.getElementById('markUnreadBtn');
  const sendBtn = document.getElementById('sendBtn');
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      console.log('⬅️ Back button clicked');
      showMessageList();
    });
  }
  
  if (markUnreadBtn) {
    markUnreadBtn.addEventListener('click', () => {
      console.log('📝 Mark unread button clicked');
      markMessageAsUnread();
    });
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      console.log('📤 Send button clicked');
      handleSendMessage();
    });
  }
}

function setupSentViewControls() {
  const sentSendBtn = document.getElementById('sentSendBtn');
  if (sentSendBtn) {
    sentSendBtn.addEventListener('click', () => {
      console.log('📤 Sent send button clicked');
      handleSentReply();
    });
  }
}

function showMessageView(messageId) {
  console.log(`📧 Showing message view for ID: ${messageId}`);
  const message = messageData[messageId];
  if (!message) {
    console.error('❌ Message not found:', messageId);
    return;
  }
  
  const messageView = document.getElementById('messageView');
  const messageViewTitle = document.getElementById('messageViewTitle');
  const messageViewDate = document.getElementById('messageViewDate');
  const messageViewBody = document.getElementById('messageViewBody');
  
  if (!messageView) {
    console.error('❌ Message view not found');
    return;
  }
  
  // Update content
  if (messageViewTitle) messageViewTitle.textContent = message.title;
  if (messageViewDate) messageViewDate.textContent = message.date;
  if (messageViewBody) {
    messageViewBody.innerHTML = message.body.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('');
  }
  
  // Store message ID for unread functionality
  messageView.setAttribute('data-current-message-id', messageId);
  
  // Hide other views and show message view
  hideAllViews();
  messageView.style.display = 'flex';
  
  console.log('✅ Message view shown');
}

function showMessageList() {
  console.log('📋 Showing message list');
  hideAllViews();
  const messageList = document.getElementById('allMessagesList');
  if (messageList) {
    messageList.style.display = 'flex';
    console.log('✅ Message list shown');
  } else {
    console.error('❌ Message list not found');
  }
}

function markMessageAsUnread() {
  const messageView = document.getElementById('messageView');
  if (!messageView) return;
  
  const messageId = messageView.getAttribute('data-current-message-id');
  if (messageId) {
    const messageBox = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageBox) {
      messageBox.classList.add('read');
      console.log(`✅ Message ${messageId} marked as read`);
    }
    showMessageList();
  }
}

function handleSendMessage() {
  const contactInput = document.getElementById('contactInput');
  const contactSubjectInput = document.getElementById('contactSubjectInput');
  
  const message = contactInput?.value.trim() || '';
  const subject = contactSubjectInput?.value.trim() || '';
  
  if (message === '' && subject === '') {
    console.log('⚠️ No message or subject to send');
    return;
  }
  
  // Log the message (in real app, would send to server)
  console.log('📤 Message sent:');
  console.log('Subject:', subject || '(No subject)');
  console.log('Message:', message || '(No message)');
  
  // Clear inputs
  if (contactInput) contactInput.value = '';
  if (contactSubjectInput) contactSubjectInput.value = '';
  
  // Return to ALL MESSAGES view
  const allMessagesBtn = document.querySelector('[data-tab="all"]');
  const mailboxBtns = document.querySelectorAll('.mailbox-btn');
  
  mailboxBtns.forEach(b => b.classList.remove('active'));
  if (allMessagesBtn) allMessagesBtn.classList.add('active');
  
  showMessageList();
}

function handleSentReply() {
  const replyInput = document.getElementById('replyInput');
  const conversationContainer = document.getElementById('conversationContainer');
  
  const message = replyInput?.value.trim() || '';
  if (message === '') {
    console.log('⚠️ No reply message to send');
    return;
  }
  
  // Add message to conversation data
  const newMessage = {
    type: "sent",
    content: message,
    timestamp: new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  conversationData.messages.push(newMessage);
  
  // Add to UI
  if (conversationContainer) {
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble sent';
    messageBubble.textContent = message;
    conversationContainer.appendChild(messageBubble);
    
    // Scroll to bottom
    setTimeout(() => {
      conversationContainer.scrollTop = conversationContainer.scrollHeight;
    }, 100);
  }
  
  // Clear input
  if (replyInput) replyInput.value = '';
  
  console.log('📤 Reply sent:', message);
  
  // Return to ALL MESSAGES view
  const allMessagesBtn = document.querySelector('[data-tab="all"]');
  const mailboxBtns = document.querySelectorAll('.mailbox-btn');
  
  mailboxBtns.forEach(b => b.classList.remove('active'));
  if (allMessagesBtn) allMessagesBtn.classList.add('active');
  
  showMessageList();
}

// Make toggleMailbox available globally for HTML onclick handlers
if (typeof window !== 'undefined') {
  window.toggleMailbox = toggleMailbox;
}