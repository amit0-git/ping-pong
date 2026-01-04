# Ping Pong Game

A classic two-player ping pong game built with vanilla JavaScript, implementing Object-Oriented Programming (OOP) composition and SOLID principles for clean, maintainable, and scalable code architecture.

## 🎮 Features

- **Two-Player Gameplay**: Control paddles with keyboard (W/S for left player, Arrow Keys for right player)
- **Play/Pause Control**: Start and pause the game with a single button
- **Score Tracking**: Real-time score display for both players
- **Smooth Physics**: Realistic ball movement with velocity-based physics and angle-based paddle bounces
- **Responsive Design**: Clean, modern UI with Material Design color scheme

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No build tools or dependencies required!

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Click the "Play" button to start the game

### Controls

- **Left Player**: 
  - `W` - Move paddle up
  - `S` - Move paddle down

- **Right Player**:
  - `↑` (Arrow Up) - Move paddle up
  - `↓` (Arrow Down) - Move paddle down

- **Game Control**:
  - Click "Play/Pause" button to start or pause the game

## 🏗️ Architecture

This project demonstrates clean code architecture through:

### Object-Oriented Programming (OOP) Composition

The game is structured using **composition over inheritance**, where complex objects are built by combining simpler, focused classes. Each class has a single, well-defined responsibility.

### SOLID Principles Implementation

#### 1. **Single Responsibility Principle (SRP)**
Each class has one reason to change:
- `InputController` - Handles keyboard input only
- `Renderer` - Handles all drawing operations only
- `CollisionSystem` - Handles collision detection only
- `Paddle` - Manages paddle state and movement only
- `Ball` - Manages ball state and physics only
- `Game` - Manages game loop and coordinates components

#### 2. **Open/Closed Principle (OCP)**
Classes are open for extension but closed for modification:
- New rendering methods can be added to `Renderer` without modifying existing code
- New collision types can be added to `CollisionSystem` without changing existing logic
- Game components can be extended without modifying the core `Game` class

#### 3. **Liskov Substitution Principle (LSP)**
While not using inheritance, the composition pattern ensures that components can be replaced with alternative implementations (e.g., different renderers, input controllers) without breaking the game.

#### 4. **Interface Segregation Principle (ISP)**
Classes expose only the methods they need:
- `InputController` provides a simple `isPressed()` interface
- `CollisionSystem` provides focused collision detection methods
- Each class has a minimal, focused public API

#### 5. **Dependency Inversion Principle (DIP)**
High-level `Game` class depends on abstractions (component classes) rather than concrete implementations:
- `Game` depends on `InputController`, `Renderer`, and `CollisionSystem` interfaces
- Components can be swapped or mocked for testing

## 📁 Project Structure

## 🧩 Class Structure

### `InputController`
Manages keyboard input state.
- **Responsibility**: Track which keys are currently pressed
- **Methods**: `isPressed(key)` - Check if a key is pressed

### `Paddle`
Represents a game paddle with position and movement logic.
- **Properties**: `positionX`, `positionY`, `width`, `height`, `speed`
- **Methods**: `moveUp()`, `moveDown()`

### `Ball`
Manages ball physics and state.
- **Properties**: `positionX`, `positionY`, `velocityX`, `velocityY`, `diameter`
- **Methods**: `update()`, `reset()`

### `CollisionSystem`
Handles collision detection between game objects.
- **Methods**: `ballHitsPaddle(ball, paddle)` - Detect ball-paddle collisions

### `Renderer`
Handles all canvas drawing operations.
- **Methods**: 
  - `clear()` - Clear the canvas
  - `drawPaddle(paddle)` - Draw a paddle
  - `drawBall(ball)` - Draw the ball
  - `drawCenterLine()` - Draw the center divider
  - `drawScore(leftScore, rightScore)` - Draw player scores

### `Game`
Main game manager using Singleton pattern.
- **Composition**: Combines `InputController`, `Renderer`, `CollisionSystem`, `Paddle`, and `Ball`
- **Responsibilities**: 
  - Game loop management
  - Input handling coordination
  - Game state management (pause/play, scoring)
  - Component orchestration

## 🎯 Design Patterns Used

1. **Singleton Pattern**: `Game` class ensures only one game instance exists
2. **Composition Pattern**: `Game` composes multiple specialized classes
3. **Game Loop Pattern**: Standard update-draw-render cycle using `requestAnimationFrame`

## 🚧 Future Enhancements

Potential improvements while maintaining SOLID principles:
- Sound effects and background music
- AI opponent mode
- Power-ups and special effects
- Multiplayer networking
- Different difficulty levels
- Game settings menu
- High score tracking

## 🤝 Contributing

This is a learning project demonstrating OOP and SOLID principles. Feel free to fork, modify, and experiment!

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ❤️ using OOP Composition and SOLID Principles**