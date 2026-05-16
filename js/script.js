/* =========================================
   1. GLOBAL INITIALIZATION
   ========================================= */
document.addEventListener("DOMContentLoaded", function() {
    initTypewriter();
    initContactInfo();
    initMemoryGame();
});

/* =========================================
   2. TYPEWRITER EFFECT (Header)
   ========================================= */
function initTypewriter() {
    const text = "Hi, I'm Aayush.";
    const element = document.getElementById("typewriter-text");
    const cursor = document.querySelector(".cursor");
    
    if (!element || !cursor) return;
    
    let index = 0;
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            cursor.classList.add("typing-done");
        }
    }
    
    setTimeout(type, 500);
}

/* =========================================
   3. CONTACT INFO INJECTION (Anti-Bot)
   ========================================= */
function initContactInfo() {
    const container = document.getElementById('contact-container');
    if (!container) return;

    const part1 = "aayushh";
    const part2 = "outlook.com.au";
    const email = part1 + "@" + part2;
    const phone = "0448 113 330";

    container.innerHTML = `
        <p style="margin-bottom: 0.5rem;">
            Email: <a href="mailto:${email}"><strong>${email}</strong></a>
        </p>
        <p style="margin-bottom: 0.5rem;">
            Phone: <strong>${phone}</strong>
        </p>
        <p style="margin-bottom: 0.5rem;">
            LinkedIn: <a href="https://linkedin.com/in/aayushacharya" target="_blank">linkedin.com/in/aayushacharya</a>
        </p>
        <p style="margin-bottom: 1.5rem;">
            GitHub: <a href="https://github.com/hi-its-aayush" target="_blank">github.com/hi-its-aayush</a>
        </p>
    `;
}

/* =========================================
   4. GAME 1: SPEED GRID
   ========================================= */
const startBtn = document.getElementById("grid-start");
const restartBtn = document.getElementById("grid-restart");
const quitBtn = document.getElementById("grid-quit");
const abortBtn = document.getElementById("grid-abort");
const gridArea = document.getElementById("grid-area");
const timerDisplay = document.getElementById("grid-timer");
const resultDisplay = document.getElementById("grid-result");
const introMessage = document.getElementById("grid-intro");
const buttonsRow = document.getElementById("grid-buttons");

let nextNumber = 1;
let startTime;
let timerInterval;

if (startBtn) {
    startBtn.addEventListener("click", startGridGame);
    restartBtn.addEventListener("click", startGridGame);
    
    abortBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        gridArea.innerHTML = "";
        resultDisplay.innerText = "Game Aborted";
        resultDisplay.style.color = "#ef4444";
        resultDisplay.style.marginBottom = "1rem";
        abortBtn.style.display = "none";
        buttonsRow.style.display = "flex";
    });

    quitBtn.addEventListener("click", () => {
        gridArea.style.display = "none";
        timerDisplay.style.display = "none";
        buttonsRow.style.display = "none";
        abortBtn.style.display = "none";
        resultDisplay.textContent = "";
        startBtn.style.display = "inline-block";
        introMessage.style.display = "block";
    });
}

function startGridGame() {
    nextNumber = 1;
    resultDisplay.textContent = "";
    
    buttonsRow.style.display = "none";
    startBtn.style.display = "none";
    introMessage.style.display = "none";
    abortBtn.style.display = "inline-block";
    gridArea.style.display = "grid";
    timerDisplay.style.display = "block";

    timerDisplay.textContent = "Time: 0.00s";
    startTime = Date.now();
    timerInterval = setInterval(updateGridTimer, 10);

    const numbers = Array.from({ length: 16 }, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5);

    gridArea.innerHTML = "";

    numbers.forEach(num => {
        const cell = document.createElement("div");
        cell.textContent = num;
        
        cell.style.padding = "1rem";
        cell.style.background = "#262626"; 
        cell.style.color = "#ffffff";      
        cell.style.borderRadius = "8px";
        cell.style.fontSize = "1.2rem";
        cell.style.fontWeight = "600";
        cell.style.cursor = "pointer";
        cell.style.userSelect = "none";
        cell.style.textAlign = "center";
        cell.style.transition = "background 0.2s, transform 0.1s";

        cell.addEventListener("click", () => handleGridClick(num, cell));
        gridArea.appendChild(cell);
    });
}

