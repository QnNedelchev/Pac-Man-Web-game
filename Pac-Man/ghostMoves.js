import {DIRECTIONS, OBJECT_TYPE } from './setup.js'

//Primitive random movement
export function randomMovement(position, direction, objectExist) {
    let dir = direction;
    let nextMovePos = position + dir.movement;
    
    const keys = Object.keys(DIRECTIONS);
    
    while (objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)) {
            //Get random key
            const key = keys[Math.floor(Math.random() * keys.length)];
            //Set the next direction from the DIRECTIONS object
            dir = DIRECTIONS[key];
            //Set the next Move based on current position and the direction
            nextMovePos = position + dir.movement;
    } 
        
    return { nextMovePos, direction: dir }
}