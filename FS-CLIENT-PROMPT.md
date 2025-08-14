# cat walk - a fashion show matchmaking system

## 1. User-story
1. The player registers/ signs up to our website
2. The player arrives to the main page- the cat album
	- The player has playerId (string), and playerCats (a list of owned cats)
	- Each cat has playerId, and CatId
	- For now, the userId and catId are the *only* information we need (later, we will add extra fields for them - but not now)
3. The player selects a cat from the album, and enters the fashion show
4. The player arrives at the "waiting room" (we enter the waiting-room phase). Note that the system has a *single* waiting room: it is cycled when it gets full (5 players - although for now we're testing on 2 players). At any time - while waiting - the user can see the count of participants that are currently waiting in the room.
	-	A participant is Player + PlayerCat + votedCatId
5. If player wishes to quit the fashion show during the "waiting room" phase - the player will return to cat album, and will be removed from the room.
6. The player waits until the room is full with 2 participants (unless the player is the 2nd one of course)
7. Once the waiting room has 2 participants, it enters the 'voting' phase, and is no longer "the waiting room". The waiting room is then recreated with no participants - and is ready to receive new participants.
8. A 60 seconds timer begins to run when entering the 'voting' phase.
8. The player sees all 2 playerCats
9. The player can click on a cat on the screen to vote for. The player can change the voted cat at any time (until all participants voted - and the room is "finalized").
	- The player's own cat will be shown on screen just like the others, but this cat will not be clickable for the player (the owner of the cat)
	- The players will always see how many participants already voted
	- The client should show the 60-seconds timer - but can safely ignore it logically: the server will take care of it (at timeout - the server will make a random vote for every participant that didn't vote).
10. The voting phase will end once all 2/2 players have voted
11. Once the voting phase ends, the room is "finalized": no further changes can be made. Players see the "rewards distribution" display
12. In the "rewards distribution" display the players can see how many coins each one got rewarded (the server will have the logic - and will inform the client).
13. The player can now choose if to "play again" (sends player waiting room, the cycle starts once again) or "go home" (sends player back to album)
14. If player wishes to quit the fashion show during the *voting phase* (or the connection drops) the player will be able to. If this happens, the other players will be "unaware" of this: The server will emulate as if the quitting participant made a random vote.

## 2. Messages
- client enters show: open WS (init msg: player + cat)
- server -> client: update waiting participants
- server -> client: enter voting phase
- server -> client: update voting state
- server -> client: final results (and close WS)
- client -> server: vote

## 3. TypeScript types and constants - common to server and client

```typescript

const PARTICIPANTS_IN_ROOM = 2;
const VOTING_TIMER = 60;

type Participant = {
  playerId: string;
  catId: string;
  isDummy?: boolean; // Only for server-side logic, never sent to client

  // Only after the participant voted:
  votedCatId?: string;

  // Only after all the participants voted:
  votesReceived: number;
  coinsEarned: number;
}

// Client to Server - when a participant joins the waiting room
type JoinShowMessage = {
  type: 'join';
  playerId: string;
  catId: string;
}

// Client to Server - when a participant votes
type VotingMessage = {
  type: 'vote';
  votedCatId: string;
}

// Server to Client - when a participant joins the waiting room
type ParticipantUpdateMessage = {
  type: 'participant_update';
  participants: Participant[];
  maxCount: typeof PARTICIPANTS_IN_ROOM;
}

// Server to Client - when voting phase begins
type VotingPhaseMessage = {
  type: 'voting_phase';
  participants: Participant[];
  timerSeconds: typeof VOTING_TIMER;
}

// Server to Client - when a participant votes
type VotingUpdateMessage = {
  type: 'voting_update';
  participants: Participant[];
}

// Server to Client - when results are being calculated and distributed (results phase begins)
type ResultsMessage = {
  type: 'results';
  participants: Participant[];
}
```

## Our relevant DB tables.

\d players 
->
```
Table "public.players"
Column	Type	Collation	Nullable	Default
id	integer		not null	nextval('players_id_seq'::regclass)
username	character varying(50)		not null	
created_at	date			CURRENT_TIMESTAMP
coins	integer		not null	500
cat_count	integer			0
daily_upload_count	integer			0
last_upload_reset	timestamp without time zone			CURRENT_TIMESTAMP
last_logged_in	timestamp without time zone			
password_hash	character varying(255)			
Indexes:
"players_pkey" PRIMARY KEY, btree (id)
"players_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
TABLE "cat_items" CONSTRAINT "fk_cat_items_player" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
TABLE "player_cats" CONSTRAINT "fk_player_cats_player_id" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
TABLE "player_items" CONSTRAINT "fk_player_items_player" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
TABLE "tickets" CONSTRAINT "tickets_player_id_fkey" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
```

\d player_cats 
->
```
Table "public.player_cats"
Column	Type	Collation	Nullable	Default
cat_id	integer		not null	nextval('player_cats_player_cat_id_seq'::regclass)
player_id	integer		not null	
template	character varying(200)		not null	
name	character varying(100)			
description	text			
uploaded_photo_url	text		not null	
created_at	timestamp without time zone			CURRENT_TIMESTAMP
last_updated	timestamp without time zone			CURRENT_TIMESTAMP
birthdate	date			
Indexes:
"player_cats_pkey" PRIMARY KEY, btree (cat_id)
Foreign-key constraints:
"fk_player_cats_player_id" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
"fk_player_cats_template" FOREIGN KEY (template) REFERENCES cat_templates(template) ON DELETE CASCADE
Referenced by:
TABLE "cat_items" CONSTRAINT "fk_cat_items_cat" FOREIGN KEY (cat_id) REFERENCES player_cats(cat_id) ON DELETE CASCADE
Triggers:
cat_count_trigger AFTER INSERT OR DELETE ON player_cats FOR EACH ROW EXECUTE FUNCTION update_cat_count()
```

\d cat_templates
->
```
Table "public.cat_templates"
Column	Type	Collation	Nullable	Default
template	character varying(200)		not null	
breed	character varying(50)		not null	
variant	character varying(50)		not null	
palette	character varying(50)		not null	
sprite_url	text			
description	text			
created_at	timestamp without time zone			CURRENT_TIMESTAMP
last_updated_at	timestamp without time zone			CURRENT_TIMESTAMP
cat_id	integer		not null	nextval('cat_templates_cat_id_seq'::regclass)
Indexes:
"cat_templates_pkey" PRIMARY KEY, btree (template)
Referenced by:
TABLE "player_cats" CONSTRAINT "fk_player_cats_template" FOREIGN KEY (template) REFERENCES cat_templates(template) ON DELETE CASCADE
```

\d cat_items

->
```
Table "public.cat_items"
Column	Type	Collation	Nullable	Default
cat_item_id	integer		not null	nextval('cat_items_cat_item_id_seq'::regclass)
cat_id	integer		not null	
player_id	integer		not null	
template	character varying(100)		not null	
category	character varying(50)		not null	
Indexes:
"cat_items_pkey" PRIMARY KEY, btree (cat_item_id)
"cat_items_cat_id_category_key" UNIQUE CONSTRAINT, btree (cat_id, category)
"idx_cat_items_cat_id" btree (cat_id)
"idx_cat_items_player_id" btree (player_id)
"unique_cat_category" UNIQUE CONSTRAINT, btree (cat_id, category)
Foreign-key constraints:
"fk_cat_items_cat" FOREIGN KEY (cat_id) REFERENCES player_cats(cat_id) ON DELETE CASCADE
"fk_cat_items_category" FOREIGN KEY (category) REFERENCES itemcategory(category_name) ON DELETE RESTRICT
"fk_cat_items_player" FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
"fk_cat_items_template" FOREIGN KEY (template) REFERENCES itemtemplate(template) ON DELETE CASCADE
```


## Additional notes:
- This project should be as simple as possible, we're not "looking for more work". 
- Voting timer updates: The server sends to the client the value of the timer, and the clients handle the countdown locally. We won't send periodic sync updates
- Error handling: As for now, we will not be adding error message types for various failure scenarios. As long as we don't have specific errors, talking about this is irrelevant
- Game ID / Room ID: For now, let's not add this at all. Note that if the WS is disconnected, the player will have no way of re-entering the room.
- Rooms Management: There should not be any persistence of game results, everything is purely in-memory and singleton

We are currently working on local host:

Server terminal:
```
PS C:\dev\catwalk-server> npm run dev

> catwalk-server@1.0.0 dev
> nodemon index.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
[dotenv@17.2.0] injecting env (6) from .env (tip: ⚙️  enable debug logging with { debug: true })
catwalk-server running on http://localhost:3001
🔧 Allowed CORS origins: [
  'http://localhost:3000',
  'https://catwalk.onrender.com',
  'https://catwalk-server-eu.onrender.com',
  'https://catwalk.onrender.com'
]
User connected: GcdtlSswcG6hFkMfAAAB
🎭 Fashion Show - Received join message: { playerId: '37', catId: 106 }
✅ Fashion Show - Registered: 37 (106)
👥 Fashion Show - Waiting room: 1/2
📤 Sent waiting room update to 37
```

Client terminal:
```
PS C:\dev\catwalk-client> npm run dev

> catwalk-client@1.0.0 dev
> vite


  VITE v7.0.5  ready in 492 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## IMPORTANT NOTE: 
WE NEED TO TAKE IT ONE STEP AT A TIME, NOT CHANGE THE WHOLE CODE AT ONCE. Let's build a list of tasks, complete one each time, add debugging, run the game. We have a connection with 2 players, now we want to see the player and their data in the logging when entering the waiting room, then waiting room counter increases only with more players joining.



# TASKS

## ✅ **WHAT WORKS - ACCOMPLISHED SO FAR:**

### **Phase 1: Core Infrastructure** ✅ COMPLETE
- ✅ Socket.IO connection between client and server
- ✅ Waiting room system (participants join and leave)
- ✅ Participant counter display (X/2 players)
- ✅ Room cycling (when full, creates new game room + resets waiting room)

### **Phase 2: Enhanced Data & Visuals** ✅ COMPLETE  
- ✅ Enhanced participant creation with database queries
- ✅ Real cat sprite URLs fetched from `cat_templates` table
- ✅ Real usernames fetched from `players` table  
- ✅ Real cat names fetched from `player_cats` table
- ✅ Worn items data fetched from `cat_items` + `itemtemplate` tables
- ✅ Client displays real cat sprites (not placeholders)
- ✅ Client displays worn items layered on cats
- ✅ Transition from waiting room to voting phase UI
- ✅ 60-second countdown timer display

### **Phase 3: Basic Voting Structure** ✅ COMPLETE
- ✅ Server sends `voting_phase` message with participant data
- ✅ Client shows voting interface with cat stages
- ✅ Client countdown timer runs locally
- ✅ Server has voting timeout handler (basic structure)

---

## 🎯 **CURRENT STEP: Voting Logic Implementation**

### **Step 4A: Timer-Based Vote Calculation** ⏳ IN PROGRESS
**Goal:** Move to calculating votes screen only when timer reaches end

**Sub-steps:**
1. ✅ Timer countdown working on client  
2. 🔄 **CURRENT:** Server triggers vote calculation when timer ends
3. ⏸️ Log vote results (don't apply to DB yet)
4. ⏸️ Send calculation screen to clients

### **Step 4B: Interactive Voting** ⏸️ PLANNED
**Goal:** Players can click cats to vote (ignore self-voting rule temporarily)

**Sub-steps:**
1. Add click handlers to cat stages during voting phase
2. Send vote messages to server
3. Server tracks votes per participant  
4. Allow vote changes while timer running
5. Visual feedback for selected cat

### **Step 4C: Self-Voting Prevention** ⏸️ PLANNED
**Goal:** Implement "no voting for own cat" rule

**Sub-steps:**
1. Server validates votes (reject if voting for own cat)
2. Client shows warning message
3. Visual styling for own cat (non-clickable)

### **Step 4D: Auto-Vote Logic** ⏸️ PLANNED  
**Goal:** Handle missing votes and disconnections

**Sub-steps:**
1. Random vote assignment for non-voters when timer ends
2. Handle player disconnection → mark as dummy → auto-vote
3. Early voting phase end if all players voted legally

### **Step 4E: Vote Calculation & Rewards** ⏸️ PLANNED
**Goal:** Calculate and distribute coin rewards

**Sub-steps:**
1. Count votes per cat: `votesReceived = votes[catId] || 0`
2. Calculate coins: `coinsEarned = votesReceived * 25`  
3. Update real players' coins in database
4. Skip DB updates for dummy participants
5. Send results to clients

---

## 🎮 **COMPLETE GAME FLOW STATUS:**

1. ✅ **Waiting Room** - Players join and see counter
2. ✅ **Voting Phase Start** - Timer starts, cats displayed  
3. 🔄 **Voting Interaction** - Current step
4. ⏸️ **Vote Calculation** - Planned next
5. ⏸️ **Results Display** - Planned
6. ⏸️ **Play Again/Go Home** - Planned

---

## 📋 **IMMEDIATE NEXT ACTION:**
**Focus on Step 4A.2:** Make server properly trigger vote calculation when 60-second timer ends, with detailed logging to see the vote calculation process.

**Question for you:** Should we start with implementing the timer-end vote calculation trigger, or would you prefer to begin with the clickable voting interaction first?