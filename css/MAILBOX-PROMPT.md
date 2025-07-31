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
    height: 420px;
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
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-sm);
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

/* Mark as Unread Button */
.mark-unread-btn {
    background-color: var(--color-yellow);
    border: var(--stroke-thin) solid var(--color-black);
    height: 40px;
    padding: 0 var(--spacing-sm);
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

.mark-unread-btn:hover {
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

/* Scrollbar Styling */
.mailbox-content::-webkit-scrollbar,
.message-body::-webkit-scrollbar,
.contact-input-area::-webkit-scrollbar {
    width: 8px;
}

.mailbox-content::-webkit-scrollbar-track,
.message-body::-webkit-scrollbar-track,
.contact-input-area::-webkit-scrollbar-track {
    background: var(--color-cream);
}

.mailbox-content::-webkit-scrollbar-thumb,
.message-body::-webkit-scrollbar-thumb,
.contact-input-area::-webkit-scrollbar-thumb {
    background: var(--color-brown);
    border-radius: 4px;
}

.mailbox-content::-webkit-scrollbar-thumb:hover,
.message-body::-webkit-scrollbar-thumb:hover,
.contact-input-area::-webkit-scrollbar-thumb:hover {
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



  <div id="game">
    <!-- Cat Display -->
    <div class="cat-display-wrapper">
      <div class="ellipse-podium">
        <img src="../assets/ui/Ellipse.svg" alt="Ellipse" class="center-ellipse" />
        <!-- <div class="carousel-cat" id="carouselCatWrapper">
          <img id="carouselBase" class="cat-layer" alt="Base Cat" />
          <img id="carouselHat" class="cat-layer" alt="Hat" />
          <img id="carouselTop" class="cat-layer" alt="Top" />
          <img id="carouselEyes" class="cat-layer" alt="Eyes" />
          <img id="carouselAccessory" class="cat-layer" alt="Accessory" />
        </div> -->
        <div class="carousel-cat">
  <img class="cat-layer carouselBase" alt="Base" />
  <img class="cat-layer carouselHat" alt="Hat" />
  <img class="cat-layer carouselTop" alt="Top" />
  <img class="cat-layer carouselEyes" alt="Eyes" />
  <img class="cat-layer carouselAccessory" alt="Accessory" />
</div>
      </div>
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
    <!-- Complete Mailbox Display -->
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
    <!-- Message List View -->
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
    <!-- Message Detail View -->
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
        <button class="mark-unread-btn" id="markUnreadBtn">MARK AS UNREAD</button>
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
          <!-- Floating UI -->
          <div class="floating-actions">
            <div class="inventory-box" id="cat-count">Inventory: 0/25</div>
          </div>
        </div>
        <!-- ✅ Right Pane: profile + shop stack here -->
        <div class="right-pane">
          <!-- ✅ Overlay blocker goes first -->
          <div id="shopOverlayBlocker" class="shop-blocker hidden"></div>
          <!-- Profile Panel -->
          <div id="catProfileScroll" class="cat-profile-scroll">
            <div class="scroll-inner">
              <input type="text" id="catName" class="profile-name-input" disabled />
              <div class="profile-main">
                <div class="profile-info">
                  <div class="profile-row"><strong>Breed:</strong> <span id="profileBreed">-</span></div>
                  <div class="profile-row"><strong>Variant:</strong> <span id="profileVariant">-</span></div>
                  <div class="profile-row"><strong>Palette:</strong> <span id="profilePalette">-</span></div>
                  <div class="profile-row"><strong>Birthday:</strong> <span id="profileBirthday">-</span></div>
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
- instead we have a view of the sent messages:
  - we have a brown base
  - a title and date (simular to the messages in the message list and in contact us)
  - A white rectangle- the body of our message..
    - This will have a 30 radius
    - it will stick to the left side
    - it should be 3/4 of the full width it would have had if it was full width
    - this message body is not for typing in, its only viewed by the player.
  - A white rectangle- the body of the message we've recived in reponse, from the admins
    - This will have a 30 radius
    - it will stick to the right side
    - it should be 3/4 of the full width it would have had if it was full width
    - this message body is not for typing in, its only viewed by the player.
  - A white rectangle- the body of the message we want to send over to the admins (reply to admin's message)
    - This will have a 30 radius
    - it will stick to the left side
    - it should be 3/4 of the full width it would have had if it was full width
    - this message body is for typing in.
  - this can go on and on. anyhow, all the messages here eil be viewed, and the last on will be to write in. the title is for view only.
  - Outside of the brown box:
    - on the bottom right we have a SEND button
- if player clicks on SEND button- the player will go back to the list of messages (ALL MESSAGES).
  

# What we tried to achive:
Update functionality and view for for when player clicks on a CONTACT US:
- In the body, we have "type message here..." - thats very good! we want to add the same functionality to the title- we want instead of "Contact Us" to be a text in grey like "type the subject" or something, and let player type in

# Our ALL MESSAGES and CONTACT US work perfectly, but SENT doesnt work at all, its just blank - ANALYZE THE FILES CAREFULLY.

# Notes: 
- We need to create a mailbox placeholder, no need for logic at this point. I ONLY want to implement the CSS and HTML.