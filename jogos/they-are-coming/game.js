/* =========================================================
   THEY ARE COMING - GAMEHUB
   VERSÃO CORRIGIDA
========================================================= */

"use strict";

/* =========================
   ELEMENTOS DO HTML
========================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const shopScreen = document.getElementById("shopScreen");
const shopContent = document.getElementById("shopContent");

const moneyEl = document.getElementById("money");
const moneyHud = document.getElementById("moneyHud");
const playerNameInput = document.getElementById("playerName");

const startWaveBtn = document.getElementById("startWaveBtn");

const healthBar = document.getElementById("healthBar");
const armorHud = document.getElementById("armorHud");
const armorBar = document.getElementById("armorBar");

const nameHud = document.getElementById("nameHud");
const waveEl = document.getElementById("wave");
const enemiesEl = document.getElementById("enemies");

const weaponEl = document.getElementById("weapon");
const ammoEl = document.getElementById("ammo");

const menuInventory = document.getElementById("menuInventory");
const gameInventory = document.getElementById("gameInventorySlots");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const categoryButtons = document.querySelectorAll(".category-btn");


/* =========================
   CONFIGURAÇÕES
========================= */

const MAX_HEALTH = 100;
const INVENTORY_SIZE = 5;
const ZOMBIE_DAMAGE = 5;

const STARTING_MONEY = 500;

let money = STARTING_MONEY;

let gameRunning = false;
let gameOverState = false;

let wave = 1;
let score = 0;

let currentCategory = "armadura";

let selectedSlot = 0;

let zombies = [];
let bullets = [];

let activeTraps = [];
let activeBarricades = [];

let lastTime = 0;

let mouse = {
    x: 0,
    y: 0,
    down: false
};


/* =========================
   JOGADOR
========================= */

const player = {
    x: 0,
    y: 0,

    width: 35,
    height: 35,

    speed: 4,

    health: MAX_HEALTH,

    armor: 0,
    maxArmor: 0,

    weapon: null,

    ammo: 12,
    reserveAmmo: 30,

    inventory: [],

    friend: null,

    shootingCooldown: 0
};


/* =========================
   ARMAS
========================= */

