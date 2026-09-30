const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

let width = 0;
let height = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();


/* =========================
   CONFIGURAÇÕES
========================= */

const TILE = 32;

const WORLD_WIDTH = 500;
const WORLD_HEIGHT = 180;

const GRAVITY = 0.45;
const MOVE_SPEED = 4;
const JUMP_FORCE = -10;


/* =========================
   TIPOS DE BLOCOS
========================= */

const BLOCK = {
    AIR: 0,
    GRASS: 1,
    DIRT: 2,
    STONE: 3,
    WOOD: 4,
    LEAVES: 5,
    COAL: 6,
    IRON: 7,
    GOLD: 8,
    DIAMOND: 9
};


/* =========================
   CORES
========================= */

const blockColors = {
    [BLOCK.GRASS]: "#55a832",
    [BLOCK.DIRT]: "#8b5a2b",
    [BLOCK.STONE]: "#777",
    [BLOCK.WOOD]: "#75451e",
    [BLOCK.LEAVES]: "#267a32",
    [BLOCK.COAL]: "#222",
    [BLOCK.IRON]: "#b7b7b7",
    [BLOCK.GOLD]: "#e5b52c",
    [BLOCK.DIAMOND]: "#35d9ff"
};


/* =========================
   MUNDO
========================= */

const world = [];

for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y] = new Array(WORLD_WIDTH).fill(BLOCK.AIR);
}


/* =========================
   TERRENO
========================= */

let groundHeights = [];

let currentHeight = 65;

for (let x = 0; x < WORLD_WIDTH; x++) {

    currentHeight += (Math.random() - 0.5) * 2;

    currentHeight = Math.max(50, Math.min(75, currentHeight));

    groundHeights[x] = Math.floor(currentHeight);

    const ground = groundHeights[x];

    for (let y = ground; y < WORLD_HEIGHT; y++) {

        if (y === ground) {
            world[y][x] = BLOCK.GRASS;
        }

        else if (y < ground + 5) {
            world[y][x] = BLOCK.DIRT;
        }

        else {
            world[y][x] = BLOCK.STONE;
        }
    }
}


/* =========================
   CAVERNAS
========================= */

for (let i = 0; i < 100; i++) {

    const cx = Math.floor(Math.random() * WORLD_WIDTH);
    const cy = 75 + Math.floor(Math.random() * 70);

    const radiusX = 2 + Math.floor(Math.random() * 7);
    const radiusY = 2 + Math.floor(Math.random() * 4);

    for (let y = cy - radiusY; y <= cy + radiusY; y++) {

        for (let x = cx - radiusX; x <= cx + radiusX; x++) {

            if (
                x < 0 ||
                x >= WORLD_WIDTH ||
                y < 0 ||
                y >= WORLD_HEIGHT
            ) {
                continue;
            }

            const dx = (x - cx) / radiusX;
            const dy = (y - cy) / radiusY;

            if (dx * dx + dy * dy < 1) {
                world[y][x] = BLOCK.AIR;
            }
        }
    }
}


/* =========================
   MINÉRIOS
========================= */

function placeOre(block, amount, minY, maxY) {

    for (let i = 0; i < amount; i++) {

        const x = Math.floor(Math.random() * WORLD_WIDTH);
        const y = minY + Math.floor(
            Math.random() * (maxY - minY)
        );

        if (world[y] && world[y][x] === BLOCK.STONE) {
            world[y][x] = block;
        }
    }
}

placeOre(BLOCK.COAL, 500, 75, 150);
placeOre(BLOCK.IRON, 300, 85, 155);
placeOre(BLOCK.GOLD, 150, 100, 165);
placeOre(BLOCK.DIAMOND, 60, 125, 175);


/* =========================
   ÁRVORES
========================= */

function createTree(x) {

    const ground = groundHeights[x];

    const trunkHeight = 4 + Math.floor(Math.random() * 3);

    for (let y = ground - 1; y >= ground - trunkHeight; y--) {

        if (y >= 0) {
            world[y][x] = BLOCK.WOOD;
        }
    }

    const top = ground - trunkHeight;

    for (let y = top - 2; y <= top + 2; y++) {

        for (let xx = x - 2; xx <= x + 2; xx++) {

            if (
                xx >= 0 &&
                xx < WORLD_WIDTH &&
                y >= 0 &&
                y < WORLD_HEIGHT
            ) {

                const distance =
                    Math.abs(xx - x) +
                    Math.abs(y - top);

                if (distance < 4) {
                    world[y][xx] = BLOCK.LEAVES;
                }
            }
        }
    }
}


for (let x = 4; x < WORLD_WIDTH - 4; x++) {

    if (Math.random() < 0.055) {
        createTree(x);
    }
}


/* =========================
   JOGADOR
========================= */

const player = {

    x: 20 * TILE,

    y: (groundHeights[20] - 3) * TILE,

    width: 24,

    height: 44,

    vx: 0,

    vy: 0,

    speed: MOVE_SPEED,

    jump: JUMP_FORCE,

    onGround: false,

    health: 100
};


/* =========================
   CÂMERA
========================= */

