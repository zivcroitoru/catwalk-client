import { APP_URL } from './core/config.js';
import { getAuthToken } from './core/auth/authentication.js';
import { getPlayerCats } from './core/storage.js';
import { 
  toastFashionShowReward,
  toastFashionShowEarlyQuit, 
  toastFashionShowConnection,
  toastFashionShowError 
} from './core/toast.js';

console.log("Fashion Show - using APP_URL:", APP_URL);

// Global state management for the fashion show game
let isVotingActive = false;
let selectedCatId = null;
let currentSocket = null;
let currentPlayerData = null;

// Game phase tracking ('waiting', 'voting', 'results')
let currentGamePhase = 'waiting';

// Connection monitoring for quality detection
let connectionQualityTimer = null;
let lastHeartbeatTime = Date.now();

// Toast notification functions with proper error handling

/**
 * Shows vote confirmation toast when user casts or changes vote
 * Local implementation for immediate feedback
 */
function showVoteCastToast(catName, isChange = false) {
  const message = isChange ? 
    `Vote changed to ${catName}!` : 
    `Voted for ${catName}!`;
    
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration: 2000,
      gravity: "top",
      position: "right",
      style: {
        border: '3px solid #000',
        boxShadow: '4px 4px 0px #000',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '12px',
        padding: '16px',
        zIndex: 999999,
        background: '#2196f3',
        color: '#000'
      }
    }).showToast();
  }
}

/**
 * Delegates connection status toasts to imported function
 */
function showConnectionToast(status, message = '') {
  toastFashionShowConnection(status, message);
}

/**
 * Shows error toasts with validation
 */
function showErrorToast(errorMessage, severity = 'error') {
  if (typeof errorMessage !== 'string' || errorMessage.trim() === '') {
    console.error('Invalid error message for toast');
    return;
  }
  
  toastFashionShowError(errorMessage, severity);
}

/**
 * Shows reward toast for coins earned
 */
function showRewardToast(coinsEarned, votesReceived) {
  if (typeof coinsEarned !== 'number' || typeof votesReceived !== 'number') {
    console.error('Invalid toast parameters:', { coinsEarned, votesReceived });
    return;
  }
  
  // Only show if coins earned
  if (coinsEarned <= 0) {
    return;
  }

  toastFashionShowReward(coinsEarned, votesReceived);
}

/**
 * Shows early quit warning toast
 */
function showEarlyQuitToast() {
  toastFashionShowEarlyQuit();
}

// Debugging and validation helper functions

/**
 * Validates coin calculation for debugging purposes
 * Expected formula: votesReceived * 25 = coinsEarned
 */
function validateCoinCalculation(votesReceived, coinsEarned) {
  const expectedCoins = votesReceived * 25;
  
  if (coinsEarned !== expectedCoins) {
    console.error(`CLIENT VALIDATION FAILED:`);
    console.error(`   Votes: ${votesReceived}, Expected: ${expectedCoins}, Actual: ${coinsEarned}`);
    return false;
  }
  
  if (coinsEarned % 25 !== 0) {
    console.error(`CLIENT VALIDATION FAILED: Coins not multiple of 25: ${coinsEarned}`);
    return false;
  }
  
  return true;
}

/**
 * Enhanced logging for toast debugging and result validation
 */
function logToastDebugInfo(toastData, participants) {
  console.log('TOAST DEBUG INFO:');
  console.log('='.repeat(40));
  
  if (toastData) {
    console.log('Toast Data Received:', toastData);
    
    if (toastData.coinsEarned && toastData.votesReceived) {
      const isValid = validateCoinCalculation(toastData.votesReceived, toastData.coinsEarned);
      console.log(`   Calculation Valid: ${isValid}`);
    }
  } else {
    console.log('No toast data received from server');
  }
  
  // Find our participant in the results
  const ourParticipant = participants.find(p => 
    p.playerId === currentPlayerData?.playerId && p.catId === currentPlayerData?.catId
  );
  
  if (ourParticipant) {
    console.log('Our Participant Results:', ourParticipant);
    
    if (ourParticipant.coinsEarned && ourParticipant.votesReceived) {
      const isValid = validateCoinCalculation(ourParticipant.votesReceived, ourParticipant.coinsEarned);
      console.log(`   Calculation Valid: ${isValid}`);
    }
  } else {
    console.log('Could not find our participant in results');
  }
  
  console.log('='.repeat(40));
}

/**
 * Centralized error handler with context-aware messaging
 */
function handleFashionShowError(error, context = 'Unknown') {
  console.error(`Fashion Show Error in ${context}:`, error);
  
  let userMessage = 'An unexpected error occurred';
  let severity = 'error';
  
  // Customize message based on error type
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    userMessage = 'Network connection problem';
    severity = 'warning';
  } else if (error.message?.includes('invalid') || error.message?.includes('not found')) {
    userMessage = 'Invalid game data - please restart';
    severity = 'error';
  } else if (error.message?.includes('timeout')) {
    userMessage = 'Connection timeout - please try again';
    severity = 'warning';
  }
  
  showErrorToast(userMessage, severity);
  
  // Critical error handling with user confirmation
  if (context === 'Critical' || error.message?.includes('auth')) {
    setTimeout(() => {
      if (confirm('A serious error occurred. Return to main page?')) {
        navigateHome();
      }
    }, 2000);
  }
}

