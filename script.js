// Objects

const player = {
    x: 0,
    y: 0,
    speed: 200,
    moving: false,
    direction: undefined
}

const controls = {
    left: false,
    right: false,
    up: false,
    down: false
}

let lastTimestamp = 0;

// Functions
function run() {
    requestAnimationFrame(tick);
    addKeyControlListeners();
}

function addKeyControlListeners() {
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case "ArrowLeft":
                controls.left = true;
                break;
            case "ArrowRight":
                controls.right = true;
                break;
            case "ArrowUp":
                controls.up = true;
                break;
            case "ArrowDown":
                controls.down = true;
                break;
        }
    });

    document.addEventListener('keyup', function (event) {
        switch (event.key) {
            case "ArrowLeft":
                controls.left = false;
                break;
            case "ArrowRight":
                controls.right = false;
                break;
            case "ArrowUp":
                controls.up = false;
                break;
            case "ArrowDown":
                controls.down = false;
                break;
        }
    });
}

function displayPlayerAtPostion() {
    const visualPlayer = document.getElementById("player");
    visualPlayer.style.translate = `${player.x}px ${player.y}px`;
}

function displayPlayerAnimation() {
    const visualPlayer = document.getElementById("player");

    if(!player.moving) {
        visualPlayer.classList.remove("animate");
    } else if (!visualPlayer.classList.contains("animate")) {
        visualPlayer.classList.add("animate");
    }

    if (player.direction && !visualPlayer.classList.contains(player.direction)) {        
        visualPlayer.classList.remove("up", "down", "left", "right");
        visualPlayer.classList.add(player.direction);
    }
}

function movePlayer(deltaTime) {
    player.moving = false;

    const newPos = {
        x: player.x,
        y: player.y
    };

    if (controls.right) {
        player.moving = true;
        player.direction = "right"
        newPos.x += player.speed * deltaTime;
    } else if (controls.left) {
        player.moving = true;
        player.direction = "left"
        newPos.x -= player.speed * deltaTime;
    }

    if (controls.up) {
        player.moving = true;
        player.direction = "up"
        newPos.y -= player.speed * deltaTime;
    } else if (controls.down) {
        player.moving = true;
        player.direction = "down"
        newPos.y += player.speed * deltaTime;
    }

    if(canMoveTo(newPos)) {
        player.x = newPos.x;
        player.y = newPos.y;
    } else player.moving = false
}

function canMoveTo(position) {
    if (position.x < 0 || position.x > 485 || position.y < 0 || position.y > 340) {
        return false
    } else return true;
}

function tick(timestamp) {
    requestAnimationFrame(tick);

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    movePlayer(deltaTime);

    displayPlayerAtPostion();
    displayPlayerAnimation();
}

// Executes
run();