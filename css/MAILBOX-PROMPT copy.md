# Cat Walk - Messages System

## 1. User Story

### Initial Access
- **Player is in album page** (already connected and listening for messages)
- **Messages arrive in real-time** → Player sees notification indicators on mailbox button
- **Player clicks mailbox button** → Mailbox popup appears on screen
- **Mailbox opens with 4 navigation buttons**: ALL MESSAGES, CONTACT US, SENT, BROADCASTS
- **Default view**: ALL MESSAGES tab is selected (brown/active state)
- **Player can click any tab** → Selected tab turns brown, others remain inactive

### ALL MESSAGES Tab
**List View** (Default):
- Shows list of all player's message conversations
- Each message item displays: title, date, sender info
- Unread messages have white background, read messages have grey background
- Player clicks on any message item → Switches to Message Detail View

**Message Detail View**:
- **Brown background container**
- **Header**: Title and date (matching list item style)
- **Content**: Large white rectangle containing message body text
- **Controls** (outside brown container):
  - **Bottom left**: Back arrow "←" button → Returns to list view
  - **Bottom right**: "MARK AS UNREAD" button → Changes message status, returns to list
- **Mark as Unread behavior**: When returning to list, this message item shows grey background instead of white

### CONTACT US Tab
**Compose New Message View**:
- **Brown background container**
- **Header**: "Contact Us" title with current date
- **Message Input**: 
  - White rectangle text area (30px border radius)
  - Positioned on left side of container
  - Width: 3/4 of full available width
  - Placeholder: "Type your message here..."
- **Controls** (outside brown container):
  - **Bottom right**: "SEND" button → Sends message, returns to ALL MESSAGES list view

### SENT Tab
**Conversation List View** (Default):
- Shows list of player's outgoing conversation threads
- Each conversation displays: title, date
- Player clicks on conversation → Switches to Conversation Detail View

**Conversation Detail View**:
- **Brown background container**
- **Header**: Conversation title and date
- **Message History**: Chronological list of all messages in conversation
  - **Player messages**: Left-aligned message bubbles
  - **Admin replies**: Right-aligned message bubbles
- **Message Input**: 
  - Text area at bottom: "Type your message here..."
  - Send functionality to continue conversation thread

### BROADCASTS Tab
**Announcements List View**:
- Shows admin broadcast messages to all players
- Each broadcast displays: title, date, admin sender
- Unread broadcasts highlighted differently
- Player clicks broadcast → Switches to Broadcast Detail View

**Broadcast Detail View**:
- **Brown background container**
- **Header**: Broadcast title, date, admin sender
- **Content**: Large white rectangle with broadcast message body
- **Controls** (outside brown container):
  - **Bottom left**: Back arrow "←" button → Returns to broadcasts list
  - **Auto-mark as read**: Viewing broadcast automatically marks it as read

### Global Notification System
**Real-time Message Delivery** (mailbox closed):
- **New messages/broadcasts arrive instantly** via Socket.io connection
- **Mailbox button shows notification indicator** (red dot, unread count, etc.)
- **Player can continue playing** while receiving messages in background
- **Opening mailbox shows all accumulated messages** with proper read/unread status

## 2. Messages

### Player Connects to Game (Always listening for messages)
```
client -> server: player_connected (playerId)
server -> client: connection_confirmed
// Player is now subscribed to receive all their messages in real-time
```

### Player Opens Mailbox (Load existing data)
```
client -> server: get_mailbox_data
server -> client: mailbox_data (tickets, broadcasts, unread_counts)
```

### Admin Sends Broadcast (Real-time to all players - even if mailbox closed)
```
server -> client: new_broadcast (broadcast_data)
// Player receives this immediately, shows notification indicator
```

### Admin Replies to Ticket (Real-time to specific player - even if mailbox closed)
```
server -> client: new_message (ticket_id, message_data)
// Player receives this immediately, shows notification indicator
```

### Player Sends New Message (Contact Us)
```
client -> server: create_ticket (subject, message_body)
server -> client: ticket_created (ticket_data)
server -> admin: new_ticket_notification (ticket_data)
```

### Player Replies to Existing Conversation
```
client -> server: send_message (ticket_id, message_body)
server -> client: message_sent (message_data)
server -> admin: new_message_notification (ticket_id, message_data)
```

### Player Marks Message as Read/Unread
```
client -> server: mark_message (message_id, is_read)
server -> client: message_status_updated (message_id, is_read)
```

## Mailbox Tab Behavior Clarification:

ALL MESSAGES = All broadcasts (read = white background, unread = grey)
UNREAD = Only unread broadcasts (same coloring)
SENT = All tickets - both player-created AND admin-replied (opened = white, closed = grey)
CONTACT US = Create new ticket form


## 3. TypeScript Types and Constants

```typescript
// Constants
const MAX_MESSAGE_LENGTH = 250;
const MAX_SUBJECT_LENGTH = 50;

// Core Data Types
type Player = {
  id: number;
  username: string;
}

type Admin = {
  id: number;
  username: string;
}

type Ticket = {
  id: number;
  player_id: number;
  subject: string;
  status: 'open' | 'closed';
  created_at: string;
  last_activity_at: string;
}

type Message = {
  id: number;
  ticket_id: number;
  sender_type: 'player' | 'admin';
  sender_id: number;
  subject: string;
  body: string;
  is_read: boolean;
  sent_at: string;
}

type Broadcast = {
  id: number;
  admin_id: number;
  admin_username: string;
  subject: string;
  body: string;
  sent_at: string;
  is_read: boolean;
}

// Client to Server Messages
type PlayerConnectedMessage = {
  type: 'player_connected';
  player_id: number;
}

type GetMailboxDataMessage = {
  type: 'get_mailbox_data';
}

type CreateTicketMessage = {
  type: 'create_ticket';
  subject: string;
  body: string;
}

type SendMessageMessage = {
  type: 'send_message';
  ticket_id: number;
  body: string;
}

type MarkMessageMessage = {
  type: 'mark_message';
  message_id: number;
  is_read: boolean;
}

type MarkBroadcastMessage = {
  type: 'mark_broadcast';
  broadcast_id: number;
}

// Server to Client Messages
type ConnectionConfirmedMessage = {
  type: 'connection_confirmed';
}

type MailboxDataMessage = {
  type: 'mailbox_data';
  tickets: Ticket[];
  broadcasts: Broadcast[];
  unread_tickets: number;
  unread_broadcasts: number;
}

type TicketMessagesMessage = {
  type: 'ticket_messages';
  ticket_id: number;
  messages: Message[];
}

type NewMessageMessage = {
  type: 'new_message';
  ticket_id: number;
  message: Message;
}

type NewBroadcastMessage = {
  type: 'new_broadcast';
  broadcast: Broadcast;
}

type MessageStatusUpdateMessage = {
  type: 'message_status_update';
  message_id: number;
  is_read: boolean;
}

type TicketCreatedMessage = {
  type: 'ticket_created';
  ticket: Ticket;
}
```

## Tracking our progress
We should fill this with our progress.


C:\dev\catwalk-client\js\core\utils.js
```javascript
/*-----------------------------------------------------------------------------
  utils.js – generic helpers, no localStorage auth
-----------------------------------------------------------------------------*/
import { APP_URL } from '../core/config.js'

export const  $  = id       => document.getElementById(id);
export const  $$ = selector => document.querySelectorAll(selector);
export function setDisplay(el, visible, type = 'block') {
  if (typeof el === 'string') el = $(el);
  if (el) el.style.setProperty('display', visible ? type : 'none', 'important');
}

/*─────────────────────────────────────────────────────────────────────────────
  Auth helpers
─────────────────────────────────────────────────────────────────────────────*/
let _userCache = null;

/** Get current user (username, userId) via JWT */
export async function getLoggedInUserInfo() {
  if (_userCache) return _userCache;              // use cached copy

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    throw new Error('No auth token found');
  }

  const res = await fetch(`${APP_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (res.status === 401) {                       // token invalid/expired
    localStorage.removeItem('token');
    window.location.href = 'login.html';
    throw new Error('Auth token expired');
  }

  if (!res.ok) throw new Error('Failed /auth/me');

  const data = await res.json();
  _userCache = data.user;                         // { username, userId }
  return _userCache;
}
window.getLoggedInUserInfo = getLoggedInUserInfo;

/** Fetch full player record from your players API */
export async function fetchLoggedInUserFullInfo() {
  try {
    const { userId } = await getLoggedInUserInfo();
    const res  = await fetch(`${APP_URL}/api/players/${userId}`, {
      credentials: 'include'
    });
    if (!res.ok) throw new Error();
    return await res.json();                      // full player object
  } catch {
    return null;                                  // swallow errors
  }
}