/**
 * Main initialization when DOM loads
 * Validates user state and initializes the fashion show
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Fashion Show page DOM loaded');
    
    setupExitConfirmationDialog();

    // Validate user authentication
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No userId in localStorage - user must be logged in');
      showErrorToast('Please log in to access the fashion show', 'error');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }

    // Validate cat selection from URL
    const urlParams = new URLSearchParams(window.location.search);
    const catIdFromUrl = urlParams.get('catId');
    if (!catIdFromUrl) {
      console.error('No catId provided in URL');
      showErrorToast('No cat selected for fashion show', 'error');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }
    const catId = parseInt(catIdFromUrl);

    // Get username with fallback
    let username = 'Unknown Player';
    try {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        username = storedUsername;
      } else {
        username = `Player_${userId}`;
        console.log('No stored username, using fallback:', username);
      }
    } catch (err) {
      console.warn('Could not get username, using fallback:', username);
    }

    // Get cat name with fallback
    let catName = `Cat_${catId}`;
    try {
      console.log('Fetching user cats...');
      const userCats = await getPlayerCats();

      const selectedCat = userCats.find(cat => cat.id === catId);
      if (selectedCat && selectedCat.name) {
        catName = selectedCat.name;
      } else {
        console.warn('Cat not found in user cats, using fallback name');
      }
    } catch (err) {
      console.warn('Could not fetch cat data, using fallback:', err);
    }

    const playerData = {
      playerId: userId,
      username: username,
      catId: catId,
      catName: catName
    };
    console.log('Player data ready:', playerData);

    // Setup UI components
    setupResultsButtons();
    
    // Initialize socket connection
    initializeSocket(playerData);

  } catch (err) {
    handleFashionShowError(err, 'Initialization');
  }
});

/**
 * Sets up exit confirmation dialog with phase-based behavior
 * Different behavior based on current game phase
 */
function setupExitConfirmationDialog() {
  console.log('Setting up exit confirmation dialog');

  const albumButton = document.querySelector('.album-button');
  const exitOverlay = document.getElementById('exit-overlay');
  const exitDialog = document.getElementById('exit-dialog');
  const stayButton = document.getElementById('stay-btn');
  const leaveButton = document.getElementById('leave-btn');

  if (!albumButton || !exitOverlay || !exitDialog || !stayButton || !leaveButton) {
    console.warn('Exit dialog elements not found');
    return;
  }

  // Handle back arrow click based on current game phase
  albumButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(`Back arrow clicked during ${currentGamePhase} phase`);
    
    if (currentGamePhase === 'waiting') {
      // Direct navigation during waiting room
      navigateHome();
    } else if (currentGamePhase === 'voting') {
      // Show confirmation dialog during voting phase
      showExitDialog();
    }
    // Results phase: back arrow is hidden
  });

  // Hide dialog when clicking outside
  exitOverlay.addEventListener('click', (e) => {
    if (e.target === exitOverlay) {
      hideExitDialog();
    }
  });

  // Hide dialog when "No, I changed my mind" is clicked
  stayButton.addEventListener('click', () => {
    hideExitDialog();
  });

  // Navigate home when "Yes, I'm sure" is clicked
  leaveButton.addEventListener('click', () => {
    navigateHome();
  });

  console.log('Exit confirmation dialog setup complete');
}

/**
 * Updates game phase and manages back arrow visibility
 * Cleans up dialogs when entering results phase
 */
function setGamePhase(phase) {
  console.log(`Game phase changed: ${currentGamePhase} → ${phase}`);
  currentGamePhase = phase;
  
  const albumButton = document.querySelector('.album-button');
  if (!albumButton) {
    console.warn('Album button not found when setting game phase');
    return;
  }
  
  switch (phase) {
    case 'waiting':
      albumButton.style.display = 'flex'; // Show back arrow
      break;
      
    case 'voting':
      albumButton.style.display = 'flex'; // Show back arrow
      break;
      
    case 'results':
      albumButton.style.display = 'none'; // Hide back arrow
      hideExitDialog(); // Clean up exit dialog
      break;
      
    default:
      console.warn(`Unknown game phase: ${phase}`);
  }
}

/**
 * Shows exit confirmation dialog
 */
function showExitDialog() {
  const exitOverlay = document.getElementById('exit-overlay');
  if (exitOverlay) {
    exitOverlay.style.display = 'flex';
  }
}

/**
 * Hides exit confirmation dialog
 */
function hideExitDialog() {
  const exitOverlay = document.getElementById('exit-overlay');
  if (exitOverlay) {
    exitOverlay.style.display = 'none';
  }
}

/**
 * Navigates to home/album page with early quit warning if appropriate
 */
function navigateHome() {
  // Show early quit warning if leaving during voting
  if (currentGamePhase === 'voting') {
    showEarlyQuitToast();
    
    setTimeout(() => {
      if (currentSocket && currentSocket.connected) {
        currentSocket.disconnect();
      }
      window.location.href = 'album.html';
    }, 1500); // Brief delay to show toast
  } else {
    // Normal navigation for waiting/results phases
    if (currentSocket && currentSocket.connected) {
      currentSocket.disconnect();
    }
    
    window.location.href = 'album.html';
  }
}

/**
 * Initializes socket connection with comprehensive error handling
 * Sets up all socket event listeners
 */
