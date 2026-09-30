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
   IMPORTANTE:
   A GERAÇÃO DO MAPA NÃO FOI ALTERADA
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

    CACTUS: 26,

    /* Novo bloco criado apenas para a enxada.
       Não interfere na geração original do mapa. */
    FARMLAND: 27
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
    [BLOCK.CACTUS]: "Cacto",

    [BLOCK.FARMLAND]: "Terra Arada"
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

    /* =====================================================
       ESPADAS
    ===================================================== */

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

    /* =====================================================
       PICARETAS
    ===================================================== */

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

    /* =====================================================
       MACHADOS
    ===================================================== */

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

    /* =====================================================
       PÁS
    ===================================================== */

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

    /* =====================================================
       ENXADAS
    ===================================================== */

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

/* Crafting do inventário continua 2x2.
   Somente receitas básicas serão permitidas aqui. */

let crafting = [
    null,
    null,
    null,
    null
];

/* Crafting Table usa uma grade separada 3x3. */

let tableCrafting = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let craftingTableOpen = false;

/* =========================================================
   ESTADO DA MINERAÇÃO
========================================================= */

let mining = {

    active: false,

    x: 0,
    y: 0,

    progress: 0,

    hardness: 1,

    speed: 1

};

let mouseDown = false;

let mouseX = 0;
let mouseY = 0;

/* =========================================================
   CRIAÇÃO DE STACK
========================================================= */

function createStack(id, count) {

    if (!ITEMS[id]) {
        return null;
    }

    return {

        id,

        count,

        durability:
            ITEMS[id].durability || null

    };
   
}
/* =========================================================
   RECEITAS BÁSICAS DO INVENTÁRIO
   O INVENTÁRIO NÃO FABRICA FERRAMENTAS
========================================================= */

const basicRecipes = [

    {
        name: "Tábuas",
        pattern: [
            "log"
        ],
        result: "plank",
        amount: 4
    },

    {
        name: "Gravetos",
        pattern: [
            "plank",
            "plank"
        ],
        result: "stick",
        amount: 4
    }

];

/* =========================================================
   RECEITAS DA MESA DE TRABALHO
   GRADE 3x3
========================================================= */

