"use strict";

/* =========================================================
   SANDBOX ADVENTURE
   SISTEMA DE ITENS + FERRAMENTAS DESENHADAS
========================================================= */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const handCanvas = document.getElementById("handItemCanvas");
const handCtx = handCanvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;

canvas.width = W;
canvas.height = H;

handCanvas.width = 180;
handCanvas.height = 180;

window.addEventListener("resize", () => {

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

});

/* =========================================================
   MUNDO
========================================================= */

const TILE = 32;

const WORLD_MIN_X = -60000;
const WORLD_MAX_X = 60000;
const WORLD_HEIGHT = 220;

const SEA_LEVEL = 82;

let worldSeed = Math.floor(Math.random() * 1000000000);

let modifiedBlocks = new Map();

/* =========================================================
   BLOCOS
========================================================= */

const BLOCK = {

    AIR: 0,
    GRASS: 1,
    DIRT: 2,
    STONE: 3,

    OAK_WOOD: 4,
    OAK_LEAVES: 5,

    BIRCH_WOOD: 6,
    BIRCH_LEAVES: 7,

    PINE_WOOD: 8,
    PINE_LEAVES: 9,

    JUNGLE_WOOD: 10,
    JUNGLE_LEAVES: 11,

    ACACIA_WOOD: 12,
    ACACIA_LEAVES: 13,

    DARK_WOOD: 14,
    DARK_LEAVES: 15,

    SAND: 16,
    WATER: 17,
    COAL: 18,
    IRON: 19,
    GOLD: 20,
    DIAMOND: 21,
    GRAVEL: 22,

    SNOW: 23,
    ICE: 24,
    MUD: 25,

    CACTUS: 26
};

const blockNames = {

    [BLOCK.GRASS]: "Grama",
    [BLOCK.DIRT]: "Terra",
    [BLOCK.STONE]: "Pedra",

    [BLOCK.OAK_WOOD]: "Madeira de Carvalho",
    [BLOCK.OAK_LEAVES]: "Folhas de Carvalho",

    [BLOCK.BIRCH_WOOD]: "Madeira de Bétula",
    [BLOCK.BIRCH_LEAVES]: "Folhas de Bétula",

    [BLOCK.PINE_WOOD]: "Madeira de Pinheiro",
    [BLOCK.PINE_LEAVES]: "Folhas de Pinheiro",

    [BLOCK.JUNGLE_WOOD]: "Madeira de Selva",
    [BLOCK.JUNGLE_LEAVES]: "Folhas de Selva",

    [BLOCK.ACACIA_WOOD]: "Madeira de Acácia",
    [BLOCK.ACACIA_LEAVES]: "Folhas de Acácia",

    [BLOCK.DARK_WOOD]: "Madeira Escura",
    [BLOCK.DARK_LEAVES]: "Folhas Escuras",

    [BLOCK.SAND]: "Areia",
    [BLOCK.WATER]: "Água",

    [BLOCK.COAL]: "Carvão",
    [BLOCK.IRON]: "Ferro",
    [BLOCK.GOLD]: "Ouro",
    [BLOCK.DIAMOND]: "Diamante",

    [BLOCK.GRAVEL]: "Cascalho",
    [BLOCK.SNOW]: "Neve",
    [BLOCK.ICE]: "Gelo",
    [BLOCK.MUD]: "Lama",
    [BLOCK.CACTUS]: "Cacto"
};

/* =========================================================
   ITENS
========================================================= */

const ITEMS = {

    dirt: {
        name: "Terra",
        block: BLOCK.DIRT,
        stack: 64,
        type: "block"
    },

    grass: {
        name: "Grama",
        block: BLOCK.GRASS,
        stack: 64,
        type: "block"
    },

    stone: {
        name: "Pedra",
        block: BLOCK.STONE,
        stack: 64,
        type: "block"
    },

    oak_log: {
        name: "Madeira de Carvalho",
        block: BLOCK.OAK_WOOD,
        stack: 64,
        type: "block"
    },

    birch_log: {
        name: "Madeira de Bétula",
        block: BLOCK.BIRCH_WOOD,
        stack: 64,
        type: "block"
    },

    pine_log: {
        name: "Madeira de Pinheiro",
        block: BLOCK.PINE_WOOD,
        stack: 64,
        type: "block"
    },

    jungle_log: {
        name: "Madeira de Selva",
        block: BLOCK.JUNGLE_WOOD,
        stack: 64,
        type: "block"
    },

    acacia_log: {
        name: "Madeira de Acácia",
        block: BLOCK.ACACIA_WOOD,
        stack: 64,
        type: "block"
    },

    dark_log: {
        name: "Madeira Escura",
        block: BLOCK.DARK_WOOD,
        stack: 64,
        type: "block"
    },

    sand: {
        name: "Areia",
        block: BLOCK.SAND,
        stack: 64,
        type: "block"
    },

    gravel: {
        name: "Cascalho",
        block: BLOCK.GRAVEL,
        stack: 64,
        type: "block"
    },

    coal: {
        name: "Carvão",
        stack: 64,
        type: "material"
    },

    iron: {
        name: "Ferro",
        stack: 64,
        type: "material"
    },

    gold: {
        name: "Ouro",
        stack: 64,
        type: "material"
    },

    diamond: {
        name: "Diamante",
        stack: 64,
        type: "material"
    },

    stick: {
        name: "Graveto",
        stack: 64,
        type: "material"
    },

    plank: {
        name: "Tábuas de Madeira",
        stack: 64,
        type: "material"
    },

    crafting_table: {
        name: "Mesa de Trabalho",
        stack: 64,
        type: "blockItem"
    },

    furnace: {
        name: "Fornalha",
        stack: 64,
        type: "blockItem"
    },

    chest: {
        name: "Baú",
        stack: 64,
        type: "blockItem"
    },

    torch: {
        name: "Tocha",
        stack: 64,
        type: "tool"
    },

    /* =========================
       ESPADAS
    ========================= */

    wooden_sword: {
        name: "Espada de Madeira",
        stack: 1,
        type: "weapon",
        material: "wood",
        damage: 5,
        durability: 59
    },

    stone_sword: {
        name: "Espada de Pedra",
        stack: 1,
        type: "weapon",
        material: "stone",
        damage: 6,
        durability: 131
    },

    iron_sword: {
        name: "Espada de Ferro",
        stack: 1,
        type: "weapon",
        material: "iron",
        damage: 7,
        durability: 250
    },

    gold_sword: {
        name: "Espada de Ouro",
        stack: 1,
        type: "weapon",
        material: "gold",
        damage: 5,
        durability: 32
    },

    diamond_sword: {
        name: "Espada de Diamante",
        stack: 1,
        type: "weapon",
        material: "diamond",
        damage: 8,
        durability: 1561
    },

    /* =========================
       PICARETAS
    ========================= */

    wooden_pickaxe: {
        name: "Picareta de Madeira",
        stack: 1,
        type: "pickaxe",
        material: "wood",
        durability: 59
    },

    stone_pickaxe: {
        name: "Picareta de Pedra",
        stack: 1,
        type: "pickaxe",
        material: "stone",
        durability: 131
    },

    iron_pickaxe: {
        name: "Picareta de Ferro",
        stack: 1,
        type: "pickaxe",
        material: "iron",
        durability: 250
    },

    gold_pickaxe: {
        name: "Picareta de Ouro",
        stack: 1,
        type: "pickaxe",
        material: "gold",
        durability: 32
    },

    diamond_pickaxe: {
        name: "Picareta de Diamante",
        stack: 1,
        type: "pickaxe",
        material: "diamond",
        durability: 1561
    },

    /* =========================
       MACHADOS
    ========================= */

    wooden_axe: {
        name: "Machado de Madeira",
        stack: 1,
        type: "axe",
        material: "wood",
        durability: 59
    },

    stone_axe: {
        name: "Machado de Pedra",
        stack: 1,
        type: "axe",
        material: "stone",
        durability: 131
    },

    iron_axe: {
        name: "Machado de Ferro",
        stack: 1,
        type: "axe",
        material: "iron",
        durability: 250
    },

    gold_axe: {
        name: "Machado de Ouro",
        stack: 1,
        type: "axe",
        material: "gold",
        durability: 32
    },

    diamond_axe: {
        name: "Machado de Diamante",
        stack: 1,
        type: "axe",
        material: "diamond",
        durability: 1561
    },

    /* =========================
       PÁS
    ========================= */

    wooden_shovel: {
        name: "Pá de Madeira",
        stack: 1,
        type: "shovel",
        material: "wood",
        durability: 59
    },

    stone_shovel: {
        name: "Pá de Pedra",
        stack: 1,
        type: "shovel",
        material: "stone",
        durability: 131
    },

    iron_shovel: {
        name: "Pá de Ferro",
        stack: 1,
        type: "shovel",
        material: "iron",
        durability: 250
    },

    gold_shovel: {
        name: "Pá de Ouro",
        stack: 1,
        type: "shovel",
        material: "gold",
        durability: 32
    },

    diamond_shovel: {
        name: "Pá de Diamante",
        stack: 1,
        type: "shovel",
        material: "diamond",
        durability: 1561
    },

    /* =========================
       ENXADAS
    ========================= */

    wooden_hoe: {
        name: "Enxada de Madeira",
        stack: 1,
        type: "hoe",
        material: "wood",
        durability: 59
    },

    stone_hoe: {
        name: "Enxada de Pedra",
        stack: 1,
        type: "hoe",
        material: "stone",
        durability: 131
    },

    iron_hoe: {
        name: "Enxada de Ferro",
        stack: 1,
        type: "hoe",
        material: "iron",
        durability: 250
    },

    gold_hoe: {
        name: "Enxada de Ouro",
        stack: 1,
        type: "hoe",
        material: "gold",
        durability: 32
    },

    diamond_hoe: {
        name: "Enxada de Diamante",
        stack: 1,
        type: "hoe",
        material: "diamond",
        durability: 1561
    }
};

