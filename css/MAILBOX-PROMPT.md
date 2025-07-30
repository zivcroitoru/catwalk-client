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

I want to create a mailbox placeholder, no need for logic at this point.

We can start up the css with:
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
  --color-purple: #F8C4FF;
  
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
--spacing-sm: 10px;
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
    top: 200px; /* Below the title */
    left: 50%; /* Center horizontally */
    transform: translateX(-50%); /* Perfect centering */
    width: 1050px;
    height: 420px;
    background-color: var(--color-cream); /* #FFEEC3 */
    
    /* Add flexbox for stage bases layout */
    display: flex;
    align-items: flex-end; /* Align stage bases to bottom */
    justify-content: space-between;
    padding: var(--spacing-sm); /* 20px padding on all sides */
    box-sizing: border-box; /* Include padding in dimensions */
}
```


# User story:
- Player is in album
- Player clicks on mailbox button
- mailbox (AKA mailbox-display for now) pops up on screen.

# Your task:
We need to create a mailbox placeholder, no need for logic at this point. I ONLY want to implement the CSS so that a cream rectangle appears on screen when mailbox button is pressed, nothing more.