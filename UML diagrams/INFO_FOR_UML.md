```
catwalk-client/
├── Configuration Files
│   ├── package.json, package-lock.json
│   ├── vite.config.js
│   ├── .env
│   └── index.html (main entry point)
│
├── Client Application
│   ├── pages/
│   │   ├── album.html
│   │   ├── fashion-show.html
│   │   ├── login.html
│   │   ├── mailbox.html
│   │   └── signup.html
│   │
│   ├── js/
│   │   ├── main.js, fashion-show.js
│   │   ├── core/
│   │   │   ├── auth/ → authentication.js
│   │   │   ├── init/ → dataLoader.js
│   │   │   └── [config, constants, state, storage, utils, sound, toast]
│   │   │
│   │   └── features/
│   │       ├── addCat/ → [addCat.js, breedItemsRenderer.js, breedTabs.js]
│   │       ├── mailbox/ → [mailbox.js, player-mailbox.js, gotomail.js]
│   │       ├── shop/ → [shop.js, shopItemsRenderer.js, shopLogic.js, shopTabs.js]
│   │       ├── ui/ → [carousel.js, popups.js, bindings.js, uiBinder.js]
│   │       └── user/ → cat_profile.js
│   │
│   ├── css/
│   │   ├── [login, mailbox, fashion-show, styles].css
│   │   └── album-css/ → [base, layout, components, add_cat, carousel, cat-album, shop, profile, modals, utilities].css
│   │
│   └── public/assets/
│       ├── audio/ → bg-music.mp3
│       ├── backgrounds/ → [album_bg, paw_bg, thumbnail_bg].png
│       ├── icons/ → [various UI icons and cat-related images]
│       └── btns/ → [v_btn, x_btn].png
│
└── Admin Panel
    └── cat-walk-admin/
        ├── htmls/ → [admin-login, cat-database, clothes-database, user management, chat, etc.]
        ├── js-admin/ → [corresponding JS files for each admin HTML page]
        ├── css/ → [admin-specific styling]
        ├── PICS/ → [admin interface images]
        └── database/ → [database documentation]
```

**Key Architectural Insights for UML:**

1. **Clear separation**: Client app vs Admin panel
2. **Feature-based organization**: Each major feature (addCat, shop, mailbox, etc.) has its own module
3. **Core system**: Centralized auth, state management, configuration
4. **UI layer**: Separate UI components (carousel, popups, bindings)
5. **Data flow**: dataLoader suggests centralized data management

---

תרשים (UML - System Architecture) של המערכת - אשר יציג את הטכנולוגיות, API, DB, סוגי קריאות.
המטרה היא להציג בצורה ויזואלית את כל המערכת, השתמשו בכלים כמו Miro, excalidraw, draw.io. יש שם Templates בדיוק לדברים הללו.


# UML System Architecture

From your documents, you already have several proper UML diagrams:

✅ Sequence Diagrams (Cat Adoption, Item Purchase, Fashion Show)
✅ Class Diagram (Your structural design)
✅ Use Case Diagram (PlantUML format)
✅ Activity Diagram (Cat Adoption Process)



