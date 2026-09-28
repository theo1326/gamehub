// ============================================================
// THEY ARE COMING - GAMEHUB
// VERSÃO CORRIGIDA
// ============================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 650;

// ============================================================
// CONFIGURAÇÕES
// ============================================================

const INITIAL_MONEY = 500;
const MAX_HEALTH = 100;
const ZOMBIE_DAMAGE = 5;
const INVENTORY_SIZE = 5;

// ============================================================
// ELEMENTOS DA INTERFACE
// ============================================================

const shopScreen = document.getElementById("shopScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOver");

const moneyEl = document.getElementById("money");
const playerNameInput = document.getElementById("playerName");

const healthBar = document.getElementById("healthBar");
const armorBar = document.getElementById("armorBar");
const armorHud = document.getElementById("armorHud");

const waveEl = document.getElementById("wave");
const zombiesEl = document.getElementById("zombies");
const weaponEl = document.getElementById("weapon");
const ammoEl = document.getElementById("ammo");

const shopContent = document.getElementById("shopContent");
const menuInventory = document.getElementById("menuInventory");
const gameInventory = document.getElementById("gameInventory");

const resultScore = document.getElementById("resultScore");

// ============================================================
// ESTADO DO JOGADOR
// ============================================================

const player = {
    x: 250,
    y: 500,
    width: 42,
    height: 65,

    vx: 0,
    vy: 0,

    speed: 5,
    jumpPower: 14,

    health: MAX_HEALTH,

    armor: 0,
    maxArmor: 0,
    hasArmor: false,

    onGround: true,

    direction: 1,

    color: "#3b82f6"
};

// ============================================================
// ESTADO DO JOGO
// ============================================================

let money = INITIAL_MONEY;
let wave = 1;
let score = 0;

let gameRunning = false;
let gameOver = false;

let animationId = null;

let equippedWeapon = "pistol";
let selectedInventorySlot = 0;

let playerName = "Jogador";

let speedLevel = 0;

let friend = null;

let zombies = [];
let bullets = [];
let traps = [];
let barricades = [];

let keys = {};

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    down: false
};

// ============================================================
// INVENTÁRIO
// ============================================================

let inventory = [
    null,
    null,
    null,
    null,
    null
];

// ============================================================
// ARMAS
// ============================================================

