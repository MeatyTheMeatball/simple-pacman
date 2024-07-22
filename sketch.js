let right = [];
let left = [];
let up = [];
let down = [];
let death = [];
let frameR = ["pacman1.png", "pacman2.png", "pacman3.png"];
let frameL = ["pacmanL1.png", "pacmanL2.png", "pacmanL3.png"];
let frameU = ["pacmanU1.png", "pacmanU2.png"];
let frameD = ["pacmanD1.png", "pacmanD2.png"];
let frameDeath = ["death1.png", "death2.png", "death3.png", "death4.png", "death5.png", "death6.png", "death7.png", "death8.png", "death9.png", "death10.png"]
let pacman;
let key = 0;
let pacX = 250;
let pacY = 250;
let rightDown = false;
let leftDown = false;
let upDown = false;
let downDown = false;
let gameOver = false;
let mode = 0; // 0: Loading, 1: Mode Selection, 2: Game
let numCoins = 3;
let coinSize = 20;
let coins = [];
let ghostX, ghostY;
let ghostSpeed = 2;
let difficulty = 1; // 1: Easy, 2: Medium, 3: Hard
let chomp;
let score = 0;
let pacmanSpeed = 5;
let deathAnimationFrame = 0;

function preload() {
    for (let i = 0; i < frameR.length; i++) {
        right[i] = loadImage(frameR[i]);
    }
    for (let i = 0; i < frameL.length; i++) {
        left[i] = loadImage(frameL[i]);
    }
    for (let i = 0; i < frameU.length; i++) {
        up[i] = loadImage(frameU[i]);
    }
    for (let i = 0; i < frameD.length; i++) {
        down[i] = loadImage(frameD[i]);
    }
    for (let i = 0; i < frameDeath.length; i++) {
        death[i] = loadImage(frameDeath[i]);
    }
    chomp = loadSound("chomp.wav");
}

function setup() {
    createCanvas(500, 500);
    initializeLoadingScreen();
    pacman = right[0]; // Initialize pacman with a default image
}

function draw() {
    if (mode === 0) {
        showLoadingScreen();
    } else if (mode === 1) {
        showModeSelectionScreen();
    } else if (mode === 2) {
        playGame();
        if (gameOver) {
            showGameOverScreen();
        }
    }
}

function showLoadingScreen() {
    background(0);
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("Pac-Man", width / 2, height / 2 - 50);
    textSize(24);
    text("Press Enter to continue.", width / 2, height / 2 + 20);
}

function showModeSelectionScreen() 
{
    background(0);
    fill(255);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("Select Difficulty", width / 2, height / 2 - 160);
    textSize(24);
    rectMode(CENTER);
    // Easy Mode Box
    fill(100, 255, 100); // Light green
    rect(width / 2, height / 2 - 75, 150, 50);
    fill(0);
    text("Easy", width / 2, height / 2 - 75);
    // Medium Mode Box
    fill(255, 255, 100); // Light yellow
    rect(width / 2, height / 2, 150, 50);
    fill(0);
    text("Medium", width / 2, height / 2);
    // Hard Mode Box
    fill(255, 100, 100); // Light red
    rect(width / 2, height / 2 + 75, 150, 50);
    fill(0);
    text("Hard", width / 2, height / 2 + 75);
}

function playGame() {
    background(0);
    imageMode(CENTER);

    // Update Pac-Man position and animation
    if (rightDown) {
        if (pacX < 475) {
            pacX += pacmanSpeed;
            key = (key + 1) % right.length;
            pacman = right[key];
            if (!chomp.isPlaying()) chomp.play();
        }
    }
    if (leftDown) {
        if (pacX > 25) {
            pacX -= pacmanSpeed;
            key = (key + 1) % left.length;
            pacman = left[key];
            if (!chomp.isPlaying()) chomp.play();
        }
    }
    if (upDown) {
        if (pacY > 25) {
            pacY -= pacmanSpeed;
            key = (key + 1) % up.length;
            pacman = up[key];
            if (!chomp.isPlaying()) chomp.play();
        }
    }
    if (downDown) {
        if (pacY < 475) {
            pacY += pacmanSpeed;
            key = (key + 1) % down.length;
            pacman = down[key];
            if (!chomp.isPlaying()) chomp.play();
        }
    }

    // Draw Pac-Man
    image(pacman, pacX, pacY, 50, 50);

    // Draw Coins
    fill(255, 215, 0);
    for (let i = 0; i < coins.length; i++) {
        let coin = coins[i];
        ellipse(coin.x, coin.y, coinSize, coinSize);
    }

    // Check for coin collection
    for (let i = coins.length - 1; i >= 0; i--) {
        let coin = coins[i];
        let d = dist(pacX, pacY, coin.x, coin.y);
        if (d < coinSize / 2 + 15) {
            score += 10;
            chomp.play();
            coins.splice(i, 1); // Remove the collected coin from the array
        }
    }

    if (coins.length === 0) 
    {
        initializeCoins();
    }

    // Draw the Score
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text('Score: ' + score, 10, 10); 

    // Update Ghost Position
    if (ghostX < pacX) {
        ghostX += ghostSpeed;
    } else {
        ghostX -= ghostSpeed;
    }
    if (ghostY < pacY) {
        ghostY += ghostSpeed;
    } else {
        ghostY -= ghostSpeed;
    }

    // Draw Ghost
    fill(255, 0, 0);
    ellipse(ghostX, ghostY, 30, 30);

    // Check for collision with ghost
    let ghostDist = dist(pacX, pacY, ghostX, ghostY);
    if (ghostDist < 30 && !gameOver) {
        gameOver = true;
        deathAnimationFrame = 0;
    }

    if (gameOver) {
        showDeathAnimation();
    }
}