const weapons = [

    {
        name: "Pistola",
        price: 0,
        damage: 25,
        magazine: 12,
        reserve: 30,
        fireRate: 300,
        color: "#ffd54a"
    },

    {
        name: "Escopeta",
        price: 1000,
        damage: 55,
        magazine: 6,
        reserve: 24,
        fireRate: 700,
        color: "#ff8a65"
    },

    {
        name: "SMG",
        price: 1500,
        damage: 18,
        magazine: 30,
        reserve: 90,
        fireRate: 120,
        color: "#64b5f6"
    },

    {
        name: "Rifle",
        price: 2200,
        damage: 40,
        magazine: 20,
        reserve: 60,
        fireRate: 250,
        color: "#81c784"
    },

    {
        name: "Revolver",
        price: 1200,
        damage: 45,
        magazine: 6,
        reserve: 30,
        fireRate: 450,
        color: "#d7ccc8"
    },

    {
        name: "Uzi",
        price: 1800,
        damage: 16,
        magazine: 32,
        reserve: 96,
        fireRate: 100,
        color: "#90caf9"
    },

    {
        name: "MP5",
        price: 2000,
        damage: 20,
        magazine: 30,
        reserve: 90,
        fireRate: 110,
        color: "#80cbc4"
    },

    {
        name: "AK-47",
        price: 2800,
        damage: 32,
        magazine: 30,
        reserve: 90,
        fireRate: 170,
        color: "#bcaaa4"
    },

    {
        name: "M4",
        price: 3200,
        damage: 30,
        magazine: 30,
        reserve: 120,
        fireRate: 130,
        color: "#a5d6a7"
    },

    {
        name: "SCAR",
        price: 4000,
        damage: 38,
        magazine: 30,
        reserve: 120,
        fireRate: 180,
        color: "#78909c"
    },

    {
        name: "FAMAS",
        price: 3500,
        damage: 29,
        magazine: 25,
        reserve: 100,
        fireRate: 140,
        color: "#ffe082"
    },

    {
        name: "AUG",
        price: 3700,
        damage: 31,
        magazine: 30,
        reserve: 120,
        fireRate: 150,
        color: "#9fa8da"
    },

    {
        name: "G36",
        price: 3900,
        damage: 33,
        magazine: 30,
        reserve: 120,
        fireRate: 145,
        color: "#c5e1a5"
    },

    {
        name: "Vector",
        price: 3000,
        damage: 19,
        magazine: 33,
        reserve: 132,
        fireRate: 80,
        color: "#ef9a9a"
    },

    {
        name: "P90",
        price: 3600,
        damage: 18,
        magazine: 50,
        reserve: 150,
        fireRate: 85,
        color: "#80deea"
    },

    {
        name: "MAC-10",
        price: 2300,
        damage: 17,
        magazine: 30,
        reserve: 120,
        fireRate: 90,
        color: "#b0bec5"
    },

    {
        name: "MP7",
        price: 3300,
        damage: 19,
        magazine: 40,
        reserve: 160,
        fireRate: 90,
        color: "#ce93d8"
    },

    {
        name: "Tommy Gun",
        price: 3000,
        damage: 28,
        magazine: 30,
        reserve: 90,
        fireRate: 160,
        color: "#a1887f"
    },

    {
        name: "M249",
        price: 6000,
        damage: 28,
        magazine: 100,
        reserve: 300,
        fireRate: 100,
        color: "#8d6e63"
    },

    {
        name: "DMR",
        price: 4500,
        damage: 65,
        magazine: 10,
        reserve: 50,
        fireRate: 500,
        color: "#b39ddb"
    },

    {
        name: "Sniper",
        price: 6500,
        damage: 120,
        magazine: 5,
        reserve: 25,
        fireRate: 1000,
        color: "#90a4ae"
    },

    {
        name: "Rifle de Caça",
        price: 3500,
        damage: 75,
        magazine: 5,
        reserve: 30,
        fireRate: 600,
        color: "#bcaaa4"
    },

    {
        name: "Besta",
        price: 2800,
        damage: 90,
        magazine: 1,
        reserve: 15,
        fireRate: 900,
        color: "#ffcc80"
    },

    {
        name: "Marksman",
        price: 5000,
        damage: 70,
        magazine: 10,
        reserve: 50,
        fireRate: 450,
        color: "#b0bec5"
    },

    {
        name: "Escopeta Dupla",
        price: 3200,
        damage: 90,
        magazine: 2,
        reserve: 20,
        fireRate: 800,
        color: "#ffab91"
    },

    {
        name: "Pump Shotgun",
        price: 3800,
        damage: 75,
        magazine: 8,
        reserve: 40,
        fireRate: 650,
        color: "#ff8a65"
    },

    {
        name: "Escopeta Automática",
        price: 5000,
        damage: 45,
        magazine: 12,
        reserve: 60,
        fireRate: 300,
        color: "#ff7043"
    },

    {
        name: "Escopeta Serrada",
        price: 2800,
        damage: 100,
        magazine: 2,
        reserve: 20,
        fireRate: 700,
        color: "#f4511e"
    },

    {
        name: "Riot Shotgun",
        price: 6000,
        damage: 80,
        magazine: 10,
        reserve: 60,
        fireRate: 450,
        color: "#ff5722"
    },

    {
        name: "Laser Gun",
        price: 10000,
        damage: 80,
        magazine: 20,
        reserve: 100,
        fireRate: 200,
        color: "#00e5ff"
    },

    {
        name: "Plasma Gun",
        price: 12000,
        damage: 110,
        magazine: 10,
        reserve: 60,
        fireRate: 500,
        color: "#7c4dff"
    },

    {
        name: "Railgun",
        price: 18000,
        damage: 250,
        magazine: 3,
        reserve: 15,
        fireRate: 1500,
        color: "#e040fb"
    },

    {
        name: "Lança-chamas",
        price: 9000,
        damage: 15,
        magazine: 100,
        reserve: 300,
        fireRate: 70,
        color: "#ff6d00"
    },

    {
        name: "Lança-granadas",
        price: 11000,
        damage: 180,
        magazine: 5,
        reserve: 25,
        fireRate: 900,
        color: "#76ff03"
    }
];


/* =========================
   ARMADURAS
========================= */

const armors = [

    {
        name: "Colete Leve",
        price: 800,
        armor: 50
    },

    {
        name: "Colete Policial",
        price: 1500,
        armor: 75
    },

    {
        name: "Colete Militar",
        price: 3000,
        armor: 100
    },

    {
        name: "Armadura Pesada",
        price: 5000,
        armor: 150
    },

    {
        name: "Armadura Blindada",
        price: 8000,
        armor: 200
    }
];


/* =========================
   AMIGOS
========================= */

