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


# Cat Walk Messages System - Current Status Summary

## File Analysis

### 1. **index.js (Server Entry Point)**
**Purpose**: Main server setup and mailbox system initialization
**Key Components**:
- Express server with Socket.io integration
- CORS configuration for `localhost:3000` and `process.env.FRONTEND_URL`
- Route mounting for auth, cats, players, shop, admins, player items
- **Mailbox Initialization**: Happens AFTER server starts in the `server.listen()` callback
- **Current State**: Active setup with some commented-out previous initialization attempts
- **Socket.io Setup**: Configured with CORS credentials and connection logging

### 2. **mailbox.js (SERVER)**
**Purpose**: Server-side Socket.io message handling and database operations
**Key Features**:
- **Authentication**: JWT token verification middleware for Socket.io connections
- **Database Queries**: Comprehensive query functions for tickets, broadcasts, messages, read status
- **Real-time Events**: Handles `get_mailbox_data`, `create_ticket`, `send_message`, `mark_message`, `mark_broadcast`
- **Admin Functions**: Returns functions for `sendBroadcast()` and `replyToTicket()`
- **Player Tracking**: Uses Map to track connected players for targeted messaging
- **Message Limits**: 250 char max message, 50 char max subject
- **Current State**: Fully implemented with proper error handling and notifications

### 3. **mailbox.js (CLIENT)**
**Purpose**: Client-side Socket.io connection and UI management
**Key Features**:
- **Socket Connection**: Connects to `APP_URL` with JWT token authentication
- **UI State Management**: Manages tabs (all/unread/sent/contact), views (list/detail/conversation), selected messages
- **Event Handling**: Tab switching, message clicking, form submission, real-time updates
- **Notification System**: Shows unread counts, browser notifications, toast messages
- **Auto-initialization**: Has commented-out auto-init at bottom
- **Current State**: Ready but requires manual initialization call

### 4. **HTML Structure**
**Purpose**: UI layout for mailbox system
**Key Components**:
- **Navigation**: 4 tabs (ALL MESSAGES, UNREAD, SENT, CONTACT US)
- **Views**: Message list, detail view, contact form, conversation view
- **Static Content**: Contains 8 placeholder messages for testing
- **Integration**: Socket.io CDN, Toastify notifications, modular JS imports
- **Current State**: Fully structured but relies on JS for dynamic content

## Current System Status

### **Connection Status** ✅
- Socket.io connection established: "Connected to mailbox server"
- WebSocket failure with fallback to polling (this is normal and acceptable)
- JWT authentication working for socket connections

### **Tab Behavior Implementation**
Based on user story requirements:
- **ALL MESSAGES**: Shows all broadcasts (read=white, unread=grey)
- **UNREAD**: Shows only unread broadcasts
- **SENT**: Shows all tickets - player-created AND admin-replied (opened=white, closed=grey)  
- **CONTACT US**: Create new ticket form

### **Real-time Message Flow**
**Server → Client Events**:
- `mailbox_data` - Initial data load
- `new_broadcast` - Admin broadcasts to all players
- `new_message` - Admin replies to specific player
- `message_status_update` - Read/unread status changes

**Client → Server Events**:
- `get_mailbox_data` - Request current data
- `create_ticket` - Send new message (Contact Us)
- `send_message` - Reply to existing conversation
- `mark_message` / `mark_broadcast` - Update read status

### **Current Issues/Status** ⚠️

1. **Initialization**: Client mailbox has `// initializeMailbox();` commented out at bottom, requiring manual init
2. **WebSocket Fallback**: Normal polling fallback due to hosting provider limitations
3. **Static Data**: HTML contains placeholder messages that should be replaced by dynamic data
4. **Global Exposure**: `window.toggleMailbox = toggleMailbox;` set for HTML onclick handlers

### **Database Schema Requirements**
The system expects these tables:
- `tickets` (id, player_id, subject, status, created_at, last_activity_at)
- `messages` (id, ticket_id, sender_type, sender_id, subject, body, is_read, sent_at)  
- `broadcasts` (id, admin_id, admin_username, subject, body, sent_at)
- `player_broadcast_reads` (player_id, broadcast_id, is_read)

### **Integration Points**
- **main.js**: Imports and should initialize mailbox system
- **authentication.js**: Provides JWT token for socket auth
- **config.js**: Provides APP_URL for socket connection
- **utils.js**: Provides `getLoggedInUserInfo()` for user context

## Summary
The messages system is **architecturally complete and properly connected**, but appears to be in a **testing/integration phase** where real-time functionality works but may need final initialization calls and dynamic data replacement. The WebSocket fallback to polling is normal and shouldn't prevent real-time messaging from functioning.


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


# Lets Analyze the console, check if we have problems.

# Problem - right now the mailbox tabs (buttons) don't respond
Right now the mailbox tabs (buttons) don't respond, let's investigate. Are there certain files you need me to send over so we can find the route of the problem?

# I suspect that right now all of the information we have in the messages is purely local
I suspect that right now all of the information we have in the messages is purely local, this was fine until now since it was a placeholder - but now the real magic begins. We need to fetch the data from our neon DB. 
Also- how exactly do the sockets come into play here?


