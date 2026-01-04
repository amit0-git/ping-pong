const canvas = document.getElementById("game");
const drawingContext = canvas.getContext("2d");

// input controller class
class InputController {
  constructor() {
    this.pressedKeys = {};
    window.addEventListener("keydown", (event) => (this.pressedKeys[event.key] = true));
    window.addEventListener("keyup", (event) => (this.pressedKeys[event.key] = false));
  }

  isPressed(key) {
    return this.pressedKeys[key];
  }
}

// paddle class
class Paddle {
  constructor(positionX, canvasHeight) {
    this.positionX = positionX;
    this.positionY = canvasHeight / 2 - 50;
    this.width = 10;
    this.height = 100;
    this.speed = 6;
    this.canvasHeight = canvasHeight;
  }

  moveUp() {
    this.positionY = Math.max(0, this.positionY - this.speed);
  }

  moveDown() {
    this.positionY = Math.min(this.canvasHeight - this.height, this.positionY + this.speed);
  }
}

// ball class
class Ball {
  constructor(canvas) {
    this.canvas = canvas;
    this.diameter = 15; // radius*2
    this.reset();
  }

  reset() {
    this.positionX = this.canvas.width / 2;
    this.positionY = this.canvas.height / 2;
    this.velocityX = 2 * (Math.random() > 0.5 ? 1 : -1);
    this.velocityY = 2 * (Math.random() > 0.5 ? 1 : -1);
  }

  update() {
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    // bounce off top/bottom
    if (this.positionY <= 0 || this.positionY + this.diameter >= this.canvas.height) {
      this.velocityY *= -1;
    }
  }
}

// collision system class
class CollisionSystem {
  ballHitsPaddle(ball, paddle) {
    return (
      ball.positionX < paddle.positionX + paddle.width &&
      ball.positionX + ball.diameter > paddle.positionX &&
      ball.positionY < paddle.positionY + paddle.height &&
      ball.positionY + ball.diameter > paddle.positionY
    );
  }
}

// renderer class
class Renderer {
  constructor(drawingContext, canvas) {
    this.drawingContext = drawingContext;
    this.canvas = canvas;
  }

  clear() {
    this.drawingContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPaddle(paddle) {
    this.drawingContext.fillStyle = "#ffffff";
    this.drawingContext.fillRect(paddle.positionX, paddle.positionY, paddle.width, paddle.height);
  }

  drawBall(ball) {
    this.drawingContext.fillStyle = "#FFC107";
    this.drawingContext.beginPath();
    this.drawingContext.arc(
      ball.positionX + ball.diameter / 2,
      ball.positionY + ball.diameter / 2,
      ball.diameter / 2,
      0,
      Math.PI * 2
    );
    this.drawingContext.fill();
  }

  drawCenterLine() {
    this.drawingContext.strokeStyle = "white";
    this.drawingContext.setLineDash([10, 10]);
    this.drawingContext.beginPath();
    this.drawingContext.moveTo(this.canvas.width / 2, 0);
    this.drawingContext.lineTo(this.canvas.width / 2, this.canvas.height);
    this.drawingContext.stroke();
    this.drawingContext.setLineDash([]);
  }

  drawScore(leftPlayerScore, rightPlayerScore) {
    this.drawingContext.font = "40px Arial";
    this.drawingContext.fillStyle = "gray"; /* Material White */
    this.drawingContext.textAlign = "center";
    this.drawingContext.fillText(leftPlayerScore, this.canvas.width / 4, 50);
    this.drawingContext.fillText(rightPlayerScore, (this.canvas.width / 4) * 3, 50);
  }
}

  // game manager class
class Game {
  static instance = null;

  constructor(canvas, drawingContext) {
    if (Game.instance) return Game.instance;
    Game.instance = this;

    this.canvas = canvas;
    this.inputController = new InputController();
    this.renderer = new Renderer(drawingContext, canvas);
    this.collisionSystem = new CollisionSystem();

    this.leftPaddle = new Paddle(20, canvas.height);
    this.rightPaddle = new Paddle(canvas.width - 30, canvas.height);
    this.ball = new Ball(canvas);

    // Score
    this.leftPlayerScore = 0;
    this.rightPlayerScore = 0;

    // Pause state
    this.isPaused = true;
    this.setupPlayPauseButton();

    this.loop();
  }

  setupPlayPauseButton() {
    const playPauseButton = document.getElementById("playPauseBtn");
    playPauseButton.addEventListener("click", () => {
      this.togglePause();
    });
    this.updateButtonText();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.updateButtonText();
  }

  updateButtonText() {
    const playPauseButton = document.getElementById("playPauseBtn");
    if (this.isPaused) {
      playPauseButton.textContent = "Play";
      playPauseButton.classList.remove("paused");
    } else {
      playPauseButton.textContent = "Pause";
      playPauseButton.classList.add("paused");
    }
  }

  handleInput() {
    if (this.inputController.isPressed("w")) this.leftPaddle.moveUp();
    if (this.inputController.isPressed("s")) this.leftPaddle.moveDown();
    if (this.inputController.isPressed("ArrowUp")) this.rightPaddle.moveUp();
    if (this.inputController.isPressed("ArrowDown")) this.rightPaddle.moveDown();
  }

  update() {
    if (this.isPaused) return;
    
    this.handleInput();
    this.ball.update();

    [this.leftPaddle, this.rightPaddle].forEach((paddle) => {
      if (this.collisionSystem.ballHitsPaddle(this.ball, paddle)) {
        if (this.ball.velocityX < 0) this.ball.positionX = paddle.positionX + paddle.width;
        else this.ball.positionX = paddle.positionX - this.ball.diameter;

        this.ball.velocityX *= -1;

        let paddleCenterY = paddle.positionY + paddle.height / 2;
        let ballCenterY = this.ball.positionY + this.ball.diameter / 2;
        let relativeIntersectionY =
          (ballCenterY - paddleCenterY) / (paddle.height / 2);
        let maximumBounceSpeed = 5;
        this.ball.velocityY = relativeIntersectionY * maximumBounceSpeed;
      }
    });

    // Score update
    if (this.ball.positionX < 0) {
      this.rightPlayerScore += 1;
      this.ball.reset();
    }
    if (this.ball.positionX > this.canvas.width) {
      this.leftPlayerScore += 1;
      this.ball.reset();
    }
  }

  draw() {
    this.renderer.clear();
    this.renderer.drawCenterLine();
    this.renderer.drawPaddle(this.leftPaddle);
    this.renderer.drawPaddle(this.rightPaddle);
    this.renderer.drawBall(this.ball);
    this.renderer.drawScore(this.leftPlayerScore, this.rightPlayerScore);
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}


new Game(canvas, drawingContext);