const friends = [

    {
        name: "Cachorro",
        price: 1800,
        damage: 15
    },

    {
        name: "Rottweiler",
        price: 3000,
        damage: 22
    },

    {
        name: "Leopardo",
        price: 5000,
        damage: 30
    },

    {
        name: "Tigre",
        price: 10000,
        damage: 45
    },

    {
        name: "Leão",
        price: 13000,
        damage: 55
    },

    {
        name: "Velociraptor",
        price: 20000,
        damage: 75
    }
];


/* =========================
   BOMBAS
========================= */

const bombs = [];

for (let i = 1; i <= 10; i++) {

    bombs.push({
        name: `Bomba ${i}`,
        price: 500 * i,
        damage: 100 + i * 20,
        radius: 80 + i * 5
    });

}


/* =========================
   ARMADILHAS
========================= */

const trapCatalog = [];

for (let i = 1; i <= 15; i++) {

    trapCatalog.push({
        name: `Armadilha ${i}`,
        price: 250 * i,
        damage: 30 + i * 10,
        duration: 300 + i * 20
    });

}


/* =========================
   BARRICADAS
========================= */

const barricadeCatalog = [];

for (let i = 1; i <= 10; i++) {

    barricadeCatalog.push({
        name: `Barricada ${i}`,
        price: 300 * i,
        health: 100 + i * 50
    });

}


/* =========================
   KITS
========================= */

const kits = [

    {
        name: "Kit Médico",
        price: 250,
        type: "heal",
        value: 50
    },

    {
        name: "Kit de Velocidade",
        price: 500,
        type: "speed",
        value: 5
    }

];


/* =========================
   ZUMBIS
========================= */

const zombieTypes = [

    {
        name: "Walker",
        health: 50,
        speed: 0.8,
        damage: 5,
        size: 28,
        color: "#79a86b"
    },

    {
        name: "Runner",
        health: 35,
        speed: 1.8,
        damage: 5,
        size: 24,
        color: "#ff7043"
    },

    {
        name: "Brute",
        health: 150,
        speed: 0.5,
        damage: 5,
        size: 42,
        color: "#795548"
    },

    {
        name: "Crawler",
        health: 30,
        speed: 1.5,
        damage: 5,
        size: 20,
        color: "#9e9e9e"
    },

    {
        name: "Soldier",
        health: 80,
        speed: 1,
        damage: 5,
        size: 30,
        color: "#607d8b"
    },

    {
        name: "Mutant",
        health: 180,
        speed: 0.7,
        damage: 5,
        size: 38,
        color: "#ab47bc"
    },

    {
        name: "Burning",
        health: 100,
        speed: 1.1,
        damage: 5,
        size: 32,
        color: "#ff5722"
    },

    {
        name: "Toxic",
        health: 90,
        speed: 1,
        damage: 5,
        size: 31,
        color: "#76ff03"
    },

    {
        name: "Tank",
        health: 350,
        speed: 0.4,
        damage: 5,
        size: 50,
        color: "#424242"
    },

    {
        name: "Boss",
        health: 700,
        speed: 0.35,
        damage: 5,
        size: 65,
        color: "#8e24aa"
    }

];


/* =========================
   RESIZE
========================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!gameRunning) {

        player.x = canvas.width / 2;
        player.y = canvas.height / 2;

    }

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =========================
   DINHEIRO
========================= */

function updateMoney() {

    moneyEl.textContent = money;
    moneyHud.textContent = `💵 $${money}`;

}


/* =========================
   INVENTÁRIO
========================= */

function addInventory(item) {

    if (player.inventory.length >= INVENTORY_SIZE) {

        alert("Seu inventário está cheio! Você só pode carregar 5 itens.");

        return false;

    }

    player.inventory.push(item);

    updateInventories();

    return true;

}


function updateInventories() {

    menuInventory.innerHTML = "";
    gameInventory.innerHTML = "";

    for (let i = 0; i < INVENTORY_SIZE; i++) {

        const menuSlot = document.createElement("div");
        menuSlot.className = "inventory-slot";

        const gameSlot = document.createElement("div");
        gameSlot.className = "inventory-slot";

        if (player.inventory[i]) {

            menuSlot.textContent =
                `${i + 1}. ${player.inventory[i].name}`;

            gameSlot.textContent =
                `${i + 1}. ${player.inventory[i].name}`;

        } else {

            menuSlot.textContent = `${i + 1}. Vazio`;
            gameSlot.textContent = `${i + 1}. Vazio`;

        }

        if (i === selectedSlot) {

            menuSlot.classList.add("selected");
            gameSlot.classList.add("selected");

        }

        menuInventory.appendChild(menuSlot);
        gameInventory.appendChild(gameSlot);

    }

}


