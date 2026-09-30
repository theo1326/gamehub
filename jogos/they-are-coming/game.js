"use strict";

/* =========================================================
   THEY ARE COMING
   GAMEHUB
   ========================================================= */


/* =========================================================
   ELEMENTOS
   ========================================================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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

const gameInventory =
    document.getElementById("gameInventory");

const gameInventorySlots =
    document.getElementById("gameInventorySlots");

const menuInventory =
    document.getElementById("menuInventory");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const restartBtn =
    document.getElementById("restartBtn");


/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const MAX_HEALTH_START = 100;
const INVENTORY_SIZE = 5;
const ZOMBIE_DAMAGE = 5;
const PREPARATION_TIME = 30;


/* =========================================================
   CANVAS
   ========================================================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =========================================================
   ARMAS
   ========================================================= */

const weapons = [

    /* 1 - 34 */

    {name:"Pistola",damage:18,fireRate:350,magazine:12,ammo:60,price:300,range:700},
    {name:"Glock 17",damage:20,fireRate:300,magazine:17,ammo:85,price:450,range:700},
    {name:"Desert Eagle",damage:45,fireRate:650,magazine:7,ammo:35,price:900,range:750},
    {name:"Uzi",damage:15,fireRate:100,magazine:32,ammo:160,price:850,range:650},
    {name:"MP5",damage:20,fireRate:110,magazine:30,ammo:150,price:1200,range:700},
    {name:"MP7",damage:18,fireRate:85,magazine:40,ammo:200,price:1400,range:680},
    {name:"P90",damage:19,fireRate:75,magazine:50,ammo:250,price:1700,range:700},
    {name:"Shotgun",damage:65,fireRate:850,magazine:6,ammo:36,price:1100,range:450},
    {name:"Double Barrel",damage:95,fireRate:1100,magazine:2,ammo:24,price:1500,range:430},
    {name:"M870",damage:72,fireRate:750,magazine:8,ammo:48,price:1800,range:500},

    {name:"AK-47",damage:32,fireRate:150,magazine:30,ammo:150,price:2200,range:800},
    {name:"AK-74",damage:35,fireRate:145,magazine:30,ammo:150,price:2400,range:800},
    {name:"M4",damage:30,fireRate:120,magazine:30,ammo:180,price:2300,range:850},
    {name:"M16",damage:34,fireRate:130,magazine:30,ammo:180,price:2500,range:900},
    {name:"SCAR",damage:40,fireRate:170,magazine:20,ammo:120,price:2800,range:900},
    {name:"FAMAS",damage:31,fireRate:100,magazine:25,ammo:150,price:2500,range:820},
    {name:"G36",damage:34,fireRate:115,magazine:30,ammo:180,price:2700,range:850},
    {name:"AUG",damage:38,fireRate:120,magazine:30,ammo:180,price:2900,range:900},
    {name:"FN P90",damage:23,fireRate:70,magazine:50,ammo:300,price:2100,range:720},
    {name:"Vector",damage:24,fireRate:65,magazine:40,ammo:240,price:2300,range:680},

    {name:"MP40",damage:25,fireRate:130,magazine:32,ammo:160,price:1300,range:650},
    {name:"Thompson",damage:28,fireRate:120,magazine:30,ammo:180,price:1800,range:700},
    {name:"M249",damage:42,fireRate:95,magazine:100,ammo:500,price:4000,range:900},
    {name:"PKM",damage:45,fireRate:105,magazine:100,ammo:500,price:4500,range:950},
    {name:"RPK",damage:40,fireRate:110,magazine:75,ammo:375,price:3700,range:900},
    {name:"Sniper",damage:150,fireRate:1100,magazine:5,ammo:30,price:3500,range:1500},
    {name:"AWP",damage:220,fireRate:1400,magazine:5,ammo:25,price:5000,range:1700},
    {name:"Barrett",damage:300,fireRate:1800,magazine:10,ammo:50,price:6500,range:1900},
    {name:"RPG",damage:500,fireRate:2200,magazine:1,ammo:10,price:7000,range:1200},
    {name:"Minigun",damage:28,fireRate:40,magazine:200,ammo:1000,price:8000,range:1000},
    {name:"Railgun",damage:800,fireRate:2200,magazine:3,ammo:18,price:10000,range:1800},
    {name:"Laser Gun",damage:100,fireRate:80,magazine:100,ammo:500,price:9000,range:1200},
    {name:"Plasma Rifle",damage:180,fireRate:250,magazine:30,ammo:150,price:12000,range:1300},
    {name:"Doom Cannon",damage:1200,fireRate:3000,magazine:1,ammo:10,price:20000,range:1600},

    /* +50 NOVAS */

    {name:"Beretta M9",damage:22,fireRate:280,magazine:15,ammo:90,price:500,range:700},
    {name:"Colt 1911",damage:30,fireRate:420,magazine:8,ammo:48,price:650,range:700},
    {name:"Five Seven",damage:24,fireRate:250,magazine:20,ammo:120,price:850,range:720},
    {name:"USP Tactical",damage:28,fireRate:300,magazine:12,ammo:72,price:1000,range:760},
    {name:"CZ 75",damage:25,fireRate:240,magazine:16,ammo:96,price:800,range:700},
    {name:"Magnum 44",damage:70,fireRate:800,magazine:6,ammo:36,price:1600,range:850},
    {name:"Raging Hunter",damage:80,fireRate:900,magazine:5,ammo:30,price:1900,range:850},
    {name:"MAC-10",damage:17,fireRate:90,magazine:30,ammo:180,price:1000,range:620},
    {name:"PP-19",damage:22,fireRate:105,magazine:30,ammo:180,price:1500,range:700},
    {name:"MPX",damage:25,fireRate:80,magazine:35,ammo:210,price:1900,range:720},

    {name:"UMP45",damage:30,fireRate:125,magazine:25,ammo:150,price:1900,range:750},
    {name:"PPSh-41",damage:24,fireRate:80,magazine:71,ammo:355,price:2400,range:650},
    {name:"PPS-43",damage:27,fireRate:100,magazine:35,ammo:210,price:1700,range:680},
    {name:"MP5SD",damage:26,fireRate:105,magazine:30,ammo:180,price:2200,range:760},
    {name:"MAC-11",damage:16,fireRate:65,magazine:32,ammo:192,price:1300,range:600},

    {name:"Galil",damage:35,fireRate:135,magazine:35,ammo:210,price:2800,range:850},
    {name:"FNC",damage:38,fireRate:125,magazine:30,ammo:180,price:3000,range:900},
    {name:"HK416",damage:42,fireRate:100,magazine:30,ammo:210,price:3500,range:950},
    {name:"G3",damage:55,fireRate:220,magazine:20,ammo:120,price:4000,range:1000},
    {name:"FAL",damage:58,fireRate:200,magazine:20,ammo:120,price:4200,range:1050},

    {name:"M14",damage:60,fireRate:260,magazine:20,ammo:120,price:3800,range:1100},
    {name:"GROZA",damage:44,fireRate:110,magazine:30,ammo:180,price:3900,range:850},
    {name:"AN-94",damage:48,fireRate:105,magazine:30,ammo:180,price:4300,range:950},
    {name:"AS VAL",damage:40,fireRate:90,magazine:20,ammo:160,price:4000,range:850},
    {name:"VSS",damage:55,fireRate:250,magazine:20,ammo:120,price:4500,range:1100},

    {name:"SVD Dragunov",damage:180,fireRate:900,magazine:10,ammo:60,price:5500,range:1500},
    {name:"M24",damage:210,fireRate:1200,magazine:5,ammo:35,price:5200,range:1600},
    {name:"Mosin Nagant",damage:170,fireRate:1300,magazine:5,ammo:35,price:3200,range:1400},
    {name:"Kar98k",damage:160,fireRate:1250,magazine:5,ammo:35,price:3100,range:1400},
    {name:"Intervention",damage:240,fireRate:1500,magazine:5,ammo:30,price:6000,range:1750},

    {name:"SPAS-12",damage:85,fireRate:700,magazine:8,ammo:48,price:3200,range:520},
    {name:"AA-12",damage:55,fireRate:130,magazine:20,ammo:160,price:5000,range:500},
    {name:"Saiga-12",damage:70,fireRate:300,magazine:10,ammo:80,price:3800,range:520},
    {name:"KSG",damage:100,fireRate:850,magazine:14,ammo:70,price:4500,range:550},
    {name:"USAS-12",damage:62,fireRate:150,magazine:20,ammo:160,price:5200,range:540},

    {name:"Flamethrower",damage:75,fireRate:100,magazine:150,ammo:750,price:7000,range:450},
    {name:"Grenade Launcher",damage:400,fireRate:1800,magazine:6,ammo:30,price:6500,range:1100},
    {name:"Heavy Cannon",damage:650,fireRate:2300,magazine:4,ammo:20,price:7500,range:1300},
    {name:"Gauss Rifle",damage:700,fireRate:1800,magazine:5,ammo:25,price:8500,range:1800},
    {name:"Tesla Rifle",damage:350,fireRate:500,magazine:20,ammo:100,price:8000,range:1000},

    {name:"Shock Blaster",damage:450,fireRate:700,magazine:15,ammo:90,price:9000,range:1100},
    {name:"Ion Cannon",damage:900,fireRate:2500,magazine:2,ammo:12,price:14000,range:1800},
    {name:"Energy Destroyer",damage:1000,fireRate:1800,magazine:5,ammo:30,price:15000,range:1700},
    {name:"Death Ray",damage:1500,fireRate:3000,magazine:3,ammo:15,price:18000,range:2000},
    {name:"Apocalypse Gun",damage:2000,fireRate:3500,magazine:2,ammo:10,price:25000,range:2200},

    {name:"Black Hole Gun",damage:3000,fireRate:4000,magazine:1,ammo:5,price:35000,range:2000},
    {name:"Omega Rifle",damage:2500,fireRate:2000,magazine:10,ammo:50,price:30000,range:2200},
    {name:"Titan Cannon",damage:3500,fireRate:4000,magazine:3,ammo:15,price:40000,range:2300},
    {name:"Galaxy Blaster",damage:5000,fireRate:4500,magazine:2,ammo:10,price:50000,range:2500},
    {name:"Ultimate Destroyer",damage:8000,fireRate:5000,magazine:1,ammo:5,price:75000,range:3000}
];


