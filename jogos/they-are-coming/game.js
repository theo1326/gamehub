"use strict";

/*
=========================================================
THEY ARE COMING
LUDIX
=========================================================
*/


/* =====================================================
   ELEMENTOS
===================================================== */

const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");

const shopScreen =
    document.getElementById("shopScreen");

const shopContent =
    document.getElementById("shopContent");

const moneyEl =
    document.getElementById("money");

const playerNameInput =
    document.getElementById("playerName");

const nameWarning =
    document.getElementById("nameWarning");

const startWaveBtn =
    document.getElementById("startWaveBtn");

const rankingBtn =
    document.getElementById("rankingBtn");

const rankingScreen =
    document.getElementById("rankingScreen");

const rankingContent =
    document.getElementById("rankingContent");

const closeRankingBtn =
    document.getElementById("closeRankingBtn");

const hud =
    document.getElementById("hud");

const nameHud =
    document.getElementById("nameHud");

const healthBar =
    document.getElementById("healthBar");

const armorBar =
    document.getElementById("armorBar");

const waveEl =
    document.getElementById("wave");

const enemiesEl =
    document.getElementById("enemies");

const weaponEl =
    document.getElementById("weapon");

const ammoEl =
    document.getElementById("ammo");

const moneyHud =
    document.getElementById("moneyHud");

const menuInventory =
    document.getElementById("menuInventory");

const gameInventory =
    document.getElementById("gameInventory");

const gameInventorySlots =
    document.getElementById("gameInventorySlots");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const restartBtn =
    document.getElementById("restartBtn");

const skipPreparationBtn =
    document.getElementById("skipPreparationBtn");


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const MAX_HEALTH_START = 100;

const INVENTORY_SIZE = 5;

const NORMAL_ZOMBIE_REWARD = 50;


/* =====================================================
   CANVAS
===================================================== */

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =====================================================
   ARMAS
===================================================== */

const weapons = [

    {
        name:"Pistola",
        damage:18,
        fireRate:350,
        magazine:12,
        ammo:50,
        price:100,
        range:700,
        ammoType:"9mm",
        visual:"🔫"
    },

    {
        name:"Glock 17",
        damage:22,
        fireRate:300,
        magazine:17,
        ammo:68,
        price:450,
        range:700,
        ammoType:"9mm+",
        visual:"🔫"
    },

    {
        name:"Desert Eagle",
        damage:55,
        fireRate:650,
        magazine:7,
        ammo:35,
        price:900,
        range:750,
        ammoType:".50 AE",
        visual:"🔫"
    },

    {
        name:"Uzi",
        damage:16,
        fireRate:100,
        magazine:32,
        ammo:160,
        price:850,
        range:650,
        ammoType:"9mm SMG",
        visual:"🔫"
    },

    {
        name:"MP5",
        damage:22,
        fireRate:110,
        magazine:30,
        ammo:150,
        price:1200,
        range:700,
        ammoType:"9mm SMG+",
        visual:"🔫"
    },

    {
        name:"MP7",
        damage:24,
        fireRate:90,
        magazine:40,
        ammo:200,
        price:1400,
        range:680,
        ammoType:"4.6mm",
        visual:"🔫"
    },

    {
        name:"P90",
        damage:25,
        fireRate:75,
        magazine:50,
        ammo:250,
        price:1700,
        range:700,
        ammoType:"5.7mm",
        visual:"🔫"
    },

    {
        name:"Shotgun",
        damage:80,
        fireRate:850,
        magazine:6,
        ammo:36,
        price:1100,
        range:450,
        ammoType:"12 Gauge",
        visual:"🔫"
    },

    {
        name:"Double Barrel",
        damage:115,
        fireRate:1100,
        magazine:2,
        ammo:24,
        price:1500,
        range:430,
        ammoType:"12 Gauge+",
        visual:"🔫"
    },

    {
        name:"Mossberg",
        damage:100,
        fireRate:750,
        magazine:8,
        ammo:48,
        price:1900,
        range:470,
        ammoType:"12 Gauge Tactical",
        visual:"🔫"
    },

    {
        name:"AK-47",
        damage:38,
        fireRate:180,
        magazine:30,
        ammo:150,
        price:2500,
        range:850,
        ammoType:"7.62mm",
        visual:"🔫"
    },

    {
        name:"M4A1",
        damage:32,
        fireRate:130,
        magazine:30,
        ammo:180,
        price:3000,
        range:900,
        ammoType:"5.56mm",
        visual:"🔫"
    },

    {
        name:"SCAR-H",
        damage:48,
        fireRate:210,
        magazine:20,
        ammo:100,
        price:4000,
        range:1000,
        ammoType:"7.62 NATO",
        visual:"🔫"
    },

    {
        name:"FAL",
        damage:55,
        fireRate:260,
        magazine:20,
        ammo:100,
        price:4500,
        range:1100,
        ammoType:"7.62 FAL",
        visual:"🔫"
    },

    {
        name:"Sniper",
        damage:180,
        fireRate:1400,
        magazine:5,
        ammo:30,
        price:6000,
        range:1600,
        ammoType:"7.62 Sniper",
        visual:"🎯"
    },

    {
        name:"Barrett",
        damage:350,
        fireRate:2200,
        magazine:5,
        ammo:25,
        price:10000,
        range:2200,
        ammoType:".50 BMG",
        visual:"🎯"
    },

    {
        name:"M249",
        damage:35,
        fireRate:100,
        magazine:100,
        ammo:500,
        price:8000,
        range:950,
        ammoType:"5.56 LMG",
        visual:"🔫"
    },

    {
        name:"M60",
        damage:60,
        fireRate:180,
        magazine:100,
        ammo:400,
        price:11000,
        range:1000,
        ammoType:"7.62 LMG",
        visual:"🔫"
    },

    {
        name:"Flamethrower",
        damage:45,
        fireRate:100,
        magazine:80,
        ammo:320,
        price:13000,
        range:350,
        ammoType:"Combustível",
        visual:"🔥"
    },

    {
        name:"Crossbow",
        damage:220,
        fireRate:1100,
        magazine:1,
        ammo:20,
        price:7500,
        range:1000,
        ammoType:"Flechas",
        visual:"🏹"
    },

    {
        name:"Rocket Launcher",
        damage:700,
        fireRate:2500,
        magazine:1,
        ammo:10,
        price:15000,
        range:1400,
        ammoType:"Foguetes",
        visual:"🚀"
    },

    {
        name:"Grenade Launcher",
        damage:500,
        fireRate:1700,
        magazine:6,
        ammo:30,
        price:18000,
        range:900,
        ammoType:"Granadas",
        visual:"💥"
    },

    {
        name:"Laser Rifle",
        damage:600,
        fireRate:500,
        magazine:20,
        ammo:100,
        price:22000,
        range:1800,
        ammoType:"Células Laser",
        visual:"⚡"
    },

    {
        name:"Plasma Rifle",
        damage:900,
        fireRate:800,
        magazine:12,
        ammo:60,
        price:28000,
        range:2000,
        ammoType:"Plasma",
        visual:"⚡"
    },

    {
        name:"Railgun",
        damage:1800,
        fireRate:2500,
        magazine:3,
        ammo:15,
        price:40000,
        range:2500,
        ammoType:"Projéteis Rail",
        visual:"⚡"
    }
];