/* =========================
   CATEGORIAS
========================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentCategory = button.dataset.category;

        renderShop();

    });

});


/* =========================
   LOJA
========================= */

function renderShop() {

    shopContent.innerHTML = "";

    if (currentCategory === "armadura") {

        renderItems(
            armors,
            item => buyArmor(item)
        );

    }

    else if (currentCategory === "amigos") {

        renderItems(
            friends,
            item => buyFriend(item)
        );

    }

    else if (currentCategory === "armas") {

        renderItems(
            weapons.slice(1),
            item => buyWeapon(item)
        );

    }

    else if (currentCategory === "municao") {

        renderAmmoShop();

    }

    else if (currentCategory === "kits") {

        renderItems(
            kits,
            item => buyKit(item)
        );

    }

    else if (currentCategory === "bombas") {

        renderItems(
            bombs,
            item => buyBomb(item)
        );

    }

    else if (currentCategory === "armadilhas") {

        renderItems(
            trapCatalog,
            item => buyTrap(item)
        );

    }

    else if (currentCategory === "barricadas") {

        renderItems(
            barricadeCatalog,
            item => buyBarricade(item)
        );

    }

}


/* =========================
   CARDS DA LOJA
========================= */

function renderItems(items, buyFunction) {

    items.forEach(item => {

        const card = document.createElement("div");

        card.className = "shop-item";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = `💵 $${item.price}`;

        const button = document.createElement("button");

        button.textContent = "COMPRAR";

        button.addEventListener("click", () => {

            buyFunction(item);

        });

        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(button);

        shopContent.appendChild(card);

    });

}


/* =========================
   ARMADURAS
========================= */

