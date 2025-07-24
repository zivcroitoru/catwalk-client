let isInVotingPhase = false; // Track if we're in voting phase
let exitDialogOpen = false; // Track if exit dialog is currently open

// Placeholder data for cats and players (until database integration)
const placeholderCats = [
    { catName: "Mr. Grumpy Pants", username: "who_dis723" },
    { catName: "Juliet", username: "strawberry_banana" },
    { catName: "Smiley", username: "(:_smile_:)" },
    { catName: "Cookie", username: "my_username_sucks" },
    { catName: "Elvis", username: "the_king_91" }
];

// Placeholder coin rewards for results phase
const placeholderRewards = [50, 75, 100, 25, 60];

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
    // SET VOTING PHASE FLAG
    isInVotingPhase = true;

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
    
    // Create 5 brown stage bases inside the cat display
    for (let i = 0; i < 5; i++) {
        const stageBase = document.createElement('div');
        stageBase.className = 'stage-base';
        stageBase.setAttribute('data-cat-index', i);
        
        // Add stage walkway image to top
        const stageWalkway = document.createElement('img');
        stageWalkway.src = '../assets/icons/stage-walkway.png';
        stageWalkway.alt = 'Stage Walkway';
        stageWalkway.className = 'stage-walkway';
        stageBase.appendChild(stageWalkway);
        
        // Add cat sprite - positioned 30px above bottom of stage-walkway
        const catSprite = document.createElement('img');
        catSprite.src = '../assets/cats/classic pink.png';
        catSprite.alt = placeholderCats[i].catName;
        catSprite.className = 'cat-sprite';
        stageBase.appendChild(catSprite);
        
        // Add cat name text
        const catName = document.createElement('div');
        catName.className = 'cat-name';
        catName.textContent = placeholderCats[i].catName;
        stageBase.appendChild(catName);
        
        // Add username text  
        const username = document.createElement('div');
        username.className = 'username';
        username.textContent = placeholderCats[i].username;
        stageBase.appendChild(username);
        
        catDisplay.appendChild(stageBase);
    }

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
                console.log("Calculating votes message removed - starting results phase!");
            }
            
            // WE'VE REACHED RESULTS PHASE - Album button should work normally now
            isInVotingPhase = false;
            console.log("Entered results phase - album button back to normal");
            
            // AUTO-CLOSE EXIT DIALOG IF OPEN (we've reached results phase)
            if (exitDialogOpen) {
                closeExitDialog();
                console.log("Auto-closed exit dialog - reached results phase");
            }

            // NEW: Show results phase before waiting
            showResultsPhase();
            
        }, 3000); // 3 seconds for calculating votes message
        
    }, 1000); // 1 second for "TIME'S UP!"
}

function showResultsPhase() {
    console.log("Showing results phase...");
    
    // Modify existing stage bases for results display
    const stageBases = document.querySelectorAll('.stage-base');
    
    stageBases.forEach((stageBase, index) => {
        // Make brown base 1/3 of original height (380px -> ~127px)
        stageBase.classList.add('results-mode');
        
        // Remove stage-walkway image during results phase
        const stageWalkway = stageBase.querySelector('.stage-walkway');
        if (stageWalkway) {
            stageWalkway.style.display = 'none';
        }
        
        // Create gold base on top
        const goldBase = document.createElement('div');
        goldBase.className = 'gold-base';
        stageBase.appendChild(goldBase);
        
        // Move cat sprite to top of gold base
        const catSprite = stageBase.querySelector('.cat-sprite');
        if (catSprite) {
            catSprite.classList.add('results-cat');
        }
        
        // Add reward text above cat name
        const rewardText = document.createElement('div');
        rewardText.className = 'reward-text';
        rewardText.textContent = `${placeholderRewards[index]} coins`;
        
        // Insert reward text before cat name
        const catName = stageBase.querySelector('.cat-name');
        if (catName) {
            stageBase.insertBefore(rewardText, catName);
        }
    });
    
    // Wait 3 minutes then restart entire sequence
    setTimeout(() => {
        resetToWaitingRoom();
    }, 180000); // Wait 3 minutes (180,000ms) for results display
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
    
    // RESET VOTING PHASE FLAG
    isInVotingPhase = false;
    
    // Close any open exit dialog
    if (exitDialogOpen) {
        closeExitDialog();
    }

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

// Updated showExitDialog function with new text
function showExitDialog() {
    if (exitDialogOpen) return; // Prevent multiple dialogs
    
    exitDialogOpen = true;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'exit-overlay';
    overlay.id = 'exit-overlay';
    
    // Create dialog box
    const dialog = document.createElement('div');
    dialog.className = 'exit-dialog';
    
    // Create title text - UPDATED MESSAGE
    const title = document.createElement('div');
    title.className = 'exit-dialog-title';
    title.innerHTML = 'Are you sure you want to exit this gameshow?<br>All potential rewards will be lost!';
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'exit-dialog-buttons';
    
    // Create NO button
    const noButton = document.createElement('button');
    noButton.className = 'exit-dialog-button no-button';
    noButton.textContent = 'NO, I changed my mind';
    noButton.onclick = closeExitDialog;
    
    // Create YES button  
    const yesButton = document.createElement('button');
    yesButton.className = 'exit-dialog-button yes-button';
    yesButton.textContent = "YES, I'm sure";
    yesButton.onclick = () => {
        window.location.href = 'album.html';
    };
    
    // Assemble dialog
    buttonsContainer.appendChild(noButton);
    buttonsContainer.appendChild(yesButton);
    dialog.appendChild(title);
    dialog.appendChild(buttonsContainer);
    overlay.appendChild(dialog);
    
    // Add to page
    document.body.appendChild(overlay);
    
    console.log("Exit dialog shown");
}

function closeExitDialog() {
    const overlay = document.getElementById('exit-overlay');
    if (overlay) {
        overlay.remove();
        exitDialogOpen = false;
        console.log("Exit dialog closed");
    }
}

function handleAlbumButtonClick(event) {
    if (isInVotingPhase) {
        // During voting phase - show confirmation dialog
        event.preventDefault(); // Prevent default navigation
        showExitDialog();
    }
    // During waiting room - let default behavior happen (go to album.html)
}

// SINGLE EVENT LISTENER - FIXED!
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fashion Show page loaded - starting counter");
    startCounter();
    
    // Add album button click handler
    const albumButton = document.querySelector('.album-button');
    if (albumButton) {
        albumButton.addEventListener('click', handleAlbumButtonClick);
        console.log("Album button click handler attached");
    }
});