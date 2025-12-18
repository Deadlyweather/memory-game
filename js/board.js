import { createCardElement, flipCard } from './card.js';

let currentTheme = "Fruits";

export const Themes = {
  Fruits: [
    '<img src="Apple.png" alt="Apple">',
    '<img src="Pear.png" alt="Pear">',
    '<img src="Cherry.png" alt="Cherry">',
    '<img src="Watermelon.png" alt="Watermelon">',
    '<img src="Grapes.png" alt="Grapes">',
    '<img src="Strawberry.png" alt="Strawberry">',
    '<img src="Banana.png" alt="Banana">',
    '<img src="Pineapple.png" alt="Pineapple">',
    '<img src="Kiwi.png" alt="Kiwi">',
    '<img src="Coconut.png" alt="Coconut">',
    '<img src="Peach.png" alt="Peach">',
    '<img src="Melon.png" alt="Melon">',
    '<img src="Lemon.png" alt="Lemon">',
    '<img src="Orange.png" alt="Orange">',
    '<img src="GreenApple.png" alt="GreenApple">',
    '<img src="Tomato.png" alt="Tomato">'
  ],
  Fantasy: [
    '<img src="Skull.png" alt="Skull">',
    '<img src="Sword.png" alt="Sword">',
    '<img src="Axe.png" alt="Axe">',
    '<img src="Mana_Potion.png" alt="Mana_Potion">',
    '<img src="Health_Potion.png" alt="Health_Potion">',
    '<img src="Wand.png" alt="Wand">',
    '<img src="Platinum.png" alt="Platinum">',
    '<img src="Shield.png" alt="Shield">',
    '<img src="Helmet.png" alt="Helmet">',
    '<img src="Copper.png" alt="Copper">',
    '<img src="Arrow.png" alt="Arrow">',
    '<img src="Trident.png" alt="Trident">',
    '<img src="Mace.png" alt="Mace">',
    '<img src="Bomb.png" alt="Bomb">',
    '<img src="Gold.png" alt="Gold">',
    '<img src="Silver.png" alt="Silver">'
  ]
};

function Choose() {
  return Themes[currentTheme] || Themes.Fruits;
  
}

const gameBoard = document.getElementById('game-board');
const galleria = document.getElementById("kuvagalleria");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let lastMatchValue = null;
let activeValue = null;
let Size = 0;

const Sound_Flip = new Audio("Flip.mp3");
const Sound_Error = new Audio("WRONG.mp3");
const Sound_Success = new Audio("Correct.mp3");
const Sound_Fail = new Audio("WRONG2.mp3");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateGallery() {
  if (!galleria) return;
  galleria.innerHTML = "";
  Choose().forEach(img => galleria.innerHTML += img + " ");
}

export function createBoard(cardCount) {
  lastMatchValue = null;
  activeValue = null;
  Size = cardCount;
  gameBoard.innerHTML = '';

  Yritykset = 1;
  Time = 0;
  Points = 0;
  Counter = null;

  document.getElementById("Yritykset").innerHTML = Yritykset;
  document.getElementById("Aika").innerHTML = 0;
  document.getElementById("Pisteet").innerHTML = 0;

  const cardsArray = [...Choose()];
  shuffle(cardsArray);

  const half = Math.min(cardCount / 2, cardsArray.length);
  const selected = cardsArray.slice(0, half);
  const cards = [...selected, ...selected];

  shuffle(cards);

  cards.forEach(symbol => {
    const cardElement = createCardElement(symbol);
    const match = symbol.match(/alt="([^"]+)"/);

    cardElement.dataset.card = match ? match[1] : symbol;
    cardElement.dataset.cardHTML = symbol;

    cardElement.addEventListener('click', onCardClicked);
    gameBoard.appendChild(cardElement);
  });

  resetBoard();
  updateGallery();
  updateDebug();

  Sound_Success.currentTime = 0;
  Sound_Success.play();
}

export function SetTheme(theme) {
  if (Themes[theme]) currentTheme = theme;
  document.getElementById("teema-valitsin").hidden = true
}

