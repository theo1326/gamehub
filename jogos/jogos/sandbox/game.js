// ============================================================
// SANDBOX ADVENTURE - VERSÃO EXPANDIDA
// ============================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

let W = 0;
let H = 0;
let DPR = 1;

function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);

    W = innerWidth;
    H = innerHeight;

    canvas.width = W * DPR;
    canvas.height = H * DPR;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

addEventListener("resize", resize);
resize();

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const TILE = 32;

const WORLD_WIDTH = 500;
const WORLD_HEIGHT = 180;

const GRAVITY = 0.55;
const SPEED = 4.2;
const JUMP = 10.8;

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

const BLOCK_INFO = {
    [GRASS]: {
        name: "Grama",
        icon: "🌱"
    },
    [DIRT]: {
        name: "Terra",
        icon: "🟫"
    },
    [STONE]: {
        name: "Pedra",
        icon: "🪨"
    },
    [WOOD]: {
        name: "Madeira",
        icon: "🪵"
    },
    [LEAVES]: {
        name: "Folhas",
        icon: "🍃"
    },
    [COAL]: {
        name: "Carvão",
        icon: "⚫"
    },
    [IRON]: {
        name: "Ferro",
        icon: "🔩"
    },
    [GOLD]: {
        name: "Ouro",
        icon: "🟡"
    },
    [DIAMOND]: {
        name: "Diamante",
        icon: "💎"
    },
    [SAND]: {
        name: "Areia",
        icon: "🟨"
    }
};

// ============================================================
// MUNDO
// ============================================================

const world = [];

for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y] = new Array(WORLD_WIDTH).fill(AIR);
}

const surface = new Array(WORLD_WIDTH);

function noise(x, scale) {

    const a = Math.floor(x / scale);
    const b = a + 1;

    const t = (x % scale) / scale;

    const smooth =
        t * t * (3 - 2 * t);

    const n1 =
        Math.sin(a * 12.9898) * 43758.5453;

    const n2 =
        Math.sin(b * 12.9898) * 43758.5453;

    const r1 = n1 - Math.floor(n1);
    const r2 = n2 - Math.floor(n2);

    return r1 * (1 - smooth) +
           r2 * smooth;
}

function terrainHeight(x) {

    return Math.floor(
        62 +
        noise(x, 45) * 18 +
        noise(x + 500, 20) * 9 +
        noise(x + 900, 8) * 3
    );
}