const weapons = {

    pistol: {
        name: "Pistola",
        price: 0,
        damage: 35,
        mag: 12,
        ammo: 12,
        reserve: 30,
        ammoPack: 30,
        ammoPrice: 100,
        owned: true,
        icon: "🔫"
    },

    shotgun: {
        name: "Escopeta",
        price: 1200,
        damage: 70,
        mag: 6,
        ammo: 6,
        reserve: 18,
        ammoPack: 12,
        ammoPrice: 150,
        owned: false,
        icon: "🔫"
    },

    smg: {
        name: "SMG",
        price: 1800,
        damage: 25,
        mag: 30,
        ammo: 30,
        reserve: 60,
        ammoPack: 60,
        ammoPrice: 180,
        owned: false,
        icon: "🔫"
    },

    rifle: {
        name: "Rifle",
        price: 2500,
        damage: 50,
        mag: 20,
        ammo: 20,
        reserve: 40,
        ammoPack: 40,
        ammoPrice: 220,
        owned: false,
        icon: "🔫"
    },

    revolver: {
        name: "Revolver",
        price: 1000,
        damage: 55,
        mag: 6,
        ammo: 6,
        reserve: 18,
        ammoPack: 12,
        ammoPrice: 120,
        owned: false,
        icon: "🔫"
    },

    uzi: {
        name: "Uzi",
        price: 1600,
        damage: 22,
        mag: 32,
        ammo: 32,
        reserve: 64,
        ammoPack: 64,
        ammoPrice: 160,
        owned: false,
        icon: "🔫"
    },

    mp5: {
        name: "MP5",
        price: 2200,
        damage: 28,
        mag: 30,
        ammo: 30,
        reserve: 60,
        ammoPack: 60,
        ammoPrice: 180,
        owned: false,
        icon: "🔫"
    },

    ak47: {
        name: "AK-47",
        price: 3500,
        damage: 45,
        mag: 30,
        ammo: 30,
        reserve: 90,
        ammoPack: 60,
        ammoPrice: 250,
        owned: false,
        icon: "🔫"
    },

    m4: {
        name: "M4",
        price: 3800,
        damage: 42,
        mag: 30,
        ammo: 30,
        reserve: 90,
        ammoPack: 60,
        ammoPrice: 260,
        owned: false,
        icon: "🔫"
    },

    scar: {
        name: "SCAR",
        price: 4500,
        damage: 52,
        mag: 25,
        ammo: 25,
        reserve: 75,
        ammoPack: 50,
        ammoPrice: 300,
        owned: false,
        icon: "🔫"
    },

    famas: {
        name: "FAMAS",
        price: 3200,
        damage: 38,
        mag: 25,
        ammo: 25,
        reserve: 75,
        ammoPack: 50,
        ammoPrice: 240,
        owned: false,
        icon: "🔫"
    },

    aug: {
        name: "AUG",
        price: 4200,
        damage: 44,
        mag: 30,
        ammo: 30,
        reserve: 90,
        ammoPack: 60,
        ammoPrice: 280,
        owned: false,
        icon: "🔫"
    },

    g36: {
        name: "G36",
        price: 4000,
        damage: 40,
        mag: 30,
        ammo: 30,
        reserve: 90,
        ammoPack: 60,
        ammoPrice: 270,
        owned: false,
        icon: "🔫"
    },

    vector: {
        name: "Vector",
        price: 3600,
        damage: 26,
        mag: 33,
        ammo: 33,
        reserve: 99,
        ammoPack: 66,
        ammoPrice: 230,
        owned: false,
        icon: "🔫"
    },

    p90: {
        name: "P90",
        price: 3900,
        damage: 25,
        mag: 50,
        ammo: 50,
        reserve: 100,
        ammoPack: 100,
        ammoPrice: 260,
        owned: false,
        icon: "🔫"
    },

    mac10: {
        name: "MAC-10",
        price: 2000,
        damage: 20,
        mag: 30,
        ammo: 30,
        reserve: 90,
        ammoPack: 60,
        ammoPrice: 180,
        owned: false,
        icon: "🔫"
    },

    mp7: {
        name: "MP7",
        price: 3000,
        damage: 27,
        mag: 40,
        ammo: 40,
        reserve: 100,
        ammoPack: 80,
        ammoPrice: 220,
        owned: false,
        icon: "🔫"
    },

    tommy: {
        name: "Tommy Gun",
        price: 2800,
        damage: 35,
        mag: 30,
        ammo: 30,
        reserve: 90,
        ammoPack: 60,
        ammoPrice: 230,
        owned: false,
        icon: "🔫"
    },

    m249: {
        name: "M249",
        price: 6000,
        damage: 45,
        mag: 100,
        ammo: 100,
        reserve: 200,
        ammoPack: 100,
        ammoPrice: 400,
        owned: false,
        icon: "🔫"
    },

    dmr: {
        name: "DMR",
        price: 5000,
        damage: 65,
        mag: 15,
        ammo: 15,
        reserve: 45,
        ammoPack: 30,
        ammoPrice: 300,
        owned: false,
        icon: "🔫"
    },

    sniper: {
        name: "Sniper",
        price: 7000,
        damage: 100,
        mag: 5,
        ammo: 5,
        reserve: 20,
        ammoPack: 5,
        ammoPrice: 350,
        owned: false,
        icon: "🎯"
    },

    hunting: {
        name: "Rifle de caça",
        price: 2800,
        damage: 75,
        mag: 8,
        ammo: 8,
        reserve: 24,
        ammoPack: 8,
        ammoPrice: 250,
        owned: false,
        icon: "🔫"
    },

    crossbow: {
        name: "Besta",
        price: 3000,
        damage: 80,
        mag: 1,
        ammo: 1,
        reserve: 10,
        ammoPack: 5,
        ammoPrice: 250,
        owned: false,
        icon: "🏹"
    },

    marksman: {
        name: "Marksman",
        price: 5200,
        damage: 70,
        mag: 10,
        ammo: 10,
        reserve: 30,
        ammoPack: 10,
        ammoPrice: 320,
        owned: false,
        icon: "🎯"
    },

    doubleShotgun: {
        name: "Escopeta dupla",
        price: 3500,
        damage: 90,
        mag: 2,
        ammo: 2,
        reserve: 12,
        ammoPack: 4,
        ammoPrice: 250,
        owned: false,
        icon: "🔫"
    },

    pumpShotgun: {
        name: "Pump Shotgun",
        price: 3000,
        damage: 80,
        mag: 8,
        ammo: 8,
        reserve: 24,
        ammoPack: 8,
        ammoPrice: 220,
        owned: false,
        icon: "🔫"
    },

    autoShotgun: {
        name: "Escopeta automática",
        price: 5500,
        damage: 60,
        mag: 12,
        ammo: 12,
        reserve: 36,
        ammoPack: 12,
        ammoPrice: 300,
        owned: false,
        icon: "🔫"
    },

    sawed: {
        name: "Escopeta serrada",
        price: 2200,
        damage: 85,
        mag: 2,
        ammo: 2,
        reserve: 12,
        ammoPack: 4,
        ammoPrice: 200,
        owned: false,
        icon: "🔫"
    },

    riot: {
        name: "Riot Shotgun",
        price: 4500,
        damage: 75,
        mag: 10,
        ammo: 10,
        reserve: 30,
        ammoPack: 10,
        ammoPrice: 280,
        owned: false,
        icon: "🔫"
    },

    laser: {
        name: "Laser Gun",
        price: 9000,
        damage: 90,
        mag: 20,
        ammo: 20,
        reserve: 60,
        ammoPack: 20,
        ammoPrice: 500,
        owned: false,
        icon: "🔴"
    },

    plasma: {
        name: "Plasma Gun",
        price: 12000,
        damage: 120,
        mag: 15,
        ammo: 15,
        reserve: 45,
        ammoPack: 15,
        ammoPrice: 600,
        owned: false,
        icon: "🟣"
    },

    railgun: {
        name: "Railgun",
        price: 18000,
        damage: 200,
        mag: 3,
        ammo: 3,
        reserve: 15,
        ammoPack: 3,
        ammoPrice: 800,
        owned: false,
        icon: "⚡"
    },

    flamethrower: {
        name: "Lança-chamas",
        price: 10000,
        damage: 45,
        mag: 100,
        ammo: 100,
        reserve: 200,
        ammoPack: 100,
        ammoPrice: 500,
        owned: false,
        icon: "🔥"
    },

    grenadeLauncher: {
        name: "Lança-granadas",
        price: 15000,
        damage: 180,
        mag: 5,
        ammo: 5,
        reserve: 20,
        ammoPack: 5,
        ammoPrice: 700,
        owned: false,
        icon: "💥"
    }
};

// ============================================================
// ARMADURAS
// ============================================================

const armors = [
    {
        id: "lightArmor",
        name: "Colete leve",
        price: 800,
        armor: 50,
        icon: "🦺",
        owned: false
    },
    {
        id: "policeArmor",
        name: "Colete policial",
        price: 1500,
        armor: 75,
        icon: "🛡️",
        owned: false
    },
    {
        id: "militaryArmor",
        name: "Colete militar",
        price: 3000,
        armor: 100,
        icon: "🛡️",
        owned: false
    },
    {
        id: "heavyArmor",
        name: "Armadura pesada",
        price: 5000,
        armor: 150,
        icon: "🛡️",
        owned: false
    },
    {
        id: "advancedArmor",
        name: "Armadura blindada",
        price: 8000,
        armor: 200,
        icon: "🛡️",
        owned: false
    }
];

// ============================================================
// AMIGOS
// ============================================================

const friends = [
    {
        id: "dog",
        name: "Cachorro",
        price: 1800,
        damage: 12,
        icon: "🐕",
        owned: false
    },
    {
        id: "rottweiler",
        name: "Rottweiler",
        price: 3000,
        damage: 18,
        icon: "🐕",
        owned: false
    },
    {
        id: "leopard",
        name: "Leopardo",
        price: 5000,
        damage: 25,
        icon: "🐆",
        owned: false
    },
    {
        id: "tiger",
        name: "Tigre",
        price: 10000,
        damage: 35,
        icon: "🐅",
        owned: false
    },
    {
        id: "lion",
        name: "Leão",
        price: 13000,
        damage: 45,
        icon: "🦁",
        owned: false
    },
    {
        id: "raptor",
        name: "Velociraptor",
        price: 20000,
        damage: 60,
        icon: "🦖",
        owned: false
    }
];

