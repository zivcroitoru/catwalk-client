// Fashion Show Counter System
let playerCount = 1;
const maxPlayers = 5;
let counterInterval;
let votingTimer;
let timeRemaining = 15;

function startCounter() {
    // Update counter every second
    counterInterval = setInterval(() => {
        if (playerCount < maxPlayers) {
            playerCount++;
            updateCounterDisplay();
            
            if (playerCount === maxPlayers) {
                // Stop counter when we reach 5/5
                clearInterval(counterInterval);
                console.log("All players joined! Ready for voting phase.");
                
                // Pause briefly at 5/5 before transitioning
                setTimeout(() => {
                    transitionToVotingPhase();
                }, 2000); // Wait 2 seconds after reaching 5/5
            }
        }
    }, 1000); // 1 second intervals
}

function updateCounterDisplay() {
    const counterElement = document.getElementById('player-counter');
    if (counterElement) {
        counterElement.textContent = `${playerCount}/5`;
    }
}

function transitionToVotingPhase() {
    console.log("Transitioning to setup stage...");
    
    // Get the waiting message element
    const waitingMessage = document.querySelector('.waiting-message');
    
    if (waitingMessage) {
        // Replace content with setup message
        waitingMessage.innerHTML = 'SETTING UP STAGE . . .';
        
        // After exactly 1 second, show voting interface
        setTimeout(() => {
            showVotingInterface();
            console.log("Voting interface displayed");
        }, 1000); // Exactly 1 second
    }
}

function showVotingInterface() {
    // Remove the waiting message completely
    const waitingMessage = document.querySelector('.waiting-message');
    if (waitingMessage) {
        waitingMessage.remove();
    }
    
    // Create voting interface elements
    createVotingInterface();
    
    // Start the detailed timing sequence
    startDetailedSequence();
}

function createVotingInterface() {
    const main = document.querySelector('main');
    
    // Create the large cream display area for cats
    const catDisplay = document.createElement('div');
    catDisplay.className = 'cat-display';
    
    // Create announcement text (starts with "HERE THEY COME!")
    const announcement = document.createElement('div');
    announcement.className = 'announcement-text';
    announcement.textContent = 'HERE THEY COME!';
    
    // Create red warning message
    const warningMessage = document.createElement('div');
    warningMessage.className = 'warning-message';
    warningMessage.textContent = "You can't vote for your own cat, please vote for another cat";
    
    // Add all elements to main
    main.appendChild(catDisplay);
    main.appendChild(announcement);
    main.appendChild(warningMessage);
}

function startDetailedSequence() {
    console.log("Starting detailed timing sequence...");
    
    // Step 3: "HERE THEY COME!" displays for 2 seconds (already showing)
    setTimeout(() => {
        // Step 4: Text changes to "VOTE!" for 1 second
        const announcement = document.querySelector('.announcement-text');
        if (announcement) {
            announcement.textContent = 'VOTE!';
            console.log("Changed to VOTE!");
        }
        
        setTimeout(() => {
            // Step 5: Timer appears, button moves up, text becomes "Waiting for all players to vote . . ."
            showTimer();
            moveAlbumButtonUp();
            
            if (announcement) {
                announcement.textContent = 'Waiting for all players to vote . . .';
                console.log("Changed to waiting message and started timer");
            }
            
            startVotingTimer();
            
        }, 1000); // 1 second after showing "VOTE!"
        
    }, 2000); // 2 seconds for "HERE THEY COME!"
}

function showTimer() {
    const timerSection = document.querySelector('.timer-section');
    if (timerSection) {
        timerSection.style.display = 'flex';
    }
}

function moveAlbumButtonUp() {
    const albumButton = document.querySelector('.album-button');
    if (albumButton) {
        // Move button up (from bottom: 30px to bottom: 120px)
        albumButton.style.bottom = '120px';
        console.log("Album button moved up");
    }
}

function moveAlbumButtonDown() {
    const albumButton = document.querySelector('.album-button');
    if (albumButton) {
        // Move button back down (from bottom: 120px to bottom: 30px)
        albumButton.style.bottom = '30px';
        console.log("Album button moved down");
    }
}

