/*-----------------------------------------------------------------------------
  mailbox.js (CLIENT) - Messages System for Cat Walk Game
  Handles real-time messaging via Socket.io
-----------------------------------------------------------------------------*/

import { getLoggedInUserInfo } from '../../core/utils.js';
import { APP_URL } from '../core/config.js';

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
    const socketUrl = APP_URL.replace('http', 'ws'); // Convert to WebSocket URL
    
    socket = io(socketUrl, {
      auth: {
        token: token
      }
    });
    
    // Connection events
    socket.on('connect', () => {
      console.log('📬 Connected to mailbox server');
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