import { APP_URL } from './core/config.js';
import { getAuthToken } from './core/auth/authentication.js';
import { getPlayerCats } from './core/storage.js';

console.log("🎭 Fashion Show - using APP_URL:", APP_URL);

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎭 Fashion Show page DOM loaded');

  // Get required data
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('❌ No userId in localStorage - user must be logged in');
    alert('Please log in to access the fashion show');
    window.location.href = '/';
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const catIdFromUrl = urlParams.get('catId');
  if (!catIdFromUrl) {
    console.error('❌ No catId provided in URL');
    alert('No cat selected for fashion show');
    window.location.href = '/';
    return;
  }
  const catId = parseInt(catIdFromUrl);

  // Get username
  let username = 'Unknown Player'; // fallback
  try {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      username = storedUsername;
    } else {
      username = `Player_${userId}`;
      console.log('⚠️ No stored username, using fallback:', username);
    }
  } catch (err) {
    console.warn('⚠️ Could not get username, using fallback:', username);
  }

  // Get cat name
  let catName = `Cat_${catId}`; // fallback
  try {
    console.log('🔄 Fetching user cats...');
    const userCats = await getPlayerCats();
    
    const selectedCat = userCats.find(cat => cat.id === catId);
    if (selectedCat && selectedCat.name) {
      catName = selectedCat.name;
    } else {
      console.warn('⚠️ Cat not found in user cats, using fallback name');
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch cat data, using fallback:', err);
  }

  const playerData = {
    playerId: userId,
    username: username,
    catId: catId,
    catName: catName
  };
  console.log('🎯 Player data ready:', playerData);

  initializeSocket(playerData);
});