function initializeSocket(playerData) {
  console.log('Initializing socket connection...');

  const authToken = getAuthToken();
  const socket = io(APP_URL, {
    auth: { token: authToken }
  });

  currentSocket = socket;
  currentPlayerData = playerData;

  // Socket connect handler
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    
    showConnectionToast('connected');
    startConnectionMonitoring();

    const joinMessage = {
      playerId: playerData.playerId,
      catId: playerData.catId
    };
    console.log('Sending join message:', joinMessage);
    socket.emit('join', joinMessage);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connect_error:', err);
    showConnectionToast('error', 'Failed to connect to fashion show');
  });

  // Socket disconnect handler
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    disableVotingInteractions();
    stopConnectionMonitoring();
    
    // Show disconnection toast (but not if intentional navigation)
    if (reason !== 'client namespace disconnect' && reason !== 'io client disconnect') {
      showConnectionToast('disconnected');
      
      // Try to reconnect after brief delay
      setTimeout(() => {
        if (!currentSocket.connected) {
          showConnectionToast('reconnecting');
        }
      }, 2000);
    }
  });
  
  // Handle reconnection success
  socket.on('reconnect', () => {
    console.log('Socket reconnected');
    showConnectionToast('connected');
  });

  // Centralized server error handling
  socket.on('error', (errorData) => {
    console.error('Server error:', errorData);
    
    let severity = errorData.severity || 'error';
    let message = errorData.message || 'An unknown error occurred';
    
    showErrorToast(message, severity);
    
    // Handle specific error types with appropriate navigation
    switch (errorData.type) {
      case 'ownership_error':
      case 'validation_error':
      case 'data_loading_error':
        // Critical errors - navigate home after delay
        setTimeout(() => {
          console.log('Navigating home due to critical error');
          window.location.href = 'album.html';
        }, 3000);
        break;
        
      case 'room_full':
        setTimeout(() => {
          window.location.href = 'album.html';
        }, 4000);
        break;
        
      case 'duplicate_join':
        setTimeout(() => {
          window.location.href = 'album.html';
        }, 2000);
        break;
        
      case 'vote_error':
      case 'vote_too_late':
        // Vote errors - just show toast, don't navigate
        break;
        
      default:
        // Unknown errors - offer to go home
        setTimeout(() => {
          if (confirm('An error occurred. Return to main page?')) {
            window.location.href = 'album.html';
          }
        }, 3000);
    }
  });

  // Handle vote confirmation from server
  socket.on('vote_confirmed', (data) => {
    console.log('Vote confirmed by server:', data);
    
    const targetParticipant = document.querySelector(`[data-cat-id="${data.votedCatId}"]`);
    const catNameElement = targetParticipant?.querySelector('.cat-name');
    const catName = catNameElement?.textContent || `Cat ${data.votedCatId}`;
    
    // Check if this is a vote change
    const isChange = selectedCatId !== null && selectedCatId !== data.votedCatId;
    
    showVoteCastToast(catName, isChange);
  });

  // Handle heartbeat for connection monitoring
  socket.on('heartbeat', (data) => {
    lastHeartbeatTime = Date.now();
    
    // Respond to server heartbeat
    socket.emit('heartbeat_response', { 
      timestamp: data.timestamp,
      clientTime: Date.now()
    });
  });

  // Waiting room participant updates
  socket.on('participant_update', (message) => {
    console.log('Received participant_update:', message);

    const { participants, maxCount } = message;
    const currentCount = participants.length;

    console.log(`Waiting room: ${currentCount}/${maxCount} participants`);
    updateWaitingRoomUI(currentCount, maxCount, participants, playerData);
  });

  // Voting phase transition
  socket.on('voting_phase', (message) => {
    console.log('Received voting_phase:', message);

    const { participants, timerSeconds } = message;
    console.log(`Entering voting phase with ${participants.length} participants, timer: ${timerSeconds}s`);

    transitionToVotingPhase(participants, timerSeconds, playerData);
  });

  // Voting updates (when someone votes)
  socket.on('voting_update', (message) => {
    console.log('Received voting_update:', message);

    const { participants } = message;

    // Count how many have voted
    const votedCount = participants.filter(p => p.votedCatId).length;
    const totalCount = participants.length;

    console.log(`Voting progress: ${votedCount}/${totalCount} participants have voted`);
  
    // Update the progress message with current vote count
    showVotingProgressMessage(votedCount, totalCount);
  });

  // Calculating announcement
  socket.on('calculating_announcement', (message) => {
    console.log('Received calculating_announcement:', message);
    showCalculatingScreen(message.message);
  });

  // Results with enhanced toast data processing
  socket.on('results', (message) => {
    console.log('Received results:', message);

    const { participants, toastData } = message;
    
    // Log results for debugging
    console.log('Final results received:');
    participants.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.catName} (${p.username}): ${p.votesReceived} votes = ${p.coinsEarned} coins`);
    });

    // Process toast data with validation and debug logging
    logToastDebugInfo(toastData, participants);

    if (toastData) {
      console.log('Processing toast data from server:', toastData);
      
      // Validate toast data structure
      if (typeof toastData.success === 'boolean') {
        if (toastData.success && !toastData.skipped) {
          // Successful coin update - show reward toast
          const coinsEarned = toastData.coinsEarned || 0;
          const votesReceived = toastData.votesReceived || 0;
          
          console.log(`Showing reward toast: ${votesReceived} votes = ${coinsEarned} coins`);
          showRewardToast(coinsEarned, votesReceived);
          
        } else if (toastData.success && toastData.skipped) {
          // Skipped update (dummy participant or zero coins)
          console.log(`Coin update skipped: ${toastData.reason}`);
          
          if (toastData.reason === 'dummy_participant') {
            showErrorToast('You disconnected during the game - no coins awarded', 'warning');
          }
          
        } else {
          // Failed coin update
          console.error('Coin update failed:', toastData.error);
          
          // Show appropriate error message based on error type
          let errorMessage = 'Failed to award coins - please contact support';
          
          if (toastData.error === 'dummy_participant') {
            errorMessage = 'No coins awarded - you disconnected during the game';
          } else if (toastData.error?.includes('invalid_coin_amount')) {
            errorMessage = 'Invalid coin calculation - please report this bug';
          } else if (toastData.error === 'player_not_found') {
            errorMessage = 'Player account not found - please contact support';
          } else if (toastData.error === 'database_error') {
            errorMessage = 'Database error - coins may not have been awarded';
          }
          
          showErrorToast(errorMessage, 'error');
        }
      } else {
        console.warn('Invalid toast data structure received from server');
        showErrorToast('Results received but coin status unknown', 'info');
      }
    } else {
      // No toast data from server - this shouldn't happen
      console.warn('No toast data received from server');
      showErrorToast('Results received but coin status unknown', 'info');
    }

    // Show results screen regardless of coin status
    showResultsScreen(participants);
  });
}

// Connection quality monitoring functions

/**
 * Starts monitoring connection quality via heartbeat tracking
 */
function startConnectionMonitoring() {
  if (connectionQualityTimer) {
    clearInterval(connectionQualityTimer);
  }
  
  lastHeartbeatTime = Date.now();
  
  // Check connection quality every 10 seconds
  connectionQualityTimer = setInterval(() => {
    const timeSinceLastHeartbeat = Date.now() - lastHeartbeatTime;
    
    // If no heartbeat for more than 45 seconds, connection might be poor
    if (timeSinceLastHeartbeat > 45000) {
      console.warn('Poor connection detected - no heartbeat for', timeSinceLastHeartbeat, 'ms');
      
      if (currentSocket && !currentSocket.connected) {
        showConnectionToast('disconnected');
      } else {
        showErrorToast('Connection quality is poor', 'warning');
      }
    }
  }, 10000);
}

/**
 * Stops connection quality monitoring
 */
function stopConnectionMonitoring() {
  if (connectionQualityTimer) {
    clearInterval(connectionQualityTimer);
    connectionQualityTimer = null;
  }
}

/**
 * Updates waiting room UI with participant count and status
 */
function updateWaitingRoomUI(currentCount, maxCount, participants, playerData) {
  console.log(`Updating waiting room UI: ${currentCount}/${maxCount}`);

  setGamePhase('waiting');

  const playerCounterElement = document.getElementById('player-counter');
  if (playerCounterElement) {
    playerCounterElement.textContent = `${currentCount}/${maxCount}`;
  }

  const waitingMessageElement = document.querySelector('.waiting-message');
  if (waitingMessageElement) {
    if (currentCount < maxCount) {
      waitingMessageElement.style.display = 'block';
    } else {
      console.log('Room is full! Waiting for voting phase...');
    }
  }

  // Debug: Check if we're in the participant list
  const ourParticipant = participants.find(p => p.playerId === playerData.playerId);
  if (!ourParticipant) {
    console.warn('Could not find our participant in the list');
  }

  // Debug: Show all participants
  console.log('All participants in room:');
  participants.forEach((participant, index) => {
    const isOurs = participant.playerId === playerData.playerId;
    console.log(`  ${index + 1}. ${participant.playerId} (cat: ${participant.catId})${isOurs ? ' ← YOU' : ''}`);
  });
}

/**
 * Populates stage bases with participant data for display
 * Sets up data attributes for click handling
 */
function populateStageBasesWithParticipants(participants, playerData) {
  console.log('Populating stage bases...');

  const stageBases = document.querySelectorAll('.stage-base');

  participants.forEach((participant, index) => {
    if (index >= stageBases.length) {
      console.warn(`Not enough stage bases for participant ${index + 1}`);
      return;
    }

    const stageBase = stageBases[index];
    const isOwnCat = participant.playerId === playerData.playerId && participant.catId === playerData.catId;

    console.log(`Populating stage ${index + 1}:`, participant, isOwnCat ? '(YOUR CAT)' : '');

    // Store participant data for click handling
    stageBase.dataset.participantId = participant.playerId.toString();
    stageBase.dataset.catId = participant.catId.toString();

    // Show cat sprite
    const catSprite = stageBase.querySelector('.cat-sprite');
    if (catSprite) {
      if (participant.catSpriteUrl) {
        catSprite.src = participant.catSpriteUrl;
      } else {
        catSprite.src = '../assets/cat-placeholder.png';
        console.warn(`No sprite URL for stage ${index + 1}, using placeholder`);
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
      console.log(`Stage ${index + 1} has ${participant.wornItems.length} worn items`);
      renderWornItems(stageBase, participant.wornItems, index);
    }

    // Clear any previous voting-related classes
    stageBase.classList.remove('own-cat', 'selected', 'own-cat-selected');

    console.log(`Stage ${index + 1} populated with data attributes: playerId=${participant.playerId}, catId=${participant.catId}`);
  });

  console.log('Stage bases populated');
}

/**
 * Renders worn items on top of cat sprite
 * Positions items appropriately over the cat
 */
function renderWornItems(stageBase, wornItems, stageIndex) {
  console.log(`Rendering ${wornItems.length} worn items for stage ${stageIndex + 1}`);

  // Remove existing worn items
  const existingItems = stageBase.querySelectorAll('.worn-item');
  existingItems.forEach(item => item.remove());

  if (!wornItems || wornItems.length === 0) {
    return;
  }

  // Get cat sprite as reference for positioning
  const catSprite = stageBase.querySelector('.cat-sprite');
  if (!catSprite) {
    console.warn(`No cat sprite found for stage ${stageIndex + 1}, cannot render items`);
    return;
  }

  wornItems.forEach((item, itemIndex) => {
    if (!item.spriteUrl) {
      console.warn(`No sprite URL for item ${itemIndex + 1} on stage ${stageIndex + 1}`);
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

  console.log(`Rendered worn items for stage ${stageIndex + 1}`);
}

/**
 * Starts countdown timer with urgency states
 * Adds visual urgency when time is running low
 */
function startCountdownTimer(initialSeconds) {
  console.log('Starting countdown timer:', initialSeconds, 'seconds');

  const timerTextElement = document.getElementById('timer-text');
  if (!timerTextElement) {
    console.warn('Timer text element not found');
    return;
  }

  let remainingSeconds = initialSeconds;
  timerTextElement.textContent = `${remainingSeconds} s`;

  // Show initial voting progress message
  showVotingProgressMessage(0, 5);

  console.log(`Timer started at ${new Date().toLocaleTimeString()}`);
  console.log(`Timer will end at ${new Date(Date.now() + initialSeconds * 1000).toLocaleTimeString()}`);

  const timerInterval = setInterval(() => {
    remainingSeconds--;
    timerTextElement.textContent = `${remainingSeconds} s`;

    // Add urgent styling when ≤ 10 seconds
    if (remainingSeconds <= 10 && remainingSeconds > 0) {
      timerTextElement.classList.add('urgent');
      if (remainingSeconds <= 5) {
        console.log(`${remainingSeconds} seconds remaining - URGENT!`);
      }
    }

    // Log significant timer events
    if (remainingSeconds === 30) {
      console.log('30 seconds remaining');
    } else if (remainingSeconds === 10) {
      console.log('10 seconds remaining - voting will end soon!');
    }

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      console.log(`TIMER ENDED at ${new Date().toLocaleTimeString()}`);
      console.log('Server should now be calculating votes...');

      // Hide timer section when voting ends
      const timerSection = document.querySelector('.timer-section');
      if (timerSection) {
        timerSection.style.display = 'none';
      }
    }
  }, 1000);

  console.log('Countdown timer started');
}

/**
 * Displays voting progress message in the announcement area
 * @param {number} votedCount - Number of players who have voted
 * @param {number} totalCount - Total number of players in the game
 */
function showVotingProgressMessage(votedCount = 0, totalCount = 5) {
  const announcementElement = document.querySelector('.announcement-text');
  
  if (announcementElement) {
    announcementElement.innerHTML = `Waiting for all players to vote . . .<br>${votedCount}/${totalCount} voted`;
    announcementElement.style.display = 'block';
    console.log(`Voting progress updated: ${votedCount}/${totalCount} players voted`);
  } else {
    console.warn('Failed to update voting progress: announcement element not found');
  }
}

/**
 * Enables voting interactions for all valid stage bases
 * @param {Object} socket - WebSocket connection
 * @param {Object} playerData - Current player's data including catId and playerId
 */
function enableVotingInteractions(socket, playerData) {
  console.log('Enabling voting interactions for player:', playerData.playerId);

  // Update global state
  isVotingActive = true;
  currentSocket = socket;
  currentPlayerData = playerData;

  // Add voting-active class to enable voting UI styles
  const catDisplay = document.querySelector('.cat-display');
  if (catDisplay) {
    catDisplay.classList.add('voting-active');
  }

  // Setup interaction handlers for each stage
  const stageBases = document.querySelectorAll('.stage-base');
  stageBases.forEach((stageBase, index) => {
    // Clean up any existing event listeners to prevent duplicates
    stageBase.removeEventListener('click', handleStageClick);
    stageBase.removeEventListener('mouseenter', handleStageMouseEnter);
    stageBase.removeEventListener('mouseleave', handleStageMouseLeave);

    const targetCatId = parseInt(stageBase.dataset.catId);
    const targetPlayerId = stageBase.dataset.participantId;

    // Skip stages without valid participant data
    if (isNaN(targetCatId) || !targetPlayerId) {
      console.warn(`Stage ${index + 1} missing participant data - skipping interaction setup`);
      return;
    }

    // Mark player's own cat as non-votable
    const isOwnCat = (targetCatId === currentPlayerData.catId && 
                     targetPlayerId === currentPlayerData.playerId.toString());

    if (isOwnCat) {
      stageBase.classList.add('own-cat');
      console.log(`Stage ${index + 1} marked as player's own cat (non-votable)`);
    } else {
      stageBase.classList.remove('own-cat');
    }

    // Add event listeners for voting interactions
    stageBase.addEventListener('click', handleStageClick);
    stageBase.addEventListener('mouseenter', handleStageMouseEnter);
    stageBase.addEventListener('mouseleave', handleStageMouseLeave);
  });

  console.log('Voting interactions enabled for', stageBases.length, 'stages');
}