function buyArmor(armor) {

    if (money < armor.price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    money -= armor.price;

    player.armor = armor.armor;
    player.maxArmor = armor.armor;

    updateMoney();
    updateHUD();

}


/* =========================
   AMIGOS
========================= */

function buyFriend(friend) {

    if (money < friend.price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    if (player.friend) {

        alert("Você já possui um amigo.");

        return;

    }

    money -= friend.price;

    player.friend = friend;

    addInventory({
        name: friend.name,
        type: "friend",
        data: friend
    });

    updateMoney();

}


/* =========================
   ARMAS
========================= */

function buyWeapon(weapon) {

    if (money < weapon.price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    if (player.inventory.some(
        item => item.type === "weapon" &&
        item.data.name === weapon.name
    )) {

        alert("Você já possui essa arma.");

        return;

    }

    if (player.inventory.length >= INVENTORY_SIZE) {

        alert("Inventário cheio.");

        return;

    }

    money -= weapon.price;

    addInventory({
        name: weapon.name,
        type: "weapon",
        data: weapon,
        ammo: weapon.magazine,
        reserveAmmo: weapon.reserve
    });

    updateMoney();

}


/* =========================
   MUNIÇÃO
========================= */

function renderAmmoShop() {

    weapons.forEach(weapon => {

        const card = document.createElement("div");

        card.className = "shop-item";

        const title = document.createElement("h3");

        title.textContent =
            `Munição - ${weapon.name}`;

        const price = document.createElement("p");

        price.textContent =
            `$${Math.max(50, weapon.price / 10)} por pacote`;

        const button = document.createElement("button");

        button.textContent = "COMPRAR";

        button.onclick = () => {

            buyAmmo(weapon);

        };

        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(button);

        shopContent.appendChild(card);

    });

}


function buyAmmo(weapon) {

    const price = Math.max(50, weapon.price / 10);

    if (money < price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    const item = player.inventory.find(
        inv =>
            inv.type === "weapon" &&
            inv.data.name === weapon.name
    );

    if (!item) {

        alert("Você precisa comprar essa arma primeiro.");

        return;

    }

    money -= price;

    item.reserveAmmo += weapon.reserve;

    updateMoney();
    updateInventories();

}


/* =========================
   KITS
========================= */

function buyKit(kit) {

    if (money < kit.price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    if (kit.type === "heal") {

        if (player.health >= MAX_HEALTH) {

            alert("Sua vida já está cheia.");

            return;

        }

        money -= kit.price;

        player.health = Math.min(
            MAX_HEALTH,
            player.health + kit.value
        );

    }

    else if (kit.type === "speed") {

        money -= kit.price;

        player.speed += kit.value;

    }

    updateMoney();
    updateHUD();

}


/* =========================
   BOMBAS
========================= */

function buyBomb(bomb) {

    if (money < bomb.price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    if (player.inventory.length >= INVENTORY_SIZE) {

        alert("Inventário cheio.");

        return;

    }

    money -= bomb.price;

    addInventory({
        name: bomb.name,
        type: "bomb",
        data: bomb
    });

    updateMoney();

}


/* =========================
   ARMADILHAS
========================= */

function buyTrap(trap) {

    if (money < trap.price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    if (player.inventory.length >= INVENTORY_SIZE) {

        alert("Inventário cheio.");

        return;

    }

    money -= trap.price;

    addInventory({
        name: trap.name,
        type: "trap",
        data: trap
    });

    updateMoney();

}


/* =========================
   BARRICADAS
========================= */

function buyBarricade(barricade) {

    if (money < barricade.price) {

        alert("Dinheiro insuficiente.");

        return;

    }

    if (player.inventory.length >= INVENTORY_SIZE) {

        alert("Inventário cheio.");

        return;

    }

    money -= barricade.price;

    addInventory({
        name: barricade.name,
        type: "barricade",
        data: barricade
    });

    updateMoney();

}


/* =========================
   EQUIPAR ITEM
========================= */

function selectInventorySlot(index) {

    if (index < 0 || index >= INVENTORY_SIZE) return;

    selectedSlot = index;

    const item = player.inventory[index];

    if (item && item.type === "weapon") {

        player.weapon = item;

    }

    updateInventories();
    updateHUD();

}


/* =========================
   TECLAS
========================= */

window.addEventListener("keydown", event => {

    if (event.key >= "1" && event.key <= "5") {

        const index = Number(event.key) - 1;

        selectInventorySlot(index);

    }

    if (event.code === "Space") {

        event.preventDefault();

        shoot();

    }

    if (event.key.toLowerCase() === "r") {

        reload();

    }

});


/* =========================
   MOUSE
========================= */

canvas.addEventListener("mousemove", event => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


canvas.addEventListener("mousedown", event => {

    if (event.button === 0) {

        mouse.down = true;

        shoot();

    }

});


window.addEventListener("mouseup", event => {

    if (event.button === 0) {

        mouse.down = false;

    }

});


/* =========================
   TIRO
========================= */

function shoot() {

    if (!gameRunning) return;

    if (!player.weapon) {

        player.weapon = {
            name: "Pistola",
            type: "weapon",
            data: weapons[0],
            ammo: 12,
            reserveAmmo: 30
        };

    }

    if (player.shootingCooldown > 0) return;

    const weapon = player.weapon;

    if (weapon.ammo <= 0) {

        reload();

        return;

    }

    weapon.ammo--;

    player.shootingCooldown =
        weapon.data.fireRate;

    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );

    bullets.push({

        x: player.x,
        y: player.y,

        vx: Math.cos(angle) * 12,
        vy: Math.sin(angle) * 12,

        damage: weapon.data.damage,

        color: weapon.data.color,

        life: 80

    });

    updateHUD();

}


/* =========================
   RECARREGAR
========================= */

function reload() {

    if (!player.weapon) return;

    const weapon = player.weapon;

    if (weapon.ammo >= weapon.data.magazine) return;

    if (weapon.reserveAmmo <= 0) return;

    const needed =
        weapon.data.magazine - weapon.ammo;

    const amount =
        Math.min(needed, weapon.reserveAmmo);

    weapon.ammo += amount;

    weapon.reserveAmmo -= amount;

    updateHUD();

}


/* =========================
   INICIAR ONDA
========================= */

startWaveBtn.addEventListener("click", () => {

    startGame();

});


function startGame() {

    if (gameRunning) return;

    gameRunning = true;
    gameOverState = false;

    shopScreen.style.display = "none";

    canvas.style.display = "block";
    document.getElementById("hud").style.display = "flex";
    document.getElementById("gameInventory").style.display = "flex";

    gameOver.style.display = "none";

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    player.health = MAX_HEALTH;

    zombies = [];
    bullets = [];

    activeTraps = [];
    activeBarricades = [];

    createWave();

    updateHUD();

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);

}


/* =========================
   CRIAR ONDA
========================= */

function createWave() {

    zombies = [];

    const amount =
        5 + wave * 3;

    for (let i = 0; i < amount; i++) {

        spawnZombie();

    }

    updateHUD();

}


/* =========================
   NASCER ZUMBI
========================= */

function spawnZombie() {

    const type =
        zombieTypes[
            Math.floor(
                Math.random() *
                zombieTypes.length
            )
        ];

    let x;
    let y;

    const side =
        Math.floor(Math.random() * 4);

    if (side === 0) {

        x = Math.random() * canvas.width;
        y = -50;

    }

    else if (side === 1) {

        x = canvas.width + 50;
        y = Math.random() * canvas.height;

    }

    else if (side === 2) {

        x = Math.random() * canvas.width;
        y = canvas.height + 50;

    }

    else {

        x = -50;
        y = Math.random() * canvas.height;

    }

    zombies.push({

        x,
        y,

        type,

        health: type.health,

        maxHealth: type.health,

        attackCooldown: 0,

        hitFlash: 0

    });

}


/* =========================
   LOOP PRINCIPAL
========================= */

function gameLoop(time) {

    if (!gameRunning) return;

    const delta =
        Math.min(
            50,
            time - lastTime
        );

    lastTime = time;

    update(delta);
    draw();

    requestAnimationFrame(gameLoop);

}


/* =========================
   UPDATE
========================= */

function update(delta) {

    updatePlayer(delta);

    updateZombies(delta);

    updateBullets();

    updateTraps();

    updateBarricades();

    if (player.shootingCooldown > 0) {

        player.shootingCooldown -= delta;

        if (player.shootingCooldown < 0) {

            player.shootingCooldown = 0;

        }

    }

    if (mouse.down) {

        shoot();

    }

    if (zombies.length === 0 && gameRunning) {

        wave++;

        money += 250;

        createWave();

        updateMoney();

    }

    updateHUD();

}


/* =========================
   MOVIMENTO DO JOGADOR
========================= */

function updatePlayer(delta) {

    let dx = 0;
    let dy = 0;

    if (
        keys["w"] ||
        keys["ArrowUp"]
    ) dy--;

    if (
        keys["s"] ||
        keys["ArrowDown"]
    ) dy++;

    if (
        keys["a"] ||
        keys["ArrowLeft"]
    ) dx--;

    if (
        keys["d"] ||
        keys["ArrowRight"]
    ) dx++;

    if (dx !== 0 || dy !== 0) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        dx /= length;
        dy /= length;

        player.x +=
            dx * player.speed;

        player.y +=
            dy * player.speed;

    }

    player.x =
        Math.max(
            20,
            Math.min(
                canvas.width - 20,
                player.x
            )
        );

    player.y =
        Math.max(
            20,
            Math.min(
                canvas.height - 20,
                player.y
            )
        );

}


/* =========================
   TECLADO
========================= */

const keys = {};

window.addEventListener("keydown", event => {

    keys[event.key] = true;

});


window.addEventListener("keyup", event => {

    keys[event.key] = false;

});


/* =========================
   ZUMBIS
========================= */

function updateZombies(delta) {

    for (const zombie of zombies) {

        if (zombie.attackCooldown > 0) {

            zombie.attackCooldown -= delta;

        }

        const dx =
            player.x - zombie.x;

        const dy =
            player.y - zombie.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance > 45) {

            zombie.x +=
                (dx / distance) *
                zombie.type.speed;

            zombie.y +=
                (dy / distance) *
                zombie.type.speed;

        }

        else {

            if (
                zombie.attackCooldown <= 0
            ) {

                damagePlayer(ZOMBIE_DAMAGE);

                zombie.attackCooldown = 700;

            }

        }

    }

}


/* =========================
   DANO NO JOGADOR
========================= */

function damagePlayer(amount) {

    if (!gameRunning) return;

    let remainingDamage = amount;

    if (player.armor > 0) {

        const armorDamage =
            Math.min(
                player.armor,
                remainingDamage
            );

        player.armor -= armorDamage;

        remainingDamage -= armorDamage;

    }

    if (remainingDamage > 0) {

        player.health -= remainingDamage;

    }

    if (player.health < 0) {

        player.health = 0;

    }

    updateHUD();

    if (player.health <= 0) {

        die();

    }

}


/* =========================
   BALAS
========================= */

function updateBullets() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        const bullet = bullets[i];

        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        bullet.life--;

        let hit = false;

        for (
            let z = zombies.length - 1;
            z >= 0;
            z--
        ) {

            const zombie = zombies[z];

            const distance =
                Math.hypot(
                    bullet.x - zombie.x,
                    bullet.y - zombie.y
                );

            if (
                distance <
                zombie.type.size
            ) {

                zombie.health -=
                    bullet.damage;

                zombie.hitFlash = 80;

                hit = true;

                if (zombie.health <= 0) {

                    zombies.splice(z, 1);

                    money += 100;

                    score += 100;

                    updateMoney();

                }

                break;

            }

        }

        if (
            hit ||
            bullet.life <= 0 ||
            bullet.x < -100 ||
            bullet.x > canvas.width + 100 ||
            bullet.y < -100 ||
            bullet.y > canvas.height + 100
        ) {

            bullets.splice(i, 1);

        }

    }

}


/* =========================
   ARMADILHAS ATIVAS
========================= */

function updateTraps() {

    for (
        let i = activeTraps.length - 1;
        i >= 0;
        i--
    ) {

        const trap = activeTraps[i];

        trap.timer--;

        if (trap.timer <= 0) {

            activeTraps.splice(i, 1);

            continue;

        }

        for (
            let z = zombies.length - 1;
            z >= 0;
            z--
        ) {

            const zombie = zombies[z];

            const distance =
                Math.hypot(
                    zombie.x - trap.x,
                    zombie.y - trap.y
                );

            if (distance < 50) {

                zombie.health -=
                    trap.damage;

                trap.timer = 0;

                if (zombie.health <= 0) {

                    zombies.splice(z, 1);

                    money += 100;

                    score += 100;

                }

                break;

            }

        }

    }

}


/* =========================
   BARRICADAS
========================= */

function updateBarricades() {

    for (const barricade of activeBarricades) {

        if (barricade.health <= 0) continue;

        for (const zombie of zombies) {

            const distance =
                Math.hypot(
                    zombie.x - barricade.x,
                    zombie.y - barricade.y
                );

            if (distance < 45) {

                zombie.x +=
                    zombie.x < barricade.x
                        ? -1
                        : 1;

            }

        }

    }

}


/* =========================
   DESENHO
========================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();

    drawBarricades();

    drawTraps();

    drawBullets();

    drawZombies();

    drawPlayer();

}


/* =========================
   FUNDO
========================= */

function drawBackground() {

    ctx.fillStyle = "#10151c";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.strokeStyle = "rgba(255,255,255,0.04)";

    const gridSize = 50;

    for (
        let x = 0;
        x < canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        ctx.stroke();

    }

    for (
        let y = 0;
        y < canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        ctx.stroke();

    }

}


/* =========================
   JOGADOR
========================= */

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    ctx.fillStyle = "#2196f3";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();

    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );

    ctx.rotate(angle);

    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(
        10,
        -4,
        25,
        8
    );

    ctx.restore();

}