```

C:\dev\catwalk-client\js\features\ui\bindings.js
```javascript
// /features/ui/bindings.js

import { toggleShop, closeShop } from '../shop/shop.js';
import { renderShopItems } from '../shop/shopItemsRenderer.js';
import { closeAddCat } from '../addCat/addCat.js'; // adjust path if needed
import { getLoggedInUserInfo } from '../../core/utils.js';

/**
 * Binds the shop close button
 */
export function bindShopBtn(bindButton) {
  // ✅ Now actually closes the shop
  bindButton("shopCloseBtn", closeShop, "🧼 Close Shop clicked");
}
export function bindAddCatBtn(bindButton) {
  bindButton("addCatCloseBtn", closeAddCat, "🚪 Close Add Cat clicked");
}

/**
 * Binds the customize button
 */
export function bindCustomizeBtn(bindButton) {
  bindButton("customizeBtn", () => {
    const cat = window.selectedCat;
    const catName = cat?.name || "Unknown";
    console.log(`🎨 Force-opening shop for cat: ${catName}`);

    // Make sure the selected cat is updated visually
    const card = document.querySelector(`.cat-card[data-cat-id="${cat?.id}"]`);
if (card) {
  const allCards = document.querySelectorAll('.cat-card');
  allCards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
}

    toggleShop(); // 👈 cleaner way to open the shop
  });
}

export function bindFashionBtn(bindButton) {
  bindButton("fashionBtn", () => {
    const cat = window.selectedCat;
    if (!cat || !cat.id) {
      console.warn("❌ No selected cat to enter fashion show");
      return;
    }
    console.log(`🎭 Entering Fashion Show with cat ID ${cat.id}`);

    // Get player info and log the player ID
    const playerInfo = getLoggedInUserInfo();
    console.log(`🎭🎭 Entering Fashion Show with user ID ${playerInfo.userId}`);
    
    debugger;
    
    // This line hands over both the selected cat ID and player ID to fashion-show.js:
    // - catId is passed via URL parameter and will be read by fashion-show.js
    // - playerId is available to fashion-show.js via getLoggedInUserInfo() function
    window.location.href = `fashion-show.html?catId=${cat.id}`;
    
    // Alternative approach: Pass both IDs in URL (optional)
    // window.location.href = `fashion-show.html?catId=${cat.id}&playerId=${playerInfo.userId}`;
  });
}
// /**
//  * Binds the fashion show button
//  */
// export function bindFashionBtn(bindButton) {
//   bindButton("fashionBtn", () => {
//     const cat = window.selectedCat;
//     if (!cat || !cat.id) {
//       console.warn("❌ No selected cat to enter fashion show");
//       return;
//     }
//     console.log(`🎭 Entering Fashion Show with cat ID ${cat.id}`);

//     // Get player info and log the player ID
//     const playerInfo = getLoggedInUserInfo();
//     console.log(`🎭🎭 Entering Fashion Show with user ID ${playerInfo.userId}`);
    
//     debugger;
//     window.location.href = `fashion-show.html?catId=${cat.id}`; 
//     // TODO: I need this line (or function) to hand over to fashion-show.js the id of our selcted cat and the id of our player 
//   });
// }

```

C:\dev\catwalk-client\js\features\mailbox\mailbox.js
```javascript
/*-----------------------------------------------------------------------------
  mailbox.js (CLIENT) - Messages System for Cat Walk Game
  Handles real-time messaging via Socket.io
-----------------------------------------------------------------------------*/

import { getLoggedInUserInfo } from '../../core/utils.js';
import { APP_URL } from '../../core/config.js';

// Constants
const MAX_MESSAGE_LENGTH = 250;
const MAX_SUBJECT_LENGTH = 50;

// Global state
let socket = null;
let currentUser = null;
let mailboxData = {
  tickets: [],
  broadcasts: [],
  unread_tickets: 0,
  unread_broadcasts: 0
};
let currentView = 'list'; // 'list', 'detail', 'contact', 'conversation'
let currentTab = 'all'; // 'all', 'unread', 'sent', 'contact'
let selectedMessage = null;
let selectedTicket = null;

// DOM Elements (cached for performance)
let mailboxDisplay = null;
let mailboxButtons = [];
let contentArea = null;
let messagesList = null;
let messageView = null;
let contactView = null;
let conversationView = null;

/**
 * Initialize the mailbox system
 */
export async function initializeMailbox() {
  try {
    // Get current user info
    currentUser = await getLoggedInUserInfo();
    
    // Cache DOM elements
    cacheElements();
    
    // Setup event listeners
    setupEventListeners();
    
    // Connect to Socket.io
    await connectSocket();
    
    console.log('📬 Mailbox initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize mailbox:', error);
  }
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
  mailboxDisplay = document.getElementById('mailboxDisplay');
  contentArea = document.querySelector('.mailbox-content');
  messagesList = document.getElementById('allMessagesList');
  messageView = document.getElementById('messageView');
  contactView = document.getElementById('contactView');
  conversationView = document.querySelector('.conversation-view');
  
  // Cache navigation buttons
  mailboxButtons = Array.from(document.querySelectorAll('.mailbox-btn'));
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Tab navigation
  mailboxButtons.forEach(btn => {
    btn.addEventListener('click', () => handleTabSwitch(btn.dataset.tab));
  });
  
  // Back button in message view
  const backBtn = document.getElementById('backToListBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => showView('list'));
  }
  
  // Send button in contact view
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSendMessage);
  }
  
  // Contact form validation
  const subjectInput = document.getElementById('contactSubjectInput');
  const messageInput = document.getElementById('contactInput');
  
  if (subjectInput) {
    subjectInput.addEventListener('input', () => validateInput(subjectInput, MAX_SUBJECT_LENGTH));
  }
  
  if (messageInput) {
    messageInput.addEventListener('input', () => validateInput(messageInput, MAX_MESSAGE_LENGTH));
  }
  
  // Set current date in contact view
  const contactDateElement = document.getElementById('contactViewDate');
  if (contactDateElement) {
    contactDateElement.textContent = formatDate(new Date());
  }
}

/**
 * Connect to Socket.io server
 */
async function connectSocket() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token');
    }
    
    // Import Socket.io (assuming it's available globally or via CDN)
    const socketUrl = APP_URL.replace('http', 'wss'); // Convert to WebSocket URL
    
    socket = io({
      auth: {
        token: token
      }
    });
    
    // Connection events
    socket.on('connect', () => {
      loadMailboxData();
    });
    
    socket.on('disconnect', () => {
      console.log('📬 Disconnected from mailbox server');
    });
    
    socket.on('connect_error', (error) => {
      console.error('📬 Connection error:', error);
    });
    
    // Mailbox events
    socket.on('connection_confirmed', () => {
      console.log('📬 Connection confirmed by server');
    });
    
    socket.on('mailbox_data', handleMailboxData);
    socket.on('ticket_messages', handleTicketMessages);
    socket.on('new_message', handleNewMessage);
    socket.on('new_broadcast', handleNewBroadcast);
    socket.on('message_status_update', handleMessageStatusUpdate);
    socket.on('ticket_created', handleTicketCreated);
    socket.on('error', handleSocketError);
    
  } catch (error) {
    console.error('❌ Failed to connect to mailbox server:', error);
  }
}

/**
 * Toggle mailbox visibility
 */
export function toggleMailbox() {
  if (!mailboxDisplay) return;
  
  const isVisible = mailboxDisplay.classList.contains('show');
  
  if (isVisible) {
    closeMailbox();
  } else {
    openMailbox();
  }
}

/**
 * Open mailbox
 */
function openMailbox() {
  if (!mailboxDisplay) return;
  
  mailboxDisplay.classList.add('show');
  
  // Load fresh data when opening
  if (socket && socket.connected) {
    loadMailboxData();
  }
  
  // Reset to default view
  showView('list');
  setActiveTab('all');
}

/**
 * Close mailbox
 */
function closeMailbox() {
  if (!mailboxDisplay) return;
  
  mailboxDisplay.classList.remove('show');
}

/**
 * Load mailbox data from server
 */
function loadMailboxData() {
  if (socket) {
    socket.emit('get_mailbox_data');
  }
}

/**
 * Handle mailbox data from server
 */
function handleMailboxData(data) {
  mailboxData = data;
  console.log('📬 Received mailbox data:', data);
  
  // Update notification indicators
  updateNotificationIndicators();
  
  // Render current view
  renderCurrentView();
}

