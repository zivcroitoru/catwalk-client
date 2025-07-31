Project structure:
```
CATWALK-CLIENT/
├── assets/
│   ├── audio/
│   ├── backgrounds/
│   ├── btns/
│   ├── icons/
│   └── ui/
├── cat-walk-admin/
│   ├── css/
│   ├── database/
│   ├── htmls/
│   ├── js-admin/
│   └── PICS/
├── css/
│   ├── album-css/
│   ├── album-css.zip
│   ├── fashion-show.css
│   ├── login.css
│   ├── mailbox.css
│   └── styles.css
├── data/
│   ├── cat_templates.json
│   ├── shopitems.json
│   ├── user_inventory.json
│   └── usercats.json
├── dist/
├── js/
│   ├── core/
│   ├── features/
│   ├── node_modules/
│   ├── fashion-show.js
│   └── main.js
├── pages/
│   ├── admin.html
│   ├── album.html
│   ├── fashion-show.html
│   ├── login.html
│   └── signup.html
├── .env
├── .gitignore
├── index.html
├── MM-CLIENT-PROMPT.md
├── MM-debugging-PROMPT.md
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

# C:\dev\catwalk-client\css\mailbox.css
```javascript
/* Design System Variables */
:root {
  /* Colors */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-cream: #FFEEC3;
  --color-yellow: #FFDE8C;
  --color-brown: #DAAB6E;
  --color-red: #FB0B0B;
  --color-salmon: #D06767;
  --color-gold: #FFC20E;
  --color-blue: #57B9FF;
  --color-light-purple: #F8C4FF;
  --color-purple: #B70EFF;
  --color-grey: #CCCCCC;
  
  /* Typography */
  --font-main: 'Jersey 10', monospace;
  
  /* Strokes */
  --stroke-very-thin: 2px;
  --stroke-thin: 4px;
  --stroke-thick: 7px;
  --stroke-xl: 12px;
  /* Spacing */
  --spacing-xs: 10px;
  --spacing-sm: 20px;
  --spacing-md: 30px;
  --spacing-lg: 100px;
  /* Font Sizes */
  --font-size-xl: 128px;
  --font-size-lg: 96px;
  --font-size-md: 64px;
  --font-size-sm: 48px;
  --font-size-xs: 36px;
  --font-size-xxs: 24px;
}

