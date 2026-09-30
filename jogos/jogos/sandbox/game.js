"use strict";

/* =========================================================
   CANVAS
========================================================= */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();


/* =========================================================
   CONFIGURAÇÃO DO MUNDO
========================================================= */

const TILE = 32;

/*
    30.000 blocos para cada lado.

    O mundo vai de:

    -30000

       0

    +30000
*/

const WORLD_MIN_X = -30000;
const WORLD_MAX_X = 30000;

const WORLD_HEIGHT = 220;

const SEA_LEVEL = 82;

const DAY_LENGTH = 15 * 60 * 1000;
const NIGHT_LENGTH = 15 * 60 * 1000;

const FULL_DAY = DAY_LENGTH + NIGHT_LENGTH;

let worldTime = 0;


/* =========================================================
   BLOCOS
========================================================= */

const BLOCK = {

    AIR: 0,
    GRASS: 1,
    DIRT: 2,
    STONE: 3,
    WOOD: 4,
    LEAVES: 5,
    SAND: 6,
    WATER: 7,

    COAL: 8,
    IRON: 9,
    GOLD: 10,
    DIAMOND: 11,

    GRAVEL: 12,

    CAVE_STONE: 13

};


/* =========================================================
   ITENS
========================================================= */

const ITEMS = {

    dirt: {
        name: "Terra",
        icon: "🟫",
        block: BLOCK.DIRT
    },

    grass: {
        name: "Grama",
        icon: "🌱",
        block: BLOCK.GRASS
    },

    stone: {
        name: "Pedra",
        icon: "🪨",
        block: BLOCK.STONE
    },

    wood: {
        name: "Madeira",
        icon: "🪵",
        block: BLOCK.WOOD
    },

    leaves: {
        name: "Folhas",
        icon: "🍃",
        block: BLOCK.LEAVES
    },

    sand: {
        name: "Areia",
        icon: "🟨",
        block: BLOCK.SAND
    },

    gravel: {
        name: "Cascalho",
        icon: "▫️",
        block: BLOCK.GRAVEL
    },

    coal: {
        name: "Carvão",
        icon: "⚫",
        block: BLOCK.COAL
    },

    iron: {
        name: "Ferro",
        icon: "🔩",
        block: BLOCK.IRON
    },

    gold: {
        name: "Ouro",
        icon: "🟡",
        block: BLOCK.GOLD
    },

    diamond: {
        name: "Diamante",
        icon: "💎",
        block: BLOCK.DIAMOND
    },

    raw_beef: {
        name: "Carne bovina",
        icon: "🥩",
        food: 5
    },

    raw_pork: {
        name: "Carne suína",
        icon: "🥓",
        food: 5
    },

    raw_chicken: {
        name: "Frango",
        icon: "🍗",
        food: 4
    },

    raw_mutton: {
        name: "Carne de carneiro",
        icon: "🍖",
        food: 4
    },

    raw_venison: {
        name: "Carne de cervo",
        icon: "🥩",
        food: 6
    },

    raw_rabbit: {
        name: "Carne de coelho",
        icon: "🍖",
        food: 3
    },

    raw_goat: {
        name: "Carne de cabra",
        icon: "🥩",
        food: 5
    },

    raw_boar: {
        name: "Carne de javali",
        icon: "🥓",
        food: 6
    },

    feather: {
        name: "Pena",
        icon: "🪶"
    },

    leather: {
        name: "Couro",
        icon: "🟫"
    },

    wool: {
        name: "Lã",
        icon: "⬜"
    }
};


/* =========================================================
   MAPA MODIFICADO
========================================================= */

const modifiedBlocks = new Map();

function blockKey(x, y) {
    return `${x},${y}`;
}


/* =========================================================
   HASH / NOISE
========================================================= */

function hash(x, seed = 0) {

    let n = Math.sin(
        x * 127.1 +
        seed * 311.7
    ) * 43758.5453123;

    return n - Math.floor(n);
}

function noise1(x, scale, seed) {

    const p = x / scale;

    const a = Math.floor(p);
    const b = a + 1;

    const t = p - a;

    const smooth = t * t * (3 - 2 * t);

    return hash(a, seed) * (1 - smooth)
         + hash(b, seed) * smooth;
}

function noise2(x, y, scale, seed) {

    const xx = Math.floor(x / scale);
    const yy = Math.floor(y / scale);

    return hash(
        xx * 374761 +
        yy * 668265 +
        seed
    );
}


/* =========================================================
   TERRENO
========================================================= */

function getBiome(x) {

    const climate = noise1(x, 700, 21);

    if (climate < .18) return "desert";
    if (climate > .83) return "forest";

    return "plains";
}


function getRiverValue(x) {

    /*
       Vários rios atravessando o mapa.
    */

    const large = Math.abs(
        Math.sin(x / 1700)
    );

    const noise = noise1(x, 420, 88);

    return large * .7 + noise * .3;
}


function isRiver(x) {

    const value = getRiverValue(x);

    return value < .065;
}


function isSea(x) {

    const value =
        Math.abs(Math.sin(x / 4300)) *
        .75 +
        noise1(x, 1100, 91) * .25;

    return value < .075;
}


function getTerrainHeight(x) {

    let height =
        72 +

        noise1(x, 1500, 1) * 20 +

        noise1(x, 700, 2) * 10 +

        noise1(x, 230, 3) * 7;

    /*
       Montanhas
    */

    const mountain =
        noise1(x, 3200, 15);

    if (mountain > .70) {

        height -=
            (mountain - .70) * 75;
    }

    /*
       Rios
    */

    if (isRiver(x)) {
        height = SEA_LEVEL - 5;
    }

    /*
       Mares
    */

    if (isSea(x)) {
        height = SEA_LEVEL - 8;
    }

    return Math.max(
        30,
        Math.min(
            WORLD_HEIGHT - 20,
            Math.floor(height)
        )
    );
}


/* =========================================================
   CAVERNAS
========================================================= */

function caveNoise(x, y) {

    const n1 = noise2(x, y, 16, 300);
    const n2 = noise2(x + 1000, y - 300, 31, 700);

    return n1 * .65 + n2 * .35;
}


function isCave(x, y) {

    const surface = getTerrainHeight(x);

    /*
       Não existem cavernas no céu.
    */

    if (y < surface + 7) {
        return false;
    }

    /*
       Não cavar o fundo inteiro.
    */

    if (y > WORLD_HEIGHT - 8) {
        return false;
    }

    const depth = y - surface;

    let threshold = .76;

    /*
       Cavernas ficam maiores mais abaixo.
    */

    if (depth > 25) {
        threshold = .70;
    }

    if (depth > 55) {
        threshold = .66;
    }

    return caveNoise(x, y) > threshold;
}