/* =========================================================
   INVENTÁRIO
========================================================= */

let inventory = new Array(36).fill(null);

let selectedSlot = 0;

let crafting = [
    null,
    null,
    null,
    null
];

function createStack(id, count) {

    return {
        id,
        count,
        durability: ITEMS[id].durability || null
    };
}

/* =========================================================
   CRAFTING
========================================================= */

const recipes = [

    {
        name: "Tábuas",
        pattern: ["log"],
        result: "plank",
        amount: 4
    },

    {
        name: "Graveto",
        pattern: ["plank", "plank"],
        result: "stick",
        amount: 4
    },

    {
        name: "Mesa de Trabalho",
        pattern: ["plank", "plank", "plank", "plank"],
        result: "crafting_table",
        amount: 1
    },

    {
        name: "Espada de Madeira",
        pattern: ["plank", "plank", "stick"],
        result: "wooden_sword",
        amount: 1
    },

    {
        name: "Picareta de Madeira",
        pattern: ["plank", "plank", "plank", "empty", "stick", "empty", "empty", "stick"],
        result: "wooden_pickaxe",
        amount: 1
    },

    {
        name: "Machado de Madeira",
        pattern: ["plank", "plank", "empty", "plank", "stick", "empty", "empty", "stick"],
        result: "wooden_axe",
        amount: 1
    },

    {
        name: "Pá de Madeira",
        pattern: ["plank", "stick", "stick"],
        result: "wooden_shovel",
        amount: 1
    },

    {
        name: "Enxada de Madeira",
        pattern: ["plank", "plank", "stick", "empty", "stick"],
        result: "wooden_hoe",
        amount: 1
    },

    {
        name: "Espada de Pedra",
        pattern: ["stone", "stone", "stick"],
        result: "stone_sword",
        amount: 1
    },

    {
        name: "Picareta de Pedra",
        pattern: ["stone", "stone", "stone", "empty", "stick", "empty", "empty", "stick"],
        result: "stone_pickaxe",
        amount: 1
    },

    {
        name: "Machado de Pedra",
        pattern: ["stone", "stone", "empty", "stone", "stick", "empty", "empty", "stick"],
        result: "stone_axe",
        amount: 1
    },

    {
        name: "Pá de Pedra",
        pattern: ["stone", "stick", "stick"],
        result: "stone_shovel",
        amount: 1
    },

    {
        name: "Enxada de Pedra",
        pattern: ["stone", "stone", "stick", "empty", "stick"],
        result: "stone_hoe",
        amount: 1
    },

    {
        name: "Espada de Ferro",
        pattern: ["iron", "iron", "stick"],
        result: "iron_sword",
        amount: 1
    },

    {
        name: "Picareta de Ferro",
        pattern: ["iron", "iron", "iron", "empty", "stick", "empty", "empty", "stick"],
        result: "iron_pickaxe",
        amount: 1
    },

    {
        name: "Machado de Ferro",
        pattern: ["iron", "iron", "empty", "iron", "stick", "empty", "empty", "stick"],
        result: "iron_axe",
        amount: 1
    },

    {
        name: "Pá de Ferro",
        pattern: ["iron", "stick", "stick"],
        result: "iron_shovel",
        amount: 1
    },

    {
        name: "Enxada de Ferro",
        pattern: ["iron", "iron", "stick", "empty", "stick"],
        result: "iron_hoe",
        amount: 1
    },

    {
        name: "Espada de Diamante",
        pattern: ["diamond", "diamond", "stick"],
        result: "diamond_sword",
        amount: 1
    },

    {
        name: "Picareta de Diamante",
        pattern: ["diamond", "diamond", "diamond", "empty", "stick", "empty", "empty", "stick"],
        result: "diamond_pickaxe",
        amount: 1
    },

    {
        name: "Machado de Diamante",
        pattern: ["diamond", "diamond", "empty", "diamond", "stick", "empty", "empty", "stick"],
        result: "diamond_axe",
        amount: 1
    },

    {
        name: "Pá de Diamante",
        pattern: ["diamond", "stick", "stick"],
        result: "diamond_shovel",
        amount: 1
    },

    {
        name: "Enxada de Diamante",
        pattern: ["diamond", "diamond", "stick", "empty", "stick"],
        result: "diamond_hoe",
        amount: 1
    }
];

function materialOfItem(id) {

    if (!id) return "empty";

    if (id.includes("log")) return "log";

    if (id === "plank") return "plank";

    if (id === "stick") return "stick";

    if (id === "stone") return "stone";

    if (id === "iron") return "iron";

    if (id === "diamond") return "diamond";

    if (id === "gold") return "gold";

    return id;
}

function getCraftResult() {

    const pattern = crafting.map(stack =>
        stack ? materialOfItem(stack.id) : "empty"
    );

    for (const recipe of recipes) {

        if (samePattern(pattern, recipe.pattern)) {
            return recipe;
        }

    }

    return null;
}

function samePattern(a, b) {

    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {

        if (a[i] !== b[i]) {
            return false;
        }

    }

    return true;
}

function craftItem() {

    const recipe = getCraftResult();

    if (!recipe) return;

    for (const stack of crafting) {

        if (stack) {
            removeItem(stack.id, 1);
        }

    }

    addItem(recipe.result, recipe.amount);

    crafting.fill(null);

    updateInventoryUI();

    showMessage("Criado: " + ITEMS[recipe.result].name);

}

/* =========================================================
   INVENTÁRIO
========================================================= */

function addItem(id, amount = 1) {

    const item = ITEMS[id];

    if (!item) return false;

    let remaining = amount;

    for (let i = 0; i < inventory.length; i++) {

        const slot = inventory[i];

        if (
            slot &&
            slot.id === id &&
            slot.count < item.stack
        ) {

            const canAdd = Math.min(
                remaining,
                item.stack - slot.count
            );

            slot.count += canAdd;
            remaining -= canAdd;

            if (remaining <= 0) {
                updateInventoryUI();
                return true;
            }
        }

    }

    for (let i = 0; i < inventory.length; i++) {

        if (!inventory[i]) {

            const amountHere = Math.min(
                remaining,
                item.stack
            );

            inventory[i] = createStack(id, amountHere);

            remaining -= amountHere;

            if (remaining <= 0) {

                updateInventoryUI();
                return true;
            }

        }

    }

    updateInventoryUI();

    return remaining <= 0;
}

