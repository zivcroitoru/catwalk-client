let isInVotingPhase = false;
let exitDialogOpen = false;
let selectedCatIndex = null;
let playerOwnedCatIndex = 0;
let warningTimeout = null;
let resultsTimeout = null;

let catId = null;
let selectedCat = null;
let userCats = [];
let socket = null;
let participants = [];
let playerId = null; // This should be set from your authentication system
let votingTimer = null;
let timeRemaining = 60;

const PARTICIPANTS_IN_ROOM = 5;
const VOTING_TIMER = 60;

// Initialize socket connection
function initializeSocket() {
  socket = io(); // Assumes socket.io server is on same domain
  
  socket.on('connect', () => {
    console.log('🔌 Connected to fashion show server');
    // Send join message once connected and we have the cat data
    if (!selectedCat || !playerId) {
      throw new Error('WS is created - but player-id or cat-id are missing')
    }
    joinFashionShow();
  });

  socket.on('disconnect', () => {
    console.log('🔌 Disconnected from fashion show server');
    // TODO: Return to main page
  });

  socket.on('participant_update', (message) => {
    console.log('👥 Participant update:', message);
    handleParticipantUpdate(message);
  });

  socket.on('voting_phase', (message) => {
    console.log('🗳️ Voting phase started:', message);
    handleVotingPhase(message);
  });

  socket.on('voting_update', (message) => {
    console.log('🗳️ Voting update:', message);
    handleVotingUpdate(message);
  });

  socket.on('results', (message) => {
    console.log('🏆 Results:', message);
    handleResults(message);
  });
}

function joinFashionShow() {
  const joinMessage = {
    type: 'join',
    playerId: playerId,
    catId: selectedCat.id
  };
  console.log('📤 Sending join message:', joinMessage);
  socket.emit('message', joinMessage);
}

function handleParticipantUpdate(message) {
  participants = message.participants;
  updateCounterDisplay(participants.length, message.maxCount);
  
  // Find our own cat's position in the participants array
  const ourParticipant = participants.find(p => p.playerId === playerId);
  if (ourParticipant) {
    playerOwnedCatIndex = participants.indexOf(ourParticipant);
  }
}

function handleVotingPhase(message) {
  participants = message.participants;
  timeRemaining = message.timerSeconds;
  transitionToVotingPhase();
}

function handleVotingUpdate(message) {
  participants = message.participants;
  updateVotingProgress();
}

function handleResults(message) {
  participants = message.participants;
  isInVotingPhase = false;
  disableVotingClicks();
  if (votingTimer) {
    clearInterval(votingTimer);
    votingTimer = null;
  }
  showResults();
}

function sendVote(catId) {
  if (socket && socket.connected) {
    const voteMessage = {
      type: 'vote',
      votedCatId: catId
    };
    console.log('📤 Sending vote:', voteMessage);
    socket.emit('message', voteMessage);
  }
}

// Fetch user cats and initialize
fetch("../data/usercats.json")
  .then(res => res.json())
  .then(data => {
    userCats = data;
    window.userCats = userCats;

    // TODO: The cat should be selected by the user in the UI
    selectedCat = userCats[Math.floor(Math.random() * userCats.length)];
    console.warn('Using stub cat-id ' + selectedCat.id);
    console.log("🐾 Selected cat from album is:", selectedCat);

    // TODO: Get playerId from your authentication system
    playerId = "player_" + Math.random().toString(36).substr(2, 9); // Temporary random ID
    console.warn('Using stub player-id ' + playerId);

    document.dispatchEvent(new Event("CatsReady"));
  })
  .catch(err => {
    console.error("❌ Failed to load usercats.json", err);
  });

function updateCounterDisplay(currentCount = 1, maxCount = PARTICIPANTS_IN_ROOM) {
  const counterElement = document.getElementById('player-counter');
  if (counterElement) counterElement.textContent = `${currentCount}/${maxCount}`;
}

function transitionToVotingPhase() {
  const waitingMessage = document.querySelector('.waiting-message');
  if (waitingMessage) {
    waitingMessage.innerHTML = 'SETTING UP STAGE . . .';
    setTimeout(() => {
      showVotingInterface();
    }, 1000);
  }
}

