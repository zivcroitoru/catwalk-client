let isInVotingPhase = false; // Track if we're in voting phase
let exitDialogOpen = false; // Track if exit dialog is currently open
let selectedCatIndex = null; // Track which cat is currently selected for voting
let playerOwnedCatIndex = 0; // Placeholder: Player owns cat at index 0 (Mr. Grumpy Pants)
let warningTimeout = null; // Track warning message timeout

// Add timeout variable for 5-minute auto-navigation
let resultsTimeout = null;

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
let timeRemaining = 30;

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
    
    // Create red warning message (hidden by default)
    const warningMessage = document.createElement('div');
    warningMessage.className = 'warning-message';
    warningMessage.textContent = "You can't vote for your own cat, please vote for another cat";
    warningMessage.style.display = 'none'; // Hidden by default
    
    // Add all elements to main
    main.appendChild(catDisplay);
    main.appendChild(announcement);
    main.appendChild(warningMessage);
}

function enableVotingClicks() {
    // Add voting-active class to enable clickable styles
    const catDisplay = document.querySelector('.cat-display');
    if (catDisplay) {
        catDisplay.classList.add('voting-active');
    }
    
    // Add click and hover event listeners to all stage bases
    const stageBases = document.querySelectorAll('.stage-base');
    stageBases.forEach((stageBase, index) => {
        stageBase.addEventListener('click', () => handleCatVote(index));
        stageBase.addEventListener('mouseenter', () => handleCatHover(index));
        stageBase.addEventListener('mouseleave', () => handleCatHoverEnd(index));
    });
    
    console.log("Voting clicks and hover enabled - cats are now interactive");
}

function disableVotingClicks() {
    // Remove voting-active class to disable clickable styles but KEEP selection visible
    const catDisplay = document.querySelector('.cat-display');
    if (catDisplay) {
        catDisplay.classList.remove('voting-active');
    }
    
    // Hide warning message when voting ends
    hideWarningMessage();
    
    // DON'T clear selection here - keep it visible during "CALCULATING..."
    console.log("Voting clicks disabled but selection kept visible");
}

function handleCatVote(catIndex) {
    // Only allow voting during voting phase
    if (!isInVotingPhase) {
        console.log("Voting not allowed - not in voting phase");
        return;
    }
    
    // Check if player is trying to vote for their own cat
    if (catIndex === playerOwnedCatIndex) {
        showOwnCatWarning(catIndex);
        return;
    }
    
    // Hide warning message if it was showing (player clicked another cat)
    hideWarningMessage();
    
    // Clear previous selection
    clearCatSelection();
    
    // Set new selection
    selectedCatIndex = catIndex;
    
    // Add visual selection to the clicked stage base
    const stageBases = document.querySelectorAll('.stage-base');
    if (stageBases[catIndex]) {
        stageBases[catIndex].classList.add('selected');
    }
    
    console.log(`Voted for cat ${catIndex}: ${placeholderCats[catIndex].catName}`);
}

function handleCatHover(catIndex) {
    // Only show hover effects during voting phase
    if (!isInVotingPhase) return;
    
    // If it's the player's own cat, show red outline on hover
    if (catIndex === playerOwnedCatIndex) {
        const stageBases = document.querySelectorAll('.stage-base');
        if (stageBases[catIndex]) {
            stageBases[catIndex].classList.add('own-cat-hover');
        }
    }
}

function handleCatHoverEnd(catIndex) {
    // Remove hover effect when mouse leaves
    const stageBases = document.querySelectorAll('.stage-base');
    if (stageBases[catIndex]) {
        stageBases[catIndex].classList.remove('own-cat-hover');
    }
}

function showOwnCatWarning(catIndex) {
    // CLEAR ANY EXISTING SELECTION FIRST - this cancels previous votes
    clearCatSelection();

    // Add red outline to own cat
    const stageBases = document.querySelectorAll('.stage-base');
    if (stageBases[catIndex]) {
        stageBases[catIndex].classList.add('own-cat-selected');
    }
    
    // Show warning message
    const warningMessage = document.querySelector('.warning-message');
    if (warningMessage) {
        warningMessage.style.display = 'block';
    }
    
    // Clear any existing timeout
    if (warningTimeout) {
        clearTimeout(warningTimeout);
    }
    
    // Set timeout to hide warning after 3 seconds
    warningTimeout = setTimeout(() => {
        hideWarningMessage();
    }, 3000);
    
    console.log("Player tried to vote for their own cat - showing warning");
}