function generateWorld() {

    for (let x = 0; x < WORLD_WIDTH; x++) {

        const ground =
            terrainHeight(x);

        surface[x] = ground;

        for (let y = ground; y < WORLD_HEIGHT; y++) {

            if (y === ground) {
                world[y][x] = GRASS;
            }
            else if (y < ground + 5) {
                world[y][x] = DIRT;
            }
            else {
                world[y][x] = STONE;
            }
        }
    }

    // cavernas
    for (let x = 3; x < WORLD_WIDTH - 3; x++) {

        for (let y = 80; y < WORLD_HEIGHT - 5; y++) {

            const value =
                Math.sin(x * 0.15 + y * 0.08) +
                Math.sin(x * 0.06 - y * 0.17);

            if (value > 1.55) {
                world[y][x] = AIR;
            }
        }
    }

    // minérios
    for (let x = 2; x < WORLD_WIDTH - 2; x++) {

        for (let y = 80; y < WORLD_HEIGHT - 2; y++) {

            if (world[y][x] !== STONE) continue;

            const r = Math.random();

            if (r < 0.018)
                world[y][x] = DIAMOND;
            else if (r < 0.045)
                world[y][x] = GOLD;
            else if (r < 0.09)
                world[y][x] = IRON;
            else if (r < 0.17)
                world[y][x] = COAL;
        }
    }

    // árvores
    for (let x = 5; x < WORLD_WIDTH - 5; x++) {

        if (Math.random() > 0.93) {

            const ground = surface[x];

            const treeHeight =
                4 + Math.floor(Math.random() * 3);

            for (
                let i = 1;
                i <= treeHeight;
                i++
            ) {

                if (ground - i >= 0) {
                    world[ground - i][x] = WOOD;
                }
            }

            const top =
                ground - treeHeight;

            for (
                let yy = top - 2;
                yy <= top + 2;
                yy++
            ) {

                for (
                    let xx = x - 2;
                    xx <= x + 2;
                    xx++
                ) {

                    if (!inWorld(xx, yy))
                        continue;

                    const distance =
                        Math.abs(xx - x) +
                        Math.abs(yy - top);

                    if (
                        distance < 4 &&
                        world[yy][xx] === AIR
                    ) {
                        world[yy][xx] = LEAVES;
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
    y: 20 * TILE,

    width: 22,
    height: 42,

    vx: 0,
    vy: 0,

    grounded: false,

    direction: 1,

    health: 100,
    maxHealth: 100,

    walkTime: 0,

    hurtTimer: 0
};

function findSpawn() {

    const x = 20;

    player.x = x * TILE;

    player.y =
        (surface[x] - 4) * TILE;

    while (
        isSolidAt(
            player.x,
            player.y + player.height
        )
    ) {
        player.y -= TILE;
    }
}

findSpawn();

// ============================================================
// CONTROLES
// ============================================================

const keys = {};

addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

    if (
        [" ", "arrowup", "arrowdown",
         "arrowleft", "arrowright"]
        .includes(e.key.toLowerCase())
    ) {
        e.preventDefault();
    }

    // pulo
    if (
        (
            e.key.toLowerCase() === "w" ||
            e.key.toLowerCase() === "arrowup" ||
            e.key === " "
        ) &&
        player.grounded
    ) {

        player.vy = -JUMP;

        player.grounded = false;
    }

    // inventário
    if (e.key.toLowerCase() === "e") {
        toggleInventory();
    }

    // hotbar
    if (
        e.key >= "1" &&
        e.key <= "5"
    ) {

        selectedSlot =
            Number(e.key) - 1;

        updateHotbar();
    }
});

addEventListener("keyup", e => {

    keys[e.key.toLowerCase()] = false;
});

// ============================================================
// HOTBAR
// ============================================================

const hotbarItems = [
    WOOD,
    DIRT,
    STONE,
    SAND,
    DIAMOND
];

let selectedSlot = 0;

const slots =
    document.querySelectorAll(".slot");

function updateHotbar() {

    slots.forEach((slot, i) => {

        slot.classList.toggle(
            "selected",
            i === selectedSlot
        );
    });
}

slots.forEach((slot, i) => {

    slot.addEventListener("click", () => {

        selectedSlot = i;

        updateHotbar();
    });
});

// ============================================================
// INVENTÁRIO
// ============================================================

const inventory = {};

Object.keys(BLOCK_INFO).forEach(id => {

    inventory[id] = 0;
});

function addItem(block, amount = 1) {

    if (!BLOCK_INFO[block])
        return;

    inventory[block] += amount;

    updateInventoryUI();
}

function removeItem(block, amount = 1) {

    if (
        !inventory[block] ||
        inventory[block] < amount
    ) {
        return false;
    }

    inventory[block] -= amount;

    updateInventoryUI();

    return true;
}

function toggleInventory() {

    const inv =
        document.getElementById(
            "inventory"
        );

    if (!inv) return;

    inv.classList.toggle("open");

    updateInventoryUI();
}

function updateInventoryUI() {

    const inv =
        document.getElementById(
            "inventory"
        );

    if (!inv) return;

    inv.innerHTML = `
        <div class="inventory-title">
            INVENTÁRIO
            <span>ESC / E</span>
        </div>

        <div class="inventory-grid">
            ${Object.keys(inventory)
                .filter(id =>
                    inventory[id] > 0
                )
                .map(id => {

                    const info =
                        BLOCK_INFO[id];

                    return `
                        <div class="inventory-item">
                            <div class="inventory-icon">
                                ${info.icon}
                            </div>

                            <div>
                                ${info.name}
                            </div>

                            <strong>
                                ${inventory[id]}
                            </strong>
                        </div>
                    `;

                }).join("")}
        </div>
    `;
}

addEventListener("keydown", e => {

    if (e.key === "Escape") {

        const inv =
            document.getElementById(
                "inventory"
            );

        if (inv) {
            inv.classList.remove("open");
        }
    }
});

// ============================================================
// MOUSE
// ============================================================

let mouseX = 0;
let mouseY = 0;

canvas.addEventListener(
    "mousemove",
    e => {

        mouseX = e.clientX;
        mouseY = e.clientY;
    }
);

canvas.addEventListener(
    "contextmenu",
    e => e.preventDefault()
);

canvas.addEventListener(
    "mousedown",
    e => {

        const tx =
            Math.floor(
                (mouseX + camera.x) / TILE
            );

        const ty =
            Math.floor(
                (mouseY + camera.y) / TILE
            );

        if (!inWorld(tx, ty))
            return;

        if (!canReachBlock(tx, ty))
            return;

        if (e.button === 0) {

            breakBlock(tx, ty);

        } else if (e.button === 2) {

            placeBlock(tx, ty);
        }
    }
);

// ============================================================
// COLISÃO / MUNDO
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

    if (!inWorld(x, y))
        return STONE;

    return world[y][x];
}

function setBlock(x, y, block) {

    if (inWorld(x, y))
        world[y][x] = block;
}

function isSolid(block) {

    return (
        block !== AIR &&
        block !== WATER
    );
}

function isSolidAt(px, py) {

    const left =
        Math.floor(px / TILE);

    const right =
        Math.floor(
            (px + player.width - 1) /
            TILE
        );

    const top =
        Math.floor(py / TILE);

    const bottom =
        Math.floor(
            (py + player.height - 1) /
            TILE
        );

    for (
        let y = top;
        y <= bottom;
        y++
    ) {

        for (
            let x = left;
            x <= right;
            x++
        ) {

            if (
                isSolid(
                    getBlock(x, y)
                )
            ) {
                return true;
            }
        }
    }

    return false;
}

// ============================================================
// LINHA DE VISÃO
// ============================================================

function canReachBlock(tx, ty) {

    const startX =
        player.x +
        player.width / 2;

    const startY =
        player.y +
        player.height / 2;

    const endX =
        tx * TILE +
        TILE / 2;

    const endY =
        ty * TILE +
        TILE / 2;

    const dx =
        endX - startX;

    const dy =
        endY - startY;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (distance > REACH)
        return false;

    // verifica se existe outro bloco no caminho
    const steps =
        Math.ceil(
            distance / 8
        );

    for (let i = 1; i < steps; i++) {

        const t = i / steps;

        const x =
            Math.floor(
                (startX + dx * t) /
                TILE
            );

        const y =
            Math.floor(
                (startY + dy * t) /
                TILE
            );

        if (
            x === tx &&
            y === ty
        ) {
            break;
        }

        if (
            getBlock(x, y) !== AIR &&
            getBlock(x, y) !== WATER
        ) {
            return false;
        }
    }

    return true;
}

// ============================================================
// QUEBRAR / DROPAR
// ============================================================

const drops = [];
const particles = [];

function breakBlock(x, y) {

    const block =
        getBlock(x, y);

    if (
        block === AIR ||
        block === WATER
    ) {
        return;
    }

    if (!canReachBlock(x, y))
        return;

    // evita quebrar dentro do jogador
    const blockRect = {

        x: x * TILE,
        y: y * TILE,

        width: TILE,
        height: TILE
    };

    if (
        rectsOverlap(
            blockRect,
            player
        )
    ) {
        return;
    }

    setBlock(
        x,
        y,
        AIR
    );

    // drop
    drops.push({

        x:
            x * TILE +
            TILE / 2,

        y:
            y * TILE +
            TILE / 2,

        vx:
            (Math.random() - 0.5) * 3,

        vy:
            -3 -

            Math.random() * 2,

        block,

        life: 10000,

        rotation:
            Math.random() * Math.PI * 2
    });

    createParticles(
        x * TILE + TILE / 2,
        y * TILE + TILE / 2,
        block
    );

    // folhas têm chance de não dropar nada
    if (block === LEAVES) {

        if (Math.random() < 0.12) {
            addItem(LEAVES);
        }
    }
}

// ============================================================
// COLOCAR
// ============================================================

function placeBlock(x, y) {

    if (
        getBlock(x, y) !== AIR
    ) {
        return;
    }

    if (!canReachBlock(x, y))
        return;

    const block =
        hotbarItems[selectedSlot];

    if (
        !inventory[block] ||
        inventory[block] <= 0
    ) {
        return;
    }

    const rect = {

        x: x * TILE,
        y: y * TILE,

        width: TILE,
        height: TILE
    };

    if (
        rectsOverlap(
            rect,
            player
        )
    ) {
        return;
    }

    if (
        rectsOverlapAnyMob(
            rect
        )
    ) {
        return;
    }

    setBlock(
        x,
        y,
        block
    );

    removeItem(
        block
    );
}

// ============================================================
// DROPS
// ============================================================

function updateDrops() {

    for (
        let i = drops.length - 1;
        i >= 0;
        i--
    ) {

        const d = drops[i];

        d.vy += 0.18;

        d.x += d.vx;
        d.y += d.vy;

        d.vx *= 0.97;

        // chão
        if (
            isSolidAtPoint(
                d.x,
                d.y + 8
            )
        ) {

            d.y =
                Math.floor(
                    d.y / TILE
                ) * TILE +
                TILE - 8;

            d.vy *= -0.25;
            d.vx *= 0.85;
        }

        // coleta
        const dx =
            d.x -
            (
                player.x +
                player.width / 2
            );

        const dy =
            d.y -
            (
                player.y +
                player.height / 2
            );

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance < 40) {

            addItem(
                d.block
            );

            drops.splice(i, 1);

            continue;
        }

        d.life -= 16.67;

        if (d.life <= 0) {

            drops.splice(i, 1);
        }
    }
}

function isSolidAtPoint(x, y) {

    const tx =
        Math.floor(
            x / TILE
        );

    const ty =
        Math.floor(
            y / TILE
        );

    return isSolid(
        getBlock(tx, ty)
    );
}

function drawDrops() {

    drops.forEach(d => {

        const info =
            BLOCK_INFO[d.block];

        const x =
            d.x - camera.x;

        const y =
            d.y - camera.y;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        d.rotation += 0.03;

        ctx.rotate(
            Math.sin(d.rotation) * 0.15
        );

        ctx.fillStyle =
            "rgba(0,0,0,0.25)";

        ctx.fillRect(
            -8,
            7,
            16,
            4
        );

        ctx.font =
            "22px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            info.icon,
            0,
            0
        );

        ctx.restore();
    });
}