/**
 * Handles mouse enter events for hover effects during voting
 * @param {Event} event - Mouse enter event
 */
function handleStageMouseEnter(event) {
  if (!isVotingActive) return;

  const stageBase = event.currentTarget;
  const targetCatId = parseInt(stageBase.dataset.catId);
  const targetPlayerId = stageBase.dataset.participantId;

  // Validate stage data before processing hover
  if (isNaN(targetCatId) || !targetPlayerId) {
    console.warn('Hover on stage with invalid data - catId:', targetCatId, 'playerId:', targetPlayerId);
    return;
  }

  // Check if hovering over own cat for debugging
  const isOwnCat = (targetCatId === currentPlayerData.catId && 
                   targetPlayerId === currentPlayerData.playerId.toString());

  if (isOwnCat) {
    console.log('Hover over own cat (non-votable)');
  }
  // Note: CSS handles visual hover effects automatically
}

/**
 * Handles mouse leave events (cleanup handled by CSS)
 * @param {Event} event - Mouse leave event
 */
function handleStageMouseLeave(event) {
  // CSS automatically removes hover state - no JavaScript cleanup needed
}

/**
 * Handles click events on stage bases for voting
 * @param {Event} event - Click event on stage base
 */
function handleStageClick(event) {
  if (!isVotingActive) {
    console.log('Vote attempt blocked - voting not active');
    return;
  }

  const stageBase = event.currentTarget;
  const targetCatId = parseInt(stageBase.dataset.catId);
  const targetPlayerId = stageBase.dataset.participantId;

  // Validate stage data before processing vote
  if (isNaN(targetCatId) || !targetPlayerId) {
    console.error('Vote attempt on invalid stage - catId:', targetCatId, 'playerId:', targetPlayerId);
    showErrorToast('Invalid cat selection', 'warning');
    return;
  }

  console.log(`Vote attempt: Player ${targetPlayerId}, Cat ${targetCatId}`);

  // Prevent voting for own cat
  const isOwnCat = (targetCatId === currentPlayerData.catId && 
                   targetPlayerId === currentPlayerData.playerId.toString());

  if (isOwnCat) {
    console.log('Self-vote blocked - showing warning animation');
    showSelfVoteWarning(stageBase);
    return;
  }

  // Process valid vote with optimistic UI update
  console.log(`Valid vote cast for cat ${targetCatId}`);
  selectCat(targetCatId, stageBase);

  // Send vote to server
  if (currentSocket && currentSocket.connected) {
    console.log(`Sending vote to server: cat ${targetCatId}`);
    currentSocket.emit('vote', {
      type: 'vote',
      votedCatId: targetCatId
    });
  } else {
    console.error('Vote failed - socket disconnected, reverting UI');
    // Revert optimistic UI update on connection failure
    const allStageBases = document.querySelectorAll('.stage-base');
    allStageBases.forEach(stage => {
      stage.classList.remove('selected');
    });
    selectedCatId = null;
    
    showConnectionToast('disconnected');
  }
}

