# Analysis Canvas for Cat Walk Messaging System Implementation

## 1. Game Design Document (GDD) Summary

**Messaging System Requirements:**

The Cat Walk game implements a **case-based messaging system** for 
player-admin communication with the following key features:

- **Player-to-Admin Communication**: Players can compose messages to admins with title and body, creating conversation threads

- **Case Management**: Each conversation is organized as a "case" that can be open or closed by admins

- **Message Threading**: Messages are grouped by case, allowing ongoing conversations

- **Read/Unread Status**: Messages have read indicators and can be marked as read

- **Admin Broadcasts**: Admins can send announcements to all players

- **Case Lifecycle**: Cases automatically reopen if players send new messages to closed cases

- **Admin Responsibilities**: Admins must manually notify players of database changes and manage case resolution

**Key Behavioral Rules:**

- Cases start as "open" when first message is sent

- Admins can manually close cases

- Closed cases reopen automatically when players send new messages

- Broadcast messages go to all players with individual read tracking

- No automated notifications - admins handle all communication manually

## 2. Data Design (ER Diagram) Summary

**Four Core Messaging Tables:**

1. **Case**: Container for conversation threads

   - Links to players, tracks status (open/closed), timestamps for creation and last activity

2. **Message**: Individual messages within cases
   
   - Polymorphic sender system (player or admin via sender_type/
   sender_id)
   
   - Contains subject, body, timestamps, and read status
   
   - Foreign key to case for threading

3. **Broadcast**: Admin announcements to all players

   - Created by admins, contains subject/body, timestamped

4. **BroadcastRead**: Tracking table for broadcast read status

   - Many-to-many relationship between broadcasts and players

   - Records when each player reads each broadcast

**Key Relationships:**

- Players create cases and send messages

- Admins send messages within existing cases and create broadcasts

- Cases contain multiple messages (threading)

- Broadcasts have many read records (one per player who reads it)

# Database Analysis Summary - Cat Walk Messaging System (Tickets)

## Current Database State

**Existing Tables:** 8 tables total

- Core: `players`, `admins` 

- Game content: `cat_templates`, `itemcategory`, `itemtemplate`

- Player data: `player_cats`, `player_items`, `cat_items`

- **No messaging tables exist yet** 

## Table Structures for FK References

### Players Table

- **Primary Key:** `id` (integer, auto-increment)

- **Username:** `username` (varchar(50), unique)

- **Other columns:** created_at, coins, cat_count, daily_upload_count, last_upload_reset, last_logged_in, password_hash

- **Referenced by:** cat_items, player_cats, player_items (all with CASCADE delete)

### Admins Table  

- **Primary Key:** `id` (integer, auto-increment)

- **Username:** `username` (varchar(50), unique)

- **Other columns:** password_hash, created_at, last_logged_in

## Test Data Available

**Players:** 130 total players

- **Recommended test users:** Use players with usernames: `"test"`, `"test1"`, `"test2"`, `"test3"`, `"test4"`, `"test5"`, `"test6"`

**Admins:** 14 total admins  

- **Available test admins:** 

  - ID 1: `admin1`

  - ID 2: `testadmin` 
  
  - ID 3: `content_moderator`

## Next Steps: Ticket System Implementation

**Tables to Create:**

1. `tickets` - Container for conversation threads

2. `messages` - Individual messages within tickets  

3. `broadcasts` - Admin announcements to all players

4. `broadcast_reads` - Tracking table for broadcast read status
Ready to proceed with table creation using the existing `players.id` and `admins.id` as foreign key references.

# Context

I have a neon DB for the project. I have already completely finished all the other tables.

Our current existing tables: admins, cat_items, cat_templates, itemcategory, itemtemplate, player_cats, player_items, players


# Cat Walk Messaging System Implementation Guide

## Project Context

**Game:** Cat Walk - Multiplayer cat collection and fashion game  

**Database:** Neon PostgreSQL  

**Focus:** Implementing ticket-based messaging system for player-admin communication

## System Requirements Summary

### Core Messaging Features

- **Ticket System** : Container for player-admin conversation threads

- **Message Threading**: Multiple messages grouped by ticket with read/unread status

- **Admin Broadcasts**: Announcements sent to all players with individual read tracking

- **Polymorphic Messaging**: Both players and admins can send messages within tickets

### Business Rules

- Tickets start as "open" when first message is sent

- Admins can manually close tickets

- Closed tickets automatically reopen when players send new messages

- Broadcasts require individual read tracking per player

- No automated notifications - admins handle all communication manually

## Current Database State

**Existing Tables (the one that are relevant for us):**

- **Core:** `players`, `admins`

- **Messaging Tables:** None exist 

**Available Foreign Keys:**

- `players.id` (integer, auto-increment, unique username)

- `admins.id` (integer, auto-increment, unique username)

**Test Data Ready:**

- **Players:** 130 total (use usernames: `test`, `test1`, `test2`, `test3`, `test4`, `test5`, `test6`)

- **Admins:** 14 total (IDs: 1=`admin1`, 2=`testadmin`, 3=`content_moderator`)

## Implementation Plan

**Tables to Create (4 total):**

1. **`broadcasts`** ← *Complete*

2. `tickets` ← *Complete*  

3. `messages` ← *Complete*

4. `broadcast_reads` ← *Complete*

---

# Task 1: Create Broadcast Table

## Table Structure Details Instructions:

**`broadcasts` Table:**

- **Primary Key:** `id` (auto-increment)

- **Foreign Key:** `admin_id` → `admins.id` (CASCADE delete)

- **Required Fields:** `subject` (VARCHAR 255), `body` (TEXT)

- **Timestamp:** `sent_at` (auto-populated)

**Indexes Added:**

