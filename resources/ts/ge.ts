class Player {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;

  constructor(x: number, y: number, size: number, color: string, speed: number, board: TileType[][]) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speed = speed;
  }

  move(keys: Set<string>, canvasWidth: number, canvasHeight: number) {
    if (keys.has('ArrowUp')) this.y -= this.speed;
    if (keys.has('ArrowDown')) this.y += this.speed;
    if (keys.has('ArrowLeft')) this.x -= this.speed;
    if (keys.has('ArrowRight')) this.x += this.speed;

    // Clamp position inside canvas
    this.x = Math.min(Math.max(0, this.x), canvasWidth - this.size);
    this.y = Math.min(Math.max(0, this.y), canvasHeight - this.size);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  
}

enum TileType {
    EMMPTY = 0,
    PLAYER = 1,
    WALL = 2
}

class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  keysPressed: Set<string>;
  board: TileType[][];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 600;
    this.canvas.height = 400;
    this.canvas.style.border = '1px solid #000';
    
    this.board = [[0,TileType.PLAYER,0,0], [0,0,0,0], [0,TileType.WALL,0,0], [0,0,TileType.WALL, TileType.WALL]];
    
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d')!;
    this.player = new Player(
      this.canvas.width / 2 - 20,
      this.canvas.height / 2 - 20,
      40,
      '#007bff',
      5,
      this.board
    );
    this.keysPressed = new Set();

    window.addEventListener('keydown', (e) => this.keysPressed.add(e.key));
    window.addEventListener('keyup', (e) => this.keysPressed.delete(e.key));

    this.gameLoop = this.gameLoop.bind(this);
  }

  update() {
    this.player.move(this.keysPressed, this.canvas.width, this.canvas.height);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const tileWidth = 30;
    const playerColor = "blue";
    const wallColor = "red";
    for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
            const tile = this.board[y][x];
            if (tile === TileType.PLAYER) {
                this.ctx.fillStyle = playerColor;
            } else if (tile === TileType.WALL) {
                this.ctx.fillStyle = wallColor;
            } else {
                continue;
            }
            
            this.ctx.fillRect(x * tileWidth, y * tileWidth, tileWidth, tileWidth);
            
        }
    }
    this.player.draw(this.ctx);
    
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.gameLoop);
  }

  start() {
    requestAnimationFrame(this.gameLoop);
  }
}

// Start the game
const game = new Game();
game.start();
