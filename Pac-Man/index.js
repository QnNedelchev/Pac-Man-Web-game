import { LEVEL, OBJECT_TYPE } from './setup.js'
import { randomMovement } from './ghostMoves.js'

//CLASSES
import { GameBoard } from './GameBoard.js'
import { Pacman } from './Pacman.js'
import { Ghost } from './Ghost.js'

//SOUNDS
/*import { soundDot }  from './sounds/munch.wav'
import { soundPill } from  './sounds/pill.wav'
import { soundGameStart } from  './sounds/game_start.wav'
import { soundGameOver } from  './sounds/death.wav'
import { soundGhost } from  './sounds/eat_ghost.wav'*/

//DOM Elements
const gameGrid = document.getElementById('game')
const scoreDisplay = document.getElementById('score')
const startBtn = document.querySelector('.start-button')

//Game Constants
const POWER_PILL_TIME = 10000; // ms
const GLOBAL_SPEED = 80; // ms
// Initializing the Game Board
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL); 

//Initial Setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

//Audio
function playAudio(audio){
    const soundEffect = new Audio(audio);
    soundEffect.play();
}

function gameOver(pacman, grid)
{
    //playAudio(soundGameOver);
    document.removeEventListener('keydown', e => 
    pacman.handleKeyInput(e, gameBoard.objectExist))
    
    gameBoard.showGameStatus(gameWin);
    clearInterval(timer);
    startBtn.classList.remove('hide');
}

function checkCollision(pacman, ghosts)
{
    const collidedGhost = ghosts.find( ghost => pacman.pos === ghost.pos);
    
    if (collidedGhost) {
        if(pacman.powerPill) {
            //playAudio(soundGhost);
            gameBoard.removeObject(collidedGhost.pos, [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED,collidedGhost.name]);
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        }
        else {
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos, 0)
            gameOver(pacman, gameGrid);
        }
    }
}

function gameLoop(pacman, ghosts){
    if (powerPillActive)
        powerPillTimer--;
    
    gameBoard.moveCharacter(pacman);
    checkCollision(pacman, ghosts);

    ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
    checkCollision(pacman, ghosts);
    
    //Check if pacman eats a dot
    if(gameBoard.objectExist(pacman.pos, [OBJECT_TYPE.DOT]))
    {
        //playAudio(soundDot);
        score += 10;
        gameBoard.dotCount--;
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        
    }
    
    //Check if pacman eats powerpill
    if(gameBoard.objectExist(pacman.pos, [OBJECT_TYPE.PILL]))
    {
        //playAudio(soundPill);
        score += 50;
        pacman.powerPill = true;
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
        
        clearTimeout(powerPillTimer)
        powerPillTimer = setTimeout( () => (pacman.powerPill = false), POWER_PILL_TIME);  
    }
    
    //Change ghosts
    if (pacman.powerPill !== powerPillActive)
    {
        powerPillActive = pacman.powerPill;
        ghosts.forEach(ghost => (ghost.isScared = pacman.powerPill))
    }
    
    //Check win condition
    if (gameBoard.dotCount === 0)
    {
        gameWin = true;
        gameOver(pacman, ghosts);
    }
    
    //Show the Score
    scoreDisplay.innerHTML = score; 
}

function startGame()
{
    //playAudio(soundGameStart);
    gameWin = false;
    powerPillActive = false;
    score = 0;
    scoreDisplay.innerHTML = '';
    scoreDisplay.style.cssText = `font-size: 2rem;`
    startBtn.classList.add('hide');
    
    gameBoard.createGrid(LEVEL);
    const pacman = new Pacman(2, 287);
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
   
    
    document.addEventListener('keydown', (e) => {
        pacman.handleKeyInput(e, gameBoard.objectExist)
    });
    
    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(6, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(4, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(3, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ];
    
    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

//Initialize Game 
startBtn.addEventListener('click', startGame);




