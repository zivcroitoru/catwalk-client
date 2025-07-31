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


In utils.js:
```javascript

```

In bindings.js:
```javascript

```


## Mailbox Tab Behavior Clarification:

ALL MESSAGES = All broadcasts (read = white background, unread = grey)
UNREAD = Only unread broadcasts (same coloring)
SENT = All tickets - both player-created AND admin-replied (opened = white, closed = grey)
CONTACT US = Create new ticket form




