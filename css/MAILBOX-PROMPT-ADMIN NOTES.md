Admin Functions
Returns admin functions for your admin interface:

```javascript
const adminFunctions = setupMailbox(io, db, jwtSecret);

// Admin sends broadcast to all players
await adminFunctions.sendBroadcast(adminId, adminUsername, subject, body);

// Admin replies to specific ticket  
await adminFunctions.replyToTicket(ticketId, adminId, body);
```