// ============================================================
// BOMBAS
// ============================================================

const bombs = [
    ["Granada", 500, 100, "💣"],
    ["Bomba grande", 1000, 180, "💣"],
    ["C4", 2000, 300, "💥"],
    ["Mina explosiva", 1500, 220, "💣"],
    ["Molotov", 700, 120, "🔥"],
    ["Bomba elétrica", 2500, 350, "⚡"],
    ["Bomba tóxica", 1800, 200, "☠️"],
    ["Bomba de gelo", 2200, 180, "❄️"],
    ["Bomba nuclear", 20000, 1000, "☢️"],
    ["Bomba plasma", 12000, 700, "🟣"]
].map((b, i) => ({
    id: "bomb" + i,
    name: b[0],
    price: b[1],
    damage: b[2],
    icon: b[3],
    owned: 0
}));

// ============================================================
// ARMADILHAS
// ============================================================

const traps = [
    ["Espinhos", 300, 15],
    ["Armadilha elétrica", 800, 25],
    ["Mina", 1000, 50],
    ["Fogo", 900, 35],
    ["Gelo", 700, 10],
    ["Lâminas", 1200, 45],
    ["Choque", 1500, 60],
    ["Veneno", 1300, 40],
    ["Explosiva", 1800, 80],
    ["Laser", 2500, 100],
    ["Plasma", 4000, 150],
    ["Estacas", 500, 25],
    ["Armadilha gigante", 3000, 120],
    ["Armadilha militar", 5000, 180],
    ["Armadilha nuclear", 15000, 500]
].map((t, i) => ({
    id: "trap" + i,
    name: t[0],
    price: t[1],
    damage: t[2],
    icon: "⚠️",
    owned: 0
}));

// ============================================================
// BARRICADAS
// ============================================================

const barricades = [
    ["Madeira", 300, 100],
    ["Madeira reforçada", 600, 180],
    ["Metal", 1200, 300],
    ["Metal pesado", 2000, 500],
    ["Concreto", 3000, 800],
    ["Concreto reforçado", 5000, 1200],
    ["Aço", 7000, 1800],
    ["Aço blindado", 10000, 2500],
    ["Energia", 15000, 4000],
    ["Super barricada", 25000, 7000]
].map((b, i) => ({
    id: "bar" + i,
    name: b[0],
    price: b[1],
    hp: b[2],
    icon: "🧱",
    owned: 0
}));

// ============================================================
// KITS
// ============================================================

const kits = [
    {
        id: "medkit",
        name: "Kit médico",
        price: 250,
        icon: "🩹"
    },
    {
        id: "speed",
        name: "Kit de velocidade",
        price: 500,
        icon: "⚡"
    }
];

let medkits = 0;

// ============================================================
// ZUMBIS - 10 TIPOS
// ============================================================

const zombieTypes = [
    {
        name: "Walker",
        hp: 100,
        speed: 1.0,
        color: "#62b36a",
        damage: 5,
        size: 38
    },
    {
        name: "Runner",
        hp: 70,
        speed: 2.4,
        color: "#d8d84d",
        damage: 5,
        size: 34
    },
    {
        name: "Brute",
        hp: 250,
        speed: 0.7,
        color: "#873d3d",
        damage: 5,
        size: 50
    },
    {
        name: "Crawler",
        hp: 80,
        speed: 2.0,
        color: "#8c5b35",
        damage: 5,
        size: 30
    },
    {
        name: "Soldier",
        hp: 180,
        speed: 1.3,
        color: "#59626d",
        damage: 5,
        size: 42
    },
    {
        name: "Mutant",
        hp: 350,
        speed: 0.9,
        color: "#743a91",
        damage: 5,
        size: 55
    },
    {
        name: "Burning",
        hp: 160,
        speed: 1.5,
        color: "#e66b2d",
        damage: 5,
        size: 42
    },
    {
        name: "Toxic",
        hp: 220,
        speed: 1.1,
        color: "#39b36a",
        damage: 5,
        size: 45
    },
    {
        name: "Tank",
        hp: 600,
        speed: 0.5,
        color: "#303030",
        damage: 5,
        size: 65
    },
    {
        name: "Boss",
        hp: 1000,
        speed: 0.6,
        color: "#8b1d31",
        damage: 5,
        size: 80
    }
];

// ============================================================
// FUNÇÕES DE INTERFACE
// ============================================================

function updateHUD() {

    healthBar.style.width =
        Math.max(0, player.health) + "%";

    if (player.hasArmor) {

        armorHud.style.display = "block";

        const percentage =
            (player.armor / player.maxArmor) * 100;

        armorBar.style.width =
            Math.max(0, percentage) + "%";

    } else {

        armorHud.style.display = "none";
    }

    moneyEl.textContent = "$" + money;
    waveEl.textContent = wave;

    zombiesEl.textContent =
        zombies.length;

    weaponEl.textContent =
        weapons[equippedWeapon].name;

    ammoEl.textContent =
        weapons[equippedWeapon].ammo +
        " / " +
        weapons[equippedWeapon].reserve;
}

// ============================================================
// INVENTÁRIO
// ============================================================

function addInventoryItem(item) {

    const existing =
        inventory.findIndex(x => x && x.id === item.id);

    if (existing !== -1) {
        return true;
    }

    const slot =
        inventory.findIndex(x => x === null);

    if (slot === -1) {
        return false;
    }

    inventory[slot] = item;

    renderInventory();

    return true;
}

function removeInventoryItem(id) {

    const index =
        inventory.findIndex(x => x && x.id === id);

    if (index !== -1) {
        inventory[index] = null;
    }

    renderInventory();
}