/**
 * Updates UI to show selected cat and updates global state
 * @param {number} catId - ID of the selected cat
 * @param {HTMLElement} stageBase - Stage element that was clicked
 */
function selectCat(catId, stageBase) {
  console.log(`Selecting cat ${catId} for voting`);

  // Clear previous selection from all stages
  const allStageBases = document.querySelectorAll('.stage-base');
  allStageBases.forEach(stage => {
    stage.classList.remove('selected');
  });

  // Apply selection to clicked stage
  stageBase.classList.add('selected');
  selectedCatId = catId;

  console.log(`Cat ${catId} selection UI updated`);
}

/**
 * Shows warning animation when player tries to vote for their own cat
 * @param {HTMLElement} stageBase - Stage element representing player's own cat
 */
function showSelfVoteWarning(stageBase) {
  console.log('Displaying self-vote warning animation');

  // Trigger shake animation on own cat
  stageBase.classList.add('own-cat-selected');

  // Show warning message
  const warningElement = document.querySelector('.warning-message');
  if (warningElement) {
    warningElement.style.display = 'block';
  } else {
    console.warn('Warning message element not found');
  }

  // Auto-hide warning after 3 seconds
  setTimeout(() => {
    stageBase.classList.remove('own-cat-selected');
    if (warningElement) {
      warningElement.style.display = 'none';
    }
    console.log('Self-vote warning cleared');
  }, 3000);
}