function startVotingTimer() {
    timeRemaining = 15; // 60 seconds for voting
    updateTimerDisplay();
    
    votingTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        // Step 6: Timer color changes to red at 10 seconds
        if (timeRemaining === 10) {
            changeTimerToRed();
        }
        
        // Step 7: Timer reaches 0s
        if (timeRemaining <= 0) {
            clearInterval(votingTimer);
            console.log("Voting time is up!");
            startEndSequence();
        }
    }, 1000); // Update every second
}

function updateTimerDisplay() {
    const timerText = document.getElementById('timer-text');
    if (timerText) {
        timerText.textContent = `${timeRemaining} s`;
    }
}

function changeTimerToRed() {
    const timerText = document.getElementById('timer-text');
    if (timerText) {
        timerText.style.color = 'var(--color-red)'; // #FB0B0B
        timerText.style.fontSize = 'var(--font-size-md)'; // 64px instead of 48px
        console.log("Timer changed to red and bigger at 10 seconds");
    }
}

function startEndSequence() {
    const announcement = document.querySelector('.announcement-text');
    
    // Step 7: "Waiting for all players to vote . . ." turns into "TIME'S UP!" (1 second display)
    if (announcement) {
        announcement.textContent = "TIME'S UP!";
        console.log("Changed to TIME'S UP!");
    }
    
    setTimeout(() => {
        // Step 8: Timer disappears + album button moves back down + text becomes "CALCULATING VOTES, PLEASE WAIT . . ."
        hideTimer();
        moveAlbumButtonDown();
        
        if (announcement) {
            announcement.textContent = 'CALCULATING VOTES, PLEASE WAIT . . .';
            console.log("Changed to calculating votes message");
        }
        
        setTimeout(() => {
            // Step 9: "CALCULATING VOTES, PLEASE WAIT . . ." text disappears (3 seconds display)
            if (announcement) {
                announcement.remove();
                console.log("Calculating votes message removed - sequence complete!");
            }
            
            // Wait 3 seconds then restart the entire sequence
            setTimeout(() => {
                resetToWaitingRoom();
            }, 3000); // Wait 3 seconds after text disappears
            
        }, 3000); // 3 seconds for calculating votes message
        
    }, 1000); // 1 second for "TIME'S UP!"
}

function hideTimer() {
    const timerSection = document.querySelector('.timer-section');
    if (timerSection) {
        timerSection.style.display = 'none';
        console.log("Timer hidden");
    }
}

function resetToWaitingRoom() {
    console.log("Resetting to waiting room - starting new cycle...");
    
    // Remove any remaining voting interface elements
    const catDisplay = document.querySelector('.cat-display');
    const warningMessage = document.querySelector('.warning-message');
    const existingAnnouncement = document.querySelector('.announcement-text');
    
    if (catDisplay) catDisplay.remove();
    if (warningMessage) warningMessage.remove();
    if (existingAnnouncement) existingAnnouncement.remove();
    
    // Reset timer styling back to defaults
    const timerText = document.getElementById('timer-text');
    if (timerText) {
        timerText.style.color = 'var(--color-black)'; // Back to black
        timerText.style.fontSize = 'var(--font-size-sm)'; // Back to 48px
    }
    
    // Make sure timer is hidden and album button is in original position
    hideTimer();
    moveAlbumButtonDown();
    
    // Reset player count
    playerCount = 1;
    
    // Recreate the waiting message
    const main = document.querySelector('main');
    const waitingMessage = document.createElement('div');
    waitingMessage.className = 'waiting-message';
    waitingMessage.innerHTML = `
        WAITING FOR MORE<br>
        PLAYERS TO JOIN<br>
        <span id="player-counter">1/5</span>
    `;
    
    main.appendChild(waitingMessage);
    
    // Start the counter again
    startCounter();
    console.log("New cycle started!");
}

// Start the counter when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fashion Show page loaded - starting counter");
    startCounter();
});