/* =====================================================
   15 ARMAS CORPO A CORPO
===================================================== */

const meleeWeapons = [

    {
        name:"Faca",
        damage:45,
        fireRate:450,
        range:75,
        price:150,
        visual:"🔪"
    },

    {
        name:"Faca Tática",
        damage:60,
        fireRate:420,
        range:80,
        price:350,
        visual:"🔪"
    },

    {
        name:"Bastão",
        damage:70,
        fireRate:550,
        range:90,
        price:500,
        visual:"🏏"
    },

    {
        name:"Taco de Beisebol",
        damage:90,
        fireRate:650,
        range:105,
        price:750,
        visual:"🏏"
    },

    {
        name:"Machado",
        damage:130,
        fireRate:850,
        range:90,
        price:1200,
        visual:"🪓"
    },

    {
        name:"Machado Pesado",
        damage:190,
        fireRate:1050,
        range:100,
        price:2200,
        visual:"🪓"
    },

    {
        name:"Facão",
        damage:150,
        fireRate:650,
        range:100,
        price:1800,
        visual:"⚔️"
    },

    {
        name:"Katana",
        damage:220,
        fireRate:550,
        range:125,
        price:3500,
        visual:"⚔️"
    },

    {
        name:"Marreta",
        damage:300,
        fireRate:1300,
        range:100,
        price:5000,
        visual:"🔨"
    },

    {
        name:"Lança",
        damage:260,
        fireRate:850,
        range:150,
        price:4500,
        visual:"🔱"
    },

    {
        name:"Foice",
        damage:350,
        fireRate:1000,
        range:125,
        price:7000,
        visual:"⚔️"
    },

    {
        name:"Espada",
        damage:400,
        fireRate:650,
        range:135,
        price:8500,
        visual:"🗡️"
    },

    {
        name:"Espada Pesada",
        damage:600,
        fireRate:1100,
        range:145,
        price:12000,
        visual:"🗡️"
    },

    {
        name:"Martelo de Guerra",
        damage:800,
        fireRate:1500,
        range:120,
        price:18000,
        visual:"🔨"
    },

    {
        name:"Lâmina Demoníaca",
        damage:1200,
        fireRate:650,
        range:160,
        price:30000,
        visual:"⚔️"
    }
];


/* =====================================================
   ARMADURAS
===================================================== */

const armors = [

    {
        name:"Colete Leve",
        armor:20,
        price:500,
        icon:"🛡️"
    },

    {
        name:"Colete Tático",
        armor:40,
        price:1200,
        icon:"🛡️"
    },

    {
        name:"Armadura Pesada",
        armor:60,
        price:2500,
        icon:"🛡️"
    },

    {
        name:"Armadura Militar",
        armor:80,
        price:4500,
        icon:"🛡️"
    },

    {
        name:"Armadura Especial",
        armor:100,
        price:7000,
        icon:"🛡️"
    }
];


/* =====================================================
   AMIGOS
===================================================== */

const friends = [

    {
        name:"Cachorro",
        damage:10,
        price:1000,
        icon:"🐕"
    },

    {
        name:"Rottweiler",
        damage:18,
        price:2000,
        icon:"🐕"
    },

    {
        name:"Leopardo",
        damage:25,
        price:3500,
        icon:"🐆"
    },

    {
        name:"Tigre",
        damage:35,
        price:5000,
        icon:"🐅"
    },

    {
        name:"Leão",
        damage:50,
        price:7500,
        icon:"🦁"
    },

    {
        name:"Velociraptor",
        damage:70,
        price:20000,
        icon:"🦖"
    },

    {
        name:"Lobo",
        damage:65,
        price:11000,
        icon:"🐺"
    },

    {
        name:"Urso",
        damage:100,
        price:15000,
        icon:"🐻"
    },

    {
        name:"Gorila",
        damage:130,
        price:22000,
        icon:"🦍"
    },

    {
        name:"T-Rex",
        damage:250,
        price:50000,
        icon:"🦖"
    }
];


/* =====================================================
   KITS
===================================================== */

const kits = [

    {
        name:"Kit Médico",
        heal:30,
        price:300,
        icon:"🩹"
    },

    {
        name:"Kit Médico Grande",
        heal:70,
        price:700,
        icon:"🏥"
    },

    {
        name:"+5 Vida Máxima",
        permanentHealth:5,
        price:1000,
        icon:"❤️"
    }
];


/* =====================================================
   BOMBAS
   +150 DE RAIO
===================================================== */

const bombs = [

    {
        name:"Granada",
        damage:100,
        radius:250,
        price:300,
        icon:"💣"
    },

    {
        name:"Granada Explosiva",
        damage:180,
        radius:280,
        price:600,
        icon:"💣"
    },

    {
        name:"Bomba Pesada",
        damage:300,
        radius:310,
        price:1000,
        icon:"💥"
    },

    {
        name:"C4",
        damage:500,
        radius:340,
        price:1800,
        icon:"🧨"
    },

    {
        name:"Mina Explosiva",
        damage:350,
        radius:290,
        price:1200,
        icon:"💣"
    },

    {
        name:"Bomba Incendiária",
        damage:250,
        radius:300,
        price:1400,
        icon:"🔥"
    },

    {
        name:"Granada de Plasma",
        damage:600,
        radius:330,
        price:3000,
        icon:"⚡"
    },

    {
        name:"Bomba Nuclear",
        damage:1500,
        radius:450,
        price:10000,
        icon:"☢️"
    },

    {
        name:"Bomba Infernal",
        damage:2500,
        radius:500,
        price:20000,
        icon:"🔥"
    },

    {
        name:"Bomba Apocalipse",
        damage:5000,
        radius:600,
        price:40000,
        icon:"☢️"
    }
];


/* =====================================================
   ARMADILHAS
===================================================== */

const traps = [

    {
        name:"Espinhos",
        damage:30,
        price:150,
        icon:"🪤"
    },

    {
        name:"Armadilha de Ferro",
        damage:60,
        price:300,
        icon:"⚙️"
    },

    {
        name:"Lâminas",
        damage:100,
        price:600,
        icon:"⚔️"
    },

    {
        name:"Armadilha Elétrica",
        damage:150,
        price:900,
        icon:"⚡"
    },

    {
        name:"Armadilha Infernal",
        damage:500,
        price:5000,
        icon:"🔥"
    }
];


/* =====================================================
   BARRICADAS
===================================================== */

const barricades = [

    {
        name:"Barricada de Madeira",
        health:100,
        price:200,
        icon:"🧱"
    },

    {
        name:"Barricada Reforçada",
        health:250,
        price:500,
        icon:"🧱"
    },

    {
        name:"Barricada de Ferro",
        health:500,
        price:1000,
        icon:"🔩"
    },

    {
        name:"Muralha Militar",
        health:2000,
        price:5000,
        icon:"🏰"
    },

    {
        name:"Fortaleza",
        health:60000,
        price:100000,
        icon:"🏯"
    }
];


/* =====================================================
   ZUMBIS ESPECIAIS
===================================================== */