/**
 * Disables all voting interactions and cleans up event listeners
 */
function disableVotingInteractions() {
  console.log('Disabling voting interactions');

  isVotingActive = false;

  // Remove voting UI state
  const catDisplay = document.querySelector('.cat-display');
  if (catDisplay) {
    catDisplay.classList.remove('voting-active');
  }

  // Clean up event listeners and temporary classes
  const stageBases = document.querySelectorAll('.stage-base');
  stageBases.forEach(stageBase => {
    stageBase.removeEventListener('click', handleStageClick);
    stageBase.removeEventListener('mouseenter', handleStageMouseEnter);
    stageBase.removeEventListener('mouseleave', handleStageMouseLeave);

    // Keep selection visible but remove error states
    stageBase.classList.remove('own-cat-selected');
  });

  console.log('Voting interactions disabled - selections preserved');
}

/**
 * Transitions from waiting room to active voting phase
 * @param {Array} participants - List of participating players and their cats
 * @param {number} timerSeconds - Voting time limit in seconds
 * @param {Object} playerData - Current player's data
 */
function transitionToVotingPhase(participants, timerSeconds, playerData) {
  console.log(`Starting voting phase with ${participants.length} participants, ${timerSeconds}s timer`);

  setGamePhase('voting');

  // Hide waiting room UI
  const waitingMessageElement = document.querySelector('.waiting-message');
  if (waitingMessageElement) {
    waitingMessageElement.style.display = 'none';
  }

  // Show voting UI elements
  const catDisplayElement = document.querySelector('.cat-display');
  const timerSectionElement = document.querySelector('.timer-section');
  
  if (catDisplayElement) {
    catDisplayElement.style.display = 'flex';
  }

  if (timerSectionElement) {
    timerSectionElement.style.display = 'flex';
  }

  // Setup game elements
  populateStageBasesWithParticipants(participants, playerData);
  startCountdownTimer(timerSeconds);

  // Enable voting interactions
  enableVotingInteractions(currentSocket, playerData);

  console.log('Voting phase transition completed successfully');
}

