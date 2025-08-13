console.log('🚨 FASHION SHOW FILE LOADED - timestamp:', Date.now());

import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { getLoggedInUserInfo } from "./core/utils.js";

// Global variables
let socket = null;
let participants = [];
let playerId = null;
let selectedCat = null;
let userCats = [];

// Constants
const PARTICIPANTS_IN_ROOM = 5;

// Get the correct server URL from the same source as other parts of the app
const SERVER_URL = "https://catwalk-server-eu.onrender.com"; // Updated to match your actual server
console.log('🔧 SERVER_URL set to:', SERVER_URL); // Debug log to verify URL is correct

// Utility function to update counter display
function updateCounterDisplay(currentCount = 1, maxCount = PARTICIPANTS_IN_ROOM) {
  const counterElement = document.getElementById('player-counter');
  if (counterElement) {
    counterElement.textContent = `${currentCount}/${maxCount}`;
    console.log(`📊 Updated counter: ${currentCount}/${maxCount}`);
  }
}

// Initialize socket connection
function initializeSocket() {
  console.log('🔧 Initializing socket connection to:', SERVER_URL);
  console.log('🔧 About to create socket with io() function...');

  // Connect to the correct server URL
  socket = io(SERVER_URL);

  console.log('🔧 Socket object created:', socket);

  socket.on('connect', () => {
    console.log('✅ Connected to fashion show server');
    console.log('🔧 Socket ID:', socket.id);

    // Ensure we have both cat and player data before joining
    if (!selectedCat || !playerId) {
      console.error('❌ Missing data - selectedCat:', selectedCat, 'playerId:', playerId);
      return;
    }

    console.log('🔧 About to join fashion show...');
    joinFashionShow();
  });

    socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected from fashion show server. Reason:', reason);
  });

    socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error);
  });

  // STEP 1 FOCUS: Only handle participant updates for now
  socket.on('participant_update', (message) => {
    console.log('🔧 Received event: participant_update', message);
    try {
      console.log('👥 Participant update received:', message);
      handleParticipantUpdate(message);
      console.log('✅ Participant update handled successfully');
    } catch (error) {
      console.error('❌ Error handling participant update:', error);
    }
  });

  // TODO: Add other event handlers in later steps
  socket.on('voting_phase', (message) => {
    console.log('🔧 Received voting_phase event (not implemented yet):', message);
  });

  socket.on('voting_update', (message) => {
    console.log('🔧 Received voting_update event (not implemented yet):', message);
  });

  socket.on('results', (message) => {
    console.log('🔧 Received results event (not implemented yet):', message);
  });
}

function joinFashionShow() {
  const joinMessage = {
    playerId: playerId,
    catId: selectedCat.id
  };
  console.log('📤 Sending join message:', joinMessage);

    socket.emit('join', joinMessage);
    console.log('✅ Join message sent successfully');
}

function handleParticipantUpdate(message) {
  participants = message.participants;
    console.log('👥 Updated participants list:', participants);

  updateCounterDisplay(participants.length, message.maxCount);

    // TODO: In later steps, handle transition to voting phase
      if (participants.length >= PARTICIPANTS_IN_ROOM) {
    console.log('🚀 Room is full, should transition to voting...');
    // This will happen automatically from server via voting_phase event
  }
}

// Initialize page when ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎭 Fashion Show page DOM loaded');

  // Get URL parameters to extract cat ID
  const urlParams = new URLSearchParams(window.location.search);
  const catIdFromUrl = urlParams.get('catId');

  if (!catIdFromUrl) {
    console.error('❌ No catId provided in URL');
    // TODO: Redirect back to album
    return;
  }

  const catId = parseInt(catIdFromUrl);
  console.log('🐾 Cat ID from URL:', catId);

  // Get authenticated player ID
  try {
    const userInfo = getLoggedInUserInfo();
    playerId = userInfo.userId;
    console.log('🎭 Using authenticated player ID:', playerId);
  } catch (error) {
    console.error('❌ Failed to get user info:', error);
    // Fallback for development
    playerId = `dev_player_${Math.random().toString(36).substr(2, 5)}`;
    console.warn('🎭 Using fallback player ID:', playerId);
  }

  // Load user cats and find selected cat
  fetch("../data/usercats.json")
    .then(res => res.json())
    .then(data => {
      userCats = data;
      console.log('📚 Loaded user cats:', userCats.length, 'cats');

      // Find the selected cat by ID from URL parameter
      selectedCat = userCats.find(cat => cat.id === catId);

      if (!selectedCat) {
        console.error(`❌ Cat with ID ${catId} not found in user cats`);
        // Fallback to first available cat for testing
        if (userCats.length > 0) {
          selectedCat = userCats[0];
          console.warn('🐾 Using fallback cat:', selectedCat);
        } else {
          console.error('❌ No cats available at all');
          return;
        }
      }

      console.log("🐾 Selected cat from URL parameter:", selectedCat);

      // Initialize socket connection now that we have all required data
      initializeSocket();
    })
    .catch(err => {
      console.error("❌ Failed to load usercats.json", err);
    });
});

// Handle page unload - disconnect from socket
window.addEventListener('beforeunload', () => {
  if (socket) {
    console.log('🔌 Disconnecting socket on page unload');
    socket.disconnect();
  }
});