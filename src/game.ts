const canvas: HTMLCanvasElement = document.querySelector('.snake');
const canvasLength = Math.min(window.innerHeight, window.innerWidth);

const restart = document.querySelector('.restart');
const sizeCounter = document.querySelector('.size');

canvas.width = canvasLength;
canvas.height = canvasLength;

const enum Directions {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

class Snake {
  direction: Directions = Directions.Down;
  currentDirection: Directions = Directions.Down;
  size: number = 0;
  body: { x: number; y: number }[] = [];
}

class Game {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  cellsQuantity: number;
  cellLength: number;
  cells: number[][];
  colors: any = {
    empty: 'rgb(255, 215, 0)',
    snake: 'rgb(243, 135, 47)',
    food: 'rgb(21, 178, 211)',
    0: 'rgb(255, 215, 0)',
    1: 'rgb(243, 135, 47)',
    2: 'rgb(21, 178, 211)',
  };
  snake: Snake = new Snake();
  timer: number;

  constructor(canvas: HTMLCanvasElement, cellsQuantity = 11) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');

    this.cellsQuantity = cellsQuantity;
    this.cellLength = this.canvas.width / this.cellsQuantity;
    this.cells = new Array(this.cellsQuantity).fill(0).map(() => new Array(this.cellsQuantity).fill(0)); //0 - empty cell; 1 - snake; 2 - food
  }

  fillCell(x: number, y: number, fillStyle = this.colors.empty): void {
    let radius = this.cellLength / 10;
    this.context.fillStyle = fillStyle;

    this.context.beginPath();
    this.context.moveTo(x * this.cellLength, y * this.cellLength + radius);
    this.context.lineTo(x * this.cellLength, y * this.cellLength + this.cellLength - radius);
    this.context.arcTo(x * this.cellLength, y * this.cellLength + this.cellLength, x * this.cellLength + radius, y * this.cellLength + this.cellLength, radius);
    this.context.lineTo(x * this.cellLength + this.cellLength - radius, y * this.cellLength + this.cellLength);
    this.context.arcTo(
      x * this.cellLength + this.cellLength,
      y * this.cellLength + this.cellLength,
      x * this.cellLength + this.cellLength,
      y * this.cellLength + this.cellLength - radius,
      radius
    );
    this.context.lineTo(x * this.cellLength + this.cellLength, y * this.cellLength + radius);
    this.context.arcTo(x * this.cellLength + this.cellLength, y * this.cellLength, x * this.cellLength + this.cellLength - radius, y * this.cellLength, radius);
    this.context.lineTo(x * this.cellLength + radius, y * this.cellLength);
    this.context.arcTo(x * this.cellLength, y * this.cellLength, x * this.cellLength, y * this.cellLength + radius, radius);
    this.context.fill();
  }

  setCell({ x, y }, value: number): void {
    this.cells[y][x] = value;
  }

  getCell({ x, y }): number {
    return this.cells[y][x];
  }

  start(): void {
    for (let y = 0; y < this.cellsQuantity; y++) {
      for (let x = 0; x < this.cellsQuantity; x++) {
        this.cells[y][x] = 0;
      }
    }

    this.snake.body = [{ x: 0, y: 0 }];
    this.snake.size = 1;
    sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
    this.setCell(this.snake.body[0], 1);

    this.draw();
    this.placeFood();

    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 100);
  }

  draw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const [y, row] of this.cells.entries()) {
      for (const [x, cell] of row.entries()) {
        this.fillCell(x, y, this.colors[cell]);
      }
    }
  }

  placeFood(): void {
    let x: number, y: number;

    while (true) {
      [x, y] = [Math.floor(Math.random() * (this.cellsQuantity - 1)), Math.floor(Math.random() * (this.cellsQuantity - 1))];
      if (this.getCell({ x: x, y: y }) != 1) break;
    }

    this.setCell({ x: x, y: y }, 2);
  }

  tick(): void {
    let head = { x: this.snake.body[0].x, y: this.snake.body[0].y };
    let lastPart = this.snake.body.pop();
    this.setCell(lastPart, 0);

    if (this.snake.direction == this.snake.currentDirection) {
      this.snake.direction = this.snake.currentDirection;
    }

    switch (this.snake.direction) {
      case Directions.Up:
        head.y = head.y == 0 ? this.cellsQuantity - 1 : head.y - 1;
        break;
      case Directions.Down:
        head.y = head.y == this.cellsQuantity - 1 ? 0 : head.y + 1;
        break;
      case Directions.Left:
        head.x = head.x == 0 ? this.cellsQuantity - 1 : head.x - 1;
        break;
      case Directions.Right:
        head.x = head.x == this.cellsQuantity - 1 ? 0 : head.x + 1;
        break;
    }

    this.snake.body.unshift(head);

    if (this.getCell(head) == 1) {
      clearInterval(this.timer);
      alert('gameover');
      return;
    }

    if (this.getCell(head) == 2) {
      this.placeFood();
      this.snake.body.push(lastPart);
      this.snake.size++;
      sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
    }

    for (let part of this.snake.body) {
      this.setCell(part, 1);
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
      snake.snake.direction = Directions.Up;
      break;
    case 'ArrowDown':
      snake.snake.direction = Directions.Down;
      break;
    case 'ArrowLeft':
      snake.snake.direction = Directions.Left;
      break;
    case 'ArrowRight':
      snake.snake.direction = Directions.Right;
      break;
  }
};

restart.addEventListener('click', snake.start.bind(snake));