/**
 * Shows calculating/processing screen between voting and results
 * @param {string} message - Message to display during calculation
 */
function showCalculatingScreen(message) {
  console.log('Displaying vote calculation screen:', message);

  // Disable all voting interactions
  disableVotingInteractions();

  // Hide voting UI elements
  const catDisplay = document.querySelector('.cat-display');
  const timerSection = document.querySelector('.timer-section');
  const warningMessage = document.querySelector('.warning-message');

  if (catDisplay) catDisplay.style.display = 'none';
  if (timerSection) timerSection.style.display = 'none';
  if (warningMessage) warningMessage.style.display = 'none';

  // Show calculation message
  const announcementElement = document.querySelector('.announcement-text');
  if (announcementElement) {
    announcementElement.textContent = message;
    announcementElement.style.display = 'block';
  } else {
    console.warn('Cannot show calculating message - announcement element missing');
  }
}

/**
 * Displays final results screen with vote tallies and rewards
 * @param {Array} participants - Participants with vote counts and coin rewards
 */
function showResultsScreen(participants) {
  console.log(`Displaying results for ${participants.length} participants`);

  // Set game phase to results (hides back arrow and exit dialog)
  setGamePhase('results');

  // Hide calculating announcement
  const announcementElement = document.querySelector('.announcement-text');
  if (announcementElement) {
    announcementElement.style.display = 'none';
  }

  // Log results for debugging (maintains original stage order)
  console.log('Final results by stage position:');
  participants.forEach((p, index) => {
    console.log(`  Stage ${index + 1}: ${p.catName} - ${p.votesReceived} votes (${p.coinsEarned} coins)`);
  });

  // Transform display to results mode without repositioning
  transformToResultsMode(participants);

  // Show results action buttons
  const resultsButtons = document.querySelector('.results-buttons');
  if (resultsButtons) {
    resultsButtons.style.display = 'flex';
  } else {
    console.warn('Results buttons element not found');
  }

  console.log('Results screen display completed');
}

/**
 * Transforms cat display to show results with vote pedestals (preserves original positioning)
 * @param {Array} participants - Participants with voting results and rewards
 */
function transformToResultsMode(participants) {
  console.log('Transforming display to results mode - preserving stage positions');

  const catDisplay = document.querySelector('.cat-display');
  if (catDisplay) {
    catDisplay.style.display = 'flex';
    catDisplay.classList.add('showing-results');
  }

  const stageBases = document.querySelectorAll('.stage-base');

  // Prepare all stages for results display
  stageBases.forEach((stageBase, index) => {
    stageBase.classList.add('results-mode');

    // Hide gold pedestals and old reward text initially
    const goldBase = stageBase.querySelector('.gold-base');
    const oldRewardText = stageBase.querySelector('.reward-text');

    if (goldBase) goldBase.style.display = 'none';
    if (oldRewardText) oldRewardText.style.display = 'none';
  });

  // Fixed height calculation for vote pedestals
  const PIXELS_PER_VOTE = 40; // Each vote adds 40px height
  const MIN_HEIGHT = 20;      // Minimum pedestal height
  
  console.log(`Using pedestal formula: ${MIN_HEIGHT}px base + ${PIXELS_PER_VOTE}px per vote`);

  // Update each stage with results data (no repositioning)
  stageBases.forEach((stageBase, stageIndex) => {
    const participantId = stageBase.dataset.participantId;
    const catId = parseInt(stageBase.dataset.catId);

    // Find matching participant data
    const participant = participants.find(p => 
      p.playerId.toString() === participantId && p.catId === catId
    );

    if (!participant) {
      console.warn(`No results data found for stage ${stageIndex + 1}`);
      return;
    }

    console.log(`Updating stage ${stageIndex + 1}: ${participant.catName} (${participant.votesReceived} votes, ${participant.coinsEarned} coins)`);

    const goldBase = stageBase.querySelector('.gold-base');
    const catSprite = stageBase.querySelector('.cat-sprite');

    // Calculate pedestal height based on votes received
    const goldHeight = MIN_HEIGHT + (participant.votesReceived * PIXELS_PER_VOTE);

    // Show and position gold pedestal on top of brown base
    if (goldBase) {
      goldBase.style.display = 'block';
      goldBase.style.height = `${goldHeight}px`;
      goldBase.style.bottom = '100px';        // Above brown base
      goldBase.style.position = 'absolute';
      goldBase.style.left = '50%';
      goldBase.style.transform = 'translateX(-50%)';
      goldBase.style.width = '149px';
      goldBase.style.backgroundColor = 'var(--color-gold)';
    }

    // Position cat sprite on top of gold pedestal
    if (catSprite) {
      catSprite.style.display = 'block';
      catSprite.classList.add('results-cat');

      const catBottomPosition = 100 + goldHeight; // Brown base + gold pedestal
      catSprite.style.bottom = `${catBottomPosition}px`;
      catSprite.style.top = 'auto';
      catSprite.style.position = 'absolute';
      catSprite.style.left = '50%';
      catSprite.style.transform = 'translateX(-50%)';
      catSprite.style.width = '149px';
      catSprite.style.height = '149px';
      catSprite.style.objectFit = 'contain';
      catSprite.style.zIndex = '11';
    }

    // Render worn items on cat in results mode
    if (participant.wornItems && participant.wornItems.length > 0) {
      renderWornItemsResults(stageBase, participant.wornItems, goldHeight);
    }

    // Add coin reward text to brown base
    const existingCoinText = stageBase.querySelector('.coin-reward-text');
    if (existingCoinText) {
      existingCoinText.remove(); // Remove old coin text
    }

    const coinText = document.createElement('div');
    coinText.className = 'coin-reward-text';
    coinText.textContent = `${participant.coinsEarned} coins`;
    stageBase.appendChild(coinText);

    console.log(`Stage ${stageIndex + 1} results updated: ${goldHeight}px pedestal, ${participant.coinsEarned} coins`);
  });

  console.log('Results mode transformation completed - original positions preserved');
}

