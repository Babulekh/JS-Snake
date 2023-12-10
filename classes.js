var Direction;
(function (Direction) {
    Direction["Up"] = "up";
    Direction["Down"] = "down";
    Direction["Left"] = "left";
    Direction["Right"] = "right";
})(Direction || (Direction = {}));
var CellType;
(function (CellType) {
    CellType["Empty"] = "rgb(255, 215, 0)";
    CellType["Snake"] = "rgb(243, 135, 47)";
    CellType["Food"] = "rgb(21, 178, 211)";
})(CellType || (CellType = {}));
class Snake {
    constructor() {
        this.direction = Direction.Down;
        this.body = [];
    }
    get size() {
        return this.body.length;
    }
}
export class Game {
    constructor(canvas, cellsQuantity, sizeCounter) {
        this.canvas = canvas;
        this.cellsQuantity = cellsQuantity;
        this.sizeCounter = sizeCounter;
        this.cellLength = this.canvas.width / this.cellsQuantity;
        this.cells = Array.from({ length: this.cellsQuantity }, () => Array(this.cellsQuantity).fill(CellType.Empty));
        this.snake = new Snake();
        this.start = () => {
            for (const row of this.cells) {
                for (let x = 0; x < row.length; x++) {
                    row[x] = CellType.Empty;
                }
            }
            const initSnakeBody = { x: 0, y: 0 };
            this.snake.body = [initSnakeBody];
            this.sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
            this.setCell(initSnakeBody, CellType.Snake);
            this.draw();
            this.placeFood();
            clearInterval(this.timer);
            this.timer = setInterval(() => this.tick(), 100);
        };
        this.onKeyDown = ({ code }) => {
            switch (code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.snake.direction = Direction.Up;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.snake.direction = Direction.Down;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.snake.direction = Direction.Left;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.snake.direction = Direction.Right;
                    break;
            }
        };
        document.addEventListener('keydown', this.onKeyDown);
        const context = this.canvas.getContext('2d');
        if (!context)
            throw Error('Canvas 2D context is null');
        this.context = context;
    }
    fillCell(x, y, fillStyle) {
        const radius = this.cellLength / 10;
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
        const row = this.cells[y];
        if (!row)
            throw Error("Row doesn't exist");
        row[x] = value;
    }
    getCell({ x, y }) {
        var _a;
        const cell = (_a = this.cells[y]) === null || _a === void 0 ? void 0 : _a[x];
        return cell;
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
            if (this.getCell({ x: x, y: y }) != CellType.Snake)
                break;
        }
        this.setCell({ x, y }, CellType.Food);
    }
    tick() {
        const head = this.snake.body[0] ? Object.assign({}, this.snake.body[0]) : undefined;
        const tail = this.snake.body.pop();
        if (tail)
            this.setCell(tail, CellType.Empty);
        if (!head)
            return;
        switch (this.snake.direction) {
            case Direction.Up:
                head.y = (head.y + this.cellsQuantity - 1) % this.cellsQuantity;
                break;
            case Direction.Down:
                head.y = (head.y + this.cellsQuantity + 1) % this.cellsQuantity;
                break;
            case Direction.Left:
                head.x = (head.x + this.cellsQuantity - 1) % this.cellsQuantity;
                break;
            case Direction.Right:
                head.x = (head.x + this.cellsQuantity + 1) % this.cellsQuantity;
                break;
        }
        this.snake.body.unshift(head);
        if (this.getCell(head) === CellType.Snake) {
            clearInterval(this.timer);
            alert('gameover');
            return;
        }
        if (this.getCell(head) === CellType.Food && tail) {
            this.snake.body.push(tail);
            this.placeFood();
            this.sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
        }
        for (const part of this.snake.body) {
            this.setCell(part, CellType.Snake);
        }
        this.draw();
    }
}
//# sourceMappingURL=classes.js.map