
# cat walk - messages system

## 1. User-story
Fill this out in detail, and keep a nice format

## 2. Messages
- client enters opens mailbox???
- server -> client: ???
- client -> server: ???

## 3. TypeScript types and constants - common to server and client
This is an *EXAMPLE* of something simular we did in fashion show matchmaking. We need something for mailbox.
```typescript

const PARTICIPANTS_IN_ROOM = 5;
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
- Error handling: As for now, we will not be adding error message types for various failure scenarios. As long as we don't have specific errors, talking about this is irrelevant