/* =========================================================
   ENTRADAS DE CAVERNAS
========================================================= */

function caveEntrance(x, y) {

    const surface = getTerrainHeight(x);

    if (Math.abs(x % 97) > 2) {
        return false;
    }

    if (
        y >= surface &&
        y <= surface + 8
    ) {
        return true;
    }

    return false;
}


/* =========================================================
   MINÉRIOS
========================================================= */

function getOre(x, y) {

    const surface = getTerrainHeight(x);

    const depth = y - surface;

    if (depth < 6) {
        return BLOCK.STONE;
    }

    /*
       Quanto mais fundo,
       mais raros os minérios.

       Os números foram escolhidos
       para deixar os minérios bem menos
       frequentes que pedra/terra.
    */

    const n = noise2(
        x * 3,
        y * 5,
        5,
        777
    );

    /*
       Diamante
       muito raro e profundo
    */

    if (
        depth > 80 &&
        n > .995
    ) {
        return BLOCK.DIAMOND;
    }

    /*
       Ouro
    */

    if (
        depth > 55 &&
        n > .985
    ) {
        return BLOCK.GOLD;
    }

    /*
       Ferro
    */

    if (
        depth > 28 &&
        n > .955
    ) {
        return BLOCK.IRON;
    }

    /*
       Carvão
    */

    if (
        depth > 12 &&
        n > .91
    ) {
        return BLOCK.COAL;
    }

    return BLOCK.STONE;
}


/* =========================================================
   GERAÇÃO DE BLOCO
========================================================= */

function generateBlock(x, y) {

    if (
        x < WORLD_MIN_X ||
        x > WORLD_MAX_X ||
        y < 0 ||
        y >= WORLD_HEIGHT
    ) {
        return BLOCK.AIR;
    }

    const key = blockKey(x, y);

    if (modifiedBlocks.has(key)) {
        return modifiedBlocks.get(key);
    }

    const surface = getTerrainHeight(x);

    /*
       Céu
    */

    if (y < surface) {

        /*
           Água acima do terreno
        */

        if (
            y >= surface &&
            y < SEA_LEVEL &&
            (
                isRiver(x) ||
                isSea(x)
            )
        ) {
            return BLOCK.WATER;
        }

        return BLOCK.AIR;
    }

    /*
       Água
    */

    if (
        y >= surface &&
        y < SEA_LEVEL &&
        (
            isRiver(x) ||
            isSea(x)
        )
    ) {
        return BLOCK.WATER;
    }

    /*
       Fundo do mar
    */

    if (
        y === surface &&
        (
            isRiver(x) ||
            isSea(x)
        )
    ) {
        return BLOCK.SAND;
    }

    /*
       Entrada de caverna
    */

    if (caveEntrance(x, y)) {
        return BLOCK.AIR;
    }

    /*
       Cavernas
    */

    if (isCave(x, y)) {
        return BLOCK.AIR;
    }

    /*
       Superfície
    */

    if (y === surface) {

        if (
            isRiver(x) ||
            isSea(x) ||
            getBiome(x) === "desert"
        ) {
            return BLOCK.SAND;
        }

        return BLOCK.GRASS;
    }

    /*
       Terra
    */

    if (y < surface + 5) {
        return BLOCK.DIRT;
    }

    /*
       Pedra
    */

    return getOre(x, y);
}


/* =========================================================
   PROPRIEDADES DOS BLOCOS
========================================================= */

function isSolid(block) {

    if (block === BLOCK.AIR) return false;
    if (block === BLOCK.WATER) return false;

    /*
       Folhas são atravessáveis.
       Assim o jogador pode passar pela árvore.
    */

    if (block === BLOCK.LEAVES) {
        return false;
    }

    return true;
}


function blocksSight(block) {

    if (block === BLOCK.AIR) return false;
    if (block === BLOCK.WATER) return false;

    return true;
}


function blockName(block) {

    const names = {

        [BLOCK.GRASS]: "Grama",
        [BLOCK.DIRT]: "Terra",
        [BLOCK.STONE]: "Pedra",
        [BLOCK.WOOD]: "Madeira",
        [BLOCK.LEAVES]: "Folhas",
        [BLOCK.SAND]: "Areia",
        [BLOCK.WATER]: "Água",
        [BLOCK.COAL]: "Carvão",
        [BLOCK.IRON]: "Ferro",
        [BLOCK.GOLD]: "Ouro",
        [BLOCK.DIAMOND]: "Diamante",
        [BLOCK.GRAVEL]: "Cascalho"

    };

    return names[block] || "Bloco";
}


function blockToItem(block) {

    const map = {

        [BLOCK.GRASS]: "grass",
        [BLOCK.DIRT]: "dirt",
        [BLOCK.STONE]: "stone",
        [BLOCK.WOOD]: "wood",
        [BLOCK.LEAVES]: "leaves",
        [BLOCK.SAND]: "sand",
        [BLOCK.GRAVEL]: "gravel",

        [BLOCK.COAL]: "coal",
        [BLOCK.IRON]: "iron",
        [BLOCK.GOLD]: "gold",
        [BLOCK.DIAMOND]: "diamond"

    };

    return map[block] || null;
}


/* =========================================================
   JOGADOR
========================================================= */

const player = {

    x: 0,
    y: 50,

    width: .72,
    height: 1.8,

    vx: 0,
    vy: 0,

    speed: 6.2,
    jump: 11,

    onGround: false,

    health: 100,
    maxHealth: 100,

    hunger: 20,
    maxHunger: 20,

    attackCooldown: 0

};


/* =========================================================
   INVENTÁRIO
========================================================= */

const inventory = new Array(36).fill(null);

let selectedSlot = 0;

let carriedItem = null;


/*
   Itens iniciais
*/

inventory[27] = {
    id: "stone",
    count: 32
};

inventory[28] = {
    id: "wood",
    count: 16
};

inventory[29] = {
    id: "dirt",
    count: 32
};


/* =========================================================
   INVENTÁRIO
========================================================= */

