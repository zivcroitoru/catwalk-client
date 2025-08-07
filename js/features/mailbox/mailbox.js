// /*-----------------------------------------------------------------------------
//   mailbox.js (CLIENT) - Messages System for Cat Walk Game
//   Handles messaging via REST API calls to Neon database
// -----------------------------------------------------------------------------*/

// import { getLoggedInUserInfo } from '../../core/utils.js';
// import { APP_URL } from '../../core/config.js';

// // Constants
// const MAX_MESSAGE_LENGTH = 250;
// const MAX_SUBJECT_LENGTH = 50;
// const REFRESH_INTERVAL = 30000; // 30 seconds for auto-refresh

// // Global state
// let currentUser = null;
// let mailboxData = {
//   tickets: [],
//   broadcasts: [],
//   unread_tickets: 0,
//   unread_broadcasts: 0
// };
// let currentView = 'list'; // 'list', 'detail', 'contact', 'conversation'
// let currentTab = 'all'; // 'all', 'unread', 'sent', 'contact'
// let selectedMessage = null;
// let selectedTicket = null;
// let refreshInterval = null;

// // DOM Elements (cached for performance)
// let mailboxDisplay = null;
// let mailboxButtons = [];
// let contentArea = null;
// let messagesList = null;
// let messageView = null;
// let contactView = null;
// let conversationView = null;

// /**
//  * Initialize the mailbox system
//  */
// export async function initializeMailbox() {
//   try {
//     console.log('🚀 STARTING MAILBOX INITIALIZATION...');
    
//     // Get current user info
//     currentUser = await getLoggedInUserInfo();
//     console.log('👤 Current user:', currentUser);
    
//     // Cache DOM elements
//     cacheElements();
    
//     // Setup event listeners
//     setupEventListeners();
    
//     // Load initial data
//     await loadMailboxData();
    
//     // Setup auto-refresh
//     setupAutoRefresh();
    
//     console.log('📬 Mailbox initialized successfully');
//   } catch (error) {
//     console.error('❌ Failed to initialize mailbox:', error);
//     showError('Failed to initialize mailbox. Please refresh the page.');
//   }
// }

// /**
//  * Cache DOM elements for better performance
//  */
// function cacheElements() {
//   mailboxDisplay = document.getElementById('mailboxDisplay');
//   contentArea = document.querySelector('.mailbox-content');
//   messagesList = document.getElementById('allMessagesList');
//   messageView = document.getElementById('messageView');
//   contactView = document.getElementById('contactView');
//   conversationView = document.querySelector('.conversation-view');
  
//   // Cache navigation buttons with debugging
//   const foundButtons = document.querySelectorAll('.mailbox-btn');
//   console.log('🔍 Found mailbox buttons:', foundButtons.length, foundButtons);

//   // Cache navigation buttons
//   mailboxButtons = Array.from(document.querySelectorAll('.mailbox-btn'));

//   // Debug all elements
//   console.log('📬 Cached elements:', {
//     mailboxDisplay: !!mailboxDisplay,
//     contentArea: !!contentArea,
//     messagesList: !!messagesList,
//     messageView: !!messageView,
//     contactView: !!contactView,
//     conversationView: !!conversationView,
//     mailboxButtons: mailboxButtons.length
//   });
// }

// /**
//  * Setup all event listeners
//  */
// function setupEventListeners() {
//   console.log('🔧 Setting up mailbox event listeners...');
  
//   // Wait for DOM to be ready if needed
//   if (document.readyState === 'loading') {
//     console.log('🔧 DOM still loading, waiting...');
//     document.addEventListener('DOMContentLoaded', () => {
//       setTimeout(setupEventListeners, 100);
//     });
//     return;
//   }
  
//   // Cache navigation buttons with retry logic
//   mailboxButtons = Array.from(document.querySelectorAll('.mailbox-btn'));
//   console.log(`🔧 Found ${mailboxButtons.length} mailbox buttons`);
  
//   if (mailboxButtons.length === 0) {
//     console.warn('⚠️ No mailbox buttons found, retrying in 200ms...');
//     setTimeout(setupEventListeners, 200);
//     return;
//   }
  
//   // Tab navigation
//   mailboxButtons.forEach((btn, index) => {
//     const tab = btn.dataset.tab;
//     console.log(`🔧 Binding button ${index}: ${tab}`);
    
//     // Remove any existing click listeners
//     btn.onclick = null;
    