function renderInventory() {

    const containers = [
        menuInventory,
        gameInventory
    ];

    containers.forEach(container => {

        if (!container) return;

        container.innerHTML = "";

        inventory.forEach((item, index) => {

            const slot =
                document.createElement("div");

            slot.className =
                "inventory-slot";

            if (index === selectedInventorySlot) {
                slot.classList.add("selected");
            }

            if (item) {

                slot.innerHTML = `
                    <span>${item.icon || "📦"}</span>
                    <small>${index + 1}</small>
                    <b>${item.name}</b>
                `;

            } else {

                slot.innerHTML = `
                    <span>➕</span>
                    <small>${index + 1}</small>
                    <b>Vazio</b>
                `;
            }

            container.appendChild(slot);
        });
    });
}

// ============================================================
// CATEGORIAS DA LOJA
// ============================================================

function showCategory(category) {

    shopContent.innerHTML = "";

    if (category === "armadura") {
        renderArmors();
    }

    if (category === "amigos") {
        renderFriends();
    }

    if (category === "armas") {
        renderWeapons();
    }

    if (category === "municao") {
        renderAmmo();
    }

    if (category === "kits") {
        renderKits();
    }

    if (category === "bombas") {
        renderBombs();
    }

    if (category === "armadilhas") {
        renderTraps();
    }

    if (category === "barricadas") {
        renderBarricades();
    }
}

// ============================================================
// CARD DA LOJA
// ============================================================

function createCard(item, buttonText, action) {

    const card =
        document.createElement("div");

    card.className = "item-card";

    card.innerHTML = `
        <div class="item-icon">
            ${item.icon || "📦"}
        </div>

        <h3>${item.name}</h3>

        <div class="item-price">
            $${item.price}
        </div>

        <button class="item-button">
            ${buttonText}
        </button>
    `;

    const button =
        card.querySelector("button");

    button.onclick = action;

    shopContent.appendChild(card);
}

// ============================================================
// ARMADURAS
// ============================================================

function renderArmors() {

    armors.forEach(armor => {

        createCard(
            armor,
            armor.owned
                ? "EQUIPAR"
                : "COMPRAR",

            () => {

                if (!armor.owned) {

                    if (money < armor.price) {
                        alert("Dinheiro insuficiente.");
                        return;
                    }

                    if (
                        !inventory.some(
                            item =>
                            item &&
                            item.type === "armor"
                        )
                        &&
                        inventory.findIndex(
                            item => item === null
                        ) === -1
                    ) {
                        alert("Seu inventário está cheio.");
                        return;
                    }

                    money -= armor.price;

                    armor.owned = true;

                    player.armor = armor.armor;
                    player.maxArmor = armor.armor;
                    player.hasArmor = true;

                    addInventoryItem({
                        id: armor.id,
                        name: armor.name,
                        icon: armor.icon,
                        type: "armor"
                    });

                } else {

                    player.armor = armor.armor;
                    player.maxArmor = armor.armor;
                    player.hasArmor = true;
                }

                updateHUD();
                renderInventory();
            }
        );
    });
}

// ============================================================
// AMIGOS
// ============================================================

function renderFriends() {

    friends.forEach(item => {

        createCard(
            item,
            item.owned
                ? "EQUIPAR"
                : "COMPRAR",

            () => {

                if (!item.owned) {

                    if (money < item.price) {
                        alert("Dinheiro insuficiente.");
                        return;
                    }

                    const free =
                        inventory.findIndex(
                            x => x === null
                        );

                    if (free === -1) {
                        alert("Seu inventário está cheio.");
                        return;
                    }

                    money -= item.price;

                    item.owned = true;

                    addInventoryItem({
                        id: item.id,
                        name: item.name,
                        icon: item.icon,
                        type: "friend"
                    });
                }

                friend = item;

                updateHUD();
                renderInventory();
            }
        );
    });
}

// ============================================================
// ARMAS
// ============================================================

function renderWeapons() {

    Object.entries(weapons).forEach(
        ([id, weapon]) => {

            createCard(
                weapon,
                weapon.owned
                    ? "EQUIPAR"
                    : "COMPRAR",

                () => {

                    if (!weapon.owned) {

                        if (money < weapon.price) {
                            alert("Dinheiro insuficiente.");
                            return;
                        }

                        const free =
                            inventory.findIndex(
                                x => x === null
                            );

                        if (free === -1) {
                            alert("Seu inventário está cheio.");
                            return;
                        }

                        money -= weapon.price;

                        weapon.owned = true;

                        addInventoryItem({
                            id,
                            name: weapon.name,
                            icon: weapon.icon,
                            type: "weapon"
                        });
                    }

                    equippedWeapon = id;

                    updateHUD();
                    renderInventory();
                }
            );
        }
    );
}

// ============================================================
// MUNIÇÃO
// ============================================================

function renderAmmo() {

    Object.entries(weapons).forEach(
        ([id, weapon]) => {

            const card =
                document.createElement("div");

            card.className = "item-card";

            card.innerHTML = `
                <div class="item-icon">
                    ${weapon.icon}
                </div>

                <h3>${weapon.name}</h3>

                <p>
                    ${weapon.ammo}/${weapon.reserve}
                </p>

                <div class="item-price">
                    $${weapon.ammoPrice}
                </div>

                <button
                    class="item-button"
                    ${weapon.owned ? "" : "disabled"}
                >
                    COMPRAR MUNIÇÃO
                </button>
            `;

            card.querySelector("button").onclick =
                () => {

                    if (!weapon.owned) return;

                    if (money < weapon.ammoPrice) {
                        alert("Dinheiro insuficiente.");
                        return;
                    }

                    money -= weapon.ammoPrice;

                    weapon.reserve +=
                        weapon.ammoPack;

                    updateHUD();
                };

            shopContent.appendChild(card);
        }
    );
}

// ============================================================
// KITS
// ============================================================

