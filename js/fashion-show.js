let isInVotingPhase = false;
let exitDialogOpen = false;
let selectedCatIndex = null;
let playerOwnedCatIndex = 0;
let warningTimeout = null;
let resultsTimeout = null;

let catId = null;
let selectedCat = null;
let userCats = [];

const placeholderCats = [
  { catName: "Mr. Grumpy Pants", username: "who_dis723" },
  { catName: "Juliet", username: "strawberry_banana" },
  { catName: "Smiley", username: "(:_smile_:)" },
  { catName: "Cookie", username: "my_username_sucks" },
  { catName: "Elvis", username: "the_king_91" }
];

// Fetch user cats and initialize
fetch("../data/usercats.json")
  .then(res => res.json())
  .then(data => {
    userCats = data;
    window.userCats = userCats;

    const urlParams = new URLSearchParams(window.location.search);
    catId = urlParams.get("catId");
    selectedCat = userCats.find(c => c.id == catId);

    if (selectedCat) {
      console.log("🐾 Selected cat from album is:", selectedCat);
      placeholderCats[0] = {
        catName: selectedCat.name,
        username: "You"
      };
    } else {
      console.warn("❌ No matching cat found for ID:", catId);
    }

    document.dispatchEvent(new Event("CatsReady"));
  })
  .catch(err => {
    console.error("❌ Failed to load usercats.json", err);
  });

let playerCount = 1;
const maxPlayers = 5;
let counterInterval;
let votingTimer;
let timeRemaining = 30;

function startCounter() {
  counterInterval = setInterval(() => {
    if (playerCount < maxPlayers) {
      playerCount++;
      updateCounterDisplay();
      if (playerCount === maxPlayers) {
        clearInterval(counterInterval);
        setTimeout(() => {
          transitionToVotingPhase();
        }, 2000);
      }
    }
  }, 1000);
}

function updateCounterDisplay() {
  const counterElement = document.getElementById('player-counter');
  if (counterElement) counterElement.textContent = `${playerCount}/5`;
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

  for (let i = 0; i < 5; i++) {
    const stageBase = document.createElement('div');
    stageBase.className = 'stage-base';
    stageBase.setAttribute('data-cat-index', i);

    const stageWalkway = document.createElement('img');
    stageWalkway.src = '../assets/icons/stage-walkway.png';
    stageWalkway.alt = 'Stage Walkway';
    stageWalkway.className = 'stage-walkway';
    stageBase.appendChild(stageWalkway);

    const catSprite = document.createElement('img');
    catSprite.className = 'cat-sprite';
    catSprite.alt = placeholderCats[i].catName;
    catSprite.src =
      i === 0 && selectedCat ? selectedCat.image : '../assets/cats/placeholder-fashion-show-cat.png';
    stageBase.appendChild(catSprite);

    const catName = document.createElement('div');
    catName.className = 'cat-name';
    catName.textContent = placeholderCats[i].catName;
    stageBase.appendChild(catName);

    const username = document.createElement('div');
    username.className = 'username';
    username.textContent = placeholderCats[i].username;
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
  if (!isInVotingPhase) return;

  if (catIndex === playerOwnedCatIndex) {
    showOwnCatWarning(catIndex);
    return;
  }

  hideWarningMessage();
  clearCatSelection();
  selectedCatIndex = catIndex;

  const stageBases = document.querySelectorAll('.stage-base');
  stageBases[catIndex]?.classList.add('selected');
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

function startDetailedSequence() {
  const announcement = document.querySelector('.announcement-text');

  setTimeout(() => {
    if (announcement) announcement.textContent = 'VOTE!';

    setTimeout(() => {
      showTimer();
      moveAlbumButtonUp();
      if (announcement) announcement.textContent = 'Waiting for all players to vote . . .';
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
  timeRemaining = 30;
  updateTimerDisplay();

  votingTimer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining === 10) changeTimerToRed();
    if (timeRemaining <= 0) {
      clearInterval(votingTimer);
      isInVotingPhase = false;
      disableVotingClicks();
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

document.addEventListener('CatsReady', () => {
  console.log("Fashion Show page ready with selected cat");
  startCounter();

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