//     // Add click listener
//     const clickHandler = (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       console.log('🔧 Tab clicked:', tab);
//       try {
//         handleTabSwitch(tab);
//       } catch (error) {
//         console.error('❌ Error in tab switch:', error);
//       }
//     };
    
//     btn.addEventListener('click', clickHandler);
//     btn.onclick = clickHandler;  // Fallback
    
//     console.log(`✅ Listener attached to button ${index} (${tab})`);
//   });
  
//   // Test first button
//   if (mailboxButtons.length > 0) {
//     console.log('🧪 Testing first button click handler...');
//     const testBtn = mailboxButtons[0];
//     setTimeout(() => {
//       console.log('🧪 Simulating click on:', testBtn.dataset.tab);
//       testBtn.click();
//     }, 500);
//   }
  
//   // Back button in message view
//   const backBtn = document.getElementById('backToListBtn');
//   if (backBtn) {
//     console.log('🔧 Binding back button');
//     backBtn.onclick = () => {
//       console.log('🔧 Back button clicked');
//       showView('list');
//     };
//   }
  
//   // Send button in contact view
//   const sendBtn = document.getElementById('sendBtn');
//   if (sendBtn) {
//     console.log('🔧 Binding send button');
//     sendBtn.onclick = (e) => {
//       e.preventDefault();
//       console.log('🔧 Send button clicked');
//       handleSendMessage();
//     };
//   }
  
//   // Contact form validation
//   const subjectInput = document.getElementById('contactSubjectInput');
//   const messageInput = document.getElementById('contactInput');
  
//   if (subjectInput) {
//     console.log('🔧 Binding subject input validation');
//     subjectInput.addEventListener('input', () => validateInput(subjectInput, MAX_SUBJECT_LENGTH));
//   }
  
//   if (messageInput) {
//     console.log('🔧 Binding message input validation');
//     messageInput.addEventListener('input', () => validateInput(messageInput, MAX_MESSAGE_LENGTH));
//   }
  
//   // Set current date in contact view
//   const contactDateElement = document.getElementById('contactViewDate');
//   if (contactDateElement) {
//     contactDateElement.textContent = formatDate(new Date());
//     console.log('🔧 Set contact view date');
//   }
  
//   console.log('✅ All mailbox event listeners set up successfully');
// }

// /**
//  * Setup auto-refresh interval
//  */
// function setupAutoRefresh() {
//   // Clear any existing interval
//   if (refreshInterval) {
//     clearInterval(refreshInterval);
//   }
  
//   // Set up new interval
//   refreshInterval = setInterval(() => {
//     if (mailboxDisplay?.classList.contains('show')) {
//       console.log('🔄 Auto-refreshing mailbox data...');
//       loadMailboxData();
//     }
//   }, REFRESH_INTERVAL);
// }

// /**
//  * Make API request with authentication
//  */
// async function makeAPIRequest(endpoint, options = {}) {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     throw new Error('No authentication token');
//   }
  
//   const defaultOptions = {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   };
  
//   const finalOptions = {
//     ...defaultOptions,
//     ...options,
//     headers: {
//       ...defaultOptions.headers,
//       ...options.headers,
//     },
//   };
  
//   const response = await fetch(`${APP_URL}${endpoint}`, finalOptions);
  
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//   }
  
//   return response.json();
// }

// /**
//  * Toggle mailbox visibility
//  */
// export function toggleMailbox() {
//   if (!mailboxDisplay) return;
  
//   const isVisible = mailboxDisplay.classList.contains('show');
  
//   if (isVisible) {
//     closeMailbox();
//   } else {
//     openMailbox();
//   }
// }

// /**
//  * Open mailbox
//  */
// async function openMailbox() {
//   if (!mailboxDisplay) return;
  
//   mailboxDisplay.classList.add('show');
  
//   // Load fresh data when opening
//   await loadMailboxData();
  
//   // Reset to default view
//   showView('list');
//   setActiveTab('all');
// }

// /**
//  * Close mailbox
//  */
// function closeMailbox() {
//   if (!mailboxDisplay) return;
  
//   mailboxDisplay.classList.remove('show');
// }

// /**
//  * Load mailbox data from database
//  */
// async function loadMailboxData() {
//   try {
//     console.log('📬 Loading mailbox data from database...');
    
//     const data = await makeAPIRequest('/api/mailbox/data');
    