/**
 * Handle tab switching
 * 
 * Tab Behavior:
 * - ALL MESSAGES: Shows all broadcasts (read = white, unread = grey)
 * - UNREAD: Shows only unread broadcasts (same coloring)
 * - SENT: Shows all tickets - player-created AND admin-replied (opened = white, closed = grey)
 * - CONTACT US: Create new ticket form
 */
function handleTabSwitch(tab) {
  currentTab = tab;
  setActiveTab(tab);
  
  switch (tab) {
    case 'all':
      showView('list');
      renderAllMessages(); // All broadcasts
      break;
    case 'unread':
      showView('list');
      renderUnreadMessages(); // Unread broadcasts only
      break;
    case 'sent':
      showView('list');
      renderSentMessages(); // All tickets (both directions)
      break;
    case 'contact':
      showView('contact');
      clearContactForm();
      break;
  }
}

/**
 * Set active tab visual state
 */
function setActiveTab(activeTab) {
  mailboxButtons.forEach(btn => {
    if (btn.dataset.tab === activeTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/**
 * Show specific view
 */
function showView(view) {
  currentView = view;
  
  // Hide all views first
  if (messagesList) messagesList.style.display = 'none';
  if (messageView) messageView.style.display = 'none';
  if (contactView) contactView.style.display = 'none';
  if (conversationView) conversationView.style.display = 'none';
  
  // Show the requested view
  switch (view) {
    case 'list':
      if (messagesList) messagesList.style.display = 'flex';
      break;
    case 'detail':
      if (messageView) messageView.style.display = 'flex';
      break;
    case 'contact':
      if (contactView) contactView.style.display = 'flex';
      break;
    case 'conversation':
      if (conversationView) conversationView.style.display = 'flex';
      break;
  }
}

/**
 * Render all messages (ALL MESSAGES tab - shows all broadcasts)
 */
function renderAllMessages() {
  if (!messagesList) return;
  
  // ALL MESSAGES = All broadcasts only
  const allBroadcasts = mailboxData.broadcasts.map(b => ({ ...b, type: 'broadcast' }))
    .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
  
  renderMessageList(allBroadcasts);
}

/**
 * Render unread messages (UNREAD tab - shows unread broadcasts only)
 */
function renderUnreadMessages() {
  if (!messagesList) return;
  
  // UNREAD = Only unread broadcasts
  const unreadBroadcasts = mailboxData.broadcasts
    .filter(b => !b.is_read)
    .map(b => ({ ...b, type: 'broadcast' }))
    .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
  
  renderMessageList(unreadBroadcasts);
}

/**
 * Render sent messages (SENT tab - shows all tickets)
 */
function renderSentMessages() {
  if (!messagesList) return;
  
  // SENT = All tickets (both player-created and admin-replied)
  const allTickets = mailboxData.tickets.map(t => ({ ...t, type: 'ticket' }))
    .sort((a, b) => new Date(b.last_activity_at) - new Date(a.last_activity_at));
  
  renderMessageList(allTickets);
}

/**
 * Render message list
 */
function renderMessageList(messages) {
  if (!messagesList) return;
  
  messagesList.innerHTML = '';
  
  messages.forEach(message => {
    const messageBox = createMessageBox(message);
    messagesList.appendChild(messageBox);
  });
}

/**
 * Create individual message box element
 */
function createMessageBox(message) {
  const messageBox = document.createElement('div');
  messageBox.className = 'message-box';
  messageBox.dataset.messageId = message.id;
  messageBox.dataset.messageType = message.type;
  
  // Add read class based on message type and status
  if (message.type === 'broadcast') {
    // For broadcasts: read = white background, unread = grey background
    if (message.is_read) {
      messageBox.classList.add('read');
    }
  } else if (message.type === 'ticket') {
    // For tickets: opened = white background, closed = grey background
    if (message.status === 'closed') {
      messageBox.classList.add('read');
    }
  }
  
  const title = document.createElement('div');
  title.className = 'message-title';
  title.textContent = message.subject;
  
  const date = document.createElement('div');
  date.className = 'message-date';
  date.textContent = formatDate(new Date(message.sent_at || message.last_activity_at));
  
  messageBox.appendChild(title);
  messageBox.appendChild(date);
  
  // Click handler
  messageBox.addEventListener('click', () => {
    if (message.type === 'broadcast') {
      showBroadcastDetail(message);
    } else if (message.type === 'ticket') {
      // All tickets (from SENT tab) should open conversation view
      showTicketDetail(message);
    }
  });
  
  return messageBox;
}

/**
 * Show broadcast detail
 */
function showBroadcastDetail(broadcast) {
  selectedMessage = broadcast;
  
  // Update message view elements
  const titleElement = document.getElementById('messageViewTitle');
  const dateElement = document.getElementById('messageViewDate');
  const bodyElement = document.getElementById('messageViewBody');
  
  if (titleElement) titleElement.textContent = broadcast.subject;
  if (dateElement) dateElement.textContent = formatDate(new Date(broadcast.sent_at));
  if (bodyElement) bodyElement.innerHTML = `<p>${broadcast.body}</p>`;
  
  // Mark as read if not already
  if (!broadcast.is_read) {
    socket.emit('mark_broadcast', { broadcast_id: broadcast.id });
  }
  
  showView('detail');
}

/**
 * Show ticket detail (conversation view)
 */
function showTicketDetail(ticket) {
  selectedTicket = ticket;
  
  // Request ticket messages from server
  socket.emit('get_ticket_messages', { ticket_id: ticket.id });
}

/**
 * Handle ticket messages from server
 */
function handleTicketMessages(data) {
  const { ticket_id, messages } = data;
  
  if (selectedTicket && selectedTicket.id === ticket_id) {
    renderConversationView(messages);
    showView('conversation');
  }
}

/**
 * Render conversation view
 */
function renderConversationView(messages) {
  if (!conversationView) return;
  
  // Update conversation header
  const titleElement = conversationView.querySelector('.conversation-view-title');
  const dateElement = conversationView.querySelector('.conversation-view-date');
  
  if (titleElement && selectedTicket) titleElement.textContent = selectedTicket.subject;
  if (dateElement && selectedTicket) dateElement.textContent = formatDate(new Date(selectedTicket.created_at));
  
  // Render message history
  const historyContainer = conversationView.querySelector('.conversation-history');
  if (historyContainer) {
    historyContainer.innerHTML = '';
    
    messages.forEach(message => {
      const messageElement = createConversationMessage(message);
      historyContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    historyContainer.scrollTop = historyContainer.scrollHeight;
  }
  
  // Setup conversation input
  setupConversationInput();
}

/**
 * Create conversation message element
 */
function createConversationMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `conversation-message ${message.sender_type}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = message.body;
  
  const timestampDiv = document.createElement('div');
  timestampDiv.className = 'message-timestamp';
  timestampDiv.textContent = formatDateTime(new Date(message.sent_at));
  
  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timestampDiv);
  
  return messageDiv;
}

/**
 * Setup conversation input functionality
 */
function setupConversationInput() {
  const inputArea = conversationView?.querySelector('.conversation-input-area');
  const sendBtn = conversationView?.querySelector('.send-btn');
  const backBtn = conversationView?.querySelector('.back-btn');
  
  if (sendBtn) {
    sendBtn.onclick = () => {
      if (inputArea && inputArea.value.trim() && selectedTicket) {
        const message = inputArea.value.trim();
        
        if (message.length <= MAX_MESSAGE_LENGTH) {
          socket.emit('send_message', {
            ticket_id: selectedTicket.id,
            body: message
          });
          
          inputArea.value = '';
        } else {
          showError('Message too long. Maximum 250 characters.');
        }
      }
    };
  }
  
  if (backBtn) {
    backBtn.onclick = () => showView('list');
  }
}

/**
 * Handle sending new message (Contact Us)
 */
function handleSendMessage() {
  const subjectInput = document.getElementById('contactSubjectInput');
  const messageInput = document.getElementById('contactInput');
  
  if (!subjectInput || !messageInput) return;
  
  const subject = subjectInput.value.trim();
  const body = messageInput.value.trim();
  
  // Validation
  if (!subject) {
    showError('Please enter a subject.');
    return;
  }
  
  if (!body) {
    showError('Please enter a message.');
    return;
  }
  
  if (subject.length > MAX_SUBJECT_LENGTH) {
    showError(`Subject too long. Maximum ${MAX_SUBJECT_LENGTH} characters.`);
    return;
  }
  
  if (body.length > MAX_MESSAGE_LENGTH) {
    showError(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
    return;
  }
  
  // Send to server
  socket.emit('create_ticket', {
    subject: subject,
    body: body
  });
}

/**
 * Handle ticket created confirmation
 */
function handleTicketCreated(data) {
  console.log('📬 Ticket created:', data);
  
  // Clear form
  clearContactForm();
  
  // Show success message
  showSuccess('Message sent successfully!');
  
  // Switch to All Messages tab
  handleTabSwitch('all');
  
  // Reload data
  loadMailboxData();
}

/**
 * Handle new message notification
 */
function handleNewMessage(data) {
  console.log('📬 New message received:', data);
  
  // Update notification indicators
  updateNotificationIndicators();
  
  // If currently viewing this conversation, add the message
  if (currentView === 'conversation' && selectedTicket && selectedTicket.id === data.ticket_id) {
    const historyContainer = conversationView?.querySelector('.conversation-history');
    if (historyContainer) {
      const messageElement = createConversationMessage(data.message);
      historyContainer.appendChild(messageElement);
      historyContainer.scrollTop = historyContainer.scrollHeight;
    }
  }
  
  // Show notification if mailbox is closed
  if (!mailboxDisplay?.classList.contains('show')) {
    showNotification('New message received!');
  }
  
  // Reload data to update counts
  loadMailboxData();
}

/**
 * Handle new broadcast notification
 */
function handleNewBroadcast(data) {
  console.log('📬 New broadcast received:', data);
  
  // Update notification indicators
  updateNotificationIndicators();
  
  // Show notification if mailbox is closed
  if (!mailboxDisplay?.classList.contains('show')) {
    showNotification('New announcement received!');
  }
  
  // Reload data
  loadMailboxData();
}

/**
 * Handle message status update
 */
function handleMessageStatusUpdate(data) {
  console.log('📬 Message status updated:', data);
  
  // Update local state and UI if needed
  updateNotificationIndicators();
}

/**
 * Handle socket errors
 */
function handleSocketError(error) {
  console.error('📬 Socket error:', error);
  showError(error.message || 'Connection error occurred.');
}

/**
 * Update notification indicators
 * Shows count of unread broadcasts + tickets with unread messages
 */
function updateNotificationIndicators() {
  // Count unread broadcasts
  const unreadBroadcastsCount = mailboxData.broadcasts.filter(b => !b.is_read).length;
  
  // Count tickets with unread messages (from admin)
  const unreadTicketsCount = mailboxData.tickets.filter(t => t.unread_messages > 0).length;
  
  const totalUnread = unreadBroadcastsCount + unreadTicketsCount;
  
  // Update mailbox icon with notification indicator
  const mailboxIcon = document.querySelector('.topbar-icon[title="Mailbox"]');
  if (mailboxIcon && totalUnread > 0) {
    // Add notification indicator if not exists
    let indicator = mailboxIcon.querySelector('.notification-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'notification-indicator';
      indicator.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--color-red);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        z-index: 1001;
      `;
      mailboxIcon.style.position = 'relative';
      mailboxIcon.appendChild(indicator);
    }
    indicator.textContent = totalUnread > 99 ? '99+' : totalUnread.toString();
  } else {
    // Remove indicator if no unread messages
    const indicator = mailboxIcon?.querySelector('.notification-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
}

/**
 * Render current view based on current tab
 */
function renderCurrentView() {
  switch (currentTab) {
    case 'all':
      renderAllMessages();
      break;
    case 'unread':
      renderUnreadMessages();
      break;
    case 'sent':
      renderSentMessages();
      break;
    case 'contact':
      // Contact view doesn't need rendering
      break;
  }
}

/**
 * Clear contact form
 */
function clearContactForm() {
  const subjectInput = document.getElementById('contactSubjectInput');
  const messageInput = document.getElementById('contactInput');
  
  if (subjectInput) subjectInput.value = '';
  if (messageInput) messageInput.value = '';
}

/**
 * Validate input length
 */
function validateInput(input, maxLength) {
  if (input.value.length > maxLength) {
    input.value = input.value.substring(0, maxLength);
    showError(`Maximum ${maxLength} characters allowed.`);
  }
}

/**
 * Format date for display
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format date and time for display
 */
function formatDateTime(date) {
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Show success message
 */
function showSuccess(message) {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "var(--color-gold)",
      stopOnFocus: true
    }).showToast();
  } else {
    alert(message);
  }
}

/**
 * Show error message
 */
function showError(message) {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "var(--color-red)",
      stopOnFocus: true
    }).showToast();
  } else {
    alert(message);
  }
}