function removeItem(id, amount = 1) {

    let remaining = amount;

    for (let i = 0; i < inventory.length; i++) {

        if (
            inventory[i] &&
            inventory[i].id === id
        ) {

            const take = Math.min(
                remaining,
                inventory[i].count
            );

            inventory[i].count -= take;
            remaining -= take;

            if (inventory[i].count <= 0) {
                inventory[i] = null;
            }

            if (remaining <= 0) break;

        }

    }

    updateInventoryUI();

    return remaining <= 0;
}

/* =========================================================
   DESENHO DOS ITENS
========================================================= */

function setupCanvas(c) {

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const rect = c.getBoundingClientRect();

    c.width = Math.max(1, Math.floor(rect.width * dpr));
    c.height = Math.max(1, Math.floor(rect.height * dpr));

    const context = c.getContext("2d");

    context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    context.imageSmoothingEnabled = false;

    return context;
}

function drawItem(c, itemId) {

    if (!itemId) return;

    const context = setupCanvas(c);

    const rect = c.getBoundingClientRect();

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    context.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );

    const item = ITEMS[itemId];

    if (!item) return;

    /* FERRAMENTAS */

    if (
        item.type === "pickaxe" ||
        item.type === "axe" ||
        item.type === "shovel" ||
        item.type === "hoe" ||
        item.type === "weapon"
    ) {

        drawTool(
            context,
            cx,
            cy,
            Math.min(rect.width, rect.height) * .8,
            item.type,
            item.material
        );

        return;
    }

    /* BLOCOS */

    if (item.type === "block") {

        drawBlockIcon(
            context,
            cx,
            cy,
            Math.min(rect.width, rect.height) * .7,
            item.block
        );

        return;
    }

    /* MATERIAIS */

    drawMaterialIcon(
        context,
        cx,
        cy,
        Math.min(rect.width, rect.height) * .7,
        itemId
    );
}

/* =========================================================
   FERRAMENTAS
========================================================= */

const materialColors = {

    wood: "#9b633b",
    stone: "#777777",
    iron: "#d8d8d8",
    gold: "#f4c542",
    diamond: "#42e5df"
};

function drawTool(
    context,
    x,
    y,
    size,
    type,
    material
) {

    context.save();

    context.translate(x, y);

    context.lineCap = "square";
    context.lineJoin = "miter";

    const metal = materialColors[material] || "#aaa";

    const dark = shadeColor(metal, -35);

    /* CABO */

    context.strokeStyle = "#704522";
    context.lineWidth = size * .09;

    context.beginPath();

    context.moveTo(
        -size * .30,
        size * .34
    );

    context.lineTo(
        size * .25,
        -size * .25
    );

    context.stroke();

    context.strokeStyle = "#9a6338";
    context.lineWidth = size * .035;

    context.beginPath();

    context.moveTo(
        -size * .29,
        size * .32
    );

    context.lineTo(
        size * .25,
        -size * .27
    );

    context.stroke();

    /* PICARETA */

    if (type === "pickaxe") {

        context.strokeStyle = dark;
        context.lineWidth = size * .15;

        context.beginPath();

        context.moveTo(
            -size * .34,
            -size * .18
        );

        context.quadraticCurveTo(
            0,
            -size * .48,
            size * .36,
            -size * .16
        );

        context.stroke();

        context.strokeStyle = metal;
        context.lineWidth = size * .10;

        context.beginPath();

        context.moveTo(
            -size * .34,
            -size * .18
        );

        context.quadraticCurveTo(
            0,
            -size * .42,
            size * .36,
            -size * .16
        );

        context.stroke();

    }

    /* MACHADO */

    else if (type === "axe") {

        context.fillStyle = dark;

        context.beginPath();

        context.moveTo(
            size * .05,
            -size * .35
        );

        context.lineTo(
            size * .42,
            -size * .28
        );

        context.lineTo(
            size * .30,
            -size * .02
        );

        context.lineTo(
            size * .02,
            -size * .08
        );

        context.closePath();

        context.fill();

        context.fillStyle = metal;

        context.beginPath();

        context.moveTo(
            size * .10,
            -size * .36
        );

        context.lineTo(
            size * .42,
            -size * .29
        );

        context.lineTo(
            size * .30,
            -size * .06
        );

        context.lineTo(
            size * .08,
            -size * .10
        );

        context.closePath();

        context.fill();

    }

    /* PÁ */

    else if (type === "shovel") {

        context.fillStyle = dark;

        context.beginPath();

        context.moveTo(
            size * .08,
            -size * .36
        );

        context.lineTo(
            size * .36,
            -size * .24
        );

        context.lineTo(
            size * .30,
            size * .02
        );

        context.lineTo(
            size * .02,
            -size * .04
        );

        context.closePath();

        context.fill();

        context.fillStyle = metal;

        context.beginPath();

        context.moveTo(
            size * .12,
            -size * .34
        );

        context.lineTo(
            size * .34,
            -size * .24
        );

        context.lineTo(
            size * .27,
            -size * .02
        );

        context.lineTo(
            size * .06,
            -size * .07
        );

        context.closePath();

        context.fill();

    }

    /* ENXADA */

    else if (type === "hoe") {

        context.strokeStyle = dark;
        context.lineWidth = size * .12;

        context.beginPath();

        context.moveTo(
            size * .28,
            -size * .35
        );

        context.lineTo(
            -size * .05,
            -size * .10
        );

        context.stroke();

        context.strokeStyle = metal;
        context.lineWidth = size * .08;

        context.beginPath();

        context.moveTo(
            -size * .20,
            -size * .18
        );

        context.lineTo(
            size * .28,
            -size * .38
        );

        context.stroke();

    }

    /* ESPADA */

    else if (type === "weapon") {

        context.save();

        context.rotate(-.45);

        /* GUARDA */

        context.fillStyle = "#c49b45";

        context.fillRect(
            -size * .28,
            size * .02,
            size * .55,
            size * .08
        );

        /* CABO */

        context.fillStyle = "#6b4327";

        context.fillRect(
            -size * .04,
            size * .08,
            size * .08,
            size * .25
        );

        /* LÂMINA */

        context.fillStyle = metal;

        context.beginPath();

        context.moveTo(
            -size * .06,
            -size * .45
        );

        context.lineTo(
            size * .08,
            -size * .45
        );

        context.lineTo(
            size * .18,
            size * .02
        );

        context.lineTo(
            -size * .04,
            size * .02
        );

        context.closePath();

        context.fill();

        context.strokeStyle = dark;
        context.lineWidth = 2;

        context.stroke();

        context.restore();

    }

    context.restore();
}

function shadeColor(color, amount) {

    let usePound = false;

    if (color[0] === "#") {

        color = color.slice(1);
        usePound = true;
    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;

    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);

    return (
        (usePound ? "#" : "") +
        (r << 16 | g << 8 | b)
            .toString(16)
            .padStart(6, "0")
    );
}

/* =========================================================
   ÍCONES DOS BLOCOS
========================================================= */

function drawBlockIcon(context, x, y, size, block) {

    const s = size;

    let color = "#777";

    if (block === BLOCK.GRASS) color = "#58a93d";
    if (block === BLOCK.DIRT) color = "#87552f";
    if (block === BLOCK.STONE) color = "#888";
    if (block === BLOCK.SAND) color = "#d8c27a";
    if (block === BLOCK.OAK_WOOD) color = "#87532f";
    if (block === BLOCK.BIRCH_WOOD) color = "#ddd3ae";
    if (block === BLOCK.PINE_WOOD) color = "#60452d";
    if (block === BLOCK.JUNGLE_WOOD) color = "#704126";
    if (block === BLOCK.ACACIA_WOOD) color = "#a86f42";
    if (block === BLOCK.DARK_WOOD) color = "#493020";

    context.fillStyle = color;

    context.fillRect(
        x - s / 2,
        y - s / 2,
        s,
        s
    );

    context.strokeStyle = "#222";
    context.lineWidth = 2;

    context.strokeRect(
        x - s / 2,
        y - s / 2,
        s,
        s
    );

    if (
        block === BLOCK.OAK_WOOD ||
        block === BLOCK.BIRCH_WOOD ||
        block === BLOCK.PINE_WOOD ||
        block === BLOCK.JUNGLE_WOOD ||
        block === BLOCK.ACACIA_WOOD ||
        block === BLOCK.DARK_WOOD
    ) {

        context.strokeStyle = "#332218";
        context.lineWidth = 2;

        context.beginPath();

        context.arc(
            x,
            y,
            s * .25,
            0,
            Math.PI * 2
        );

        context.stroke();
    }
}