function hideWarningMessage() {
    // Hide warning message
    const warningMessage = document.querySelector('.warning-message');
    if (warningMessage) {
        warningMessage.style.display = 'none';
    }
    
    // Remove red outline from own cat
    const stageBases = document.querySelectorAll('.stage-base');
    if (stageBases[playerOwnedCatIndex]) {
        stageBases[playerOwnedCatIndex].classList.remove('own-cat-selected');
    }
    
    // Clear timeout
    if (warningTimeout) {
        clearTimeout(warningTimeout);
        warningTimeout = null;
    }
}

function clearCatSelection() {
    // Remove selected class from all stage bases
    const stageBases = document.querySelectorAll('.stage-base');
    stageBases.forEach(stageBase => {
        stageBase.classList.remove('selected');
    });
    
    selectedCatIndex = null;
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
            
            // Enable clickable stages for voting
            enableVotingClicks();

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
    timeRemaining = 30; // 30 seconds for voting
    updateTimerDisplay();
    
    votingTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        // Step 6: Timer color changes to red at 10 seconds
        if (timeRemaining === 10) {
            changeTimerToRed();
        }
        
        // Step 7: Timer reaches 0s - IMMEDIATELY disable voting BUT keep selection visible
        if (timeRemaining <= 0) {
            clearInterval(votingTimer);
            
            // IMMEDIATELY disable voting the moment timer hits 0
            isInVotingPhase = false;
            disableVotingClicks(); // This now keeps selection visible
            
            console.log("Voting time is up! Voting disabled, selection kept visible.");
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

// CONFIGURABLE GAME SETTINGS
const PIXELS_PER_VOTE = 50; // Easy to adjust - how many pixels each vote adds to gold base height
const BASE_GOLD_HEIGHT = 20; // Minimum gold base height

// Add after the existing placeholder data
let voteResults = null; // Store calculated vote results for this round

// VOTING CALCULATION SYSTEM - Placeholder for future matchmaking
function simulateVotingResults() {
    console.log("🗳️ SIMULATING VOTING RESULTS...");
    
    // Step 1: Generate votes for all 5 players (including real player's vote)
    const allPlayerVotes = generateAllPlayerVotes();
    
    // Step 2: Count votes for each cat
    const voteCounts = countVotes(allPlayerVotes);
    
    // Step 3: Calculate rewards (25 coins per vote as per GDD)
    const coinRewards = calculateCoinRewards(voteCounts);
    
    // Step 4: Calculate gold base heights using configurable variable
    const goldBaseHeights = calculateGoldBaseHeights(voteCounts);
    
    // Store results for use in showResultsPhase
    voteResults = {
        playerVotes: allPlayerVotes,
        voteCounts: voteCounts,
        coinRewards: coinRewards,
        goldBaseHeights: goldBaseHeights
    };
    
    // Log detailed results for debugging
    logVotingResults();
    
    console.log("✅ VOTE CALCULATION COMPLETE!");
    return voteResults;
}

function generateAllPlayerVotes() {
    // Create array to store who each player voted for
    const votes = new Array(5);
    
    // Player 0 (current player) - use their actual vote or assign random
    if (selectedCatIndex !== null) {
        votes[0] = selectedCatIndex;
        console.log(`👤 Player 0 (YOU) voted for: ${placeholderCats[selectedCatIndex].catName}`);
    } else {
        // Player didn't vote - assign random vote (not themselves)
        votes[0] = getRandomVoteExcluding(0);
        console.log(`🎲 Player 0 (YOU) didn't vote - random assigned: ${placeholderCats[votes[0]].catName}`);
    }
    
    // Other players (1-4) - generate realistic votes with some popularity bias
    for (let playerIndex = 1; playerIndex < 5; playerIndex++) {
        votes[playerIndex] = generateRealisticVote(playerIndex);
        console.log(`🤖 Player ${playerIndex} voted for: ${placeholderCats[votes[playerIndex]].catName}`);
    }
    
    return votes;
}

function getRandomVoteExcluding(excludeIndex) {
    const possibleVotes = [];
    for (let i = 0; i < 5; i++) {
        if (i !== excludeIndex) {
            possibleVotes.push(i);
        }
    }
    return possibleVotes[Math.floor(Math.random() * possibleVotes.length)];
}

function generateRealisticVote(playerIndex) {
    // Create weighted voting - some cats more popular than others
    const popularityWeights = [1.2, 1.5, 1.0, 0.8, 1.1]; // Adjust these for different cats
    const weightedChoices = [];
    
    for (let catIndex = 0; catIndex < 5; catIndex++) {
        // Can't vote for themselves
        if (catIndex === playerIndex) continue;
        
        // Add multiple entries based on popularity weight
        const weight = Math.floor(popularityWeights[catIndex] * 10);
        for (let w = 0; w < weight; w++) {
            weightedChoices.push(catIndex);
        }
    }
    
    return weightedChoices[Math.floor(Math.random() * weightedChoices.length)];
}

function countVotes(allPlayerVotes) {
    const counts = new Array(5).fill(0);
    
    allPlayerVotes.forEach(vote => {
        counts[vote]++;
    });
    
    return counts;
}

function calculateCoinRewards(voteCounts) {
    // GDD: 25 coins per vote received
    return voteCounts.map(votes => votes * 25);
}

function calculateGoldBaseHeights(voteCounts) {
    // 🚀 NOW USES CONFIGURABLE VARIABLE
    return voteCounts.map(votes => BASE_GOLD_HEIGHT + (votes * PIXELS_PER_VOTE));
}

function logVotingResults() {
    console.log("\n📊 VOTING RESULTS SUMMARY:");
    console.log("Cat Name | Votes | Coins | Gold Height");
    console.log("---------|-------|-------|------------");
    
    for (let i = 0; i < 5; i++) {
        const catName = placeholderCats[i].catName.padEnd(8);
        const votes = voteResults.voteCounts[i];
        const coins = voteResults.coinRewards[i];
        const height = voteResults.goldBaseHeights[i];
        console.log(`${catName} |   ${votes}   |  ${coins}  |    ${height}px`);
    }
    
    console.log(`\nTotal votes: ${voteResults.voteCounts.reduce((a, b) => a + b, 0)}`);
    console.log(`Total coins: ${voteResults.coinRewards.reduce((a, b) => a + b, 0)}`);
    console.log(`\nUsing ${PIXELS_PER_VOTE}px per vote (configurable)`);
}

// UPDATED showResultsPhase with buttons instead of auto-restart
function showResultsPhase() {
    console.log("Showing results phase with calculated vote data...");
    
    // Clear the selection outline when showing results
    clearCatSelection();
    
    // Hide the album button during results phase
    const albumButton = document.querySelector('.album-button');
    if (albumButton) {
        albumButton.style.display = 'none';
    }
    
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
        
        // Create gold base with calculated height
        const goldBase = document.createElement('div');
        goldBase.className = 'gold-base';
        
        // Gold base sits ON TOP of brown base and extends UPWARD
        if (voteResults) {
            const calculatedHeight = voteResults.goldBaseHeights[index];
            goldBase.style.height = `${calculatedHeight}px`;
            goldBase.style.bottom = '100px'; // ON TOP of the 100px brown base
            console.log(`Cat ${index} (${placeholderCats[index].catName}): ${voteResults.voteCounts[index]} votes = ${calculatedHeight}px gold base ON TOP of brown base`);
        }
        
        stageBase.appendChild(goldBase);
        
        // Move cat sprite to top of gold base
        const catSprite = stageBase.querySelector('.cat-sprite');
        if (catSprite) {
            catSprite.classList.add('results-cat');
            
            // Position cat on top of the gold base (which sits on top of brown base)
            if (voteResults) {
                const goldHeight = voteResults.goldBaseHeights[index];
                // Cat sits on top of: brown base (100px) + gold base height
                catSprite.style.bottom = `${100 + goldHeight}px`;
                catSprite.style.top = 'auto'; // Reset any top positioning
                console.log(`Cat ${index} positioned at ${100 + goldHeight}px from bottom (on top of gold base)`);
            }
        }
        
        // Add reward text with calculated coins
        const rewardText = document.createElement('div');
        rewardText.className = 'reward-text';
        
        // Use calculated coin rewards
        const coinReward = voteResults ? voteResults.coinRewards[index] : placeholderRewards[index];
        rewardText.textContent = `${coinReward} coins`;
        
        // Insert reward text before cat name
        const catName = stageBase.querySelector('.cat-name');
        if (catName) {
            stageBase.insertBefore(rewardText, catName);
        }
    });
    
    // Create and show the results buttons
    createResultsButtons();
    
    // Set 5-minute timeout to automatically go to album
    resultsTimeout = setTimeout(() => {
        console.log("5 minutes passed - automatically going to album");
        handleGoHome();
    }, 300000); // 5 minutes = 300,000ms
}