/**
 * Show notification
 */
function showNotification(message) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Cat Walk', {
      body: message,
      icon: '../assets/icons/cat_browser_icon.png'
    });
  } else {
    showSuccess(message);
  }
}

/**
 * Request notification permission
 */
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

/**
 * Cleanup function for when user leaves the page
 */
export function cleanup() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Make toggleMailbox available globally for HTML onclick
window.toggleMailbox = toggleMailbox;

// Auto-initialize when module loads
// initializeMailbox();
```

C:\dev\catwalk-server\mailbox.js
```javascript
/*-----------------------------------------------------------------------------
  mailbox.js (SERVER) - Messages System for Cat Walk Game
  Handles real-time messaging via Socket.io
-----------------------------------------------------------------------------*/

import jwt from 'jsonwebtoken';

// Constants
const MAX_MESSAGE_LENGTH = 250;
const MAX_SUBJECT_LENGTH = 50;

/**
 * Setup mailbox functionality with Socket.io
 * @param {Object} io - Socket.io server instance
 * @param {Object} db - Database connection (e.g., sqlite, pg, etc.)
 * @param {string} jwtSecret - JWT secret for token verification
 */
export function setupMailbox(io, db, jwtSecret) {
  // Store connected players for targeted messaging
  const connectedPlayers = new Map(); // playerId -> socketId

  /**
   * Authenticate socket connection using JWT
   */
  function authenticate(socket, next) {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('No authentication token provided'));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    } catch (err) {
      next(new Error('Invalid authentication token'));
    }
  }

  // Apply authentication middleware
  io.use(authenticate);

  /**
   * Database query functions
   */
  const queries = {
    // Get all tickets for a player
    async getPlayerTickets(playerId) {
      const sql = `
        SELECT t.*, 
               COUNT(CASE WHEN m.is_read = false AND m.sender_type = 'admin' THEN 1 END) as unread_messages
        FROM tickets t
        LEFT JOIN messages m ON t.id = m.ticket_id
        WHERE t.player_id = $1
        GROUP BY t.id
        ORDER BY t.last_activity_at DESC
      `;
      const result = await db.query(sql, [playerId]);
      return result.rows;
    },

    // Get broadcasts for a player with read status
    async getPlayerBroadcasts(playerId) {
      const sql = `
        SELECT b.*,
               COALESCE(pbr.is_read, false) as is_read
        FROM broadcasts b
        LEFT JOIN player_broadcast_reads pbr ON b.id = pbr.broadcast_id AND pbr.player_id = $1
        ORDER BY b.sent_at DESC
      `;
      const result = await db.query(sql, [playerId]);
      return result.rows;
    },

    // Get messages for a specific ticket
    async getTicketMessages(ticketId) {
      const sql = `
        SELECT m.*, 
               CASE 
                 WHEN m.sender_type = 'player' THEN p.username
                 WHEN m.sender_type = 'admin' THEN a.username
               END as sender_username
        FROM messages m
        LEFT JOIN players p ON m.sender_type = 'player' AND m.sender_id = p.id
        LEFT JOIN admins a ON m.sender_type = 'admin' AND m.sender_id = a.id
        WHERE m.ticket_id = $1
        ORDER BY m.sent_at ASC
      `;
      const result = await db.query(sql, [ticketId]);
      return result.rows;
    },

    // Create new ticket
    async createTicket(playerId, subject, body) {
      const now = new Date().toISOString();
      
      // Insert ticket
      const ticketResult = await db.query(`
        INSERT INTO tickets (player_id, subject, status, created_at, last_activity_at)
        VALUES ($1, $2, 'open', $3, $4)
        RETURNING id
      `, [playerId, subject, now, now]);

      const ticketId = ticketResult.rows[0].id;

      // Insert first message
      await db.query(`
        INSERT INTO messages (ticket_id, sender_type, sender_id, subject, body, is_read, sent_at)
        VALUES ($1, 'player', $2, $3, $4, true, $5)
      `, [ticketId, playerId, subject, body, now]);

      return {
        id: ticketId,
        player_id: playerId,
        subject,
        status: 'open',
        created_at: now,
        last_activity_at: now
      };
    },

    // Add message to existing ticket
    async addMessage(ticketId, senderType, senderId, body) {
      const now = new Date().toISOString();
      
      // Insert message
      const result = await db.query(`
        INSERT INTO messages (ticket_id, sender_type, sender_id, body, is_read, sent_at)
        VALUES ($1, $2, $3, $4, false, $5)
        RETURNING id
      `, [ticketId, senderType, senderId, body, now]);

      // Update ticket last activity
      await db.query(`
        UPDATE tickets SET last_activity_at = $1 WHERE id = $2
      `, [now, ticketId]);

      return {
        id: result.rows[0].id,
        ticket_id: ticketId,
        sender_type: senderType,
        sender_id: senderId,
        body,
        is_read: false,
        sent_at: now
      };
    },

    // Mark message as read/unread
    async markMessage(messageId, isRead) {
      await db.query(`
        UPDATE messages SET is_read = $1 WHERE id = $2
      `, [isRead, messageId]);
    },

    // Mark broadcast as read for player
    async markBroadcastRead(playerId, broadcastId) {
      await db.query(`
        INSERT INTO player_broadcast_reads (player_id, broadcast_id, is_read)
        VALUES ($1, $2, true)
        ON CONFLICT (player_id, broadcast_id) 
        DO UPDATE SET is_read = true
      `, [playerId, broadcastId]);
    },

    // Get unread counts
    async getUnreadCounts(playerId) {
      const ticketUnreads = await db.query(`
        SELECT COUNT(*) as count
        FROM messages m
        JOIN tickets t ON m.ticket_id = t.id
        WHERE t.player_id = $1 AND m.sender_type = 'admin' AND m.is_read = false
      `, [playerId]);

      const broadcastUnreads = await db.query(`
        SELECT COUNT(*) as count
        FROM broadcasts b
        LEFT JOIN player_broadcast_reads pbr ON b.id = pbr.broadcast_id AND pbr.player_id = $1
        WHERE pbr.is_read IS NULL OR pbr.is_read = false
      `, [playerId]);

      return {
        unread_tickets: parseInt(ticketUnreads.rows[0].count) || 0,
        unread_broadcasts: parseInt(broadcastUnreads.rows[0].count) || 0
      };
    }
  };

  /**
   * Helper functions
   */
  function notifyPlayer(playerId, eventName, data) {
    const socketId = connectedPlayers.get(playerId);
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(eventName, data);
      }
    }
  }

  function notifyAllAdmins(eventName, data) {
    // Emit to admin room/namespace (assumes admins join 'admins' room)
    io.to('admins').emit(eventName, data);
  }

  /**
   * Socket connection handler
   */
  io.on('connection', async (socket) => {
    console.log(`📬 Player ${socket.username} (${socket.userId}) connected to mailbox`);
    
    // Store connection
    connectedPlayers.set(socket.userId, socket.id);

    // Send connection confirmation
    socket.emit('connection_confirmed');

    /**
     * Player requests mailbox data
     */
    socket.on('get_mailbox_data', async () => {
      try {
        const [tickets, broadcasts, unreadCounts] = await Promise.all([
          queries.getPlayerTickets(socket.userId),
          queries.getPlayerBroadcasts(socket.userId),
          queries.getUnreadCounts(socket.userId)
        ]);

        socket.emit('mailbox_data', {
          tickets,
          broadcasts,
          unread_tickets: unreadCounts.unread_tickets,
          unread_broadcasts: unreadCounts.unread_broadcasts
        });
      } catch (error) {
        console.error('Error getting mailbox data:', error);
        socket.emit('error', { message: 'Failed to load mailbox data' });
      }
    });

    /**
     * Player creates new ticket (Contact Us)
     */
    socket.on('create_ticket', async (data) => {
      try {
        const { subject, body } = data;

        // Validate input
        if (!subject || subject.length > MAX_SUBJECT_LENGTH) {
          socket.emit('error', { message: 'Invalid subject length' });
          return;
        }
        if (!body || body.length > MAX_MESSAGE_LENGTH) {
          socket.emit('error', { message: 'Invalid message length' });
          return;
        }

        const ticket = await queries.createTicket(socket.userId, subject, body);
        
        socket.emit('ticket_created', { ticket });
        
        // Notify admins of new ticket
        notifyAllAdmins('new_ticket_notification', {
          ticket,
          player_username: socket.username
        });

      } catch (error) {
        console.error('Error creating ticket:', error);
        socket.emit('error', { message: 'Failed to create ticket' });
      }
    });

    /**
     * Player sends message to existing ticket
     */
    socket.on('send_message', async (data) => {
      try {
        const { ticket_id, body } = data;

        if (!body || body.length > MAX_MESSAGE_LENGTH) {
          socket.emit('error', { message: 'Invalid message length' });
          return;
        }

        const message = await queries.addMessage(ticket_id, 'player', socket.userId, body);
        
        socket.emit('message_sent', { message });

        // Notify admins of new message
        notifyAllAdmins('new_message_notification', {
          ticket_id,
          message,
          player_username: socket.username
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * Player marks message as read/unread
     */
    socket.on('mark_message', async (data) => {
      try {
        const { message_id, is_read } = data;
        
        await queries.markMessage(message_id, is_read);
        
        socket.emit('message_status_update', {
          message_id,
          is_read
        });

      } catch (error) {
        console.error('Error marking message:', error);
        socket.emit('error', { message: 'Failed to update message status' });
      }
    });

    /**
     * Player marks broadcast as read
     */
    socket.on('mark_broadcast', async (data) => {
      try {
        const { broadcast_id } = data;
        
        await queries.markBroadcastRead(socket.userId, broadcast_id);
        
        socket.emit('broadcast_marked_read', { broadcast_id });

      } catch (error) {
        console.error('Error marking broadcast:', error);
        socket.emit('error', { message: 'Failed to mark broadcast as read' });
      }
    });

    /**
     * Get messages for specific ticket
     */
    socket.on('get_ticket_messages', async (data) => {
      try {
        const { ticket_id } = data;
        const messages = await queries.getTicketMessages(ticket_id);
        
        socket.emit('ticket_messages', {
          ticket_id,
          messages
        });

      } catch (error) {
        console.error('Error getting ticket messages:', error);
        socket.emit('error', { message: 'Failed to load ticket messages' });
      }
    });

    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`📬 Player ${socket.username} (${socket.userId}) disconnected from mailbox`);
      connectedPlayers.delete(socket.userId);
    });
  });

  /**
   * Admin functions (called from admin interface)
   */
  const adminFunctions = {
    // Admin sends broadcast to all players
    async sendBroadcast(adminId, adminUsername, subject, body) {
      try {
        const now = new Date().toISOString();
        
        const result = await db.query(`
          INSERT INTO broadcasts (admin_id, admin_username, subject, body, sent_at)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `, [adminId, adminUsername, subject, body, now]);

        const broadcast = {
          id: result.rows[0].id,
          admin_id: adminId,
          admin_username: adminUsername,
          subject,
          body,
          sent_at: now,
          is_read: false
        };

        // Send to all connected players
        io.emit('new_broadcast', { broadcast });
        
        return broadcast;
      } catch (error) {
        console.error('Error sending broadcast:', error);
        throw error;
      }
    },

    // Admin replies to ticket
    async replyToTicket(ticketId, adminId, body) {
      try {
        const message = await queries.addMessage(ticketId, 'admin', adminId, body);
        
        // Get ticket info to find player
        const ticketResult = await db.query('SELECT player_id FROM tickets WHERE id = $1', [ticketId]);
        
        if (ticketResult.rows.length > 0) {
          const ticket = ticketResult.rows[0];
          // Notify the specific player
          notifyPlayer(ticket.player_id, 'new_message', {
            ticket_id: ticketId,
            message
          });
        }

        return message;
      } catch (error) {
        console.error('Error replying to ticket:', error);
        throw error;
      }
    }
  };

  return adminFunctions;
}

```

C:\dev\catwalk-client\js\main.js
```javascript
console.log('🐱 MAIN.JS LOADED');

// ───────────── Imports ─────────────
import { toggleShop } from './features/shop/shop.js';
import { renderShopItems } from './features/shop/shopItemsRenderer.js';
import { initializeMailbox, toggleMailbox, requestNotificationPermission } from './features/mailbox/mailbox.js';
import { toggleVolume } from './core/sound.js';
import { signOut } from './core/auth/authentication.js';
import { renderCarousel, scrollCarousel } from './features/ui/carousel.js';
import { scrollShop, setupShopTabs } from './features/shop/shopTabs.js';
import { showCatProfile, setupEditMode } from './features/user/cat_profile.js';
import { toggleUploadCat, toggleDetails } from './features/ui/popups.js';
import { toggleAddCat } from './features/addCat/addCat.js';

import { bindUI } from './features/ui/uiBinder.js';
import {
  loadShopAndTemplates,
  loadUserCats
} from './core/init/dataLoader.js';
import { updateUI } from './core/storage.js';



// ───────────── Init ─────────────
document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOMContentLoaded');

  try {
    /* STEP A then STEP B */
    await loadShopAndTemplates();
    await loadUserCats();
  } catch (err) {
    console.error('❌ Data load failed:', err);
    return; // bail before touching UI
  }

  /* UI init – safe to read breedItems & userCats from here */
  await updateUI();
  renderCarousel();
  setupShopTabs();
  setupEditMode();
  bindUI();

  // Initialize mailbox (only once!)
  await initializeMailbox();

  document.getElementById('addCatBtnEmpty')
    ?.addEventListener('click', () =>
      document.getElementById('addCatBtn')?.click()
    );

  console.log('✅ Systems initialized');
});