function addItem(id, amount = 1) {

    if (!ITEMS[id]) return false;

    /*
       Primeiro tenta empilhar.
    */

    for (let i = 0; i < inventory.length; i++) {

        const item = inventory[i];

        if (
            item &&
            item.id === id &&
            item.count < 64
        ) {

            const free = 64 - item.count;
            const add = Math.min(
                free,
                amount
            );

            item.count += add;
            amount -= add;

            if (amount <= 0) {
                updateInventoryUI();
                return true;
            }
        }
    }

    /*
       Depois procura espaço vazio.
    */

    for (let i = 0; i < inventory.length; i++) {

        if (!inventory[i]) {

            const add = Math.min(
                64,
                amount
            );

            inventory[i] = {
                id,
                count: add
            };

            amount -= add;

            if (amount <= 0) {
                updateInventoryUI();
                return true;
            }
        }
    }

    updateInventoryUI();

    return false;
}


function removeItem(slot, amount = 1) {

    const item = inventory[slot];

    if (!item) return false;

    item.count -= amount;

    if (item.count <= 0) {
        inventory[slot] = null;
    }

    updateInventoryUI();

    return true;
}


/* =========================================================
   COMIDA
========================================================= */

function eatItem(slot) {

    const item = inventory[slot];

    if (!item) return;

    const data = ITEMS[item.id];

    if (!data || !data.food) {
        showMessage("Esse item não é comida.");
        return;
    }

    if (player.hunger >= player.maxHunger) {
        showMessage("Você não está com fome.");
        return;
    }

    player.hunger = Math.min(
        player.maxHunger,
        player.hunger + data.food
    );

    removeItem(slot, 1);

    showMessage(
        `Você comeu ${data.name}.`
    );

    updateHUD();
}


/* =========================================================
   UI DO INVENTÁRIO
========================================================= */

const inventoryOverlay =
    document.getElementById(
        "inventoryOverlay"
    );

const inventoryGrid =
    document.getElementById(
        "inventoryGrid"
    );

const inventoryHotbar =
    document.getElementById(
        "inventoryHotbar"
    );


function createInventorySlot(index) {

    const div =
        document.createElement("div");

    div.className =
        "inventory-slot";

    const item =
        inventory[index];

    if (item) {

        const data =
            ITEMS[item.id];

        div.innerHTML = `
            <span class="icon">
                ${data.icon}
            </span>
            <span class="count">
                ${item.count}
            </span>
        `;
    }

    div.addEventListener(
        "click",
        () => clickInventorySlot(index)
    );

    div.addEventListener(
        "dblclick",
        () => {

            const item =
                inventory[index];

            if (
                item &&
                ITEMS[item.id] &&
                ITEMS[item.id].food
            ) {
                eatItem(index);
            }
        }
    );

    return div;
}


function updateInventoryUI() {

    inventoryGrid.innerHTML = "";
    inventoryHotbar.innerHTML = "";

    /*
       27 slots principais
    */

    for (let i = 0; i < 27; i++) {

        inventoryGrid.appendChild(
            createInventorySlot(i)
        );
    }

    /*
       9 slots da hotbar
    */

    for (let i = 27; i < 36; i++) {

        inventoryHotbar.appendChild(
            createInventorySlot(i)
        );
    }

    updateHotbar();
}


function clickInventorySlot(index) {

    /*
       Primeiro clique pega o item.
    */

    if (!carriedItem) {

        if (!inventory[index]) return;

        carriedItem = inventory[index];
        inventory[index] = null;

    } else {

        /*
           Segundo clique.
           Se o item for igual,
           tenta juntar.
        */

        if (
            inventory[index] &&
            inventory[index].id === carriedItem.id
        ) {

            const free =
                64 -
                inventory[index].count;

            const moved =
                Math.min(
                    free,
                    carriedItem.count
                );

            inventory[index].count += moved;

            carriedItem.count -= moved;

            if (carriedItem.count <= 0) {
                carriedItem = null;
            }

        } else {

            const temp =
                inventory[index];

            inventory[index] =
                carriedItem;

            carriedItem =
                temp;
        }
    }

    updateInventoryUI();
}


/* =========================================================
   HOTBAR
========================================================= */

const hotbarSlots =
    document.querySelectorAll(
        "#hotbar .slot"
    );


function updateHotbar() {

    hotbarSlots.forEach(
        (slot, i) => {

            const item =
                inventory[27 + i];

            const icon =
                slot.querySelector(
                    ".slot-icon"
                );

            const count =
                slot.querySelector(
                    ".item-count"
                );

            icon.textContent =
                item ?
                ITEMS[item.id].icon :
                "";

            count.textContent =
                item &&
                item.count > 1 ?
                item.count :
                "";

            slot.classList.toggle(
                "selected",
                i === selectedSlot
            );
        }
    );
}


hotbarSlots.forEach(
    slot => {

        slot.addEventListener(
            "click",
            () => {

                selectedSlot =
                    Number(
                        slot.dataset.slot
                    );

                updateHotbar();
            }
        );
    }
);


/* =========================================================
   INVENTÁRIO ABRIR / FECHAR
========================================================= */

let inventoryOpen = false;


function openInventory() {

    if (paused) return;

    inventoryOpen = true;

    inventoryOverlay.classList.add(
        "open"
    );

    updateInventoryUI();
}


function closeInventory() {

    inventoryOpen = false;

    inventoryOverlay.classList.remove(
        "open"
    );

    /*
       Se o jogador carregava um item,
       devolve para o inventário.
    */

    if (carriedItem) {

        addItem(
            carriedItem.id,
            carriedItem.count
        );

        carriedItem = null;
    }
}


document
    .getElementById("closeInventory")
    .addEventListener(
        "click",
        closeInventory
    );


/* =========================================================
   PAUSA
========================================================= */

let paused = false;


const pauseMenu =
    document.getElementById(
        "pauseMenu"
    );


function pauseGame() {

    if (inventoryOpen) {
        closeInventory();
    }

    paused = true;

    pauseMenu.classList.add(
        "open"
    );
}


function resumeGame() {

    paused = false;

    pauseMenu.classList.remove(
        "open"
    );
}


document
    .getElementById("resumeButton")
    .addEventListener(
        "click",
        resumeGame
    );


document
    .getElementById(
        "pauseInventoryButton"
    )
    .addEventListener(
        "click",
        () => {

            resumeGame();
            openInventory();

        }
    );


document
    .getElementById("reloadButton")
    .addEventListener(
        "click",
        () => {

            location.reload();

        }
    );


/* =========================================================
   TECLADO
========================================================= */

const keys = {};