function createResultsButtons() {
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'results-buttons';
    
    // Create GO HOME button (left)
    const goHomeButton = document.createElement('button');
    goHomeButton.className = 'results-button';
    goHomeButton.textContent = 'GO HOME';
    goHomeButton.onclick = handleGoHome;
    
    // Create PLAY AGAIN button (right)
    const playAgainButton = document.createElement('button');
    playAgainButton.className = 'results-button';
    playAgainButton.textContent = 'PLAY AGAIN';
    playAgainButton.onclick = handlePlayAgain;
    
    // Add buttons to container
    buttonsContainer.appendChild(goHomeButton);
    buttonsContainer.appendChild(playAgainButton);
    
    // Add to page
    document.querySelector('main').appendChild(buttonsContainer);
    
    console.log("Results buttons created and displayed");
}

function handleGoHome() {
    console.log("GO HOME button clicked - navigating to album");
    
    // Clear the 5-minute timeout
    if (resultsTimeout) {
        clearTimeout(resultsTimeout);
        resultsTimeout = null;
    }
    
    // Navigate to album
    window.location.href = 'album.html';
}

function handlePlayAgain() {
    console.log("PLAY AGAIN button clicked - restarting cycle");
    
    // Clear the 5-minute timeout
    if (resultsTimeout) {
        clearTimeout(resultsTimeout);
        resultsTimeout = null;
    }
    
    // Remove results buttons
    const buttonsContainer = document.querySelector('.results-buttons');
    if (buttonsContainer) {
        buttonsContainer.remove();
    }
    
    // Show album button again
    const albumButton = document.querySelector('.album-button');
    if (albumButton) {
        albumButton.style.display = 'flex';
    }
    
    // Restart the cycle
    resetToWaitingRoom();
}

