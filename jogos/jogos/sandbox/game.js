// ============================================================
// SANDBOX ADVENTURE
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

let W = 0;
let H = 0;
let DPR = 1;

function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * DPR;
    canvas.height = H * DPR;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

window.addEventListener("resize", resize);
resize();

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const TILE = 32;

const WORLD_WIDTH = 500;
const WORLD_HEIGHT = 180;

const GRAVITY = 0.55;
const MOVE_SPEED = 4.2;
const JUMP_FORCE = 10.8;
const REACH = TILE * 6;

const AIR = 0;
const GRASS = 1;
const DIRT = 2;
const STONE = 3;
const WOOD = 4;
const LEAVES = 5;
const COAL = 6;
const IRON = 7;
const GOLD = 8;
const DIAMOND = 9;
const SAND = 10;
const WATER = 11;

const blockNames = {
    [GRASS]: "Grama",
    [DIRT]: "Terra",
    [STONE]: "Pedra",
    [WOOD]: "Madeira",
    [LEAVES]: "Folhas",
    [COAL]: "Carvão",
    [IRON]: "Ferro",
    [GOLD]: "Ouro",
    [DIAMOND]: "Diamante",
    [SAND]: "Areia"
};

const blockIcons = {
    [DIRT]: "🟫",
    [STONE]: "🪨",
    [WOOD]: "🪵",
    [SAND]: "🟨",
    [COAL]: "⚫",
    [IRON]: "🔩",
    [GOLD]: "🟡",
    [DIAMOND]: "💎"
};

// ============================================================
// MUNDO
// ============================================================

const world = [];

for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y] = new Array(WORLD_WIDTH).fill(AIR);
}

const surface = new Array(WORLD_WIDTH);

function random(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}

function noise(x, scale) {
    const a = Math.floor(x / scale);
    const b = a + 1;

    const t = (x % scale) / scale;
    const smooth = t * t * (3 - 2 * t);

    return random(a * 17.31) * (1 - smooth) +
           random(b * 17.31) * smooth;
}

function terrainHeight(x) {
    const n1 = noise(x, 45);
    const n2 = noise(x + 1000, 20);
    const n3 = noise(x + 5000, 9);

    return Math.floor(
        62 +
        n1 * 18 +
        n2 * 9 +
        n3 * 3
    );
}

function generateWorld() {

    for (let x = 0; x < WORLD_WIDTH; x++) {

        const ground = terrainHeight(x);

        surface[x] = ground;

        for (let y = ground; y < WORLD_HEIGHT; y++) {

            if (y === ground) {
                world[y][x] = GRASS;
            } else if (y < ground + 5) {
                world[y][x] = DIRT;
            } else {
                world[y][x] = STONE;
            }
        }
    }

    // CAVERNAS
    for (let x = 4; x < WORLD_WIDTH - 4; x++) {

        for (let y = 85; y < WORLD_HEIGHT - 8; y++) {

            const n =
                Math.sin(x * 0.16 + y * 0.08) +
                Math.sin(x * 0.07 - y * 0.15);

            if (n > 1.55) {
                world[y][x] = AIR;
            }
        }
    }

    // MINÉRIOS
    for (let x = 2; x < WORLD_WIDTH - 2; x++) {

        for (let y = 80; y < WORLD_HEIGHT - 4; y++) {

            if (world[y][x] !== STONE) continue;

            const r = Math.random();

            if (r < 0.018) {
                world[y][x] = DIAMOND;
            } else if (r < 0.045) {
                world[y][x] = GOLD;
            } else if (r < 0.09) {
                world[y][x] = IRON;
            } else if (r < 0.17) {
                world[y][x] = COAL;
            }
        }
    }

    // ÁREAS DE AREIA
    for (let x = 3; x < WORLD_WIDTH - 3; x++) {

        if (surface[x] > 90 && random(x * 4.71) > 0.7) {

            for (let y = surface[x]; y < surface[x] + 3; y++) {
                if (y < WORLD_HEIGHT) {
                    world[y][x] = SAND;
                }
            }
        }
    }

    // ÁRVORES
    for (let x = 5; x < WORLD_WIDTH - 5; x++) {

        if (Math.random() > 0.93) {

            const ground = surface[x];

            if (world[ground][x] !== GRASS) continue;

            const height = 4 + Math.floor(Math.random() * 3);

            for (let i = 1; i <= height; i++) {

                if (ground - i >= 0) {
                    world[ground - i][x] = WOOD;
                }
            }

            const top = ground - height;

            for (let yy = top - 2; yy <= top + 2; yy++) {

                for (let xx = x - 2; xx <= x + 2; xx++) {

                    if (
                        yy >= 0 &&
                        yy < WORLD_HEIGHT &&
                        xx >= 0 &&
                        xx < WORLD_WIDTH
                    ) {

                        const distance =
                            Math.abs(xx - x) +
                            Math.abs(yy - top);

                        if (distance < 4 && world[yy][xx] === AIR) {
                            world[yy][xx] = LEAVES;
                        }
                    }
                }
            }
        }
    }
}