const zombieTypes = [

    {
        name:"Walker",
        health:60,
        speed:45,
        damage:5,
        color:"#76a35d",
        size:1
    },

    {
        name:"Runner",
        health:45,
        speed:90,
        damage:7,
        color:"#d6d65c",
        size:.85
    },

    {
        name:"Brute",
        health:180,
        speed:35,
        damage:12,
        color:"#7d4f9e",
        size:1.35
    },

    {
        name:"Crawler",
        health:80,
        speed:75,
        damage:8,
        color:"#568e92",
        size:.7
    },

    {
        name:"Soldier",
        health:130,
        speed:55,
        damage:10,
        color:"#68736a",
        size:1
    },

    {
        name:"Mutant",
        health:300,
        speed:45,
        damage:15,
        color:"#ba4f76",
        size:1.25
    },

    {
        name:"Burning",
        health:220,
        speed:60,
        damage:18,
        color:"#e45c32",
        size:1.1
    },

    {
        name:"Toxic",
        health:250,
        speed:50,
        damage:20,
        color:"#55d56a",
        size:1.05
    }
];


/* =====================================================
   ESTADO DO JOGADOR
===================================================== */

let player = {

    x:180,
    y:0,

    speed:250,

    health:MAX_HEALTH_START,

    maxHealth:MAX_HEALTH_START,

    armor:0,

    maxArmor:0,

    money:500,

    score:0,

    weapon:null,

    ammo:0,

    reserveAmmo:0,

    lastShot:0,

    reloadTime:0
};


/* =====================================================
   ESTADO
===================================================== */

let weaponInventory = [];

let selectedWeapon = 0;

let itemInventory = [];

let currentCategory = "armadura";

let wave = 1;

let waveActive = false;

let preparation = false;

let preparationTime = 30;

let gameRunning = false;

let gameEnded = false;

let zombies = [];

let bullets = [];

let placedTraps = [];

let placedBarricades = [];

let friend = null;

let rankingSent = false;

let keys = {};

let mouse = {
    x:0,
    y:0,
    down:false
};

let lastTime =
    performance.now();


/* =====================================================
   PREPARAÇÃO
===================================================== */

function getPreparationTime() {

    return Math.max(
        15,
        30 - ((wave - 1) * 5)
    );
}


/* =====================================================
   NOME
===================================================== */

function getPlayerName() {

    return playerNameInput.value
        .trim()
        .replace(/\s+/g," ")
        .slice(0,16);
}


function validatePlayerName() {

    if (!getPlayerName()) {

        nameWarning.style.display =
            "block";

        playerNameInput.focus();

        return false;
    }

    nameWarning.style.display =
        "none";

    return true;
}


playerNameInput.addEventListener(
    "input",
    () => {

        if (getPlayerName()) {

            nameWarning.style.display =
                "none";
        }
    }
);


/* =====================================================
   VISUAIS
===================================================== */

function itemVisual(item,type) {

    if (item.visual)
        return item.visual;

    if (item.icon)
        return item.icon;

    const defaults = {

        armadura:"🛡️",

        amigos:"🐾",

        corpo:"⚔️",

        municao:"📦",

        kits:"🩹",

        bombas:"💣",

        armadilhas:"🪤",

        barricadas:"🧱"
    };

    return defaults[type] || "📦";
}


/* =====================================================
   DESCRIÇÕES
===================================================== */

function itemDescription(item,type) {

    if (type === "armas") {

        return `
            Dano: ${item.damage}<br>
            Carregador: ${item.magazine}<br>
            Munição: ${item.ammoType}
        `;
    }

    if (type === "corpo") {

        return `
            Dano: ${item.damage}<br>
            Alcance: ${item.range}
        `;
    }

    if (type === "armadura")
        return `Proteção: ${item.armor}`;

    if (type === "amigos")
        return `Dano: ${item.damage}`;

    if (type === "kits") {

        if (item.permanentHealth)
            return `Vida máxima +${item.permanentHealth}`;

        return `Recupera ${item.heal} de vida`;
    }

    if (type === "bombas") {

        return `
            Dano: ${item.damage}<br>
            Área: ${item.radius}
        `;
    }

    if (type === "armadilhas")
        return `Dano: ${item.damage}`;

    if (type === "barricadas")
        return `Resistência: ${item.health}`;

    return "Item especial";
}


/* =====================================================
   LISTA DA CATEGORIA
===================================================== */

function getCategoryItems() {

    switch(currentCategory) {

        case "armadura":
            return armors;

        case "amigos":
            return friends;

        case "armas":
            return weapons;

        case "corpo":
            return meleeWeapons;

        case "kits":
            return kits;

        case "bombas":
            return bombs;

        case "armadilhas":
            return traps;

        case "barricadas":
            return barricades;

        default:
            return [];
    }
}


/* =====================================================
   LOJA
===================================================== */

function renderItems() {

    shopContent.innerHTML = "";

    if (currentCategory === "municao") {

        renderAmmoShop();

        return;
    }

    const items =
        getCategoryItems();

    items.forEach(
        (item,index) => {

            const card =
                document.createElement("div");

            card.className =
                "shop-item";

            const ownedWeapon =
                (
                    currentCategory === "armas" ||
                    currentCategory === "corpo"
                ) &&
                weaponInventory.some(
                    w => w.name === item.name
                );

            const equipped =
                player.weapon &&
                player.weapon.name === item.name;

            if (equipped)
                card.classList.add("equipped");

            card.innerHTML = `

                <div class="item-visual">
                    ${itemVisual(
                        item,
                        currentCategory
                    )}
                </div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${itemDescription(
                        item,
                        currentCategory
                    )}
                </p>

                <strong>
                    $${item.price.toLocaleString("pt-BR")}
                </strong>

                <button
                    data-index="${index}">

                    ${
                        equipped
                            ? "EQUIPADO"
                            : ownedWeapon
                            ? "EQUIPAR"
                            : "COMPRAR"
                    }

                </button>
            `;

            const button =
                card.querySelector("button");

            if (equipped)
                button.disabled = true;

            button.addEventListener(
                "click",
                () => {

                    buyItem(index);
                }
            );

            shopContent.appendChild(card);
        }
    );
}


/* =====================================================
   LOJA DE MUNIÇÃO
===================================================== */

function renderAmmoShop() {

    if (!player.weapon) {

        shopContent.innerHTML = `
            <div class="shop-item">

                <div class="item-visual">
                    📦
                </div>

                <h3>Compre uma arma primeiro</h3>

                <p>
                    A munição é específica para
                    cada arma.
                </p>

            </div>
        `;

        return;
    }

    const weaponIndex =
        weapons.findIndex(
            w => w.name === player.weapon.name
        );

    let ammoPrice =
        100 + Math.max(
            0,
            weaponIndex
        ) * 50;

    if (weaponIndex < 0)
        ammoPrice = 1000;

    shopContent.innerHTML = `

        <div class="shop-item">

            <div class="item-visual">
                📦
            </div>

            <h3>
                ${player.weapon.ammoType}
            </h3>

            <p>
                Munição exclusiva para
                ${player.weapon.name}.
                <br>
                +50 tiros
            </p>

            <strong>
                $${ammoPrice.toLocaleString("pt-BR")}
            </strong>

            <button id="buyAmmoBtn">
                COMPRAR
            </button>

        </div>

        <div class="shop-item">

            <div class="item-visual">
                🔄
            </div>

            <h3>
                Munição Atual
            </h3>

            <p>
                Reservatório atual:
                ${player.reserveAmmo}
            </p>

            <strong>
                ${player.weapon.ammoType}
            </strong>

        </div>
    `;

    document
        .getElementById("buyAmmoBtn")
        .addEventListener(
            "click",
            () => {

                buyAmmo(
                    ammoPrice
                );
            }
        );
}


