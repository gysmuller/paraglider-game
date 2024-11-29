class Paraglider {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.speed = 5;
        this.gravity = 0.2;
        this.liftForce = -8; // Changed from this.lift to this.liftForce
        this.velocity = 0;

        // Simplify image handling
        this.loaded = false;
        this.image = new Image();
        
        // Add error handling before setting src
        this.image.onload = () => {
            console.log('Paraglider image loaded successfully');
            this.loaded = true;
        };
        
        this.image.onerror = () => {
            console.error('Failed to load paraglider image - using fallback');
            this.loaded = false;
        };

        // Use a simple single-frame image for now
        this.frameIndex = 0;
        this.frameCount = 1; // Change to 1 frame temporarily
        this.frameWidth = 50;
        this.frameHeight = 50;
        
        // Try different path
        this.image.src = 'images/paraglider.png';
    }

    draw(ctx) {
        // Draw a colored rectangle if image fails to load
        if (!this.loaded || !this.image.complete) {
            ctx.fillStyle = 'rgba(0, 100, 255, 0.8)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Add a triangle on top to make it look like a paraglider
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
            ctx.fill();
            return;
        }

        // Only try to draw image if it's loaded
        ctx.drawImage(
            this.image,
            0, // Remove animation frames for now
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Draw collision point (center) for debugging
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        // Apply gravity
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Keep paraglider in bounds
        if (this.y > canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }

    lift() {
        this.velocity += this.liftForce * 0.3; // Use liftForce and increase multiplier for stronger lift
    }
}

class Mountain {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.peakOffset = Math.random() * 0.3 + 0.3; // Random peak position (30-70% of width)
    }

    draw(ctx) {
        const peak = this.x + (this.width * this.peakOffset);
        
        // Draw mountain body
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(peak, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fillStyle = '#4a4a4a';
        ctx.fill();

        // Draw snow cap
        const snowHeight = this.height * 0.2;
        ctx.beginPath();
        ctx.moveTo(peak - 20, this.y + snowHeight);
        ctx.lineTo(peak, this.y);
        ctx.lineTo(peak + 20, this.y + snowHeight);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }

    update() {
        this.x -= this.speed;
    }
}

class Cloud {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * 0.6); // Keep clouds in upper 60% of screen
        this.width = Math.random() * 100 + 50;
        this.height = this.width * 0.6;
        this.speed = Math.random() * 0.5 + 0.5;
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // Draw cloud shape using multiple circles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 0.3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.2, this.y - this.height * 0.1, this.width * 0.25, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.4, this.y, this.width * 0.35, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = canvas.width + this.width;
            this.y = Math.random() * (canvas.height * 0.6);
        }
    }
}

class Background {
    constructor() {
        this.clouds = Array(5).fill(null).map(() => new Cloud());
    }

    draw(ctx) {
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#4CB5FF');  // Light blue at top
        gradient.addColorStop(1, '#87CEEB');  // Darker blue at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw clouds
        this.clouds.forEach(cloud => cloud.draw(ctx));
    }

    update() {
        this.clouds.forEach(cloud => cloud.update());
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const distanceCounter = document.getElementById('distanceCounter');
let distance = 0;
let paraglider = new Paraglider(100, 100);
let mountains = [];
let background = new Background();
let gameRunning = false;
const gameOverBanner = document.getElementById('gameOverBanner');

function startGame() {
    mountains = [];
    paraglider = new Paraglider(100, 100);
    gameRunning = true;
    gameOverBanner.classList.add('hidden');
    distance = 0;
    updateDistanceCounter();
    gameLoop();
}

function endGame() {
    gameRunning = false;
    gameOverBanner.classList.remove('hidden');
}

// Remove the start button event listener and replace with banner click handler
gameOverBanner.addEventListener('click', startGame);

function addMountain() {
    const minHeight = canvas.height * 0.3;  // At least 30% of canvas height
    const maxHeight = canvas.height * 0.7;  // Maximum 70% of canvas height
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    const width = height * 0.8;  // Width proportional to height
    
    mountains.push(new Mountain(
        canvas.width,
        canvas.height - height,
        width,
        height
    ));
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === ' ') {
        paraglider.lift(); // Call it as a method
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === ' ') {
        paraglider.velocity *= 0.6; // Reduce upward velocity when key is released
    }
});

function checkCollision(paraglider, mountain) {
    // Calculate paraglider center point
    const centerX = paraglider.x + paraglider.width / 2;
    const centerY = paraglider.y + paraglider.height / 2;

    // Check if center point is inside mountain
    return (
        centerX > mountain.x &&
        centerX < mountain.x + mountain.width &&
        centerY > mountain.y &&
        centerY < mountain.y + mountain.height
    );
}

function updateGame() {
    mountains.forEach(mountain => {
        if (checkCollision(paraglider, mountain)) {
            endGame();
        }
    });
}

// Auto-start the game when page loads
window.addEventListener('load', startGame);

setInterval(updateGame, 100);

setInterval(() => {
    if (gameRunning && mountains.length < 5) {
        addMountain();
    }
}, 2000);

function updateDistanceCounter() {
    const kilometers = (distance / 1000).toFixed(1);
    distanceCounter.textContent = `${kilometers} km`;
}

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        background.update();
        background.draw(ctx);
        
        paraglider.update();
        paraglider.draw(ctx);
        
        // Update and clean up mountains
        mountains = mountains.filter(mountain => mountain.x + mountain.width > 0);
        mountains.forEach(mountain => {
            mountain.update();
            mountain.draw(ctx);
        });
        
        // Add distance calculation (assuming each frame represents moving forward)
        distance += 2; // Increase by 2 meters per frame
        updateDistanceCounter();
        
        requestAnimationFrame(gameLoop);
    }
}