window.addEventListener(
    "keydown",
    e => {

        keys[e.code] = true;

        /*
           Não deixa a tecla repetir
           causando vários pulos.
        */

        if (
            e.code === "Space" &&
            !e.repeat &&
            player.onGround &&
            !paused &&
            !inventoryOpen
        ) {

            player.vy =
                -player.jump;
        }

        if (
            e.code === "KeyE" &&
            !e.repeat
        ) {

            if (inventoryOpen) {
                closeInventory();
            } else {
                openInventory();
            }
        }

        if (
            (
                e.code === "Escape" ||
                e.code === "KeyP"
            ) &&
            !e.repeat
        ) {

            if (inventoryOpen) {

                closeInventory();

            } else if (paused) {

                resumeGame();

            } else {

                pauseGame();

            }
        }

        /*
           Teclas 1-9
        */

        if (
            e.code.startsWith("Digit")
        ) {

            const n =
                Number(
                    e.code.replace(
                        "Digit",
                        ""
                    )
                );

            if (
                n >= 1 &&
                n <= 9
            ) {

                selectedSlot =
                    n - 1;

                updateHotbar();
            }
        }

        /*
           Comer
        */

        if (
            e.code === "KeyR" &&
            !e.repeat &&
            !paused &&
            !inventoryOpen
        ) {

            eatItem(
                27 + selectedSlot
            );
        }
    }
);


window.addEventListener(
    "keyup",
    e => {
        keys[e.code] = false;
    }
);


/* =========================================================
   COLISÃO
========================================================= */

function rectCollides(
    x,
    y,
    w,
    h
) {

    const left =
        Math.floor(x);

    const right =
        Math.floor(x + w);

    const top =
        Math.floor(y);

    const bottom =
        Math.floor(y + h);

    for (
        let ty = top;
        ty <= bottom;
        ty++
    ) {

        for (
            let tx = left;
            tx <= right;
            tx++
        ) {

            if (
                isSolid(
                    generateBlock(
                        tx,
                        ty
                    )
                )
            ) {
                return true;
            }
        }
    }

    return false;
}


/* =========================================================
   FÍSICA DO JOGADOR
========================================================= */

function updatePlayer(dt) {

    const left =
        keys["KeyA"] ||
        keys["ArrowLeft"];

    const right =
        keys["KeyD"] ||
        keys["ArrowRight"];

    let direction = 0;

    if (left) direction -= 1;
    if (right) direction += 1;

    player.vx =
        direction *
        player.speed;

    /*
       Gravidade
    */

    player.vy +=
        25 * dt;

    /*
       Movimento horizontal
    */

    const nx =
        player.x +
        player.vx * dt;

    if (
        !rectCollides(
            nx,
            player.y,
            player.width,
            player.height
        )
    ) {

        player.x = nx;

    } else {

        player.vx = 0;
    }

    /*
       Movimento vertical
    */

    const ny =
        player.y +
        player.vy * dt;

    if (
        !rectCollides(
            player.x,
            ny,
            player.width,
            player.height
        )
    ) {

        player.y = ny;
        player.onGround = false;

    } else {

        if (player.vy > 0) {

            player.onGround = true;

            player.y =
                Math.floor(
                    player.y +
                    player.height
                ) -
                player.height;

        }

        player.vy = 0;
    }

    /*
       Cair fora do mapa
    */

    if (
        player.y >
        WORLD_HEIGHT + 10
    ) {

        respawnPlayer();
    }

    player.attackCooldown =
        Math.max(
            0,
            player.attackCooldown - dt
        );
}


/* =========================================================
   RESPAWN
========================================================= */

function respawnPlayer() {

    player.x = 0;

    player.y =
        getTerrainHeight(0) - 3;

    player.vx = 0;
    player.vy = 0;

    player.health =
        player.maxHealth;

    player.hunger =
        Math.max(
            8,
            player.hunger
        );
}


/* =========================================================
   ANIMAIS
========================================================= */

const animalTypes = {

    cow: {
        name: "Vaca",
        icon: "🐄",
        width: 1.3,
        height: 1.25,
        speed: 1.2,
        health: 12,
        meat: "raw_beef",
        meatAmount: 2,
        extra: "leather"
    },

    pig: {
        name: "Porco",
        icon: "🐖",
        width: 1.15,
        height: 1.0,
        speed: 1.4,
        health: 10,
        meat: "raw_pork",
        meatAmount: 2,
        extra: null
    },

    chicken: {
        name: "Galinha",
        icon: "🐔",
        width: .7,
        height: .8,
        speed: 1.8,
        health: 5,
        meat: "raw_chicken",
        meatAmount: 1,
        extra: "feather"
    },

    sheep: {
        name: "Ovelha",
        icon: "🐑",
        width: 1.2,
        height: 1.15,
        speed: 1.1,
        health: 10,
        meat: "raw_mutton",
        meatAmount: 2,
        extra: "wool"
    },

    deer: {
        name: "Cervo",
        icon: "🦌",
        width: 1.25,
        height: 1.5,
        speed: 2.3,
        health: 9,
        meat: "raw_venison",
        meatAmount: 2,
        extra: "leather"
    },

    rabbit: {
        name: "Coelho",
        icon: "🐇",
        width: .55,
        height: .6,
        speed: 2.6,
        health: 4,
        meat: "raw_rabbit",
        meatAmount: 1,
        extra: null
    },

    goat: {
        name: "Cabra",
        icon: "🐐",
        width: 1.1,
        height: 1.3,
        speed: 1.5,
        health: 12,
        meat: "raw_goat",
        meatAmount: 2,
        extra: "wool"
    },

    boar: {
        name: "Javali",
        icon: "🐗",
        width: 1.3,
        height: 1.1,
        speed: 1.7,
        health: 14,
        meat: "raw_boar",
        meatAmount: 2,
        extra: null
    }

};


const animals = [];


/* =========================================================
   SPAWN ANIMAL
========================================================= */

function spawnAnimal() {

    if (animals.length >= 20) {
        return;
    }

    const distance =
        18 +
        Math.random() * 45;

    const side =
        Math.random() < .5 ?
        -1 :
        1;

    const x =
        Math.floor(
            player.x +
            distance * side
        );

    if (
        x < WORLD_MIN_X ||
        x > WORLD_MAX_X
    ) {
        return;
    }

    const surface =
        getTerrainHeight(x);

    /*
       Não nasce dentro de água.
    */

    if (
        isRiver(x) ||
        isSea(x)
    ) {
        return;
    }

    const names =
        Object.keys(
            animalTypes
        );

    const type =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];

    const data =
        animalTypes[type];

    animals.push({

        type,

        x,

        y:
            surface - data.height,

        vx: 0,

        vy: 0,

        health:
            data.health,

        maxHealth:
            data.health,

        flee: 0,

        wander:
            Math.random() * 4

    });
}