/* =====================================================
   COMPRAR
===================================================== */

function buyItem(index) {

    const items =
        getCategoryItems();

    const item =
        items[index];

    if (!item)
        return;


    /*
    ARMAS
    */

    if (
        currentCategory === "armas" ||
        currentCategory === "corpo"
    ) {

        const existing =
            weaponInventory.find(
                w => w.name === item.name
            );

        if (existing) {

            equipWeapon(
                weaponInventory.indexOf(
                    existing
                )
            );

            return;
        }

        if (
            weaponInventory.length >=
            INVENTORY_SIZE
        ) {

            alert(
                "Os 5 espaços de armas estão cheios!"
            );

            return;
        }

        if (
            player.money <
            item.price
        ) {

            alert(
                "Dinheiro insuficiente!"
            );

            return;
        }

        player.money -=
            item.price;

        const copy =
            {
                ...item,

                currentAmmo:
                    currentCategory === "corpo"
                        ? Infinity
                        : item.magazine,

                reserveAmmo:
                    currentCategory === "corpo"
                        ? Infinity
                        : item.ammo,

                type:
                    currentCategory === "corpo"
                        ? "melee"
                        : "gun"
            };

        weaponInventory.push(copy);

        equipWeapon(
            weaponInventory.length - 1
        );

        updateHUD();

        renderItems();

        renderWeaponInventory();

        return;
    }


    /*
    ARMADURA
    */

    if (currentCategory === "armadura") {

        if (
            player.money <
            item.price
        ) {

            alert("Dinheiro insuficiente!");

            return;
        }

        player.money -=
            item.price;

        player.armor =
            item.armor;

        player.maxArmor =
            item.armor;

        updateHUD();

        renderItems();

        return;
    }


    /*
    AMIGOS
    */

    if (currentCategory === "amigos") {

        if (
            player.money <
            item.price
        ) {

            alert("Dinheiro insuficiente!");

            return;
        }

        player.money -=
            item.price;

        friend = {

            name:item.name,

            damage:item.damage,

            icon:item.icon,

            lastAttack:0
        };

        updateHUD();

        renderItems();

        return;
    }


    /*
    KITS
    */

    if (currentCategory === "kits") {

        if (
            player.money <
            item.price
        ) {

            alert("Dinheiro insuficiente!");

            return;
        }

        player.money -=
            item.price;

        if (item.permanentHealth) {

            player.maxHealth +=
                item.permanentHealth;

            player.health +=
                item.permanentHealth;

        } else {

            player.health =
                Math.min(
                    player.maxHealth,
                    player.health +
                    item.heal
                );
        }

        updateHUD();

        renderItems();

        return;
    }


    /*
    BOMBAS
    */

    if (currentCategory === "bombas") {

        if (
            player.money <
            item.price
        ) {

            alert("Dinheiro insuficiente!");

            return;
        }

        if (
            itemInventory.length >=
            INVENTORY_SIZE
        ) {

            alert(
                "Inventário de itens cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        itemInventory.push({
            type:"bomb",
            item:item
        });

        renderItems();

        return;
    }


    /*
    ARMADILHAS
    */

    if (currentCategory === "armadilhas") {

        if (
            player.money <
            item.price
        ) {

            alert("Dinheiro insuficiente!");

            return;
        }

        if (
            itemInventory.length >=
            INVENTORY_SIZE
        ) {

            alert(
                "Inventário de itens cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        itemInventory.push({
            type:"trap",
            item:item
        });

        renderItems();

        return;
    }


    /*
    BARRICADAS
    */

    if (currentCategory === "barricadas") {

        if (
            player.money <
            item.price
        ) {

            alert("Dinheiro insuficiente!");

            return;
        }

        if (
            itemInventory.length >=
            INVENTORY_SIZE
        ) {

            alert(
                "Inventário de itens cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        itemInventory.push({
            type:"barricade",
            item:item
        });

        renderItems();

        return;
    }
}


/* =====================================================
   COMPRAR MUNIÇÃO
===================================================== */

function buyAmmo(price) {

    if (!player.weapon)
        return;

    if (
        player.money <
        price
    ) {

        alert("Dinheiro insuficiente!");

        return;
    }

    if (
        player.weapon.type === "melee"
    ) {

        alert(
            "Armas corpo a corpo não usam munição."
        );

        return;
    }

    player.money -=
        price;

    player.weapon.reserveAmmo +=
        50;

    syncWeaponAmmo();

    updateHUD();

    renderAmmoShop();
}


/* =====================================================
   EQUIPAR ARMA
===================================================== */

function equipWeapon(index) {

    if (
        !weaponInventory[index]
    )
        return;

    selectedWeapon =
        index;

    player.weapon =
        weaponInventory[index];

    syncWeaponAmmo();

    renderWeaponInventory();

    renderItems();

    updateHUD();
}


function syncWeaponAmmo() {

    if (!player.weapon)
        return;

    if (
        player.weapon.type === "melee"
    ) {

        player.ammo = Infinity;

        player.reserveAmmo = Infinity;

        return;
    }

    player.ammo =
        player.weapon.currentAmmo;

    player.reserveAmmo =
        player.weapon.reserveAmmo;
}


/* =====================================================
   INVENTÁRIO DE ARMAS
===================================================== */

function renderWeaponInventory() {

    menuInventory.innerHTML = "";

    gameInventorySlots.innerHTML = "";

    for (
        let i = 0;
        i < INVENTORY_SIZE;
        i++
    ) {

        const slot =
            document.createElement("div");

        slot.className =
            "inventory-slot";

        const gameSlot =
            document.createElement("div");

        gameSlot.className =
            "inventory-slot";

        if (
            weaponInventory[i]
        ) {

            const weapon =
                weaponInventory[i];

            slot.innerHTML = `
                <span class="slot-number">
                    ${i + 1}
                </span>

                <span>
                    ${weapon.visual}
                </span>

                <span class="slot-name">
                    ${weapon.name}
                </span>
            `;

            gameSlot.innerHTML =
                slot.innerHTML;

            if (
                i === selectedWeapon
            ) {

                slot.classList.add(
                    "selected"
                );

                gameSlot.classList.add(
                    "selected"
                );
            }

        } else {

            slot.classList.add(
                "empty"
            );

            gameSlot.classList.add(
                "empty"
            );

            slot.innerHTML =
                `<span>${i + 1}</span>`;

            gameSlot.innerHTML =
                `<span>${i + 1}</span>`;
        }

        slot.addEventListener(
            "click",
            () => {

                if (
                    weaponInventory[i]
                ) {

                    equipWeapon(i);
                }
            }
        );

        gameSlot.addEventListener(
            "click",
            () => {

                if (
                    weaponInventory[i]
                ) {

                    equipWeapon(i);
                }
            }
        );

        menuInventory.appendChild(
            slot
        );

        gameInventorySlots.appendChild(
            gameSlot
        );
    }
}