function handleGridClick(num, cell) {
    if (num === nextNumber) {
        cell.style.background = "#059669";
        cell.style.color = "#ffffff";
        cell.style.pointerEvents = "none";
        nextNumber++;

        if (nextNumber > 16) endGridGame();
    } else {
        cell.style.background = "#dc2626";
        cell.style.transform = "translateX(5px)";
        setTimeout(() => {
            cell.style.background = "#262626"; 
            cell.style.transform = "translateX(0)";
        }, 300);
    }
}

function updateGridTimer() {
    const elapsed = (Date.now() - startTime) / 1000;
    timerDisplay.textContent = "Time: " + elapsed.toFixed(2) + "s";
}

function endGridGame() {
    clearInterval(timerInterval);
    const finalTime = timerDisplay.textContent.replace("Time: ", "");
    
    resultDisplay.textContent = "Nice work! Completed in " + finalTime + ".";
    resultDisplay.style.color = "#ededed"; 
    resultDisplay.style.marginBottom = "1rem";
    
    abortBtn.style.display = "none";
    buttonsRow.style.display = "flex";
}

/* =========================================
   5. GAME 2: TECH MEMORY
   ========================================= */
const memoryBoard = document.getElementById('memory-board');
const memMovesDisplay = document.getElementById('mem-moves');
const memScoreDisplay = document.getElementById('mem-score');
const memRestartBtn = document.getElementById('mem-restart');
const memResult = document.getElementById('mem-result');
const memPlayAgain = document.getElementById('mem-play-again');
const memInstructions = document.getElementById('mem-instructions');

const icons = [
    'fa-wifi', 'fa-database', 'fa-server', 'fa-bug', 
    'fa-microchip', 'fa-terminal', 'fa-lock', 'fa-cloud'
];

let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matches = 0;

if (memRestartBtn) memRestartBtn.addEventListener('click', initMemoryGame);
if (memPlayAgain) memPlayAgain.addEventListener('click', initMemoryGame);

function initMemoryGame() {
    if (!memoryBoard) return;
    
    memoryBoard.innerHTML = '';
    memoryBoard.style.display = 'grid'; 
    if (memRestartBtn) memRestartBtn.style.display = 'inline-block'; 
    if (memResult) memResult.style.display = 'none'; 
    if (memInstructions) memInstructions.style.display = 'block';
    
    moves = 0;
    matches = 0;
    if(memMovesDisplay) memMovesDisplay.innerText = moves;
    if(memScoreDisplay) memScoreDisplay.innerText = matches;
    
    let deck = [...icons, ...icons];
    deck.sort(() => 0.5 - Math.random());

    deck.forEach(iconClass => {
        const card = document.createElement('div');
        card.classList.add('mem-card');
        card.dataset.icon = iconClass;

        card.innerHTML = `
            <div class="mem-front"><i class="fas fa-question"></i></div>
            <div class="mem-back"><i class="fas ${iconClass}"></i></div>
        `;
        
        card.addEventListener('click', flipCard);
        memoryBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    if(memMovesDisplay) memMovesDisplay.innerText = moves;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    matches++;
    if(memScoreDisplay) memScoreDisplay.innerText = matches;
    
    if(matches === 8) {
        setTimeout(() => {
            memoryBoard.style.display = 'none';
            if (memRestartBtn) memRestartBtn.style.display = 'none';
            if (memInstructions) memInstructions.style.display = 'none';
            if (memResult) memResult.style.display = 'block';
        }, 500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}
