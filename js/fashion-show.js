import { APP_URL } from './core/config.js';
import { getAuthToken } from './core/auth/authentication.js';
import { getPlayerCats } from './core/storage.js';

console.log("🎭 Fashion Show - using APP_URL:", APP_URL);

// Global voting state
let isVotingActive = false;
let selectedCatId = null;
let currentSocket = null;
let currentPlayerData = null;

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

  // Setup results buttons
  setupResultsButtons();

  // Initialize socket
  initializeSocket(playerData);
});

function initializeSocket(playerData) {
  console.log('🔧 Initializing socket connection...');
  
  const authToken = getAuthToken();
  const socket = io(APP_URL, {
    auth: { token: authToken }
  });

  // Store socket reference globally for voting
  currentSocket = socket;
  currentPlayerData = playerData;

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
    disableVotingInteractions(); // Disable voting when disconnected
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

  // Voting updates (when someone votes)
  socket.on('voting_update', (message) => {
    console.log('📥 Received voting_update:', message);
    
    const { participants } = message;
    
    // Count how many have voted
    const votedCount = participants.filter(p => p.votedCatId).length;
    const totalCount = participants.length;
    
    console.log(`🗳️ Voting progress: ${votedCount}/${totalCount} participants have voted`);
  });

  // Calculating announcement
    socket.on('calculating_announcement', (message) => {
    console.log('📥 Received calculating_announcement:', message);
    showCalculatingScreen(message.message);
  });

  // Final results
  socket.on('results', (message) => {
    console.log('📥 Received results:', message);
    
    const { participants } = message;
    console.log('🏆 Final results received:');
    participants.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.catName} (${p.username}): ${p.votesReceived} votes = ${p.coinsEarned} coins`);
    });
    
    // Show results screen
    showResultsScreen(participants);
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
    
    // Store participant data for click handling - IMPORTANT!
    stageBase.dataset.participantId = participant.playerId.toString();
    stageBase.dataset.catId = participant.catId.toString();
    
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
    
    // Clear any previous voting-related classes
    stageBase.classList.remove('own-cat', 'selected', 'own-cat-selected');
    
    console.log(`✅ Stage ${index + 1} populated with data attributes: playerId=${participant.playerId}, catId=${participant.catId}`);
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
    
  console.log(`⏰ Timer started at ${new Date().toLocaleTimeString()}`);
  console.log(`⏰ Timer will end at ${new Date(Date.now() + initialSeconds * 1000).toLocaleTimeString()}`);

  const timerInterval = setInterval(() => {
    remainingSeconds--;
    timerTextElement.textContent = `${remainingSeconds} s`;
    
    // Log significant timer events
    if (remainingSeconds === 30) {
      console.log('⏰ 30 seconds remaining');
    } else if (remainingSeconds === 10) {
      console.log('⏰ 10 seconds remaining - voting will end soon!');
    } else if (remainingSeconds <= 5 && remainingSeconds > 0) {
      console.log(`⏰ ${remainingSeconds} seconds remaining`);
    }
    
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      console.log(`⏰ TIMER ENDED at ${new Date().toLocaleTimeString()}`);
      console.log('⏰ Server should now be calculating votes...');
      
      // Hide timer and show waiting message
      const timerSection = document.querySelector('.timer-section');
      if (timerSection) {
        timerSection.style.display = 'none';
      }
    }
  }, 1000);
  
  console.log('✅ Countdown timer started');
}

// Enable voting interactions
function enableVotingInteractions(socket, playerData) {
  console.log('🗳️ Enabling voting interactions');
  
  isVotingActive = true;
  currentSocket = socket;
  currentPlayerData = playerData;
  
  // Add voting-active class to cat display
  const catDisplay = document.querySelector('.cat-display');
  if (catDisplay) {
    catDisplay.classList.add('voting-active');
    console.log('✅ Added voting-active class to cat display');
  }
  
  // Add click handlers and mark own cat
  const stageBases = document.querySelectorAll('.stage-base');
  stageBases.forEach((stageBase, index) => {
    // Remove any existing event listeners
    stageBase.removeEventListener('click', handleStageClick);
    stageBase.removeEventListener('mouseenter', handleStageMouseEnter);
    stageBase.removeEventListener('mouseleave', handleStageMouseLeave);
    
    // Check if this is the player's own cat
    const targetCatId = parseInt(stageBase.dataset.catId);
    const targetPlayerId = stageBase.dataset.participantId;
    const isOwnCat = (targetCatId === currentPlayerData.catId && 
                     targetPlayerId === currentPlayerData.playerId.toString());
    
    if (isOwnCat) {
      stageBase.classList.add('own-cat');
      console.log(`🚫 Stage ${index + 1} marked as own cat (non-votable)`);
    } else {
      stageBase.classList.remove('own-cat');
    }
    
    // Add event listeners
    stageBase.addEventListener('click', handleStageClick);
    stageBase.addEventListener('mouseenter', handleStageMouseEnter);
    stageBase.addEventListener('mouseleave', handleStageMouseLeave);
    
    console.log(`✅ Added interaction handlers to stage ${index + 1}`);
  });
  
  console.log('✅ Voting interactions enabled');
}

// Handle mouse enter for hover effects
function handleStageMouseEnter(event) {
  if (!isVotingActive) return;
  
  const stageBase = event.currentTarget;
  const targetCatId = parseInt(stageBase.dataset.catId);
  const targetPlayerId = stageBase.dataset.participantId;
  
  // Check if this is own cat
  const isOwnCat = (targetCatId === currentPlayerData.catId && 
                   targetPlayerId === currentPlayerData.playerId.toString());
  
  if (isOwnCat) {
    console.log('🚫 Hovering over own cat');
  } else {
    console.log(`👆 Hovering over votable cat ${targetCatId}`);
  }
}

// Handle mouse leave
function handleStageMouseLeave(event) {
  // CSS handles the hover state removal automatically
}

// Handle clicking on a stage base to vote
function handleStageClick(event) {
  if (!isVotingActive) {
    console.log('⚠️ Voting not active - ignoring click');
    return;
  }
  
  const stageBase = event.currentTarget;
  const targetCatId = parseInt(stageBase.dataset.catId);
  const targetPlayerId = stageBase.dataset.participantId;
  
  console.log(`🖱️ Clicked on stage - Player: ${targetPlayerId}, Cat: ${targetCatId}`);
  
  // Check if clicking on own cat
  const isOwnCat = (targetCatId === currentPlayerData.catId && 
                   targetPlayerId === currentPlayerData.playerId.toString());
  
  if (isOwnCat) {
    console.log('❌ Cannot vote for own cat - showing warning');
    showSelfVoteWarning(stageBase);
    return;
  }
  
  // Valid vote - update selection
  console.log(`✅ Valid vote for cat ${targetCatId}`);
  selectCat(targetCatId, stageBase);
  
  // Send vote to server
  if (currentSocket && currentSocket.connected) {
    console.log(`📤 Sending vote to server: ${targetCatId}`);
    currentSocket.emit('vote', {
      type: 'vote',
      votedCatId: targetCatId
    });
  } else {
    console.error('❌ Cannot send vote - socket not connected');
  }
}

// Select a cat visually and update state
function selectCat(catId, stageBase) {
  console.log(`🎯 Selecting cat ${catId}`);
  
  // Remove previous selection from all stages
  const allStageBases = document.querySelectorAll('.stage-base');
  allStageBases.forEach(stage => {
    stage.classList.remove('selected');
  });
  
  // Add selection to new stage
  stageBase.classList.add('selected');
  
  // Update selected state
  selectedCatId = catId;
  
  console.log(`✅ Cat ${catId} selected visually`);
}

// Show warning for voting on own cat with enhanced animation
function showSelfVoteWarning(stageBase) {
  console.log('⚠️ Showing self-vote warning');
  
  // Add error class to own cat (triggers shake animation)
  stageBase.classList.add('own-cat-selected');
  
  // Show warning message
  const warningElement = document.querySelector('.warning-message');
  if (warningElement) {
    warningElement.style.display = 'block';
    console.log('🚨 Warning message displayed');
  }
  
  // Remove warning after 3 seconds
  setTimeout(() => {
    stageBase.classList.remove('own-cat-selected');
    if (warningElement) {
      warningElement.style.display = 'none';
    }
    console.log('✅ Self-vote warning cleared');
  }, 3000);
}

// Disable voting interactions
function disableVotingInteractions() {
  console.log('🚫 Disabling voting interactions');
  
  isVotingActive = false;
  
  // Remove voting-active class
  const catDisplay = document.querySelector('.cat-display');
  if (catDisplay) {
    catDisplay.classList.remove('voting-active');
  }
  
  // Remove event listeners and clean up classes
  const stageBases = document.querySelectorAll('.stage-base');
  stageBases.forEach(stageBase => {
    stageBase.removeEventListener('click', handleStageClick);
    stageBase.removeEventListener('mouseenter', handleStageMouseEnter);
    stageBase.removeEventListener('mouseleave', handleStageMouseLeave);
    
    // Keep selection but remove hover states
    stageBase.classList.remove('own-cat-selected');
  });
  
  console.log('✅ Voting interactions disabled');
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
  
  // Enable voting interactions
  enableVotingInteractions(currentSocket, playerData);
  
  console.log('✅ Voting phase transition complete');
}

function showCalculatingScreen(message) {
  console.log('🧮 Showing calculating votes screen');
  
  // Disable voting interactions
  disableVotingInteractions();
  
  // Hide voting elements
  const catDisplay = document.querySelector('.cat-display');
  const timerSection = document.querySelector('.timer-section');
  const warningMessage = document.querySelector('.warning-message');
  
  if (catDisplay) catDisplay.style.display = 'none';
  if (timerSection) timerSection.style.display = 'none';
  if (warningMessage) warningMessage.style.display = 'none';
  
  // Show announcement
  const announcementElement = document.querySelector('.announcement-text');
  if (announcementElement) {
    announcementElement.textContent = message;
    announcementElement.style.display = 'block';
    console.log('✅ Showing announcement:', message);
  } else {
    console.warn('⚠️ Announcement element not found');
  }
}

// Show final results with coin rewards (no repositioning)
function showResultsScreen(participants) {
  console.log('🏆 Showing results screen - keeping original positions');
  
  // Hide calculating announcement
  const announcementElement = document.querySelector('.announcement-text');
  if (announcementElement) {
    announcementElement.style.display = 'none';
  }
  
  // Log results without sorting (for debugging)
  console.log('📊 Final results by stage:');
  participants.forEach((p, index) => {
    console.log(`  Stage ${index + 1}: ${p.catName} - ${p.votesReceived} votes (${p.coinsEarned} coins)`);
  });
  
  // Transform cat display to results mode (no repositioning)
  transformToResultsMode(participants);
  
  // Show results buttons
  const resultsButtons = document.querySelector('.results-buttons');
  if (resultsButtons) {
    resultsButtons.style.display = 'flex';
    console.log('✅ Results buttons shown');
  }
  
  console.log('🎉 Results screen complete - cats stay in original positions');
}

// Transform the cat display to show results with gold bases (NO repositioning)
function transformToResultsMode(participants) {
  console.log('🎨 Transforming to results mode - keeping original positions');
  
  const catDisplay = document.querySelector('.cat-display');
  if (catDisplay) {
    catDisplay.style.display = 'flex'; // Ensure it's visible
    catDisplay.classList.add('showing-results');
  }
  
  const stageBases = document.querySelectorAll('.stage-base');
  
  // First, reset all stage bases
  stageBases.forEach((stageBase, index) => {
    // Add results mode class
    stageBase.classList.add('results-mode');
    
    // Hide results elements initially
    const goldBase = stageBase.querySelector('.gold-base');
    const rewardText = stageBase.querySelector('.reward-text');
    
    if (goldBase) goldBase.style.display = 'none';
    if (rewardText) rewardText.style.display = 'none';
    
    console.log(`🎨 Reset stage ${index + 1} for results mode`);
  });
  
  // Find the maximum votes for scaling
  const maxVotes = Math.max(1, Math.max(...participants.map(p => p.votesReceived)));
  console.log(`📊 Maximum votes received: ${maxVotes}`);
  
  // Update each stage base with its ORIGINAL participant (no repositioning)
  stageBases.forEach((stageBase, stageIndex) => {
    // Get the participant data from the stage's data attributes
    const participantId = stageBase.dataset.participantId;
    const catId = parseInt(stageBase.dataset.catId);
    
    // Find this participant in the results data
    const participant = participants.find(p => 
      p.playerId.toString() === participantId && p.catId === catId
    );
    
    if (!participant) {
      console.warn(`⚠️ No participant found for stage ${stageIndex + 1}`);
      return;
    }
    
    console.log(`🎨 Updating stage ${stageIndex + 1} with ${participant.catName} (${participant.votesReceived} votes)`);
    
    const goldBase = stageBase.querySelector('.gold-base');
    const rewardText = stageBase.querySelector('.reward-text');
    const catSprite = stageBase.querySelector('.cat-sprite');
    
    // Calculate gold base height based on votes (min 20px, max 200px)
    const maxHeight = 200;
    const minHeight = 20;
    const voteRatio = participant.votesReceived / maxVotes;
    const goldHeight = Math.max(minHeight, Math.floor(voteRatio * maxHeight));
    
    // Show and position gold base
    if (goldBase) {
      goldBase.style.display = 'block';
      goldBase.style.height = `${goldHeight}px`;
      goldBase.style.bottom = '100px'; // Sits on top of brown base
      console.log(`💰 Stage ${stageIndex + 1} gold base: ${goldHeight}px (${participant.votesReceived} votes)`);
    }
    
    // Position cat sprite on top of gold base (keep existing sprite)
    if (catSprite) {
      catSprite.style.display = 'block';
      catSprite.classList.add('results-cat');
      
      // Position cat on top of gold base
      const catTopPosition = 100 + goldHeight; // Brown base height + gold base height
      catSprite.style.bottom = `${catTopPosition}px`;
      catSprite.style.top = 'auto'; // Reset top positioning
      
      console.log(`🐱 Stage ${stageIndex + 1} cat positioned at ${catTopPosition}px from bottom`);
    }
    
    // Render worn items in results mode
    if (participant.wornItems && participant.wornItems.length > 0) {
      renderWornItemsResults(stageBase, participant.wornItems, goldHeight);
    }
    
    // Show reward text (no ranking emojis, just coins)
    if (rewardText) {
      rewardText.textContent = `${participant.votesReceived} votes = ${participant.coinsEarned} coins`;
      rewardText.style.display = 'block';
      console.log(`💰 Stage ${stageIndex + 1} reward text: ${rewardText.textContent}`);
    }
    
    console.log(`✅ Stage ${stageIndex + 1} updated with results (staying in original position)`);
  });
  
  console.log('🎨 Results mode transformation complete - no repositioning');
}

// Render worn items in results mode (positioned on cat in results)
function renderWornItemsResults(stageBase, wornItems, goldHeight) {
  console.log(`👔 Rendering worn items in results mode`);
  
  // Remove existing worn items
  const existingItems = stageBase.querySelectorAll('.worn-item');
  existingItems.forEach(item => item.remove());
  
  if (!wornItems || wornItems.length === 0) {
    return;
  }
  
  wornItems.forEach((item, itemIndex) => {
    if (!item.spriteUrl) {
      console.warn(`⚠️ No sprite URL for item ${itemIndex + 1} in results mode`);
      return;
    }
    
    // Create worn item element
    const wornItemElement = document.createElement('img');
    wornItemElement.src = item.spriteUrl;
    wornItemElement.alt = `${item.category} item`;
    wornItemElement.classList.add('worn-item', `worn-${item.category}`, 'results-worn-item');
    
    // Position over cat sprite in results mode
    wornItemElement.style.position = 'absolute';
    wornItemElement.style.bottom = `${100 + goldHeight}px`; // Same as cat sprite
    wornItemElement.style.left = '50%';
    wornItemElement.style.transform = 'translateX(-50%)';
    wornItemElement.style.width = '149px'; // Same as gold base width
    wornItemElement.style.height = 'auto';
    wornItemElement.style.zIndex = '12'; // Above cat sprite in results
    wornItemElement.style.pointerEvents = 'none';
    
    // Crisp pixel rendering
    wornItemElement.style.imageRendering = 'pixelated';
    wornItemElement.style.imageRendering = '-moz-crisp-edges';
    wornItemElement.style.imageRendering = 'crisp-edges';
    
    stageBase.appendChild(wornItemElement);
  });
  
  console.log(`✅ Rendered worn items in results mode`);
}

  // Setup results buttons
function setupResultsButtons() {
  const playAgainBtn = document.getElementById('play-again-btn');
  const goHomeBtn = document.getElementById('go-home-btn');
  
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('🔄 Play Again clicked - reloading page');
      window.location.reload(); // Simple implementation - reload page to restart
    });
  }
  
  if (goHomeBtn) {
    goHomeBtn.addEventListener('click', (e) => {
      console.log('🏠 Go Home clicked');
      // Let the default link behavior handle navigation to album.html
    });
  }
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  console.log('🔌 Page unloading - will disconnect socket');
});