/* =====================================================
   CONTROLES
===================================================== */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        if (
            ["1","2","3","4","5"]
            .includes(event.key)
        ) {

            equipWeapon(
                Number(event.key) - 1
            );
        }

        if (
            key === "r"
        ) {

            reload();
        }

        if (
            key === "e"
        ) {

            useItemInventory();
        }

        if (
            event.key === " "
        ) {

            event.preventDefault();
        }
    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);


canvas.addEventListener(
    "mousemove",
    event => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            event.clientX -
            rect.left;

        mouse.y =
            event.clientY -
            rect.top;
    }
);


canvas.addEventListener(
    "mousedown",
    () => {

        mouse.down = true;
    }
);


canvas.addEventListener(
    "mouseup",
    () => {

        mouse.down = false;
    }
);


canvas.addEventListener(
    "mouseleave",
    () => {

        mouse.down = false;
    }
);


/* =====================================================
   INICIAR JOGO
===================================================== */

function startWave() {

    if (gameEnded)
        return;

    if (
        !validatePlayerName()
    )
        return;

    if (
        weaponInventory.length === 0
    ) {

        /*
        Arma inicial gratuita.
        */

        const starter =
            {
                ...weapons[0],

                currentAmmo:
                    weapons[0].magazine,

                reserveAmmo:
                    weapons[0].ammo,

                type:"gun"
            };

        weaponInventory.push(
            starter
        );

        equipWeapon(0);
    }

    shopScreen.style.display =
        "none";

    canvas.style.display =
        "block";

    hud.style.display =
        "grid";

    gameInventory.style.display =
        "block";

    gameRunning = true;

    gameEnded = false;

    waveActive = false;

    preparation = true;

    preparationTime =
        getPreparationTime();

    player.x = 180;

    player.y =
        canvas.height / 2;

    zombies = [];

    bullets = [];

    placedTraps = [];

    placedBarricades = [];

    skipPreparationBtn.style.display =
        "block";

    updateHUD();
}


startWaveBtn.addEventListener(
    "click",
    startWave
);


/* =====================================================
   PULAR PREPARAÇÃO
===================================================== */

skipPreparationBtn.addEventListener(
    "click",
    () => {

        if (!preparation)
            return;

        preparationTime = 0;

        startCurrentWave();
    }
);


/* =====================================================
   PREPARAÇÃO
===================================================== */

function updatePreparation(dt) {

    preparationTime -=
        dt;

    if (
        preparationTime <= 0
    ) {

        preparationTime = 0;

        startCurrentWave();
    }
}


function startCurrentWave() {

    preparation = false;

    waveActive = true;

    skipPreparationBtn.style.display =
        "none";

    spawnWave();

    updateHUD();
}


/* =====================================================
   SPAWN DA ONDA
===================================================== */

function spawnWave() {

    zombies = [];


    /*
    A cada 10 ondas aparece
    somente o Boss.
    */

    if (
        wave % 10 === 0
    ) {

        const bossLevel =
            wave / 10;

        const bossHealth =
            500 *
            Math.pow(
                2,
                bossLevel - 1
            );

        const bossReward =
            5000 *
            Math.pow(
                2,
                bossLevel - 1
            );

        zombies.push({

            x:
                canvas.width + 180,

            y:
                canvas.height / 2,

            width:110,

            height:140,

            health:bossHealth,

            maxHealth:bossHealth,

            speed:20,

            damage:999,

            reward:bossReward,

            boss:true,

            color:"#8b1625",

            attackCooldown:0,

            size:1.8
        });

        return;
    }


    const amount =
        5 +
        wave * 3;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        let available =
            zombieTypes;

        /*
        A partir da onda 5,
        especiais entram em todas
        as ondas.
        */

        if (
            wave < 5
        ) {

            available =
                zombieTypes.slice(
                    0,
                    2
                );
        } else {

            available =
                zombieTypes;
        }

        const type =
            available[
                Math.floor(
                    Math.random() *
                    available.length
                )
            ];


        /*
        +5 HP por onda a partir da 5.
        */

        const extraHP =
            wave >= 5
                ? (wave - 4) * 5
                : 0;


        const hp =
            type.health +
            extraHP +
            Math.max(
                0,
                wave - 1
            ) * 8;


        zombies.push({

            x:
                canvas.width +
                80 +
                Math.random() * 300,

            y:
                80 +
                Math.random() *
                Math.max(
                    100,
                    canvas.height - 160
                ),

            width:
                40 *
                type.size,

            height:
                60 *
                type.size,

            health:hp,

            maxHealth:hp,

            speed:type.speed,

            damage:type.damage,

            reward:
                NORMAL_ZOMBIE_REWARD,

            color:type.color,

            size:type.size,

            type:type.name,

            attackCooldown:0,

            boss:false
        });
    }
}


/* =====================================================
   JOGADOR
===================================================== */

function updatePlayer(dt) {

    let dx = 0;
    let dy = 0;

    if (
        keys["w"] ||
        keys["arrowup"]
    )
        dy--;

    if (
        keys["s"] ||
        keys["arrowdown"]
    )
        dy++;

    if (
        keys["a"] ||
        keys["arrowleft"]
    )
        dx--;

    if (
        keys["d"] ||
        keys["arrowright"]
    )
        dx++;


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const len =
            Math.hypot(
                dx,
                dy
            );

        dx /= len;
        dy /= len;

        player.x +=
            dx *
            player.speed *
            dt;

        player.y +=
            dy *
            player.speed *
            dt;
    }


    player.x =
        Math.max(
            25,
            Math.min(
                canvas.width - 25,
                player.x
            )
        );

    player.y =
        Math.max(
            55,
            Math.min(
                canvas.height - 55,
                player.y
            )
        );
}


/* =====================================================
   ATAQUE
===================================================== */

function shoot() {

    if (
        !waveActive ||
        !player.weapon
    )
        return;


    const weapon =
        player.weapon;


    const now =
        performance.now();


    if (
        now -
        player.lastShot <
        weapon.fireRate
    )
        return;


    /*
    CORPO A CORPO
    */

    if (
        weapon.type === "melee"
    ) {

        player.lastShot =
            now;

        meleeAttack();

        return;
    }


    if (
        player.ammo <= 0
    ) {

        reload();

        return;
    }


    player.lastShot =
        now;

    player.ammo--;

    weapon.currentAmmo =
        player.ammo;


    const angle =
        Math.atan2(
            mouse.y -
            player.y,

            mouse.x -
            player.x
        );


    bullets.push({

        x:
            player.x,

        y:
            player.y,

        vx:
            Math.cos(angle) *
            1000,

        vy:
            Math.sin(angle) *
            1000,

        damage:
            weapon.damage,

        range:
            weapon.range,

        distance:0
    });

    updateHUD();
}


/* =====================================================
   ATAQUE CORPO A CORPO
===================================================== */

