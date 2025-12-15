import { createCardElement, flipCard } from './card.js';

const allCards = [
  '🍎','🍐','🍒','🍉','🍇','🍓','🍌','🍍',
  '🥝','🥥','🍑','🍈','🍋','🍊','🍏','🍅'
];

const gameBoard = document.getElementById('game-board');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let Size = false;

function shuffle(array) {
  for (let Primary = array.length - 1; Primary > 0; Primary--) {
    const Secondary = Math.floor(Math.random() * (Primary + 1));
    [array[Primary], array[Secondary]] = [array[Secondary], array[Primary]];
  }
}

export function createBoard(cardCount) {
  Size = cardCount;
  gameBoard.innerHTML = '';
  const selected = allCards.slice(0, cardCount / 2);
  const cards = [...selected, ...selected];
  shuffle(cards);

  cards.forEach(symbol => {
    const cardElement = createCardElement(symbol);

    cardElement.dataset.card = symbol;
    cardElement.addEventListener('click', onCardClicked);
    gameBoard.appendChild(cardElement);
  });

  resetBoard();
  updateDebug();
}

function onCardClicked(e) {
  flipCard(e.currentTarget, handleCardFlip);
}

function handleCardFlip(cardElement) {
  if (lockBoard) return;

  if (cardElement.classList.contains('flipped') ||
      cardElement.classList.contains('matched')) return;

  const open = document.querySelectorAll('.card.flipped:not(.matched)');
  if (open.length === 2) {
    InstaUnflip();
    return;
  }

  cardElement.classList.add('flipped');
  cardElement.textContent = cardElement.dataset.card;

  if (!firstCard) {
    firstCard = cardElement;
    updateDebug();
    return;
  }

  secondCard = cardElement;
  updateDebug();
  checkForMatch();
}

function checkForMatch() {
  const a = firstCard?.dataset?.card;
  const b = secondCard?.dataset?.card;
  if (a === undefined || b === undefined) {
    unflipCards();
    return;
  }

  const isMatch = a === b;
  if (isMatch) disableCards();
  else unflipCards();

  updateDebug();
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  firstCard.removeEventListener('click', onCardClicked);
  secondCard.removeEventListener('click', onCardClicked);

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  updateDebug();
  Voitto()
}

function unflipCards() {
  lockBoard = true;
  updateDebug();

  const f = firstCard;
  const s = secondCard;

  if (!f || !s) {
    resetBoard();
    updateDebug();
    return;
  }

  setTimeout(() => {
    if (f && !f.classList.contains('matched')) {
      f.classList.remove('flipped');
      f.textContent = '';
    }
    if (s && !s.classList.contains('matched')) {
      s.classList.remove('flipped');
      s.textContent = '';
    }

    resetBoard();
    updateDebug();
    Yritys()
  }, 800);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function InstaUnflip() {
  lockBoard = true;

  const open = Array.from(document.querySelectorAll('.card.flipped:not(.matched)'));
  if (open.length === 0) {
    resetBoard();
    return;
  }

  open.forEach(card => {
    card.classList.remove('flipped');
    card.textContent = '';
  });

  resetBoard();
  updateDebug();
  Yritys()
}

let Yritykset = 1
function Yritys() {
    Yritykset += 1
    document.getElementById("Yritykset").innerHTML = Yritykset
}

function TerminateBoard() {
  gameBoard.innerHTML = '';
  resetBoard()
  createBoard(Size);
  updateDebug()
  Yritykset = 0
  document.getElementById("Yritykset").innerHTML = Yritykset
}
let Voitot = 0
function Voitto() {
  document.getElementById("Voitto_Yritys").innerHTML = Yritykset
  setTimeout(() => {
    const Accuired = document.querySelectorAll('.card.matched').length;
    const Required = document.querySelectorAll('.card').length;
    if (Accuired === Required) {
      TerminateBoard()
    }
    document.getElementById("Voitot").innerHTML = Voitot
  }, 5000)
}
function updateDebug() {
  const df = document.getElementById('debug-first');
  const ds = document.getElementById('debug-second');
  const dl = document.getElementById('debug-lock');
  const dfp = document.getElementById('debug-flipped');
  const dm = document.getElementById('debug-matched');
  const dc = document.getElementById('debug-cards');

  if (df) df.textContent = firstCard ? firstCard.dataset.card : 'null';
  if (ds) ds.textContent = secondCard ? secondCard.dataset.card : 'null';
  if (dl) dl.textContent = lockBoard;
  if (dfp) dfp.textContent = document.querySelectorAll('.card.flipped').length;
  if (dm) dm.textContent = document.querySelectorAll('.card.matched').length;

  if (dc) {
    const all = document.querySelectorAll('.card');
    const states = [];
    all.forEach(card => {
      let state = 'hidden';
      if (card.classList.contains('matched')) state = 'matched';
      else if (card.classList.contains('flipped')) state = 'flipped';
      states.push(`${card.dataset.card} : ${state}`);
    });
    dc.textContent = states.join('\n');
  }
}