/* =========================================================
   ÍCONES DOS MATERIAIS
========================================================= */

function drawMaterialIcon(context, x, y, size, id) {

    if (id === "stick") {

        context.strokeStyle = "#9b633b";
        context.lineWidth = size * .12;

        context.beginPath();

        context.moveTo(
            x - size * .35,
            y + size * .35
        );

        context.lineTo(
            x + size * .30,
            y - size * .30
        );

        context.stroke();

        return;
    }

    if (id === "coal") {

        context.fillStyle = "#202020";

        context.beginPath();

        context.moveTo(x - 20, y - 5);
        context.lineTo(x - 8, y - 22);
        context.lineTo(x + 17, y - 16);
        context.lineTo(x + 23, y + 9);
        context.lineTo(x + 5, y + 22);
        context.lineTo(x - 20, y + 15);

        context.closePath();
        context.fill();

        return;
    }

    if (id === "iron") {

        drawOre(
            context,
            x,
            y,
            "#d7d7d7"
        );

        return;
    }

    if (id === "gold") {

        drawOre(
            context,
            x,
            y,
            "#f4c542"
        );

        return;
    }

    if (id === "diamond") {

        context.fillStyle = "#42e5df";

        context.beginPath();

        context.moveTo(x, y - size * .4);
        context.lineTo(x + size * .3, y - size * .05);
        context.lineTo(x + size * .15, y + size * .35);
        context.lineTo(x - size * .15, y + size * .35);
        context.lineTo(x - size * .3, y - size * .05);

        context.closePath();
        context.fill();

        context.strokeStyle = "#164f50";
        context.stroke();

        return;
    }

    /* PADRÃO */

    context.fillStyle = "#aaa";

    context.fillRect(
        x - size * .25,
        y - size * .25,
        size * .5,
        size * .5
    );
}

function drawOre(context, x, y, color) {

    context.fillStyle = "#555";

    context.fillRect(
        x - 22,
        y - 22,
        44,
        44
    );

    context.fillStyle = color;

    context.fillRect(x - 12, y - 8, 9, 9);
    context.fillRect(x + 3, y - 15, 10, 10);
    context.fillRect(x + 7, y + 5, 8, 8);
    context.fillRect(x - 14, y + 10, 8, 8);
}

/* =========================================================
   INTERFACE DO INVENTÁRIO
========================================================= */

const inventoryOverlay =
    document.getElementById("inventoryOverlay");

const inventoryGrid =
    document.getElementById("inventoryGrid");

const inventoryHotbar =
    document.getElementById("inventoryHotbar");

function createInventorySlot(index) {

    const div = document.createElement("div");

    div.className = "inventory-slot";

    div.dataset.index = index;

    const itemCanvas = document.createElement("canvas");

    div.appendChild(itemCanvas);

    const count = document.createElement("span");

    count.className = "item-count";

    div.appendChild(count);

    div.addEventListener("click", () => {

        moveInventoryItem(index);

    });

    div.addEventListener("dblclick", () => {

        const stack = inventory[index];

        if (
            stack &&
            isFood(stack.id)
        ) {

            eatFood(index);
        }

    });

    return div;
}

function updateInventoryUI() {

    inventoryGrid.innerHTML = "";
    inventoryHotbar.innerHTML = "";

    for (let i = 0; i < 27; i++) {

        const slot = createInventorySlot(i);

        const stack = inventory[i];

        if (stack) {

            drawItem(
                slot.querySelector("canvas"),
                stack.id
            );

            slot.querySelector(".item-count")
                .textContent =
                stack.count > 1
                    ? stack.count
                    : "";

        }

        inventoryGrid.appendChild(slot);

    }

    for (let i = 27; i < 36; i++) {

        const slot = createInventorySlot(i);

        const stack = inventory[i];

        if (stack) {

            drawItem(
                slot.querySelector("canvas"),
                stack.id
            );

            slot.querySelector(".item-count")
                .textContent =
                stack.count > 1
                    ? stack.count
                    : "";

        }

        inventoryHotbar.appendChild(slot);

    }

    updateHotbar();
    updateCraftUI();
}

function moveInventoryItem(index) {

    const target = index;

    if (
        inventory[target] &&
        inventory[target].count <= 0
    ) {
        inventory[target] = null;
    }

    if (
        window.dragInventoryIndex === undefined
    ) {

        if (!inventory[target]) return;

        window.dragInventoryIndex = target;

        showMessage(
            "Item selecionado"
        );

        return;
    }

    const from = window.dragInventoryIndex;

    if (from === target) {

        window.dragInventoryIndex = undefined;
        return;

    }

    const temp = inventory[from];

    inventory[from] = inventory[target];

    inventory[target] = temp;

    window.dragInventoryIndex = undefined;

    updateInventoryUI();
}

function updateHotbar() {

    document
        .querySelectorAll("#hotbar .slot")
        .forEach((slot, i) => {

            slot.classList.toggle(
                "selected",
                i === selectedSlot
            );

            const canvas =
                slot.querySelector(".item-canvas");

            const stack =
                inventory[27 + i];

            const count =
                slot.querySelector(".item-count");

            canvas
                .getContext("2d")
                .clearRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            if (stack) {

                drawItem(
                    canvas,
                    stack.id
                );

                count.textContent =
                    stack.count > 1
                        ? stack.count
                        : "";

            } else {

                count.textContent = "";
            }

        });

    updateHandItem();
}

function updateHandItem() {

    handCtx.clearRect(
        0,
        0,
        handCanvas.width,
        handCanvas.height
    );

    const stack =
        inventory[27 + selectedSlot];

    if (!stack) return;

    drawItem(
        handCanvas,
        stack.id
    );

    handCanvas.style.transform =
        "rotate(-10deg)";
}

/* =========================================================
   CRAFTING UI
========================================================= */

function updateCraftUI() {

    const slots =
        document.querySelectorAll(".craft-slot");

    slots.forEach((slot, i) => {

        slot.innerHTML = "";

        const stack = crafting[i];

        if (!stack) return;

        const c =
            document.createElement("canvas");

        slot.appendChild(c);

        drawItem(c, stack.id);

        const count =
            document.createElement("span");

        count.className = "item-count";

        count.textContent =
            stack.count > 1
                ? stack.count
                : "";

        slot.appendChild(count);

    });

    const result =
        document.getElementById("craftResult");

    result.innerHTML = "";

    const recipe =
        getCraftResult();

    if (recipe) {

        const c =
            document.createElement("canvas");

        result.appendChild(c);

        drawItem(
            c,
            recipe.result
        );

        document.getElementById(
            "recipeName"
        ).textContent =
            recipe.name +
            " × " +
            recipe.amount;

    } else {

        document.getElementById(
            "recipeName"
        ).textContent =
            "Coloque materiais para criar um item";

    }

}

/* =========================================================
   MUNDO
========================================================= */

function hash(x, y = 0) {

    let n =
        Math.sin(
            x * 127.1 +
            y * 311.7 +
            worldSeed
        ) * 43758.5453123;

    return n - Math.floor(n);
}

function noise(x) {

    const x0 = Math.floor(x);
    const x1 = x0 + 1;

    const t = x - x0;

    const a = hash(x0);
    const b = hash(x1);

    const smooth =
        t * t * (3 - 2 * t);

    return a + (b - a) * smooth;
}

function terrainNoise(x, scale) {

    return noise(x / scale);
}

/* =========================================================
   20 BIOMAS
========================================================= */