/* Mailbox Display Area */
.mailbox-display {
    position: absolute;
    top: 100px; /* Below the title */
    left: 50%; /* Center horizontally */
    transform: translateX(-50%); /* Perfect centering */
    width: 1050px;
    height: 600px;
    background-color: var(--color-cream); /* #FFEEC3 */
    
    /* Change to column layout for buttons and content */
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding: 0;
    box-sizing: border-box; /* Include padding in dimensions */
    
    /* Initially hidden */
    opacity: 0;
    visibility: hidden;
    
    /* Add border for definition */
    border: var(--stroke-thin) solid var(--color-black);
    
    /* Smooth transition for show/hide */
    transition: opacity 0.3s ease, visibility 0.3s ease;
    
    /* Ensure it appears above other content */
    z-index: 1000;
    
    /* Optional: Add subtle shadow for depth */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Visible state - add this class to show the mailbox */
.mailbox-display.show {
    opacity: 1;
    visibility: visible;
}

/* Mailbox Navigation Buttons Container */
.mailbox-nav {
    display: flex;
    width: 100%;
    height: 60px;
    background-color: var(--color-cream);
    border-bottom: var(--stroke-thin) solid var(--color-black);
}

/* Individual Mailbox Buttons */
.mailbox-btn {
    flex: 1; /* Equal width buttons */
    height: 100%;
    background-color: var(--color-yellow);
    border: var(--stroke-thin) solid var(--color-black);
    border-bottom: none; /* Remove bottom border since nav has it */
    font-family: var(--font-main);
    font-size: var(--font-size-xxs); /* 24px */
    font-weight: bold;
    color: var(--color-black);
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    /* Remove default button styling */
    outline: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    
    /* Center text */
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Remove border between adjacent buttons */
.mailbox-btn:not(:first-child) {
    border-left: none;
}

/* Hover effect */
.mailbox-btn:hover {
    background-color: var(--color-brown);
}

/* Active/Clicked state - turns brown when clicked */
.mailbox-btn.active,
.mailbox-btn:active {
    background-color: var(--color-brown);
}

/* Mailbox Content Area */
.mailbox-content {
    flex: 1; /* Takes remaining space */
    overflow-y: auto;
    padding: var(--spacing-sm); /* 20px padding */
    box-sizing: border-box;
    gap: var(--spacing-xs);
    
    /* Future content styling */
    display: flex;
    flex-direction: column;
    font-family: var(--font-main);
}

/* Message List */
.message-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

/* Individual Message Box */
.message-box {
    background-color: var(--color-brown);
    border: var(--stroke-thin) solid var(--color-black);
    padding: var(--spacing-xs);
    display: flex;
    gap: var(--spacing-xs);
    min-height: 40px;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

/* Hover effect for message boxes */
.message-box:hover {
    background-color: var(--color-salmon);
}

/* Message Title (Left Rectangle) */
.message-title {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    flex: 1;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: left;
    display: flex;
    align-items: center;
    min-height: 24px;
    box-sizing: border-box;
}

/* Message Title when marked as read (grey background) */
.message-box.read .message-title {
    background-color: var(--color-grey);
}

/* Message Date (Right Rectangle) */
.message-date {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    width: 160px;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    box-sizing: border-box;
    flex-shrink: 0;
}

/* Message Date when marked as read (grey background) */
.message-box.read .message-date {
    background-color: var(--color-grey);
}

/* Message View Container */
.message-view {
    display: none; /* Initially hidden */
    flex-direction: column;
    height: 100%;
    position: relative;
    background-color: var(--color-brown);
    border: var(--stroke-thin) solid var(--color-black);
    padding: var(--spacing-xs);
    gap: var(--spacing-sm);
}

/* Message View Header (Title and Date) */
.message-view-header {
    display: flex;
    gap: var(--spacing-xs);
    min-height: 40px;
    align-items: center;
}

/* Message View Title */
.message-view-title {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    flex: 1;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: left;
    display: flex;
    align-items: center;
    min-height: 24px;
    box-sizing: border-box;
}

/* Message View Date */
.message-view-date {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    width: 160px;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    box-sizing: border-box;
    flex-shrink: 0;
}

/* Message Body */
.message-body {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    flex: 1;
    padding: var(--spacing-sm);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    overflow-y: auto;
    line-height: 1.4;
    margin-bottom: var(--spacing-sm);
}

/* Message View Controls */
.message-controls {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

/* Back Button */
.back-btn {
    background-color: var(--color-yellow);
    border: var(--stroke-thin) solid var(--color-black);
    width: 60px;
    height: 40px;
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    font-weight: bold;
    color: var(--color-black);
    cursor: pointer;
    transition: background-color 0.2s ease;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-btn:hover {
    background-color: var(--color-brown);
}

/* Contact Us View Container */
.contact-view {
    display: none; /* Initially hidden */
    flex-direction: column;
    height: 100%;
    position: relative;
    background-color: var(--color-brown);
    border: var(--stroke-thin) solid var(--color-black);
    padding: var(--spacing-xs);
    gap: var(--spacing-sm);
}

/* Contact Us Header (Title and Date) */
.contact-view-header {
    display: flex;
    gap: var(--spacing-xs);
    min-height: 40px;
    align-items: center;
}

/* Contact Us Title Input Field */
.contact-view-title {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    flex: 1;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: left;
    display: flex;
    align-items: center;
    min-height: 24px;
    box-sizing: border-box;
    outline: none; /* Remove default input outline */
    resize: none; /* Prevent resizing if browser tries to make it a textarea */
}

/* Contact Us Title Placeholder Styling */
.contact-view-title::placeholder {
    color: var(--color-grey);
    opacity: 0.7;
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
}

/* Focus state for Contact Us Title */
.contact-view-title:focus {
    background-color: var(--color-white);
    border-color: var(--color-black);
}

/* Contact Us Date */
.contact-view-date {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    width: 160px;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    box-sizing: border-box;
    flex-shrink: 0;
}

/* Contact Us Input Area */
.contact-input-area {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    border-radius: 30px;
    width: 75%; /* 3/4 width */
    flex: 1;
    padding: var(--spacing-sm);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    resize: none;
    outline: none;
    margin-bottom: var(--spacing-sm);
    align-self: flex-start; /* Stick to left side */
    box-sizing: border-box;
}

.contact-input-area::placeholder {
    color: var(--color-grey);
    opacity: 0.7;
}

/* Contact Us Controls */
.contact-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

/* Send Button */
.send-btn {
    background-color: var(--color-yellow);
    border: var(--stroke-thin) solid var(--color-black);
    height: 40px;
    padding: 0 var(--spacing-md);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    font-weight: bold;
    color: var(--color-black);
    cursor: pointer;
    transition: background-color 0.2s ease;
    outline: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.send-btn:hover {
    background-color: var(--color-brown);
}

/* ===== CONVERSATION VIEW STYLES ===== */

/* Conversation View Container */
.conversation-view {
    display: none; /* Initially hidden */
    flex-direction: column;
    height: 100%;
    position: relative;
    background-color: var(--color-brown);
    border: var(--stroke-thin) solid var(--color-black);
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
}

/* Conversation View Header (Title and Date) */
.conversation-view-header {
    display: flex;
    gap: var(--spacing-xs);
    min-height: 40px;
    align-items: center;
}

/* Conversation View Title */
.conversation-view-title {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    flex: 1;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: left;
    display: flex;
    align-items: center;
    min-height: 24px;
    box-sizing: border-box;
}

/* Conversation View Date */
.conversation-view-date {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    width: 160px;
    padding: 8px var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    box-sizing: border-box;
    flex-shrink: 0;
}

/* Conversation History Container */
.conversation-history {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-xs);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    background-color: var(--color-cream);
    border: var(--stroke-thin) solid var(--color-black);
    margin-bottom: var(--spacing-xs);
}

/* Individual Conversation Messages */
.conversation-message {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    margin-bottom: var(--spacing-xs);
}

/* Player Messages (Left Side) */
.conversation-message.player {
    align-self: flex-start;
}

.conversation-message.player .message-content {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    border-radius: 20px 20px 20px 5px;
    padding: var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    line-height: 1.4;
}

/* Admin Messages (Right Side) */
.conversation-message.admin {
    align-self: flex-end;
}

.conversation-message.admin .message-content {
    background-color: var(--color-yellow);
    border: var(--stroke-thin) solid var(--color-black);
    border-radius: 20px 20px 5px 20px;
    padding: var(--spacing-xs);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    line-height: 1.4;
}

/* Message Timestamps */
.message-timestamp {
    font-family: var(--font-main);
    font-size: 16px;
    color: var(--color-black);
    opacity: 0.6;
    margin-top: 4px;
    padding: 0 var(--spacing-xs);
}

.conversation-message.player .message-timestamp {
    text-align: left;
}

.conversation-message.admin .message-timestamp {
    text-align: right;
}

/* Conversation Input Container */
.conversation-input-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

/* Conversation Input Area */
.conversation-input-area {
    background-color: var(--color-white);
    border: var(--stroke-thin) solid var(--color-black);
    border-radius: 30px;
    width: 75%; /* 3/4 width */
    min-height: 60px;
    padding: var(--spacing-sm);
    font-family: var(--font-main);
    font-size: var(--font-size-xxs);
    color: var(--color-black);
    resize: none;
    outline: none;
    align-self: flex-start; /* Stick to left side */
    box-sizing: border-box;
}

.conversation-input-area::placeholder {
    color: var(--color-grey);
    opacity: 0.7;
}

/* Conversation Controls */
.conversation-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-sm);
}

/* Scrollbar Styling */
.mailbox-content::-webkit-scrollbar,
.message-body::-webkit-scrollbar,
.contact-input-area::-webkit-scrollbar,
.conversation-history::-webkit-scrollbar,
.conversation-input-area::-webkit-scrollbar {
    width: 8px;
}

.mailbox-content::-webkit-scrollbar-track,
.message-body::-webkit-scrollbar-track,
.contact-input-area::-webkit-scrollbar-track,
.conversation-history::-webkit-scrollbar-track,
.conversation-input-area::-webkit-scrollbar-track {
    background: var(--color-cream);
}

.mailbox-content::-webkit-scrollbar-thumb,
.message-body::-webkit-scrollbar-thumb,
.contact-input-area::-webkit-scrollbar-thumb,
.conversation-history::-webkit-scrollbar-thumb,
.conversation-input-area::-webkit-scrollbar-thumb {
    background: var(--color-brown);
    border-radius: 4px;
}

.mailbox-content::-webkit-scrollbar-thumb:hover,
.message-body::-webkit-scrollbar-thumb:hover,
.contact-input-area::-webkit-scrollbar-thumb:hover,
.conversation-history::-webkit-scrollbar-thumb:hover,
.conversation-input-area::-webkit-scrollbar-thumb:hover {
    background: var(--color-salmon);
}

```

# C:\dev\catwalk-client\pages\album.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
  <button class="profile-btn danger" style="align-self: flex-end;" onclick="closeAddCat()">✕</button>
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

# C:\dev\catwalk-client\js\features\mailbox\mailbox.js
```javascript
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

```

C:\dev\catwalk-client\js\core\toast.js
```javascript
// /js/core/toast.js

export function toastCatAdded({ breed, name, sprite }) {
  Toastify({
    node: (() => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;
      wrapper.innerHTML = `
        <img src="${sprite}" alt="Cat"
          style="width: 32px; height: 32px; image-rendering: pixelated; margin-bottom: 4px;" />
        <div><b>${breed} (${name})</b> added!</div>
      `;
      return wrapper;
    })(),
    duration: 1800,
    gravity: "top",
    position: "center",
    style: {
      background: "#4caf50",
      border: "2px solid black",
      padding: "8px",
      width: "180px",
      maxWidth: "80vw",
      color: "black",
      boxShadow: "4px 4px #000",
      zIndex: 999999,
    }
  }).showToast();
}

export function toastCancelled() {
  Toastify({
    text: "❌ Cancelled",
    duration: 1500,
    gravity: "bottom",
    position: "center",
    style: { background: "#999" }
  }).showToast();
}

export function toastBought(name) {
  Toastify({
    text: `✅ Bought "${name}"!`,
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: { background: "#4caf50" }
  }).showToast();
}

export function toastNotEnough() {
  Toastify({
    text: `❌ Not enough coins`,
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: { background: "#d32f2f" }
  }).showToast();
}

export function toastEquipResult(name, result) {
  Toastify({
    text: result === "equipped"
      ? `Equipped "${name}"`
      : `Unequipped "${name}"`,
    duration: 2000,
    gravity: "bottom",
    position: "center",
    style: { background: "#2196f3" }
  }).showToast();
}

export function toastInfo(text, background = "#ffcc66") {
  Toastify({
    text,
    duration: 2000,
    gravity: "top",
    position: "right",
    style: {
      background,
      border: "3px solid black",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "12px",
      color: "black",
      padding: "10px",
      zIndex: 999999,
    }
  }).showToast();
}

export function toastSimple(text, background = "#4caf50") {
  Toastify({
    text,
    duration: 2000,
    gravity: "top",
    position: "right",
    style: {
      background,
      border: "3px solid black",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "12px",
      color: "black",
      padding: "10px",
      zIndex: 999999,
    }
  }).showToast();
}

export function toastConfirmDelete(cat, onConfirm, onCancel) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div style="font-family:'Press Start 2P', monospace; font-size:14px; text-align:center;">
      <img src="${cat.image}" alt="Cat" style="width:96px; height:96px; object-fit:contain; margin-bottom:16px;" />
      <div style="margin-bottom:16px;">Delete "<b>${cat.name}</b>"?</div>
      <button id="confirmDelete" style="margin-right:16px; font-size:12px;">Yes</button>
      <button id="cancelDelete" style="font-size:12px;">Cancel</button>
    </div>
  `;

  const toast = Toastify({
    node: wrapper,
    duration: -1,
    gravity: "top",
    position: "center",
    style: {
      background: "#d62828",
      border: "4px solid black",
      color: "white",
      padding: "32px",
      width: "420px",
      maxWidth: "90vw",
      fontSize: "16px",
      fontFamily: "'Press Start 2P', monospace",
      boxShadow: "8px 8px #000",
      textAlign: "center",
      zIndex: 999999,
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    callback: () => {
      document.getElementById("confirmDelete")?.removeEventListener("click", onConfirm);
      document.getElementById("cancelDelete")?.removeEventListener("click", onCancel);
    }
  });

  toast.showToast();

  requestAnimationFrame(() => {
    document.getElementById("confirmDelete")?.addEventListener("click", () => {
      toast.hideToast();
      onConfirm?.();
    });
    document.getElementById("cancelDelete")?.addEventListener("click", () => {
      toast.hideToast();
      onCancel?.();
    });
  });
}
export function toastNoCats() {
  Toastify({
    node: (() => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        font-family: 'Press Start 2P', monospace;
        font-size: 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 32px;
        color: #333;
      `;
      wrapper.innerHTML = `
        <div style="font-size: 2rem; font-weight: bold; color: #555; margin-bottom: 0.7rem;">No cats :(</div>
        <button id="addCatBtnToast" style="
          background: #ffcc66; 
          border: 2px solid #222; 
          border-radius: 0.5rem;
          font-family: 'Press Start 2P', monospace;
          font-size: 1rem;
          padding: 8px 16px;
          cursor: pointer;
          margin-top: 8px;
        ">
          <img src="../../assets/ui/plus.png" alt="Add Cat" style="width: 22px; vertical-align: middle;" /> Add Cat
        </button>
      `;
      return wrapper;
    })(),
    duration: -1, // Stays until user clicks
    gravity: "top",
    position: "center",
    style: {
      background: "#fffbe7",
      border: "2px solid #ffcc66",
      boxShadow: "0 6px 24px #0001",
      borderRadius: "1.2rem",
      minWidth: "260px",
      zIndex: 999999,
    },
    callback: () => {
      document.getElementById("addCatBtnToast")?.removeEventListener("click", window.__addCatBtnToastHandler);
    }
  }).showToast();

  // Add button click triggers the real Add Cat popup
  window.__addCatBtnToastHandler = () => {
    document.getElementById("addCatBtn")?.click();
  };
  requestAnimationFrame(() => {
    document.getElementById("addCatBtnToast")?.addEventListener("click", window.__addCatBtnToastHandler);
  });
}