/* =========================================================
   ARMADURAS
   ========================================================= */

const armors = [
    {name:"Colete Leve",armor:20,price:500},
    {name:"Colete Tático",armor:40,price:1200},
    {name:"Armadura Pesada",armor:60,price:2500},
    {name:"Armadura Militar",armor:80,price:4500},
    {name:"Armadura Especial",armor:100,price:7000}
];


/* =========================================================
   AMIGOS
   ========================================================= */

const friends = [
    {name:"Cachorro",damage:10,price:1000,icon:"🐕"},
    {name:"Rottweiler",damage:18,price:2000,icon:"🐕"},
    {name:"Leopardo",damage:25,price:3500,icon:"🐆"},
    {name:"Tigre",damage:35,price:5000,icon:"🐅"},
    {name:"Leão",damage:50,price:7500,icon:"🦁"},
    {name:"Velociraptor",damage:70,price:12000,icon:"🦖"}
];


/* =========================================================
   KITS
   ========================================================= */

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
        name:"+5 de Vida",
        permanentHealth:5,
        price:1000,
        icon:"❤️"
    }

];


/* =========================================================
   BOMBAS
   ========================================================= */

const bombs = [
    {name:"Granada",damage:100,radius:100,price:300,icon:"💣"},
    {name:"Granada Explosiva",damage:180,radius:130,price:600,icon:"💣"},
    {name:"Bomba Pesada",damage:300,radius:160,price:1000,icon:"💥"},
    {name:"C4",damage:500,radius:190,price:1800,icon:"🧨"},
    {name:"Mina Explosiva",damage:350,radius:140,price:1200,icon:"💣"},
    {name:"Bomba Incendiária",damage:250,radius:150,price:1400,icon:"🔥"},
    {name:"Granada de Plasma",damage:600,radius:180,price:3000,icon:"⚡"},
    {name:"Bomba Nuclear",damage:1500,radius:300,price:10000,icon:"☢️"},
    {name:"Bomba Infernal",damage:2500,radius:350,price:20000,icon:"🔥"},
    {name:"Bomba Apocalipse",damage:5000,radius:450,price:40000,icon:"☢️"}
];