const tableRecipes = [

    /* -----------------------------------------------------
       MESA DE TRABALHO
    ----------------------------------------------------- */

    {
        name: "Mesa de Trabalho",
        pattern: [
            "plank", "plank", "empty",
            "plank", "plank", "empty",
            "empty", "empty", "empty"
        ],
        result: "crafting_table",
        amount: 1
    },

    /* -----------------------------------------------------
       ESPADAS
    ----------------------------------------------------- */

    {
        name: "Espada de Madeira",
        pattern: [
            "plank", "empty", "empty",
            "plank", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "wooden_sword",
        amount: 1
    },

    {
        name: "Espada de Pedra",
        pattern: [
            "stone", "empty", "empty",
            "stone", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "stone_sword",
        amount: 1
    },

    {
        name: "Espada de Ferro",
        pattern: [
            "iron", "empty", "empty",
            "iron", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "iron_sword",
        amount: 1
    },

    {
        name: "Espada de Ouro",
        pattern: [
            "gold", "empty", "empty",
            "gold", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "gold_sword",
        amount: 1
    },

    {
        name: "Espada de Diamante",
        pattern: [
            "diamond", "empty", "empty",
            "diamond", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "diamond_sword",
        amount: 1
    },

    /* -----------------------------------------------------
       PICARETAS
    ----------------------------------------------------- */

    {
        name: "Picareta de Madeira",
        pattern: [
            "plank", "plank", "plank",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "wooden_pickaxe",
        amount: 1
    },

    {
        name: "Picareta de Pedra",
        pattern: [
            "stone", "stone", "stone",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "stone_pickaxe",
        amount: 1
    },

    {
        name: "Picareta de Ferro",
        pattern: [
            "iron", "iron", "iron",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "iron_pickaxe",
        amount: 1
    },

    {
        name: "Picareta de Ouro",
        pattern: [
            "gold", "gold", "gold",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "gold_pickaxe",
        amount: 1
    },

    {
        name: "Picareta de Diamante",
        pattern: [
            "diamond", "diamond", "diamond",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "diamond_pickaxe",
        amount: 1
    },

    /* -----------------------------------------------------
       MACHADOS
    ----------------------------------------------------- */

    {
        name: "Machado de Madeira",
        pattern: [
            "plank", "plank", "empty",
            "plank", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "wooden_axe",
        amount: 1
    },

    {
        name: "Machado de Pedra",
        pattern: [
            "stone", "stone", "empty",
            "stone", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "stone_axe",
        amount: 1
    },

    {
        name: "Machado de Ferro",
        pattern: [
            "iron", "iron", "empty",
            "iron", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "iron_axe",
        amount: 1
    },

    {
        name: "Machado de Ouro",
        pattern: [
            "gold", "gold", "empty",
            "gold", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "gold_axe",
        amount: 1
    },

    {
        name: "Machado de Diamante",
        pattern: [
            "diamond", "diamond", "empty",
            "diamond", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "diamond_axe",
        amount: 1
    },

    /* -----------------------------------------------------
       PÁS
    ----------------------------------------------------- */

    {
        name: "Pá de Madeira",
        pattern: [
            "plank", "empty", "empty",
            "stick", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "wooden_shovel",
        amount: 1
    },

    {
        name: "Pá de Pedra",
        pattern: [
            "stone", "empty", "empty",
            "stick", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "stone_shovel",
        amount: 1
    },

    {
        name: "Pá de Ferro",
        pattern: [
            "iron", "empty", "empty",
            "stick", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "iron_shovel",
        amount: 1
    },

    {
        name: "Pá de Ouro",
        pattern: [
            "gold", "empty", "empty",
            "stick", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "gold_shovel",
        amount: 1
    },

    {
        name: "Pá de Diamante",
        pattern: [
            "diamond", "empty", "empty",
            "stick", "empty", "empty",
            "stick", "empty", "empty"
        ],
        result: "diamond_shovel",
        amount: 1
    },

    /* -----------------------------------------------------
       ENXADAS
    ----------------------------------------------------- */

    {
        name: "Enxada de Madeira",
        pattern: [
            "plank", "plank", "empty",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "wooden_hoe",
        amount: 1
    },

    {
        name: "Enxada de Pedra",
        pattern: [
            "stone", "stone", "empty",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "stone_hoe",
        amount: 1
    },

    {
        name: "Enxada de Ferro",
        pattern: [
            "iron", "iron", "empty",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "iron_hoe",
        amount: 1
    },

    {
        name: "Enxada de Ouro",
        pattern: [
            "gold", "gold", "empty",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "gold_hoe",
        amount: 1
    },

    {
        name: "Enxada de Diamante",
        pattern: [
            "diamond", "diamond", "empty",
            "empty", "stick", "empty",
            "empty", "stick", "empty"
        ],
        result: "diamond_hoe",
        amount: 1
    }

];

/* =========================================================
   CONVERSÃO DE MATERIAL
========================================================= */

function materialOfItem(id) {

    if (!id) {
        return "empty";
    }

    if (
        id === "oak_log" ||
        id === "birch_log" ||
        id === "pine_log" ||
        id === "jungle_log" ||
        id === "acacia_log" ||
        id === "dark_log"
    ) {
        return "log";
    }

    if (id === "plank") {
        return "plank";
    }

    if (id === "stick") {
        return "stick";
    }

    if (id === "stone") {
        return "stone";
    }

    if (id === "iron") {
        return "iron";
    }

    if (id === "gold") {
        return "gold";
    }

    if (id === "diamond") {
        return "diamond";
    }

    return id;
}

/* =========================================================
   COMPARADOR DE RECEITAS
========================================================= */

function samePattern(a, b) {

    if (!a || !b) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {

        if (a[i] !== b[i]) {
            return false;
        }

    }

    return true;
}

/* =========================================================
   RESULTADO DO CRAFTING DO INVENTÁRIO
========================================================= */

function getBasicCraftResult() {

    const pattern = crafting.map(stack => {

        if (!stack) {
            return "empty";
        }

        return materialOfItem(stack.id);

    });

    /*
       Inventário possui somente 2x2.
       Portanto só procuramos receitas básicas.
    */

    for (const recipe of basicRecipes) {

        /*
           Tábuas:
           qualquer slot com um LOG.

           Gravetos:
           dois slots contendo tábuas.
        */

        if (recipe.result === "plank") {

            if (pattern.includes("log")) {
                return recipe;
            }

        }

        if (recipe.result === "stick") {

            const plankCount =
                pattern.filter(v => v === "plank").length;

            if (plankCount >= 2) {
                return recipe;
            }

        }

    }

    return null;
}

/* =========================================================
   RESULTADO DA MESA DE TRABALHO
========================================================= */

function getTableCraftResult() {

    const pattern = tableCrafting.map(stack => {

        if (!stack) {
            return "empty";
        }

        return materialOfItem(stack.id);

    });

    for (const recipe of tableRecipes) {

        if (samePattern(pattern, recipe.pattern)) {
            return recipe;
        }

    }

    return null;
}

/* =========================================================
   CONSUMIR MATERIAIS DO CRAFTING
========================================================= */

function consumeCraftingMaterials(grid, recipe) {

    if (!recipe) {
        return false;
    }

    const used = [];

    for (let i = 0; i < grid.length; i++) {

        if (!grid[i]) {
            continue;
        }

        used.push(grid[i].id);

    }

    const required = {};

    for (const material of recipe.pattern) {

        if (material === "empty") {
            continue;
        }

        required[material] =
            (required[material] || 0) + 1;

    }

    const available = {};

    for (const id of used) {

        const material = materialOfItem(id);

        available[material] =
            (available[material] || 0) + 1;

    }

    for (const material in required) {

        if (
            !available[material] ||
            available[material] < required[material]
        ) {

            return false;

        }

    }

    return true;
}

/* =========================================================
   CRAFTING BÁSICO
========================================================= */

function craftBasicItem() {

    const recipe = getBasicCraftResult();

    if (!recipe) {

        showMessage("Receita inválida");

        return;

    }

    if (recipe.result === "plank") {

        let logIndex = -1;

        for (let i = 0; i < crafting.length; i++) {

            if (
                crafting[i] &&
                materialOfItem(crafting[i].id) === "log"
            ) {

                logIndex = i;
                break;

            }

        }

        if (logIndex === -1) {
            return;
        }

        const id = crafting[logIndex].id;

        crafting[logIndex] = null;

        removeItem(id, 1);

        addItem("plank", 4);

        updateInventoryUI();

        showMessage("4 tábuas criadas");

        return;
    }

    if (recipe.result === "stick") {

        let consumed = 0;

        for (let i = 0; i < crafting.length; i++) {

            if (
                crafting[i] &&
                materialOfItem(crafting[i].id) === "plank" &&
                consumed < 2
            ) {

                crafting[i] = null;

                consumed++;

            }

        }

        if (consumed < 2) {
            return;
        }

        removeItem("plank", 2);

        addItem("stick", 4);

        updateInventoryUI();

        showMessage("4 gravetos criados");
    }
}

/* =========================================================
   CRAFTING DA MESA
========================================================= */

function craftTableItem() {

    const recipe = getTableCraftResult();

    if (!recipe) {

        showMessage("Receita inválida");

        return;

    }

    if (
        !consumeCraftingMaterials(
            tableCrafting,
            recipe
        )
    ) {

        showMessage("Materiais insuficientes");

        return;

    }

    /*
       Consome exatamente os materiais necessários.
       Como as ferramentas usam uma unidade por
       posição da receita, basta remover uma unidade
       de cada material correspondente.
    */

    for (const material of recipe.pattern) {

        if (material === "empty") {
            continue;
        }

        let found = false;

        for (let i = 0; i < tableCrafting.length; i++) {

            const stack = tableCrafting[i];

            if (!stack) {
                continue;
            }

            if (
                materialOfItem(stack.id) === material
            ) {

                removeItem(stack.id, 1);

                stack.count--;

                if (stack.count <= 0) {
                    tableCrafting[i] = null;
                }

                found = true;

                break;
            }

        }

        if (!found) {
            return;
        }

    }

    addItem(
        recipe.result,
        recipe.amount
    );

    tableCrafting.fill(null);

    updateInventoryUI();

    updateCraftingTableUI();

    showMessage(
        "Criado: " +
        ITEMS[recipe.result].name
    );
}

/* =========================================================
   ADICIONAR ITEM
========================================================= */

function addItem(id, amount = 1) {

    const item = ITEMS[id];

    if (!item) {
        return false;
    }

    let remaining = amount;

    /* Primeiro tenta completar pilhas existentes */

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

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

    /* Depois procura espaços vazios */

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

        if (!inventory[i]) {

            const amountHere =
                Math.min(
                    remaining,
                    item.stack
                );

            inventory[i] =
                createStack(
                    id,
                    amountHere
                );

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

/* =========================================================
   REMOVER ITEM
========================================================= */

function removeItem(id, amount = 1) {

    let remaining = amount;

    for (
        let i = 0;
        i < inventory.length;
        i++
    ) {

        const slot = inventory[i];

        if (
            slot &&
            slot.id === id
        ) {

            const take =
                Math.min(
                    remaining,
                    slot.count
                );

            slot.count -= take;

            remaining -= take;

            if (slot.count <= 0) {
                inventory[i] = null;
            }

            if (remaining <= 0) {
                break;
            }

        }

    }

    updateInventoryUI();

    return remaining <= 0;
}

/* =========================================================
   VERIFICAR SE POSSUI ITEM
========================================================= */

function hasItem(id, amount = 1) {

    let total = 0;

    for (const stack of inventory) {

        if (
            stack &&
            stack.id === id
        ) {

            total += stack.count;

            if (total >= amount) {
                return true;
            }

        }

    }

    return false;
}

/* =========================================================
   MINERAÇÃO E CONTROLE DO MOUSE
========================================================= */

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

let mining = {
    active: false,
    x: 0,
    y: 0,
    progress: 0
};


/* =========================================================
   POSIÇÃO DO MOUSE NO MUNDO
========================================================= */

function mouseWorldPosition(e) {

    return {

        x: Math.floor(
            (e.clientX + cameraX) / TILE
        ),

        y: Math.floor(
            (e.clientY + cameraY) / TILE
        )

    };

}


/* =========================================================
   RESISTÊNCIA DOS BLOCOS
========================================================= */

function getBlockHardness(block) {

    switch (block) {

        case BLOCK.OAK_LEAVES:
        case BLOCK.BIRCH_LEAVES:
        case BLOCK.PINE_LEAVES:
        case BLOCK.JUNGLE_LEAVES:
        case BLOCK.ACACIA_LEAVES:
        case BLOCK.DARK_LEAVES:
            return 0.15;

        case BLOCK.DIRT:
        case BLOCK.GRASS:
        case BLOCK.SAND:
        case BLOCK.GRAVEL:
        case BLOCK.MUD:
        case BLOCK.SNOW:
            return 0.40;

        case BLOCK.OAK_WOOD:
        case BLOCK.BIRCH_WOOD:
        case BLOCK.PINE_WOOD:
        case BLOCK.JUNGLE_WOOD:
        case BLOCK.ACACIA_WOOD:
        case BLOCK.DARK_WOOD:
            return 0.60;

        case BLOCK.ICE:
            return 0.80;

        case BLOCK.STONE:
            return 1.80;

        case BLOCK.COAL:
            return 2.00;

        case BLOCK.GOLD:
            return 2.20;

        case BLOCK.IRON:
            return 2.40;

        case BLOCK.DIAMOND:
            return 3.00;

        case BLOCK.CACTUS:
            return 0.40;

        case BLOCK.FARMLAND:
            return 0.30;

        default:
            return 0.50;
    }

}


/* =========================================================
   VERIFICAÇÃO DAS FERRAMENTAS
========================================================= */

function isPickaxeBlock(block) {

    return (

        block === BLOCK.STONE ||
        block === BLOCK.COAL ||
        block === BLOCK.IRON ||
        block === BLOCK.GOLD ||
        block === BLOCK.DIAMOND ||
        block === BLOCK.GRAVEL ||
        block === BLOCK.ICE

    );

}


function isWoodBlock(block) {

    return (

        block === BLOCK.OAK_WOOD ||
        block === BLOCK.BIRCH_WOOD ||
        block === BLOCK.PINE_WOOD ||
        block === BLOCK.JUNGLE_WOOD ||
        block === BLOCK.ACACIA_WOOD ||
        block === BLOCK.DARK_WOOD ||

        block === BLOCK.OAK_LEAVES ||
        block === BLOCK.BIRCH_LEAVES ||
        block === BLOCK.PINE_LEAVES ||
        block === BLOCK.JUNGLE_LEAVES ||
        block === BLOCK.ACACIA_LEAVES ||
        block === BLOCK.DARK_LEAVES

    );

}


function isShovelBlock(block) {

    return (

        block === BLOCK.DIRT ||
        block === BLOCK.GRASS ||
        block === BLOCK.SAND ||
        block === BLOCK.GRAVEL ||
        block === BLOCK.MUD ||
        block === BLOCK.SNOW ||
        block === BLOCK.FARMLAND

    );

}


function isHoeBlock(block) {

    return (

        block === BLOCK.GRASS ||
        block === BLOCK.DIRT

    );

}


/* =========================================================
   VELOCIDADE DAS FERRAMENTAS
========================================================= */

function getToolSpeed(material, type) {

    const speeds = {

        wood: {
            pickaxe: 2.0,
            axe: 2.5,
            shovel: 2.0,
            hoe: 1.8
        },

        stone: {
            pickaxe: 3.5,
            axe: 3.5,
            shovel: 3.0,
            hoe: 2.5
        },

        iron: {
            pickaxe: 5.0,
            axe: 5.0,
            shovel: 5.0,
            hoe: 4.0
        },

        gold: {
            pickaxe: 7.0,
            axe: 7.0,
            shovel: 7.0,
            hoe: 6.0
        },

        diamond: {
            pickaxe: 8.0,
            axe: 8.0,
            shovel: 8.0,
            hoe: 7.0
        }

    };

    if (
        speeds[material] &&
        speeds[material][type]
    ) {

        return speeds[material][type];

    }

    return 1;

}


/* =========================================================
   EFICIÊNCIA DA FERRAMENTA
========================================================= */

function getMiningSpeed(block) {

    const stack =
        inventory[27 + selectedSlot];

    if (!stack) {

        return 0.55;

    }

    const item =
        ITEMS[stack.id];

    if (!item) {

        return 0.55;

    }

    let speed = 0.55;


    /* PICARETA */

    if (
        item.type === "pickaxe" &&
        isPickaxeBlock(block)
    ) {

        speed =
            getToolSpeed(
                item.material,
                "pickaxe"
            );

    }


    /* MACHADO */

    else if (
        item.type === "axe" &&
        isWoodBlock(block)
    ) {

        speed =
            getToolSpeed(
                item.material,
                "axe"
            );

    }


    /* PÁ */

    else if (
        item.type === "shovel" &&
        isShovelBlock(block)
    ) {

        speed =
            getToolSpeed(
                item.material,
                "shovel"
            );

    }


    /* ENXADA */

    else if (
        item.type === "hoe" &&
        isHoeBlock(block)
    ) {

        speed =
            getToolSpeed(
                item.material,
                "hoe"
            );

    }

    return speed;

}


/* =========================================================
   COMEÇAR MINERAÇÃO
========================================================= */

function startMining(e) {

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
    ) {

        mining.active = false;
        return;

    }


    /* distância máxima */

    const distance =
        Math.hypot(
            pos.x - player.x,
            pos.y - player.y
        );

    if (distance > 6) {

        mining.active = false;
        return;

    }


    /* novo bloco */

    if (
        !mining.active ||
        mining.x !== pos.x ||
        mining.y !== pos.y
    ) {

        mining.active = true;

        mining.x = pos.x;
        mining.y = pos.y;

        mining.progress = 0;

    }

}


/* =========================================================
   ATUALIZAR MINERAÇÃO
========================================================= */

function updateMining(dt) {

    if (!mouseDown) {

        mining.active = false;
        mining.progress = 0;

        return;

    }

    if (!mining.active) {

        return;

    }


    const block =
        getBlock(
            mining.x,
            mining.y
        );


    if (
        block === BLOCK.AIR ||
        block === BLOCK.WATER
    ) {

        mining.active = false;
        mining.progress = 0;

        return;

    }


    const distance =
        Math.hypot(
            mining.x - player.x,
            mining.y - player.y
        );


    if (distance > 6) {

        mining.active = false;
        mining.progress = 0;

        return;

    }


    const hardness =
        getBlockHardness(block);

    const speed =
        getMiningSpeed(block);


    mining.progress +=
        (dt * speed) / hardness;


    if (
        mining.progress >= 1
    ) {

        damageBlock(
            mining.x,
            mining.y
        );

        mining.active = false;
        mining.progress = 0;

    }

}


/* =========================================================
   QUEBRAR BLOCO
========================================================= */

function damageBlock(x, y) {

    /* PRIMEIRO descobrimos o bloco */

    const block =
        getBlock(x, y);


    if (
        block === BLOCK.AIR ||
        block === BLOCK.WATER
    ) {

        return;

    }


    /* DEPOIS removemos */

    modifiedBlocks.set(
        `${x},${y}`,
        BLOCK.AIR
    );


    /* =====================================================
       DROP
    ===================================================== */

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

        case BLOCK.CACTUS:
            itemId = "cactus";
            break;

        case BLOCK.FARMLAND:
            itemId = "dirt";
            break;

    }


    if (itemId) {

        addItem(
            itemId,
            1
        );

    }


    /* =====================================================
       DURABILIDADE
    ===================================================== */

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
            stack.durability === null ||
            stack.durability === undefined
        ) {

            stack.durability =
                ITEMS[stack.id].durability;

        }


        stack.durability--;


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
   MOUSE DOWN
========================================================= */

canvas.addEventListener(
    "mousedown",
    e => {

        if (
            inventoryOpen ||
            paused
        ) {

            return;

        }


        if (e.button === 0) {

            mouseDown = true;

            mouseX = e.clientX;
            mouseY = e.clientY;

            startMining(e);

        }


        if (e.button === 2) {

            useSelectedItem();

        }

    }
);


/* =========================================================
   MOUSE MOVE
========================================================= */

canvas.addEventListener(
    "mousemove",
    e => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        if (mouseDown) {

            startMining(e);

        }

    }
);


/* =========================================================
   MOUSE UP
========================================================= */

window.addEventListener(
    "mouseup",
    e => {

        if (e.button === 0) {

            mouseDown = false;

            mining.active = false;

            mining.progress = 0;

        }

    }
);


/* =========================================================
   MENU DE CONTEXTO
========================================================= */

canvas.addEventListener(
    "contextmenu",
    e => {

        e.preventDefault();

    }
);


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


    /* ARMA */

    if (
        item.type === "weapon"
    ) {

        showMessage(
            item.name
        );

        return;

    }


    /* ENXADA */

    if (
        item.type === "hoe"
    ) {

        tillTargetBlock();

        return;

    }


    /* BLOCOS */

    if (
        item.type === "block" ||
        item.type === "blockItem"
    ) {

        placeBlock();

    }

}


/* =========================================================
   USAR ENXADA
========================================================= */

function tillTargetBlock() {

    const x =
        Math.floor(
            player.x + player.facing
        );

    const y =
        Math.floor(
            player.y + 1
        );


    const block =
        getBlock(x, y);


    if (
        block !== BLOCK.GRASS &&
        block !== BLOCK.DIRT
    ) {

        return;

    }


    modifiedBlocks.set(
        `${x},${y}`,
        BLOCK.FARMLAND
    );


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
            stack.durability === null ||
            stack.durability === undefined
        ) {

            stack.durability =
                ITEMS[stack.id].durability;

        }


        stack.durability--;


        if (
            stack.durability <= 0
        ) {

            inventory[
                27 + selectedSlot
            ] = null;

            showMessage(
                "Sua enxada quebrou!"
            );

        }

    }


    updateInventoryUI();

}


/* =========================================================
   COLOCAR BLOCO
========================================================= */

function placeBlock() {

    const stack =
        inventory[
            27 + selectedSlot
        ];

    if (!stack) return;


    const item =
        ITEMS[stack.id];

    if (!item) return;

    if (!item.block) return;


    const x =
        Math.floor(
            player.x + player.facing
        );

    const y =
        Math.floor(
            player.y + 1
        );


    if (
        getBlock(x, y) !== BLOCK.AIR
    ) {

        return;

    }


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

/* =========================================================
   CRAFTING BÁSICO — INVENTÁRIO
   SOMENTE TÁBUAS E GRAVETOS
========================================================= */

const basicRecipes = [

    {
        pattern: ["log"],
        result: "plank",
        amount: 4
    },

    {
        pattern: ["plank", "plank"],
        result: "stick",
        amount: 4
    }

];


/* =========================================================
   RECEITAS DA MESA DE TRABALHO — 3x3
========================================================= */

const tableRecipes = [

    /* MESA */

    {
        pattern: [
            "plank","plank","empty",
            "plank","plank","empty",
            "empty","empty","empty"
        ],
        result: "crafting_table",
        amount: 1
    },


    /* ESPADAS */

    {
        pattern: [
            "plank","empty","empty",
            "plank","empty","empty",
            "stick","empty","empty"
        ],
        result: "wooden_sword",
        amount: 1
    },

    {
        pattern: [
            "stone","empty","empty",
            "stone","empty","empty",
            "stick","empty","empty"
        ],
        result: "stone_sword",
        amount: 1
    },

    {
        pattern: [
            "iron","empty","empty",
            "iron","empty","empty",
            "stick","empty","empty"
        ],
        result: "iron_sword",
        amount: 1
    },

    {
        pattern: [
            "gold","empty","empty",
            "gold","empty","empty",
            "stick","empty","empty"
        ],
        result: "gold_sword",
        amount: 1
    },

    {
        pattern: [
            "diamond","empty","empty",
            "diamond","empty","empty",
            "stick","empty","empty"
        ],
        result: "diamond_sword",
        amount: 1
    },


    /* PICARETAS */

    {
        pattern: [
            "plank","plank","plank",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "wooden_pickaxe",
        amount: 1
    },

    {
        pattern: [
            "stone","stone","stone",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "stone_pickaxe",
        amount: 1
    },

    {
        pattern: [
            "iron","iron","iron",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "iron_pickaxe",
        amount: 1
    },

    {
        pattern: [
            "gold","gold","gold",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "gold_pickaxe",
        amount: 1
    },

    {
        pattern: [
            "diamond","diamond","diamond",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "diamond_pickaxe",
        amount: 1
    },


    /* MACHADOS */

    {
        pattern: [
            "plank","plank","empty",
            "plank","stick","empty",
            "empty","stick","empty"
        ],
        result: "wooden_axe",
        amount: 1
    },

    {
        pattern: [
            "stone","stone","empty",
            "stone","stick","empty",
            "empty","stick","empty"
        ],
        result: "stone_axe",
        amount: 1
    },

    {
        pattern: [
            "iron","iron","empty",
            "iron","stick","empty",
            "empty","stick","empty"
        ],
        result: "iron_axe",
        amount: 1
    },

    {
        pattern: [
            "gold","gold","empty",
            "gold","stick","empty",
            "empty","stick","empty"
        ],
        result: "gold_axe",
        amount: 1
    },

    {
        pattern: [
            "diamond","diamond","empty",
            "diamond","stick","empty",
            "empty","stick","empty"
        ],
        result: "diamond_axe",
        amount: 1
    },


    /* PÁS */

    {
        pattern: [
            "plank","empty","empty",
            "stick","empty","empty",
            "stick","empty","empty"
        ],
        result: "wooden_shovel",
        amount: 1
    },

    {
        pattern: [
            "stone","empty","empty",
            "stick","empty","empty",
            "stick","empty","empty"
        ],
        result: "stone_shovel",
        amount: 1
    },

    {
        pattern: [
            "iron","empty","empty",
            "stick","empty","empty",
            "stick","empty","empty"
        ],
        result: "iron_shovel",
        amount: 1
    },

    {
        pattern: [
            "gold","empty","empty",
            "stick","empty","empty",
            "stick","empty","empty"
        ],
        result: "gold_shovel",
        amount: 1
    },

    {
        pattern: [
            "diamond","empty","empty",
            "stick","empty","empty",
            "stick","empty","empty"
        ],
        result: "diamond_shovel",
        amount: 1
    },


    /* ENXADAS */

    {
        pattern: [
            "plank","plank","empty",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "wooden_hoe",
        amount: 1
    },

    {
        pattern: [
            "stone","stone","empty",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "stone_hoe",
        amount: 1
    },

    {
        pattern: [
            "iron","iron","empty",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "iron_hoe",
        amount: 1
    },

    {
        pattern: [
            "gold","gold","empty",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "gold_hoe",
        amount: 1
    },

    {
        pattern: [
            "diamond","diamond","empty",
            "empty","stick","empty",
            "empty","stick","empty"
        ],
        result: "diamond_hoe",
        amount: 1
    }

];


/* =========================================================
   MATERIAL DO ITEM
========================================================= */

function materialOfItem(id) {

    if (!id) return "empty";

    if (id.includes("log")) {
        return "log";
    }

    if (id === "plank") {
        return "plank";
    }

    if (id === "stick") {
        return "stick";
    }

    if (id === "stone") {
        return "stone";
    }

    if (id === "iron") {
        return "iron";
    }

    if (id === "gold") {
        return "gold";
    }

    if (id === "diamond") {
        return "diamond";
    }

    return id;

}


/* =========================================================
   COMPARAR RECEITAS
========================================================= */

function samePattern(a, b) {

    if (!a || !b) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {

        if (a[i] !== b[i]) {
            return false;
        }

    }

    return true;

}


/* =========================================================
   CRAFTING DO INVENTÁRIO
========================================================= */

function getBasicCraftResult() {

    const pattern =
        crafting.map(stack => {

            if (!stack) {
                return "empty";
            }

            return materialOfItem(stack.id);

        });


    /* 4 espaços */

    for (const recipe of basicRecipes) {

        const compact =
            pattern.filter(
                x => x !== "empty"
            );

        if (
            compact.length ===
            recipe.pattern.length
        ) {

            let valid = true;

            for (
                let i = 0;
                i < recipe.pattern.length;
                i++
            ) {

                if (
                    compact[i] !==
                    recipe.pattern[i]
                ) {

                    valid = false;
                    break;

                }

            }

            if (valid) {
                return recipe;
            }

        }

    }

    return null;

}


/* =========================================================
   CRAFTING BÁSICO
========================================================= */

function craftBasicItem() {

    const recipe =
        getBasicCraftResult();

    if (!recipe) {
        return;
    }


    /* retirar materiais */

    for (
        let i = 0;
        i < crafting.length;
        i++
    ) {

        const stack =
            crafting[i];

        if (!stack) {
            continue;
        }

        stack.count--;

        if (stack.count <= 0) {

            crafting[i] = null;

        }

    }


    addItem(
        recipe.result,
        recipe.amount
    );


    updateCraftUI();

    updateInventoryUI();

}


/* =========================================================
   COMPATIBILIDADE COM O SISTEMA ANTIGO
========================================================= */

function getCraftResult() {

    return getBasicCraftResult();

}


function craftItem() {

    craftBasicItem();

}