//     mailboxData = data;
//     console.log('📬 Received mailbox data:', data);
    
//     // Update notification indicators
//     updateNotificationIndicators();
    
//     // Render current view
//     renderCurrentView();
    
//   } catch (error) {
//     console.error('❌ Failed to load mailbox data:', error);
//     showError('Failed to load messages. Please try again.');
//   }
// }

// /**
//  * Handle tab switching
//  */
// function handleTabSwitch(tab) {
//   console.log('🎯 handleTabSwitch called with tab:', tab);
//   console.log('🎯 Previous tab:', currentTab, '→ New tab:', tab);
  
//   currentTab = tab;
//   setActiveTab(tab);
  
//   switch (tab) {
//     case 'all':
//       console.log('🎯 Switching to ALL MESSAGES');
//       showView('list');
//       renderAllMessages();
//       break;
//     case 'unread':
//       console.log('🎯 Switching to UNREAD');
//       showView('list');
//       renderUnreadMessages();
//       break;
//     case 'sent':
//       console.log('🎯 Switching to SENT');
//       showView('list');
//       renderSentMessages();
//       break;
//     case 'contact':
//       console.log('🎯 Switching to CONTACT US');
//       showView('contact');
//       clearContactForm();
//       break;
//     default:
//       console.warn('⚠️ Unknown tab:', tab);
//   }
// }

// /**
//  * Set active tab visual state
//  */
// function setActiveTab(activeTab) {
//   console.log('🎨 setActiveTab called with:', activeTab);
  
//   mailboxButtons.forEach((btn, index) => {
//     const btnTab = btn.dataset.tab;
//     if (btnTab === activeTab) {
//       btn.classList.add('active');
//       console.log(`🎨 Button ${index} (${btnTab}) set to ACTIVE`);
//     } else {
//       btn.classList.remove('active');
//       console.log(`🎨 Button ${index} (${btnTab}) set to inactive`);
//     }
//   });
// }

// /**
//  * Show specific view
//  */
// function showView(view) {
//   currentView = view;
  
//   // Hide all views first
//   if (messagesList) messagesList.style.display = 'none';
//   if (messageView) messageView.style.display = 'none';
//   if (contactView) contactView.style.display = 'none';
//   if (conversationView) conversationView.style.display = 'none';
  
//   // Show the requested view
//   switch (view) {
//     case 'list':
//       if (messagesList) messagesList.style.display = 'flex';
//       break;
//     case 'detail':
//       if (messageView) messageView.style.display = 'flex';
//       break;
//     case 'contact':
//       if (contactView) contactView.style.display = 'flex';
//       break;
//     case 'conversation':
//       if (conversationView) conversationView.style.display = 'flex';
//       break;
//   }
// }

// /**
//  * Render all messages (ALL MESSAGES tab - shows all broadcasts)
//  */
// function renderAllMessages() {
//   if (!messagesList) return;
  
//   const allBroadcasts = mailboxData.broadcasts.map(b => ({ ...b, type: 'broadcast' }))
//     .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
  
//   renderMessageList(allBroadcasts);
// }

// /**
//  * Render unread messages (UNREAD tab - shows unread broadcasts only)
//  */
// function renderUnreadMessages() {
//   if (!messagesList) return;
  
//   const unreadBroadcasts = mailboxData.broadcasts
//     .filter(b => !b.is_read)
//     .map(b => ({ ...b, type: 'broadcast' }))
//     .sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
  
//   renderMessageList(unreadBroadcasts);
// }

// /**
//  * Render sent messages (SENT tab - shows all tickets)
//  */
// function renderSentMessages() {
//   if (!messagesList) return;
  
//   const allTickets = mailboxData.tickets.map(t => ({ ...t, type: 'ticket' }))
//     .sort((a, b) => new Date(b.last_activity_at) - new Date(a.last_activity_at));
  
//   renderMessageList(allTickets);
// }

// /**
//  * Render message list
//  */
// function renderMessageList(messages) {
//   if (!messagesList) return;
  
//   messagesList.innerHTML = '';
  
//   if (messages.length === 0) {
//     const emptyMessage = document.createElement('div');
//     emptyMessage.className = 'empty-message';
//     emptyMessage.textContent = 'No messages to display';
//     emptyMessage.style.cssText = `
//       text-align: center;
//       padding: 20px;
//       color: var(--color-text-secondary);
//       font-style: italic;
//     `;
//     messagesList.appendChild(emptyMessage);
//     return;
//   }
  