// ───────────── Expose to Window (for inline HTML handlers) ─────────────
Object.assign(window, {
  toggleShop,
  renderShopItems,
  toggleMailbox,
  toggleVolume,
  signOut,
  scrollCarousel,
  showCatProfile,
  toggleUploadCat,
  toggleDetails,
  toggleAddCat,
  renderCarousel
});

```

C:\dev\catwalk-server\index.js
```javascript
/*-----------------------------------------------------------------------------
  mailbox.js (SERVER) - Messages System for Cat Walk Game
  Handles real-time messaging via Socket.io
-----------------------------------------------------------------------------*/

import jwt from 'jsonwebtoken';

// Constants
const MAX_MESSAGE_LENGTH = 250;
const MAX_SUBJECT_LENGTH = 50;

/**
 * Setup mailbox functionality with Socket.io
 * @param {Object} io - Socket.io server instance
 * @param {Object} db - Database connection (e.g., sqlite, pg, etc.)
 * @param {string} jwtSecret - JWT secret for token verification
 */
export function setupMailbox(io, db, jwtSecret) {
  // Store connected players for targeted messaging
  const connectedPlayers = new Map(); // playerId -> socketId

  /**
   * Authenticate socket connection using JWT
   */
  function authenticate(socket, next) {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('No authentication token provided'));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    } catch (err) {
      next(new Error('Invalid authentication token'));
    }
  }

  // Apply authentication middleware
  io.use(authenticate);

  /**
   * Database query functions
   */
  const queries = {
    // Get all tickets for a player
    async getPlayerTickets(playerId) {
      const sql = `
        SELECT t.*, 
               COUNT(CASE WHEN m.is_read = false AND m.sender_type = 'admin' THEN 1 END) as unread_messages
        FROM tickets t
        LEFT JOIN messages m ON t.id = m.ticket_id
        WHERE t.player_id = $1
        GROUP BY t.id
        ORDER BY t.last_activity_at DESC
      `;
      const result = await db.query(sql, [playerId]);
      return result.rows;
    },

    // Get broadcasts for a player with read status
    async getPlayerBroadcasts(playerId) {
      const sql = `
        SELECT b.*,
               COALESCE(pbr.is_read, false) as is_read
        FROM broadcasts b
        LEFT JOIN player_broadcast_reads pbr ON b.id = pbr.broadcast_id AND pbr.player_id = $1
        ORDER BY b.sent_at DESC
      `;
      const result = await db.query(sql, [playerId]);
      return result.rows;
    },

    // Get messages for a specific ticket
    async getTicketMessages(ticketId) {
      const sql = `
        SELECT m.*, 
               CASE 
                 WHEN m.sender_type = 'player' THEN p.username
                 WHEN m.sender_type = 'admin' THEN a.username
               END as sender_username
        FROM messages m
        LEFT JOIN players p ON m.sender_type = 'player' AND m.sender_id = p.id
        LEFT JOIN admins a ON m.sender_type = 'admin' AND m.sender_id = a.id
        WHERE m.ticket_id = $1
        ORDER BY m.sent_at ASC
      `;
      const result = await db.query(sql, [ticketId]);
      return result.rows;
    },

    // Create new ticket
    async createTicket(playerId, subject, body) {
      const now = new Date().toISOString();
      
      // Insert ticket
      const ticketResult = await db.query(`
        INSERT INTO tickets (player_id, subject, status, created_at, last_activity_at)
        VALUES ($1, $2, 'open', $3, $4)
        RETURNING id
      `, [playerId, subject, now, now]);

      const ticketId = ticketResult.rows[0].id;

      // Insert first message
      await db.query(`
        INSERT INTO messages (ticket_id, sender_type, sender_id, subject, body, is_read, sent_at)
        VALUES ($1, 'player', $2, $3, $4, true, $5)
      `, [ticketId, playerId, subject, body, now]);

      return {
        id: ticketId,
        player_id: playerId,
        subject,
        status: 'open',
        created_at: now,
        last_activity_at: now
      };
    },

    // Add message to existing ticket
    async addMessage(ticketId, senderType, senderId, body) {
      const now = new Date().toISOString();
      
      // Insert message
      const result = await db.query(`
        INSERT INTO messages (ticket_id, sender_type, sender_id, body, is_read, sent_at)
        VALUES ($1, $2, $3, $4, false, $5)
        RETURNING id
      `, [ticketId, senderType, senderId, body, now]);

      // Update ticket last activity
      await db.query(`
        UPDATE tickets SET last_activity_at = $1 WHERE id = $2
      `, [now, ticketId]);

      return {
        id: result.rows[0].id,
        ticket_id: ticketId,
        sender_type: senderType,
        sender_id: senderId,
        body,
        is_read: false,
        sent_at: now
      };
    },

    // Mark message as read/unread
    async markMessage(messageId, isRead) {
      await db.query(`
        UPDATE messages SET is_read = $1 WHERE id = $2
      `, [isRead, messageId]);
    },

    // Mark broadcast as read for player
    async markBroadcastRead(playerId, broadcastId) {
      await db.query(`
        INSERT INTO player_broadcast_reads (player_id, broadcast_id, is_read)
        VALUES ($1, $2, true)
        ON CONFLICT (player_id, broadcast_id) 
        DO UPDATE SET is_read = true
      `, [playerId, broadcastId]);
    },

    // Get unread counts
    async getUnreadCounts(playerId) {
      const ticketUnreads = await db.query(`
        SELECT COUNT(*) as count
        FROM messages m
        JOIN tickets t ON m.ticket_id = t.id
        WHERE t.player_id = $1 AND m.sender_type = 'admin' AND m.is_read = false
      `, [playerId]);

      const broadcastUnreads = await db.query(`
        SELECT COUNT(*) as count
        FROM broadcasts b
        LEFT JOIN player_broadcast_reads pbr ON b.id = pbr.broadcast_id AND pbr.player_id = $1
        WHERE pbr.is_read IS NULL OR pbr.is_read = false
      `, [playerId]);

      return {
        unread_tickets: parseInt(ticketUnreads.rows[0].count) || 0,
        unread_broadcasts: parseInt(broadcastUnreads.rows[0].count) || 0
      };
    }
  };

  /**
   * Helper functions
   */
  function notifyPlayer(playerId, eventName, data) {
    const socketId = connectedPlayers.get(playerId);
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(eventName, data);
      }
    }
  }

  function notifyAllAdmins(eventName, data) {
    // Emit to admin room/namespace (assumes admins join 'admins' room)
    io.to('admins').emit(eventName, data);
  }

  /**
   * Socket connection handler
   */
  io.on('connection', async (socket) => {
    console.log(`📬 Player ${socket.username} (${socket.userId}) connected to mailbox`);
    
    // Store connection
    connectedPlayers.set(socket.userId, socket.id);

    // Send connection confirmation
    socket.emit('connection_confirmed');

    /**
     * Player requests mailbox data
     */
    socket.on('get_mailbox_data', async () => {
      try {
        const [tickets, broadcasts, unreadCounts] = await Promise.all([
          queries.getPlayerTickets(socket.userId),
          queries.getPlayerBroadcasts(socket.userId),
          queries.getUnreadCounts(socket.userId)
        ]);

        socket.emit('mailbox_data', {
          tickets,
          broadcasts,
          unread_tickets: unreadCounts.unread_tickets,
          unread_broadcasts: unreadCounts.unread_broadcasts
        });
      } catch (error) {
        console.error('Error getting mailbox data:', error);
        socket.emit('error', { message: 'Failed to load mailbox data' });
      }
    });

    /**
     * Player creates new ticket (Contact Us)
     */
    socket.on('create_ticket', async (data) => {
      try {
        const { subject, body } = data;

        // Validate input
        if (!subject || subject.length > MAX_SUBJECT_LENGTH) {
          socket.emit('error', { message: 'Invalid subject length' });
          return;
        }
        if (!body || body.length > MAX_MESSAGE_LENGTH) {
          socket.emit('error', { message: 'Invalid message length' });
          return;
        }

        const ticket = await queries.createTicket(socket.userId, subject, body);
        
        socket.emit('ticket_created', { ticket });
        
        // Notify admins of new ticket
        notifyAllAdmins('new_ticket_notification', {
          ticket,
          player_username: socket.username
        });

      } catch (error) {
        console.error('Error creating ticket:', error);
        socket.emit('error', { message: 'Failed to create ticket' });
      }
    });

    /**
     * Player sends message to existing ticket
     */
    socket.on('send_message', async (data) => {
      try {
        const { ticket_id, body } = data;

        if (!body || body.length > MAX_MESSAGE_LENGTH) {
          socket.emit('error', { message: 'Invalid message length' });
          return;
        }

        const message = await queries.addMessage(ticket_id, 'player', socket.userId, body);
        
        socket.emit('message_sent', { message });

        // Notify admins of new message
        notifyAllAdmins('new_message_notification', {
          ticket_id,
          message,
          player_username: socket.username
        });

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * Player marks message as read/unread
     */
    socket.on('mark_message', async (data) => {
      try {
        const { message_id, is_read } = data;
        
        await queries.markMessage(message_id, is_read);
        
        socket.emit('message_status_update', {
          message_id,
          is_read
        });

      } catch (error) {
        console.error('Error marking message:', error);
        socket.emit('error', { message: 'Failed to update message status' });
      }
    });

    /**
     * Player marks broadcast as read
     */
    socket.on('mark_broadcast', async (data) => {
      try {
        const { broadcast_id } = data;
        
        await queries.markBroadcastRead(socket.userId, broadcast_id);
        
        socket.emit('broadcast_marked_read', { broadcast_id });

      } catch (error) {
        console.error('Error marking broadcast:', error);
        socket.emit('error', { message: 'Failed to mark broadcast as read' });
      }
    });

    /**
     * Get messages for specific ticket
     */
    socket.on('get_ticket_messages', async (data) => {
      try {
        const { ticket_id } = data;
        const messages = await queries.getTicketMessages(ticket_id);
        
        socket.emit('ticket_messages', {
          ticket_id,
          messages
        });

      } catch (error) {
        console.error('Error getting ticket messages:', error);
        socket.emit('error', { message: 'Failed to load ticket messages' });
      }
    });

    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`📬 Player ${socket.username} (${socket.userId}) disconnected from mailbox`);
      connectedPlayers.delete(socket.userId);
    });
  });

  /**
   * Admin functions (called from admin interface)
   */
  const adminFunctions = {
    // Admin sends broadcast to all players
    async sendBroadcast(adminId, adminUsername, subject, body) {
      try {
        const now = new Date().toISOString();
        
        const result = await db.query(`
          INSERT INTO broadcasts (admin_id, admin_username, subject, body, sent_at)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `, [adminId, adminUsername, subject, body, now]);

        const broadcast = {
          id: result.rows[0].id,
          admin_id: adminId,
          admin_username: adminUsername,
          subject,
          body,
          sent_at: now,
          is_read: false
        };

        // Send to all connected players
        io.emit('new_broadcast', { broadcast });
        
        return broadcast;
      } catch (error) {
        console.error('Error sending broadcast:', error);
        throw error;
      }
    },

    // Admin replies to ticket
    async replyToTicket(ticketId, adminId, body) {
      try {
        const message = await queries.addMessage(ticketId, 'admin', adminId, body);
        
        // Get ticket info to find player
        const ticketResult = await db.query('SELECT player_id FROM tickets WHERE id = $1', [ticketId]);
        
        if (ticketResult.rows.length > 0) {
          const ticket = ticketResult.rows[0];
          // Notify the specific player
          notifyPlayer(ticket.player_id, 'new_message', {
            ticket_id: ticketId,
            message
          });
        }

        return message;
      } catch (error) {
        console.error('Error replying to ticket:', error);
        throw error;
      }
    }
  };

  return adminFunctions;
}

