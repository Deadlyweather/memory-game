import { createBoard } from './board.js';

document.addEventListener('DOMContentLoaded', () => {
    const AloitaNappi = document.getElementById("aloitaPeli");
    const KorttiInput = document.getElementById("Korttien_Määrä");
    const gameBoard = document.getElementById('game-board');

    AloitaNappi.addEventListener('click', () => {
        const cardCount = parseInt(KorttiInput.value, 10);

        if (!cardCount || cardCount < 2 || cardCount % 2 !== 0) {
            alert("Korttien määrän täytyy olla parillinen luku, vähintään 2.");
            return;
        }
        const columns = Math.ceil(cardCount / Math.floor(Math.sqrt(cardCount)));
        
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        createBoard(cardCount);
        AloitaNappi.style.display = "none";
        KorttiInput.style.display = "none";
    });
});