/* =========================================================
   ARMADILHAS
   ========================================================= */

const traps = [
    {name:"Espinhos",damage:30,price:150,icon:"🪤"},
    {name:"Armadilha de Ferro",damage:60,price:300,icon:"⚙️"},
    {name:"Lâminas",damage:100,price:600,icon:"⚔️"},
    {name:"Armadilha Elétrica",damage:150,price:900,icon:"⚡"},
    {name:"Fogo",damage:200,price:1200,icon:"🔥"},
    {name:"Mina",damage:300,price:1600,icon:"💣"},
    {name:"Tesla Trap",damage:450,price:2500,icon:"⚡"},
    {name:"Laser Trap",damage:600,price:4000,icon:"🔴"},
    {name:"Plasma Trap",damage:1000,price:7000,icon:"🟣"},
    {name:"Death Trap",damage:2000,price:12000,icon:"☠️"},
    {name:"Inferno Trap",damage:3000,price:18000,icon:"🔥"},
    {name:"Omega Trap",damage:5000,price:30000,icon:"💥"},
    {name:"Black Hole Trap",damage:8000,price:50000,icon:"🕳️"},
    {name:"Apocalypse Trap",damage:12000,price:75000,icon:"☢️"},
    {name:"Ultimate Trap",damage:20000,price:100000,icon:"💀"}
];


/* =========================================================
   BARRICADAS
   ========================================================= */

const barricades = [
    {name:"Barricada de Madeira",health:100,price:200,icon:"🧱"},
    {name:"Barricada Reforçada",health:250,price:500,icon:"🧱"},
    {name:"Barricada de Ferro",health:500,price:1000,icon:"🔩"},
    {name:"Muralha de Ferro",health:1000,price:2500,icon:"🏗️"},
    {name:"Muralha Militar",health:2000,price:5000,icon:"🛡️"},
    {name:"Muralha Blindada",health:4000,price:9000,icon:"🏰"},
    {name:"Muralha Especial",health:8000,price:15000,icon:"🏰"},
    {name:"Muralha Titan",health:15000,price:25000,icon:"🛡️"},
    {name:"Muralha Omega",health:30000,price:50000,icon:"🏰"},
    {name:"Fortaleza",health:60000,price:100000,icon:"🏯"}
];


/* =========================================================
   ZUMBIS
   ========================================================= */

const zombieTypes = [
    {name:"Walker",health:60,speed:45,damage:5,reward:100,icon:"🧟"},
    {name:"Runner",health:45,speed:90,damage:7,reward:150,icon:"🧟‍♂️"},
    {name:"Brute",health:180,speed:35,damage:12,reward:300,icon:"👹"},
    {name:"Crawler",health:80,speed:70,damage:8,reward:200,icon:"🧟"},
    {name:"Soldier",health:130,speed:55,damage:10,reward:250,icon:"🪖"},
    {name:"Mutant",health:300,speed:45,damage:15,reward:500,icon:"👾"},
    {name:"Burning",health:220,speed:60,damage:18,reward:700,icon:"🔥"},
    {name:"Toxic",health:250,speed:50,damage:20,reward:800,icon:"☣️"},
    {name:"Tank",health:700,speed:25,damage:25,reward:1500,icon:"👹"},
    {name:"Boss",health:2000,speed:20,damage:35,reward:5000,icon:"💀"}
];


/* =========================================================
   ESTADO
   ========================================================= */

let player = {

    x:180,
    y:0,

    width:34,
    height:58,

    speed:250,

    health:MAX_HEALTH_START,
    maxHealth:MAX_HEALTH_START,

    armor:0,
    maxArmor:0,

    money:500,

    weapon:weapons[0],

    ammo:weapons[0].magazine,

    reserveAmmo:weapons[0].ammo,

    lastShot:0,

    reloadTime:0,

    score:0
};


let zombies = [];
let bullets = [];

let placedTraps = [];
let placedBarricades = [];

let inventory = [];

let currentCategory = "armadura";

let wave = 1;

let waveActive = false;
let preparation = false;

let preparationTime = PREPARATION_TIME;

let gameRunning = false;
let gameEnded = false;

let keys = {};

let mouse = {
    x:0,
    y:0,
    down:false
};

let friend = null;

let rankingSent = false;


/* =========================================================
   CONTROLES
   ========================================================= */

window.addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

    if (e.key === " ") {
        e.preventDefault();
    }

    if (e.key.toLowerCase() === "r") {
        reload();
    }

    if (["1","2","3","4","5"].includes(e.key)) {

        useInventory(
            Number(e.key) - 1
        );
    }

    if (e.key.toLowerCase() === "e") {

        usePlacementItem();
    }

});


window.addEventListener("keyup", e => {

    keys[e.key.toLowerCase()] = false;

});


canvas.addEventListener("mousemove", e => {

    const rect =
        canvas.getBoundingClientRect();

    mouse.x =
        e.clientX - rect.left;

    mouse.y =
        e.clientY - rect.top;

});


canvas.addEventListener("mousedown", () => {

    mouse.down = true;

});


canvas.addEventListener("mouseup", () => {

    mouse.down = false;

});


canvas.addEventListener("mouseleave", () => {

    mouse.down = false;

});


/* =========================================================
   NOME
   ========================================================= */

function getPlayerName() {

    return playerNameInput.value
        .trim()
        .replace(/\s+/g, " ")
        .slice(0,16);

}


