import { APP_URL } from './core/config.js';
import { getAuthToken } from './core/auth/authentication.js';
import { getPlayerCats } from './core/storage.js'; // Import the existing function

console.log("🎭 Fashion Show - using APP_URL:", APP_URL);

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎭 Fashion Show page DOM loaded');

  // Step 1A: Get required data
  // 1. Get userId from localStorage (like mailbox does)
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('❌ No userId in localStorage - user must be logged in');
    alert('Please log in to access the fashion show');
    window.location.href = '/'; // Redirect to main page
    return;
  }
  console.log('✅ Retrieved userId:', userId);

  // 2. Get catId from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const catIdFromUrl = urlParams.get('catId');
  if (!catIdFromUrl) {
    console.error('❌ No catId provided in URL');
    alert('No cat selected for fashion show');
    window.location.href = '/'; // Redirect to main page
    return;
  }
  const catId = parseInt(catIdFromUrl);
  console.log('✅ Retrieved catId from URL:', catId);

  // 3. Get user info (for username) - use the same approach as mailbox
  let username = 'Unknown Player'; // fallback
  try {
    // Try to get username from localStorage first (like mailbox does)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      username = storedUsername;
      console.log('✅ Got username from localStorage:', username);
    } else {
      // Fallback to simple format
      username = `Player_${userId}`;
      console.log('⚠️ No stored username, using fallback:', username);
    }
  } catch (err) {
    console.warn('⚠️ Could not get username, using fallback:', username);
  }

  // 4. Get cat name - use the existing getPlayerCats function like dataLoader does
  let catName = `Cat_${catId}`; // fallback
  try {
    console.log('🔄 Fetching user cats using existing storage function...');
    const userCats = await getPlayerCats(); // Use the existing function
    console.log('✅ Retrieved user cats:', userCats);
    
    const selectedCat = userCats.find(cat => cat.id === catId);
    if (selectedCat && selectedCat.name) {
      catName = selectedCat.name;
      console.log('✅ Found selected cat:', selectedCat);
    } else {
      console.warn('⚠️ Cat not found in user cats, using fallback name');
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch cat data, using fallback:', err);
  }
  console.log('✅ Using catName:', catName);

  // Step 1A: Summary of retrieved data
  const playerData = {
    playerId: userId,
    username: username,
    catId: catId,
    catName: catName
  };
  console.log('🎯 Step 1A - Complete player data:', playerData);

  // Step 1A: Initialize socket connection with all required data
  initializeSocket(playerData);
});