function initializeSocket(playerData) {
  console.log('🔧 Initializing socket connection...');
  
  const authToken = getAuthToken();
  const socket = io(APP_URL, {
    auth: { token: authToken }
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);

    const joinMessage = {
      playerId: playerData.playerId,
      catId: playerData.catId
    };
    console.log('📤 Sending join message:', joinMessage);
    socket.emit('join', joinMessage);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connect_error:', err);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  // Waiting room participant updates
  socket.on('participant_update', (message) => {
    console.log('📥 Received participant_update:', message);
    
    const { participants, maxCount } = message;
    const currentCount = participants.length;
    
    console.log(`👥 Waiting room: ${currentCount}/${maxCount} participants`);
    updateWaitingRoomUI(currentCount, maxCount, participants, playerData);
  });

  // Voting phase transition
  socket.on('voting_phase', (message) => {
    console.log('📥 Received voting_phase:', message);
    
    const { participants, timerSeconds } = message;
    console.log(`🗳️ Entering voting phase with ${participants.length} participants, timer: ${timerSeconds}s`);
    
    transitionToVotingPhase(participants, timerSeconds, playerData);
  });

  socket.on('voting_update', (message) => {
    console.log('📥 Received voting_update:', message);
    // TODO: Handle voting updates
  });

  socket.on('results', (message) => {
    console.log('📥 Received results:', message);
    // TODO: Handle results
  });
}

// Update waiting room UI
function updateWaitingRoomUI(currentCount, maxCount, participants, playerData) {
  console.log(`🎨 Updating waiting room UI: ${currentCount}/${maxCount}`);
  
  // Update player counter
  const playerCounterElement = document.getElementById('player-counter');
  if (playerCounterElement) {
    playerCounterElement.textContent = `${currentCount}/${maxCount}`;
  }
  
  // Update waiting message visibility
  const waitingMessageElement = document.querySelector('.waiting-message');
  if (waitingMessageElement) {
    if (currentCount < maxCount) {
      waitingMessageElement.style.display = 'block';
    } else {
      console.log('🎯 Room is full! Waiting for voting phase...');
    }
  }
  
  // Debug: Check if we're in the participant list
  const ourParticipant = participants.find(p => p.playerId === playerData.playerId);
  if (!ourParticipant) {
    console.warn('⚠️ Could not find our participant in the list');
  }
  
  // Debug: Show all participants
  console.log('👥 All participants in room:');
  participants.forEach((participant, index) => {
    const isOurs = participant.playerId === playerData.playerId;
    console.log(`  ${index + 1}. ${participant.playerId} (cat: ${participant.catId})${isOurs ? ' ← YOU' : ''}`);
  });
}

// Transition from waiting room to voting phase
function transitionToVotingPhase(participants, timerSeconds, playerData) {
  console.log('🎨 Transitioning to voting phase...');
  
  // Hide waiting message
  const waitingMessageElement = document.querySelector('.waiting-message');
  if (waitingMessageElement) {
    waitingMessageElement.style.display = 'none';
  }
  
  // Show cat display area
  const catDisplayElement = document.querySelector('.cat-display');
  if (catDisplayElement) {
    catDisplayElement.style.display = 'flex';
  }
  
  // Show timer section
  const timerSectionElement = document.querySelector('.timer-section');
  if (timerSectionElement) {
    timerSectionElement.style.display = 'flex';
  }
  
  populateStageBasesWithParticipants(participants, playerData);
  startCountdownTimer(timerSeconds);
  
  console.log('✅ Voting phase transition complete');
}

// Populate each stage base with participant data
function populateStageBasesWithParticipants(participants, playerData) {
  console.log('🎨 Populating stage bases...');
  
  const stageBases = document.querySelectorAll('.stage-base');
  
  participants.forEach((participant, index) => {
    if (index >= stageBases.length) {
      console.warn(`⚠️ Not enough stage bases for participant ${index + 1}`);
      return;
    }
    
    const stageBase = stageBases[index];
    const isOwnCat = participant.playerId === playerData.playerId && participant.catId === playerData.catId;
    
    console.log(`🎨 Populating stage ${index + 1}:`, participant, isOwnCat ? '(YOUR CAT)' : '');
    
    // Show cat sprite
    const catSprite = stageBase.querySelector('.cat-sprite');
    if (catSprite) {
      if (participant.catSpriteUrl) {
        catSprite.src = participant.catSpriteUrl;
        console.log(`✅ Set cat sprite for stage ${index + 1}`);
      } else {
        catSprite.src = '../assets/cat-placeholder.png';
        console.warn(`⚠️ No sprite URL for stage ${index + 1}, using placeholder`);
      }
      catSprite.style.display = 'block';
    }
    
    // Set cat name
    const catNameElement = stageBase.querySelector('.cat-name');
    if (catNameElement) {
      catNameElement.textContent = participant.catName;
    }
    
    // Set username
    const usernameElement = stageBase.querySelector('.username');
    if (usernameElement) {
      usernameElement.textContent = participant.username;
    }
    
    // Render worn items
    if (participant.wornItems && participant.wornItems.length > 0) {
      console.log(`👔 Stage ${index + 1} has ${participant.wornItems.length} worn items`);
      renderWornItems(stageBase, participant.wornItems, index);
    }
    
    // Mark own cat for special styling
    if (isOwnCat) {
      stageBase.classList.add('own-cat');
    }
    
    // Store participant data for click handling
    stageBase.dataset.participantId = participant.playerId;
    stageBase.dataset.catId = participant.catId;
  });
  
  console.log('✅ Stage bases populated');
}

// Render worn items on top of cat sprite
function renderWornItems(stageBase, wornItems, stageIndex) {
  console.log(`👔 Rendering ${wornItems.length} worn items for stage ${stageIndex + 1}`);
  
  // Remove existing worn items
  const existingItems = stageBase.querySelectorAll('.worn-item');
  existingItems.forEach(item => item.remove());
  
  if (!wornItems || wornItems.length === 0) {
    return;
  }
  
  // Get cat sprite as reference for positioning
  const catSprite = stageBase.querySelector('.cat-sprite');
  if (!catSprite) {
    console.warn(`⚠️ No cat sprite found for stage ${stageIndex + 1}, cannot render items`);
    return;
  }
  
  wornItems.forEach((item, itemIndex) => {
    if (!item.spriteUrl) {
      console.warn(`⚠️ No sprite URL for item ${itemIndex + 1} on stage ${stageIndex + 1}`);
      return;
    }
    
    // Create worn item element
    const wornItemElement = document.createElement('img');
    wornItemElement.src = item.spriteUrl;
    wornItemElement.alt = `${item.category} item`;
    wornItemElement.classList.add('worn-item', `worn-${item.category}`);
    
    // Position over cat sprite
    wornItemElement.style.position = 'absolute';
    wornItemElement.style.top = '80px'; // Same as cat sprite
    wornItemElement.style.left = '0';
    wornItemElement.style.width = '100%';
    wornItemElement.style.height = 'auto';
    wornItemElement.style.zIndex = '10'; // Above cat sprite
    wornItemElement.style.pointerEvents = 'none'; // Don't interfere with clicking
    
    // Crisp pixel rendering
    wornItemElement.style.imageRendering = 'pixelated';
    wornItemElement.style.imageRendering = '-moz-crisp-edges';
    wornItemElement.style.imageRendering = 'crisp-edges';
    
    stageBase.appendChild(wornItemElement);
  });
  
  console.log(`✅ Rendered worn items for stage ${stageIndex + 1}`);
}

// Start countdown timer
function startCountdownTimer(initialSeconds) {
  console.log('⏰ Starting countdown timer:', initialSeconds, 'seconds');
  
  const timerTextElement = document.getElementById('timer-text');
  if (!timerTextElement) {
    console.warn('⚠️ Timer text element not found');
    return;
  }
  
  let remainingSeconds = initialSeconds;
  timerTextElement.textContent = `${remainingSeconds} s`;
  
  const timerInterval = setInterval(() => {
    remainingSeconds--;
    timerTextElement.textContent = `${remainingSeconds} s`;
    
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      console.log('⏰ Timer reached zero');
    }
  }, 1000);
  
  console.log('✅ Countdown timer started');
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  console.log('🔌 Page unloading - will disconnect socket');
});