```

C:\dev\catwalk-client\pages\album.html
```javascript

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>

  <title>My Cats</title>
  <link rel="icon" type="image/png" href="../assets/icons/cat_browser_icon.png" />
  <script type="module" src="../js/core/auth/authentication.js"></script>
  <!-- ✅ Import all CSS files -->
  <link rel="stylesheet" href="../css/album-css/1_base.css">
  <link rel="stylesheet" href="../css/album-css/2_layout.css">
  <link rel="stylesheet" href="../css/album-css/3_components.css">
  <link rel="stylesheet" href="../css/album-css/4_add_cat.css">
  <link rel="stylesheet" href="../css/album-css/5_carousel.css">
  <link rel="stylesheet" href="../css/album-css/6_cat-album.css">
  <link rel="stylesheet" href="../css/album-css/7_shop.css">
  <link rel="stylesheet" href="../css/album-css/8_profile.css">
  <link rel="stylesheet" href="../css/album-css/9_modals.css">
  <link rel="stylesheet" href="../css/album-css/10_utilities.css">
  <link rel="stylesheet" href="../css/mailbox.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
</head>
<body>
  <div class="welcome-message" id="welcomeMessage">Welcome, </div>
  <button class="sign-out-btn" onclick="signOut()">Sign Out</button>