generateWorld();

// ============================================================
// PLAYER
// ============================================================

const player = {
    x: 20 * TILE,
    y: 30 * TILE,

    width: 22,
    height: 42,

    vx: 0,
    vy: 0,

    health: 100,

    grounded: false,

    direction: 1,

    walkTime: 0,
    hurtTime: 0
};

function findSpawn() {

    const x = 20;

    player.x = x * TILE;

    player.y = (surface[x] - 4) * TILE;

    while (
        player.y < WORLD_HEIGHT * TILE &&
        !isSolidAt(
            player.x,
            player.y + player.height + 2
        )
    ) {
        player.y += 1;
    }
}

findSpawn();

// ============================================================
// CONTROLES
// ============================================================

const keys = {};

window.addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

    if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
        .includes(e.key.toLowerCase())
    ) {
        e.preventDefault();
    }

    // Hotbar
    if (e.key >= "1" && e.key <= "5") {

        const slot = Number(e.key) - 1;

        selectedSlot = slot;

        updateHotbar();
    }

    // Pulo: SOMENTE quando apertar
    if (
        (e.key.toLowerCase() === "w" ||
        e.key.toLowerCase() === "arrowup" ||
        e.key === " ") &&
        player.grounded
    ) {

        player.vy = -JUMP_FORCE;

        player.grounded = false;
    }
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

// ============================================================
// HOTBAR
// ============================================================

const hotbarItems = [
    {
        block: WOOD,
        icon: "🪵"
    },
    {
        block: DIRT,
        icon: "🟫"
    },
    {
        block: STONE,
        icon: "🪨"
    },
    {
        block: SAND,
        icon: "🟨"
    },
    {
        block: DIAMOND,
        icon: "💎"
    }
];

let selectedSlot = 0;

const slots = document.querySelectorAll(".slot");

function updateHotbar() {

    slots.forEach((slot, index) => {

        slot.classList.toggle(
            "selected",
            index === selectedSlot
        );
    });
}

slots.forEach((slot, index) => {

    slot.addEventListener("click", () => {

        selectedSlot = index;

        updateHotbar();
    });
});

// ============================================================
// MOUSE
// ============================================================

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", e => {

    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener("contextmenu", e => {
    e.preventDefault();
});

canvas.addEventListener("mousedown", e => {

    const worldX =
        Math.floor(
            (mouseX + camera.x) / TILE
        );

    const worldY =
        Math.floor(
            (mouseY + camera.y) / TILE
        );

    if (!inWorld(worldX, worldY)) return;

    const dx =
        worldX * TILE + TILE / 2 -
        (player.x + player.width / 2);

    const dy =
        worldY * TILE + TILE / 2 -
        (player.y + player.height / 2);

    const distance = Math.sqrt(dx * dx + dy * dy);

    // Só permite interagir perto do jogador
    if (distance > REACH) return;

    if (e.button === 0) {

        breakBlock(worldX, worldY);

    } else if (e.button === 2) {

        placeBlock(worldX, worldY);
    }
});

// ============================================================
// BLOCOS
// ============================================================

function inWorld(x, y) {

    return (
        x >= 0 &&
        x < WORLD_WIDTH &&
        y >= 0 &&
        y < WORLD_HEIGHT
    );
}

function getBlock(x, y) {

    if (!inWorld(x, y)) return STONE;

    return world[y][x];
}

function setBlock(x, y, block) {

    if (!inWorld(x, y)) return;

    world[y][x] = block;
}

function isSolid(block) {

    return (
        block !== AIR &&
        block !== WATER
    );
}

