import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { getLoggedInUserInfo } from "./core/utils.js";

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
let playerId = null; // Will be set from authentication
//let playerId = getLoggedInUserInfo().userId; // This should be set from your authentication system
let votingTimer = null;
let timeRemaining = 60;
const PARTICIPANTS_IN_ROOM = 5;
const VOTING_TIMER = 60;

// Utility function to update counter display
function updateCounterDisplay(currentCount = 1, maxCount = PARTICIPANTS_IN_ROOM) {
  const counterElement = document.getElementById('player-counter');
  if (counterElement) counterElement.textContent = `${currentCount}/${maxCount}`;
}

// Initialize socket connection
function initializeSocket() {
  console.log('🔧 Initializing socket connection...');
  socket = io("http://localhost:3000"); // Assumes socket.io server is on same domain
  
  socket.on('connect', () => {
    console.log('✅ Connected to fashion show server');
    console.log('🔧 Socket ID:', socket.id);

    // Ensure we have both cat and player data before joining
    if (!selectedCat || !playerId) {
      console.error('❌ Missing data - selectedCat:', selectedCat, 'playerId:', playerId);
      throw new Error('WS is created - but player-id or cat-id are missing')
    }

    console.log('🔧 About to join fashion show...');
    joinFashionShow();
  });

    socket.on('disconnect', () => {
    console.log('🔌 Disconnected from fashion show server');

  // socket.on('disconnect', (reason) => {
  //   console.log('❌ Disconnected from fashion show server. Reason:', reason);
  //   console.log('🔧 Socket ID was:', socket.id);
    // TODO: Return to main page
  });

  //   socket.on('connect_error', (error) => {
  //   console.error('❌ Connection error:', error);
  // });

    // Event handlers with better error handling
  socket.on('participant_update', (message) => {
    console.log('🔧 Received event: participant_update', message);
    try {
      console.log('👥 Participant update received:', message);
      handleParticipantUpdate(message);
      console.log('✅ Participant update handled successfully');
    } catch (error) {
      console.log('❌ Error handling participant update:', error);
    }
  });

  socket.on('voting_phase', (message) => {
    console.log('🔧 Received event: voting_phase', message);
    try {
      console.log('🗳️ Voting phase message received:', message);
      handleVotingPhase(message);
      console.log('✅ Voting phase handled successfully');
    } catch (error) {
      console.log('❌ Error handling voting phase:', error);
      // Don't disconnect on error, just log it
    }
  });

  socket.on('voting_update', (message) => {
    console.log('🔧 Received event: voting_update', message);
    try {
      console.log('🗳️ Voting update received:', message);
      handleVotingUpdate(message);
      console.log('✅ Voting update handled successfully');
    } catch (error) {
      console.log('❌ Error handling voting update:', error);
    }
  });

  socket.on('results', (message) => {
    console.log('🔧 Received event: results', message);
    try {
      console.log('🏆 Results received:', message);
      handleResults(message);
      console.log('✅ Results handled successfully');
    } catch (error) {
      console.log('❌ Error handling results:', error);
    }
  });
}


//   // Add error handling for any unhandled events
//   socket.onAny((eventName, ...args) => {
//     console.log('🔧 Received event:', eventName, args);
//   });
// }

function joinFashionShow() {
  const joinMessage = {
    playerId: playerId,
    catId: selectedCat.id
  };
  console.log('📤 Sending join message:', joinMessage);

    // try {
    socket.emit('join', joinMessage);
    console.log('✅ Join message sent successfully');
  // } catch (error) {
  //   console.error('❌ Error sending join message:', error);
  // }
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
      votedCatId: catId
    };
    console.log('📤 Sending vote:', voteMessage);
    socket.emit('vote', voteMessage);
  }
}

// // Get URL parameters
// function getUrlParameter(name) {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(name);
// }

// // Fetch user cats and initialize
// fetch("../data/usercats.json")
//   .then(res => res.json())
//   .then(data => {
//     userCats = data;
//     window.userCats = userCats;

//     // Get the cat ID from URL parameter (passed from bindings.js)
//     const catIdFromUrl = getUrlParameter('catId');
//     if (!catIdFromUrl) {
//       console.error("❌ No catId provided in URL");
//       // Redirect back to album or show error
//       window.location.href = '../album/';
//       return;
//     }

