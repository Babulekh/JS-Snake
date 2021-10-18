const canvas = document.querySelector(".snake");
const canvasLength = Math.min(window.innerHeight, window.innerWidth);

canvas.width = canvasLength;
canvas.height = canvasLength;

class Snake {
    constructor(canvas, cellsQuantity = 11) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this.cellsQuantity = cellsQuantity;
        this.cellLength = this.canvas.width / this.cellsQuantity;
        this.cells = []; //0 - empty cell; 1 - snake; 2 - food

        this.colors = {
            empty: "rgb(200, 200, 0)",
            snake: "rgb(103, 65, 230)",
            food: "rgb(200, 0, 200)",
        };

        this.snake = {
            lifes: 3,
            direction: "down",
            size: 1,
            x: 5,
            y: 5,
        };

        this.fillCell = function (x, y, fillStyle = this.colors.empty) {
            let radius = this.cellLength / 20;
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

        this.start = function () {
            for (let x = 0; x < this.cellsQuantity; x++) {
                this.cells.push([]);
                for (let y = 0; y < this.cellsQuantity; y++) {
                    this.cells[x].push(0);
                    this.fillCell(x, y, this.colors.empty);
                }
            }

            this.fillCell(this.snake.x, this.snake.y, this.colors.snake);
            this.cells[this.snake.x][this.snake.y] = 1;

            setInterval(this.tick.bind(this), 100);
        };

        this.tick = function () {
            switch (this.snake.direction) {
                case "up":
                    this.cells[this.snake.x][this.snake.y] = 0;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.empty);

                    this.snake.y = this.snake.y == 0 ? this.cellsQuantity - 1 : this.snake.y - 1;

                    this.cells[this.snake.x][this.snake.y] = 1;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.snake);
                    break;
                case "down":
                    this.cells[this.snake.x][this.snake.y] = 0;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.empty);

                    this.snake.y = this.snake.y == this.cellsQuantity - 1 ? 0 : this.snake.y + 1;

                    this.cells[this.snake.x][this.snake.y] = 1;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.snake);
                    break;
                case "left":
                    this.cells[this.snake.x][this.snake.y] = 0;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.empty);

                    this.snake.x = this.snake.x == 0 ? this.cellsQuantity - 1 : this.snake.x - 1;

                    this.cells[this.snake.x][this.snake.y] = 1;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.snake);
                    break;
                case "right":
                    this.cells[this.snake.x][this.snake.y] = 0;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.empty);

                    this.snake.x = this.snake.x == this.cellsQuantity - 1 ? 0 : this.snake.x + 1;

                    this.cells[this.snake.x][this.snake.y] = 1;
                    this.fillCell(this.snake.x, this.snake.y, this.colors.snake);
                    break;
            }
        };
    }
}

let snake = new Snake(canvas, 21);

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