function initializeSocket(playerData) {
  console.log('🔧 Initializing socket connection...');
  
  // Connect socket (use auth token if available, like mailbox does)
  const authToken = getAuthToken();
  const socket = io(APP_URL, {
    auth: {
      token: authToken
    }
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    console.log('🎯 Ready to join fashion show with data:', playerData);

    // Step 1B: Send join message to server
    const joinMessage = {
      playerId: playerData.playerId,
      catId: playerData.catId
    };
    console.log('📤 Step 1B - Sending join message:', joinMessage);
    
    socket.emit('join', joinMessage);
    console.log('✅ Join message sent to server');
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connect_error:', err);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  // Step 1C - Waiting room participant updates
  socket.on('participant_update', (message) => {
    console.log('📥 Step 1C - Received participant_update:', message);
    
    // Extract data from message
    const { participants, maxCount } = message;
    const currentCount = participants.length;
    
    console.log(`👥 Step 1C - Waiting room: ${currentCount}/${maxCount} participants`);
    console.log('👥 Step 1C - Participants:', participants.map(p => `${p.playerId} (cat: ${p.catId})`));
    
    // Step 1D: Update UI
    updateWaitingRoomUI(currentCount, maxCount, participants, playerData);
  });

  // Step 2A - Voting phase transition
  socket.on('voting_phase', (message) => {
    console.log('📥 Step 2A - Received voting_phase:', message);
    
    // Extract data from message
    const { participants, timerSeconds } = message;
    
    console.log(`🗳️ Step 2A - Entering voting phase with ${participants.length} participants`);
    console.log('🗳️ Step 2A - Timer:', timerSeconds, 'seconds');
    
    // Step 2B: Transition UI from waiting room to voting
    transitionToVotingPhase(participants, timerSeconds, playerData);
  });

  socket.on('voting_update', (message) => {
    console.log('📥 Received voting_update:', message);
    // TODO: Handle voting updates in later steps
  });

  socket.on('results', (message) => {
    console.log('📥 Received results:', message);
    // TODO: Handle results in later steps
  });
}

// Step 1D: Update waiting room UI
function updateWaitingRoomUI(currentCount, maxCount, participants, playerData) {
  console.log(`🎨 Step 1D - Updating UI: ${currentCount}/${maxCount}`);
  
  // Update the player counter
  const playerCounterElement = document.getElementById('player-counter');
  if (playerCounterElement) {
    playerCounterElement.textContent = `${currentCount}/${maxCount}`;
    console.log(`✅ Updated player counter to: ${currentCount}/${maxCount}`);
  } else {
    console.warn('⚠️ Could not find player-counter element');
  }
  
  // Update waiting message visibility
  const waitingMessageElement = document.querySelector('.waiting-message');
  if (waitingMessageElement) {
    if (currentCount < maxCount) {
      waitingMessageElement.style.display = 'block';
      console.log('✅ Showing waiting message');
    } else {
      // Room is full - this means we're about to enter voting phase
      console.log('🎯 Room is full! Waiting for voting phase...');
      // Keep waiting message visible until voting phase starts
    }
  } else {
    console.warn('⚠️ Could not find waiting-message element');
  }
  
  // Debug: Log our own participant data
  const ourParticipant = participants.find(p => p.playerId === playerData.playerId);
  if (ourParticipant) {
    console.log('✅ Found our participant in the list:', ourParticipant);
  } else {
    console.warn('⚠️ Could not find our participant in the list');
  }
  
  // Debug: Show all participants
  console.log('👥 All participants in room:');
  participants.forEach((participant, index) => {
    const isOurs = participant.playerId === playerData.playerId;
    console.log(`  ${index + 1}. ${participant.playerId} (cat: ${participant.catId})${isOurs ? ' ← YOU' : ''}`);
  });
}

// Step 2B: Transition from waiting room to voting phase
function transitionToVotingPhase(participants, timerSeconds, playerData) {
  console.log('🎨 Step 2B - Transitioning to voting phase...');
  
  // Hide waiting message
  const waitingMessageElement = document.querySelector('.waiting-message');
  if (waitingMessageElement) {
    waitingMessageElement.style.display = 'none';
    console.log('✅ Hidden waiting message');
  }
  
  // Show cat display area
  const catDisplayElement = document.querySelector('.cat-display');
  if (catDisplayElement) {
    catDisplayElement.style.display = 'flex'; // Use flex as defined in CSS
    console.log('✅ Showing cat display area');
  }
  
  // Show timer section
  const timerSectionElement = document.querySelector('.timer-section');
  if (timerSectionElement) {
    timerSectionElement.style.display = 'flex'; // Use flex as defined in CSS
    console.log('✅ Showing timer section');
  }
  
  // Step 2C: Populate stage bases with participant data
  populateStageBasesWithParticipants(participants, playerData);
  
  // Step 2D: Start countdown timer
  startCountdownTimer(timerSeconds);
  
  console.log('✅ Step 2B - Voting phase transition complete');
}

// Step 2C: Populate each stage base with participant data
function populateStageBasesWithParticipants(participants, playerData) {
  console.log('🎨 Step 2C - Populating stage bases...');
  
  const stageBases = document.querySelectorAll('.stage-base');
  
  participants.forEach((participant, index) => {
    if (index >= stageBases.length) {
      console.warn(`⚠️ Not enough stage bases for participant ${index + 1}`);
      return;
    }
    
    const stageBase = stageBases[index];
    const isOwnCat = participant.playerId === playerData.playerId && participant.catId === playerData.catId;
    
    console.log(`🎨 Step 2C - Populating stage ${index + 1}:`, participant, isOwnCat ? '(YOUR CAT)' : '');
    
    // Show real cat sprite using server data
    const catSprite = stageBase.querySelector('.cat-sprite');
    if (catSprite) {
      if (participant.catSpriteUrl) {
        catSprite.src = participant.catSpriteUrl;
        console.log(`✅ Set cat sprite URL for stage ${index + 1}:`, participant.catSpriteUrl.substring(0, 50) + '...');
      } else {
        // Fallback to placeholder if no sprite URL
        catSprite.src = '../assets/cat-placeholder.png';
        console.warn(`⚠️ No sprite URL for stage ${index + 1}, using placeholder`);
      }
      catSprite.style.display = 'block';
    }
    
    // Set cat name using server data
    const catNameElement = stageBase.querySelector('.cat-name');
    if (catNameElement) {
      catNameElement.textContent = participant.catName;
      console.log(`✅ Set cat name for stage ${index + 1}:`, participant.catName);
    }
    
    // Set username using server data  
    const usernameElement = stageBase.querySelector('.username');
    if (usernameElement) {
      usernameElement.textContent = participant.username;
      console.log(`✅ Set username for stage ${index + 1}:`, participant.username);
    }
    
    // TASK 3: Render worn items on top of cat sprite
    if (participant.wornItems && participant.wornItems.length > 0) {
      console.log(`👔 Stage ${index + 1} has ${participant.wornItems.length} worn items:`, participant.wornItems);
      renderWornItems(stageBase, participant.wornItems, index);
    } else {
      console.log(`ℹ️ Stage ${index + 1} has no worn items`);
    }
    
    // Mark own cat for special styling
    if (isOwnCat) {
      stageBase.classList.add('own-cat');
      console.log(`🏷️ Marked stage ${index + 1} as own cat`);
    }
    
    // Store participant data on the element for click handling
    stageBase.dataset.participantId = participant.playerId;
    stageBase.dataset.catId = participant.catId;
  });
  
  console.log('✅ Step 2C - Stage bases populated');
}

// Worn Items Renderer for fashion-show.js

// Function to render worn items on top of cat sprite
function renderWornItems(stageBase, wornItems, stageIndex) {
  console.log(`👔 TASK 3 - Rendering ${wornItems.length} worn items for stage ${stageIndex + 1}`);
  
  // Remove any existing worn item elements first
  const existingItems = stageBase.querySelectorAll('.worn-item');
  existingItems.forEach(item => item.remove());
  
  if (!wornItems || wornItems.length === 0) {
    console.log(`ℹ️ No worn items to render for stage ${stageIndex + 1}`);
    return;
  }
  
  // Get the cat sprite element as reference for positioning
  const catSprite = stageBase.querySelector('.cat-sprite');
  if (!catSprite) {
    console.warn(`⚠️ No cat sprite found for stage ${stageIndex + 1}, cannot render items`);
    return;
  }
  
  wornItems.forEach((item, itemIndex) => {
    console.log(`👔 Rendering item ${itemIndex + 1} for stage ${stageIndex + 1}:`, item);
    
    if (!item.spriteUrl) {
      console.warn(`⚠️ No sprite URL for item ${itemIndex + 1} on stage ${stageIndex + 1}`);
      return;
    }
    
    // Create worn item image element
    const wornItemElement = document.createElement('img');
    wornItemElement.src = item.spriteUrl;
    wornItemElement.alt = `${item.category} item`;
    wornItemElement.classList.add('worn-item', `worn-${item.category}`);
    
    // Position the worn item to overlay on the cat sprite
    // Use the same positioning as cat sprite but with higher z-index
    wornItemElement.style.position = 'absolute';
    wornItemElement.style.top = '80px'; // Same as cat sprite
    wornItemElement.style.left = '0';
    wornItemElement.style.width = '100%'; // Same width as cat sprite
    wornItemElement.style.height = 'auto'; // Maintain aspect ratio
    wornItemElement.style.zIndex = '10'; // Above cat sprite (cat sprite has default z-index)
    wornItemElement.style.pointerEvents = 'none'; // Don't interfere with clicking
    
    // Crisp pixel rendering (same as cat sprite)
    wornItemElement.style.imageRendering = 'pixelated';
    wornItemElement.style.imageRendering = '-moz-crisp-edges';
    wornItemElement.style.imageRendering = 'crisp-edges';
    
    // Add to stage base (same container as cat sprite)
    stageBase.appendChild(wornItemElement);
    
    console.log(`✅ Added ${item.category} item to stage ${stageIndex + 1}`);
  });
  
  console.log(`✅ Finished rendering worn items for stage ${stageIndex + 1}`);
}


// Step 2D: Start countdown timer
function startCountdownTimer(initialSeconds) {
  console.log('⏰ Step 2D - Starting countdown timer:', initialSeconds, 'seconds');
  
  const timerTextElement = document.getElementById('timer-text');
  if (!timerTextElement) {
    console.warn('⚠️ Timer text element not found');
    return;
  }
  
  let remainingSeconds = initialSeconds;
  
  // Update timer display immediately
  timerTextElement.textContent = `${remainingSeconds} s`;
  
  // Start countdown
  const timerInterval = setInterval(() => {
    remainingSeconds--;
    timerTextElement.textContent = `${remainingSeconds} s`;
    
    console.log(`⏰ Timer: ${remainingSeconds}s remaining`);
    
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      console.log('⏰ Timer reached zero');
      // Note: Server handles timeout logic, client just displays
    }
  }, 1000);
  
  console.log('✅ Step 2D - Countdown timer started');
}

// Handle page unload - disconnect socket
window.addEventListener('beforeunload', () => {
  console.log('🔌 Page unloading - will disconnect socket');
});  