function showDeathAnimation() {
    if (deathAnimationFrame < death.length) {
        //image(death[deathAnimationFrame], pacX, pacY, 50, 50);
        pacman = death[deathAnimationFrame]
        if (frameCount % 5 == 0) { // Slow down the animation
            deathAnimationFrame++;
        }
    } else {
        showGameOverScreen();
    }
}

function showGameOverScreen()
 {
    
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);

    // Game Over text
    fill(255);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2 - 40);
    
    // Score display
    textSize(24);
    text("Final Score: " + score, width / 2, height / 2 + 10);

    // Return to menu instruction
    textSize(18);
    text("Press Space to Return to Menu", width / 2, height / 2 + 50);
}

function mousePressed()
 {
    if (mode === 1) {
        if (mouseX > width / 2 - 75 && mouseX < width / 2 + 75) {
            if (mouseY > height / 2 - 100 && mouseY < height / 2 - 50) {
                difficulty = 1; // Easy
                initializeGame();
                mode = 2; // Start game
                loop(); 
            } else if (mouseY > height / 2 - 25 && mouseY < height / 2 + 25) {
                difficulty = 2; // Medium
                initializeGame();
                mode = 2; // Start game
                loop(); 
            } else if (mouseY > height / 2 + 50 && mouseY < height / 2 + 100) {
                difficulty = 3; // Hard
                initializeGame();
                mode = 2; // Start game
                loop(); 
            }
        }
    }
}

function keyPressed() {
    if (keyCode === ENTER && mode === 0) {
        mode = 1; // Switch to mode selection screen
        initializeModeSelectionScreen();
    }
    if (mode === 2 && !gameOver) {
        if (keyCode === RIGHT_ARROW) {
            rightDown = true;
            leftDown = false;
            upDown = false;
            downDown = false;
        }
        if (keyCode === LEFT_ARROW) {
            leftDown = true;
            upDown = false;
            downDown = false;
            rightDown = false;
        }
        if (keyCode === UP_ARROW) {
            upDown = true;
            rightDown = false;
            downDown = false;
            leftDown = false;
        }
        if (keyCode === DOWN_ARROW) {
            downDown = true;
            rightDown = false;
            leftDown = false;
            upDown = false;
        }
    }
    if (gameOver && keyCode === 32) {
        mode = 1; 
        initializeModeSelectionScreen();
        loop();
    }
}

function keyReleased() {
    if (keyCode === RIGHT_ARROW) {
        rightDown = false;
    }
    if (keyCode === LEFT_ARROW) {
        leftDown = false;
    }
    if (keyCode === UP_ARROW) {
        upDown = false;
    }
    if (keyCode === DOWN_ARROW) {
        downDown = false;
    }
}

function initializeLoadingScreen() {
   // Any initialization for loading screen if needed
}

function initializeModeSelectionScreen() 
{
    // Reset game state
    gameOver = false;
    score = 0;
    pacX = 250;
    pacY = 250;
    ghostX = random(25, 475);
    ghostY = random(25, 475);
    rightDown = false;
    leftDown = false;
    upDown = false;
    downDown = false;
}

function initializeGame() {
    pacX = 250;
    pacY = 250;
    score = 0;
    gameOver = false;
    initializeCoins();
    ghostX = random(25, 475);
    ghostY = random(25, 475);
    
    // Set difficulty
    if (difficulty === 1) {
        ghostSpeed = 1; // Easy
        pacmanSpeed = 5;
    } else if (difficulty === 2) {
        ghostSpeed = 2; // Medium
        pacmanSpeed = 7;
    } else if (difficulty === 3) {
        ghostSpeed = 3; // Hard
        pacmanSpeed = 9;
    }
    
    loop();
}

function initializeCoins() {
    coins = [];
    for (let i = 0; i < numCoins; i++) {
        coins.push({
            x: random(25, 475),
            y: random(25, 475),
            collected: false
        });
    }
}
