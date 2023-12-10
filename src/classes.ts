const enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const enum CellType {
  Empty = 'rgb(255, 215, 0)',
  Snake = 'rgb(243, 135, 47)',
  Food = 'rgb(21, 178, 211)',
}

type Coordinate = { x: number; y: number };
class Snake {
  direction = Direction.Down;
  body: Coordinate[] = [];
  get size() {
    return this.body.length;
  }
}

export class Game {
  private context: CanvasRenderingContext2D;
  private cellLength = this.canvas.width / this.cellsQuantity;
  private cells = Array.from({ length: this.cellsQuantity }, () => Array<CellType>(this.cellsQuantity).fill(CellType.Empty));
  private snake = new Snake();
  private timer: number | undefined;

  constructor(private canvas: HTMLCanvasElement, private cellsQuantity: number, private sizeCounter: Element) {
    document.addEventListener('keydown', (event) => this.onKeyDown(event));

    const context = this.canvas.getContext('2d');
    if (!context) throw Error('Canvas 2D context is null');
    this.context = context;
  }

  private fillCell(x: number, y: number, fillStyle: CellType): void {
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

  private setCell({ x, y }: Coordinate, value: CellType): void {
    const row = this.cells[y];
    if (!row) throw Error("Row doesn't exist");

    row[x] = value;
  }

  private getCell({ x, y }: Coordinate): CellType | undefined {
    const cell = this.cells[y]?.[x];
    return cell;
  }

  start = (): void => {
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

  private draw(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const [y, row] of this.cells.entries()) {
      for (const [x, cell] of row.entries()) {
        this.fillCell(x, y, cell);
      }
    }
  }

  private placeFood(): void {
    let x: number, y: number;

    while (true) {
      [x, y] = [Math.floor(Math.random() * (this.cellsQuantity - 1)), Math.floor(Math.random() * (this.cellsQuantity - 1))];
      if (this.getCell({ x: x, y: y }) != CellType.Snake) break;
    }

    this.setCell({ x, y }, CellType.Food);
  }

  private tick(): void {
    const head = this.snake.body[0] ? { ...this.snake.body[0] } : undefined;
    const tail = this.snake.body.pop();

    if (tail) {
      this.setCell(tail, CellType.Empty);
    }

    if (!head) return;
    switch (this.snake.direction) {
      case Direction.Up:
        head.y = head.y === 0 ? this.cellsQuantity - 1 : head.y - 1;
        break;
      case Direction.Down:
        head.y = head.y === this.cellsQuantity - 1 ? 0 : head.y + 1;
        break;
      case Direction.Left:
        head.x = head.x === 0 ? this.cellsQuantity - 1 : head.x - 1;
        break;
      case Direction.Right:
        head.x = head.x === this.cellsQuantity - 1 ? 0 : head.x + 1;
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

  private onKeyDown({ code }: KeyboardEvent): void {
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
  }
}