function meleeAttack() {

    const weapon =
        player.weapon;

    const angle =
        Math.atan2(
            mouse.y -
            player.y,

            mouse.x -
            player.x
        );


    for (
        const z of zombies
    ) {

        const dx =
            z.x -
            player.x;

        const dy =
            z.y -
            player.y;

        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance >
            weapon.range
        )
            continue;


        const targetAngle =
            Math.atan2(
                dy,
                dx
            );


        let diff =
            Math.abs(
                targetAngle -
                angle
            );

        if (diff > Math.PI)
            diff =
                Math.PI * 2 -
                diff;

        if (
            diff <
            Math.PI / 2
        ) {

            damageZombie(
                z,
                weapon.damage
            );
        }
    }
}


/* =====================================================
   RECARREGAR
===================================================== */

function reload() {

    if (
        !player.weapon ||
        player.weapon.type === "melee"
    )
        return;

    if (
        player.ammo >=
        player.weapon.magazine
    )
        return;

    if (
        player.reserveAmmo <= 0
    )
        return;

    if (
        player.reloadTime > 0
    )
        return;

    player.reloadTime =
        1.2;
}


function updateReload(dt) {

    if (
        player.reloadTime <= 0
    )
        return;

    player.reloadTime -=
        dt;

    if (
        player.reloadTime <= 0
    ) {

        const needed =
            player.weapon.magazine -
            player.ammo;

        const amount =
            Math.min(
                needed,
                player.reserveAmmo
            );

        player.ammo +=
            amount;

        player.reserveAmmo -=
            amount;

        player.weapon.currentAmmo =
            player.ammo;

        player.weapon.reserveAmmo =
            player.reserveAmmo;

        updateHUD();
    }
}


/* =====================================================
   BALAS
===================================================== */

function updateBullets(dt) {

    for (
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        const b =
            bullets[i];

        const step =
            1000 *
            dt;

        b.x +=
            b.vx *
            dt;

        b.y +=
            b.vy *
            dt;

        b.distance +=
            step;


        let hit = false;


        for (
            let j =
                zombies.length - 1;

            j >= 0;

            j--
        ) {

            const z =
                zombies[j];

            const dist =
                Math.hypot(
                    z.x - b.x,
                    z.y - b.y
                );

            if (
                dist <
                35 *
                z.size
            ) {

                damageZombie(
                    z,
                    b.damage
                );

                hit = true;

                break;
            }
        }


        if (
            hit ||
            b.distance >
                b.range ||
            b.x < -100 ||
            b.x >
                canvas.width + 100 ||
            b.y < -100 ||
            b.y >
                canvas.height + 100
        ) {

            bullets.splice(
                i,
                1
            );
        }
    }
}


/* =====================================================
   DANO NO ZUMBI
===================================================== */

function damageZombie(
    zombie,
    damage
) {

    zombie.health -=
        damage;


    if (
        zombie.health <= 0
    ) {

        const reward =
            zombie.reward;

        player.money +=
            reward;

        player.score +=
            reward;

        const index =
            zombies.indexOf(
                zombie
            );

        if (
            index >= 0
        ) {

            zombies.splice(
                index,
                1
            );
        }

        updateHUD();
    }
}


/* =====================================================
   ZUMBIS
===================================================== */

function updateZombies(dt) {

    for (
        const z of zombies
    ) {

        const dx =
            player.x -
            z.x;

        const dy =
            player.y -
            z.y;

        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance > 65
        ) {

            z.x +=
                dx /
                distance *
                z.speed *
                dt;

            z.y +=
                dy /
                distance *
                z.speed *
                dt;

        } else {

            z.attackCooldown -=
                dt;

            if (
                z.attackCooldown <= 0
            ) {

                if (
                    z.boss
                ) {

                    /*
                    Boss mata em 3 ataques.
                    */

                    damagePlayer(
                        Math.ceil(
                            player.maxHealth /
                            3
                        )
                    );

                } else {

                    damagePlayer(
                        z.damage
                    );
                }

                z.attackCooldown =
                    z.boss
                        ? 1.2
                        : 1;
            }
        }
    }


    updateFriend(dt);

    checkWaveComplete();
}


/* =====================================================
   DANO NO JOGADOR
===================================================== */

function damagePlayer(
    damage
) {

    if (
        player.armor > 0
    ) {

        const absorbed =
            Math.min(
                player.armor,
                damage
            );

        player.armor -=
            absorbed;

        damage -=
            absorbed;
    }

    player.health -=
        damage;

    if (
        player.health <= 0
    ) {

        player.health = 0;

        endGame();
    }

    updateHUD();
}


/* =====================================================
   AMIGO
===================================================== */

function updateFriend(dt) {

    if (!friend)
        return;

    friend.lastAttack -=
        dt;

    if (
        friend.lastAttack >
        0
    )
        return;

    if (
        zombies.length === 0
    )
        return;

    let target =
        zombies[0];

    let closest =
        Infinity;

    for (
        const z of zombies
    ) {

        const d =
            Math.hypot(
                z.x -
                player.x,

                z.y -
                player.y
            );

        if (
            d < closest
        ) {

            closest = d;

            target = z;
        }
    }

    if (
        target
    ) {

        damageZombie(
            target,
            friend.damage
        );
    }

    friend.lastAttack =
        1;
}


/* =====================================================
   BOMBA
===================================================== */

function useBomb(item) {

    if (!waveActive)
        return;

    const x =
        mouse.x;

    const y =
        mouse.y;


    for (
        const z of [...zombies]
    ) {

        const d =
            Math.hypot(
                z.x - x,
                z.y - y
            );

        if (
            d <= item.radius
        ) {

            damageZombie(
                z,
                item.damage
            );
        }
    }
}


/* =====================================================
   USAR INVENTÁRIO
===================================================== */

function useItemInventory() {

    if (
        itemInventory.length === 0
    )
        return;

    const entry =
        itemInventory[0];


    if (
        entry.type === "bomb"
    ) {

        useBomb(
            entry.item
        );

        itemInventory.shift();
    }


    if (
        entry.type === "trap"
    ) {

        placeTrap(
            entry.item
        );
    }


    if (
        entry.type === "barricade"
    ) {

        placeBarricade(
            entry.item
        );
    }
}


/* =====================================================
   ARMADILHAS
===================================================== */

function placeTrap(item) {

    if (!preparation) {

        alert(
            "As armadilhas podem ser colocadas durante a preparação."
        );

        return;
    }

    placedTraps.push({

        x:player.x,

        y:player.y,

        damage:item.damage
    });
}


/* =====================================================
   BARRICADAS
===================================================== */

function placeBarricade(item) {

    if (!preparation) {

        alert(
            "As barricadas podem ser colocadas durante a preparação."
        );

        return;
    }

    placedBarricades.push({

        x:player.x,

        y:player.y,

        health:item.health,

        maxHealth:item.health
    });
}


/* =====================================================
   ATUALIZAR ARMADILHAS
===================================================== */

function updateTraps() {

    for (
        const trap of placedTraps
    ) {

        for (
            const z of zombies
        ) {

            const d =
                Math.hypot(
                    z.x - trap.x,
                    z.y - trap.y
                );

            if (
                d < 50
            ) {

                damageZombie(
                    z,
                    trap.damage
                );
            }
        }
    }
}