function validatePlayerName() {

    const name =
        getPlayerName();

    if (!name) {

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


/* =========================================================
   VISUAL DOS ITENS
   ========================================================= */

function itemVisual(item,type) {

    if (item.icon) {
        return item.icon;
    }

    if (type === "armas") return "🔫";
    if (type === "armadura") return "🛡️";
    if (type === "amigos") return "🐾";
    if (type === "municao") return "📦";
    if (type === "kits") return "🩹";
    if (type === "bombas") return "💣";
    if (type === "armadilhas") return "🪤";
    if (type === "barricadas") return "🧱";

    return "📦";
}


function itemDescription(item,type) {

    if (type === "armas") {

        return `
            Dano: ${item.damage}
            |
            Carregador: ${item.magazine}
        `;
    }

    if (type === "armadura") {

        return `Proteção: ${item.armor}`;
    }

    if (type === "amigos") {

        return `Dano: ${item.damage}`;
    }

    if (type === "kits") {

        if (item.permanentHealth) {

            return `
                Vida máxima +${item.permanentHealth}
                permanentemente
            `;
        }

        return `Recupera ${item.heal} de vida`;
    }

    if (type === "bombas") {

        return `
            Dano: ${item.damage}
            |
            Área: ${item.radius}
        `;
    }

    if (type === "armadilhas") {

        return `Dano: ${item.damage}`;
    }

    if (type === "barricadas") {

        return `Resistência: ${item.health}`;
    }

    return "Item especial";
}


/* =========================================================
   LOJA
   ========================================================= */

function renderItems() {

    shopContent.innerHTML = "";

    let items = [];

    if (currentCategory === "armadura")
        items = armors;

    if (currentCategory === "armas")
        items = weapons;

    if (currentCategory === "amigos")
        items = friends;

    if (currentCategory === "kits")
        items = kits;

    if (currentCategory === "bombas")
        items = bombs;

    if (currentCategory === "armadilhas")
        items = traps;

    if (currentCategory === "barricadas")
        items = barricades;


    if (currentCategory === "municao") {

        shopContent.innerHTML = `

            <div class="shop-item">

                <div class="item-visual">
                    📦
                </div>

                <h3>Munição +30</h3>

                <p>
                    Adiciona 30 balas.
                </p>

                <strong>
                    $150
                </strong>

                <button onclick="buyAmmo()">
                    COMPRAR
                </button>

            </div>
        `;

        return;
    }


    items.forEach((item,index) => {

        const card =
            document.createElement("div");

        card.className =
            "shop-item";

        card.innerHTML = `

            <div class="item-visual">
                ${itemVisual(item,currentCategory)}
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

            <button onclick="buyItem(${index})">
                COMPRAR
            </button>

        `;

        shopContent.appendChild(card);

    });
}


/* =========================================================
   COMPRAR ITEM
   ========================================================= */

window.buyItem = function(index) {

    let items = [];

    if (currentCategory === "armadura")
        items = armors;

    if (currentCategory === "armas")
        items = weapons;

    if (currentCategory === "amigos")
        items = friends;

    if (currentCategory === "kits")
        items = kits;

    if (currentCategory === "bombas")
        items = bombs;

    if (currentCategory === "armadilhas")
        items = traps;

    if (currentCategory === "barricadas")
        items = barricades;


    const item = items[index];

    if (!item) return;


    if (player.money < item.price) {

        alert("Dinheiro insuficiente!");

        return;
    }


    /* ARMAS */

    if (currentCategory === "armas") {

        player.money -= item.price;

        player.weapon = item;

        player.ammo =
            item.magazine;

        player.reserveAmmo =
            item.ammo;

        updateHUD();

        renderItems();

        return;
    }


    /* ARMADURA */

    if (currentCategory === "armadura") {

        player.money -= item.price;

        player.armor =
            item.armor;

        player.maxArmor =
            item.armor;

        updateHUD();

        renderItems();

        return;
    }


    /* AMIGOS */

    if (currentCategory === "amigos") {

        player.money -= item.price;

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


    /* KITS */

    if (currentCategory === "kits") {

        player.money -= item.price;


        if (item.permanentHealth) {

            player.maxHealth +=
                item.permanentHealth;

            player.health +=
                item.permanentHealth;

        } else {

            player.health =
                Math.min(
                    player.maxHealth,
                    player.health + item.heal
                );
        }


        updateHUD();

        renderItems();

        return;
    }


    /* BOMBAS */

    if (currentCategory === "bombas") {

        if (!addInventory({

            type:"bomb",

            item:item

        })) {

            alert("Inventário cheio!");

            return;
        }

        player.money -= item.price;

        renderInventory();

        renderItems();

        return;
    }


    /* ARMADILHAS */

    if (currentCategory === "armadilhas") {

        if (!addInventory({

            type:"trap",

            item:item

        })) {

            alert("Inventário cheio!");

            return;
        }

        player.money -= item.price;

        renderInventory();

        renderItems();

        return;
    }


    /* BARRICADAS */

    if (currentCategory === "barricadas") {

        if (!addInventory({

            type:"barricade",

            item:item

        })) {

            alert("Inventário cheio!");

            return;
        }

        player.money -= item.price;

        renderInventory();

        renderItems();

        return;
    }

};


/* =========================================================
   MUNIÇÃO
   ========================================================= */

window.buyAmmo = function() {

    const price = 150;


    if (player.money < price) {

        alert("Dinheiro insuficiente!");

        return;
    }


    player.money -= price;

    player.reserveAmmo += 30;

    updateHUD();

};


/* =========================================================
   INVENTÁRIO
   ========================================================= */

function addInventory(item) {

    if (
        inventory.length >=
        INVENTORY_SIZE
    ) {

        return false;
    }

    inventory.push(item);

    return true;
}


function renderInventory() {

    menuInventory.innerHTML = "";

    gameInventorySlots.innerHTML = "";


    for (
        let i = 0;
        i < INVENTORY_SIZE;
        i++
    ) {

        const menuSlot =
            document.createElement("div");

        menuSlot.className =
            "inventory-slot";


        const gameSlot =
            document.createElement("div");

        gameSlot.className =
            "inventory-slot";


        if (inventory[i]) {

            const type =
                inventory[i].type === "bomb"
                    ? "bombas"
                    : inventory[i].type === "trap"
                    ? "armadilhas"
                    : "barricadas";


            menuSlot.innerHTML =
                itemVisual(
                    inventory[i].item,
                    type
                );

            gameSlot.innerHTML =
                menuSlot.innerHTML;

        } else {

            menuSlot.innerHTML =
                i + 1;

            gameSlot.innerHTML =
                i + 1;
        }


        menuInventory.appendChild(
            menuSlot
        );

        gameInventorySlots.appendChild(
            gameSlot
        );
    }
}


function useInventory(index) {

    if (!inventory[index])
        return;


    const item =
        inventory[index];


    if (item.type === "bomb") {

        useBomb(item.item);

        inventory.splice(index,1);
    }


    if (item.type === "trap") {

        placeTrap(item.item);

        if (preparation) {
            inventory.splice(index,1);
        }
    }


    if (item.type === "barricade") {

        placeBarricade(item.item);

        if (preparation) {
            inventory.splice(index,1);
        }
    }


    renderInventory();
}


/* =========================================================
   INICIAR ONDA
   ========================================================= */

function startWave() {

    if (gameEnded)
        return;


    if (!validatePlayerName())
        return;


    shopScreen.style.display =
        "none";

    hud.style.display =
        "block";

    gameInventory.style.display =
        "block";


    gameRunning = true;

    player.x = 180;

    player.y =
        canvas.height / 2;


    zombies = [];

    bullets = [];


    /* começa os 30 segundos */

    preparation = true;

    waveActive = false;

    preparationTime =
        PREPARATION_TIME;


    updateHUD();
}


startWaveBtn.addEventListener(
    "click",
    startWave
);


/* =========================================================
   PREPARAÇÃO
   ========================================================= */

function updatePreparation(dt) {

    preparationTime -= dt;


    if (preparationTime <= 0) {

        preparationTime = 0;

        preparation = false;

        waveActive = true;

        spawnWave();

    }
}


/* =========================================================
   SPAWN
   SOMENTE DIREITA
   ========================================================= */

function spawnWave() {

    zombies = [];


    const amount =
        5 + wave * 3;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const typeIndex =
            Math.min(
                zombieTypes.length - 1,
                Math.floor(
                    (wave - 1) / 3
                )
            );


        const type =
            zombieTypes[
                Math.floor(
                    Math.random() *
                    (typeIndex + 1)
                )
            ];


        zombies.push({

            /* DIREITA */

            x:
                canvas.width +
                60 +
                Math.random() * 250,

            y:
                70 +
                Math.random() *
                Math.max(
                    100,
                    canvas.height - 140
                ),

            width:38,

            height:60,

            health:
                type.health +
                wave * 12,

            maxHealth:
                type.health +
                wave * 12,

            speed:type.speed,

            damage:type.damage,

            reward:type.reward,

            type:type.name,

            icon:type.icon,

            attackCooldown:0

        });
    }


    updateHUD();
}


/* =========================================================
   JOGADOR
   ========================================================= */

function updatePlayer(dt) {

    let dx = 0;
    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {
        dy -= 1;
    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {
        dy += 1;
    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        dx -= 1;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        dx += 1;
    }


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const length =
            Math.hypot(dx,dy);

        dx /= length;
        dy /= length;


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
            30,
            Math.min(
                canvas.width - 30,
                player.x
            )
        );


    player.y =
        Math.max(
            50,
            Math.min(
                canvas.height - 50,
                player.y
            )
        );
}


/* =========================================================
   TIRO
   ========================================================= */

function shoot() {

    if (!waveActive)
        return;


    const now =
        performance.now();


    if (
        now -
        player.lastShot <
        player.weapon.fireRate
    ) {
        return;
    }


    if (player.ammo <= 0) {

        reload();

        return;
    }


    player.lastShot = now;

    player.ammo--;


    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );


    bullets.push({

        x:player.x,

        y:player.y,

        vx:
            Math.cos(angle) *
            1000,

        vy:
            Math.sin(angle) *
            1000,

        damage:
            player.weapon.damage,

        life:
            player.weapon.range /
            1000
    });


    updateHUD();
}


/* =========================================================
   RECARREGAR
   ========================================================= */

function reload() {

    if (player.reloadTime > 0)
        return;


    if (
        player.ammo >=
        player.weapon.magazine
    ) {
        return;
    }


    if (player.reserveAmmo <= 0)
        return;


    player.reloadTime = 1.3;
}


function updateReload(dt) {

    if (player.reloadTime > 0) {

        player.reloadTime -= dt;


        if (
            player.reloadTime <= 0
        ) {

            const missing =
                player.weapon.magazine -
                player.ammo;


            const amount =
                Math.min(
                    missing,
                    player.reserveAmmo
                );


            player.ammo += amount;

            player.reserveAmmo -=
                amount;


            updateHUD();
        }
    }
}


/* =========================================================
   BALAS
   ========================================================= */

function updateBullets(dt) {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const b =
            bullets[i];


        b.x +=
            b.vx * dt;

        b.y +=
            b.vy * dt;

        b.life -= dt;


        let hit = false;


        for (
            let j = zombies.length - 1;
            j >= 0;
            j--
        ) {

            const z =
                zombies[j];


            const distance =
                Math.hypot(
                    b.x - z.x,
                    b.y - z.y
                );


            if (
                distance < 30
            ) {

                z.health -=
                    b.damage;

                hit = true;


                if (
                    z.health <= 0
                ) {

                    player.money +=
                        z.reward;

                    player.score +=
                        z.reward;


                    zombies.splice(
                        j,
                        1
                    );
                }


                break;
            }
        }


        if (
            hit ||
            b.life <= 0 ||
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


/* =========================================================
   ZUMBIS
   ========================================================= */

function updateZombies(dt) {

    for (
        let i = zombies.length - 1;
        i >= 0;
        i--
    ) {

        const z =
            zombies[i];


        const dx =
            player.x - z.x;

        const dy =
            player.y - z.y;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance > 55
        ) {

            z.x +=
                (dx / distance) *
                z.speed *
                dt;


            z.y +=
                (dy / distance) *
                z.speed *
                dt;

        } else {

            z.attackCooldown -= dt;


            if (
                z.attackCooldown <= 0
            ) {

                damagePlayer(
                    z.damage
                );

                z.attackCooldown =
                    0.8;
            }
        }
    }


    /* AMIGO */

    if (friend) {

        const nearest =
            zombies.reduce(
                (closest,z) => {

                    if (!closest)
                        return z;


                    const d1 =
                        Math.hypot(
                            z.x - player.x,
                            z.y - player.y
                        );


                    const d2 =
                        Math.hypot(
                            closest.x - player.x,
                            closest.y - player.y
                        );


                    return d1 < d2
                        ? z
                        : closest;

                },
                null
            );


        if (
            nearest &&
            Math.hypot(
                nearest.x - player.x,
                nearest.y - player.y
            ) < 500
        ) {

            const now =
                performance.now();


            if (
                now -
                friend.lastAttack >
                700
            ) {

                nearest.health -=
                    friend.damage;


                friend.lastAttack =
                    now;


                if (
                    nearest.health <= 0
                ) {

                    player.money +=
                        nearest.reward;

                    player.score +=
                        nearest.reward;


                    const index =
                        zombies.indexOf(
                            nearest
                        );


                    if (index !== -1) {

                        zombies.splice(
                            index,
                            1
                        );
                    }
                }
            }
        }
    }
}


/* =========================================================
   DANO
   ========================================================= */

function damagePlayer(amount) {

    let remaining = amount;


    if (player.armor > 0) {

        const absorbed =
            Math.min(
                player.armor,
                remaining
            );


        player.armor -=
            absorbed;

        remaining -=
            absorbed;
    }


    player.health -=
        remaining;


    if (
        player.health <= 0
    ) {

        player.health = 0;

        endGame();
    }


    updateHUD();
}


/* =========================================================
   BOMBA
   ========================================================= */

function useBomb(bomb) {

    if (
        !waveActive &&
        !preparation
    ) {
        return;
    }


    const x =
        player.x;

    const y =
        player.y;


    for (
        let i = zombies.length - 1;
        i >= 0;
        i--
    ) {

        const z =
            zombies[i];


        const distance =
            Math.hypot(
                z.x - x,
                z.y - y
            );


        if (
            distance <=
            bomb.radius
        ) {

            z.health -=
                bomb.damage;


            if (
                z.health <= 0
            ) {

                player.money +=
                    z.reward;

                player.score +=
                    z.reward;


                zombies.splice(
                    i,
                    1
                );
            }
        }
    }


    updateHUD();
}


/* =========================================================
   ARMADILHAS
   ========================================================= */

function placeTrap(trap) {

    if (!preparation) {

        alert(
            "Armadilhas só podem ser colocadas durante os 30 segundos de preparação!"
        );

        return;
    }


    placedTraps.push({

        x:player.x,

        y:player.y,

        damage:trap.damage,

        radius:35,

        active:true
    });
}


function updateTraps() {

    for (
        const trap of placedTraps
    ) {

        if (!trap.active)
            continue;


        for (
            let i = zombies.length - 1;
            i >= 0;
            i--
        ) {

            const z =
                zombies[i];


            const distance =
                Math.hypot(
                    z.x - trap.x,
                    z.y - trap.y
                );


            if (
                distance <
                trap.radius
            ) {

                z.health -=
                    trap.damage;

                trap.active = false;


                if (
                    z.health <= 0
                ) {

                    player.money +=
                        z.reward;

                    player.score +=
                        z.reward;


                    zombies.splice(
                        i,
                        1
                    );
                }


                break;
            }
        }
    }


    placedTraps =
        placedTraps.filter(
            t => t.active
        );
}


/* =========================================================
   BARRICADAS
   ========================================================= */

function placeBarricade(barricade) {

    if (!preparation) {

        alert(
            "Barricadas só podem ser colocadas durante os 30 segundos de preparação!"
        );

        return;
    }


    placedBarricades.push({

        x:player.x,

        y:player.y,

        width:80,

        height:30,

        health:barricade.health,

        maxHealth:barricade.health
    });
}


function updateBarricades(dt) {

    for (
        const b of placedBarricades
    ) {

        for (
            const z of zombies
        ) {

            const distance =
                Math.hypot(
                    z.x - b.x,
                    z.y - b.y
                );


            if (
                distance < 65
            ) {

                b.health -=
                    z.damage * dt;


                if (
                    b.health <= 0
                ) {

                    const index =
                        placedBarricades.indexOf(
                            b
                        );


                    if (
                        index !== -1
                    ) {

                        placedBarricades.splice(
                            index,
                            1
                        );
                    }
                }
            }
        }
    }
}


/* =========================================================
   USAR POSICIONAMENTO
   ========================================================= */

function usePlacementItem() {

    if (!preparation)
        return;


    if (
        inventory.length === 0
    )
        return;


    const item =
        inventory[0];


    if (
        item.type === "trap" ||
        item.type === "barricade"
    ) {

        useInventory(0);
    }
}


/* =========================================================
   FIM DA ONDA
   ========================================================= */

/* =========================================================
   FIM DA ONDA
   ========================================================= */

function checkWaveComplete() {

    if (
        waveActive &&
        zombies.length === 0
    ) {

        // A onda terminou
        waveActive = false;

        // Próxima onda
        wave++;

        // Pequeno intervalo antes de voltar ao menu
        setTimeout(() => {

            if (gameEnded)
                return;


            // Para completamente a partida
            gameRunning = false;

            preparation = false;

            waveActive = false;


            // Esconde o HUD do jogo
            if (hud) {

                hud.style.display =
                    "none";
            }


            // Esconde o inventário durante o menu
            if (gameInventory) {

                gameInventory.style.display =
                    "none";
            }


            // Mostra novamente a loja/menu
            if (shopScreen) {

                shopScreen.style.display =
                    "block";
            }


            // Atualiza a loja
            renderItems();

            renderInventory();

            updateHUD();

        },1200);
    }
}

/* =========================================================
   PRÓXIMA PREPARAÇÃO
   ========================================================= */

function startPreparation() {

    waveActive = false;

    preparation = true;

    preparationTime =
        PREPARATION_TIME;


    gameRunning = true;


    updateHUD();
}


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

    if (!healthBar)
        return;


    const name =
        getPlayerName() ||
        "Jogador";


    nameHud.textContent =
        name;


    const healthPercent =
        (
            player.health /
            player.maxHealth
        ) * 100;


    healthBar.style.width =
        `${Math.max(
            0,
            healthPercent
        )}%`;


    if (armorBar) {

        const armorPercent =
            player.maxArmor > 0
                ?
                (
                    player.armor /
                    player.maxArmor
                ) * 100
                :
                0;


        armorBar.style.width =
            `${Math.max(
                0,
                armorPercent
            )}%`;
    }


    if (preparation) {

        waveEl.textContent =
            `PREPARAÇÃO — ${Math.ceil(
                preparationTime
            )}s`;

        enemiesEl.textContent =
            "🪤 COLOQUE SUAS DEFESAS";

    } else {

        waveEl.textContent =
            `ONDA ${wave}`;

        enemiesEl.textContent =
            `Zumbis: ${zombies.length}`;
    }


    weaponEl.textContent =
        player.weapon.name.toUpperCase();


    ammoEl.textContent =
        `${player.ammo} / ${player.reserveAmmo}`;


    moneyHud.textContent =
        `💵 $${player.money}`;


    moneyEl.textContent =
        player.money;


    if (preparation) {

        startWaveBtn.textContent =
            `⏱️ PREPARAÇÃO: ${Math.ceil(
                preparationTime
            )}s`;

    } else {

        startWaveBtn.textContent =
            "▶ INICIAR ONDA";
    }
}


/* =========================================================
   DESENHO
   ========================================================= */

function drawBackground() {

    ctx.fillStyle =
        "#101310";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    const grid = 50;


    for (
        let x = 0;
        x < canvas.width;
        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(x,0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y < canvas.height;
        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(0,y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    if (preparation) {

        ctx.fillStyle =
            "rgba(180,0,0,0.15)";


        ctx.fillRect(
            canvas.width - 100,
            0,
            100,
            canvas.height
        );


        ctx.fillStyle =
            "#ff4444";


        ctx.font =
            "bold 18px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(
            "ZUMBIS",
            canvas.width - 50,
            35
        );


        ctx.fillText(
            "→",
            canvas.width - 50,
            65
        );
    }
}


function drawPlayer() {

    ctx.save();


    ctx.translate(
        player.x,
        player.y
    );


    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );


    ctx.rotate(angle);


    /* pernas */

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        -12,
        15,
        9,
        25
    );

    ctx.fillRect(
        3,
        15,
        9,
        25
    );


    /* botas */

    ctx.fillStyle =
        "#050505";

    ctx.fillRect(
        -14,
        34,
        12,
        7
    );

    ctx.fillRect(
        3,
        34,
        12,
        7
    );


    /* corpo */

    ctx.fillStyle =
        "#28352d";

    ctx.fillRect(
        -17,
        -10,
        34,
        32
    );


    /* colete */

    ctx.fillStyle =
        "#171c1a";

    ctx.fillRect(
        -15,
        -8,
        30,
        25
    );


    ctx.strokeStyle =
        "#59655e";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        -15,
        -8,
        30,
        25
    );


    /* cabeça */

    ctx.fillStyle =
        "#c98d68";

    ctx.beginPath();

    ctx.arc(
        0,
        -25,
        13,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* capacete */

    ctx.fillStyle =
        "#252d29";

    ctx.beginPath();

    ctx.arc(
        0,
        -28,
        14,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* braços */

    ctx.fillStyle =
        "#334239";

    ctx.fillRect(
        10,
        -5,
        22,
        8
    );


    /* arma */

    ctx.fillStyle =
        "#090909";

    ctx.fillRect(
        20,
        -8,
        35,
        6
    );

    ctx.fillRect(
        15,
        -4,
        12,
        10
    );


    ctx.restore();
}


function drawZombie(z) {

    ctx.save();


    ctx.translate(
        z.x,
        z.y
    );


    /* pernas */

    ctx.fillStyle =
        "#292929";

    ctx.fillRect(
        -13,
        18,
        10,
        28
    );

    ctx.fillRect(
        3,
        18,
        10,
        28
    );


    /* corpo */

    ctx.fillStyle =
        z.type === "Burning"
            ? "#713525"
            : z.type === "Toxic"
            ? "#355d37"
            : "#3b403d";


    ctx.fillRect(
        -18,
        -10,
        36,
        34
    );


    /* braços */

    ctx.fillStyle =
        "#596057";

    ctx.fillRect(
        -35,
        -5,
        20,
        9
    );

    ctx.fillRect(
        15,
        -5,
        20,
        9
    );


    /* cabeça */

    ctx.fillStyle =
        z.type === "Mutant"
            ? "#657a5b"
            : "#77806e";


    ctx.beginPath();

    ctx.arc(
        0,
        -24,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* olhos */

    ctx.fillStyle =
        "#ff2222";

    ctx.fillRect(
        -7,
        -28,
        5,
        5
    );

    ctx.fillRect(
        2,
        -28,
        5,
        5
    );


    /* boca */

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        -7,
        -18,
        14,
        4
    );


    /* burning */

    if (
        z.type === "Burning"
    ) {

        ctx.fillStyle =
            "#ff6b00";


        ctx.beginPath();

        ctx.arc(
            0,
            5,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* toxic */

    if (
        z.type === "Toxic"
    ) {

        ctx.fillStyle =
            "#9cff55";


        ctx.beginPath();

        ctx.arc(
            12,
            5,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* boss */

    if (
        z.type === "Boss"
    ) {

        ctx.strokeStyle =
            "#ff0000";

        ctx.lineWidth = 3;


        ctx.strokeRect(
            -21,
            -42,
            42,
            75
        );
    }


    /* vida */

    const barWidth = 55;


    ctx.fillStyle =
        "#222";


    ctx.fillRect(
        -barWidth / 2,
        -50,
        barWidth,
        6
    );


    ctx.fillStyle =
        "#e33";


    ctx.fillRect(
        -barWidth / 2,
        -50,
        barWidth *
        Math.max(
            0,
            z.health /
            z.maxHealth
        ),
        6
    );


    ctx.restore();
}


function drawBullets() {

    ctx.fillStyle =
        "#ffd65a";


    for (
        const b of bullets
    ) {

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


function drawTraps() {

    for (
        const trap of placedTraps
    ) {

        ctx.save();


        ctx.translate(
            trap.x,
            trap.y
        );


        ctx.fillStyle =
            "#777";


        ctx.fillRect(
            -20,
            -8,
            40,
            16
        );


        ctx.strokeStyle =
            "#ddd";


        ctx.beginPath();


        for (
            let i = -15;
            i <= 15;
            i += 10
        ) {

            ctx.moveTo(
                i,
                -8
            );

            ctx.lineTo(
                i + 5,
                8
            );
        }


        ctx.stroke();


        ctx.restore();
    }
}


function drawBarricades() {

    for (
        const b of placedBarricades
    ) {

        ctx.save();


        ctx.translate(
            b.x,
            b.y
        );


        ctx.fillStyle =
            "#725033";


        ctx.fillRect(
            -b.width / 2,
            -b.height / 2,
            b.width,
            b.height
        );


        ctx.strokeStyle =
            "#25180f";

        ctx.lineWidth = 4;


        ctx.strokeRect(
            -b.width / 2,
            -b.height / 2,
            b.width,
            b.height
        );


        ctx.fillStyle =
            "#e33";


        ctx.fillRect(
            -b.width / 2,
            -b.height / 2 - 10,
            b.width *
            Math.max(
                0,
                b.health /
                b.maxHealth
            ),
            5
        );


        ctx.restore();
    }
}


function drawFriend() {

    if (!friend)
        return;


    ctx.save();


    ctx.font =
        "35px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        friend.icon,
        player.x - 45,
        player.y + 12
    );


    ctx.restore();
}


/* =========================================================
   RANKING GLOBAL
   ========================================================= */

async function loadRanking() {

    rankingContent.innerHTML = `
        <div class="ranking-loading">
            ⏳ Carregando ranking...
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


        if (error) {
            throw error;
        }


        if (
            !data ||
            data.length === 0
        ) {

            rankingContent.innerHTML = `
                <div class="ranking-empty">
                    🏆 Ainda não existem jogadores no ranking.
                </div>
            `;

            return;
        }


        let html = `

            <table class="ranking-table">

                <thead>

                    <tr>

                        <th>Pos.</th>

                        <th>Jogador</th>

                        <th>Ondas</th>

                        <th>Dinheiro</th>

                    </tr>

                </thead>

                <tbody>
        `;


        data.forEach(
            (player,index) => {

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

                        <td class="ranking-position">
                            ${position}
                        </td>

                        <td class="ranking-player">
                            ${escapeHTML(
                                player.player_name
                            )}
                        </td>

                        <td>
                            🧟 ${player.waves}
                        </td>

                        <td class="ranking-money">
                            💵 $${Number(
                                player.total_money
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


    } catch (error) {

        console.error(
            "Erro no ranking:",
            error
        );


        rankingContent.innerHTML = `

            <div class="ranking-error">

                ❌ Não foi possível carregar o ranking.

                <br><br>

                Verifique a configuração do Supabase.

            </div>
        `;
    }
}


/* =========================================================
   PROTEÇÃO CONTRA HTML NO NOME
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}


/* =========================================================
   ABRIR RANKING
   ========================================================= */

rankingBtn.addEventListener(
    "click",
    () => {

        rankingScreen.style.display =
            "block";

        loadRanking();

    }
);


/* =========================================================
   FECHAR RANKING
   ========================================================= */

closeRankingBtn.addEventListener(
    "click",
    () => {

        rankingScreen.style.display =
            "none";

    }
);


/* =========================================================
   ENVIAR RESULTADO
   ========================================================= */

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

    } catch (error) {

        console.error(
            "Erro no ranking:",
            error
        );

        rankingSent = false;
    }
}


/* =========================================================
   GAME OVER
   ========================================================= */

function endGame() {

    if (gameEnded)
        return;


    gameEnded = true;

    gameRunning = false;

    waveActive = false;

    preparation = false;


    finalScore.innerHTML = `

        ${escapeHTML(
            getPlayerName() ||
            "Jogador"
        )}

        <br><br>

        🧟 Ondas:
        <strong>${wave}</strong>

        <br>

        💵 Dinheiro acumulado:
        <strong>
            $${player.money.toLocaleString(
                "pt-BR"
            )}
        </strong>

        <br>

        🏆 Pontuação:
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


/* =========================================================
   CATEGORIAS
   ========================================================= */

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".category-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
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

    });


/* =========================================================
   REINICIAR
   ========================================================= */

restartBtn.addEventListener(
    "click",
    () => {

        location.reload();

    }
);


/* =========================================================
   LOOP
   ========================================================= */

let lastTime =
    performance.now();


function gameLoop(time) {

    const dt =
        Math.min(
            0.033,
            (time - lastTime) /
            1000
        );


    lastTime = time;


    drawBackground();


    if (
        gameRunning &&
        !gameEnded
    ) {

        updatePlayer(dt);


        if (preparation) {

            updatePreparation(dt);

        } else if (waveActive) {

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


            checkWaveComplete();
        }


        updateReload(dt);


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


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function init() {

    player.y =
        canvas.height / 2;


    shopScreen.style.display =
        "block";


    if (hud) {

        hud.style.display =
            "none";
    }


    if (gameInventory) {

        gameInventory.style.display =
            "none";
    }


    if (gameOver) {

        gameOver.style.display =
            "none";
    }


    if (rankingScreen) {

        rankingScreen.style.display =
            "none";
    }


    renderItems();

    renderInventory();

    updateHUD();
}


init();


requestAnimationFrame(
    gameLoop
);
