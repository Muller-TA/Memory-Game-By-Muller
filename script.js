/* ============================================ */
/* Memory Game - CRUD Version (Final) */
/* ============================================ */

// ========================= CREATE =========================
// Select DOM elements & initialize variables
const duration = 1000;
const blocksContainer = document.querySelector('.memory-game-blocks');
const blocks = Array.from(blocksContainer.children);
const triesElement = document.querySelector('.tries span');
let tries = 0;
let win = document.getElementById('success');
let lose = document.getElementById('fail');
// Start game when the button is clicked
document.querySelector('.control-buttons span').addEventListener('click', startGame);

function startGame() {
  // Ask for player name and display it
  const playerName = prompt('Enter your name Sir: ');
  document.querySelector('.name span').textContent = playerName?.trim() || 'Unknown';

  // Remove start screen
  document.querySelector('.control-buttons').remove();

  // Show all cards briefly
  blocksContainer.classList.add('no-clicking');
  blocks.forEach(block => block.classList.add('is-flipped'));
  setTimeout(() => {
    blocks.forEach(block => block.classList.remove('is-flipped'));
    blocksContainer.classList.remove('no-clicking');
  }, duration);

  // Shuffle card order and assign to CSS Grid
  const orderRange = [...Array(blocks.length).keys()];
  shuffle(orderRange);
  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    block.addEventListener('click', () => flipBlock(block));
  });
}

// ========================= READ =========================
// Shuffle array function
function shuffle(array) {
  let current = array.length, temp, random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}

// ========================= UPDATE =========================
// Flip cards and check for match
function flipBlock(selectedBlock) {
  // Prevent flipping matched cards
  if (selectedBlock.classList.contains('is-flipped') || selectedBlock.classList.contains('matched')) return;

  // Flip the selected card
  selectedBlock.classList.add('is-flipped');

  // Get currently flipped but unmatched cards
  const flippedBlocks = blocks.filter(b => b.classList.contains('is-flipped') && !b.classList.contains('matched'));

  // If two cards flipped → check match
  if (flippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(flippedBlocks[0], flippedBlocks[1]);
  }
}

// Temporarily stop clicking
function stopClicking() {
  blocksContainer.classList.add('no-clicking');
  setTimeout(() => blocksContainer.classList.remove('no-clicking'), duration);
}

// Check if two cards match
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    // MATCH → keep them flipped and disable any further actions
    [firstBlock, secondBlock].forEach(b => {
      b.classList.add('matched');
      b.style.pointerEvents = 'none';
    });
    win?.play();
    checkAllMatched();
  } else {
    // WRONG → flip back and increase tries
    tries++;
    triesElement.textContent = tries;
    lose?.play();

    setTimeout(() => {
      firstBlock.classList.remove('is-flipped');
      secondBlock.classList.remove('is-flipped');
    }, duration);
  }
}

// ========================= DELETE =========================
// Check if all cards are matched
function checkAllMatched() {
  const allMatched = blocks.every(block => block.classList.contains('matched'));
  if (allMatched) {
    setTimeout(() => {
      alert(`Congratulations! You matched all the cards!\nWrong tries: ${tries}`);
      setTimeout(() => window.location.reload(), 500);
    }, duration);
  }
}
