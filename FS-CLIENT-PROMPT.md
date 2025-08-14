

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



Additional notes:
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
WE NEED TO TAKE IT ONE STEP AT A TIME, NOT CHANGE THE WHOLE CODE AT ONCE. Let's build a list of tasks, complete one each time, add debugging, run the game. We first want to make sure we have a connection, then we want to see the player and their data in the logging when entering the waiting room, then waiting room counter increases only with more players joining. WE FIRST LOOK AT WAITING ROOM ONLY, IGNORING THE OTHER PHASES FOR NOW.


# CURRENT TASK:

Before continueing to other areas, let's first take care of the player and cat data being fetched properly. Maybe we can look at `C:\dev\catwalk-client\js\features\mailbox\player-mailbox.js` and `C:\dev\catwalk-client\js\core\init\dataLoader.js` as references.