//     // Find the selected cat in our user cats array
//     selectedCat = userCats.find(cat => cat.id == catIdFromUrl);
//     if (!selectedCat) {
//       console.error("❌ Selected cat not found in user cats");
//       // Fallback: redirect back to album
//       window.location.href = '../album/';
//       return;
//     }

//     console.log("🐾 Selected cat from URL parameter:", selectedCat);

//     // Get the real player ID from authentication system
//     try {
//       const playerInfo = getLoggedInUserInfo();
//       playerId = playerInfo.userId;
//       console.log("🎭 Using authenticated player ID:", playerId);
//     } catch (error) {
//       console.error("❌ Failed to get player info:", error);
//       // The getLoggedInUserInfo function will redirect to login if needed
//       return;
//     }

//     document.dispatchEvent(new Event("CatsReady"));
//   })
//   .catch(err => {
//     console.error("❌ Failed to load usercats.json", err);
//   });

// // // Fetch user cats and initialize
// // fetch("../data/usercats.json")
// //   .then(res => res.json())
// //   .then(data => {
// //     userCats = data;
// //     window.userCats = userCats;

// //     // TODO: The cat should be selected by the user in the UI
// //     selectedCat = userCats[Math.floor(Math.random() * userCats.length)];
// //     console.warn('Using stub cat-id ' + selectedCat.id);
// //     console.log("🐾 Selected cat from album is:", selectedCat);

// //     // TODO: Get playerId from your authentication system
// //     playerId = "player_" + Math.random().toString(36).substr(2, 9); // Temporary random ID
// //     console.warn('Using stub player-id ' + playerId);

// //     document.dispatchEvent(new Event("CatsReady"));
// //   })
// //   .catch(err => {
// //     console.error("❌ Failed to load usercats.json", err);
// //   });

// // function updateCounterDisplay(currentCount = 1, maxCount = PARTICIPANTS_IN_ROOM) {
// //   const counterElement = document.getElementById('player-counter');
// //   if (counterElement) counterElement.textContent = `${currentCount}/${maxCount}`;
// // }

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
      // Use a fallback image path that exists
      catSprite.src = '../assets/cats/cat-placeholder.png';
      // If that doesn't exist, use a data URL as fallback
      catSprite.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjQ0NDIi8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIiBmaWxsPSIjOTk5Ii8+Cjx0ZXh0IHg9IjE2IiB5PSIyMCIgZmlsbD0iIzMzMyIgZm9udC1zaXplPSI4IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNhdDwvdGV4dD4KPC9zdmc+';
      };
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

// Initialize page when ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎭 Fashion Show page DOM loaded');
  
  // Get URL parameters to extract cat ID
  const urlParams = new URLSearchParams(window.location.search);
  const catIdFromUrl = urlParams.get('catId');
  
  if (catIdFromUrl) {
    catId = parseInt(catIdFromUrl);
    console.log('🐾 Cat ID from URL:', catId);
  }

  // Get authenticated player ID
  try {
    const userInfo = getLoggedInUserInfo();
    playerId = userInfo.userId;
    console.log('🎭 Using authenticated player ID:', playerId);
  } catch (error) {
    console.error('❌ Failed to get user info:', error);
    // Fallback to development player ID
    playerId = 19;
    console.warn('🎭 Using fallback player ID:', playerId);
  }

  // Load user cats and find selected cat
  fetch("../data/usercats.json")
    .then(res => res.json())
    .then(data => {
      userCats = data;
      window.userCats = userCats;

      // Find the selected cat by ID from URL parameter
      if (catId) {
        selectedCat = userCats.find(cat => cat.id === catId);
      }
      
      // Fallback if no cat found
      if (!selectedCat && userCats.length > 0) {
        selectedCat = userCats[0];
        console.warn('🐾 Cat not found by ID, using first cat:', selectedCat);
      }

      if (selectedCat) {
        console.log("🐾 Selected cat from URL parameter:", selectedCat);
        
        // Initialize socket connection now that we have all required data
        initializeSocket();
      } else {
        console.error("❌ No cats available");
        throw new Error('No cats available for fashion show');
      }
    })
    .catch(err => {
      console.error("❌ Failed to load usercats.json", err);
    });

  // Handle exit dialog for album button
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

// Make functions available globally for HTML onclick handlers
window.playAgain = playAgain;
window.goHome = goHome;