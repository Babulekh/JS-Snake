import { Game } from './classes.js';
const canvas = document.querySelector('.snake');
const canvasLength = Math.min(window.innerHeight, window.innerWidth);
canvas.width = canvasLength;
canvas.height = canvasLength;
const sizeCounter = document.querySelector('.size');
const snake = new Game(canvas, 21, sizeCounter);
snake.start();
const restart = document.querySelector('.restart');
restart.addEventListener('click', snake.start.bind(snake));
//# sourceMappingURL=game.js.map