class Paraglider {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.image = new Image();
        this.image.src = 'images/paraglider.png';
        this.frameIndex = 0;
        this.frameCount = 4;
        this.frameWidth = 50;
        this.frameHeight = 50;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.frameIndex * this.frameWidth,
            0,
            this.frameWidth,
            this.frameHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update() {
        // Update paraglider position based on user input
        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
}

class Mountain {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.image = new Image();
        this.image.src = 'images/mountain.png';
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }
    }
}

class Background {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.speed = 1;
        this.image = new Image();
        this.image.src = 'images/background.png';
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
        ctx.drawImage(this.image, this.x + canvas.width, this.y, canvas.width, canvas.height);
    }

    update() {
        this.x -= this.speed;
        if (this.x <= -canvas.width) {
            this.x = 0;
        }
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let paraglider = new Paraglider(100, 100);
let mountains = [
    new Mountain(200, 400, 100, 200),
    new Mountain(400, 300, 150, 300)
];
let background = new Background();
let gameRunning = false;

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.update();
        background.draw(ctx);
        paraglider.update();
        paraglider.draw(ctx);
        mountains.forEach(mountain => {
            mountain.update();
            mountain.draw(ctx);
        });
        requestAnimationFrame(gameLoop);
    }
}

document.getElementById('startButton').addEventListener('click', () => {
    gameRunning = true;
    gameLoop();
});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            paraglider.y -= paraglider.speed;
            break;
        case 'ArrowDown':
            paraglider.y += paraglider.speed;
            break;
        case 'ArrowLeft':
            paraglider.x -= paraglider.speed;
            break;
        case 'ArrowRight':
            paraglider.x += paraglider.speed;
            break;
    }
});

function checkCollision(paraglider, mountain) {
    return (
        paraglider.x < mountain.x + mountain.width &&
        paraglider.x + paraglider.width > mountain.x &&
        paraglider.y < mountain.y + mountain.height &&
        paraglider.y + paraglider.height > mountain.y
    );
}

function updateGame() {
    mountains.forEach(mountain => {
        if (checkCollision(paraglider, mountain)) {
            gameRunning = false;
            alert('Game Over!');
        }
    });
}

setInterval(updateGame, 100);