const BIOMES = {

    PLAINS: "Planície",
    FOREST: "Floresta",
    DENSE_FOREST: "Floresta Densa",
    TAIGA: "Taiga",
    SNOW_TAIGA: "Taiga Nevada",
    DESERT: "Deserto",
    SAVANNA: "Savana",
    JUNGLE: "Selva",
    SWAMP: "Pântano",
    TUNDRA: "Tundra",
    MOUNTAIN: "Montanhas",
    SNOW_MOUNTAIN: "Montanhas Nevadas",
    BEACH: "Praia",
    ROCKY_COAST: "Costa Rochosa",
    MESA: "Mesa",
    BIRCH_FOREST: "Floresta de Bétulas",
    PINE_FOREST: "Floresta de Pinheiros",
    FLOWER_FIELD: "Campos de Flores",
    PLATEAU: "Planalto",
    ISLAND: "Ilha"
};

function getBiome(x) {

    const climate =
        noise(x / 7000);

    const humidity =
        noise((x + 9000) / 5000);

    const elevation =
        terrainNoise(x, 4500);

    const coastNoise =
        terrainNoise(x, 1800);

    if (elevation > .78) {

        if (climate < .35)
            return BIOMES.SNOW_MOUNTAIN;

        return BIOMES.MOUNTAIN;
    }

    if (elevation > .68) {

        return BIOMES.PLATEAU;
    }

    if (coastNoise < .16) {

        return BIOMES.BEACH;
    }

    if (coastNoise > .90) {

        return BIOMES.ROCKY_COAST;
    }

    if (climate < .08) {

        return BIOMES.TUNDRA;
    }

    if (climate < .17) {

        return BIOMES.SNOW_TAIGA;
    }

    if (climate < .26) {

        return BIOMES.TAIGA;
    }

    if (climate < .34) {

        return BIOMES.PINE_FOREST;
    }

    if (climate < .41) {

        return BIOMES.BIRCH_FOREST;
    }

    if (climate < .48) {

        return BIOMES.DENSE_FOREST;
    }

    if (climate < .56) {

        return BIOMES.FOREST;
    }

    if (climate < .62) {

        return BIOMES.FLOWER_FIELD;
    }

    if (climate < .68) {

        return BIOMES.PLAINS;
    }

    if (climate < .73) {

        return BIOMES.SAVANNA;
    }

    if (climate < .78) {

        return BIOMES.MESA;
    }

    if (humidity > .8) {

        return BIOMES.SWAMP;
    }

    if (humidity > .7) {

        return BIOMES.JUNGLE;
    }

    return BIOMES.DESERT;
}

/* =========================================================
   ALTURA
========================================================= */

function getSurfaceY(x) {

    const biome =
        getBiome(x);

    let base = 72;

    const n1 =
        terrainNoise(x, 1800);

    const n2 =
        terrainNoise(x, 700);

    const n3 =
        terrainNoise(x, 180);

    let height =
        n1 * 18 +
        n2 * 9 +
        n3 * 3;

    if (
        biome === BIOMES.MOUNTAIN ||
        biome === BIOMES.SNOW_MOUNTAIN
    ) {

        height +=
            terrainNoise(x, 900) * 60;

    }

    if (biome === BIOMES.PLATEAU) {

        height += 22;

    }

    if (biome === BIOMES.DESERT) {

        height -= 3;

    }

    if (biome === BIOMES.SWAMP) {

        height = -4 +
            terrainNoise(x, 600) * 5;

    }

    return Math.floor(
        base - height
    );
}

/* =========================================================
   ÁRVORES
========================================================= */

function getTreeType(biome) {

    if (
        biome === BIOMES.BIRCH_FOREST
    ) return "birch";

    if (
        biome === BIOMES.TAIGA ||
        biome === BIOMES.PINE_FOREST ||
        biome === BIOMES.SNOW_TAIGA
    ) return "pine";

    if (
        biome === BIOMES.JUNGLE
    ) return "jungle";

    if (
        biome === BIOMES.SAVANNA
    ) return "acacia";

    if (
        biome === BIOMES.DENSE_FOREST
    ) return "dark";

    if (
        biome === BIOMES.FOREST
    ) return "oak";

    return null;
}

function treeData(type) {

    const data = {

        oak: {
            height: 5,
            radius: 2,
            wood: BLOCK.OAK_WOOD,
            leaves: BLOCK.OAK_LEAVES
        },

        birch: {
            height: 7,
            radius: 2,
            wood: BLOCK.BIRCH_WOOD,
            leaves: BLOCK.BIRCH_LEAVES
        },

        pine: {
            height: 9,
            radius: 2,
            wood: BLOCK.PINE_WOOD,
            leaves: BLOCK.PINE_LEAVES
        },

        jungle: {
            height: 14,
            radius: 3,
            wood: BLOCK.JUNGLE_WOOD,
            leaves: BLOCK.JUNGLE_LEAVES
        },

        acacia: {
            height: 6,
            radius: 3,
            wood: BLOCK.ACACIA_WOOD,
            leaves: BLOCK.ACACIA_LEAVES
        },

        dark: {
            height: 8,
            radius: 3,
            wood: BLOCK.DARK_WOOD,
            leaves: BLOCK.DARK_LEAVES
        }

    };

    return data[type];
}

function hasTree(x) {

    const biome =
        getBiome(x);

    const type =
        getTreeType(biome);

    if (!type) return false;

    const spacing =
        Math.floor(x / 8);

    const h =
        hash(spacing, 77);

    return h > .78;
}

/* =========================================================
   ÁGUA / TERRENO
========================================================= */

function isWaterAt(x, y) {

    const surface =
        getSurfaceY(x);

    return (
        y >= surface &&
        surface >= SEA_LEVEL
    );
}

function proceduralBlock(x, y) {

    const key =
        `${x},${y}`;

    if (modifiedBlocks.has(key)) {

        return modifiedBlocks.get(key);
    }

    if (y < 0) return BLOCK.AIR;

    const surface =
        getSurfaceY(x);

    const biome =
        getBiome(x);

    /* ÁGUA */

    if (
        surface >= SEA_LEVEL &&
        y >= SEA_LEVEL &&
        y <= surface
    ) {

        return BLOCK.WATER;
    }

    /* ACIMA DO SOLO */

    if (y < surface) {

        if (
            biome === BIOMES.SNOW_MOUNTAIN ||
            biome === BIOMES.SNOW_TAIGA ||
            biome === BIOMES.TUNDRA
        ) {

            return BLOCK.SNOW;
        }

        return BLOCK.AIR;
    }

    /* SOLO */

    if (y === surface) {

        if (
            biome === BIOMES.DESERT ||
            biome === BIOMES.BEACH ||
            biome === BIOMES.MESA
        ) {

            return BLOCK.SAND;
        }

        if (
            biome === BIOMES.SWAMP
        ) {

            return BLOCK.MUD;
        }

        if (
            biome === BIOMES.MOUNTAIN ||
            biome === BIOMES.ROCKY_COAST
        ) {

            return BLOCK.STONE;
        }

        if (
            biome === BIOMES.SNOW_MOUNTAIN ||
            biome === BIOMES.SNOW_TAIGA ||
            biome === BIOMES.TUNDRA
        ) {

            return BLOCK.SNOW;
        }

        return BLOCK.GRASS;
    }

    /* SUBSOLO */

    if (
        y < surface + 4
    ) {

        if (
            biome === BIOMES.DESERT ||
            biome === BIOMES.BEACH ||
            biome === BIOMES.MESA
        ) {

            return BLOCK.SAND;
        }

        if (
            biome === BIOMES.SWAMP
        ) {

            return BLOCK.MUD;
        }

        return BLOCK.DIRT;
    }

    /* PEDRA */

    const ore =
        hash(x * 13, y * 7);

    if (
        y > surface + 8 &&
        ore > .995
    ) {

        return BLOCK.DIAMOND;
    }

    if (
        y > surface + 5 &&
        ore > .98
    ) {

        return BLOCK.GOLD;
    }

    if (
        y > surface + 4 &&
        ore > .94
    ) {

        return BLOCK.IRON;
    }

    if (
        y > surface + 3 &&
        ore > .90
    ) {

        return BLOCK.COAL;
    }

    return BLOCK.STONE;
}

/* =========================================================
   ÁRVORES PROCEDURAIS
========================================================= */

