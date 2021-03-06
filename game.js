const canvas = document.querySelector('.snake');
const canvasLength = Math.min(window.innerHeight, window.innerWidth);

const restart = document.querySelector('.restart');
const sizeCounter = document.querySelector('.size');

canvas.width = canvasLength;
canvas.height = canvasLength;

class Snake {
	constructor() {
		this.direction = 'down';
		this.currentDirection = 'down';
		this.size = 0;
		this.body = [];
		this.directions = {
			up: 'down',
			down: 'up',
			left: 'right',
			right: 'left',
		};
	}
}

class Game {
	constructor(canvas, cellsQuantity = 11) {
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');

		this.cellsQuantity = cellsQuantity;
		this.cellLength = this.canvas.width / this.cellsQuantity;
		this.cells = new Array(this.cellsQuantity).fill(0).map(() => new Array(this.cellsQuantity).fill(0)); //0 - empty cell; 1 - snake; 2 - food

		this.colors = {
			empty: 'rgb(255, 215, 0)',
			snake: 'rgb(243, 135, 47)',
			food: 'rgb(21, 178, 211)',
			0: 'rgb(255, 215, 0)',
			1: 'rgb(243, 135, 47)',
			2: 'rgb(21, 178, 211)',
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
		};

		this.start = function () {
			for (let y = 0; y < this.cellsQuantity; y++) {
				for (let x = 0; x < this.cellsQuantity; x++) {
					this.cells[y][x] = 0;
				}
			}

			this.snake.body = [{ x: 0, y: 0 }];
			this.snake.size = 1;
			sizeCounter.innerHTML = `?????????? ????????????: ${this.snake.size}`;
			this.setCell(this.snake.body[0], 1);

			this.draw();
			this.placeFood();

			clearInterval(this.timer);
			this.timer = setInterval(this.tick.bind(this), 100);
		};

		this.draw = function () {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			for (const [y, row] of this.cells.entries()) {
				for (const [x, cell] of row.entries()) {
					this.fillCell(x, y, this.colors[cell]);
				}
			}
		};

		this.placeFood = function () {
			let x, y;

			while (true) {
				[x, y] = [Math.floor(Math.random() * (this.cellsQuantity - 1)), Math.floor(Math.random() * (this.cellsQuantity - 1))];
				if (this.getCell({ x: x, y: y }) != 1) break;
			}

			this.setCell({ x: x, y: y }, 2);
		};

		this.tick = function () {
			let head = { x: this.snake.body[0].x, y: this.snake.body[0].y };
			let lastPart = this.snake.body.pop();
			this.setCell(lastPart, 0);

			if (this.snake.direction == this.snake.directions[this.snake.currentDirection]) {
				this.snake.direction = this.snake.currentDirection;
			}

			switch (this.snake.direction) {
				case 'up':
					head.y = head.y == 0 ? this.cellsQuantity - 1 : head.y - 1;
					break;
				case 'down':
					head.y = head.y == this.cellsQuantity - 1 ? 0 : head.y + 1;
					break;
				case 'left':
					head.x = head.x == 0 ? this.cellsQuantity - 1 : head.x - 1;
					break;
				case 'right':
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
				sizeCounter.innerHTML = `?????????? ????????????: ${this.snake.size}`;
			}

			for (let part of this.snake.body) {
				this.setCell(part, 1);
			}

			this.snake.currentDirection = this.snake.direction;
			this.draw();
		};
	}
}

let snake = new Game(canvas, 21);

snake.start();

document.onkeydown = function (event) {
	switch (event.key) {
		case 'ArrowUp':
			snake.snake.direction = 'up';
			break;
		case 'ArrowDown':
			snake.snake.direction = 'down';
			break;
		case 'ArrowLeft':
			snake.snake.direction = 'left';
			break;
		case 'ArrowRight':
			snake.snake.direction = 'right';
			break;
	}
};

restart.addEventListener('click', snake.start.bind(snake));