//   messages.forEach(message => {
//     const messageBox = createMessageBox(message);
//     messagesList.appendChild(messageBox);
//   });
// }

// /**
//  * Create individual message box element
//  */
// function createMessageBox(message) {
//   const messageBox = document.createElement('div');
//   messageBox.className = 'message-box';
//   messageBox.dataset.messageId = message.id;
//   messageBox.dataset.messageType = message.type;
  
//   // Add read class based on message type and status
//   if (message.type === 'broadcast') {
//     if (message.is_read) {
//       messageBox.classList.add('read');
//     }
//   } else if (message.type === 'ticket') {
//     if (message.status === 'closed') {
//       messageBox.classList.add('read');
//     }
//   }
  
//   const title = document.createElement('div');
//   title.className = 'message-title';
//   title.textContent = message.subject;
  
//   const date = document.createElement('div');
//   date.className = 'message-date';
//   date.textContent = formatDate(new Date(message.sent_at || message.last_activity_at));
  
//   messageBox.appendChild(title);
//   messageBox.appendChild(date);
  
//   // Click handler
//   messageBox.addEventListener('click', () => {
//     if (message.type === 'broadcast') {
//       showBroadcastDetail(message);
//     } else if (message.type === 'ticket') {
//       showTicketDetail(message);
//     }
//   });
  
//   return messageBox;
// }

// /**
//  * Show broadcast detail
//  */
// async function showBroadcastDetail(broadcast) {
//   selectedMessage = broadcast;
  
//   // Update message view elements
//   const titleElement = document.getElementById('messageViewTitle');
//   const dateElement = document.getElementById('messageViewDate');
//   const bodyElement = document.getElementById('messageViewBody');
  
//   if (titleElement) titleElement.textContent = broadcast.subject;
//   if (dateElement) dateElement.textContent = formatDate(new Date(broadcast.sent_at));
//   if (bodyElement) bodyElement.innerHTML = `<p>${broadcast.body}</p>`;
  
//   // Mark as read if not already
//   if (!broadcast.is_read) {
//     try {
//       await makeAPIRequest(`/api/mailbox/broadcasts/${broadcast.id}/mark-read`, {
//         method: 'POST'
//       });
      
//       // Update local state
//       broadcast.is_read = true;
//       updateNotificationIndicators();
      
//     } catch (error) {
//       console.error('❌ Failed to mark broadcast as read:', error);
//     }
//   }
  
//   showView('detail');
// }

// /**
//  * Show ticket detail (conversation view)
//  */
// async function showTicketDetail(ticket) {
//   selectedTicket = ticket;
  
//   try {
//     console.log('📬 Loading ticket messages for ticket:', ticket.id);
    
//     const data = await makeAPIRequest(`/api/mailbox/tickets/${ticket.id}/messages`);
    
//     renderConversationView(data.messages);
//     showView('conversation');
    
//   } catch (error) {
//     console.error('❌ Failed to load ticket messages:', error);
//     showError('Failed to load conversation. Please try again.');
//   }
// }

// /**
//  * Render conversation view
//  */
// function renderConversationView(messages) {
//   if (!conversationView) return;
  
//   // Update conversation header
//   const titleElement = conversationView.querySelector('.conversation-view-title');
//   const dateElement = conversationView.querySelector('.conversation-view-date');
  
//   if (titleElement && selectedTicket) titleElement.textContent = selectedTicket.subject;
//   if (dateElement && selectedTicket) dateElement.textContent = formatDate(new Date(selectedTicket.created_at));
  
//   // Render message history
//   const historyContainer = conversationView.querySelector('.conversation-history');
//   if (historyContainer) {
//     historyContainer.innerHTML = '';
    
//     if (messages.length === 0) {
//       const emptyMessage = document.createElement('div');
//       emptyMessage.className = 'empty-conversation';
//       emptyMessage.textContent = 'No messages in this conversation yet.';
//       emptyMessage.style.cssText = `
//         text-align: center;
//         padding: 20px;
//         color: var(--color-text-secondary);
//         font-style: italic;
//       `;
//       historyContainer.appendChild(emptyMessage);
//     } else {
//       messages.forEach(message => {
//         const messageElement = createConversationMessage(message);
//         historyContainer.appendChild(messageElement);
//       });
      