// ============================================================
// FÍSICA
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

        const tileX =
            Math.floor(
                (player.x +
                    player.width) /
                TILE
            );

        const top =
            Math.floor(
                player.y /
                TILE
            );

        const bottom =
            Math.floor(
                (
                    player.y +
                    player.height -
                    1
                ) /
                TILE
            );

        for (
            let y = top;
            y <= bottom;
            y++
        ) {

            if (
                isSolid(
                    getBlock(
                        tileX,
                        y
                    )
                )
            ) {

                player.x =
                    tileX * TILE -
                    player.width -
                    0.01;

                player.vx = 0;

                break;
            }
        }

    } else if (player.vx < 0) {

        const tileX =
            Math.floor(
                player.x /
                TILE
            );

        const top =
            Math.floor(
                player.y /
                TILE
            );

        const bottom =
            Math.floor(
                (
                    player.y +
                    player.height -
                    1
                ) /
                TILE
            );

        for (
            let y = top;
            y <= bottom;
            y++
        ) {

            if (
                isSolid(
                    getBlock(
                        tileX,
                        y
                    )
                )
            ) {

                player.x =
                    (
                        tileX + 1
                    ) * TILE +
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

        const tileY =
            Math.floor(
                (
                    player.y +
                    player.height
                ) /
                TILE
            );

        const left =
            Math.floor(
                player.x /
                TILE
            );

        const right =
            Math.floor(
                (
                    player.x +
                    player.width -
                    1
                ) /
                TILE
            );

        for (
            let x = left;
            x <= right;
            x++
        ) {

            if (
                isSolid(
                    getBlock(
                        x,
                        tileY
                    )
                )
            ) {

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

        const tileY =
            Math.floor(
                player.y /
                TILE
            );

        const left =
            Math.floor(
                player.x /
                TILE
            );

        const right =
            Math.floor(
                (
                    player.x +
                    player.width -
                    1
                ) /
                TILE
            );

        for (
            let x = left;
            x <= right;
            x++
        ) {

            if (
                isSolid(
                    getBlock(
                        x,
                        tileY
                    )
                )
            ) {

                player.y =
                    (
                        tileY + 1
                    ) * TILE +
                    0.01;

                player.vy = 0;

                break;
            }
        }
    }
}

// ============================================================
// ANIMAIS E MONSTROS
// ============================================================

const mobs = [];

let mobSpawnTimer = 0;

function isNight() {

    const cycle =
        (worldTime % 12000) /
        12000;

    return (
        cycle > 0.52 &&
        cycle < 0.96
    );
}

function spawnMob() {

    const side =
        Math.random() < 0.5 ?
        -1 :
        1;

    const distance =
        450 +
        Math.random() * 700;

    let x =
        player.x +
        side * distance;

    x = Math.max(
        TILE * 3,
        Math.min(
            WORLD_WIDTH * TILE - TILE * 3,
            x
        )
    );

    const tileX =
        Math.floor(
            x / TILE
        );

    const ground =
        surface[
            Math.max(
                0,
                Math.min(
                    WORLD_WIDTH - 1,
                    tileX
                )
            )
        ];

    const type =
        isNight() ?
        "monster" :
        "animal";

    mobs.push({

        type,

        x,

        y:
            (ground - 2) * TILE,

        width:
            type === "monster" ?
            28 :
            32,

        height:
            type === "monster" ?
            38 :
            28,

        vx: 0,
        vy: 0,

        health:
            type === "monster" ?
            40 :
            25,

        direction:
            Math.random() < 0.5 ?
            -1 :
            1,

        wander:
            Math.random() * 100,

        attackCooldown: 0
    });
}

function updateMobs() {

    mobSpawnTimer--;

    if (
        mobSpawnTimer <= 0 &&
        mobs.length < 14
    ) {

        spawnMob();

        mobSpawnTimer =
            150 +
            Math.random() * 250;
    }

    for (
        let i = mobs.length - 1;
        i >= 0;
        i--
    ) {

        const mob = mobs[i];

        if (
            mob.type === "monster" &&
            isNight()
        ) {

            // perseguição
            const dx =
                player.x - mob.x;

            if (
                Math.abs(dx) < 500
            ) {

                mob.direction =
                    dx > 0 ?
                    1 :
                    -1;

                mob.vx =
                    mob.direction * 1.15;

            } else {

                mob.vx *= 0.9;
            }

        } else {

            // animal andando
            mob.wander--;

            if (mob.wander <= 0) {

                mob.direction =
                    Math.random() < 0.5 ?
                    -1 :
                    1;

                mob.wander =
                    80 +
                    Math.random() * 160;
            }

            mob.vx =
                mob.direction * 0.55;
        }

        mob.x += mob.vx;

        // gravidade
        mob.vy += GRAVITY;

        mob.y += mob.vy;

        const tx =
            Math.floor(
                mob.x / TILE
            );

        const ground =
            surface[
                Math.max(
                    0,
                    Math.min(
                        WORLD_WIDTH - 1,
                        tx
                    )
                )
            ];

        const groundY =
            ground * TILE;

        if (
            mob.y +
            mob.height >
            groundY
        ) {

            mob.y =
                groundY -
                mob.height;

            mob.vy = 0;
        }

        // ataque
        if (
            mob.type === "monster"
        ) {

            const dx =
                player.x -
                mob.x;

            const dy =
                player.y -
                mob.y;

            if (
                Math.abs(dx) < 38 &&
                Math.abs(dy) < 50 &&
                mob.attackCooldown <= 0
            ) {

                damagePlayer(8);

                mob.attackCooldown =
                    60;
            }
        }

        if (
            mob.attackCooldown > 0
        ) {
            mob.attackCooldown--;
        }

        // distância muito grande
        if (
            Math.abs(
                mob.x -
                player.x
            ) > 1800
        ) {

            mobs.splice(i, 1);
        }
    }
}

function rectsOverlapAnyMob(rect) {

    return mobs.some(mob => {

        return rectsOverlap(
            rect,
            {
                x: mob.x,
                y: mob.y,
                width: mob.width,
                height: mob.height
            }
        );
    });
}

function damagePlayer(amount) {

    if (
        player.hurtTimer > 0
    ) {
        return;
    }

    player.health -= amount;

    player.hurtTimer = 60;

    if (player.health <= 0) {

        player.health =
            player.maxHealth;

        findSpawn();
    }
}

function drawMobs() {

    mobs.forEach(mob => {

        const x =
            mob.x - camera.x;

        const y =
            mob.y - camera.y;

        if (
            mob.type === "animal"
        ) {

            // corpo
            ctx.fillStyle =
                "#a96f3d";

            ctx.fillRect(
                x,
                y + 7,
                30,
                17
            );

            // cabeça
            ctx.fillStyle =
                "#bd8048";

            ctx.fillRect(
                x + 22,
                y + 2,
                12,
                15
            );

            // pernas
            ctx.fillStyle =
                "#69452c";

            ctx.fillRect(
                x + 4,
                y + 22,
                6,
                8
            );

            ctx.fillRect(
                x + 20,
                y + 22,
                6,
                8
            );

            // olho
            ctx.fillStyle =
                "#111";

            ctx.fillRect(
                x + 29,
                y + 7,
                2,
                2
            );

        } else {

            // monstro
            ctx.fillStyle =
                "#4c235e";

            ctx.fillRect(
                x,
                y + 5,
                28,
                33
            );

            ctx.fillStyle =
                "#6f327f";

            ctx.fillRect(
                x + 3,
                y,
                22,
                18
            );

            // olhos
            ctx.fillStyle =
                "#ff334d";

            ctx.fillRect(
                x + 6,
                y + 6,
                5,
                5
            );

            ctx.fillRect(
                x + 17,
                y + 6,
                5,
                5
            );

            // braços
            ctx.fillStyle =
                "#391b46";

            ctx.fillRect(
                x - 5,
                y + 15,
                6,
                16
            );

            ctx.fillRect(
                x + 27,
                y + 15,
                6,
                16
            );
        }
    });
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
        (
            targetX -
            camera.x
        ) * 0.12;

    camera.y +=
        (
            targetY -
            camera.y
        ) * 0.12;

    camera.x =
        Math.max(
            0,
            Math.min(
                camera.x,
                WORLD_WIDTH * TILE - W
            )
        );

    camera.y =
        Math.max(
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

function createParticles(
    x,
    y,
    block
) {

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
                3 +
                Math.random() * 4,

            block
        });
    }
}

function updateParticles() {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += 0.18;

        p.life -= 0.025;

        if (
            p.life <= 0
        ) {
            particles.splice(
                i,
                1
            );
        }
    }
}

function drawParticles() {

    particles.forEach(p => {

        ctx.globalAlpha =
            p.life;

        ctx.fillStyle =
            particleColor(
                p.block
            );

        ctx.fillRect(
            p.x - camera.x,
            p.y - camera.y,
            p.size,
            p.size
        );
    });

    ctx.globalAlpha = 1;
}

function particleColor(block) {

    if (block === GRASS)
        return "#4caf50";

    if (block === DIRT)
        return "#8a5b32";

    if (block === STONE)
        return "#8c9298";

    if (block === WOOD)
        return "#a76b35";

    if (block === GOLD)
        return "#ffd72e";

    if (block === DIAMOND)
        return "#4de1e9";

    return "#aaa";
}

// ============================================================
// DIA / NOITE
// ============================================================

let worldTime = 0;

function dayProgress() {

    return (
        worldTime % 12000
    ) / 12000;
}

function sunAngle() {

    return (
        dayProgress() *
        Math.PI * 2 -
        Math.PI / 2
    );
}

function drawSunAndMoon() {

    const angle =
        sunAngle();

    const centerX =
        W / 2;

    const centerY =
        H * 0.65;

    const radiusX =
        W * 0.42;

    const radiusY =
        H * 0.45;

    const sunX =
        centerX +
        Math.cos(angle) *
        radiusX;

    const sunY =
        centerY +
        Math.sin(angle) *
        radiusY;

    const moonX =
        centerX +
        Math.cos(angle + Math.PI) *
        radiusX;

    const moonY =
        centerY +
        Math.sin(angle + Math.PI) *
        radiusY;

    // brilho do sol
    const glow =
        ctx.createRadialGradient(
            sunX,
            sunY,
            10,
            sunX,
            sunY,
            90
        );

    glow.addColorStop(
        0,
        "rgba(255,245,180,0.9)"
    );

    glow.addColorStop(
        1,
        "rgba(255,190,60,0)"
    );

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
        sunX,
        sunY,
        90,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // sol
    ctx.fillStyle =
        "#ffe27a";

    ctx.beginPath();

    ctx.arc(
        sunX,
        sunY,
        28,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // lua
    ctx.fillStyle =
        "#f4f1d1";

    ctx.beginPath();

    ctx.arc(
        moonX,
        moonY,
        22,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        "rgba(120,120,130,0.2)";

    ctx.beginPath();

    ctx.arc(
        moonX - 7,
        moonY - 4,
        5,
        0,
        Math.PI * 2
    );

    ctx.arc(
        moonX + 6,
        moonY + 6,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function nightAlpha() {

    const p =
        dayProgress();

    const sun =
        Math.sin(
            p * Math.PI * 2
        );

    if (sun > 0.05)
        return 0;

    return Math.min(
        0.72,
        (-sun + 0.05) *
        0.65
    );
}

// ============================================================
// CÉU
// ============================================================

function drawSky() {

    const p =
        dayProgress();

    const sun =
        Math.sin(
            p * Math.PI * 2
        );

    const night =
        nightAlpha();

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    if (
        sun > -0.1 &&
        sun < 0.3
    ) {

        // nascer / pôr do sol
        gradient.addColorStop(
            0,
            "#263f75"
        );

        gradient.addColorStop(
            0.45,
            "#f08a68"
        );

        gradient.addColorStop(
            0.72,
            "#ffc46c"
        );

        gradient.addColorStop(
            1,
            "#e9b47b"
        );

    } else if (night > 0) {

        gradient.addColorStop(
            0,
            "#080d24"
        );

        gradient.addColorStop(
            0.65,
            "#172653"
        );

        gradient.addColorStop(
            1,
            "#30446b"
        );

    } else {

        gradient.addColorStop(
            0,
            "#4aaeff"
        );

        gradient.addColorStop(
            0.55,
            "#9bdeff"
        );

        gradient.addColorStop(
            1,
            "#d8f3ff"
        );
    }

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    drawMountains(
        0.12,
        H * 0.58,
        "#769eb4"
    );

    drawMountains(
        0.22,
        H * 0.68,
        "#4f8199"
    );

    drawClouds();

    drawStars();

    drawSunAndMoon();
}

function drawMountains(
    parallax,
    base,
    color
) {

    ctx.fillStyle =
        color;

    ctx.beginPath();

    ctx.moveTo(
        0,
        H
    );

    for (
        let x = -100;
        x <= W + 100;
        x += 90
    ) {

        const worldX =
            x +
            camera.x *
            parallax;

        const height =
            100 +
            Math.sin(
                worldX * 0.008
            ) * 80 +
            Math.sin(
                worldX * 0.019
            ) * 40;

        ctx.lineTo(
            x,
            base - height
        );
    }

    ctx.lineTo(
        W,
        H
    );

    ctx.closePath();

    ctx.fill();
}

function drawClouds() {

    if (nightAlpha() > 0.5)
        return;

    ctx.globalAlpha = 0.65;

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const x =
            (
                i * 320 -
                camera.x * 0.15
            ) %
            (W + 500) -
            250;

        const y =
            60 +
            (i % 4) * 55;

        drawCloud(
            x,
            y
        );
    }

    ctx.globalAlpha = 1;
}

function drawCloud(x, y) {

    ctx.fillStyle =
        "rgba(255,255,255,0.8)";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        20,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 27,
        y - 10,
        27,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 57,
        y,
        21,
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

function drawStars() {

    if (
        nightAlpha() <
        0.25
    ) {
        return;
    }

    ctx.fillStyle =
        "rgba(255,255,255,0.8)";

    for (
        let i = 0;
        i < 100;
        i++
    ) {

        const x =
            (
                i * 137
            ) % W;

        const y =
            (
                i * 71
            ) % (
                H * 0.55
            );

        ctx.fillRect(
            x,
            y,
            2,
            2
        );
    }
}

// ============================================================
// ILUMINAÇÃO LOCAL
// ============================================================

function drawDarkness() {

    const alpha =
        nightAlpha();

    if (alpha <= 0)
        return;

    ctx.fillStyle =
        `rgba(5,8,25,${alpha})`;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    // luz ao redor do jogador
    const px =
        player.x -
        camera.x +
        player.width / 2;

    const py =
        player.y -
        camera.y +
        player.height / 2;

    const light =
        ctx.createRadialGradient(
            px,
            py,
            20,
            px,
            py,
            210
        );

    light.addColorStop(
        0,
        "rgba(255,220,130,0.25)"
    );

    light.addColorStop(
        0.5,
        "rgba(255,190,80,0.09)"
    );

    light.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
        light;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}

// ============================================================
// DESENHO DOS BLOCOS
// ============================================================

function drawBlock(
    block,
    x,
    y
) {

    const px =
        x * TILE -
        camera.x;

    const py =
        y * TILE -
        camera.y;

    if (block === GRASS) {

        ctx.fillStyle =
            "#76502f";

        ctx.fillRect(
            px,
            py,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#45a94b";

        ctx.fillRect(
            px,
            py,
            TILE,
            8
        );

        ctx.fillStyle =
            "#65c957";

        for (
            let i = 0;
            i < 4;
            i++
        ) {

            ctx.fillRect(
                px +
                i * 9 +
                2,
                py + 2,
                3,
                4
            );
        }

    } else if (block === DIRT) {

        ctx.fillStyle =
            "#80562f";

        ctx.fillRect(
            px,
            py,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#a06c3c";

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            ctx.fillRect(
                px +
                ((i * 13) % 27),
                py +
                ((i * 7) % 27),
                3,
                3
            );
        }

    } else if (block === STONE) {

        ctx.fillStyle =
            "#696d73";

        ctx.fillRect(
            px,
            py,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#858b91";

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            ctx.fillRect(
                px +
                ((i * 11) % 27),
                py +
                ((i * 17) % 27),
                3,
                3
            );
        }

    } else if (block === WOOD) {

        ctx.fillStyle =
            "#704522";

        ctx.fillRect(
            px,
            py,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#a06634";

        for (
            let i = 5;
            i < TILE;
            i += 9
        ) {

            ctx.fillRect(
                px + i,
                py,
                3,
                TILE
            );
        }

    } else if (block === LEAVES) {

        ctx.fillStyle =
            "#287a38";

        ctx.fillRect(
            px,
            py,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#48b657";

        ctx.fillRect(
            px + 4,
            py + 4,
            9,
            8
        );

        ctx.fillRect(
            px + 19,
            py + 16,
            8,
            7
        );

    } else if (
        block === COAL ||
        block === IRON ||
        block === GOLD ||
        block === DIAMOND
    ) {

        ctx.fillStyle =
            "#686c72";

        ctx.fillRect(
            px,
            py,
            TILE,
            TILE
        );

        let color =
            "#222";

        if (block === IRON)
            color = "#d1a17c";

        if (block === GOLD)
            color = "#ffd42c";

        if (block === DIAMOND)
            color = "#55e7ef";

        ctx.fillStyle =
            color;

        ctx.fillRect(
            px + 5,
            py + 6,
            6,
            6
        );

        ctx.fillRect(
            px + 19,
            py + 4,
            6,
            6
        );

        ctx.fillRect(
            px + 11,
            py + 20,
            7,
            7
        );

    } else if (block === SAND) {

        ctx.fillStyle =
            "#d9c477";

        ctx.fillRect(
            px,
            py,
            TILE,
            TILE
        );
    }

    ctx.strokeStyle =
        "rgba(0,0,0,0.15)";

    ctx.strokeRect(
        px + 0.5,
        py + 0.5,
        TILE - 1,
        TILE - 1
    );
}

// ============================================================
// PLAYER
// ============================================================

function drawPlayer() {

    const x =
        player.x -
        camera.x;

    const y =
        player.y -
        camera.y;

    const walk =
        player.grounded &&
        Math.abs(player.vx) > 0.2;

    const leg =
        walk ?
        Math.sin(
            player.walkTime
        ) * 4 :
        0;

    // sombra
    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        x + 11,
        y + 44,
        13,
        4,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // pernas
    ctx.fillStyle =
        "#293d76";

    ctx.fillRect(
        x + 3,
        y + 27,
        7,
        13 + leg
    );

    ctx.fillRect(
        x + 13,
        y + 27,
        7,
        13 - leg
    );

    // botas
    ctx.fillStyle =
        "#20242c";

    ctx.fillRect(
        x + 1,
        y + 38 + leg,
        10,
        5
    );

    ctx.fillRect(
        x + 12,
        y + 38 - leg,
        10,
        5
    );

    // corpo
    ctx.fillStyle =
        "#3979c9";

    ctx.fillRect(
        x + 2,
        y + 15,
        19,
        16
    );

    // braços
    ctx.fillStyle =
        "#e2aa79";

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
    ctx.fillRect(
        x + 3,
        y + 2,
        18,
        16
    );

    // cabelo
    ctx.fillStyle =
        "#392418";

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
    ctx.fillStyle =
        "#111";

    const eye =
        player.direction > 0 ?
        x + 16 :
        x + 6;

    ctx.fillRect(
        eye,
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
            Math.floor(
                camera.x / TILE
            ) - 1
        );

    const endX =
        Math.min(
            WORLD_WIDTH,
            Math.ceil(
                (
                    camera.x + W
                ) / TILE
            ) + 1
        );

    const startY =
        Math.max(
            0,
            Math.floor(
                camera.y / TILE
            ) - 1
        );

    const endY =
        Math.min(
            WORLD_HEIGHT,
            Math.ceil(
                (
                    camera.y + H
                ) / TILE
            ) + 1
        );

    for (
        let y = startY;
        y < endY;
        y++
    ) {

        for (
            let x = startX;
            x < endX;
            x++
        ) {

            const block =
                world[y][x];

            if (
                block !== AIR
            ) {

                drawBlock(
                    block,
                    x,
                    y
                );
            }
        }
    }
}

// ============================================================
// ALVO
// ============================================================

function drawTarget() {

    const tx =
        Math.floor(
            (
                mouseX +
                camera.x
            ) / TILE
        );

    const ty =
        Math.floor(
            (
                mouseY +
                camera.y
            ) / TILE
        );

    if (!inWorld(tx, ty))
        return;

    const reachable =
        canReachBlock(
            tx,
            ty
        );

    ctx.strokeStyle =
        reachable ?
        "rgba(255,255,255,0.9)" :
        "rgba(255,60,60,0.75)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        tx * TILE -
        camera.x +
        2,
        ty * TILE -
        camera.y +
        2,
        TILE - 4,
        TILE - 4
    );

    ctx.lineWidth = 1;
}

// ============================================================
// HUD
// ============================================================

function updateHUD() {

    const health =
        document.getElementById(
            "health"
        );

    const posX =
        document.getElementById(
            "posX"
        );

    const posY =
        document.getElementById(
            "posY"
        );

    if (health) {

        health.textContent =
            Math.max(
                0,
                Math.floor(
                    player.health
                )
            );
    }

    if (posX) {

        posX.textContent =
            Math.floor(
                player.x /
                TILE
            );
    }

    if (posY) {

        posY.textContent =
            Math.floor(
                player.y /
                TILE
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

        player.vx =
            -SPEED;

        player.direction =
            -1;

        moving = true;

    } else if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.vx =
            SPEED;

        player.direction =
            1;

        moving = true;

    } else {

        player.vx *= 0.78;

        if (
            Math.abs(
                player.vx
            ) < 0.05
        ) {

            player.vx = 0;
        }
    }

    if (moving) {

        player.walkTime += 0.25;
    }

    // gravidade
    player.vy += GRAVITY;

    if (
        player.vy > 14
    ) {
        player.vy = 14;
    }

    moveHorizontal();
    moveVertical();

    updateDrops();

    updateMobs();

    updateParticles();

    updateCamera();

    if (
        player.hurtTimer > 0
    ) {

        player.hurtTimer--;
    }

    worldTime++;

    updateHUD();
}

// ============================================================
// RENDER
// ============================================================

function render() {

    drawSky();

    drawWorld();

    drawDrops();

    drawMobs();

    drawParticles();

    drawTarget();

    drawPlayer();

    drawDarkness();
}

// ============================================================
// LOOP
// ============================================================

function loop() {

    update();

    render();

    requestAnimationFrame(
        loop
    );
}

updateHotbar();

updateInventoryUI();

loop();