function showVotingInterface() {
  isInVotingPhase = true;
  document.querySelector('.waiting-message')?.remove();
  createVotingInterface();
  startDetailedSequence();
}

function createVotingInterface() {
  const main = document.querySelector('main');
  const catDisplay = document.createElement('div');
  catDisplay.className = 'cat-display';

  for (let i = 0; i < PARTICIPANTS_IN_ROOM; i++) {
    const participant = participants[i];
    const stageBase = document.createElement('div');
    stageBase.className = 'stage-base';
    stageBase.setAttribute('data-cat-index', i);
    stageBase.setAttribute('data-cat-id', participant.catId);

    const stageWalkway = document.createElement('img');
    stageWalkway.src = '../assets/icons/stage-walkway.png';
    stageWalkway.alt = 'Stage Walkway';
    stageWalkway.className = 'stage-walkway';
    stageBase.appendChild(stageWalkway);

    const catSprite = document.createElement('img');
    catSprite.className = 'cat-sprite';
    catSprite.alt = `Cat ${participant.catId}`;
    
    // Use selected cat image if it's our cat, otherwise placeholder
    if (participant.playerId === playerId && selectedCat) {
      catSprite.src = selectedCat.image;
    } else {
      catSprite.src = '../assets/cats/placeholder-fashion-show-cat.png';
    }
    stageBase.appendChild(catSprite);

    const catName = document.createElement('div');
    catName.className = 'cat-name';
    catName.textContent = `Cat ${participant.catId}`;
    stageBase.appendChild(catName);

    const username = document.createElement('div');
    username.className = 'username';
    username.textContent = participant.playerId === playerId ? 'You' : participant.playerId;
    stageBase.appendChild(username);

    catDisplay.appendChild(stageBase);
  }

  const announcement = document.createElement('div');
  announcement.className = 'announcement-text';
  announcement.textContent = 'HERE THEY COME!';

  const warningMessage = document.createElement('div');
  warningMessage.className = 'warning-message';
  warningMessage.textContent = "You can't vote for your own cat, please vote for another cat";
  warningMessage.style.display = 'none';

  main.appendChild(catDisplay);
  main.appendChild(announcement);
  main.appendChild(warningMessage);
}

function enableVotingClicks() {
  document.querySelector('.cat-display')?.classList.add('voting-active');

  const stageBases = document.querySelectorAll('.stage-base');
  stageBases.forEach((stageBase, index) => {
    stageBase.addEventListener('click', () => handleCatVote(index));
    stageBase.addEventListener('mouseenter', () => handleCatHover(index));
    stageBase.addEventListener('mouseleave', () => handleCatHoverEnd(index));
  });
}

function disableVotingClicks() {
  document.querySelector('.cat-display')?.classList.remove('voting-active');
  hideWarningMessage();
}

function handleCatVote(catIndex) {
  if (!isInVotingPhase || !participants[catIndex]) return;

  if (catIndex === playerOwnedCatIndex) {
    showOwnCatWarning(catIndex);
    return;
  }

  hideWarningMessage();
  clearCatSelection();
  selectedCatIndex = catIndex;

  const stageBases = document.querySelectorAll('.stage-base');
  stageBases[catIndex]?.classList.add('selected');

  // Send vote to server
  const votedCatId = participants[catIndex].catId;
  sendVote(votedCatId);
}

function handleCatHover(catIndex) {
  if (!isInVotingPhase) return;
  if (catIndex === playerOwnedCatIndex) {
    document.querySelectorAll('.stage-base')[catIndex]?.classList.add('own-cat-hover');
  }
}

function handleCatHoverEnd(catIndex) {
  document.querySelectorAll('.stage-base')[catIndex]?.classList.remove('own-cat-hover');
}

function showOwnCatWarning(catIndex) {
  clearCatSelection();
  document.querySelectorAll('.stage-base')[catIndex]?.classList.add('own-cat-selected');

  const warning = document.querySelector('.warning-message');
  if (warning) warning.style.display = 'block';

  if (warningTimeout) clearTimeout(warningTimeout);
  warningTimeout = setTimeout(hideWarningMessage, 3000);
}

