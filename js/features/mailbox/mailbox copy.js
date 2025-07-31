/*-----------------------------------------------------------------------------
  mailbox.js - Enhanced mailbox system with conversation history for SENT
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

// Enhanced SENT message data with conversation history
const sentMessageData = {
  1: {
    title: "Feedback about cat outfits and color coordination",
    date: "12/01/2025",
    conversation: [
      {
        sender: "player",
        message: `Hi CatWalk Team,
I love the new outfit collections! The summer dresses are particularly cute. However, I noticed that some of the accessories don't quite match the color palette of certain cat breeds. 
Would it be possible to add more color variations for accessories to better complement all the different cat breeds?
Thanks for all your hard work on this amazing game!
Best regards,
A CatWalk Fan`,
        timestamp: "12/01/2025 2:30 PM"
      },
      {
        sender: "admin",
        message: `Hello!
Thank you so much for your thoughtful feedback! We're delighted to hear that you're enjoying the summer dress collection.
Your observation about color coordination is spot-on and actually something our design team has been discussing. We're planning to release expanded color palettes for accessories in our next update.
Keep an eye out for the announcement in the coming weeks!
Best regards,
CatWalk Design Team`,
        timestamp: "12/01/2025 4:15 PM"
      },
      {
        sender: "player",
        message: `That's fantastic news! I'm really excited to see the new color options. Will this include the hat collection as well?`,
        timestamp: "12/01/2025 6:20 PM"
      },
      {
        sender: "admin",
        message: `Absolutely! The hat collection will be getting the same treatment. We're particularly excited about adding some seasonal color variants that should pair beautifully with all cat breeds.`,
        timestamp: "12/02/2025 9:00 AM"
      }
    ]
  },
  2: {
    title: "Suggestion for winter-themed outfits",
    date: "11/28/2025",
    conversation: [
      {
        sender: "player",
        message: `Hello!
I was wondering if you could consider adding some winter-themed outfits? My cats would look absolutely adorable in little scarves and winter hats!
Maybe you could also add some snow-themed backgrounds for the fashion shows during the winter season?
Thanks for considering my suggestion!`,
        timestamp: "11/28/2025 1:45 PM"
      },
      {
        sender: "admin",
        message: `What a lovely suggestion! Winter-themed outfits sound absolutely adorable. We're actually in the early planning stages for our winter collection.
Scarves and winter hats are definitely on our list, along with cozy sweaters and maybe even some tiny boots!
The snow-themed backgrounds idea is brilliant too - we'll share this with our environment art team.
Thank you for the creative input!`,
        timestamp: "11/28/2025 5:20 PM"
      },
      {
        sender: "player",
        message: `Oh wow, tiny boots would be so cute! When do you think the winter collection might be released?`,
        timestamp: "11/29/2025 8:30 AM"
      }
    ]
  },
  3: {
    title: "Bug report - outfit loading issue",
    date: "11/25/2025",
    conversation: [
      {
        sender: "player",
        message: `Hi Support Team,
I've been experiencing an issue where some outfits don't display properly after purchase. The accessories seem to disappear when I switch between different cats.
This happens most often with the new hat collection. Is this a known issue?
Thanks for your help!`,
        timestamp: "11/25/2025 3:10 PM"
      },
      {
        sender: "admin",
        message: `Hi there!
Thank you for reporting this issue. Yes, this is a known bug that we're actively working on fixing. It seems to affect the hat collection specifically due to a rendering conflict.
As a temporary workaround, try refreshing the page after switching cats - this should restore the missing accessories.
We expect to have a permanent fix deployed by the end of this week.
Sorry for the inconvenience!`,
        timestamp: "11/25/2025 4:45 PM"
      },
      {
        sender: "player",
        message: `Thanks for the quick response! The workaround helps. Looking forward to the fix.`,
        timestamp: "11/25/2025 6:00 PM"
      },
      {
        sender: "admin",
        message: `Great news! The fix has been deployed. You should no longer experience the disappearing accessories issue. Let us know if you encounter any other problems!`,
        timestamp: "11/29/2025 2:30 PM"
      }
    ]
  },
  4: {
    title: "Thank you for the Double Coins Weekend!",
    date: "11/20/2025",
    conversation: [
      {
        sender: "player",
        message: `Dear CatWalk Team,
I just wanted to say thank you for the amazing Double Coins Weekend event! It was so much fun and I was able to save up enough coins to buy some really cool outfits for my cats.
Please consider doing more events like this in the future!
Best wishes,
Happy Player`,
        timestamp: "11/20/2025 7:20 PM"
      },
      {
        sender: "admin",
        message: `Aww, thank you so much for this wonderful message! It absolutely made our day to hear that you enjoyed the Double Coins Weekend.
Events like these are definitely something we want to do more often. We're already planning some exciting events for the holiday season!
Keep an eye on your mailbox for announcements. 😊`,
        timestamp: "11/21/2025 10:15 AM"
      }
    ]
  },
  5: {
    title: "Request for new cat breeds",
    date: "11/15/2025",
    conversation: [
      {
        sender: "player",
        message: `Hello,
I absolutely love CatWalk and have been playing for a while now. I was wondering if you have any plans to add more cat breeds to the game?
I would particularly love to see:
• Maine Coon cats
• Ragdoll cats  
• Scottish Fold cats
• Bengal cats
Thanks for making such an awesome game!`,
        timestamp: "11/15/2025 12:30 PM"
      },
      {
        sender: "admin",
        message: `Hello!
Thank you for your continued support and for playing CatWalk! We're thrilled that you're enjoying the game.
Your breed suggestions are fantastic! Maine Coons and Ragdolls are actually in development right now. Scottish Folds and Bengals are on our wishlist for future updates.
Each new breed takes quite a bit of work to implement properly (different body shapes, fur patterns, etc.) but we're committed to expanding our feline family!
Stay tuned for announcements!`,
        timestamp: "11/15/2025 3:45 PM"
      },
      {
        sender: "player",
        message: `That's so exciting! I can't wait to see the Maine Coons especially. Will they have their characteristic long fur?`,
        timestamp: "11/15/2025 8:15 PM"
      },
      {
        sender: "admin",
        message: `Absolutely! The Maine Coons will have their beautiful long, fluffy fur with all the characteristic tufts and plumes. We're really focusing on making each breed authentic to their real-world counterparts.`,
        timestamp: "11/16/2025 11:20 AM"
      }
    ]
  }
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
  
  // Setup message click handlers for both ALL and SENT messages
  setupMessageClickHandlers();
  
  // Setup control button handlers
  setupMessageViewControls();
  setupContactViewControls();
  
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
  
  // Hide all views first
  hideAllViews();
  
  if (tabType === 'all') {
    const messageList = document.getElementById('allMessagesList');
    if (messageList) {
      messageList.style.display = 'flex';
      console.log('✅ Showing all messages');
    } else {
      console.error('❌ All messages list not found');
    }
  } else if (tabType === 'sent') {
    showSentMessagesList();
  } else if (tabType === 'contact') {
    showContactView();
  } else if (tabType === 'unread') {
    // For unread tab, show empty for now
    console.log('✅ Showing unread (empty for now)');
  }
}

function hideAllViews() {
  const views = ['allMessagesList', 'sentMessagesList', 'messageView', 'contactView', 'conversationView'];
  views.forEach(viewId => {
    const view = document.getElementById(viewId);
    if (view) view.style.display = 'none';
  });
}

function showSentMessagesList() {
  console.log('📤 Showing sent messages list');
  
  let sentMessagesList = document.getElementById('sentMessagesList');
  
  // Create sent messages list if it doesn't exist
  if (!sentMessagesList) {
    console.log('📤 Creating sent messages list...');
    sentMessagesList = createSentMessagesList();
  }
  
  if (sentMessagesList) {
    sentMessagesList.style.display = 'flex';
    console.log('✅ Sent messages list shown');
  } else {
    console.error('❌ Failed to create/show sent messages list');
  }
}

function createSentMessagesList() {
  const mailboxContent = document.querySelector('.mailbox-content');
  if (!mailboxContent) {
    console.error('❌ Mailbox content not found');
    return null;
  }
  
  // Create the sent messages list container
  const sentMessagesList = document.createElement('div');
  sentMessagesList.className = 'message-list';
  sentMessagesList.id = 'sentMessagesList';
  sentMessagesList.style.display = 'none';
  
  // Create message boxes for sent messages
  Object.entries(sentMessageData).forEach(([messageId, message]) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.setAttribute('data-message-id', `sent-${messageId}`);
    messageBox.setAttribute('data-message-type', 'sent');
    
    const messageTitle = document.createElement('div');
    messageTitle.className = 'message-title';
    messageTitle.textContent = message.title;
    
    const messageDate = document.createElement('div');
    messageDate.className = 'message-date';
    messageDate.textContent = message.date;
    
    messageBox.appendChild(messageTitle);
    messageBox.appendChild(messageDate);
    sentMessagesList.appendChild(messageBox);
  });
  
  // Add to mailbox content
  mailboxContent.appendChild(sentMessagesList);
  
  // Setup click handlers for sent messages
  setupSentMessageClickHandlers();
  
  console.log('✅ Sent messages list created');
  return sentMessagesList;
}

function setupSentMessageClickHandlers() {
  const sentMessageBoxes = document.querySelectorAll('[data-message-type="sent"]');
  console.log(`📨 Setting up ${sentMessageBoxes.length} sent message click handlers`);
  
  sentMessageBoxes.forEach(messageBox => {
    messageBox.addEventListener('click', function() {
      const messageId = this.getAttribute('data-message-id');
      console.log(`📧 Sent message clicked: ${messageId}`);
      if (messageId) showConversationView(messageId);
    });
  });
}

function createConversationView() {
  const mailboxContent = document.querySelector('.mailbox-content');
  if (!mailboxContent) {
    console.error('❌ Mailbox content not found');
    return null;
  }
  
  // Create conversation view container
  const conversationView = document.createElement('div');
  conversationView.className = 'conversation-view';
  conversationView.id = 'conversationView';
  conversationView.style.display = 'none';
  
  conversationView.innerHTML = `
    <!-- Conversation Header -->
    <div class="conversation-view-header">
      <div class="conversation-view-title" id="conversationViewTitle">Conversation Title</div>
      <div class="conversation-view-date" id="conversationViewDate">Date</div>
    </div>
    
    <!-- Conversation History -->
    <div class="conversation-history" id="conversationHistory">
      <!-- Messages will be inserted here -->
    </div>
    
    <!-- Message Input Area -->
    <div class="conversation-input-container">
      <textarea class="conversation-input-area" id="conversationInput" placeholder="Type your message here..."></textarea>
      <div class="conversation-controls">
        <button class="back-btn" id="backToSentListBtn">←</button>
        <button class="send-btn" id="conversationSendBtn">SEND</button>
      </div>
    </div>
  `;
  
  // Add to mailbox content
  mailboxContent.appendChild(conversationView);
  
  // Setup event handlers for the conversation view
  setupConversationViewControls();
  
  console.log('✅ Conversation view created');
  return conversationView;
}

function setupConversationViewControls() {
  const backBtn = document.getElementById('backToSentListBtn');
  const sendBtn = document.getElementById('conversationSendBtn');
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      console.log('⬅️ Back to sent list button clicked');
      goBackToSentList();
    });
  }
  
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      console.log('📤 Conversation send button clicked');
      handleConversationSend();
    });
  }
}

function showConversationView(messageId) {
  console.log(`💬 Showing conversation view for ID: ${messageId}`);
  
  // Extract the actual ID (remove 'sent-' prefix)
  const actualId = messageId.replace('sent-', '');
  const conversation = sentMessageData[actualId];
  
  if (!conversation) {
    console.error('❌ Conversation not found:', messageId);
    return;
  }
  
  // Create conversation view if it doesn't exist
  let conversationView = document.getElementById('conversationView');
  if (!conversationView) {
    conversationView = createConversationView();
  }
  
  if (!conversationView) {
    console.error('❌ Failed to create conversation view');
    return;
  }
  
  // Update header
  const conversationViewTitle = document.getElementById('conversationViewTitle');
  const conversationViewDate = document.getElementById('conversationViewDate');
  
  if (conversationViewTitle) conversationViewTitle.textContent = conversation.title;
  if (conversationViewDate) conversationViewDate.textContent = conversation.date;
  
  // Build conversation history
  const conversationHistory = document.getElementById('conversationHistory');
  if (conversationHistory) {
    conversationHistory.innerHTML = '';
    
    conversation.conversation.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.className = `conversation-message ${message.sender}`;
      
      messageElement.innerHTML = `
        <div class="message-content">
          ${message.message.replace(/\n/g, '<br>')}
        </div>
        <div class="message-timestamp">${message.timestamp}</div>
      `;
      
      conversationHistory.appendChild(messageElement);
    });
  }
  
  // Clear the input
  const conversationInput = document.getElementById('conversationInput');
  if (conversationInput) conversationInput.value = '';
  
  // Store conversation ID for sending messages
  conversationView.setAttribute('data-current-conversation-id', messageId);
  
  // Hide other views and show conversation view
  hideAllViews();
  conversationView.style.display = 'flex';
  
  console.log('✅ Conversation view shown');
}

function goBackToSentList() {
  console.log('⬅️ Going back to sent list');
  hideAllViews();
  showSentMessagesList();
}

function handleConversationSend() {
  const conversationInput = document.getElementById('conversationInput');
  const conversationView = document.getElementById('conversationView');
  
  if (!conversationInput || !conversationView) return;
  
  const message = conversationInput.value.trim();
  if (message === '') {
    console.log('⚠️ No message to send');
    return;
  }
  
  const conversationId = conversationView.getAttribute('data-current-conversation-id');
  console.log('📤 Sending message in conversation:', conversationId);
  console.log('Message:', message);
  
  // Add the message to the conversation history visually
  const conversationHistory = document.getElementById('conversationHistory');
  if (conversationHistory) {
    const messageElement = document.createElement('div');
    messageElement.className = 'conversation-message player';
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    messageElement.innerHTML = `
      <div class="message-content">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <div class="message-timestamp">${timestamp}</div>
    `;
    
    conversationHistory.appendChild(messageElement);
    
    // Scroll to bottom
    conversationHistory.scrollTop = conversationHistory.scrollHeight;
  }
  
  // Clear input
  conversationInput.value = '';
  
  // In a real app, you would send this to the server
  console.log('✅ Message added to conversation');
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

function setupMessageClickHandlers() {
  const messageBoxes = document.querySelectorAll('[data-message-type]:not([data-message-type="sent"]), .message-box:not([data-message-type])');
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
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      console.log('⬅️ Back button clicked');
      goBackToCurrentList();
    });
  }
  
  if (markUnreadBtn) {
    markUnreadBtn.addEventListener('click', () => {
      console.log('📝 Mark unread button clicked');
      markMessageAsUnread();
    });
  }
}

function setupContactViewControls() {
  const sendBtn = document.getElementById('sendBtn');
  
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      console.log('📤 Send button clicked');
      handleSendMessage();
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
    messageViewBody.innerHTML = message.body.split('\n\n').map(paragraph => 
      `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
    ).join('');
  }
  
  // Store message ID and type for back functionality
  messageView.setAttribute('data-current-message-id', messageId);
  messageView.setAttribute('data-current-message-type', 'received');
  
  // Hide other views and show message view
  hideAllViews();
  messageView.style.display = 'flex';
  
  console.log('✅ Message view shown');
}

function goBackToCurrentList() {
  console.log('⬅️ Going back to current list');
  const messageView = document.getElementById('messageView');
  if (!messageView) return;
  
  const messageType = messageView.getAttribute('data-current-message-type');
  
  hideAllViews();
  
  if (messageType === 'sent') {
    // Go back to sent messages list
    showSentMessagesList();
  } else {
    // Go back to all messages list
    const messageList = document.getElementById('allMessagesList');
    if (messageList) {
      messageList.style.display = 'flex';
      console.log('✅ Returned to all messages list');
    }
  }
}

function markMessageAsUnread() {
  const messageView = document.getElementById('messageView');
  if (!messageView) return;
  
  const messageId = messageView.getAttribute('data-current-message-id');
  const messageType = messageView.getAttribute('data-current-message-type');
  
  if (messageId) {
    const messageBox = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageBox) {
      messageBox.classList.add('read');
      console.log(`✅ Message ${messageId} marked as read`);
    }
    goBackToCurrentList();
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
  
  showTabContent('all');
}

// Make toggleMailbox available globally for HTML onclick handlers
if (typeof window !== 'undefined') {
  window.toggleMailbox = toggleMailbox;
}