/* =========================================================
   ATUALIZAR ANIMAIS
========================================================= */

function updateAnimals(dt) {

    if (!isDay()) {
        return;
    }

    /*
       Spawn gradual
    */

    if (
        animals.length < 20 &&
        Math.random() < dt * .8
    ) {
        spawnAnimal();
    }

    for (
        let i = animals.length - 1;
        i >= 0;
        i--
    ) {

        const animal =
            animals[i];

        const data =
            animalTypes[
                animal.type
            ];

        animal.wander -= dt;
        animal.flee -= dt;

        /*
           Animal ferido foge
        */

        if (animal.flee > 0) {

            animal.vx =
                animal.vx * .9;

        } else if (
            animal.wander <= 0
        ) {

            animal.vx =
                (
                    Math.random() * 2 -
                    1
                ) *
                data.speed;

            animal.wander =
                2 +
                Math.random() * 5;
        }

        /*
           Gravidade
        */

        animal.vy +=
            25 * dt;

        const nx =
            animal.x +
            animal.vx * dt;

        if (
            !rectCollides(
                nx,
                animal.y,
                data.width,
                data.height
            )
        ) {

            animal.x = nx;

        } else {

            animal.vx *= -1;
        }

        const ny =
            animal.y +
            animal.vy * dt;

        if (
            !rectCollides(
                animal.x,
                ny,
                data.width,
                data.height
            )
        ) {

            animal.y = ny;

        } else {

            if (animal.vy > 0) {

                animal.y =
                    Math.floor(
                        animal.y +
                        data.height
                    ) -
                    data.height;
            }

            animal.vy = 0;
        }

        /*
           Distância
        */

        if (
            Math.abs(
                animal.x -
                player.x
            ) > 120
        ) {

            animals.splice(i, 1);
        }
    }
}


/* =========================================================
   ATAQUE
========================================================= */

function distanceToPlayer(x, y) {

    return Math.hypot(
        x - player.x,
        y - player.y
    );
}


function attackAnimal(animal) {

    if (
        player.attackCooldown > 0
    ) {
        return false;
    }

    const d =
        distanceToPlayer(
            animal.x,
            animal.y
        );

    if (d > 4) {
        return false;
    }

    animal.health -= 4;

    animal.flee = 3;

    const direction =
        animal.x >
        player.x ?
        1 :
        -1;

    animal.vx =
        direction * 6;

    player.attackCooldown =
        .35;

    createParticles(
        animal.x,
        animal.y,
        "red"
    );

    if (animal.health <= 0) {

        const data =
            animalTypes[
                animal.type
            ];

        addItem(
            data.meat,
            data.meatAmount
        );

        if (data.extra) {

            addItem(
                data.extra,
                1 +
                Math.floor(
                    Math.random() * 2
                )
            );
        }

        showMessage(
            `${data.name} derrotado! +${data.meatAmount} ${ITEMS[data.meat].name}`
        );

        const index =
            animals.indexOf(
                animal
            );

        if (index !== -1) {
            animals.splice(
                index,
                1
            );
        }
    }

    return true;
}


/* =========================================================
   MOUSE
========================================================= */

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
    e => {
        e.preventDefault();
    }
);


canvas.addEventListener(
    "mousedown",
    e => {

        if (
            paused ||
            inventoryOpen
        ) {
            return;
        }

        if (e.button === 0) {

            /*
               Primeiro tenta atacar animal.
            */

            for (
                let i = animals.length - 1;
                i >= 0;
                i--
            ) {

                const animal =
                    animals[i];

                if (
                    Math.abs(
                        animal.x -
                        player.x
                    ) > 5
                ) {
                    continue;
                }

                const screen =
                    worldToScreen(
                        animal.x,
                        animal.y
                    );

                if (
                    Math.hypot(
                        mouseX - screen.x,
                        mouseY - screen.y
                    ) < 45
                ) {

                    if (
                        attackAnimal(
                            animal
                        )
                    ) {
                        return;
                    }
                }
            }

            breakBlockAtMouse();

        } else if (e.button === 2) {

            useSelectedItem();
        }

    }
);


/* =========================================================
   CÂMERA
========================================================= */

let cameraX = 0;
let cameraY = 0;


function updateCamera() {

    cameraX =
        player.x * TILE -
        W / 2;

    cameraY =
        player.y * TILE -
        H / 2;

    /*
       Nunca mostra além dos limites.
    */

    const minCamera =
        WORLD_MIN_X * TILE;

    const maxCamera =
        WORLD_MAX_X * TILE -
        W;

    cameraX =
        Math.max(
            minCamera,
            Math.min(
                maxCamera,
                cameraX
            )
        );

    cameraY =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT * TILE - H,
                cameraY
            )
        );
}


function worldToScreen(x, y) {

    return {

        x:
            x * TILE -
            cameraX,

        y:
            y * TILE -
            cameraY

    };
}


/* =========================================================
   ALCANCE / VISÃO
========================================================= */

function canReachBlock(tx, ty) {

    const dx =
        tx + .5 -
        (player.x + player.width / 2);

    const dy =
        ty + .5 -
        (player.y + player.height / 2);

    const distance =
        Math.hypot(
            dx,
            dy
        );

    /*
       Distância de mineração.
    */

    if (distance > 6) {
        return false;
    }

    /*
       Linha de visão.

       Impede enxergar/minerar
       através de blocos.
    */

    const steps =
        Math.ceil(
            distance * 5
        );

    for (
        let i = 1;
        i < steps;
        i++
    ) {

        const t =
            i / steps;

        const x =
            Math.floor(
                player.x +
                player.width / 2 +
                dx * t
            );

        const y =
            Math.floor(
                player.y +
                player.height / 2 +
                dy * t
            );

        if (
            blocksSight(
                generateBlock(
                    x,
                    y
                )
            )
        ) {

            if (
                x !== tx ||
                y !== ty
            ) {
                return false;
            }
        }
    }

    return true;
}


/* =========================================================
   QUEBRAR BLOCO
========================================================= */