<div id="game">
  <!-- ✅ CAT AREA WRAPPER -->
<!-- CAT AREA WRAPPER -->
<div id="catAreaWrapper">
  <!-- Cat Display -->
<div class="cat-display-wrapper hidden" id="catDisplay">
    <div class="ellipse-podium">
      <img src="../assets/ui/Ellipse.svg" alt="Ellipse" class="center-ellipse" />
      <div class="carousel-cat">
        <img class="cat-layer carouselBase" alt="Base" />
        <img class="cat-layer carouselHat" alt="Hat" />
        <img class="cat-layer carouselTop" alt="Top" />
        <img class="cat-layer carouselEyes" alt="Eyes" />
        <img class="cat-layer carouselAccessory" alt="Accessory" />
      </div>
    </div>
  </div>
  <!-- Carousel Area -->
  <div class="carousel-wrapper" id="carouselWrapper">
    ...
  </div>
</div> <!-- ✅ END of #catAreaWrapper -->
<div id="emptyState" class="hidden empty-state-message">
  <h1 class="cats-title" style="margin-bottom: 0.5rem;">No cats :(</h1>
  <div style="font-size: 1.2rem; color: #666;">Press below to add one!</div>
  <button id="addCatBtnEmpty" class="add-cat-btn" style="margin-top: 1rem;">
    <img src="../assets/ui/plus.png" alt="Add Cat" />
  </button>
</div>
    <!-- Topbar -->
    <div class="topbar">
      <div class="topbar-icon coin-icon" title="Coins">
        <img src="../assets/icons/coin.png" alt="Coins" />
        <span class="coin-count">500</span>
      </div>
      <div class="topbar-icon" id="soundToggle" title="Sound" onclick="toggleSound()">
        <img id="soundIcon" src="../assets/icons/speakerON.png" alt="Sound" />
      </div>
      <div class="topbar-icon" title="Mailbox" onclick="toggleMailbox()">
        <img src="../assets/icons/mail.png" alt="Mailbox" />
      </div>
    </div>
    <!-- Title -->
    <h1 class="cats-title">MY CATS</h1>
    <!-- ✅ Mailbox Display -->
    <div class="mailbox-display" id="mailboxDisplay">
      <!-- Mailbox Navigation Buttons -->
      <div class="mailbox-nav">
        <button class="mailbox-btn active" data-tab="all">ALL MESSAGES</button>
        <button class="mailbox-btn" data-tab="unread">UNREAD</button>
        <button class="mailbox-btn" data-tab="sent">SENT</button>
        <button class="mailbox-btn" data-tab="contact">CONTACT US</button>
      </div>
      
      <!-- Mailbox Content Area -->
      <div class="mailbox-content">
        <!-- ALL MESSAGES List View -->
        <div class="message-list" id="allMessagesList">
          <!-- Message Box 1 -->
          <div class="message-box" data-message-id="1">
            <div class="message-title">Welcome to CatWalk! Your fashion journey begins now.</div>
            <div class="message-date">12/06/2025</div>
          </div>
          
          <!-- Message Box 2 -->
          <div class="message-box" data-message-id="2">
            <div class="message-title">New outfit collection available in the shop!</div>
            <div class="message-date">12/05/2025</div>
          </div>
          
          <!-- Message Box 3 -->
          <div class="message-box" data-message-id="3">
            <div class="message-title">Your cat looks amazing in the latest fashion show!</div>
            <div class="message-date">12/04/2025</div>
          </div>
          
          <!-- Message Box 4 -->
          <div class="message-box" data-message-id="4">
            <div class="message-title">Reminder: Don't forget to feed your cats daily.</div>
            <div class="message-date">12/03/2025</div>
          </div>
          
          <!-- Message Box 5 -->
          <div class="message-box" data-message-id="5">
            <div class="message-title">System maintenance scheduled for tonight.</div>
            <div class="message-date">12/02/2025</div>
          </div>
          
          <!-- Message Box 6 -->
          <div class="message-box" data-message-id="6">
            <div class="message-title">Special event: Double coins weekend starts tomorrow!</div>
            <div class="message-date">12/01/2025</div>
          </div>
          
          <!-- Message Box 7 -->
          <div class="message-box" data-message-id="7">
            <div class="message-title">Got ideas for new outfits or features? Contact us!</div>
            <div class="message-date">11/30/2025</div>
          </div>
          
          <!-- Message Box 8 -->
          <div class="message-box" data-message-id="8">
            <div class="message-title">Recent outfit loading bugs have been fixed.</div>
            <div class="message-date">11/29/2025</div>
          </div>
        </div>
        
        <!-- SENT MESSAGES List will be created dynamically by JavaScript -->
        
        <!-- Message Detail View (Shared by ALL MESSAGES and SENT) -->
        <div class="message-view" id="messageView">
          <!-- Message Header (Title and Date) -->
          <div class="message-view-header">
            <div class="message-view-title" id="messageViewTitle">Message Title</div>
            <div class="message-view-date" id="messageViewDate">12/06/2025</div>
          </div>
          
          <!-- Message Body -->
          <div class="message-body" id="messageViewBody">
            <p>Message content will appear here...</p>
          </div>
          
          <!-- Message Controls -->
          <div class="message-controls">
            <button class="back-btn" id="backToListBtn">←</button>
          </div>
        </div>
        
        <!-- Contact Us View -->
        <div class="contact-view" id="contactView">
          <!-- Contact Header (Title and Date) -->
          <div class="contact-view-header">
            <input type="text" class="contact-view-title" id="contactSubjectInput" placeholder="Type the subject here...">
            <div class="contact-view-date" id="contactViewDate">12/06/2025</div>
          </div>
          
          <!-- Contact Input Area -->
          <textarea class="contact-input-area" id="contactInput" placeholder="Type your message here..."></textarea>
          
          <!-- Contact Controls -->
          <div class="contact-controls">
            <button class="send-btn" id="sendBtn">SEND</button>
          </div>
        </div>
        
      </div>
    </div>
    <!-- Carousel Area -->
    <div class="wrapper">
  <div class="main-area">
  <!-- 🎠 Carousel Display -->
  <div class="carousel-wrapper">
    <div class="carousel-background">
      <button class="scroll-btn left" onclick="scrollCarousel(-1)">‹</button>
      <div class="carousel-viewport">
        <div class="carousel" id="catCarousel"></div>
      </div>
      <button class="scroll-btn right" onclick="scrollCarousel(1)">›</button>
      <button id="addCatBtn" class="add-cat-btn">
        <img src="../assets/ui/plus.png" alt="Add Cat" />
      </button>
    </div>
    <!-- 🧾 Floating Info -->
    <div class="floating-actions">
      <div class="inventory-box" id="cat-count">Inventory: 0/25</div>
    </div>
  </div>
  <!-- 🐱 Empty State Message -->
  <div id="emptyState" class="hidden empty-state-message" style="text-align:center; margin-top: 2rem;">
    <h1 class="cats-title" style="margin-bottom: 0.5rem;">No cats :(</h1>
    <div style="font-size: 1.2rem; color: #666;">Press below to add one!</div>
    <button id="addCatBtnEmpty" class="add-cat-btn" style="margin-top: 1rem;">
      <img src="../assets/ui/plus.png" alt="Add Cat" />
    </button>
  </div>
  <!-- 🧾 Right Pane: Profile + Shop -->
  <div class="right-pane">
    <div id="shopOverlayBlocker" class="shop-blocker hidden"></div>
    <!-- 🧑‍💻 Profile Panel -->
    <div id="catProfileScroll" class="cat-profile-scroll hidden">
      <div class="scroll-inner">
              <input type="text" id="catName" class="profile-name-input" disabled />
              <div class="profile-main">
                <div class="profile-info">
                  <div class="profile-row"><strong>Breed:</strong> <span id="profileBreed">-</span></div>
                  <div class="profile-row"><strong>Variant:</strong> <span id="profileVariant">-</span></div>
                  <div class="profile-row"><strong>Palette:</strong> <span id="profilePalette">-</span></div>
                  <div class="profile-row"><strong>Birthdate:</strong> <span id="profileBirthday">-</span></div>
                  <div class="profile-row"><strong>Age:</strong> <span id="profileAge">-</span></div>
                </div>
                <div class="top-right-icons">
<img id="profileImage" class="placeholder-uploadedcat-profile" alt="Uploaded Cat" />
                </div>
              </div>
              <!-- Description -->
              <div class="desc-block" id="descBlock">
                <label for="catDesc">Description:</label>
                <textarea id="catDesc" class="desc-input" maxlength="200" readonly></textarea>
                <div id="charCount" class="word-count">0 / 200 characters</div>
              </div>
              <!-- Footer Buttons -->
              <div class="profile-footer-buttons">
                <button class="profile-btn primary" id="editBtn">Edit</button>
                <button class="profile-btn danger" id="deleteBtn">Delete</button>
                <button class="profile-btn secondary" id="customizeBtn">Customize</button>
                <button class="profile-btn primary" id="fashionBtn">Enter Fashion Show</button>
                <button class="profile-btn primary save-cancel hidden" id="saveBtn">Save</button>
                <button class="profile-btn secondary save-cancel hidden" id="cancelBtn">Cancel</button>
              </div>
            </div>
          </div>
<!-- ✅ Shop Popup -->
<div id="shopPopup" class="shop-popup hidden">
  <div class="tabs">
    <div class="tab active" data-category="hats">Hats</div>
    <div class="tab" data-category="tops">Tops</div>
    <div class="tab" data-category="accessories">Accessories</div>
    <div class="tab" data-category="eyes">Eyes</div>
  </div>
  <div class="shop-scroll-wrapper">
    <div id="shopItems"></div>
  </div>
  <button id="shopCloseBtn" class="profile-btn danger" style="align-self: flex-end;">Close</button>
</div>
<!-- ✅ Add Cat Popup (matches Shop style) -->
<div id="addCatPopup" class="shop-popup hidden">
  <div class="tabs" id="breedTabs"></div>
  <div class="shop-scroll-wrapper">
    <div id="breedItems" class="shop-items"></div>
  </div>
  <button id="addCatCloseBtn" class="profile-btn danger" style="align-self: flex-end;">✕</button>
</div>
<!-- ✅ Add Cat Overlay -->
<div id="addCatOverlayBlocker" class="overlay hidden"></div>
  <!-- Audio + Scripts -->
<audio src="../assets/audio/bg-music.mp3" autoplay loop id="bgAudio"></audio>
<!-- ✅ Toastify FIRST -->
<script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
<!-- ✅ Your modules LAST -->
<script type="module" src="../js/main.js"></script>
</body>
</html>
```

C:\dev\catwalk-client\css\mailbox.css - this exists but i wont share since the code is long

# Important note:
✅ Connected to Socket.io server
But later also seeing:

pgsql
Copy
Edit
WebSocket connection to 'wss://catwalk-server-eu.onrender.com/socket.io/?EIO=4&transport=websocket&sid=...' failed
✅ This is OK if:
Socket.io falls back from WebSocket to polling when WebSocket fails — as long as the connection continues to work and you can send/receive events, you're fine.

✅ Ignore this warning if messages are still sent and received. It’s a common issue with some hosting providers like Render not supporting WebSockets unless configured.

If real-time messages don’t work (not being received by other clients), we’ll fix that in a minute.