function isSolidAt(px, py) {

    const left = Math.floor(px / TILE);
    const right = Math.floor((px + player.width - 1) / TILE);

    const top = Math.floor(py / TILE);
    const bottom = Math.floor((py + player.height - 1) / TILE);

    for (let y = top; y <= bottom; y++) {

        for (let x = left; x <= right; x++) {

            if (isSolid(getBlock(x, y))) {
                return true;
            }
        }
    }

    return false;
}

// ============================================================
// MINERAÇÃO
// ============================================================

const particles = [];

function breakBlock(x, y) {

    const block = getBlock(x, y);

    if (block === AIR || block === WATER) return;

    // Não permite destruir blocos do corpo do jogador
    if (
        rectsOverlap(
            {
                x: x * TILE,
                y: y * TILE,
                width: TILE,
                height: TILE
            },
            player
        )
    ) {
        return;
    }

    setBlock(x, y, AIR);

    createParticles(
        x * TILE + TILE / 2,
        y * TILE + TILE / 2,
        block
    );
}

function placeBlock(x, y) {

    if (getBlock(x, y) !== AIR) return;

    const block =
        hotbarItems[selectedSlot].block;

    const blockRect = {
        x: x * TILE,
        y: y * TILE,
        width: TILE,
        height: TILE
    };

    // Não pode colocar dentro do jogador
    if (rectsOverlap(blockRect, player)) {
        return;
    }

    setBlock(x, y, block);
}

// ============================================================
// COLISÃO
// ============================================================

