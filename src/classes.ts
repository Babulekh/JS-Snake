const enum Directions {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const enum CellTypes {
  Empty = 'rgb(255, 215, 0)',
  Snake = 'rgb(243, 135, 47)',
  Food = 'rgb(21, 178, 211)',
}

class Snake {
  direction: Directions = Directions.Down;
  size: number = 0;
  body: { x: number; y: number }[] = [];
}

export class Game {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  cellsQuantity: number;
  cellLength: number;
  cells: CellTypes[][];
  snake: Snake = new Snake();
  timer: number;
  sizeCounter: Element;

  constructor(canvas: HTMLCanvasElement, cellsQuantity: number, sizeCounter: Element) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.sizeCounter = sizeCounter;

    this.cellsQuantity = cellsQuantity;
    this.cellLength = this.canvas.width / this.cellsQuantity;
    this.cells = new Array(this.cellsQuantity).fill(CellTypes.Empty).map(() => new Array(this.cellsQuantity).fill(CellTypes.Empty));

    document.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  fillCell(x: number, y: number, fillStyle: CellTypes): void {
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

  setCell({ x, y }, value: CellTypes): void {
    this.cells[y][x] = value;
  }

  getCell({ x, y }): CellTypes {
    return this.cells[y][x];
  }

  start(): void {
    for (let y = 0; y < this.cellsQuantity; y++) {
      for (let x = 0; x < this.cellsQuantity; x++) {
        this.cells[y][x] = CellTypes.Empty;
      }
    }

    this.snake.body = [{ x: 0, y: 0 }];
    this.snake.size = 1;
    this.sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
    this.setCell(this.snake.body[0], CellTypes.Snake);

    this.draw();
    this.placeFood();

    clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 100);
  }

  draw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const [y, row] of this.cells.entries()) {
      for (const [x, cell] of row.entries()) {
        this.fillCell(x, y, cell);
      }
    }
  }

  placeFood(): void {
    let x: number, y: number;

    while (true) {
      [x, y] = [Math.floor(Math.random() * (this.cellsQuantity - 1)), Math.floor(Math.random() * (this.cellsQuantity - 1))];
      if (this.getCell({ x: x, y: y }) != CellTypes.Snake) break;
    }

    this.setCell({ x, y }, CellTypes.Food);
  }

  tick(): void {
    const head = { x: this.snake.body[0].x, y: this.snake.body[0].y };
    const lastPart = this.snake.body.pop();

    this.setCell(lastPart, CellTypes.Empty);

    switch (this.snake.direction) {
      case Directions.Up:
        head.y = head.y === 0 ? this.cellsQuantity - 1 : head.y - 1;
        break;
      case Directions.Down:
        head.y = head.y === this.cellsQuantity - 1 ? 0 : head.y + 1;
        break;
      case Directions.Left:
        head.x = head.x === 0 ? this.cellsQuantity - 1 : head.x - 1;
        break;
      case Directions.Right:
        head.x = head.x === this.cellsQuantity - 1 ? 0 : head.x + 1;
        break;
    }

    this.snake.body.unshift(head);

    if (this.getCell(head) === CellTypes.Snake) {
      clearInterval(this.timer);
      alert('gameover');
      return;
    }

    if (this.getCell(head) === CellTypes.Food) {
      this.snake.body.push(lastPart);
      this.snake.size++;
      this.placeFood();
      this.sizeCounter.innerHTML = `Длина змейки: ${this.snake.size}`;
    }

    for (let part of this.snake.body) this.setCell(part, CellTypes.Snake);

    this.draw();
  }

  onKeyDown({ code }: KeyboardEvent): void {
    switch (code) {
      case 'KeyW':
      case 'ArrowUp':
        this.snake.direction = Directions.Up;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.snake.direction = Directions.Down;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.snake.direction = Directions.Left;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.snake.direction = Directions.Right;
        break;
    }
  }
}