function breakBlockAtMouse() {

    const wx =
        Math.floor(
            (
                mouseX +
                cameraX
            ) / TILE
        );

    const wy =
        Math.floor(
            (
                mouseY +
                cameraY
            ) / TILE
        );

    if (
        !canReachBlock(
            wx,
            wy
        )
    ) {
        return;
    }

    const block =
        generateBlock(
            wx,
            wy
        );

    if (
        block === BLOCK.AIR ||
        block === BLOCK.WATER
    ) {
        return;
    }

    /*
       Não permite quebrar
       fora do mundo.
    */

    if (
        wx < WORLD_MIN_X ||
        wx > WORLD_MAX_X
    ) {
        return;
    }

    modifiedBlocks.set(
        blockKey(
            wx,
            wy
        ),
        BLOCK.AIR
    );

    const item =
        blockToItem(block);

    if (item) {

        addItem(
            item,
            1
        );

        showMessage(
            `+1 ${ITEMS[item].name}`
        );
    }

    createParticles(
        wx + .5,
        wy + .5,
        "block"
    );
}


/* =========================================================
   COLOCAR BLOCO / COMER
========================================================= */

function useSelectedItem() {

    const index =
        27 + selectedSlot;

    const item =
        inventory[index];

    if (!item) return;

    const data =
        ITEMS[item.id];

    /*
       Se for comida,
       clique direito come.
    */

    if (data.food) {

        eatItem(index);
        return;
    }

    /*
       Se não for bloco,
       não coloca.
    */

    if (
        data.block === undefined
    ) {
        return;
    }

    const wx =
        Math.floor(
            (
                mouseX +
                cameraX
            ) / TILE
        );

    const wy =
        Math.floor(
            (
                mouseY +
                cameraY
            ) / TILE
        );

    if (
        !canReachBlock(
            wx,
            wy
        )
    ) {
        return;
    }

    const target =
        generateBlock(
            wx,
            wy
        );

    /*
       Só coloca em ar/água.
    */

    if (
        target !== BLOCK.AIR &&
        target !== BLOCK.WATER
    ) {
        return;
    }

    /*
       Evita colocar bloco
       dentro do jogador.
    */

    const px = player.x;
    const py = player.y;

    if (
        wx < px + player.width &&
        wx + 1 > px &&
        wy < py + player.height &&
        wy + 1 > py
    ) {
        return;
    }

    modifiedBlocks.set(
        blockKey(
            wx,
            wy
        ),
        data.block
    );

    removeItem(
        index,
        1
    );
}


/* =========================================================
   ILUMINAÇÃO
========================================================= */

function getDaylight() {

    const phase =
        worldTime %
        FULL_DAY;

    if (
        phase < DAY_LENGTH
    ) {

        /*
           Dia.
           Faz nascer e pôr do sol
           de maneira gradual.
        */

        const p =
            phase /
            DAY_LENGTH;

        return Math.sin(
            p * Math.PI
        );

    }

    return 0;
}


function isDay() {

    return (
        worldTime %
        FULL_DAY
    ) < DAY_LENGTH;
}


function getSkyBrightness() {

    const light =
        getDaylight();

    return .12 +
        light * .88;
}


function getTimeName() {

    const phase =
        worldTime %
        FULL_DAY;

    if (
        phase < 60 * 1000
    ) {
        return "🌅 Amanhecer";
    }

    if (
        phase < DAY_LENGTH - 60 * 1000
    ) {
        return "☀️ Dia";
    }

    if (
        phase < DAY_LENGTH
    ) {
        return "🌇 Pôr do sol";
    }

    if (
        phase < DAY_LENGTH + 60 * 1000
    ) {
        return "🌆 Anoitecer";
    }

    return "🌙 Noite";
}


/* =========================================================
   NUVENS
========================================================= */

let cloudOffset = 0;

const clouds = [];

for (
    let i = 0;
    i < 20;
    i++
) {

    clouds.push({

        x:
            Math.random() *
            2000,

        y:
            30 +
            Math.random() * 100,

        width:
            100 +
            Math.random() * 180,

        speed:
            5 +
            Math.random() * 15

    });
}


function updateClouds(dt) {

    cloudOffset +=
        8 * dt;

    if (
        cloudOffset >
        100000
    ) {
        cloudOffset = 0;
    }
}


/* =========================================================
   DESENHAR CÉU
========================================================= */

function drawSky() {

    const brightness =
        getSkyBrightness();

    const r =
        Math.floor(
            12 +
            70 * brightness
        );

    const g =
        Math.floor(
            20 +
            120 * brightness
        );

    const b =
        Math.floor(
            35 +
            170 * brightness
        );

    ctx.fillStyle =
        `rgb(${r},${g},${b})`;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    /*
       Estrelas
    */

    if (!isDay()) {

        ctx.fillStyle =
            `rgba(255,255,255,${
                .45 * (1 - brightness)
            })`;

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            const x =
                hash(i, 999) *
                W;

            const y =
                hash(i, 555) *
                (H * .55);

            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }
    }
}


/* =========================================================
   SOL E LUA
========================================================= */