- `admin_id` - for filtering broadcasts by admin

- `sent_at DESC` - for chronological ordering (newest first)

**Test Data Included:**

- 3 sample broadcasts from different test admins

- Covers typical use cases: welcome message, maintenance notice, content 
updates

**Next Steps:**

1. Run the SQL to create broadcasts table

2. Verify with the included test query

3. Proceed to create `tickets` table (conversation containers)

4. Then `messages` table (individual messages within tickets)

5. Finally `broadcast_reads` table (tracking who read what)

Perfect! The broadcast table is now updated with the correct field lengths.

---

# Task 2: Create Tickets Table

## Table Structure Details Instructions:

**`tickets` Table:**
- **Primary Key:** `id` (auto-increment)
- **Foreign Key:** `player_id` → `players.id` (CASCADE delete)  
- **Required Fields:** `subject` (VARCHAR 50), `status` (VARCHAR 20 with CHECK constraint)
- **Timestamps:** `created_at` (auto-populated), `last_activity_at` (auto-populated)

**Business Logic Constraints:**
- Status can only be 'open' or 'closed'
- Default status is 'open' for new tickets
- Both timestamps auto-populate on creation
- `last_activity_at` updates when new messages are added

**Indexes Added:**
- `player_id` - for filtering tickets by player
- `status` - for filtering open/closed tickets  
- `last_activity_at DESC` - for sorting by most recent activity
- Composite index on `(player_id, status)` - for player's open tickets

**Test Data Included:**
- 6 sample tickets from different test players
- Mix of open and closed statuses
- Various subjects covering typical player-admin communication scenarios

**Next Steps:**
1. Run the SQL to create tickets table
2. Verify with the included test query
3. Proceed to create `messages` table (individual messages within tickets)
4. Finally `broadcast_reads` table (tracking who read broadcasts)

---

---

# Task 3: Create Messages Table

## Table Structure Details Instructions:

**`messages` Table:**
- **Primary Key:** `id` (auto-increment)
- **Foreign Key:** `ticket_id` → `tickets.id` (CASCADE delete)
- **Polymorphic Sender:** `sender_type` (VARCHAR 10), `sender_id` (INTEGER)
- **Required Fields:** `subject` (VARCHAR 50), `body` (TEXT)
- **Status Tracking:** `is_read` (BOOLEAN, default FALSE)
- **Timestamp:** `sent_at` (auto-populated)

**Business Logic Constraints:**
- `sender_type` can only be 'player' or 'admin'
- Polymorphic relationship allows both players and admins to send messages
- `is_read` defaults to FALSE for new messages
- Messages are threaded within tickets via `ticket_id`

**Indexes Added:**
- `ticket_id` - for retrieving all messages in a ticket thread
- `sender_type, sender_id` - for finding messages by specific senders
- `sent_at DESC` - for chronological ordering within tickets
- `is_read` - for filtering unread messages

**Test Data Included:**
- Multiple messages per ticket to demonstrate threading
- Mix of player and admin senders using polymorphic design
- Various read statuses and realistic conversation flow
- Covers typical player-admin communication patterns

**Next Steps:**
1. Run the SQL to create messages table
2. Verify with the included test query showing threaded conversations
3. Proceed to create `broadcast_reads` table (final table for tracking broadcast read status)
4. Complete messaging system implementation

---

# Task 4: Create Broadcast Reads Table
## Table Structure Details Instructions:
**`broadcast_reads` Table:**
- **Primary Key:** `id` (auto-increment)
- **Foreign Keys:** `broadcast_id` → `broadcasts.id` (CASCADE delete), `player_id` → `players.id` (CASCADE delete)
- **Timestamp:** `read_at` (auto-populated when player reads broadcast)
- **Unique Constraint:** Composite unique on `(broadcast_id, player_id)` - prevents duplicate read records

**Business Logic Constraints:**
- Many-to-many relationship between broadcasts and players
- Each player can only have one read record per broadcast (enforced by unique constraint)
- `read_at` timestamp captures exactly when player read the broadcast
- Cascade deletes ensure cleanup when broadcasts or players are removed
- Missing record = unread broadcast for that player

**Indexes Added:**
- `broadcast_id` - for finding all players who read a specific broadcast
- `player_id` - for finding all broadcasts read by a specific player
- `read_at DESC` - for chronological ordering of read activity
- Composite unique index on `(broadcast_id, player_id)` - enforces business rule and optimizes lookups

**Test Data Included:**
- Multiple players reading different broadcasts at various times
- Some players have read all broadcasts, others only some
- Demonstrates realistic read patterns across the player base
- Shows chronological spread of when broadcasts were read by different users

**Next Steps:**
1. Run the SQL to create broadcast_reads table
2. Verify with the included test query showing broadcast read statistics
3. **Messaging system implementation complete** - all 4 tables created
4. System ready for player-admin communication and broadcast functionality

---
# Notes:

- When returning queries to me, DO NOT add comments to the code.




---

# I am going to implement a messaging system using socket.io  with real time messaging section in my site

## What you need to know:
- I have created the 4 tables in neon DB, there complete, functional, and have data in them.
- I have created the placeholder files for the visuals
	- In C:\dev\catwalk-client\ we have these files that might be relevant for the player side -
	- C:\dev\catwalk-client\js\main.js
	- C:\dev\catwalk-client\pages\album.html
	- C:\dev\catwalk-client\css\mailbox.css
	- C:\dev\catwalk-client\js\features\mailbox\mailbox.js
- I will start with focusing on the player 
- When you return to me code, return it in a markdown format to a canvas.
- I saw socket.io in the internet, it might be usefull for us

## Task for you

- summarize the relevant information we need to know
- Help me orgenize a work plan 