function getTreeBlock(x, y) {

    const biome =
        getBiome(x);

    const type =
        getTreeType(biome);

    if (!type) return null;

    const data =
        treeData(type);

    if (!hasTree(x)) return null;

    const surface =
        getSurfaceY(x);

    const h =
        data.height;

    const baseY =
        surface - h;

    if (
        y >= baseY &&
        y < surface
    ) {

        return data.wood;
    }

    const centerY =
        surface - h;

    const distance =
        Math.abs(x);

    if (
        y >= centerY - 2 &&
        y <= centerY + 2 &&
        distance <= data.radius
    ) {

        return data.leaves;
    }

    return null;
}

/* =========================================================
   BLOCO FINAL
========================================================= */

function getBlock(x, y) {

    const tree =
        getTreeBlock(x, y);

    if (tree !== null) {

        return tree;
    }

    return proceduralBlock(x, y);
}

/* =========================================================
   SOLIDEZ
========================================================= */

function isSolid(block) {

    return (
        block !== BLOCK.AIR &&
        block !== BLOCK.WATER &&
        block !== BLOCK.OAK_LEAVES &&
        block !== BLOCK.BIRCH_LEAVES &&
        block !== BLOCK.PINE_LEAVES &&
        block !== BLOCK.JUNGLE_LEAVES &&
        block !== BLOCK.ACACIA_LEAVES &&
        block !== BLOCK.DARK_LEAVES
    );
}

/* =========================================================
   JOGADOR
========================================================= */

const player = {

    x: 0,
    y: 50,

    width: .7,
    height: 1.8,

    vx: 0,
    vy: 0,

    speed: 6.2,
    jump: 11,

    health: 100,
    hunger: 20,

    onGround: false,

    facing: 1
};

const keys = {};

window.addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

    if (
        ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "]
        .includes(e.key)
    ) {

        e.preventDefault();
    }

    if (
        e.key.toLowerCase() === "e" &&
        !e.repeat
    ) {

        toggleInventory();
    }

    if (
        e.key === "Escape" ||
        e.key.toLowerCase() === "p"
    ) {

        togglePause();
    }

    if (
        e.key >= "1" &&
        e.key <= "9"
    ) {

        selectedSlot =
            Number(e.key) - 1;

        updateHotbar();
    }

});

window.addEventListener("keyup", e => {

    keys[e.key.toLowerCase()] = false;

});

/* =========================================================
   COLISÃO
========================================================= */

