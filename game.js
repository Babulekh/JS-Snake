const canvas = document.querySelector(".snake");
const canvasLength = Math.min(window.innerHeight, window.innerWidth);
const size = document.querySelector(".size");

let lastPart;

canvas.width = canvasLength;
canvas.height = canvasLength;

class Snake {
    constructor() {
        this.direction = "down";
        this.size = 1;
        this.headCoords = { x: 0, y: 0 };
        this.body = [{ x: 0, y: 0 }];
    }
}

class Game {
    constructor(canvas, cellsQuantity = 11) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this.cellsQuantity = cellsQuantity;
        this.cellLength = this.canvas.width / this.cellsQuantity;
        this.cells = new Array(this.cellsQuantity).fill(0).map(() => new Array(this.cellsQuantity).fill(0)); //0 - empty cell; 1 - snake; 2 - food
        
        this.colors = {
            empty: "rgb(200, 200, 0)",
            snake: "rgb(103, 65, 230)",
            food: "rgb(200, 0, 200)",
            0: "rgb(200, 200, 0)",
            1: "rgb(103, 65, 230)",
            2: "rgb(200, 0, 200)",
        };

        this.snake = new Snake();

        this.fillCell = function (x, y, fillStyle = this.colors.empty) {
            let radius = this.cellLength / 10;
            this.context.fillStyle = fillStyle;

            this.context.beginPath();
            this.context.moveTo(x * this.cellLength, y * this.cellLength + radius);
            this.context.lineTo(x * this.cellLength, y * this.cellLength + this.cellLength - radius);
            this.context.arcTo(x * this.cellLength, y * this.cellLength + this.cellLength, x * this.cellLength + radius, y * this.cellLength + this.cellLength, radius);
            this.context.lineTo(x * this.cellLength + this.cellLength - radius, y * this.cellLength + this.cellLength);
            this.context.arcTo(x * this.cellLength + this.cellLength, y * this.cellLength + this.cellLength, x * this.cellLength + this.cellLength, y * this.cellLength + this.cellLength - radius, radius);
            this.context.lineTo(x * this.cellLength + this.cellLength, y * this.cellLength + radius);
            this.context.arcTo(x * this.cellLength + this.cellLength, y * this.cellLength, x * this.cellLength + this.cellLength - radius, y * this.cellLength, radius);
            this.context.lineTo(x * this.cellLength + radius, y * this.cellLength);
            this.context.arcTo(x * this.cellLength, y * this.cellLength, x * this.cellLength, y * this.cellLength + radius, radius);
            this.context.fill();
        };

        this.setCell = function ({ x: X, y: Y }, value) {
            this.cells[Y][X] = value;
        };

        this.getCell = function ({ x: X, y: Y }) {
            return this.cells[Y][X];
        }
        

        this.start = function () {
            this.setCell(this.snake.headCoords, 1);
            this.draw();
            this.placeFood();

            setInterval(this.tick.bind(this), 300);
        };

        this.draw = function () {
            for (const [y, row] of this.cells.entries()) {
                for (const [x, cell] of row.entries()) {
                    this.fillCell(x, y, this.colors[cell]);
                }
            }
        };

        this.placeFood = function () {
            let x, y
            
            while (true) {
                [x, y] = [Math.floor(Math.random() * (this.cellsQuantity - 1)), Math.floor(Math.random() * (this.cellsQuantity - 1))];

                if (this.getCell({ x: x, y: y }) != 1) break;
            }
            
            this.setCell({x: x, y: y}, 2);
        };

        this.tick = function () {
            lastPart = this.snake.body.shift();
            console.log(lastPart, this.snake.headCoords, lastPart == this.snake.headCoords);
            this.setCell(lastPart, 0);

            switch (this.snake.direction) {
                case "up":
                    this.snake.headCoords.y = this.snake.headCoords.y == 0 ? this.cellsQuantity - 1 : this.snake.headCoords.y - 1;
                    break;
                case "down":
                    this.snake.headCoords.y = this.snake.headCoords.y == this.cellsQuantity - 1 ? 0 : this.snake.headCoords.y + 1;
                    break;
                case "left":
                    this.snake.headCoords.x = this.snake.headCoords.x == 0 ? this.cellsQuantity - 1 : this.snake.headCoords.x - 1;
                    break;
                case "right":
                    this.snake.headCoords.x = this.snake.headCoords.x == this.cellsQuantity - 1 ? 0 : this.snake.headCoords.x + 1;
                    break;
            }

            if (this.getCell(this.snake.headCoords) == 2) {
                console.log("food");
                this.snake.size++;
                this.placeFood();
                //this.snake.body.unshift(lastPart);
            }

            this.snake.body.push(this.snake.headCoords);

            for(let part of this.snake.body) {
                this.setCell(part, 1);
            }

            this.draw();

            size.innerHTML = this.snake.size;
        };
    }
}

let snake = new Game(canvas, 21);

snake.start();

document.onkeydown = function (event) {
    switch (event.key) {
        case "ArrowUp":
            snake.snake.direction = "up";
            break;
        case "ArrowDown":
            snake.snake.direction = "down";
            break;
        case "ArrowLeft":
            snake.snake.direction = "left";
            break;
        case "ArrowRight":
            snake.snake.direction = "right";
            break;
    }
};