/* =====================================================
   ATUALIZAR BARRICADAS
===================================================== */

function updateBarricades(dt) {

    for (
        const b of placedBarricades
    ) {

        for (
            const z of zombies
        ) {

            const d =
                Math.hypot(
                    z.x - b.x,
                    z.y - b.y
                );

            if (
                d < 55
            ) {

                z.x -=
                    (z.x - b.x) *
                    dt *
                    2;

                b.health -=
                    z.damage *
                    dt;
            }
        }
    }

    placedBarricades =
        placedBarricades.filter(
            b => b.health > 0
        );
}


/* =====================================================
   FIM DA ONDA
===================================================== */

function checkWaveComplete() {

    if (
        waveActive &&
        zombies.length === 0
    ) {

        waveActive = false;

        wave++;

        setTimeout(
            () => {

                if (
                    gameEnded
                )
                    return;

                gameRunning = false;

                preparation = false;

                shopScreen.style.display =
                    "block";

                hud.style.display =
                    "none";

                gameInventory.style.display =
                    "none";

                skipPreparationBtn.style.display =
                    "none";

                renderItems();

                renderWeaponInventory();

                updateHUD();

            },
            900
        );
    }
}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    if (!player.weapon)
        return;


    nameHud.textContent =
        getPlayerName() ||
        "Jogador";


    healthBar.style.width =
        `${Math.max(
            0,
            player.health /
            player.maxHealth *
            100
        )}%`;


    armorBar.style.width =
        player.maxArmor > 0
            ? `${Math.max(
                0,
                player.armor /
                player.maxArmor *
                100
            )}%`
            : "0%";


    if (
        preparation
    ) {

        waveEl.textContent =
            `PREPARAÇÃO — ${Math.ceil(
                preparationTime
            )}s`;

        enemiesEl.textContent =
            "🛠️ PREPARE SUAS DEFESAS";

    } else {

        waveEl.textContent =
            `ONDA ${wave}`;

        enemiesEl.textContent =
            `Zumbis: ${zombies.length}`;
    }


    weaponEl.textContent =
        player.weapon.name.toUpperCase();


    if (
        player.weapon.type === "melee"
    ) {

        ammoEl.textContent =
            "∞";

    } else {

        ammoEl.textContent =
            `${player.ammo} / ${player.reserveAmmo}`;
    }


    moneyHud.textContent =
        `💵 $${player.money.toLocaleString(
            "pt-BR"
        )}`;

    moneyEl.textContent =
        player.money.toLocaleString(
            "pt-BR"
        );
}


/* =====================================================
   DESENHO DO MAPA
===================================================== */

function drawBackground() {

    /*
    Fundo
    */

    ctx.fillStyle =
        "#101510";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
    Piso
    */

    ctx.fillStyle =
        "#141a14";

    ctx.fillRect(
        0,
        55,
        canvas.width,
        canvas.height - 55
    );


    /*
    Grade
    */

    ctx.strokeStyle =
        "rgba(130,150,130,.08)";

    ctx.lineWidth = 1;

    const grid = 50;


    for (
        let x = 0;
        x < canvas.width;
        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            55
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 55;
        y < canvas.height;
        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    /*
    Área dos zumbis
    */

    ctx.fillStyle =
        "rgba(180,20,20,.08)";

    ctx.fillRect(
        canvas.width - 130,
        55,
        130,
        canvas.height
    );


    ctx.fillStyle =
        "#9b3c3c";

    ctx.font =
        "bold 16px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "ZUMBIS",
        canvas.width - 65,
        85
    );
}


/* =====================================================
   DESENHAR JOGADOR
===================================================== */

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );


    const angle =
        Math.atan2(
            mouse.y -
            player.y,

            mouse.x -
            player.x
        );

    ctx.rotate(angle);


    /*
    Corpo
    */

    ctx.fillStyle =
        "#4772a4";

    ctx.fillRect(
        -15,
        -18,
        30,
        36
    );


    /*
    Cabeça
    */

    ctx.fillStyle =
        "#d7a17b";

    ctx.beginPath();

    ctx.arc(
        0,
        -29,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Arma
    */

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        10,
        -5,
        30,
        8
    );


    ctx.fillStyle =
        "#555";

    ctx.fillRect(
        30,
        -7,
        16,
        4
    );


    ctx.restore();
}


/* =====================================================
   DESENHAR ZUMBI
===================================================== */

