class Paraglider {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        // Update paraglider position based on user input
    }
}

class Mountain {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let paraglider = new Paraglider(100, 100);
let mountains = [
    new Mountain(200, 400, 100, 200),
    new Mountain(400, 300, 150, 300)
];
let gameRunning = false;

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paraglider.update();
        paraglider.draw(ctx);
        mountains.forEach(mountain => mountain.draw(ctx));
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