function renderKits() {

    const medkitCard =
        document.createElement("div");

    medkitCard.className =
        "item-card";

    medkitCard.innerHTML = `
        <div class="item-icon">🩹</div>

        <h3>Kit médico</h3>

        <p>Recupera 50 de vida.</p>

        <p>Você possui:
        <b>${medkits}</b></p>

        <div class="item-price">$250</div>

        <button class="item-button">
            COMPRAR
        </button>

        <button class="item-button use-medkit">
            USAR
        </button>
    `;

    medkitCard.querySelector(
        "button"
    ).onclick = () => {

        if (money < 250) {
            alert("Dinheiro insuficiente.");
            return;
        }

        money -= 250;
        medkits++;

        updateHUD();
        renderKits();
    };

    medkitCard.querySelector(
        ".use-medkit"
    ).onclick = useMedkit;

    shopContent.appendChild(medkitCard);


    const speedCard =
        document.createElement("div");

    speedCard.className =
        "item-card";

    speedCard.innerHTML = `
        <div class="item-icon">⚡</div>

        <h3>Kit de velocidade</h3>

        <p>+5 de velocidade permanente.</p>

        <p>Nível:
        <b>${speedLevel}</b></p>

        <div class="item-price">$500</div>

        <button class="item-button">
            COMPRAR
        </button>
    `;

    speedCard.querySelector(
        "button"
    ).onclick = () => {

        if (money < 500) {
            alert("Dinheiro insuficiente.");
            return;
        }

        money -= 500;

        speedLevel++;

        player.speed += 5;

        updateHUD();
        renderKits();
    };

    shopContent.appendChild(speedCard);
}

// ============================================================
// USAR KIT MÉDICO
// ============================================================

function useMedkit() {

    if (medkits <= 0) {
        alert("Você não possui kits médicos.");
        return;
    }

    if (player.health >= MAX_HEALTH) {
        alert("Sua vida já está cheia.");
        return;
    }

    medkits--;

    player.health =
        Math.min(
            MAX_HEALTH,
            player.health + 50
        );

    updateHUD();

    renderKits();
}

// ============================================================
// BOMBAS
// ============================================================

function renderBombs() {

    bombs.forEach(item => {

        createCard(
            item,
            "COMPRAR",

            () => buyConsumable(item)
        );
    });
}

// ============================================================
// ARMADILHAS
// ============================================================

function renderTraps() {

    traps.forEach(item => {

        createCard(
            item,
            "COMPRAR",

            () => buyConsumable(item)
        );
    });
}

// ============================================================
// BARRICADAS
// ============================================================

function renderBarricades() {

    barricades.forEach(item => {

        createCard(
            item,
            "COMPRAR",

            () => buyConsumable(item)
        );
    });
}

// ============================================================
// COMPRAR ITEM CONSUMÍVEL
// ============================================================

function buyConsumable(item) {

    const freeSlot =
        inventory.findIndex(
            x => x === null
        );

    if (freeSlot === -1) {
        alert("Seu inventário está cheio.");
        return;
    }

    if (money < item.price) {
        alert("Dinheiro insuficiente.");
        return;
    }

    money -= item.price;

    item.owned++;

    addInventoryItem({
        id: item.id,
        name: item.name,
        icon: item.icon,
        type:
            item.id.startsWith("bomb")
                ? "bomb"
                : item.id.startsWith("trap")
                    ? "trap"
                    : "barricade",
        source: item
    });

    updateHUD();
    renderInventory();
}

// ============================================================
// TECLADO
// ============================================================

window.addEventListener(
    "keydown",
    event => {

        keys[event.key.toLowerCase()] = true;

        // NÃO deixar a página rolar
        if (
            [
                " ",
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight"
            ].includes(event.key)
        ) {
            event.preventDefault();
        }

        // INVENTÁRIO 1-5
        if (
            event.key >= "1" &&
            event.key <= "5"
        ) {

            const slot =
                Number(event.key) - 1;

            selectedInventorySlot = slot;

            useInventorySlot(slot);

            renderInventory();
        }

        if (
            event.key.toLowerCase() === "r"
        ) {
            reload();
        }
    }
);

window.addEventListener(
    "keyup",
    event => {

        keys[event.key.toLowerCase()] =
            false;
    }
);

// ============================================================
// INVENTÁRIO - USAR SLOT
// ============================================================

function useInventorySlot(slot) {

    const item = inventory[slot];

    if (!item) return;

    if (item.type === "weapon") {

        equippedWeapon = item.id;

        updateHUD();
    }

    if (item.type === "armor") {

        const armor =
            armors.find(
                a => a.id === item.id
            );

        if (armor) {

            player.hasArmor = true;
            player.armor = armor.armor;
            player.maxArmor = armor.armor;
        }
    }

    if (item.type === "friend") {

        friend =
            friends.find(
                f => f.id === item.id
            );
    }

    if (item.type === "bomb") {

        useBomb(item.source);

        item.source.owned--;

        if (item.source.owned <= 0) {
            removeInventoryItem(item.id);
        }
    }

    if (item.type === "trap") {

        placeTrap(item.source);

        item.source.owned--;

        if (item.source.owned <= 0) {
            removeInventoryItem(item.id);
        }
    }

    if (item.type === "barricade") {

        placeBarricade(item.source);

        item.source.owned--;

        if (item.source.owned <= 0) {
            removeInventoryItem(item.id);
        }
    }

    updateHUD();
}

// ============================================================
// MOVIMENTO
// ============================================================

function updatePlayer() {

    // ZERAR VELOCIDADE HORIZONTAL
    player.vx = 0;

    // MOVIMENTO
    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        player.vx = -player.speed;
        player.direction = -1;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.vx = player.speed;
        player.direction = 1;
    }

    // PULO
    if (
        (
            keys["w"] ||
            keys["arrowup"] ||
            keys[" "]
        )
        &&
        player.onGround
    ) {

        player.vy =
            -player.jumpPower;

        player.onGround = false;
    }

    // GRAVIDADE
    player.vy += 0.65;

    // MOVIMENTO
    player.x += player.vx;
    player.y += player.vy;

    // CHÃO
    const groundY =
        canvas.height - 100;

    if (
        player.y + player.height >=
        groundY
    ) {

        player.y =
            groundY - player.height;

        player.vy = 0;

        player.onGround = true;
    }

    // LIMITES
    if (player.x < 0) {
        player.x = 0;
    }

    if (
        player.x + player.width >
        canvas.width
    ) {
        player.x =
            canvas.width -
            player.width;
    }
}

// ============================================================
// TIRO
// ============================================================

function shoot() {

    if (!gameRunning) return;

    const weapon =
        weapons[equippedWeapon];

    if (!weapon) return;

    if (weapon.ammo <= 0) {
        reload();
        return;
    }

    weapon.ammo--;

    const dx =
        mouse.x -
        (
            player.x +
            player.width / 2
        );

    const dy =
        mouse.y -
        (
            player.y +
            player.height / 2
        );

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const speed = 12;

    bullets.push({
        x:
            player.x +
            player.width / 2,

        y:
            player.y +
            player.height / 2,

        vx:
            (dx / distance) *
            speed,

        vy:
            (dy / distance) *
            speed,

        damage:
            weapon.damage,

        radius: 5
    });

    updateHUD();
}