function drawSunMoon() {

    const phase =
        worldTime %
        FULL_DAY;

    const dayProgress =
        phase /
        DAY_LENGTH;

    if (isDay()) {

        const x =
            dayProgress *
            W;

        const y =
            80 +
            Math.sin(
                dayProgress *
                Math.PI
            ) *
            -60;

        ctx.fillStyle =
            "#fff3a0";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            32,
            0,
            Math.PI * 2
        );

        ctx.fill();

    } else {

        const nightProgress =
            (
                phase -
                DAY_LENGTH
            ) /
            NIGHT_LENGTH;

        const x =
            nightProgress *
            W;

        const y =
            100 +
            Math.sin(
                nightProgress *
                Math.PI
            ) *
            -65;

        ctx.fillStyle =
            "#e8ecff";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            24,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


/* =========================================================
   NUVENS
========================================================= */

function drawClouds() {

    ctx.fillStyle =
        "rgba(255,255,255,.78)";

    for (
        const cloud of clouds
    ) {

        const x =
            (
                cloud.x +
                cloudOffset * cloud.speed
            ) % (W + 500) - 250;

        const y =
            cloud.y;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            25,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 30,
            y - 15,
            32,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 65,
            y,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


/* =========================================================
   DESENHAR BLOCO
========================================================= */

function drawBlock(
    block,
    sx,
    sy
) {

    if (
        sx < -TILE ||
        sy < -TILE ||
        sx > W ||
        sy > H
    ) {
        return;
    }

    if (block === BLOCK.GRASS) {

        ctx.fillStyle =
            "#79502f";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#4caf50";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            7
        );

    } else if (
        block === BLOCK.DIRT
    ) {

        ctx.fillStyle =
            "#79502f";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

    } else if (
        block === BLOCK.STONE ||
        block === BLOCK.CAVE_STONE
    ) {

        ctx.fillStyle =
            "#676767";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "rgba(0,0,0,.12)";

        ctx.fillRect(
            sx + 5,
            sy + 7,
            5,
            5
        );

        ctx.fillRect(
            sx + 21,
            sy + 20,
            4,
            4
        );

    } else if (
        block === BLOCK.WOOD
    ) {

        ctx.fillStyle =
            "#704522";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#a66a32";

        ctx.fillRect(
            sx + 8,
            sy,
            5,
            TILE
        );

    } else if (
        block === BLOCK.LEAVES
    ) {

        /*
           Folhas transparentes para
           o jogador conseguir atravessar.
        */

        ctx.fillStyle =
            "rgba(43,130,60,.72)";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

    } else if (
        block === BLOCK.SAND
    ) {

        ctx.fillStyle =
            "#d8c27b";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

    } else if (
        block === BLOCK.WATER
    ) {

        ctx.fillStyle =
            "rgba(45,130,220,.72)";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "rgba(255,255,255,.22)";

        ctx.fillRect(
            sx,
            sy + 7,
            TILE,
            2
        );

    } else if (
        block === BLOCK.COAL
    ) {

        ctx.fillStyle =
            "#666";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#181818";

        ctx.fillRect(
            sx + 6,
            sy + 8,
            8,
            8
        );

        ctx.fillRect(
            sx + 19,
            sy + 18,
            7,
            7
        );

    } else if (
        block === BLOCK.IRON
    ) {

        ctx.fillStyle =
            "#777";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#c18d6c";

        ctx.fillRect(
            sx + 6,
            sy + 7,
            7,
            7
        );

        ctx.fillRect(
            sx + 19,
            sy + 19,
            7,
            7
        );

    } else if (
        block === BLOCK.GOLD
    ) {

        ctx.fillStyle =
            "#777";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#ffd42a";

        ctx.fillRect(
            sx + 7,
            sy + 8,
            8,
            8
        );

        ctx.fillRect(
            sx + 20,
            sy + 18,
            7,
            7
        );

    } else if (
        block === BLOCK.DIAMOND
    ) {

        ctx.fillStyle =
            "#777";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );

        ctx.fillStyle =
            "#58e5e8";

        ctx.fillRect(
            sx + 6,
            sy + 8,
            8,
            8
        );

        ctx.fillRect(
            sx + 19,
            sy + 18,
            8,
            8
        );

    } else if (
        block === BLOCK.GRAVEL
    ) {

        ctx.fillStyle =
            "#8a8177";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            TILE
        );
    }
}


/* =========================================================
   ÁRVORES
========================================================= */

function hasTree(x) {

    /*
       Árvores determinísticas.

       Elas ficam no mundo mesmo
       quando o jogador volta.
    */

    if (
        isRiver(x) ||
        isSea(x)
    ) {
        return false;
    }

    if (
        getBiome(x) === "desert"
    ) {
        return false;
    }

    return hash(
        Math.floor(x / 5),
        420
    ) > .91;
}


function drawTree(x) {

    if (!hasTree(x)) {
        return;
    }

    const surface =
        getTerrainHeight(x);

    const base =
        worldToScreen(
            x,
            surface
        );

    const trunkHeight =
        3 +
        Math.floor(
            hash(x, 421) * 3
        );

    /*
       Tronco
    */

    for (
        let i = 1;
        i <= trunkHeight;
        i++
    ) {

        drawBlock(
            BLOCK.WOOD,
            base.x,
            base.y -
            i * TILE
        );
    }

    /*
       Copa
    */

    for (
        let xx = -2;
        xx <= 2;
        xx++
    ) {

        for (
            let yy = -5;
            yy <= -2;
            yy++
        ) {

            if (
                Math.abs(xx) +
                Math.abs(yy + 3) <
                4
            ) {

                drawBlock(
                    BLOCK.LEAVES,
                    base.x +
                    xx * TILE,
                    base.y +
                    yy * TILE
                );
            }
        }
    }
}


/* =========================================================
   DESENHAR MUNDO
========================================================= */

function drawWorld() {

    const startX =
        Math.floor(
            cameraX / TILE
        ) - 2;

    const endX =
        Math.ceil(
            (
                cameraX +
                W
            ) / TILE
        ) + 2;

    const startY =
        Math.floor(
            cameraY / TILE
        ) - 2;

    const endY =
        Math.ceil(
            (
                cameraY +
                H
            ) / TILE
        ) + 2;

    for (
        let x = startX;
        x <= endX;
        x++
    ) {

        if (
            x < WORLD_MIN_X ||
            x > WORLD_MAX_X
        ) {
            continue;
        }

        for (
            let y = startY;
            y <= endY;
            y++
        ) {

            const block =
                generateBlock(
                    x,
                    y
                );

            if (
                block === BLOCK.AIR
            ) {
                continue;
            }

            const pos =
                worldToScreen(
                    x,
                    y
                );

            drawBlock(
                block,
                pos.x,
                pos.y
            );
        }

        /*
           Árvore depois dos blocos
           para ficar visível.
        */

        drawTree(x);
    }
}


/* =========================================================
   DESENHAR ANIMAIS
========================================================= */

function drawAnimals() {

    for (
        const animal of animals
    ) {

        const data =
            animalTypes[
                animal.type
            ];

        const pos =
            worldToScreen(
                animal.x,
                animal.y
            );

        ctx.font =
            `${Math.max(
                18,
                data.width * TILE
            )}px Arial`;

        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        ctx.fillText(
            data.icon,
            pos.x +
            data.width *
            TILE / 2,
            pos.y +
            data.height *
            TILE
        );

        /*
           Barra de vida
        */

        if (
            animal.health <
            animal.maxHealth
        ) {

            const barWidth =
                data.width *
                TILE;

            ctx.fillStyle =
                "#222";

            ctx.fillRect(
                pos.x,
                pos.y - 7,
                barWidth,
                4
            );

            ctx.fillStyle =
                "#e53935";

            ctx.fillRect(
                pos.x,
                pos.y - 7,
                barWidth *
                (
                    animal.health /
                    animal.maxHealth
                ),
                4
            );
        }
    }
}


/* =========================================================
   JOGADOR
========================================================= */