function drawZombie(z) {

    ctx.save();

    ctx.translate(
        z.x,
        z.y
    );


    const s =
        z.size || 1;


    ctx.scale(
        s,
        s
    );


    /*
    Boss
    */

    if (
        z.boss
    ) {

        ctx.fillStyle =
            "#8d1825";

        ctx.fillRect(
            -45,
            -60,
            90,
            110
        );

        ctx.fillStyle =
            "#e9b4a0";

        ctx.beginPath();

        ctx.arc(
            0,
            -75,
            30,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "#ff2222";

        ctx.beginPath();

        ctx.arc(
            -11,
            -78,
            6,
            0,
            Math.PI * 2
        );

        ctx.arc(
            11,
            -78,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

    } else {

        /*
        Corpo
        */

        ctx.fillStyle =
            z.color;

        ctx.fillRect(
            -18,
            -10,
            36,
            45
        );


        /*
        Cabeça
        */

        ctx.fillStyle =
            "#bca38b";

        ctx.beginPath();

        ctx.arc(
            0,
            -28,
            16,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /*
        Olhos
        */

        ctx.fillStyle =
            "#ff3333";

        ctx.beginPath();

        ctx.arc(
            -6,
            -30,
            3,
            0,
            Math.PI * 2
        );

        ctx.arc(
            6,
            -30,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /*
    Barra de vida
    */

    const barWidth =
        z.boss
            ? 110
            : 55;

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        -barWidth / 2,
        -55 *
            (z.boss ? 1.5 : 1),
        barWidth,
        7
    );

    ctx.fillStyle =
        z.boss
            ? "#e33"
            : "#52d25b";

    ctx.fillRect(
        -barWidth / 2,
        -55 *
            (z.boss ? 1.5 : 1),
        barWidth *
            Math.max(
                0,
                z.health /
                z.maxHealth
            ),
        7
    );


    if (
        z.boss
    ) {

        ctx.fillStyle =
            "#ffcf4a";

        ctx.font =
            "bold 18px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "👑 BOSS",
            0,
            -100
        );
    }


    ctx.restore();
}


/* =====================================================
   DESENHAR BALAS
===================================================== */

function drawBullets() {

    for (
        const b of bullets
    ) {

        ctx.fillStyle =
            "#ffd85a";

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


/* =====================================================
   DESENHAR ARMADILHAS
===================================================== */

function drawTraps() {

    for (
        const trap of placedTraps
    ) {

        ctx.fillStyle =
            "#aaa";

        ctx.fillRect(
            trap.x - 15,
            trap.y - 8,
            30,
            16
        );

        ctx.strokeStyle =
            "#eee";

        ctx.strokeRect(
            trap.x - 15,
            trap.y - 8,
            30,
            16
        );
    }
}


/* =====================================================
   DESENHAR BARRICADAS
===================================================== */

function drawBarricades() {

    for (
        const b of placedBarricades
    ) {

        ctx.fillStyle =
            "#79553a";

        ctx.fillRect(
            b.x - 30,
            b.y - 25,
            60,
            50
        );

        ctx.fillStyle =
            "#58c75d";

        ctx.fillRect(
            b.x - 30,
            b.y - 32,
            60 *
                Math.max(
                    0,
                    b.health /
                    b.maxHealth
                ),
            5
        );
    }
}


/* =====================================================
   DESENHAR AMIGO
===================================================== */

function drawFriend() {

    if (!friend)
        return;

    ctx.save();

    ctx.font =
        "34px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        friend.icon,
        player.x - 45,
        player.y + 10
    );

    ctx.restore();
}


/* =====================================================
   RANKING
===================================================== */

async function loadRanking() {

    rankingContent.innerHTML = `
        <div class="ranking-loading">
            Carregando ranking...
        </div>
    `;


    try {

        const {
            data,
            error
        } =
        await supabaseClient
            .from(
                "they_are_coming_scores"
            )
            .select(
                "player_name,waves,total_money,created_at"
            )
            .order(
                "waves",
                {
                    ascending:false
                }
            )
            .order(
                "total_money",
                {
                    ascending:false
                }
            )
            .limit(100);


        if (error)
            throw error;


        if (
            !data ||
            data.length === 0
        ) {

            rankingContent.innerHTML = `
                <div class="ranking-empty">
                    Nenhum jogador no ranking ainda.
                </div>
            `;

            return;
        }


        let html = `

            <table class="ranking-table">

                <thead>

                    <tr>
                        <th>#</th>
                        <th>Jogador</th>
                        <th>Ondas</th>
                        <th>Dinheiro</th>
                    </tr>

                </thead>

                <tbody>
        `;


        data.forEach(
            (entry,index) => {

                let position =
                    `${index + 1}º`;

                if (index === 0)
                    position = "🥇";

                if (index === 1)
                    position = "🥈";

                if (index === 2)
                    position = "🥉";


                html += `

                    <tr>

                        <td>
                            ${position}
                        </td>

                        <td class="ranking-player">
                            ${escapeHTML(
                                entry.player_name
                            )}
                        </td>

                        <td>
                            🧟 ${entry.waves}
                        </td>

                        <td class="ranking-money">
                            💵 $${Number(
                                entry.total_money
                            ).toLocaleString(
                                "pt-BR"
                            )}
                        </td>

                    </tr>
                `;
            }
        );


        html += `
                </tbody>
            </table>
        `;

        rankingContent.innerHTML =
            html;

    } catch(error) {

        console.error(
            "Erro no ranking:",
            error
        );

        rankingContent.innerHTML = `
            <div class="ranking-error">
                ❌ Não foi possível carregar o ranking.
            </div>
        `;
    }
}


function escapeHTML(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =====================================================
   RANKING — BOTÕES
===================================================== */

rankingBtn.addEventListener(
    "click",
    () => {

        rankingScreen.style.display =
            "block";

        loadRanking();
    }
);


closeRankingBtn.addEventListener(
    "click",
    () => {

        rankingScreen.style.display =
            "none";
    }
);


/* =====================================================
   SALVAR RANKING
===================================================== */

async function saveScoreToRanking() {

    if (rankingSent)
        return;

    const name =
        getPlayerName();

    if (!name)
        return;

    rankingSent = true;


    try {

        const {
            error
        } =
        await supabaseClient
            .from(
                "they_are_coming_scores"
            )
            .insert({

                player_name:name,

                waves:wave,

                total_money:
                    player.money
            });


        if (error) {

            console.error(
                "Erro ao salvar ranking:",
                error
            );

            rankingSent = false;
        }

    } catch(error) {

        console.error(
            "Erro no ranking:",
            error
        );

        rankingSent = false;
    }
}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    if (gameEnded)
        return;

    gameEnded = true;

    gameRunning = false;

    waveActive = false;

    preparation = false;

    skipPreparationBtn.style.display =
        "none";


    finalScore.innerHTML = `

        <strong>
            ${escapeHTML(
                getPlayerName() ||
                "Jogador"
            )}
        </strong>

        <br><br>

        🧟 Ondas:
        <strong>
            ${wave}
        </strong>

        <br>

        💵 Dinheiro:
        <strong>
            $${player.money.toLocaleString(
                "pt-BR"
            )}
        </strong>

        <br>

        ⭐ Pontuação:
        <strong>
            ${player.score.toLocaleString(
                "pt-BR"
            )}
        </strong>
    `;


    gameOver.style.display =
        "flex";

    saveScoreToRanking();
}


/* =====================================================
   CATEGORIAS
===================================================== */

document
    .querySelectorAll(
        ".category-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-btn"
                        )
                        .forEach(
                            btn =>
                                btn.classList
                                    .remove(
                                        "active"
                                    )
                        );

                    button.classList.add(
                        "active"
                    );

                    currentCategory =
                        button.dataset.category;

                    renderItems();
                }
            );
        }
    );


/* =====================================================
   RECOMEÇAR
===================================================== */

restartBtn.addEventListener(
    "click",
    () => {

        location.reload();
    }
);


/* =====================================================
   LOOP PRINCIPAL
===================================================== */

function gameLoop(time) {

    const dt =
        Math.min(
            0.033,
            (time - lastTime) /
            1000
        );

    lastTime = time;


    /*
    O MAPA SEMPRE É DESENHADO.
    Isso garante que ele apareça assim
    que a loja for fechada.
    */

    drawBackground();


    if (
        gameRunning &&
        !gameEnded
    ) {

        updatePlayer(dt);


        if (
            preparation
        ) {

            updatePreparation(dt);

        } else if (
            waveActive
        ) {

            updateZombies(dt);

            updateBullets(dt);

            updateTraps();

            updateBarricades(dt);


            if (
                mouse.down ||
                keys[" "]
            ) {

                shoot();
            }

            updateReload(dt);
        }


        drawBarricades();

        drawTraps();

        drawBullets();


        for (
            const z of zombies
        ) {

            drawZombie(z);
        }


        drawFriend();

        drawPlayer();


        updateHUD();
    }


    requestAnimationFrame(
        gameLoop
    );
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

function init() {

    canvas.style.display =
        "block";

    shopScreen.style.display =
        "block";

    hud.style.display =
        "none";

    gameInventory.style.display =
        "none";

    gameOver.style.display =
        "none";

    rankingScreen.style.display =
        "none";

    skipPreparationBtn.style.display =
        "none";


    /*
    A pistola inicial não é cobrada.
    O jogador começa com ela.
    */

    const starter =
        {
            ...weapons[0],

            currentAmmo:
                weapons[0].magazine,

            reserveAmmo:
                weapons[0].ammo,

            type:"gun"
        };

    weaponInventory = [
        starter
    ];

    selectedWeapon = 0;

    player.weapon =
        starter;

    syncWeaponAmmo();

    player.y =
        canvas.height / 2;


    renderItems();

    renderWeaponInventory();

    updateHUD();
}


init();


requestAnimationFrame(
    gameLoop
);