// ============================================================
// MOUSE
// ============================================================

canvas.addEventListener(
    "mousemove",
    event => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            (event.clientX - rect.left) *
            (canvas.width / rect.width);

        mouse.y =
            (event.clientY - rect.top) *
            (canvas.height / rect.height);
    }
);

canvas.addEventListener(
    "mousedown",
    () => {

        mouse.down = true;

        shoot();
    }
);

canvas.addEventListener(
    "mouseup",
    () => {

        mouse.down = false;
    }
);

// ============================================================
// RELOAD
// ============================================================

function reload() {

    const weapon =
        weapons[equippedWeapon];

    if (!weapon) return;

    if (
        weapon.ammo >=
        weapon.mag
    ) return;

    if (weapon.reserve <= 0) return;

    const needed =
        weapon.mag -
        weapon.ammo;

    const amount =
        Math.min(
            needed,
            weapon.reserve
        );

    weapon.ammo += amount;
    weapon.reserve -= amount;

    updateHUD();
}

// ============================================================
// CRIAR ZUMBIS
// ============================================================

function createZombie() {

    const type =
        zombieTypes[
            Math.floor(
                Math.random() *
                zombieTypes.length
            )
        ];

    const side =
        Math.random() < 0.5
            ? -1
            : 1;

    const zombie = {

        type: type.name,

        x:
            side === -1
                ? -100
                : canvas.width + 100,

        y:
            canvas.height -
            100 -
            type.size,

        width: type.size,
        height: type.size,

        hp: type.hp,

        maxHp: type.hp,

        speed: type.speed,

        color: type.color,

        damage: ZOMBIE_DAMAGE,

        attackCooldown: 0,

        dead: false
    };

    zombies.push(zombie);
}

// ============================================================
// CRIAR ONDA
// ============================================================

function createWave() {

    zombies = [];

    const amount =
        5 + wave * 2;

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        createZombie();
    }

    updateHUD();
}

// ============================================================
// ATUALIZAR ZUMBIS
// ============================================================

function updateZombies() {

    zombies.forEach(zombie => {

        if (zombie.dead) return;

        const dx =
            player.x -
            zombie.x;

        const distance =
            Math.abs(dx);

        if (distance > 45) {

            zombie.x +=
                Math.sign(dx) *
                zombie.speed;
        }

        if (
            zombie.attackCooldown > 0
        ) {

            zombie.attackCooldown--;
        }

        // ====================================================
        // COLISÃO COM JOGADOR
        // ====================================================

        if (
            distance <
            48
        ) {

            if (
                zombie.attackCooldown <= 0
            ) {

                damagePlayer(ZOMBIE_DAMAGE);

                // COOLDOWN IMPORTANTE:
                // evita vários hits instantâneos
                zombie.attackCooldown = 60;
            }
        }
    });
}

// ============================================================
// DANO NO JOGADOR
// ============================================================

function damagePlayer(amount) {

    // Se já morreu, não recebe mais dano
    if (gameOver || !gameRunning) {
        return;
    }

    // DANO SEMPRE LIMITADO
    amount =
        Math.max(
            0,
            Math.min(
                amount,
                ZOMBIE_DAMAGE
            )
        );

    // ARMADURA RECEBE PRIMEIRO
    if (
        player.hasArmor &&
        player.armor > 0
    ) {

        const armorDamage =
            Math.min(
                player.armor,
                amount
            );

        player.armor -=
            armorDamage;

        amount -=
            armorDamage;

        if (
            player.armor <= 0
        ) {

            player.armor = 0;
            player.hasArmor = false;
        }
    }

    // VIDA
    if (amount > 0) {

        player.health -= amount;
    }

    // GARANTE QUE NUNCA FIQUE NEGATIVA
    player.health =
        Math.max(
            0,
            player.health
        );

    updateHUD();

    // MORTE
    if (
        player.health <= 0
    ) {

        player.health = 0;

        playerDied();
    }
}

// ============================================================
// MORTE DO JOGADOR
// ============================================================

function playerDied() {

    if (gameOver) return;

    gameOver = true;
    gameRunning = false;

    mouse.down = false;

    // PARA O JOGO
    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }

    resultScore.textContent =
        score;

    // MOSTRA GAME OVER
    if (gameOverScreen) {

        gameOverScreen.style.display =
            "flex";
    }

    // GARANTE QUE O MENU POSSA SER ABERTO
    setTimeout(() => {

        if (
            gameOverScreen
        ) {

            gameOverScreen.style.display =
                "flex";
        }

    }, 100);
}

// ============================================================
// RESET TOTAL
// ============================================================

function resetEverything() {

    money = INITIAL_MONEY;

    wave = 1;

    score = 0;

    player.x = 250;
    player.y = 500;

    player.vx = 0;
    player.vy = 0;

    player.health =
        MAX_HEALTH;

    player.armor = 0;
    player.maxArmor = 0;
    player.hasArmor = false;

    player.speed = 5;

    speedLevel = 0;

    equippedWeapon =
        "pistol";

    selectedInventorySlot = 0;

    friend = null;

    medkits = 0;

    inventory = [
        null,
        null,
        null,
        null,
        null
    ];

    // RESET DAS ARMAS
    Object.entries(weapons)
        .forEach(
            ([id, weapon]) => {

                weapon.owned =
                    id === "pistol";

                weapon.ammo =
                    weapon.mag;

                weapon.reserve =
                    id === "pistol"
                        ? 30
                        : weapon.reserve;
            }
        );

    // RESET ARMADURAS
    armors.forEach(
        armor => {
            armor.owned = false;
        }
    );

    // RESET AMIGOS
    friends.forEach(
        f => {
            f.owned = false;
        }
    );

    // RESET BOMBAS
    bombs.forEach(
        b => {
            b.owned = 0;
        }
    );

    // RESET ARMADILHAS
    traps.forEach(
        t => {
            t.owned = 0;
        }
    );

    // RESET BARRICADAS
    barricades.forEach(
        b => {
            b.owned = 0;
        }
    );

    zombies = [];
    bullets = [];
    traps.length = 0;
    barricades.length = 0;

    gameOver = false;
    gameRunning = false;

    updateHUD();
    renderInventory();
}