function hideWarningMessage() {
  document.querySelector('.warning-message')?.style.setProperty('display', 'none');
  document.querySelectorAll('.stage-base')[playerOwnedCatIndex]?.classList.remove('own-cat-selected');
  clearTimeout(warningTimeout);
  warningTimeout = null;
}

function clearCatSelection() {
  document.querySelectorAll('.stage-base').forEach(base => base.classList.remove('selected'));
  selectedCatIndex = null;
}

function updateVotingProgress() {
  const votedCount = participants.filter(p => p.votedCatId).length;
  const announcement = document.querySelector('.announcement-text');
  if (announcement) {
    announcement.textContent = `Waiting for all players to vote (${votedCount}/${PARTICIPANTS_IN_ROOM})...`;
  }
}

function startDetailedSequence() {
  const announcement = document.querySelector('.announcement-text');

  setTimeout(() => {
    if (announcement) announcement.textContent = 'VOTE!';

    setTimeout(() => {
      showTimer();
      moveAlbumButtonUp();
      if (announcement) announcement.textContent = `Waiting for all players to vote (0/${PARTICIPANTS_IN_ROOM})...`;
      enableVotingClicks();
      startVotingTimer();
    }, 1000);
  }, 2000);
}

function showTimer() {
  document.querySelector('.timer-section')?.style.setProperty('display', 'flex');
}

function moveAlbumButtonUp() {
  document.querySelector('.album-button')?.style.setProperty('bottom', '120px');
}

function startVotingTimer() {
  updateTimerDisplay();

  votingTimer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining === 10) changeTimerToRed();
    if (timeRemaining <= 0) {
      clearInterval(votingTimer);
      votingTimer = null;
      // Server will handle timeout, we just stop the timer
      console.log("Voting time is up.");
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timer = document.getElementById('timer-text');
  if (timer) timer.textContent = `${timeRemaining} s`;
}

function changeTimerToRed() {
  const timer = document.getElementById('timer-text');
  if (timer) {
    timer.style.color = 'var(--color-red)';
    timer.style.fontSize = 'var(--font-size-md)';
  }
}

function showResults() {
  const announcement = document.querySelector('.announcement-text');
  if (announcement) {
    announcement.textContent = 'RESULTS!';
  }

  // Hide timer
  const timerSection = document.querySelector('.timer-section');
  if (timerSection) {
    timerSection.style.display = 'none';
  }

  // Show results for each participant
  const stageBases = document.querySelectorAll('.stage-base');
  participants.forEach((participant, index) => {
    const stageBase = stageBases[index];
    if (stageBase) {
      // Add results display
      const resultsDiv = document.createElement('div');
      resultsDiv.className = 'cat-results';
      resultsDiv.innerHTML = `
        <div class="votes-received">${participant.votesReceived} votes</div>
        <div class="coins-earned">+${participant.coinsEarned} coins</div>
      `;
      stageBase.appendChild(resultsDiv);
    }
  });

  // Show play again options after a delay
  setTimeout(() => {
    showPlayAgainOptions();
  }, 3000);
}

function showPlayAgainOptions() {
  const main = document.querySelector('main');
  const playAgainDiv = document.createElement('div');
  playAgainDiv.className = 'play-again-options';
  playAgainDiv.innerHTML = `
    <button class="play-again-btn" onclick="playAgain()">Play Again</button>
    <button class="go-home-btn" onclick="goHome()">Go Home</button>
  `;
  main.appendChild(playAgainDiv);
}

function playAgain() {
  // Reset the page state and rejoin
  location.reload();
}

function goHome() {
  // Navigate back to album
  window.location.href = '../album/';
}

document.addEventListener('CatsReady', () => {
  console.log("Fashion Show page ready with selected cat");
  
  // Initialize socket connection
  initializeSocket();

  const albumButton = document.querySelector('.album-button');
  if (albumButton) {
    albumButton.addEventListener('click', event => {
      if (isInVotingPhase) {
        event.preventDefault();
        showExitDialog();
      }
    });
  }
});

// Handle page unload - disconnect from socket
window.addEventListener('beforeunload', () => {
  if (socket) {
    socket.disconnect();
  }
});