// UPDATE THE startEndSequence FUNCTION
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
        
        // 🚀 NEW: CALCULATE VOTING RESULTS during the 3-second wait
        simulateVotingResults();
        
        setTimeout(() => {
            // Step 9: "CALCULATING VOTES, PLEASE WAIT . . ." text disappears (3 seconds display)
            if (announcement) {
                announcement.remove();
                console.log("Calculating votes message removed - starting results phase!");
            }
            
            // AUTO-CLOSE EXIT DIALOG IF OPEN (we've reached results phase)
            if (exitDialogOpen) {
                closeExitDialog();
                console.log("Auto-closed exit dialog - reached results phase");
            }

            // Show results phase with calculated data
            showResultsPhase();
            
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

// UPDATE resetToWaitingRoom to clear vote results
function resetToWaitingRoom() {
    console.log("Resetting to waiting room - starting new cycle...");
    
    // RESET VOTING PHASE FLAG
    isInVotingPhase = false;
    
    // Clear vote results for next round
    voteResults = null;
    selectedCatIndex = null; // Also reset selected cat
    
    // Clear the 5-minute results timeout
    if (resultsTimeout) {
        clearTimeout(resultsTimeout);
        resultsTimeout = null;
    }

    // Clear selection and disable voting clicks
    clearCatSelection();
    
    // Hide warning message and clear timeout
    hideWarningMessage();
    
    // Close any open exit dialog
    if (exitDialogOpen) {
        closeExitDialog();
    }

    // Remove any remaining voting interface elements
    const catDisplay = document.querySelector('.cat-display');
    const warningMessage = document.querySelector('.warning-message');
    const existingAnnouncement = document.querySelector('.announcement-text');
    const buttonsContainer = document.querySelector('.results-buttons');
    
    if (catDisplay) catDisplay.remove();
    if (warningMessage) warningMessage.remove();
    if (existingAnnouncement) existingAnnouncement.remove();
    if (buttonsContainer) buttonsContainer.remove(); // Clean up results buttons
    
    // Show album button again (in case it was hidden during results)
    const albumButton = document.querySelector('.album-button');
    if (albumButton) {
        albumButton.style.display = 'flex';
    }

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