// ============================================================
// COMEÇAR JOGO
// ============================================================

function startGame() {

    playerName =
        playerNameInput.value.trim()
        || "Jogador";

    gameOver = false;

    gameRunning = true;

    shopScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    gameScreen.style.display =
        "block";

    player.health =
        Math.min(
            MAX_HEALTH,
            player.health
        );

    updateHUD();

    createWave();

    // ========================================================
    // IMPORTANTE:
    // O LOOP COMEÇA SOZINHO.
    // NÃO PRECISA DO JOGADOR SE MEXER.
    // ========================================================

    if (animationId === null) {

        animationId =
            requestAnimationFrame(
                gameLoop
            );
    }
}

// ============================================================
// VOLTAR PARA O MENU
// ============================================================

function returnToMenu() {

    gameRunning = false;

    gameOver = false;

    if (animationId !== null) {

        cancelAnimationFrame(
            animationId
        );

        animationId = null;
    }

    gameScreen.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    shopScreen.style.display =
        "block";

    resetEverything();
}

// ============================================================
// PRÓXIMA ONDA
// ============================================================

function nextWave() {

    wave++;

    money += 250;

    createWave();

    updateHUD();
}

// ============================================================
// BALAS
// ============================================================

function updateBullets() {

    bullets.forEach(
        bullet => {

            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
        }
    );

    bullets =
        bullets.filter(
            bullet =>

                bullet.x > -50 &&
                bullet.x <
                    canvas.width + 50 &&
                bullet.y > -50 &&
                bullet.y <
                    canvas.height + 50
        );

    bullets.forEach(
        bullet => {

            zombies.forEach(
                zombie => {

                    if (zombie.dead)
                        return;

                    const dx =
                        bullet.x -
                        zombie.x;

                    const dy =
                        bullet.y -
                        zombie.y;

                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );

                    if (
                        distance <
                        zombie.width / 2
                    ) {

                        zombie.hp -=
                            bullet.damage;

                        bullet.x = -9999;

                        if (
                            zombie.hp <= 0
                        ) {

                            killZombie(
                                zombie
                            );
                        }
                    }
                }
            );
        }
    );
}

// ============================================================
// MATAR ZUMBI
// ============================================================

function killZombie(zombie) {

    if (zombie.dead)
        return;

    zombie.dead = true;

    money += 100;

    score += 100;

    updateHUD();
}

// ============================================================
// AMIGO
// ============================================================

function updateFriend() {

    if (!friend)
        return;

    const target =
        zombies.find(
            zombie =>
                !zombie.dead
        );

    if (!target)
        return;

    if (
        Math.random() <
        0.025
    ) {

        target.hp -=
            friend.damage;

        if (
            target.hp <= 0
        ) {

            killZombie(target);
        }
    }
}

// ============================================================
// BOMBAS
// ============================================================

function useBomb(bomb) {

    if (!bomb)
        return;

    zombies.forEach(
        zombie => {

            if (zombie.dead)
                return;

            zombie.hp -=
                bomb.damage;

            if (
                zombie.hp <= 0
            ) {

                killZombie(zombie);
            }
        }
    );
}

// ============================================================
// ARMADILHAS
// ============================================================

function placeTrap(trap) {

    if (!trap)
        return;

    traps.push({

        x:
            player.x +
            player.width +
            30,

        y:
            canvas.height - 120,

        damage:
            trap.damage,

        life: 600,

        source: trap
    });
}

function updateTraps() {

    traps.forEach(
        trap => {

            trap.life--;

            zombies.forEach(
                zombie => {

                    if (
                        zombie.dead
                    )
                        return;

                    const distance =
                        Math.abs(
                            zombie.x -
                            trap.x
                        );

                    if (
                        distance <
                        45
                    ) {

                        zombie.hp -=
                            trap.damage;

                        if (
                            zombie.hp <= 0
                        ) {

                            killZombie(
                                zombie
                            );
                        }
                    }
                }
            );
        }
    );

    traps =
        traps.filter(
            trap =>
                trap.life > 0
        );
}

// ============================================================
// BARRICADAS
// ============================================================

function placeBarricade(barricade) {

    if (!barricade)
        return;

    barricades.push({

        x:
            player.x +
            100,

        y:
            canvas.height - 145,

        width: 70,

        height: 70,

        hp:
            barricade.hp,

        maxHp:
            barricade.hp,

        source:
            barricade
    });
}

function updateBarricades() {

    barricades.forEach(
        barrier => {

            zombies.forEach(
                zombie => {

                    if (
                        zombie.dead
                    )
                        return;

                    if (
                        Math.abs(
                            zombie.x -
                            barrier.x
                        ) < 50
                    ) {

                        zombie.x -=
                            Math.sign(
                                zombie.x -
                                barrier.x
                            ) *
                            zombie.speed;
                    }
                }
            );
        }
    );

    barricades =
        barricades.filter(
            b => b.hp > 0
        );
}

// ============================================================
// LIMPAR ZUMBIS MORTOS
// ============================================================

function cleanupZombies() {

    zombies =
        zombies.filter(
            zombie =>
                !zombie.dead
        );

    // TODOS OS ZUMBIS MORRERAM
    if (
        gameRunning &&
        zombies.length === 0
    ) {

        nextWave();
    }
}

// ============================================================
// DESENHO DO FUNDO
// ============================================================