const camera = {

    x: 0,

    y: 0
};


/* =========================
   TECLADO
========================= */

const keys = {};

window.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    if (
        event.key === " " ||
        event.key.toLowerCase() === "w" ||
        event.key === "arrowup"
    ) {

        if (player.onGround) {
            player.vy = player.jump;
        }
    }

    const number = parseInt(event.key);

    if (number >= 1 && number <= 5) {

        selectedSlot = number - 1;

        updateHotbar();
    }
});


window.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;
});


/* =========================
   MOVIMENTO
========================= */

function isSolid(block) {

    return block !== BLOCK.AIR;
}


function getBlockAtPixel(x, y) {

    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);

    if (
        tx < 0 ||
        tx >= WORLD_WIDTH ||
        ty < 0 ||
        ty >= WORLD_HEIGHT
    ) {
        return BLOCK.STONE;
    }

    return world[ty][tx];
}


function collisionX(newX) {

    const left = newX;
    const right = newX + player.width;

    const top = player.y + 4;
    const bottom = player.y + player.height - 4;

    const points = [
        [left, top],
        [left, bottom],
        [right, top],
        [right, bottom]
    ];

    for (const point of points) {

        if (isSolid(getBlockAtPixel(point[0], point[1]))) {
            return true;
        }
    }

    return false;
}


function collisionY(newY) {

    const left = player.x + 3;
    const right = player.x + player.width - 3;

    const top = newY;
    const bottom = newY + player.height;

    const points = [
        [left, top],
        [right, top],
        [left, bottom],
        [right, bottom]
    ];

    for (const point of points) {

        if (isSolid(getBlockAtPixel(point[0], point[1]))) {
            return true;
        }
    }

    return false;
}


function updatePlayer() {

    player.vx = 0;

    if (keys["a"] || keys["arrowleft"]) {
        player.vx = -player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.vx = player.speed;
    }


    const nextX = player.x + player.vx;

    if (!collisionX(nextX)) {
        player.x = nextX;
    }


    player.vy += GRAVITY;

    if (player.vy > 12) {
        player.vy = 12;
    }


    const nextY = player.y + player.vy;

    if (!collisionY(nextY)) {

        player.y = nextY;

        player.onGround = false;

    } else {

        if (player.vy > 0) {

            player.y =
                Math.floor(
                    (player.y + player.height) / TILE
                ) * TILE -
                player.height;

            player.onGround = true;

        }

        player.vy = 0;
    }
}


/* =========================
   MOUSE
========================= */

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", function(event) {

    mouseX = event.clientX;
    mouseY = event.clientY;
});


canvas.addEventListener("mousedown", function(event) {

    const worldX =
        mouseX + camera.x;

    const worldY =
        mouseY + camera.y;

    const tx =
        Math.floor(worldX / TILE);

    const ty =
        Math.floor(worldY / TILE);


    if (
        tx < 0 ||
        tx >= WORLD_WIDTH ||
        ty < 0 ||
        ty >= WORLD_HEIGHT
    ) {
        return;
    }


    const distance =
        Math.hypot(
            tx * TILE + TILE / 2 - (player.x + player.width / 2),
            ty * TILE + TILE / 2 - (player.y + player.height / 2)
        );


    if (distance > TILE * 5) {
        return;
    }


    if (event.button === 0) {

        if (world[ty][tx] !== BLOCK.AIR) {

            world[ty][tx] = BLOCK.AIR;
        }

    }


    if (event.button === 2) {

        if (world[ty][tx] === BLOCK.AIR) {

            if (selectedSlot === 1) {
                world[ty][tx] = BLOCK.DIRT;
            }

            if (selectedSlot === 2) {
                world[ty][tx] = BLOCK.STONE;
            }

            if (selectedSlot === 3) {
                world[ty][tx] = BLOCK.WOOD;
            }
        }
    }

});


canvas.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});


/* =========================
   HOTBAR
========================= */

let selectedSlot = 0;

const slots =
    document.querySelectorAll(".slot");


function updateHotbar() {

    slots.forEach(function(slot) {

        slot.classList.remove("selected");

    });

    if (slots[selectedSlot]) {

        slots[selectedSlot]
            .classList.add("selected");
    }
}


slots.forEach(function(slot, index) {

    slot.addEventListener("click", function() {

        selectedSlot = index;

        updateHotbar();
    });
});


/* =========================
   CÂMERA
========================= */

function updateCamera() {

    camera.x =
        player.x +
        player.width / 2 -
        width / 2;

    camera.y =
        player.y +
        player.height / 2 -
        height / 2;


    camera.x = Math.max(
        0,
        Math.min(
            camera.x,
            WORLD_WIDTH * TILE - width
        )
    );


    camera.y = Math.max(
        0,
        Math.min(
            camera.y,
            WORLD_HEIGHT * TILE - height
        )
    );
}


/* =========================
   DESENHAR BLOCO
========================= */

