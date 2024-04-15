// Objects
const player = {
    x: 0,
    y: 0,
    regX: 10,
    regY: 12,
    speed: 120,
    moving: false,
    direction: undefined
}

const tiles = [];

const GRID_HEIGHT = 10;
const GRID_WIDTH = 16;
const TILE_SIZE = 32;

for (let i = 0; i < GRID_HEIGHT; i++) {
    const tileRow = [];
    for (let j = 0; j < GRID_WIDTH; j++) {
        tileRow.push(2);
    }
    tiles.push(tileRow);
}

tiles[0][0] = 1;
tiles[1][0] = 1;
tiles[2][0] = 1;
tiles[3][0] = 1;
tiles[4][0] = 1;
tiles[4][1] = 1;
tiles[4][2] = 1;
tiles[4][3] = 1;
tiles[4][4] = 1;
tiles[4][5] = 1;
tiles[3][5] = 1;
tiles[2][5] = 1;
tiles[1][5] = 1;
tiles[1][6] = 1;
tiles[1][7] = 1;
tiles[1][8] = 1;

tiles[8][8] = 4;
tiles[8][9] = 4;
tiles[7][8] = 4;
tiles[7][9] = 4;

console.log(tiles);

function getTileAt({ row, col }) {
    if (row < 0 || col < 0 || row >= GRID_HEIGHT || col >= GRID_WIDTH) return "FUCK YOU!";

    return tiles[row][col];
}

function createTiles() {
    const background = document.getElementById("background");

    tiles.forEach(tileRow => tileRow.forEach(tile => {
        const tileDiv = document.createElement("div");
        tileDiv.classList.add("tile");
        tileDiv.classList.add(tile);
        background.appendChild(tileDiv);
    }));

    background.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    background.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
    background.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");
    console.log(tiles);
}

function displayTile() {
    const visualTiles = document.querySelectorAll("#background .tile");

    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const modelTile = getTileAt({ row, col });
            const visualTile = visualTiles[row * GRID_WIDTH + col];

            visualTile.classList.add(getClassForTileType(modelTile));
        }
    }
}

function getClassForTileType(tiletype) {
    switch (tiletype) {
        case 1: return "path";
        case 2: return "water";
        case 3: return "stone";
        case 4: return "tree";
    }
}

function coordFromPos({ x, y }) {
    const col = Math.round(x / 32);
    const row = Math.round(y / 32);
    const coord = { row, col };
    return coord;
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
    createTiles();
    displayTile();
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

    if (!player.moving) {
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

    if (canMoveTo(newPos)) {
        player.x = newPos.x;
        player.y = newPos.y;
    } else player.moving = false
}

function canMoveTo(position) {
    const { row, col } = coordFromPos(position);

    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) {
        return false
    }

    const tileType = getTileAt({ row, col });
    switch (tileType) {
        case 1: return true;
        case 2: return false;
        case 3: return true;
        case 4: return false
    }

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
    showDebugging();
}

function showDebugging() {
    showDebugTileUnderPlayer();
    showDubPlayerRect();
    showDebugPlayerRegistrationPoint();
}

let lastplayerCoord = { row: 0, col: 0 };

function showDubPlayerRect() {
    const visualPlayer = document.querySelector("#player");
    if (!visualPlayer.classList.contains("show-rect")) {
        visualPlayer.classList.add("show-rect");
    }
}

function showDebugTileUnderPlayer() {
    const coord = coordFromPos(player);
    if (coord.row != lastplayerCoord.row || coord.col != lastplayerCoord.col) {
        unHighlightTile(lastplayerCoord);
        highlightTile(coord);
    }

    lastplayerCoord = coord;
}

function highlightTile({ row, col }) {
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];
    visualTile.classList.add("highlight");
}

function unHighlightTile({ row, col }) {
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];
    visualTile.classList.remove("highlight");
}

function showDebugPlayerRegistrationPoint() {
    const visualPlayer = document.querySelector("#player");
    if (!visualPlayer.classList.contains("show-reg-point")) {
        visualPlayer.classList.add("show-reg-point");
    }

    visualPlayer.style.setProperty("--REGX", player.regX + "px");
    visualPlayer.style.setProperty("--REGY", player.regY + "px");
}

// Executes
run();