//       // Scroll to bottom
//       historyContainer.scrollTop = historyContainer.scrollHeight;
//     }
//   }
  
//   // Setup conversation input
//   setupConversationInput();
// }

// /**
//  * Create conversation message element
//  */
// function createConversationMessage(message) {
//   const messageDiv = document.createElement('div');
//   messageDiv.className = `conversation-message ${message.sender_type}`;
  
//   const contentDiv = document.createElement('div');
//   contentDiv.className = 'message-content';
//   contentDiv.textContent = message.body;
  
//   const timestampDiv = document.createElement('div');
//   timestampDiv.className = 'message-timestamp';
//   timestampDiv.textContent = formatDateTime(new Date(message.sent_at));
  
//   messageDiv.appendChild(contentDiv);
//   messageDiv.appendChild(timestampDiv);
  
//   return messageDiv;
// }

// /**
//  * Setup conversation input functionality
//  */
// function setupConversationInput() {
//   const inputArea = conversationView?.querySelector('.conversation-input-area');
//   const sendBtn = conversationView?.querySelector('.send-btn');
//   const backBtn = conversationView?.querySelector('.back-btn');
  
//   if (sendBtn) {
//     sendBtn.onclick = async () => {
//       if (inputArea && inputArea.value.trim() && selectedTicket) {
//         const message = inputArea.value.trim();
        
//         if (message.length <= MAX_MESSAGE_LENGTH) {
//           try {
//             await makeAPIRequest(`/api/mailbox/tickets/${selectedTicket.id}/messages`, {
//               method: 'POST',
//               body: JSON.stringify({
//                 body: message
//               })
//             });
            
//             // Clear input
//             inputArea.value = '';
            
//             // Reload conversation
//             showTicketDetail(selectedTicket);
            
//             showSuccess('Message sent successfully!');
            
//           } catch (error) {
//             console.error('❌ Failed to send message:', error);
//             showError('Failed to send message. Please try again.');
//           }
//         } else {
//           showError('Message too long. Maximum 250 characters.');
//         }
//       }
//     };
//   }
  
//   if (backBtn) {
//     backBtn.onclick = () => showView('list');
//   }
// }

// /**
//  * Handle sending new message (Contact Us)
//  */
// async function handleSendMessage() {
//   const subjectInput = document.getElementById('contactSubjectInput');
//   const messageInput = document.getElementById('contactInput');
  
//   if (!subjectInput || !messageInput) return;
  
//   const subject = subjectInput.value.trim();
//   const body = messageInput.value.trim();
  
//   // Validation
//   if (!subject) {
//     showError('Please enter a subject.');
//     return;
//   }
  
//   if (!body) {
//     showError('Please enter a message.');
//     return;
//   }
  
//   if (subject.length > MAX_SUBJECT_LENGTH) {
//     showError(`Subject too long. Maximum ${MAX_SUBJECT_LENGTH} characters.`);
//     return;
//   }
  
//   if (body.length > MAX_MESSAGE_LENGTH) {
//     showError(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
//     return;
//   }
  
//   try {
//     console.log('📬 Creating new ticket...');
    
//     const result = await makeAPIRequest('/api/mailbox/tickets', {
//       method: 'POST',
//       body: JSON.stringify({
//         subject: subject,
//         body: body
//       })
//     });
    
//     console.log('📬 Ticket created:', result);
    
//     // Clear form
//     clearContactForm();
    
//     // Show success message
//     showSuccess('Message sent successfully!');
    
//     // Switch to All Messages tab
//     handleTabSwitch('all');
    
//     // Reload data
//     await loadMailboxData();
    
//   } catch (error) {
//     console.error('❌ Failed to create ticket:', error);
//     showError('Failed to send message. Please try again.');
//   }
// }

// /**
//  * Update notification indicators
//  */
// function updateNotificationIndicators() {
//   // Count unread broadcasts
//   const unreadBroadcastsCount = mailboxData.broadcasts.filter(b => !b.is_read).length;
  
//   // Count tickets with unread messages (from admin)
//   const unreadTicketsCount = mailboxData.tickets.filter(t => t.unread_messages > 0).length;
  
//   const totalUnread = unreadBroadcastsCount + unreadTicketsCount;
  