function drawBlock(x, y, block) {

    const px = x * TILE - camera.x;
    const py = y * TILE - camera.y;


    if (block === BLOCK.AIR) {
        return;
    }


    ctx.fillStyle =
        blockColors[block];

    ctx.fillRect(
        px,
        py,
        TILE,
        TILE
    );


    /* textura */

    if (block === BLOCK.GRASS) {

        ctx.fillStyle = "#7dcc45";

        ctx.fillRect(
            px,
            py,
            TILE,
            6
        );
    }


    if (block === BLOCK.STONE) {

        ctx.fillStyle = "rgba(255,255,255,0.08)";

        ctx.fillRect(
            px + 5,
            py + 6,
            5,
            5
        );

        ctx.fillRect(
            px + 19,
            py + 19,
            4,
            4
        );
    }


    if (block === BLOCK.WOOD) {

        ctx.fillStyle = "rgba(0,0,0,0.15)";

        ctx.fillRect(
            px + 7,
            py,
            4,
            TILE
        );

        ctx.fillRect(
            px + 20,
            py,
            4,
            TILE
        );
    }


    if (block === BLOCK.LEAVES) {

        ctx.fillStyle =
            "rgba(120,220,80,0.3)";

        ctx.fillRect(
            px + 4,
            py + 4,
            8,
            8
        );
    }


    if (block === BLOCK.COAL) {

        ctx.fillStyle = "#111";

        ctx.beginPath();

        ctx.arc(
            px + 16,
            py + 16,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    if (block === BLOCK.IRON) {

        ctx.fillStyle = "#ddd";

        ctx.fillRect(
            px + 8,
            py + 8,
            7,
            7
        );

        ctx.fillRect(
            px + 18,
            py + 18,
            6,
            6
        );
    }


    if (block === BLOCK.GOLD) {

        ctx.fillStyle = "#fff18a";

        ctx.fillRect(
            px + 7,
            py + 7,
            8,
            8
        );
    }


    if (block === BLOCK.DIAMOND) {

        ctx.fillStyle = "#bfffff";

        ctx.fillRect(
            px + 8,
            py + 5,
            8,
            10
        );

        ctx.fillRect(
            px + 16,
            py + 15,
            8,
            10
        );
    }
}


/* =========================
   DESENHAR MUNDO
========================= */

function drawWorld() {

    const startX =
        Math.floor(camera.x / TILE) - 1;

    const endX =
        Math.ceil(
            (camera.x + width) / TILE
        ) + 1;


    const startY =
        Math.floor(camera.y / TILE) - 1;

    const endY =
        Math.ceil(
            (camera.y + height) / TILE
        ) + 1;


    for (
        let y = Math.max(0, startY);
        y < Math.min(WORLD_HEIGHT, endY);
        y++
    ) {

        for (
            let x = Math.max(0, startX);
            x < Math.min(WORLD_WIDTH, endX);
            x++
        ) {

            drawBlock(
                x,
                y,
                world[y][x]
            );
        }
    }
}


/* =========================
   CÉU
========================= */

function drawSky() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );


    gradient.addColorStop(
        0,
        "#4fa4e8"
    );

    gradient.addColorStop(
        1,
        "#b7e4ff"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );
}


/* =========================
   JOGADOR
========================= */

function drawPlayer() {

    const x =
        player.x - camera.x;

    const y =
        player.y - camera.y;


    /* corpo */

    ctx.fillStyle = "#2f75ff";

    ctx.fillRect(
        x + 4,
        y + 16,
        16,
        24
    );


    /* cabeça */

    ctx.fillStyle = "#f2b27d";

    ctx.fillRect(
        x + 4,
        y,
        16,
        18
    );


    /* cabelo */

    ctx.fillStyle = "#402718";

    ctx.fillRect(
        x + 4,
        y,
        16,
        5
    );


    /* olhos */

    ctx.fillStyle = "#111";

    ctx.fillRect(
        x + 7,
        y + 8,
        3,
        3
    );

    ctx.fillRect(
        x + 15,
        y + 8,
        3,
        3
    );


    /* pernas */

    ctx.fillStyle = "#333";

    ctx.fillRect(
        x + 4,
        y + 40,
        7,
        4
    );

    ctx.fillRect(
        x + 13,
        y + 40,
        7,
        4
    );
}


/* =========================
   FUNDO
========================= */

function drawBackgroundDetails() {

    ctx.fillStyle =
        "rgba(255,255,255,0.8)";


    for (let i = 0; i < 6; i++) {

        const x =
            (i * 300 -
                camera.x * 0.2) %
            (width + 300);

        const y =
            80 + i * 55;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            25,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 25,
            y + 5,
            20,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 50,
            y,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


/* =========================
   HUD
========================= */

function updateHUD() {

    document.getElementById(
        "health"
    ).textContent =
        player.health;


    document.getElementById(
        "posX"
    ).textContent =
        Math.floor(
            player.x / TILE
        );


    document.getElementById(
        "posY"
    ).textContent =
        Math.floor(
            player.y / TILE
        );
}


/* =========================
   LOOP
========================= */

function gameLoop() {

    updatePlayer();

    updateCamera();

    updateHUD();


    drawSky();

    drawBackgroundDetails();

    drawWorld();

    drawPlayer();


    requestAnimationFrame(
        gameLoop
    );
}


gameLoop();