function rectsOverlap(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function moveHorizontal() {

    player.x += player.vx;

    if (player.vx > 0) {

        const right =
            player.x + player.width;

        const tileX =
            Math.floor(right / TILE);

        const top =
            Math.floor(player.y / TILE);

        const bottom =
            Math.floor(
                (player.y + player.height - 1) /
                TILE
            );

        for (let y = top; y <= bottom; y++) {

            if (isSolid(getBlock(tileX, y))) {

                player.x =
                    tileX * TILE -
                    player.width -
                    0.01;

                player.vx = 0;

                break;
            }
        }

    } else if (player.vx < 0) {

        const left = player.x;

        const tileX =
            Math.floor(left / TILE);

        const top =
            Math.floor(player.y / TILE);

        const bottom =
            Math.floor(
                (player.y + player.height - 1) /
                TILE
            );

        for (let y = top; y <= bottom; y++) {

            if (isSolid(getBlock(tileX, y))) {

                player.x =
                    (tileX + 1) * TILE +
                    0.01;

                player.vx = 0;

                break;
            }
        }
    }
}

function moveVertical() {

    player.grounded = false;

    player.y += player.vy;

    if (player.vy > 0) {

        const bottom =
            player.y + player.height;

        const tileY =
            Math.floor(bottom / TILE);

        const left =
            Math.floor(player.x / TILE);

        const right =
            Math.floor(
                (player.x + player.width - 1) /
                TILE
            );

        for (let x = left; x <= right; x++) {

            if (isSolid(getBlock(x, tileY))) {

                player.y =
                    tileY * TILE -
                    player.height -
                    0.01;

                player.vy = 0;

                player.grounded = true;

                break;
            }
        }

    } else if (player.vy < 0) {

        const top = player.y;

        const tileY =
            Math.floor(top / TILE);

        const left =
            Math.floor(player.x / TILE);

        const right =
            Math.floor(
                (player.x + player.width - 1) /
                TILE
            );

        for (let x = left; x <= right; x++) {

            if (isSolid(getBlock(x, tileY))) {

                player.y =
                    (tileY + 1) * TILE +
                    0.01;

                player.vy = 0;

                break;
            }
        }
    }
}

// ============================================================
// CÂMERA
// ============================================================

const camera = {
    x: 0,
    y: 0
};

function updateCamera() {

    const targetX =
        player.x +
        player.width / 2 -
        W / 2;

    const targetY =
        player.y +
        player.height / 2 -
        H / 2;

    camera.x +=
        (targetX - camera.x) * 0.12;

    camera.y +=
        (targetY - camera.y) * 0.12;

    camera.x = Math.max(
        0,
        Math.min(
            camera.x,
            WORLD_WIDTH * TILE - W
        )
    );

    camera.y = Math.max(
        0,
        Math.min(
            camera.y,
            WORLD_HEIGHT * TILE - H
        )
    );
}

// ============================================================
// PARTÍCULAS
// ============================================================

function createParticles(x, y, block) {

    for (let i = 0; i < 8; i++) {

        particles.push({
            x,
            y,

            vx:
                (Math.random() - 0.5) * 5,

            vy:
                (Math.random() - 0.5) * 5,

            life: 1,

            size:
                3 + Math.random() * 5,

            block
        });
    }
}

function updateParticles() {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.18;

        p.life -= 0.025;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// ============================================================
// DIA / NOITE
// ============================================================

let worldTime = 0;

function getNightAlpha() {

    const cycle =
        (worldTime % 12000) / 12000;

    const sun =
        Math.sin(cycle * Math.PI * 2);

    if (sun > 0.15) return 0;

    return Math.min(
        0.65,
        Math.max(
            0,
            (-sun + 0.15) * 0.55
        )
    );
}

// ============================================================
// DESENHO DO CÉU
// ============================================================

function drawSky() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#57b9ff"
    );

    gradient.addColorStop(
        0.55,
        "#9cddff"
    );

    gradient.addColorStop(
        1,
        "#d8f2ff"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    // Sol distante
    drawMountains(
        0.12,
        H * 0.58,
        "#79a9c2"
    );

    drawMountains(
        0.22,
        H * 0.68,
        "#56899f"
    );

    // Nuvens
    drawClouds();
}

function drawMountains(parallax, baseY, color) {

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.moveTo(0, H);

    for (
        let x = -100;
        x <= W + 100;
        x += 90
    ) {

        const worldX =
            x + camera.x * parallax;

        const height =
            100 +
            Math.sin(worldX * 0.008) * 80 +
            Math.sin(worldX * 0.018) * 40;

        ctx.lineTo(
            x,
            baseY - height
        );
    }

    ctx.lineTo(W, H);
    ctx.closePath();

    ctx.fill();
}

function drawClouds() {

    ctx.save();

    ctx.globalAlpha = 0.75;

    for (let i = 0; i < 9; i++) {

        const x =
            ((i * 280 -
                camera.x * 0.15) %
                (W + 500)) - 250;

        const y =
            70 +
            (i % 4) * 55;

        drawCloud(x, y);
    }

    ctx.restore();
}

function drawCloud(x, y) {

    ctx.fillStyle = "rgba(255,255,255,0.85)";

    ctx.beginPath();

    ctx.arc(x, y, 22, 0, Math.PI * 2);

    ctx.arc(
        x + 28,
        y - 12,
        28,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 60,
        y,
        22,
        0,
        Math.PI * 2
    );

    ctx.fillRect(
        x - 5,
        y,
        70,
        20
    );

    ctx.fill();
}

// ============================================================
// DESENHO DOS BLOCOS
// ============================================================

function drawBlock(block, x, y) {

    const px =
        x * TILE - camera.x;

    const py =
        y * TILE - camera.y;

    switch (block) {

        case GRASS:

            ctx.fillStyle = "#76502f";
            ctx.fillRect(px, py, TILE, TILE);

            ctx.fillStyle = "#42a844";
            ctx.fillRect(px, py, TILE, 8);

            ctx.fillStyle = "#62c54d";

            for (let i = 0; i < 4; i++) {

                ctx.fillRect(
                    px + i * 9 + 2,
                    py + 2,
                    3,
                    4
                );
            }

            break;

        case DIRT:

            ctx.fillStyle = "#80562f";
            ctx.fillRect(px, py, TILE, TILE);

            ctx.fillStyle = "#98663a";

            for (let i = 0; i < 5; i++) {

                const sx =
                    (x * 7 + y * 13 + i * 11) %
                    27 + 2;

                const sy =
                    (x * 11 + y * 5 + i * 7) %
                    27 + 2;

                ctx.fillRect(
                    px + sx,
                    py + sy,
                    3,
                    3
                );
            }

            break;

        case STONE:

            ctx.fillStyle = "#696d73";
            ctx.fillRect(px, py, TILE, TILE);

            ctx.fillStyle = "#7d8288";

            for (let i = 0; i < 6; i++) {

                const sx =
                    (x * 13 + i * 9) % 27;

                const sy =
                    (y * 7 + i * 13) % 27;

                ctx.fillRect(
                    px + sx,
                    py + sy,
                    3,
                    3
                );
            }

            break;

        case WOOD:

            ctx.fillStyle = "#704522";
            ctx.fillRect(px, py, TILE, TILE);

            ctx.fillStyle = "#9a6030";

            for (let i = 5; i < TILE; i += 9) {

                ctx.fillRect(
                    px + i,
                    py,
                    3,
                    TILE
                );
            }

            break;

        case LEAVES:

            ctx.fillStyle = "#287a38";
            ctx.fillRect(px, py, TILE, TILE);

            ctx.fillStyle = "#3ca84d";

            ctx.fillRect(
                px + 5,
                py + 5,
                9,
                8
            );

            ctx.fillRect(
                px + 20,
                py + 14,
                7,
                7
            );

            break;

        case COAL:

            drawOreBlock(
                px,
                py,
                "#25282c"
            );

            break;

        case IRON:

            drawOreBlock(
                px,
                py,
                "#c4a080"
            );

            break;

        case GOLD:

            drawOreBlock(
                px,
                py,
                "#ffd52a"
            );

            break;

        case DIAMOND:

            drawOreBlock(
                px,
                py,
                "#4de1e9"
            );

            break;

        case SAND:

            ctx.fillStyle = "#d8c275";
            ctx.fillRect(px, py, TILE, TILE);

            ctx.fillStyle = "#ead78e";

            for (let i = 0; i < 6; i++) {

                ctx.fillRect(
                    px + ((i * 13) % 28),
                    py + ((i * 7) % 27),
                    2,
                    2
                );
            }

            break;
    }

    // borda
    ctx.strokeStyle =
        "rgba(0,0,0,0.16)";

    ctx.strokeRect(
        px + 0.5,
        py + 0.5,
        TILE - 1,
        TILE - 1
    );
}

function drawOreBlock(x, y, oreColor) {

    ctx.fillStyle = "#686c72";

    ctx.fillRect(
        x,
        y,
        TILE,
        TILE
    );

    ctx.fillStyle = oreColor;

    const positions = [
        [5, 6],
        [18, 4],
        [11, 19],
        [23, 23]
    ];

    positions.forEach(p => {

        ctx.fillRect(
            x + p[0],
            y + p[1],
            6,
            6
        );
    });
}

// ============================================================
// JOGADOR
// ============================================================

function drawPlayer() {

    const x =
        player.x - camera.x;

    const y =
        player.y - camera.y;

    const moving =
        Math.abs(player.vx) > 0.2 &&
        player.grounded;

    const legOffset =
        moving ?
        Math.sin(player.walkTime) * 4 :
        0;

    // sombra
    ctx.fillStyle =
        "rgba(0,0,0,0.22)";

    ctx.beginPath();

    ctx.ellipse(
        x + player.width / 2,
        y + player.height + 3,
        13,
        4,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // pernas
    ctx.fillStyle = "#263d75";

    ctx.fillRect(
        x + 3,
        y + 27,
        7,
        13 + legOffset
    );

    ctx.fillRect(
        x + 13,
        y + 27,
        7,
        13 - legOffset
    );

    // botas
    ctx.fillStyle = "#20242b";

    ctx.fillRect(
        x + 1,
        y + 37 + legOffset,
        10,
        5
    );

    ctx.fillRect(
        x + 12,
        y + 37 - legOffset,
        10,
        5
    );

    // corpo
    ctx.fillStyle = "#3d78c7";

    ctx.fillRect(
        x + 2,
        y + 15,
        19,
        16
    );

    // camisa
    ctx.fillStyle = "#55a0ed";

    ctx.fillRect(
        x + 5,
        y + 17,
        13,
        9
    );

    // braço
    ctx.fillStyle = "#e2a878";

    ctx.fillRect(
        x - 2,
        y + 17,
        5,
        14
    );

    ctx.fillRect(
        x + 20,
        y + 17,
        5,
        14
    );

    // cabeça
    ctx.fillStyle = "#e2a878";

    ctx.fillRect(
        x + 3,
        y + 2,
        18,
        16
    );

    // cabelo
    ctx.fillStyle = "#3a2418";

    ctx.fillRect(
        x + 3,
        y,
        18,
        6
    );

    ctx.fillRect(
        x + 3,
        y + 5,
        4,
        7
    );

    // olho
    ctx.fillStyle = "#151515";

    const eyeX =
        player.direction > 0 ?
        x + 16 :
        x + 6;

    ctx.fillRect(
        eyeX,
        y + 8,
        3,
        3
    );
}

// ============================================================
// MUNDO
// ============================================================

function drawWorld() {

    const startX =
        Math.max(
            0,
            Math.floor(camera.x / TILE) - 1
        );

    const endX =
        Math.min(
            WORLD_WIDTH,
            Math.ceil(
                (camera.x + W) / TILE
            ) + 1
        );

    const startY =
        Math.max(
            0,
            Math.floor(camera.y / TILE) - 1
        );

    const endY =
        Math.min(
            WORLD_HEIGHT,
            Math.ceil(
                (camera.y + H) / TILE
            ) + 1
        );

    for (let y = startY; y < endY; y++) {

        for (let x = startX; x < endX; x++) {

            const block =
                world[y][x];

            if (block !== AIR) {
                drawBlock(block, x, y);
            }
        }
    }
}

// ============================================================
// CURSOR / BLOCO ALVO
// ============================================================

function drawTargetBlock() {

    const worldX =
        Math.floor(
            (mouseX + camera.x) /
            TILE
        );

    const worldY =
        Math.floor(
            (mouseY + camera.y) /
            TILE
        );

    if (!inWorld(worldX, worldY)) return;

    const dx =
        worldX * TILE + TILE / 2 -
        (player.x + player.width / 2);

    const dy =
        worldY * TILE + TILE / 2 -
        (player.y + player.height / 2);

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    if (distance > REACH) return;

    ctx.strokeStyle =
        "rgba(255,255,255,0.9)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        worldX * TILE - camera.x + 2,
        worldY * TILE - camera.y + 2,
        TILE - 4,
        TILE - 4
    );

    ctx.lineWidth = 1;
}

// ============================================================
// PARTÍCULAS NA TELA
// ============================================================

function drawParticles() {

    particles.forEach(p => {

        ctx.globalAlpha = p.life;

        ctx.fillStyle =
            getParticleColor(p.block);

        ctx.fillRect(
            p.x - camera.x,
            p.y - camera.y,
            p.size,
            p.size
        );
    });

    ctx.globalAlpha = 1;
}

function getParticleColor(block) {

    switch (block) {

        case GRASS:
            return "#55b34a";

        case DIRT:
            return "#8b5b32";

        case STONE:
            return "#8c9298";

        case WOOD:
            return "#9a6030";

        case COAL:
            return "#222";

        case IRON:
            return "#d3a27c";

        case GOLD:
            return "#ffd52a";

        case DIAMOND:
            return "#4de1e9";

        default:
            return "#aaa";
    }
}

// ============================================================
// ILUMINAÇÃO
// ============================================================

function drawNight() {

    const alpha = getNightAlpha();

    if (alpha <= 0) return;

    ctx.fillStyle =
        `rgba(12,18,55,${alpha})`;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}

// ============================================================
// HUD
// ============================================================

function updateHUD() {

    const health =
        document.getElementById("health");

    const posX =
        document.getElementById("posX");

    const posY =
        document.getElementById("posY");

    if (health) {
        health.textContent =
            Math.max(
                0,
                Math.floor(player.health)
            );
    }

    if (posX) {
        posX.textContent =
            Math.floor(
                player.x / TILE
            );
    }

    if (posY) {
        posY.textContent =
            Math.floor(
                player.y / TILE
            );
    }
}

// ============================================================
// ATUALIZAÇÃO
// ============================================================

function update() {

    // movimento
    let moving = false;

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        player.vx = -MOVE_SPEED;

        player.direction = -1;

        moving = true;

    } else if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.vx = MOVE_SPEED;

        player.direction = 1;

        moving = true;

    } else {

        player.vx *= 0.78;

        if (Math.abs(player.vx) < 0.05) {
            player.vx = 0;
        }
    }

    if (moving) {
        player.walkTime += 0.25;
    }

    // gravidade
    player.vy += GRAVITY;

    if (player.vy > 14) {
        player.vy = 14;
    }

    moveHorizontal();
    moveVertical();

    updateCamera();

    updateParticles();

    worldTime++;

    updateHUD();
}

// ============================================================
// RENDER
// ============================================================

function render() {

    drawSky();

    drawWorld();

    drawParticles();

    drawTargetBlock();

    drawPlayer();

    drawNight();
}

// ============================================================
// LOOP
// ============================================================

function gameLoop() {

    update();

    render();

    requestAnimationFrame(gameLoop);
}

updateHotbar();
gameLoop();