//   // Update mailbox icon with notification indicator
//   const mailboxIcon = document.querySelector('.topbar-icon[title="Mailbox"]');
//   if (mailboxIcon && totalUnread > 0) {
//     // Add notification indicator if not exists
//     let indicator = mailboxIcon.querySelector('.notification-indicator');
//     if (!indicator) {
//       indicator = document.createElement('div');
//       indicator.className = 'notification-indicator';
//       indicator.style.cssText = `
//         position: absolute;
//         top: -5px;
//         right: -5px;
//         background: var(--color-red);
//         color: white;
//         border-radius: 50%;
//         width: 20px;
//         height: 20px;
//         font-size: 12px;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//         font-weight: bold;
//         z-index: 1001;
//       `;
//       mailboxIcon.style.position = 'relative';
//       mailboxIcon.appendChild(indicator);
//     }
//     indicator.textContent = totalUnread > 99 ? '99+' : totalUnread.toString();
//   } else {
//     // Remove indicator if no unread messages
//     const indicator = mailboxIcon?.querySelector('.notification-indicator');
//     if (indicator) {
//       indicator.remove();
//     }
//   }
// }

// /**
//  * Render current view based on current tab
//  */
// function renderCurrentView() {
//   switch (currentTab) {
//     case 'all':
//       renderAllMessages();
//       break;
//     case 'unread':
//       renderUnreadMessages();
//       break;
//     case 'sent':
//       renderSentMessages();
//       break;
//     case 'contact':
//       // Contact view doesn't need rendering
//       break;
//   }
// }

// /**
//  * Clear contact form
//  */
// function clearContactForm() {
//   const subjectInput = document.getElementById('contactSubjectInput');
//   const messageInput = document.getElementById('contactInput');
  
//   if (subjectInput) subjectInput.value = '';
//   if (messageInput) messageInput.value = '';
// }

// /**
//  * Validate input length
//  */
// function validateInput(input, maxLength) {
//   if (input.value.length > maxLength) {
//     input.value = input.value.substring(0, maxLength);
//     showError(`Maximum ${maxLength} characters allowed.`);
//   }
// }

// /**
//  * Format date for display
//  */
// function formatDate(date) {
//   return date.toLocaleDateString('en-US', {
//     month: '2-digit',
//     day: '2-digit',
//     year: 'numeric'
//   });
// }

// /**
//  * Format date and time for display
//  */
// function formatDateTime(date) {
//   return date.toLocaleString('en-US', {
//     month: '2-digit',
//     day: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// }

// /**
//  * Show success message
//  */
// function showSuccess(message) {
//   if (typeof Toastify !== 'undefined') {
//     Toastify({
//       text: message,
//       duration: 3000,
//       gravity: "top",
//       position: "right",
//       backgroundColor: "var(--color-gold)",
//       stopOnFocus: true
//     }).showToast();
//   } else {
//     alert(message);
//   }
// }

// /**
//  * Show error message
//  */
// function showError(message) {
//   if (typeof Toastify !== 'undefined') {
//     Toastify({
//       text: message,
//       duration: 3000,
//       gravity: "top",
//       position: "right",
//       backgroundColor: "var(--color-red)",
//       stopOnFocus: true
//     }).showToast();
//   } else {
//     alert(message);
//   }
// }

// /**
//  * Show notification
//  */
// function showNotification(message) {
//   if ('Notification' in window && Notification.permission === 'granted') {
//     new Notification('Cat Walk', {
//       body: message,
//       icon: '../assets/icons/cat_browser_icon.png'
//     });
//   } else {
//     showSuccess(message);
//   }
// }

// /**
//  * Request notification permission
//  */
// export function requestNotificationPermission() {
//   if ('Notification' in window && Notification.permission === 'default') {
//     Notification.requestPermission();
//   }
// }

// /**
//  * Cleanup function for when user leaves the page
//  */
// export function cleanup() {
//   // Clear auto-refresh interval
//   if (refreshInterval) {
//     clearInterval(refreshInterval);
//     refreshInterval = null;
//   }
// }

// /**
//  * Manual refresh function for user-triggered refresh
//  */
// export async function refreshMailbox() {
//   console.log('🔄 Manual mailbox refresh triggered');
//   await loadMailboxData();
//   showSuccess('Mailbox refreshed!');
// }

// // Make functions available globally for HTML onclick
// window.toggleMailbox = toggleMailbox;
// window.refreshMailbox = refreshMailbox;

// // Auto-initialize when module loads (uncommented for REST API approach)
// initializeMailbox();