function collides(px, py) {

    const left =
        Math.floor(px - player.width / 2);

    const right =
        Math.floor(px + player.width / 2);

    const top =
        Math.floor(py);

    const bottom =
        Math.floor(py + player.height);

    for (
        let x = left;
        x <= right;
        x++
    ) {

        for (
            let y = top;
            y <= bottom;
            y++
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

/* =========================================================
   ÁGUA
========================================================= */

function playerInWater() {

    const centerX =
        Math.floor(player.x);

    const centerY =
        Math.floor(
            player.y + player.height * .5
        );

    return (
        getBlock(centerX, centerY) ===
        BLOCK.WATER
    );
}

function updatePlayer(dt) {

    const water =
        playerInWater();

    let direction = 0;

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        direction -= 1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        direction += 1;
    }

    player.vx =
        direction * (
            water
                ? player.speed * .7
                : player.speed
        );

    if (direction !== 0) {

        player.facing = direction;
    }

    if (water) {

        /* NATAÇÃO */

        player.vy += 4 * dt;

        if (
            keys[" "] ||
            keys["space"]
        ) {

            player.vy -= 18 * dt;

        }

        player.vy =
            Math.max(
                -7,
                Math.min(
                    player.vy,
                    6
                )
            );

    } else {

        /* GRAVIDADE NORMAL */

        player.vy += 25 * dt;

        if (
            (
                keys[" "] ||
                keys["space"]
            ) &&
            player.onGround
        ) {

            player.vy =
                -player.jump;

            player.onGround = false;
        }

    }

    /* HORIZONTAL */

    const newX =
        player.x +
        player.vx * dt;

    if (!collides(newX, player.y)) {

        player.x = newX;
    }

    /* VERTICAL */

    const newY =
        player.y +
        player.vy * dt;

    if (!collides(player.x, newY)) {

        player.y = newY;
        player.onGround = false;

    } else {

        if (player.vy > 0) {

            player.onGround = true;
        }

        player.vy = 0;

    }

    if (
        player.y > WORLD_HEIGHT
    ) {

        respawnPlayer();
    }

}

/* =========================================================
   SPAWN ALEATÓRIO
========================================================= */

function respawnPlayer() {

    for (let i = 0; i < 300; i++) {

        const x =
            Math.floor(
                WORLD_MIN_X +
                5000 +
                Math.random() *
                (
                    WORLD_MAX_X -
                    WORLD_MIN_X -
                    10000
                )
            );

        const biome =
            getBiome(x);

        const surface =
            getSurfaceY(x);

        if (
            surface < SEA_LEVEL - 2 &&
            biome !== BIOMES.MOUNTAIN &&
            biome !== BIOMES.SNOW_MOUNTAIN
        ) {

            player.x = x;
            player.y = surface - player.height - 2;

            if (
                !collides(
                    player.x,
                    player.y
                )
            ) {

                return;
            }

        }

    }

    player.x = 0;
    player.y =
        getSurfaceY(0) - 3;

}

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

}

/* =========================================================
   DESENHO DO MUNDO
========================================================= */

function blockColor(block) {

    switch (block) {

        case BLOCK.GRASS:
            return "#55a63b";

        case BLOCK.DIRT:
            return "#87552f";

        case BLOCK.STONE:
            return "#777";

        case BLOCK.SAND:
            return "#d7c27d";

        case BLOCK.WATER:
            return "#3d86d6";

        case BLOCK.SNOW:
            return "#e9f5ff";

        case BLOCK.MUD:
            return "#5c4935";

        case BLOCK.OAK_WOOD:
            return "#81502d";

        case BLOCK.BIRCH_WOOD:
            return "#d9d0ad";

        case BLOCK.PINE_WOOD:
            return "#60462c";

        case BLOCK.JUNGLE_WOOD:
            return "#6e4128";

        case BLOCK.ACACIA_WOOD:
            return "#a76c3f";

        case BLOCK.DARK_WOOD:
            return "#452d20";

        case BLOCK.OAK_LEAVES:
        case BLOCK.BIRCH_LEAVES:
        case BLOCK.PINE_LEAVES:
        case BLOCK.JUNGLE_LEAVES:
        case BLOCK.ACACIA_LEAVES:
        case BLOCK.DARK_LEAVES:
            return "#398c42";

        case BLOCK.COAL:
            return "#242424";

        case BLOCK.IRON:
            return "#bcbcbc";

        case BLOCK.GOLD:
            return "#e2bd36";

        case BLOCK.DIAMOND:
            return "#38d9d1";

        case BLOCK.GRAVEL:
            return "#777";

        case BLOCK.ICE:
            return "#9ed8f0";

        case BLOCK.CACTUS:
            return "#39943b";

        default:
            return "#111";
    }
}

function drawBlock(block, x, y) {

    const sx =
        x * TILE -
        cameraX;

    const sy =
        y * TILE -
        cameraY;

    ctx.fillStyle =
        blockColor(block);

    ctx.fillRect(
        sx,
        sy,
        TILE + 1,
        TILE + 1
    );

    /* textura */

    if (
        block === BLOCK.GRASS
    ) {

        ctx.fillStyle =
            "#78c74f";

        ctx.fillRect(
            sx,
            sy,
            TILE,
            5
        );

    }

    if (
        block === BLOCK.STONE
    ) {

        ctx.fillStyle =
            "rgba(255,255,255,.08)";

        ctx.fillRect(
            sx + 4,
            sy + 7,
            5,
            4
        );

        ctx.fillRect(
            sx + 20,
            sy + 18,
            6,
            4
        );

    }

    if (
        block === BLOCK.WATER
    ) {

        ctx.fillStyle =
            "rgba(255,255,255,.18)";

        ctx.fillRect(
            sx,
            sy + 5,
            TILE,
            2
        );
    }

    if (
        block === BLOCK.OAK_WOOD ||
        block === BLOCK.BIRCH_WOOD ||
        block === BLOCK.PINE_WOOD ||
        block === BLOCK.JUNGLE_WOOD ||
        block === BLOCK.ACACIA_WOOD ||
        block === BLOCK.DARK_WOOD
    ) {

        ctx.strokeStyle =
            "rgba(0,0,0,.25)";

        ctx.beginPath();

        ctx.moveTo(
            sx + TILE / 2,
            sy
        );

        ctx.lineTo(
            sx + TILE / 2,
            sy + TILE
        );

        ctx.stroke();

    }

}

function drawWorld() {

    const startX =
        Math.floor(cameraX / TILE) - 2;

    const endX =
        Math.ceil(
            (cameraX + W) / TILE
        ) + 2;

    const startY =
        Math.floor(cameraY / TILE) - 2;

    const endY =
        Math.ceil(
            (cameraY + H) / TILE
        ) + 2;

    for (
        let x = startX;
        x <= endX;
        x++
    ) {

        if (
            x < WORLD_MIN_X ||
            x > WORLD_MAX_X
        ) continue;

        for (
            let y = Math.max(0,startY);
            y <= Math.min(WORLD_HEIGHT,endY);
            y++
        ) {

            const block =
                getBlock(x, y);

            if (
                block !== BLOCK.AIR
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

/* =========================================================
   JOGADOR
========================================================= */

function drawPlayer() {

    const x =
        player.x * TILE -
        cameraX;

    const y =
        player.y * TILE -
        cameraY;

    const width =
        player.width * TILE;

    const height =
        player.height * TILE;

    /* pernas */

    ctx.fillStyle = "#303b67";

    ctx.fillRect(
        x - width / 2,
        y + height * .55,
        width * .45,
        height * .45
    );

    ctx.fillRect(
        x + width * .02,
        y + height * .55,
        width * .45,
        height * .45
    );

    /* corpo */

    ctx.fillStyle = "#2d8ac7";

    ctx.fillRect(
        x - width / 2,
        y + height * .25,
        width,
        height * .38
    );

    /* braços */

    ctx.fillStyle = "#c99170";

    ctx.fillRect(
        x - width * .75,
        y + height * .27,
        width * .25,
        height * .35
    );

    ctx.fillRect(
        x + width * .50,
        y + height * .27,
        width * .25,
        height * .35
    );

    /* cabeça */

    ctx.fillStyle = "#c99170";

    ctx.fillRect(
        x - width * .48,
        y,
        width * .96,
        height * .27
    );

    /* cabelo */

    ctx.fillStyle = "#4b2d1e";

    ctx.fillRect(
        x - width * .48,
        y,
        width * .96,
        height * .08
    );

    /* item segurado */

    const stack =
        inventory[27 + selectedSlot];

    if (stack) {

        drawWorldHandItem(
            stack.id,
            x,
            y + height * .45
        );

    }

}

function drawWorldHandItem(
    itemId,
    x,
    y
) {

    const item =
        ITEMS[itemId];

    if (!item) return;

    if (
        item.type !== "pickaxe" &&
        item.type !== "axe" &&
        item.type !== "shovel" &&
        item.type !== "hoe" &&
        item.type !== "weapon"
    ) {

        return;
    }

    ctx.save();

    ctx.translate(
        x + player.facing * 15,
        y
    );

    ctx.scale(
        player.facing,
        1
    );

    drawTool(
        ctx,
        0,
        0,
        45,
        item.type,
        item.material
    );

    ctx.restore();
}

/* =========================================================
   CÉU / DIA E NOITE
========================================================= */

const DAY_LENGTH =
    15 * 60 * 1000;

const NIGHT_LENGTH =
    15 * 60 * 1000;

const FULL_DAY =
    DAY_LENGTH +
    NIGHT_LENGTH;

let worldTime = 0;

function drawSky() {

    const phase =
        worldTime / FULL_DAY;

    let brightness = 1;

    if (phase < .5) {

        brightness =
            .25 +
            Math.sin(
                phase * Math.PI * 2
            ) * .75;

    } else {

        brightness =
            .25 +
            Math.sin(
                phase * Math.PI * 2
            ) * .75;

        brightness =
            Math.max(
                .12,
                brightness
            );
    }

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        `rgb(${Math.floor(35*brightness+10)},
             ${Math.floor(110*brightness+20)},
             ${Math.floor(190*brightness+30)})`
    );

    gradient.addColorStop(
        1,
        `rgb(${Math.floor(80*brightness+20)},
             ${Math.floor(170*brightness+30)},
             ${Math.floor(220*brightness+30)})`
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

}

function drawNightOverlay() {

    const half =
        FULL_DAY / 2;

    let darkness = 0;

    if (
        worldTime > DAY_LENGTH
    ) {

        darkness =
            Math.min(
                .72,
                (
                    worldTime -
                    DAY_LENGTH
                ) /
                NIGHT_LENGTH *
                .72
            );

    } else {

        darkness =
            Math.max(
                0,
                .72 -
                (
                    worldTime /
                    DAY_LENGTH
                ) *
                .72
            );

    }

    ctx.fillStyle =
        `rgba(5,10,30,${darkness})`;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

}

/* =========================================================
   GAME LOOP
========================================================= */

let lastTime =
    performance.now();

function gameLoop(now) {

    const dt =
        Math.min(
            .05,
            (now - lastTime) / 1000
        );

    lastTime = now;

    if (
        !paused &&
        !inventoryOpen
    ) {

        worldTime =
            (
                worldTime +
                dt * 1000
            ) % FULL_DAY;

        updatePlayer(dt);

    }

    draw();

    requestAnimationFrame(
        gameLoop
    );
}

function draw() {

    drawSky();

    updateCamera();

    drawWorld();

    drawPlayer();

    drawNightOverlay();

    updateHUD();

}

/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    document.getElementById(
        "health"
    ).textContent =
        Math.round(player.health);

    document.getElementById(
        "hunger"
    ).textContent =
        Math.round(player.hunger);

    document.getElementById(
        "healthBar"
    ).style.width =
        player.health + "%";

    document.getElementById(
        "hungerBar"
    ).style.width =
        (player.hunger / 20 * 100) + "%";

    document.getElementById(
        "posX"
    ).textContent =
        Math.floor(player.x);

    document.getElementById(
        "posY"
    ).textContent =
        Math.floor(player.y);

    document.getElementById(
        "timeText"
    ).textContent =
        worldTime < DAY_LENGTH
            ? "Dia"
            : "Noite";
}

/* =========================================================
   MOUSE
========================================================= */

canvas.addEventListener(
    "mousedown",
    e => {

        if (
            inventoryOpen ||
            paused
        ) return;

        if (e.button === 0) {

            breakOrAttack();
        }

        if (e.button === 2) {

            useSelectedItem();
        }

    }
);

canvas.addEventListener(
    "contextmenu",
    e => e.preventDefault()
);

function mouseWorldPosition(e) {

    return {

        x: Math.floor(
            (
                e.clientX +
                cameraX
            ) / TILE
        ),

        y: Math.floor(
            (
                e.clientY +
                cameraY
            ) / TILE
        )

    };
}

/* =========================================================
   QUEBRAR / ATACAR
========================================================= */

function breakOrAttack() {

    const e =
        window.event;

    if (!e) return;

    const pos =
        mouseWorldPosition(e);

    const block =
        getBlock(
            pos.x,
            pos.y
        );

    if (
        block === BLOCK.AIR ||
        block === BLOCK.WATER
    ) return;

    const item =
        inventory[
            27 + selectedSlot
        ];

    let speed = 1;

    if (
        item &&
        ITEMS[item.id]
    ) {

        const tool =
            ITEMS[item.id];

        if (
            tool.type === "pickaxe" &&
            (
                block === BLOCK.STONE ||
                block === BLOCK.COAL ||
                block === BLOCK.IRON ||
                block === BLOCK.GOLD ||
                block === BLOCK.DIAMOND
            )
        ) {

            speed = 4;
        }

        if (
            tool.type === "axe" &&
            (
                block === BLOCK.OAK_WOOD ||
                block === BLOCK.BIRCH_WOOD ||
                block === BLOCK.PINE_WOOD ||
                block === BLOCK.JUNGLE_WOOD ||
                block === BLOCK.ACACIA_WOOD ||
                block === BLOCK.DARK_WOOD
            )
        ) {

            speed = 5;
        }

        if (
            tool.type === "shovel" &&
            (
                block === BLOCK.DIRT ||
                block === BLOCK.SAND ||
                block === BLOCK.GRAVEL ||
                block === BLOCK.MUD
            )
        ) {

            speed = 5;
        }

    }

    damageBlock(
        pos.x,
        pos.y,
        speed
    );

}

function damageBlock(x, y, speed) {

    modifiedBlocks.set(
        `${x},${y}`,
        BLOCK.AIR
    );

    const block =
        getBlock(x, y);

    let itemId = null;

    switch (block) {

        case BLOCK.GRASS:
            itemId = "grass";
            break;

        case BLOCK.DIRT:
            itemId = "dirt";
            break;

        case BLOCK.STONE:
            itemId = "stone";
            break;

        case BLOCK.OAK_WOOD:
            itemId = "oak_log";
            break;

        case BLOCK.BIRCH_WOOD:
            itemId = "birch_log";
            break;

        case BLOCK.PINE_WOOD:
            itemId = "pine_log";
            break;

        case BLOCK.JUNGLE_WOOD:
            itemId = "jungle_log";
            break;

        case BLOCK.ACACIA_WOOD:
            itemId = "acacia_log";
            break;

        case BLOCK.DARK_WOOD:
            itemId = "dark_log";
            break;

        case BLOCK.SAND:
            itemId = "sand";
            break;

        case BLOCK.GRAVEL:
            itemId = "gravel";
            break;

        case BLOCK.COAL:
            itemId = "coal";
            break;

        case BLOCK.IRON:
            itemId = "iron";
            break;

        case BLOCK.GOLD:
            itemId = "gold";
            break;

        case BLOCK.DIAMOND:
            itemId = "diamond";
            break;
    }

    if (itemId) {

        addItem(
            itemId,
            1
        );

    }

    /* desgaste */

    const stack =
        inventory[
            27 + selectedSlot
        ];

    if (
        stack &&
        ITEMS[stack.id] &&
        ITEMS[stack.id].durability
    ) {

        if (
            stack.durability === null
        ) {

            stack.durability =
                ITEMS[stack.id].durability;
        }

        stack.durability -= 1;

        if (
            stack.durability <= 0
        ) {

            inventory[
                27 + selectedSlot
            ] = null;

            showMessage(
                "Sua ferramenta quebrou!"
            );

        }

    }

    updateInventoryUI();
}

/* =========================================================
   USAR ITEM
========================================================= */

function useSelectedItem() {

    const index =
        27 + selectedSlot;

    const stack =
        inventory[index];

    if (!stack) return;

    const item =
        ITEMS[stack.id];

    if (!item) return;

    if (
        item.type === "weapon"
    ) {

        showMessage(
            item.name
        );

        return;
    }

    if (
        item.type === "block" ||
        item.type === "blockItem"
    ) {

        placeBlock();

    }

}

function placeBlock() {

    const stack =
        inventory[
            27 + selectedSlot
        ];

    if (!stack) return;

    const item =
        ITEMS[stack.id];

    if (
        !item.block
    ) return;

    const x =
        Math.floor(
            player.x +
            player.facing
        );

    const y =
        Math.floor(
            player.y +
            1
        );

    if (
        getBlock(x, y) ===
        BLOCK.AIR
    ) {

        modifiedBlocks.set(
            `${x},${y}`,
            item.block
        );

        stack.count--;

        if (
            stack.count <= 0
        ) {

            inventory[
                27 + selectedSlot
            ] = null;
        }

        updateInventoryUI();
    }
}

/* =========================================================
   COMIDA
========================================================= */

function isFood() {
    return false;
}

function eatFood(index) {

    if (
        player.hunger >= 20
    ) return;

    player.hunger =
        Math.min(
            20,
            player.hunger + 5
        );

    inventory[index].count--;

    if (
        inventory[index].count <= 0
    ) {

        inventory[index] = null;
    }

    updateInventoryUI();
}

/* =========================================================
   INVENTÁRIO / PAUSA
========================================================= */

let inventoryOpen = false;
let paused = false;

function toggleInventory() {

    inventoryOpen =
        !inventoryOpen;

    inventoryOverlay.classList.toggle(
        "open",
        inventoryOpen
    );

    if (inventoryOpen) {

        paused = false;

        document
            .getElementById("pauseMenu")
            .classList.remove("open");

        updateInventoryUI();
    }

}

function togglePause() {

    if (inventoryOpen) return;

    paused = !paused;

    document
        .getElementById("pauseMenu")
        .classList.toggle(
            "open",
            paused
        );

}

document
    .getElementById("closeInventory")
    .addEventListener(
        "click",
        () => {

            inventoryOpen = false;

            inventoryOverlay.classList.remove(
                "open"
            );

        }
    );

document
    .getElementById("resumeButton")
    .addEventListener(
        "click",
        () => {

            paused = false;

            document
                .getElementById("pauseMenu")
                .classList.remove("open");

        }
    );

document
    .getElementById("pauseInventoryButton")
    .addEventListener(
        "click",
        () => {

            paused = false;
            toggleInventory();

        }
    );

/* =========================================================
   NOVO MUNDO
========================================================= */

document
    .getElementById("reloadButton")
    .addEventListener(
        "click",
        () => {

            newWorld();

        }
    );

function newWorld() {

    worldSeed =
        Math.floor(
            Math.random() *
            1000000000
        );

    modifiedBlocks.clear();

    inventory =
        new Array(36).fill(null);

    crafting.fill(null);

    player.health = 100;
    player.hunger = 20;

    player.vx = 0;
    player.vy = 0;

    worldTime = 0;

    respawnPlayer();

    updateInventoryUI();

    paused = false;

    document
        .getElementById("pauseMenu")
        .classList.remove("open");

    showMessage(
        "Novo mundo criado!"
    );
}

/* =========================================================
   MENSAGENS
========================================================= */

let messageTimer = null;

function showMessage(text) {

    const message =
        document.getElementById(
            "message"
        );

    message.textContent =
        text;

    message.style.opacity = "1";

    clearTimeout(
        messageTimer
    );

    messageTimer =
        setTimeout(() => {

            message.style.opacity =
                "0";

        }, 1800);
}

/* =========================================================
   CRAFT SLOTS
========================================================= */

document
    .querySelectorAll(".craft-slot")
    .forEach((slot, index) => {

        slot.addEventListener(
            "click",
            () => {

                if (
                    crafting[index]
                ) {

                    addItem(
                        crafting[index].id,
                        crafting[index].count
                    );

                    crafting[index] = null;

                    updateCraftUI();

                }

            }
        );

    });

document
    .getElementById("craftResult")
    .addEventListener(
        "click",
        () => {

            craftItem();

        }
    );

/* =========================================================
   PERSONAGEM
========================================================= */

function drawCharacter() {

    const c =
        document.getElementById(
            "characterCanvas"
        );

    const context =
        setupCanvas(c);

    const rect =
        c.getBoundingClientRect();

    const x =
        rect.width / 2;

    const y =
        rect.height / 2;

    context.clearRect(
        0,
        0,
        rect.width,
        rect.height
    );

    context.fillStyle =
        "#2d8ac7";

    context.fillRect(
        x - 35,
        y - 10,
        70,
        85
    );

    context.fillStyle =
        "#c99170";

    context.fillRect(
        x - 30,
        y - 75,
        60,
        60
    );

    context.fillStyle =
        "#4b2d1e";

    context.fillRect(
        x - 30,
        y - 75,
        60,
        18
    );

    context.fillStyle =
        "#303b67";

    context.fillRect(
        x - 32,
        y + 75,
        27,
        70
    );

    context.fillRect(
        x + 5,
        y + 75,
        27,
        70
    );

}

drawCharacter();

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

respawnPlayer();

updateInventoryUI();

requestAnimationFrame(
    gameLoop
);