```


# User story:
- Player is in album
- Player clicks on mailbox button
- mailbox (AKA mailbox-display for now) pops up on screen.
- Player can click on any one of the 4 buttons, once a button is clicked on it turns brown.
- Mailbox allways defaultly opens up on ALL MESSAGES.
## Player click on ALL MESSAGES:
- The list of messages dissapears
- instead we have a view of a message:
  - we have a brown base
  - a title and date (simular to the messages in the message list)
  - A white large rectangle- the body of our message
  - Outside of the brown box:
    - on the bottom left we have a back arrow "<-" button
    - on the bottom right we have a MARK AS UNREAD button
- if player clicks on MARK AS UNREAD button- when player will go back to the list the white parts of this message item will be grey instead.
## Player click on CONTACT US:
- The list of messages dissapears
- instead we have a view of the contact us:
  - we have a brown base
  - a title and date (simular to the messages in the message list)
  - A white rectangle- the body of our message..
    - This will have a 30 radius
    - it will stick to the left side
    - it should be 3/4 of the full width it would have had if it was full width
  - Outside of the brown box:
    - on the bottom right we have a SEND button
- if player clicks on SEND button- the player will go back to the list of messages (ALL MESSAGES).
## Player click on SENT:
- The list of messages dissapears
- player can view a list of conversations (titles * date - we currently have this part:D )
- When clicking on a conversation, player has a view of a conversation:
  -the conversation view is identical to how it looks like in CONTACT US
  - we have a brown base
  - a title and date 
  - a history of our conversation history- message boddies
    - A messege sent by us is on the left side
    - A messege sent by admin is on the right side
  - a "type your message here", will allways be on the bottom

  

# Your task:
Add toastify to sucssesful message sent, and messages recieved.

