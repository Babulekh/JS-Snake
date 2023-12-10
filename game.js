import { Game } from './classes.js';
const canvas = document.querySelector('.snake');
if (!canvas)
    throw Error('No canvas element');
if (!(canvas instanceof HTMLCanvasElement))
    throw Error('Element with snake class is not a canvas');
const canvasLength = Math.min(window.innerHeight, window.innerWidth);
canvas.width = canvasLength;
canvas.height = canvasLength;
const sizeCounter = document.querySelector('.size');
if (!sizeCounter)
    throw Error('No size counter element');
const snake = new Game(canvas, 21, sizeCounter);
snake.start();
const restart = document.querySelector('.restart');
if (!restart)
    throw Error('No restart element');
restart.addEventListener('click', snake.start);
//# sourceMappingURL=game.js.map