function drawPlayer() {

    const pos =
        worldToScreen(
            player.x,
            player.y
        );

    /*
       Corpo
    */

    ctx.fillStyle =
        "#3f78d8";

    ctx.fillRect(
        pos.x + 5,
        pos.y + 18,
        22,
        32
    );

    /*
       Cabeça
    */

    ctx.fillStyle =
        "#f0b27a";

    ctx.fillRect(
        pos.x + 7,
        pos.y,
        18,
        19
    );

    /*
       Cabelo
    */

    ctx.fillStyle =
        "#3c281d";

    ctx.fillRect(
        pos.x + 7,
        pos.y,
        18,
        5
    );

    /*
       Pernas
    */

    ctx.fillStyle =
        "#293c72";

    ctx.fillRect(
        pos.x + 6,
        pos.y + 50,
        8,
        8
    );

    ctx.fillRect(
        pos.x + 17,
        pos.y + 50,
        8,
        8
    );
}


/* =========================================================
   ILUMINAÇÃO / VISIBILIDADE
========================================================= */

function drawLighting() {

    const darkness =
        1 -
        getSkyBrightness();

    /*
       Camadas de escuridão
    */

    if (darkness > .03) {

        ctx.fillStyle =
            `rgba(0,0,20,${
                darkness * .62
            })`;

        ctx.fillRect(
            0,
            0,
            W,
            H
        );
    }

    /*
       Escuridão subterrânea.

       O jogador só consegue enxergar
       aproximadamente 2 blocos abaixo
       sem iluminação.
    */

    const px =
        player.x;

    const py =
        player.y;

    const radius =
        2.5 * TILE;

    const gradient =
        ctx.createRadialGradient(
            W / 2,
            H / 2,
            TILE,
            W / 2,
            H / 2,
            radius
        );

    gradient.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    gradient.addColorStop(
        .55,
        "rgba(0,0,0,.18)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,.72)"
    );

    /*
       Só aplica forte em regiões
       subterrâneas.
    */

    const surface =
        getTerrainHeight(
            Math.floor(px)
        );

    if (
        py >
        surface + 3
    ) {

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            W,
            H
        );
    }
}


/* =========================================================
   PARTÍCULAS
========================================================= */

const particles = [];


function createParticles(
    x,
    y,
    type
) {

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        particles.push({

            x,
            y,

            vx:
                (
                    Math.random() -
                    .5
                ) * 3,

            vy:
                (
                    Math.random() -
                    .8
                ) * 3,

            life: .5 +
                Math.random() * .5,

            type

        });
    }
}


function updateParticles(dt) {

    for (
        let i =
            particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];

        p.x +=
            p.vx * dt;

        p.y +=
            p.vy * dt;

        p.vy +=
            8 * dt;

        p.life -= dt;

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

    for (
        const p of particles
    ) {

        const pos =
            worldToScreen(
                p.x,
                p.y
            );

        ctx.fillStyle =
            p.type === "red" ?
            "#ff5555" :
            "#b5b5b5";

        ctx.fillRect(
            pos.x,
            pos.y,
            4,
            4
        );
    }
}


/* =========================================================
   FOME
========================================================= */

let hungerTimer = 0;
let healthTimer = 0;


function updateSurvival(dt) {

    hungerTimer += dt;

    /*
       A cada 30 segundos
       perde 1 ponto de fome.
    */

    if (
        hungerTimer >= 30
    ) {

        hungerTimer = 0;

        player.hunger =
            Math.max(
                0,
                player.hunger - 1
            );
    }

    /*
       Se fome chegar a zero,
       começa a perder vida.
    */

    if (
        player.hunger <= 0
    ) {

        healthTimer += dt;

        if (
            healthTimer >= 3
        ) {

            healthTimer = 0;

            player.health =
                Math.max(
                    0,
                    player.health - 1
                );
        }

    } else {

        healthTimer = 0;
    }

    /*
       Regeneração quando está
       bem alimentado.
    */

    if (
        player.hunger >= 18 &&
        player.health < player.maxHealth
    ) {

        player.health =
            Math.min(
                player.maxHealth,
                player.health +
                dt * .4
            );
    }

    if (
        player.health <= 0
    ) {

        respawnPlayer();
    }
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    document.getElementById(
        "health"
    ).textContent =
        Math.floor(
            player.health
        );

    document.getElementById(
        "hunger"
    ).textContent =
        Math.floor(
            player.hunger
        );

    document.getElementById(
        "healthBar"
    ).style.width =
        `${player.health}%`;

    document.getElementById(
        "hungerBar"
    ).style.width =
        `${(
            player.hunger /
            player.maxHunger
        ) * 100}%`;

    document.getElementById(
        "posX"
    ).textContent =
        Math.floor(
            player.x
        );

    document.getElementById(
        "posY"
    ).textContent =
        Math.floor(
            player.y
        );

    document.getElementById(
        "timeText"
    ).textContent =
        getTimeName();
}


/* =========================================================
   MENSAGENS
========================================================= */

let messageTimer = 0;

function showMessage(text) {

    const message =
        document.getElementById(
            "message"
        );

    message.textContent =
        text;

    message.style.opacity = "1";

    messageTimer = 2;
}


function updateMessage(dt) {

    if (
        messageTimer <= 0
    ) {
        return;
    }

    messageTimer -= dt;

    if (
        messageTimer <= 0
    ) {

        document.getElementById(
            "message"
        ).style.opacity = "0";
    }
}


/* =========================================================
   INÍCIO DO MUNDO
========================================================= */

respawnPlayer();

updateInventoryUI();


/* =========================================================
   LOOP
========================================================= */

let lastTime =
    performance.now();


function loop(now) {

    const rawDelta =
        (now - lastTime) /
        1000;

    lastTime = now;

    /*
       Evita problemas se a aba
       ficar congelada.
    */

    const dt =
        Math.min(
            rawDelta,
            .05
        );

    if (!paused && !inventoryOpen) {

        worldTime +=
            dt * 1000;

        if (
            worldTime >
            FULL_DAY
        ) {
            worldTime -=
                FULL_DAY;
        }

        updatePlayer(dt);

        updateAnimals(dt);

        updateParticles(dt);

        updateClouds(dt);

        updateSurvival(dt);

        updateMessage(dt);

        updateCamera();
    }

    /*
       Renderização
    */

    drawSky();

    drawSunMoon();

    drawClouds();

    drawWorld();

    drawAnimals();

    drawParticles();

    drawPlayer();

    drawLighting();

    updateHUD();

    requestAnimationFrame(
        loop
    );
}


requestAnimationFrame(
    loop
);
