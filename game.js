const canvas = document.querySelector('.snake');
const canvasLength = Math.min(window.innerHeight, window.innerWidth);
const restart = document.querySelector('.restart');
const sizeCounter = document.querySelector('.size');
canvas.width = canvasLength;
canvas.height = canvasLength;
class Snake {
    constructor() {
        this.direction = "down" /* Directions.Down */;
        this.currentDirection = "down" /* Directions.Down */;
        this.size = 0;
        this.body = [];
    }
}
class Game {
    constructor(canvas, cellsQuantity = 11) {
        this.snake = new Snake();
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.cellsQuantity = cellsQuantity;
        this.cellLength = this.canvas.width / this.cellsQuantity;
        this.cells = new Array(this.cellsQuantity).fill("rgb(255, 215, 0)" /* CellTypes.Empty */).map(() => new Array(this.cellsQuantity).fill("rgb(255, 215, 0)" /* CellTypes.Empty */));
    }
    fillCell(x, y, fillStyle = "rgb(255, 215, 0)" /* CellTypes.Empty */) {
        let radius = this.cellLength / 10;
        const [xCoord, yCoord] = [x * this.cellLength, y * this.cellLength];
        this.context.fillStyle = fillStyle;
        this.context.beginPath();
        this.context.moveTo(xCoord, yCoord + radius);
        this.context.lineTo(xCoord, yCoord + this.cellLength - radius);
        this.context.arcTo(xCoord, yCoord + this.cellLength, xCoord + radius, yCoord + this.cellLength, radius);
        this.context.lineTo(xCoord + this.cellLength - radius, yCoord + this.cellLength);
        this.context.arcTo(xCoord + this.cellLength, yCoord + this.cellLength, xCoord + this.cellLength, yCoord + this.cellLength - radius, radius);
        this.context.lineTo(xCoord + this.cellLength, yCoord + radius);
        this.context.arcTo(xCoord + this.cellLength, yCoord, xCoord + this.cellLength - radius, yCoord, radius);
        this.context.lineTo(xCoord + radius, yCoord);
        this.context.arcTo(xCoord, yCoord, xCoord, yCoord + radius, radius);
        this.context.fill();
    }
    setCell({ x, y }, value) {
        this.cells[y][x] = value;
    }
    getCell({ x, y }) {
        return this.cells[y][x];
    }
    start() {
        for (let y = 0; y < this.cellsQuantity; y++) {
            for (let x = 0; x < this.cellsQuantity; x++) {
                this.cells[y][x] = "rgb(255, 215, 0)" /* CellTypes.Empty */;
            }
        }
        this.snake.body = [{ x: 0, y: 0 }];
        this.snake.size = 1;
        sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
        this.setCell(this.snake.body[0], "rgb(243, 135, 47)" /* CellTypes.Snake */);
        this.draw();
        this.placeFood();
        clearInterval(this.timer);
        this.timer = setInterval(this.tick.bind(this), 100);
    }
    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const [y, row] of this.cells.entries()) {
            for (const [x, cell] of row.entries()) {
                this.fillCell(x, y, cell);
            }
        }
    }
    placeFood() {
        let x, y;
        while (true) {
            [x, y] = [Math.floor(Math.random() * (this.cellsQuantity - 1)), Math.floor(Math.random() * (this.cellsQuantity - 1))];
            if (this.getCell({ x: x, y: y }) != "rgb(243, 135, 47)" /* CellTypes.Snake */)
                break;
        }
        this.setCell({ x: x, y: y }, "rgb(21, 178, 211)" /* CellTypes.Food */);
    }
    tick() {
        let head = { x: this.snake.body[0].x, y: this.snake.body[0].y };
        let lastPart = this.snake.body.pop();
        this.setCell(lastPart, "rgb(255, 215, 0)" /* CellTypes.Empty */);
        if (this.snake.direction == this.snake.currentDirection) {
            this.snake.direction = this.snake.currentDirection;
        }
        switch (this.snake.direction) {
            case "up" /* Directions.Up */:
                head.y = head.y == 0 ? this.cellsQuantity - 1 : head.y - 1;
                break;
            case "down" /* Directions.Down */:
                head.y = head.y == this.cellsQuantity - 1 ? 0 : head.y + 1;
                break;
            case "left" /* Directions.Left */:
                head.x = head.x == 0 ? this.cellsQuantity - 1 : head.x - 1;
                break;
            case "right" /* Directions.Right */:
                head.x = head.x == this.cellsQuantity - 1 ? 0 : head.x + 1;
                break;
        }
        this.snake.body.unshift(head);
        if (this.getCell(head) == "rgb(243, 135, 47)" /* CellTypes.Snake */) {
            clearInterval(this.timer);
            alert('gameover');
            return;
        }
        if (this.getCell(head) == "rgb(21, 178, 211)" /* CellTypes.Food */) {
            this.placeFood();
            this.snake.body.push(lastPart);
            this.snake.size++;
            sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
        }
        for (let part of this.snake.body) {
            this.setCell(part, "rgb(243, 135, 47)" /* CellTypes.Snake */);
        }
        this.snake.currentDirection = this.snake.direction;
        this.draw();
    }
}
let snake = new Game(canvas, 21);
snake.start();
document.onkeydown = function (event) {
    switch (event.key) {
        case 'ArrowUp':
            snake.snake.direction = "up" /* Directions.Up */;
            break;
        case 'ArrowDown':
            snake.snake.direction = "down" /* Directions.Down */;
            break;
        case 'ArrowLeft':
            snake.snake.direction = "left" /* Directions.Left */;
            break;
        case 'ArrowRight':
            snake.snake.direction = "right" /* Directions.Right */;
            break;
    }
};
restart.addEventListener('click', snake.start.bind(snake));
//# sourceMappingURL=game.js.map