function drawBackground() {

    // CÉU
    ctx.fillStyle =
        "#151b27";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // LUA
    ctx.fillStyle =
        "#f5f1bd";

    ctx.beginPath();

    ctx.arc(
        1000,
        90,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // PRÉDIOS AO FUNDO
    for (
        let x = 0;
        x < canvas.width;
        x += 130
    ) {

        const height =
            120 +
            ((x * 17) % 180);

        ctx.fillStyle =
            "#202938";

        ctx.fillRect(
            x,
            canvas.height -
                100 -
                height,
            110,
            height
        );

        ctx.fillStyle =
            "#e4c45b";

        for (
            let wy = canvas.height -
                80 -
                height;

            wy <
                canvas.height -
                120;

            wy += 35
        ) {

            ctx.fillRect(
                x + 20,
                wy,
                12,
                15
            );

            ctx.fillRect(
                x + 60,
                wy,
                12,
                15
            );
        }
    }

    // CHÃO
    ctx.fillStyle =
        "#34383b";

    ctx.fillRect(
        0,
        canvas.height - 100,
        canvas.width,
        100
    );

    // ESTRADA
    ctx.fillStyle =
        "#222426";

    ctx.fillRect(
        0,
        canvas.height - 100,
        canvas.width,
        70
    );

    // FAIXAS
    ctx.strokeStyle =
        "#d6c35a";

    ctx.lineWidth = 5;

    for (
        let x = 0;
        x < canvas.width;
        x += 100
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            canvas.height - 65
        );

        ctx.lineTo(
            x + 50,
            canvas.height - 65
        );

        ctx.stroke();
    }
}

// ============================================================
// DESENHAR JOGADOR
// ============================================================

function drawPlayer() {

    ctx.fillStyle =
        player.color;

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    // CABEÇA
    ctx.fillStyle =
        "#f2c29b";

    ctx.beginPath();

    ctx.arc(
        player.x +
            player.width / 2,
        player.y - 5,
        17,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // ARMA
    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        player.direction === 1
            ? player.x + 30
            : player.x - 25,

        player.y + 28,

        35,
        7
    );
}

// ============================================================
// DESENHAR ZUMBIS
// ============================================================

function drawZombies() {

    zombies.forEach(
        zombie => {

            ctx.fillStyle =
                zombie.color;

            ctx.beginPath();

            ctx.arc(
                zombie.x,
                zombie.y,
                zombie.width / 2,
                0,
                Math.PI * 2
            );

            ctx.fill();

            // VIDA
            const barWidth =
                zombie.width;

            const hpPercentage =
                zombie.hp /
                zombie.maxHp;

            ctx.fillStyle =
                "#222";

            ctx.fillRect(
                zombie.x -
                    barWidth / 2,

                zombie.y -
                    zombie.height / 2 -
                    15,

                barWidth,
                6
            );

            ctx.fillStyle =
                "#ef4444";

            ctx.fillRect(
                zombie.x -
                    barWidth / 2,

                zombie.y -
                    zombie.height / 2 -
                    15,

                barWidth *
                    Math.max(
                        0,
                        hpPercentage
                    ),

                6
            );
        }
    );
}

// ============================================================
// DESENHAR BALAS
// ============================================================

function drawBullets() {

    ctx.fillStyle =
        "#ffe45c";

    bullets.forEach(
        bullet => {

            ctx.beginPath();

            ctx.arc(
                bullet.x,
                bullet.y,
                bullet.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    );
}

// ============================================================
// DESENHAR ARMADILHAS
// ============================================================

function drawTraps() {

    traps.forEach(
        trap => {

            ctx.fillStyle =
                "#e7b52b";

            ctx.fillRect(
                trap.x - 15,
                trap.y - 10,
                30,
                20
            );
        }
    );
}

// ============================================================
// DESENHAR BARRICADAS
// ============================================================

function drawBarricades() {

    barricades.forEach(
        barrier => {

            ctx.fillStyle =
                "#8b5a2b";

            ctx.fillRect(
                barrier.x,
                barrier.y,
                barrier.width,
                barrier.height
            );

            const hp =
                barrier.hp /
                barrier.maxHp;

            ctx.fillStyle =
                "#222";

            ctx.fillRect(
                barrier.x,
                barrier.y - 10,
                barrier.width,
                6
            );

            ctx.fillStyle =
                "#44cc66";

            ctx.fillRect(
                barrier.x,
                barrier.y - 10,
                barrier.width * hp,
                6
            );
        }
    );
}

// ============================================================
// DESENHAR AMIGO
// ============================================================

function drawFriend() {

    if (!friend)
        return;

    ctx.font = "35px Arial";

    ctx.fillText(
        friend.icon,
        player.x - 50,
        player.y + 40
    );
}

// ============================================================
// GAME LOOP
// ============================================================

function gameLoop() {

    // ========================================================
    // O LOOP CONTINUA MESMO QUANDO O PLAYER ESTÁ PARADO
    // ========================================================

    if (!gameRunning) {

        animationId = null;

        return;
    }

    // ATUALIZAÇÃO
    updatePlayer();

    updateZombies();

    updateBullets();

    updateFriend();

    updateTraps();

    updateBarricades();

    cleanupZombies();

    // ========================================================
    // TIRO AUTOMÁTICO CONTÍNUO
    // ========================================================

    if (
        mouse.down
    ) {

        shoot();
    }

    // DESENHO
    drawBackground();

    drawBarricades();

    drawTraps();

    drawZombies();

    drawBullets();

    drawFriend();

    drawPlayer();

    updateHUD();

    // ========================================================
    // PRÓXIMO FRAME
    // ========================================================

    animationId =
        requestAnimationFrame(
            gameLoop
        );
}

// ============================================================
// BOTÕES DA LOJA
// ============================================================

document.querySelectorAll(
    ".category-btn"
).forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                showCategory(
                    button.dataset.category
                );
            }
        );
    }
);

// ============================================================
// BOTÃO COMEÇAR
// ============================================================

const startButton =
    document.getElementById(
        "startWave"
    );

if (startButton) {

    startButton.addEventListener(
        "click",
        startGame
    );
}

// ============================================================
// BOTÃO REINICIAR
// ============================================================

const restartButton =
    document.getElementById(
        "restartButton"
    );

if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => {

            resetEverything();

            shopScreen.style.display =
                "block";

            gameScreen.style.display =
                "none";

            gameOverScreen.style.display =
                "none";

            renderInventory();

            showCategory(
                "armas"
            );
        }
    );
}

// ============================================================
// BOTÃO VOLTAR AO MENU
// ============================================================

const menuButton =
    document.getElementById(
        "menuButton"
    );

if (menuButton) {

    menuButton.addEventListener(
        "click",
        returnToMenu
    );
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

resetEverything();

shopScreen.style.display =
    "block";

gameScreen.style.display =
    "none";

gameOverScreen.style.display =
    "none";

renderInventory();

showCategory("armas");

updateHUD();