/**
 * Renders worn items on cats in results mode with proper positioning
 * @param {HTMLElement} stageBase - Stage container element
 * @param {Array} wornItems - Array of worn item data with sprite URLs
 * @param {number} goldHeight - Height of gold pedestal for positioning
 */
function renderWornItemsResults(stageBase, wornItems, goldHeight) {
  console.log(`Rendering ${wornItems.length} worn items in results mode`);

  // Remove any existing worn items
  const existingItems = stageBase.querySelectorAll('.worn-item');
  existingItems.forEach(item => item.remove());

  if (!wornItems || wornItems.length === 0) {
    return;
  }

  wornItems.forEach((item, itemIndex) => {
    if (!item.spriteUrl) {
      console.warn(`Worn item ${itemIndex + 1} missing sprite URL - skipping`);
      return;
    }

    // Create worn item image element
    const wornItemElement = document.createElement('img');
    wornItemElement.src = item.spriteUrl;
    wornItemElement.alt = `${item.category} item`;
    wornItemElement.classList.add('worn-item', `worn-${item.category}`, 'results-worn-item');

    // Position over cat sprite on pedestal
    wornItemElement.style.position = 'absolute';
    wornItemElement.style.bottom = `${100 + goldHeight}px`; // Brown base + gold pedestal
    wornItemElement.style.left = '50%';
    wornItemElement.style.transform = 'translateX(-50%)';
    wornItemElement.style.width = '149px';
    wornItemElement.style.height = 'auto';
    wornItemElement.style.zIndex = '12';      // Above cat sprite
    wornItemElement.style.pointerEvents = 'none';

    // Enable crisp pixel rendering for item sprites
    wornItemElement.style.imageRendering = 'pixelated';
    wornItemElement.style.imageRendering = '-moz-crisp-edges';
    wornItemElement.style.imageRendering = 'crisp-edges';

    stageBase.appendChild(wornItemElement);
  });

  console.log(`Successfully rendered worn items in results mode`);
}

/**
 * Sets up event listeners for results screen action buttons
 */
function setupResultsButtons() {
  const playAgainBtn = document.getElementById('play-again-btn');
  const goHomeBtn = document.getElementById('go-home-btn');

  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Play Again clicked - reloading page for new game');
      
      // Reset game phase before reload for clean state
      setGamePhase('waiting');
      
      window.location.reload(); // Simple restart - full page reload
    });
  } else {
    console.warn('Play Again button not found');
  }

  if (goHomeBtn) {
    goHomeBtn.addEventListener('click', (e) => {
      console.log('Go Home clicked - navigating to main menu');
      navigateHome(); // Use centralized navigation function
    });
  } else {
    console.warn('Go Home button not found');
  }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  console.log('Page unloading - performing cleanup');
  
  // Stop connection monitoring
  stopConnectionMonitoring();
  
  // Disconnect WebSocket
  if (currentSocket && currentSocket.connected) {
    currentSocket.disconnect();
    console.log('Socket disconnected during cleanup');
  }
});

// Global error handlers for debugging and stability

/**
 * Handles unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in fashion show:', event.reason);
  handleFashionShowError(event.reason, 'Promise Rejection');
  
  // Prevent default browser error dialog
  event.preventDefault();
});

/**
 * Handles uncaught JavaScript errors
 */
window.addEventListener('error', (event) => {
  console.error('JavaScript error in fashion show:', event.error);
  handleFashionShowError(event.error, 'JavaScript');
});