function onCardClicked(e) {
  if (!Counter) {
    Timer()
  }
  flipCard(e.currentTarget, handleCardFlip);
  Sound_Flip.currentTime = 0;
  Sound_Flip.play();
}

function handleCardFlip(cardElement) {
  if (lockBoard) return;
  if (cardElement === firstCard) return;

  cardElement.classList.add('flipped');
  cardElement.innerHTML = cardElement.dataset.cardHTML;

  if (!firstCard) {
    firstCard = cardElement;
    activeValue = cardElement.dataset.card;
    updateDebug();
    return;
  }

  secondCard = cardElement;
  lockBoard = true;
  updateDebug();
  checkForMatch();
}

function checkForMatch() {
  if (firstCard.dataset.card === secondCard.dataset.card) disableCards();
  else unflipCards();
}

function disableCards() {
  activeValue = firstCard.dataset.card;

  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  firstCard.removeEventListener('click', onCardClicked);
  secondCard.removeEventListener('click', onCardClicked);

  resetBoard();
  Sound_Success.currentTime = 0;
  Sound_Success.play();
  Voitto();
  updateDebug();
}

function unflipCards() {
  lockBoard = true;
  const f = firstCard;
  const s = secondCard;

  setTimeout(() => {
    if (f && !f.classList.contains('matched')) { f.classList.remove('flipped'); f.innerHTML = ''; }
    if (s && !s.classList.contains('matched')) { s.classList.remove('flipped'); s.innerHTML = ''; }
    resetBoard();
    Yritys();
    Sound_Error.currentTime = 0;
    Sound_Error.play();
  }, 800);
  updateDebug();
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  updateDebug();
}

let Speed = 1;
let Yritykset = 1;

function Yritys() {
  Yritykset++;
  document.getElementById("Yritykset").innerHTML = Yritykset;

  if (!Sound_Error.paused) {
    Speed *= 0.9;
    Sound_Error.playbackRate = Speed;
  } else {
    Sound_Error.playbackRate = 1;
    
  }

  if (Speed > 0.8) {
    Sound_Error.currentTime = 0;
    Sound_Error.play();
  } else {
    Sound_Error.pause();
    Sound_Fail.currentTime = 0;
    Sound_Fail.play();
    Speed = 1;
  }
}

let Voitot = 0;

function Voitto() {
  if (document.querySelectorAll('.card.matched').length !== Size) return;

  Voitot++;
  document.getElementById("Voitto_Näyttö").hidden = false;
  document.getElementById("Voitto_Yritys").innerHTML = Yritykset;
  document.getElementById("Loppu_Aika").innerHTML = Time.toFixed(1);
  document.getElementById("Loppu_Pisteet").innerHTML = Points.toFixed(2);

  clearInterval(Counter);
  Counter = null;

  setTimeout(() => document.getElementById("Voitot").innerHTML = Voitot, 500);
  setTimeout(() => {
    document.getElementById("Voitto_Näyttö").hidden = true
    resetBoard()
    createBoard(Size)
  }, 3000);
}

let Time = 0;
let Counter = null;
let Points = 0;

function Timer() {
  if (Counter) clearInterval(Counter);

  Counter = setInterval(() => {
    Pisteet();
    Time += 0.1;
    document.getElementById("Aika").innerHTML = Time.toFixed(1);
  }, 100);
}

function Pisteet() {
  Points = Size ** ((Size * 0.5) * (0.99 ** Time)) / (1 + (Yritykset / 10));
  document.getElementById("Pisteet").innerHTML = Points.toFixed(2);
}

function updateDebug() {
  const dc = document.getElementById('debug-cards');
  if (!dc) return;

  const all = document.querySelectorAll('.card');
  const rows = [];

  all.forEach((card, index) => {
    let state = 'hidden';
    let cls = 'debug-hidden';

    if (card.classList.contains('matched')) {
      state = 'matched';
      cls = 'debug-matched';
    }
    else if (activeValue && card.dataset.card === activeValue) {
      state = card.classList.contains('flipped') ? 'selected' : 'pair';
      cls = 'debug-current';
    }

    rows.push(
      `<span class="${cls}">${index + 1}. ${card.dataset.card} : ${state}</span>`
    );
  });

  dc.innerHTML = rows.join('<br>');
}
