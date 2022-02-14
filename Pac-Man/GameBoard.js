import { GRID_SIZE, CELL_SIZE, OBJECT_TYPE, CLASS_LIST, COLOR, COLORS } from './setup.js'

export class GameBoard {
    constructor(DOMGrid) {
        this.dotCount = 0;
        this.grid = [];
        this.DOMGrid = DOMGrid;
    }
    
    showGameStatus(gameWin) {
        const div = document.createElement('div');
        div.classList.add('game-status');
        div.innerHTML = `${gameWin ? 'WIN!' : 'GAME OVER!'}`;
        this.DOMGrid.appendChild(div);
    }
    
    createGrid(level) {
        this.dotCount = 0;
        this.grid = [];
        this.DOMGrid.innerHTML = '';
        this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px`
        
        level.forEach(square => {
            const div = document.createElement('div');
            div.classList.add('square', CLASS_LIST[square]);
            div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`
            
            //Get random color
            if (CLASS_LIST[square] === OBJECT_TYPE.WALL)
            {
                const colorIndex = Math.floor(Math.random() * COLORS.length);
                const color = COLORS[colorIndex];
                div.style.cssText = `border-color: ${color};`
            }
      
            this.DOMGrid.appendChild(div);
            this.grid.push(div);
            
            if (CLASS_LIST[square] === OBJECT_TYPE.DOT)
                this.dotCount++;
        })         
    };
    
    addObject(pos, classes) {
        this.grid[pos].classList.add(...classes);
    };
    
    removeObject(pos, classes) {
        this.grid[pos].classList.remove(...classes);
    };
    
    objectExist = (pos, object) => {
        return this.grid[pos].classList.contains(object);
    };
    
    rotateDiv(pos, deg) {
        this.grid[pos].style.transform = `rotate(${deg}deg)`;
    };
    
    moveCharacter(character){
           if(character.shouldMove()) {
               const { nextMovePos, direction } = character.getNextMove(this.objectExist);
               const { classesToRemove, classesToAdd } = character.makeMove();
               
               //It will only be applicable for Pacman
               if(character.rotation && nextMovePos !== character.pos){
                   this.rotateDiv(nextMovePos, character.dir.rotation);
                   this.rotateDiv(character.pos, 0);
               }
               
               this.removeObject(character.pos, classesToRemove);
               this.addObject(nextMovePos, classesToAdd);
               
               character.setNewPos(nextMovePos, direction);
           }
    };
    
    static createGameBoard(DOMGrid, level) {
        const board = new this(DOMGrid);
        board.createGrid(level);
        return board;
    }
}