/* =========================
   ZUMBIS
========================= */

function drawZombies() {

    for (const zombie of zombies) {

        ctx.fillStyle =
            zombie.hitFlash > 0
                ? "#ffffff"
                : zombie.type.color;

        ctx.beginPath();

        ctx.arc(
            zombie.x,
            zombie.y,
            zombie.type.size / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        zombie.hitFlash -= 16;

        if (zombie.hitFlash < 0) {

            zombie.hitFlash = 0;

        }

        const barWidth =
            zombie.type.size;

        const healthPercent =
            Math.max(
                0,
                zombie.health /
                zombie.maxHealth
            );

        ctx.fillStyle = "#222";

        ctx.fillRect(
            zombie.x - barWidth / 2,
            zombie.y - zombie.type.size / 2 - 10,
            barWidth,
            5
        );

        ctx.fillStyle = "#e53935";

        ctx.fillRect(
            zombie.x - barWidth / 2,
            zombie.y - zombie.type.size / 2 - 10,
            barWidth * healthPercent,
            5
        );

    }

}


/* =========================
   BALAS
========================= */

function drawBullets() {

    for (const bullet of bullets) {

        ctx.fillStyle = bullet.color;

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================
   ARMADILHAS
========================= */

function drawTraps() {

    for (const trap of activeTraps) {

        ctx.strokeStyle = "#ff9800";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.arc(
            trap.x,
            trap.y,
            25,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }

}


/* =========================
   BARRICADAS
========================= */

function drawBarricades() {

    for (const barricade of activeBarricades) {

        ctx.fillStyle = "#8d6e63";

        ctx.fillRect(
            barricade.x - 25,
            barricade.y - 12,
            50,
            24
        );

    }

}


/* =========================
   HUD
========================= */

function updateHUD() {

    healthBar.style.width =
        `${player.health}%`;

    if (player.maxArmor > 0) {

        armorHud.style.display = "block";

        const percent =
            (player.armor /
                player.maxArmor) * 100;

        armorBar.style.width =
            `${Math.max(0, percent)}%`;

    }

    else {

        armorHud.style.display = "none";

    }

    const name =
        playerNameInput.value.trim() ||
        "Jogador";

    nameHud.textContent = name;

    waveEl.textContent =
        `ONDA ${wave}`;

    enemiesEl.textContent =
        `Zumbis: ${zombies.length}`;

    if (player.weapon) {

        weaponEl.textContent =
            player.weapon.data.name;

        ammoEl.textContent =
            `${player.weapon.ammo} / ${player.weapon.reserveAmmo}`;

    }

    else {

        weaponEl.textContent =
            "PISTOLA";

        ammoEl.textContent =
            "12 / 30";

    }

}


/* =========================
   MORTE
========================= */

function die() {

    if (!gameRunning) return;

    gameRunning = false;
    gameOverState = true;

    mouse.down = false;

    finalScore.textContent =
        `Pontuação: ${score} | Onda alcançada: ${wave}`;

    canvas.style.display = "none";

    document.getElementById("hud").style.display =
        "none";

    document.getElementById("gameInventory").style.display =
        "none";

    gameOver.style.display = "flex";

}


/* =========================
   RECOMEÇAR
========================= */

restartBtn.addEventListener("click", () => {

    resetGame();

});


function resetGame() {

    gameRunning = false;
    gameOverState = false;

    gameOver.style.display = "none";

    shopScreen.style.display = "block";

    canvas.style.display = "none";

    document.getElementById("hud").style.display =
        "none";

    document.getElementById("gameInventory").style.display =
        "none";

    money = STARTING_MONEY;

    wave = 1;

    score = 0;

    player.health = MAX_HEALTH;

    player.speed = 4;

    player.armor = 0;

    player.maxArmor = 0;

    player.friend = null;

    player.inventory = [];

    player.weapon = {
        name: "Pistola",
        type: "weapon",
        data: weapons[0],
        ammo: 12,
        reserveAmmo: 30
    };

    /*
       A pistola inicial ocupa o primeiro
       espaço do inventário.
    */

    player.inventory.push(player.weapon);

    selectedSlot = 0;

    zombies = [];
    bullets = [];

    activeTraps = [];
    activeBarricades = [];

    updateMoney();

    updateInventories();

    updateHUD();

}


/* =========================
   USAR ITEM DURANTE A ONDA
========================= */

function useSelectedItem() {

    const item =
        player.inventory[selectedSlot];

    if (!item) return;

    if (item.type === "bomb") {

        useBomb(item);

        player.inventory.splice(
            selectedSlot,
            1
        );

        fixSelectedSlot();

    }

    else if (item.type === "trap") {

        activeTraps.push({

            x: player.x,
            y: player.y,

            damage: item.data.damage,

            timer: item.data.duration

        });

        player.inventory.splice(
            selectedSlot,
            1
        );

        fixSelectedSlot();

    }

    else if (item.type === "barricade") {

        activeBarricades.push({

            x: player.x,
            y: player.y,

            health: item.data.health

        });

        player.inventory.splice(
            selectedSlot,
            1
        );

        fixSelectedSlot();

    }

}


/* =========================
   BOMBA
========================= */

function useBomb(item) {

    const bomb = item.data;

    for (
        let i = zombies.length - 1;
        i >= 0;
        i--
    ) {

        const zombie = zombies[i];

        const distance =
            Math.hypot(
                zombie.x - player.x,
                zombie.y - player.y
            );

        if (distance <= bomb.radius) {

            zombie.health -=
                bomb.damage;

            if (zombie.health <= 0) {

                zombies.splice(i, 1);

                money += 100;

                score += 100;

            }

        }

    }

    updateMoney();

}


/* =========================
   USAR ITEM COM E
========================= */

window.addEventListener("keydown", event => {

    if (
        event.key.toLowerCase() === "e" &&
        gameRunning
    ) {

        useSelectedItem();

        updateInventories();

    }

});


/* =========================
   CORRIGIR SLOT
========================= */

function fixSelectedSlot() {

    if (
        selectedSlot >=
        player.inventory.length
    ) {

        selectedSlot =
            Math.max(
                0,
                player.inventory.length - 1
            );

    }

    updateInventories();

}


/* =========================
   MENU INICIAL
========================= */

function initializeGame() {

    canvas.style.display = "none";

    document.getElementById("hud").style.display =
        "none";

    document.getElementById("gameInventory").style.display =
        "none";

    gameOver.style.display = "none";

    player.weapon = {
        name: "Pistola",
        type: "weapon",
        data: weapons[0],
        ammo: 12,
        reserveAmmo: 30
    };

    player.inventory = [
        player.weapon
    ];

    player.health = MAX_HEALTH;

    player.speed = 4;

    player.armor = 0;

    player.maxArmor = 0;

    selectedSlot = 0;

    updateMoney();

    updateInventories();

    updateHUD();

    renderShop();

}


/* =========================
   INICIAR
========================= */

initializeGame();
