"use strict";

/* =====================================================
   THEY ARE COMING
   LUDIX
   VERSÃO ATUALIZADA
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const shopScreen = document.getElementById("shopScreen");
const shopContent = document.getElementById("shopContent");
const moneyEl = document.getElementById("money");

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

const armorHud =
    document.getElementById("armorHud");

const waveEl =
    document.getElementById("wave");

const enemiesEl =
    document.getElementById("enemies");

const preparationHud =
    document.getElementById("preparationHud");

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


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const INVENTORY_SIZE = 5;

const START_MONEY = 500;

const ZOMBIE_REWARD = 50;

const INITIAL_PREPARATION = 30;

const MIN_PREPARATION = 15;

const PREPARATION_DECREASE = 5;

const PLAYER_DAMAGE = 5;

const MAX_BULLETS_PER_AMMO = 50;

const BOMB_RANGE_BONUS = 150;


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
   ARMAS DE FOGO
===================================================== */

const weapons = [

    {
        name:"Pistola",
        damage:18,
        fireRate:350,
        magazine:12,
        ammoType:"Munição de Pistola",
        ammoPrice:100,
        range:700,
        price:0,
        visual:"pistol"
    },

    {
        name:"Glock 17",
        damage:20,
        fireRate:300,
        magazine:17,
        ammoType:"Munição Glock",
        ammoPrice:150,
        range:700,
        price:450,
        visual:"glock"
    },

    {
        name:"Desert Eagle",
        damage:45,
        fireRate:650,
        magazine:7,
        ammoType:"Munição Magnum",
        ammoPrice:200,
        range:750,
        price:900,
        visual:"deagle"
    },

    {
        name:"Uzi",
        damage:15,
        fireRate:100,
        magazine:32,
        ammoType:"Munição Uzi",
        ammoPrice:250,
        range:650,
        price:850,
        visual:"uzi"
    },

    {
        name:"MP5",
        damage:20,
        fireRate:110,
        magazine:30,
        ammoType:"Munição MP5",
        ammoPrice:300,
        range:700,
        price:1200,
        visual:"mp5"
    },

    {
        name:"MP7",
        damage:18,
        fireRate:85,
        magazine:40,
        ammoType:"Munição MP7",
        ammoPrice:350,
        range:680,
        price:1400,
        visual:"mp7"
    },

    {
        name:"P90",
        damage:19,
        fireRate:75,
        magazine:50,
        ammoType:"Munição P90",
        ammoPrice:400,
        range:700,
        price:1700,
        visual:"p90"
    },

    {
        name:"Shotgun",
        damage:65,
        fireRate:850,
        magazine:6,
        ammoType:"Cartuchos Shotgun",
        ammoPrice:450,
        range:450,
        price:1100,
        visual:"shotgun"
    },

    {
        name:"Double Barrel",
        damage:95,
        fireRate:1100,
        magazine:2,
        ammoType:"Cartuchos Double",
        ammoPrice:500,
        range:430,
        price:1500,
        visual:"double"
    },

    {
        name:"M870",
        damage:72,
        fireRate:750,
        magazine:8,
        ammoType:"Cartuchos M870",
        ammoPrice:550,
        range:500,
        price:1800,
        visual:"m870"
    },

    {
        name:"AK-47",
        damage:32,
        fireRate:150,
        magazine:30,
        ammoType:"Munição AK-47",
        ammoPrice:600,
        range:800,
        price:2200,
        visual:"ak"
    },

    {
        name:"AK-74",
        damage:35,
        fireRate:145,
        magazine:30,
        ammoType:"Munição AK-74",
        ammoPrice:650,
        range:800,
        price:2400,
        visual:"ak74"
    },

    {
        name:"M4",
        damage:30,
        fireRate:120,
        magazine:30,
        ammoType:"Munição M4",
        ammoPrice:700,
        range:850,
        price:2300,
        visual:"m4"
    },

    {
        name:"M16",
        damage:34,
        fireRate:130,
        magazine:30,
        ammoType:"Munição M16",
        ammoPrice:750,
        range:900,
        price:2500,
        visual:"m16"
    },

    {
        name:"SCAR",
        damage:40,
        fireRate:170,
        magazine:20,
        ammoType:"Munição SCAR",
        ammoPrice:800,
        range:900,
        price:2800,
        visual:"scar"
    },

    {
        name:"FAMAS",
        damage:31,
        fireRate:100,
        magazine:25,
        ammoType:"Munição FAMAS",
        ammoPrice:850,
        range:820,
        price:2500,
        visual:"famas"
    },

    {
        name:"G36",
        damage:34,
        fireRate:115,
        magazine:30,
        ammoType:"Munição G36",
        ammoPrice:900,
        range:850,
        price:2700,
        visual:"g36"
    },

    {
        name:"AUG",
        damage:38,
        fireRate:120,
        magazine:30,
        ammoType:"Munição AUG",
        ammoPrice:950,
        range:900,
        price:2900,
        visual:"aug"
    },

    {
        name:"Vector",
        damage:24,
        fireRate:65,
        magazine:40,
        ammoType:"Munição Vector",
        ammoPrice:1000,
        range:680,
        price:2300,
        visual:"vector"
    },

    {
        name:"Thompson",
        damage:28,
        fireRate:120,
        magazine:30,
        ammoType:"Munição Thompson",
        ammoPrice:1050,
        range:700,
        price:1800,
        visual:"thompson"
    },

    {
        name:"M249",
        damage:42,
        fireRate:95,
        magazine:100,
        ammoType:"Munição M249",
        ammoPrice:1100,
        range:900,
        price:4000,
        visual:"m249"
    },

    {
        name:"PKM",
        damage:45,
        fireRate:105,
        magazine:100,
        ammoType:"Munição PKM",
        ammoPrice:1150,
        range:950,
        price:4500,
        visual:"pkm"
    },

    {
        name:"RPK",
        damage:40,
        fireRate:110,
        magazine:75,
        ammoType:"Munição RPK",
        ammoPrice:1200,
        range:900,
        price:3700,
        visual:"rpk"
    },

    {
        name:"Sniper",
        damage:150,
        fireRate:1100,
        magazine:5,
        ammoType:"Munição Sniper",
        ammoPrice:1250,
        range:1500,
        price:3500,
        visual:"sniper"
    },

    {
        name:"AWP",
        damage:220,
        fireRate:1400,
        magazine:5,
        ammoType:"Munição AWP",
        ammoPrice:1300,
        range:1700,
        price:5000,
        visual:"awp"
    },

    {
        name:"Barrett",
        damage:300,
        fireRate:1800,
        magazine:10,
        ammoType:"Munição Barrett",
        ammoPrice:1350,
        range:1900,
        price:6500,
        visual:"barrett"
    },

    {
        name:"RPG",
        damage:500,
        fireRate:2200,
        magazine:1,
        ammoType:"Foguetes RPG",
        ammoPrice:1400,
        range:1200,
        price:7000,
        visual:"rpg",
        explosive:true
    },

    {
        name:"Minigun",
        damage:28,
        fireRate:40,
        magazine:200,
        ammoType:"Munição Minigun",
        ammoPrice:1450,
        range:1000,
        price:8000,
        visual:"minigun"
    },

    {
        name:"Railgun",
        damage:800,
        fireRate:2200,
        magazine:3,
        ammoType:"Cargas Railgun",
        ammoPrice:1500,
        range:1800,
        price:10000,
        visual:"railgun"
    },

    {
        name:"Laser Gun",
        damage:100,
        fireRate:80,
        magazine:100,
        ammoType:"Células Laser",
        ammoPrice:1550,
        range:1200,
        price:9000,
        visual:"laser"
    },

    {
        name:"Plasma Rifle",
        damage:180,
        fireRate:250,
        magazine:30,
        ammoType:"Células Plasma",
        ammoPrice:1600,
        range:1300,
        price:12000,
        visual:"plasma"
    },

    {
        name:"Doom Cannon",
        damage:1200,
        fireRate:3000,
        magazine:1,
        ammoType:"Munição Doom",
        ammoPrice:1650,
        range:1600,
        price:20000,
        visual:"doom",
        explosive:true
    },

    /* =================================================
       +20 ARMAS NOVAS
    ================================================= */

    {
        name:"Beretta M9",
        damage:22,
        fireRate:280,
        magazine:15,
        ammoType:"Munição Beretta",
        ammoPrice:1700,
        range:700,
        price:500,
        visual:"beretta"
    },

    {
        name:"Colt 1911",
        damage:30,
        fireRate:420,
        magazine:8,
        ammoType:"Munição Colt",
        ammoPrice:1750,
        range:700,
        price:650,
        visual:"colt"
    },

    {
        name:"Five Seven",
        damage:24,
        fireRate:250,
        magazine:20,
        ammoType:"Munição Five Seven",
        ammoPrice:1800,
        range:720,
        price:850,
        visual:"fiveseven"
    },

    {
        name:"USP Tactical",
        damage:28,
        fireRate:300,
        magazine:12,
        ammoType:"Munição USP",
        ammoPrice:1850,
        range:760,
        price:1000,
        visual:"usp"
    },

    {
        name:"Magnum 44",
        damage:70,
        fireRate:800,
        magazine:6,
        ammoType:"Munição Magnum 44",
        ammoPrice:1900,
        range:850,
        price:1600,
        visual:"magnum"
    },

    {
        name:"MAC-10",
        damage:17,
        fireRate:90,
        magazine:30,
        ammoType:"Munição MAC",
        ammoPrice:1950,
        range:620,
        price:1000,
        visual:"mac10"
    },

    {
        name:"UMP45",
        damage:30,
        fireRate:125,
        magazine:25,
        ammoType:"Munição UMP",
        ammoPrice:2000,
        range:750,
        price:1900,
        visual:"ump"
    },

    {
        name:"PPSh-41",
        damage:24,
        fireRate:80,
        magazine:71,
        ammoType:"Munição PPSh",
        ammoPrice:2050,
        range:650,
        price:2400,
        visual:"ppsh"
    },

    {
        name:"HK416",
        damage:42,
        fireRate:100,
        magazine:30,
        ammoType:"Munição HK416",
        ammoPrice:2100,
        range:950,
        price:3500,
        visual:"hk416"
    },

    {
        name:"G3",
        damage:55,
        fireRate:220,
        magazine:20,
        ammoType:"Munição G3",
        ammoPrice:2150,
        range:1000,
        price:4000,
        visual:"g3"
    },

    {
        name:"FAL",
        damage:58,
        fireRate:200,
        magazine:20,
        ammoType:"Munição FAL",
        ammoPrice:2200,
        range:1050,
        price:4200,
        visual:"fal"
    },

    {
        name:"M14",
        damage:60,
        fireRate:260,
        magazine:20,
        ammoType:"Munição M14",
        ammoPrice:2250,
        range:1100,
        price:3800,
        visual:"m14"
    },

    {
        name:"SVD Dragunov",
        damage:180,
        fireRate:900,
        magazine:10,
        ammoType:"Munição SVD",
        ammoPrice:2300,
        range:1500,
        price:5500,
        visual:"svd"
    },

    {
        name:"M24",
        damage:210,
        fireRate:1200,
        magazine:5,
        ammoType:"Munição M24",
        ammoPrice:2350,
        range:1600,
        price:5200,
        visual:"m24"
    },

    {
        name:"SPAS-12",
        damage:85,
        fireRate:700,
        magazine:8,
        ammoType:"Cartuchos SPAS",
        ammoPrice:2400,
        range:520,
        price:3200,
        visual:"spas"
    },

    {
        name:"AA-12",
        damage:55,
        fireRate:130,
        magazine:20,
        ammoType:"Cartuchos AA12",
        ammoPrice:2450,
        range:500,
        price:5000,
        visual:"aa12"
    },

    {
        name:"Flamethrower",
        damage:75,
        fireRate:100,
        magazine:150,
        ammoType:"Combustível",
        ammoPrice:2500,
        range:450,
        price:7000,
        visual:"flame"
    },

    {
        name:"Grenade Launcher",
        damage:400,
        fireRate:1800,
        magazine:6,
        ammoType:"Granadas GL",
        ammoPrice:2550,
        range:1100,
        price:6500,
        visual:"gl",
        explosive:true
    },

    {
        name:"Gauss Rifle",
        damage:700,
        fireRate:1800,
        magazine:5,
        ammoType:"Cargas Gauss",
        ammoPrice:2600,
        range:1800,
        price:8500,
        visual:"gauss"
    },

    {
        name:"Tesla Rifle",
        damage:350,
        fireRate:500,
        magazine:20,
        ammoType:"Células Tesla",
        ammoPrice:2650,
        range:1000,
        price:8000,
        visual:"tesla"
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
        range:90,
        price:250,
        visual:"knife"
    },

    {
        name:"Faca Militar",
        damage:60,
        fireRate:430,
        range:95,
        price:500,
        visual:"militaryknife"
    },

    {
        name:"Taco de Baseball",
        damage:80,
        fireRate:650,
        range:110,
        price:700,
        visual:"bat"
    },

    {
        name:"Machado",
        damage:120,
        fireRate:850,
        range:105,
        price:1200,
        visual:"axe"
    },

    {
        name:"Machado Militar",
        damage:160,
        fireRate:800,
        range:110,
        price:1800,
        visual:"milaxe"
    },

    {
        name:"Facão",
        damage:130,
        fireRate:600,
        range:120,
        price:1500,
        visual:"machete"
    },

    {
        name:"Katana",
        damage:220,
        fireRate:500,
        range:140,
        price:3500,
        visual:"katana"
    },

    {
        name:"Espada",
        damage:250,
        fireRate:650,
        range:140,
        price:4500,
        visual:"sword"
    },

    {
        name:"Marreta",
        damage:300,
        fireRate:1000,
        range:120,
        price:5000,
        visual:"hammer"
    },

    {
        name:"Pé de Cabra",
        damage:100,
        fireRate:500,
        range:105,
        price:1000,
        visual:"crowbar"
    },

    {
        name:"Foice",
        damage:280,
        fireRate:800,
        range:145,
        price:6000,
        visual:"scythe"
    },

    {
        name:"Lança",
        damage:200,
        fireRate:700,
        range:180,
        price:4000,
        visual:"spear"
    },

    {
        name:"Motosserra",
        damage:350,
        fireRate:100,
        range:115,
        price:8000,
        visual:"chainsaw"
    },

    {
        name:"Martelo de Guerra",
        damage:450,
        fireRate:1200,
        range:125,
        price:10000,
        visual:"warhammer"
    },

    {
        name:"Espada Lendária",
        damage:700,
        fireRate:500,
        range:170,
        price:20000,
        visual:"legendary"
    }

];


/* =====================================================
   ARMADURAS
===================================================== */

const armors = [

    {
        name:"Colete Leve",
        armor:20,
        price:500
    },

    {
        name:"Colete Tático",
        armor:40,
        price:1200
    },

    {
        name:"Armadura Pesada",
        armor:60,
        price:2500
    },

    {
        name:"Armadura Militar",
        armor:80,
        price:4500
    },

    {
        name:"Armadura Especial",
        armor:100,
        price:7000
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
        name:"T-Rex",
        damage:180,
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
        name:"+5 de Vida",
        permanentHealth:5,
        price:1000,
        icon:"❤️"
    }

];


/* =====================================================
   BOMBAS
===================================================== */

const bombs = [

    {
        name:"Granada",
        damage:100,
        radius:100 + BOMB_RANGE_BONUS,
        price:300,
        icon:"💣"
    },

    {
        name:"Granada Explosiva",
        damage:180,
        radius:130 + BOMB_RANGE_BONUS,
        price:600,
        icon:"💣"
    },

    {
        name:"Bomba Pesada",
        damage:300,
        radius:160 + BOMB_RANGE_BONUS,
        price:1000,
        icon:"💥"
    },

    {
        name:"C4",
        damage:500,
        radius:190 + BOMB_RANGE_BONUS,
        price:1800,
        icon:"🧨"
    },

    {
        name:"Mina Explosiva",
        damage:350,
        radius:140 + BOMB_RANGE_BONUS,
        price:1200,
        icon:"💣"
    },

    {
        name:"Bomba Incendiária",
        damage:250,
        radius:150 + BOMB_RANGE_BONUS,
        price:1400,
        icon:"🔥"
    },

    {
        name:"Granada de Plasma",
        damage:600,
        radius:180 + BOMB_RANGE_BONUS,
        price:3000,
        icon:"⚡"
    },

    {
        name:"Bomba Nuclear",
        damage:1500,
        radius:300 + BOMB_RANGE_BONUS,
        price:10000,
        icon:"☢️"
    },

    {
        name:"Bomba Infernal",
        damage:2500,
        radius:350 + BOMB_RANGE_BONUS,
        price:20000,
        icon:"🔥"
    },

    {
        name:"Bomba Apocalipse",
        damage:5000,
        radius:450 + BOMB_RANGE_BONUS,
        price:40000,
        icon:"☢️"
    }

];


/* =====================================================
   ARMADILHAS
===================================================== */

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
    {name:"Death Trap",damage:2000,price:12000,icon:"☠️"}

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
        name:"Muralha de Ferro",
        health:1000,
        price:2500,
        icon:"🏗️"
    },

    {
        name:"Muralha Militar",
        health:2000,
        price:5000,
        icon:"🛡️"
    },

    {
        name:"Muralha Blindada",
        health:4000,
        price:9000,
        icon:"🏰"
    }

];


/* =====================================================
   ZUMBIS NORMAIS
===================================================== */

const zombieTypes = [

    {
        name:"Walker",
        health:60,
        speed:45,
        damage:5,
        color:"#5e8c4a",
        size:28,
        reward:50
    },

    {
        name:"Runner",
        health:45,
        speed:90,
        damage:7,
        color:"#a3a34a",
        size:25,
        reward:50,
        special:"runner"
    },

    {
        name:"Brute",
        health:180,
        speed:35,
        damage:12,
        color:"#743c3c",
        size:42,
        reward:50,
        special:"tank"
    },

    {
        name:"Crawler",
        health:80,
        speed:70,
        damage:8,
        color:"#684d7a",
        size:23,
        reward:50,
        special:"small"
    },

    {
        name:"Soldier",
        health:130,
        speed:55,
        damage:10,
        color:"#53616b",
        size:32,
        reward:50
    },

    {
        name:"Mutant",
        health:300,
        speed:45,
        damage:15,
        color:"#7c2c7c",
        size:45,
        reward:50,
        special:"regeneration"
    },

    {
        name:"Burning",
        health:220,
        speed:60,
        damage:18,
        color:"#e65a22",
        size:34,
        reward:50,
        special:"burn"
    },

    {
        name:"Toxic",
        health:250,
        speed:50,
        damage:20,
        color:"#4cd34c",
        size:35,
        reward:50,
        special:"toxic"
    },

    {
        name:"Tank",
        health:700,
        speed:25,
        damage:25,
        color:"#333d47",
        size:55,
        reward:50,
        special:"tank"
    }

];


/* =====================================================
   ESTADO DO JOGADOR
===================================================== */

let player = {

    x:180,
    y:0,

    width:34,
    height:58,

    speed:250,

    health:100,
    maxHealth:100,

    armor:0,
    maxArmor:0,

    money:START_MONEY,

    weapon:weapons[0],

    ammo:weapons[0].magazine,

    reserveAmmo:50,

    lastShot:0,

    meleeCooldown:0,

    score:0

};


/* =====================================================
   ESTADO DO JOGO
===================================================== */

let zombies = [];

let bullets = [];

let placedTraps = [];

let placedBarricades = [];

let inventory = [];

let selectedInventorySlot = 0;

let currentCategory = "armadura";

let wave = 1;

let waveActive = false;

let preparation = false;

let preparationTime = INITIAL_PREPARATION;

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

let bossCount = 0;

let bossReward = 5000;

let lastTime = performance.now();


/* =====================================================
   CONTROLES
===================================================== */

window.addEventListener(
    "keydown",
    e => {

        keys[e.key.toLowerCase()] = true;

        if (e.key === " ") {
            e.preventDefault();
        }

        if (
            e.key.toLowerCase() === "r"
        ) {
            reload();
        }

        if (
            ["1","2","3","4","5"]
                .includes(e.key)
        ) {

            selectInventory(
                Number(e.key)-1
            );
        }

        if (
            e.key.toLowerCase() === "e"
        ) {

            useSelectedInventory();
        }

        if (
            e.key.toLowerCase() === "q"
        ) {

            cycleWeapon(-1);
        }

        if (
            e.key.toLowerCase() === "f"
        ) {

            cycleWeapon(1);
        }

    }
);


window.addEventListener(
    "keyup",
    e => {

        keys[e.key.toLowerCase()] = false;

    }
);


canvas.addEventListener(
    "mousemove",
    e => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            e.clientX - rect.left;

        mouse.y =
            e.clientY - rect.top;

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
   NOME
===================================================== */

function getPlayerName() {

    return playerNameInput.value
        .trim()
        .replace(/\s+/g," ")
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


/* =====================================================
   VISUAL DAS ARMAS
===================================================== */

function weaponVisual(type,small=false) {

    const scale =
        small ? 0.55 : 1;

    let color = "#777";

    if (
        [
            "pistol",
            "glock",
            "beretta",
            "colt",
            "usp",
            "fiveseven"
        ].includes(type)
    ) {
        color = "#777";
    }

    if (
        [
            "ak",
            "ak74",
            "m4",
            "m16",
            "scar",
            "famas",
            "g36",
            "aug",
            "hk416",
            "g3",
            "fal",
            "m14"
        ].includes(type)
    ) {
        color = "#303030";
    }

    if (
        [
            "shotgun",
            "double",
            "m870",
            "spas",
            "aa12"
        ].includes(type)
    ) {
        color = "#68442d";
    }

    if (
        [
            "sniper",
            "awp",
            "barrett",
            "svd",
            "m24"
        ].includes(type)
    ) {
        color = "#222";
    }

    return `
        <div
            class="weapon-drawing ${type}"
            style="
                transform:scale(${scale});
                width:105px;
                height:55px;
                position:relative;
            "
        >
            <div style="
                position:absolute;
                left:10px;
                top:20px;
                width:75px;
                height:12px;
                background:${color};
                border-radius:3px;
                box-shadow:0 2px 2px #000;
            "></div>

            <div style="
                position:absolute;
                left:68px;
                top:13px;
                width:35px;
                height:9px;
                background:#191919;
                border-radius:3px;
            "></div>

            <div style="
                position:absolute;
                left:25px;
                top:30px;
                width:16px;
                height:28px;
                background:#222;
                transform:rotate(15deg);
                border-radius:2px;
            "></div>

            <div style="
                position:absolute;
                left:15px;
                top:15px;
                width:20px;
                height:8px;
                background:#111;
                border-radius:3px;
            "></div>
        </div>
    `;
}


/* =====================================================
   VISUAL DOS ITENS
===================================================== */

function itemVisual(item,type) {

    if (
        type === "armas"
    ) {

        return weaponVisual(
            item.visual,
            true
        );
    }

    if (
        type === "corpo"
    ) {

        return `
            <div class="melee-icon">
                ${item.icon || "⚔️"}
            </div>
        `;
    }

    if (item.icon) {
        return item.icon;
    }

    if (type === "armadura")
        return "🛡️";

    if (type === "amigos")
        return "🐾";

    if (type === "municao")
        return "📦";

    if (type === "kits")
        return "🩹";

    if (type === "bombas")
        return "💣";

    if (type === "armadilhas")
        return "🪤";

    if (type === "barricadas")
        return "🧱";

    return "📦";
}


/* =====================================================
   DESCRIÇÕES
===================================================== */

function itemDescription(item,type) {

    if (type === "armas") {

        return `
            Dano: ${item.damage}
            |
            Carregador: ${item.magazine}
            |
            Munição própria
        `;
    }

    if (type === "corpo") {

        return `
            Dano: ${item.damage}
            |
            Alcance: ${item.range}
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

        return `
            Recupera ${item.heal} de vida
        `;
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


/* =====================================================
   PEGAR ITENS DA CATEGORIA
===================================================== */

function getCategoryItems() {

    if (currentCategory === "armadura")
        return armors;

    if (currentCategory === "armas")
        return weapons;

    if (currentCategory === "corpo")
        return meleeWeapons;

    if (currentCategory === "amigos")
        return friends;

    if (currentCategory === "kits")
        return kits;

    if (currentCategory === "bombas")
        return bombs;

    if (currentCategory === "armadilhas")
        return traps;

    if (currentCategory === "barricadas")
        return barricades;

    return [];
}


/* =====================================================
   LOJA
===================================================== */

function renderItems() {

    shopContent.innerHTML = "";

    if (
        currentCategory === "municao"
    ) {

        renderAmmoShop();

        return;
    }

    const items =
        getCategoryItems();

    const grid =
        document.createElement("div");

    grid.className =
        "shop-grid";

    items.forEach(
        (item,index) => {

            const card =
                document.createElement("div");

            card.className =
                "shop-item";

            let equipped = false;

            if (
                currentCategory === "armas" &&
                player.weapon === item
            ) {

                equipped = true;
            }

            if (
                currentCategory === "corpo" &&
                player.weapon === item
            ) {

                equipped = true;
            }

            if (equipped) {

                card.classList.add(
                    "equipped"
                );
            }

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
                    $${Number(
                        item.price || 0
                    ).toLocaleString("pt-BR")}
                </strong>

                <button
                    onclick="buyItem(${index})"
                >
                    ${
                        equipped
                            ? "EQUIPADO"
                            : "COMPRAR"
                    }
                </button>

            `;

            grid.appendChild(card);

        }
    );

    shopContent.appendChild(grid);
}


/* =====================================================
   LOJA DE MUNIÇÃO
===================================================== */

function renderAmmoShop() {

    const grid =
        document.createElement("div");

    grid.className =
        "shop-grid";

    weapons.forEach(
        (weapon,index) => {

            const card =
                document.createElement("div");

            card.className =
                "shop-item";

            const currentAmmo =
                ammoInventory[weapon.name] || 0;

            card.innerHTML = `

                <div class="item-visual">
                    📦
                </div>

                <h3>
                    ${weapon.ammoType}
                </h3>

                <p>
                    50 unidades para
                    ${weapon.name}.
                    <br>
                    Possui:
                    ${currentAmmo}
                </p>

                <strong>
                    $${weapon.ammoPrice.toLocaleString("pt-BR")}
                </strong>

                <button
                    onclick="buyAmmoForWeapon(${index})"
                >
                    COMPRAR 50
                </button>

            `;

            grid.appendChild(card);

        }
    );

    shopContent.appendChild(grid);
}


/* =====================================================
   MUNIÇÃO DO JOGADOR
===================================================== */

let ammoInventory = {};


/* =====================================================
   COMPRAR MUNIÇÃO
===================================================== */

window.buyAmmoForWeapon =
function(index) {

    const weapon =
        weapons[index];

    if (!weapon)
        return;

    if (
        player.money <
        weapon.ammoPrice
    ) {

        alert(
            "Dinheiro insuficiente!"
        );

        return;
    }

    player.money -=
        weapon.ammoPrice;

    if (
        !ammoInventory[
            weapon.name
        ]
    ) {

        ammoInventory[
            weapon.name
        ] = 0;
    }

    ammoInventory[
        weapon.name
    ] += MAX_BULLETS_PER_AMMO;

    updateHUD();

    renderItems();
};


/* =====================================================
   COMPRAR ITEM
===================================================== */

window.buyItem =
function(index) {

    const items =
        getCategoryItems();

    const item =
        items[index];

    if (!item)
        return;

    if (
        player.money <
        item.price
    ) {

        alert(
            "Dinheiro insuficiente!"
        );

        return;
    }


    /* ARMAS */

    if (
        currentCategory === "armas"
    ) {

        if (
            inventory.length >=
            INVENTORY_SIZE
        ) {

            alert(
                "Seu inventário de armas está cheio! Máximo: 5."
            );

            return;
        }

        player.money -=
            item.price;

        if (
            !inventory.some(
                x =>
                    x.weapon === item
            )
        ) {

            inventory.push({
                type:"weapon",
                weapon:item
            });
        }

        player.weapon =
            item;

        if (
            ammoInventory[
                item.name
            ] === undefined
        ) {

            ammoInventory[
                item.name
            ] = 0;
        }

        if (
            player.weapon !==
            item
        ) {

            player.weapon = item;
        }

        updateHUD();

        renderInventory();

        renderItems();

        return;
    }


    /* CORPO A CORPO */

    if (
        currentCategory === "corpo"
    ) {

        if (
            inventory.length >=
            INVENTORY_SIZE
        ) {

            alert(
                "Seu inventário de armas está cheio! Máximo: 5."
            );

            return;
        }

        player.money -=
            item.price;

        if (
            !inventory.some(
                x =>
                    x.weapon === item
            )
        ) {

            inventory.push({
                type:"weapon",
                weapon:item
            });
        }

        player.weapon =
            item;

        updateHUD();

        renderInventory();

        renderItems();

        return;
    }


    /* ARMADURA */

    if (
        currentCategory ===
        "armadura"
    ) {

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


    /* AMIGOS */

    if (
        currentCategory ===
        "amigos"
    ) {

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


    /* KITS */

    if (
        currentCategory === "kits"
    ) {

        player.money -=
            item.price;

        if (
            item.permanentHealth
        ) {

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


    /* BOMBAS */

    if (
        currentCategory === "bombas"
    ) {

        if (
            !addInventory({
                type:"bomb",
                item:item
            })
        ) {

            alert(
                "Inventário cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        renderInventory();

        renderItems();

        return;
    }


    /* ARMADILHAS */

    if (
        currentCategory ===
        "armadilhas"
    ) {

        if (
            !addInventory({
                type:"trap",
                item:item
            })
        ) {

            alert(
                "Inventário cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        renderInventory();

        renderItems();

        return;
    }


    /* BARRICADAS */

    if (
        currentCategory ===
        "barricadas"
    ) {

        if (
            !addInventory({
                type:"barricade",
                item:item
            })
        ) {

            alert(
                "Inventário cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        renderInventory();

        renderItems();

        return;
    }

};


/* =====================================================
   INVENTÁRIO
===================================================== */

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


function selectInventory(index) {

    if (
        index < 0 ||
        index >=
        inventory.length
    ) {

        return;
    }

    if (
        inventory[index].type ===
        "weapon"
    ) {

        player.weapon =
            inventory[index].weapon;

        selectedInventorySlot =
            index;

        updateHUD();

        renderInventory();
    }
}


function cycleWeapon(direction) {

    const weaponsInInventory =
        inventory.filter(
            x =>
                x.type === "weapon"
        );

    if (
        weaponsInInventory.length === 0
    ) {

        return;
    }

    let current =
        weaponsInInventory.findIndex(
            x =>
                x.weapon ===
                player.weapon
        );

    if (current < 0)
        current = 0;

    current += direction;

    if (
        current < 0
    ) {

        current =
            weaponsInInventory.length-1;
    }

    if (
        current >=
        weaponsInInventory.length
    ) {

        current = 0;
    }

    player.weapon =
        weaponsInInventory[
            current
        ].weapon;

    selectedInventorySlot =
        inventory.indexOf(
            weaponsInInventory[current]
        );

    updateHUD();

    renderInventory();
}


function renderInventory() {

    menuInventory.innerHTML = "";

    gameInventorySlots.innerHTML = "";

    for (
        let i=0;
        i<INVENTORY_SIZE;
        i++
    ) {

        const menuSlot =
            document.createElement("div");

        const gameSlot =
            document.createElement("div");

        menuSlot.className =
            "inventory-slot";

        gameSlot.className =
            "inventory-slot";

        if (
            i ===
            selectedInventorySlot
        ) {

            menuSlot.classList.add(
                "selected"
            );

            gameSlot.classList.add(
                "selected"
            );
        }

        if (
            inventory[i]
        ) {

            const item =
                inventory[i];

            if (
                item.type === "weapon"
            ) {

                menuSlot.innerHTML =
                    weaponVisual(
                        item.weapon.visual,
                        true
                    );

                gameSlot.innerHTML =
                    weaponVisual(
                        item.weapon.visual,
                        true
                    );

                menuSlot.innerHTML += `
                    <span class="slot-name">
                        ${item.weapon.name}
                    </span>
                `;

                gameSlot.innerHTML += `
                    <span class="slot-name">
                        ${item.weapon.name}
                    </span>
                `;

            } else {

                menuSlot.innerHTML =
                    itemVisual(
                        item.item,
                        item.type ===
                        "bomb"
                            ? "bombas"
                            : item.type ===
                              "trap"
                                ? "armadilhas"
                                : "barricadas"
                    );

                gameSlot.innerHTML =
                    menuSlot.innerHTML;
            }

        } else {

            menuSlot.innerHTML =
                `<span>${i+1}</span>`;

            gameSlot.innerHTML =
                `<span>${i+1}</span>`;
        }

        menuInventory.appendChild(
            menuSlot
        );

        gameInventorySlots.appendChild(
            gameSlot
        );
    }
}


function useSelectedInventory() {

    const item =
        inventory[
            selectedInventorySlot
        ];

    if (!item)
        return;

    if (
        item.type === "bomb"
    ) {

        useBomb(
            item.item
        );

        inventory.splice(
            selectedInventorySlot,
            1
        );
    }

    if (
        item.type === "trap"
    ) {

        placeTrap(
            item.item
        );

        if (preparation) {

            inventory.splice(
                selectedInventorySlot,
                1
            );
        }
    }

    if (
        item.type === "barricade"
    ) {

        placeBarricade(
            item.item
        );

        if (preparation) {

            inventory.splice(
                selectedInventorySlot,
                1
            );
        }
    }

    renderInventory();
}


function usePlacementItem() {

    const item =
        inventory[
            selectedInventorySlot
        ];

    if (!item)
        return;

    if (
        item.type === "trap" ||
        item.type === "barricade"
    ) {

        useSelectedInventory();
    }
}


/* =====================================================
   RECARGAR
===================================================== */

function reload() {

    if (
        !player.weapon ||
        !player.weapon.magazine
    ) {

        return;
    }

    if (
        player.weapon ===
        weapons.find(
            w => w.name === player.weapon.name
        )
    ) {

        const available =
            ammoInventory[
                player.weapon.name
            ] || 0;

        const needed =
            player.weapon.magazine -
            player.ammo;

        if (
            needed <= 0 ||
            available <= 0
        ) {

            return;
        }

        const amount =
            Math.min(
                needed,
                available
            );

        player.ammo +=
            amount;

        ammoInventory[
            player.weapon.name
        ] -= amount;
    }
}


/* =====================================================
   DISPARAR
===================================================== */

function shoot() {

    if (
        !player.weapon
    )
        return;

    if (
        meleeWeapons.includes(
            player.weapon
        )
    ) {

        meleeAttack();

        return;
    }

    const now =
        performance.now();

    if (
        now -
        player.lastShot <
        player.weapon.fireRate
    ) {

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

    const angle =
        Math.atan2(
            mouse.y-player.y,
            mouse.x-player.x
        );

    const speed =
        900;

    bullets.push({

        x:player.x+25,

        y:player.y,

        vx:Math.cos(angle)*speed,

        vy:Math.sin(angle)*speed,

        damage:player.weapon.damage,

        range:player.weapon.range,

        traveled:0,

        explosive:
            player.weapon.explosive || false

    });

    updateHUD();
}


/* =====================================================
   ATAQUE CORPO A CORPO
===================================================== */

function meleeAttack() {

    const now =
        performance.now();

    if (
        now -
        player.meleeCooldown <
        player.weapon.fireRate
    ) {

        return;
    }

    player.meleeCooldown =
        now;

    const angle =
        Math.atan2(
            mouse.y-player.y,
            mouse.x-player.x
        );

    for (
        const z of zombies
    ) {

        const dx =
            z.x-player.x;

        const dy =
            z.y-player.y;

        const distance =
            Math.hypot(dx,dy);

        if (
            distance >
            player.weapon.range
        )
            continue;

        const targetAngle =
            Math.atan2(dy,dx);

        let diff =
            Math.abs(
                targetAngle-angle
            );

        if (diff > Math.PI)
            diff =
                Math.PI*2-diff;

        if (
            diff < .9
        ) {

            z.health -=
                player.weapon.damage;
        }
    }
}


/* =====================================================
   BOMBA
===================================================== */

function useBomb(bomb) {

    if (!bomb)
        return;

    for (
        const z of zombies
    ) {

        const distance =
            Math.hypot(
                z.x-player.x,
                z.y-player.y
            );

        if (
            distance <=
            bomb.radius
        ) {

            z.health -=
                bomb.damage;
        }
    }
}


/* =====================================================
   ARMADILHAS
===================================================== */

function placeTrap(trap) {

    if (!preparation) {

        alert(
            "Armadilhas só podem ser colocadas durante a preparação!"
        );

        return;
    }

    placedTraps.push({

        x:player.x,

        y:player.y,

        radius:70,

        damage:trap.damage,

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
            let i=zombies.length-1;
            i>=0;
            i--
        ) {

            const z =
                zombies[i];

            const distance =
                Math.hypot(
                    z.x-trap.x,
                    z.y-trap.y
                );

            if (
                distance <
                trap.radius
            ) {

                z.health -=
                    trap.damage;

                trap.active =
                    false;

                break;
            }
        }
    }

    placedTraps =
        placedTraps.filter(
            x => x.active
        );
}


/* =====================================================
   BARRICADAS
===================================================== */

function placeBarricade(
    barricade
) {

    if (!preparation) {

        alert(
            "Barricadas só podem ser colocadas durante a preparação!"
        );

        return;
    }

    placedBarricades.push({

        x:player.x,

        y:player.y,

        width:90,

        height:35,

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
                    z.x-b.x,
                    z.y-b.y
                );

            if (
                distance < 70
            ) {

                b.health -=
                    z.damage*dt;

                z.x +=
                    40*dt;
            }
        }
    }

    placedBarricades =
        placedBarricades.filter(
            b => b.health > 0
        );
}


/* =====================================================
   SPAWN DE ZUMBIS
===================================================== */

function spawnZombie(type) {

    const base =
        type;

    const healthBonus =
        wave >= 5
            ? (wave-4)*5
            : 0;

    zombies.push({

        x:
            canvas.width+80,

        y:
            100+
            Math.random()*
            Math.max(
                100,
                canvas.height-200
            ),

        health:
            base.health+
            healthBonus,

        maxHealth:
            base.health+
            healthBonus,

        speed:
            base.speed+
            Math.min(
                wave*1.2,
                35
            ),

        damage:
            base.damage,

        size:
            base.size,

        color:
            base.color,

        reward:50,

        name:
            base.name,

        special:
            base.special || null,

        regenTimer:0

    });
}


/* =====================================================
   BOSS
===================================================== */

function spawnBoss() {

    bossCount++;

    const bossHealth =
        500 *
        Math.pow(
            2,
            bossCount-1
        );

    const bossDamage =
        100 *
        Math.pow(
            2,
            bossCount-1
        );

    zombies.push({

        x:
            canvas.width+120,

        y:
            canvas.height/2,

        health:
            bossHealth,

        maxHealth:
            bossHealth,

        speed:
            18+
            bossCount*3,

        damage:
            bossDamage,

        size:
            85+
            bossCount*5,

        color:"#160808",

        reward:
            bossReward,

        name:"BOSS",

        boss:true,

        special:"boss"

    });

    bossReward *= 2;

    showBossWarning();
}


function showBossWarning() {

    const warning =
        document.createElement(
            "div"
        );

    warning.className =
        "boss-warning";

    warning.textContent =
        "☠️ BOSS INCOMING ☠️";

    document.body.appendChild(
        warning
    );

    setTimeout(
        () => warning.remove(),
        3500
    );
}


/* =====================================================
   CRIAR ONDA
===================================================== */

function createWave() {

    zombies = [];

    bullets = [];

    placedTraps = [];

    placedBarricades = [];

    if (
        wave % 10 === 0
    ) {

        spawnBoss();

        return;
    }

    let amount =
        5+
        wave*2;

    for (
        let i=0;
        i<amount;
        i++
    ) {

        let type =
            zombieTypes[0];

        if (
            wave >= 5
        ) {

            const available =
                zombieTypes.slice(
                    0,
                    Math.min(
                        zombieTypes.length,
                        2+
                        Math.floor(
                            wave/2
                        )
                    )
                );

            type =
                available[
                    Math.floor(
                        Math.random()*
                        available.length
                    )
                ];
        }

        spawnZombie(type);
    }
}


/* =====================================================
   PREPARAÇÃO
===================================================== */

function getPreparationDuration() {

    return Math.max(
        MIN_PREPARATION,
        INITIAL_PREPARATION -
        ((wave-1)*
        PREPARATION_DECREASE)
    );
}


function startPreparation() {

    preparation = true;

    waveActive = false;

    preparationTime =
        getPreparationDuration();

    updatePreparationHUD();
}


function skipPreparation() {

    if (!preparation)
        return;

    preparationTime = 0;

    preparation = false;

    waveActive = true;

    createWave();

    updatePreparationHUD();
}


function updatePreparation(dt) {

    if (!preparation)
        return;

    preparationTime -= dt;

    if (
        preparationTime <= 0
    ) {

        preparationTime = 0;

        preparation = false;

        waveActive = true;

        createWave();
    }

    updatePreparationHUD();
}


function updatePreparationHUD() {

    if (!preparation) {

        preparationHud.textContent =
            "";

        const btn =
            document.getElementById(
                "skipPreparationBtn"
            );

        if (btn)
            btn.style.display =
                "none";

        return;
    }

    preparationHud.textContent =
        `PREPARAÇÃO: ${Math.ceil(
            preparationTime
        )}s`;

    const btn =
        document.getElementById(
            "skipPreparationBtn"
        );

    if (btn)
        btn.style.display =
            "block";
}


/* =====================================================
   INICIAR ONDA
===================================================== */

function startWave() {

    if (gameEnded)
        return;

    if (!validatePlayerName())
        return;

    shopScreen.style.display =
        "none";

    hud.style.display =
        "flex";

    gameInventory.style.display =
        "block";

    gameRunning = true;

    gameEnded = false;

    player.x = 180;

    player.y =
        canvas.height/2;

    startPreparation();

    updateHUD();
}


/* =====================================================
   MOVIMENTO
===================================================== */

function updatePlayer(dt) {

    let dx=0;
    let dy=0;

    if (keys["w"] ||
        keys["arrowup"])
        dy--;

    if (keys["s"] ||
        keys["arrowdown"])
        dy++;

    if (keys["a"] ||
        keys["arrowleft"])
        dx--;

    if (keys["d"] ||
        keys["arrowright"])
        dx++;

    if (dx !== 0 ||
        dy !== 0) {

        const length =
            Math.hypot(dx,dy);

        dx /= length;
        dy /= length;

        player.x +=
            dx*
            player.speed*
            dt;

        player.y +=
            dy*
            player.speed*
            dt;
    }

    player.x =
        Math.max(
            30,
            Math.min(
                canvas.width-30,
                player.x
            )
        );

    player.y =
        Math.max(
            80,
            Math.min(
                canvas.height-50,
                player.y
            )
        );
}


/* =====================================================
   ATUALIZAR TIROS
===================================================== */

function updateBullets(dt) {

    for (
        let i=bullets.length-1;
        i>=0;
        i--
    ) {

        const b =
            bullets[i];

        b.x +=
            b.vx*dt;

        b.y +=
            b.vy*dt;

        b.traveled +=
            Math.hypot(
                b.vx*dt,
                b.vy*dt
            );

        let hit = false;

        for (
            let j=zombies.length-1;
            j>=0;
            j--
        ) {

            const z =
                zombies[j];

            const distance =
                Math.hypot(
                    b.x-z.x,
                    b.y-z.y
                );

            if (
                distance <
                z.size
            ) {

                z.health -=
                    b.damage;

                hit = true;

                if (
                    b.explosive
                ) {

                    for (
                        const other
                        of zombies
                    ) {

                        const d =
                            Math.hypot(
                                other.x-b.x,
                                other.y-b.y
                            );

                        if (
                            d < 180
                        ) {

                            other.health -=
                                b.damage*.7;
                        }
                    }
                }

                break;
            }
        }

        if (
            hit ||
            b.traveled >
            b.range
        ) {

            bullets.splice(
                i,
                1
            );
        }
    }
}


/* =====================================================
   ATUALIZAR ZUMBIS
===================================================== */

function updateZombies(dt) {

    for (
        let i=zombies.length-1;
        i>=0;
        i--
    ) {

        const z =
            zombies[i];

        const dx =
            player.x-z.x;

        const dy =
            player.y-z.y;

        const distance =
            Math.hypot(dx,dy);

        if (
            distance > 45
        ) {

            z.x +=
                dx/distance*
                z.speed*
                dt;

            z.y +=
                dy/distance*
                z.speed*
                dt;

        } else {

            damagePlayer(
                z.damage*dt
            );
        }


        /* regeneração */

        if (
            z.special ===
            "regeneration"
        ) {

            z.health =
                Math.min(
                    z.maxHealth,
                    z.health+
                    5*dt
                );
        }


        /* corredor */

        if (
            z.special ===
            "runner"
        ) {

            z.speed =
                90+
                wave*1.5;
        }


        /* morte */

        if (
            z.health <= 0
        ) {

            killZombie(i,z);
        }
    }
}


/* =====================================================
   MATAR ZUMBI
===================================================== */

function killZombie(
    index,
    zombie
) {

    player.money +=
        zombie.reward;

    player.score +=
        zombie.reward;

    zombies.splice(
        index,
        1
    );

    updateHUD();
}


/* =====================================================
   DANO AO JOGADOR
===================================================== */

let damageCooldown = 0;

function damagePlayer(amount) {

    if (
        damageCooldown > 0
    )
        return;

    damageCooldown =
        .15;

    let damage =
        amount;

    if (
        player.armor > 0
    ) {

        const absorbed =
            Math.min(
                player.armor,
                damage*.6
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

function updateFriend() {

    if (!friend)
        return;

    const now =
        performance.now();

    if (
        now -
        friend.lastAttack <
        900
    )
        return;

    friend.lastAttack =
        now;

    let nearest =
        null;

    let nearestDistance =
        Infinity;

    for (
        const z of zombies
    ) {

        const d =
            Math.hypot(
                z.x-player.x,
                z.y-player.y
            );

        if (
            d <
            nearestDistance
        ) {

            nearestDistance = d;

            nearest = z;
        }
    }

    if (
        nearest &&
        nearestDistance < 400
    ) {

        nearest.health -=
            friend.damage;
    }
}


/* =====================================================
   BARRICADAS / ARMADILHAS
===================================================== */

function updateWorld(dt) {

    updateTraps();

    updateBarricades(dt);

    damageCooldown =
        Math.max(
            0,
            damageCooldown-dt
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

                if (gameEnded)
                    return;

                gameRunning = false;

                preparation = false;

                hud.style.display =
                    "none";

                gameInventory.style.display =
                    "none";

                shopScreen.style.display =
                    "flex";

                renderItems();

                renderInventory();

                updateHUD();

            },
            800
        );
    }
}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    const name =
        getPlayerName();

    nameHud.textContent =
        name ||
        "Jogador";

    waveEl.textContent =
        `ONDA ${wave}`;

    enemiesEl.textContent =
        `Zumbis: ${zombies.length}`;

    weaponEl.textContent =
        player.weapon
            ? player.weapon.name
            : "SEM ARMA";

    if (
        meleeWeapons.includes(
            player.weapon
        )
    ) {

        ammoEl.textContent =
            "CORPO A CORPO";

    } else {

        const reserve =
            ammoInventory[
                player.weapon.name
            ] || 0;

        ammoEl.textContent =
            `${player.ammo} / ${reserve}`;
    }

    moneyEl.textContent =
        player.money.toLocaleString(
            "pt-BR"
        );

    moneyHud.textContent =
        `💵 $${player.money.toLocaleString(
            "pt-BR"
        )}`;

    healthBar.style.width =
        `${Math.max(
            0,
            player.health/
            player.maxHealth*
            100
        )}%`;

    if (
        player.maxArmor > 0
    ) {

        armorHud.style.display =
            "block";

        armorBar.style.width =
            `${Math.max(
                0,
                player.armor/
                player.maxArmor*
                100
            )}%`;

    } else {

        armorHud.style.display =
            "none";
    }

    updatePreparationHUD();
}


/* =====================================================
   DESENHAR CENÁRIO
===================================================== */

function drawBackground() {

    ctx.fillStyle =
        "#12171a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* chão */

    ctx.fillStyle =
        "#1b2023";

    ctx.fillRect(
        0,
        canvas.height*.15,
        canvas.width,
        canvas.height*.85
    );


    /* linhas */

    ctx.strokeStyle =
        "rgba(255,255,255,.04)";

    ctx.lineWidth = 1;

    for (
        let x=0;
        x<canvas.width;
        x+=70
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            canvas.height*.15
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    /* prédios */

    for (
        let x=0;
        x<canvas.width;
        x+=180
    ) {

        const h =
            50+
            (x%130);

        ctx.fillStyle =
            "#20272b";

        ctx.fillRect(
            x,
            canvas.height*.15-h,
            130,
            h
        );

        ctx.fillStyle =
            "#b59b45";

        for (
            let wy=0;
            wy<h-20;
            wy+=25
        ) {

            ctx.fillRect(
                x+15,
                canvas.height*.15-h+10+wy,
                12,
                8
            );

            ctx.fillRect(
                x+55,
                canvas.height*.15-h+10+wy,
                12,
                8
            );

            ctx.fillRect(
                x+95,
                canvas.height*.15-h+10+wy,
                12,
                8
            );
        }
    }
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

    ctx.fillStyle =
        "#263a4a";

    ctx.fillRect(
        -17,
        -28,
        34,
        50
    );

    ctx.fillStyle =
        "#d2a17c";

    ctx.beginPath();

    ctx.arc(
        0,
        -39,
        12,
        0,
        Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle =
        "#171717";

    ctx.fillRect(
        -14,
        -50,
        28,
        7
    );

    ctx.restore();
}


/* =====================================================
   DESENHAR ARMA
===================================================== */

function drawWeapon() {

    if (!player.weapon)
        return;

    const angle =
        Math.atan2(
            mouse.y-player.y,
            mouse.x-player.x
        );

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    ctx.rotate(angle);

    let length = 45;

    if (
        meleeWeapons.includes(
            player.weapon
        )
    ) {

        length =
            Math.min(
                player.weapon.range,
                120
            );
    }

    ctx.fillStyle =
        "#171717";

    ctx.fillRect(
        5,
        -4,
        length,
        8
    );

    ctx.fillStyle =
        "#5a4028";

    ctx.fillRect(
        0,
        3,
        20,
        12
    );

    if (
        player.weapon.visual ===
        "shotgun" ||
        player.weapon.visual ===
        "spas"
    ) {

        ctx.fillStyle =
            "#6b4427";

        ctx.fillRect(
            5,
            -7,
            38,
            14
        );
    }

    ctx.restore();
}


/* =====================================================
   DESENHAR ZUMBIS
===================================================== */

function drawZombie(z) {

    ctx.save();

    ctx.translate(
        z.x,
        z.y
    );

    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.35)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        z.size*.65,
        z.size*.8,
        z.size*.25,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* corpo */

    ctx.fillStyle =
        z.color;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        z.size*.55,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* cabeça */

    ctx.fillStyle =
        "#c39a7a";

    ctx.beginPath();

    ctx.arc(
        0,
        -z.size*.65,
        z.size*.38,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* olhos */

    ctx.fillStyle =
        z.boss
            ? "#ff0000"
            : "#e9e900";

    ctx.beginPath();

    ctx.arc(
        -z.size*.13,
        -z.size*.68,
        3,
        0,
        Math.PI*2
    );

    ctx.arc(
        z.size*.13,
        -z.size*.68,
        3,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* boss */

    if (z.boss) {

        ctx.strokeStyle =
            "#ff0000";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            0,
            -z.size*.25,
            z.size*.85,
            0,
            Math.PI*2
        );

        ctx.stroke();
    }


    ctx.restore();


    /* barra de vida */

    const width =
        z.size*2;

    ctx.fillStyle =
        "#330000";

    ctx.fillRect(
        z.x-width/2,
        z.y-z.size-20,
        width,
        6
    );

    ctx.fillStyle =
        z.boss
            ? "#ff1111"
            : "#35c84a";

    ctx.fillRect(
        z.x-width/2,
        z.y-z.size-20,
        width*
        Math.max(
            0,
            z.health/z.maxHealth
        ),
        6
    );
}


/* =====================================================
   DESENHAR BALAS
===================================================== */

function drawBullets() {

    ctx.fillStyle =
        "#ffd447";

    for (
        const b of bullets
    ) {

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            3,
            0,
            Math.PI*2
        );

        ctx.fill();
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
            "#654526";

        ctx.fillRect(
            b.x-b.width/2,
            b.y-b.height/2,
            b.width,
            b.height
        );

        ctx.fillStyle =
            "#d93434";

        ctx.fillRect(
            b.x-b.width/2,
            b.y-b.height/2-8,
            b.width*
            (b.health/b.maxHealth),
            5
        );
    }
}


/* =====================================================
   DESENHAR ARMADILHAS
===================================================== */

function drawTraps() {

    for (
        const t of placedTraps
    ) {

        ctx.fillStyle =
            "#c9c9c9";

        ctx.beginPath();

        ctx.arc(
            t.x,
            t.y,
            10,
            0,
            Math.PI*2
        );

        ctx.fill();
    }
}


/* =====================================================
   DESENHAR AMIGO
===================================================== */

function drawFriend() {

    if (!friend)
        return;

    ctx.font =
        "38px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        friend.icon,
        player.x-45,
        player.y+10
    );
}


/* =====================================================
   LOOP
===================================================== */

function gameLoop(now) {

    const dt =
        Math.min(
            (now-lastTime)/1000,
            .05
        );

    lastTime =
        now;

    if (
        gameRunning &&
        !gameEnded
    ) {

        updatePlayer(dt);

        if (preparation) {

            updatePreparation(dt);

        } else if (waveActive) {

            if (mouse.down)
                shoot();

            updateBullets(dt);

            updateZombies(dt);

            updateFriend();

            updateWorld(dt);

            checkWaveComplete();
        }

        draw();
    } else {

        draw();
    }

    requestAnimationFrame(
        gameLoop
    );
}


/* =====================================================
   DRAW
===================================================== */

function draw() {

    drawBackground();

    drawBarricades();

    drawTraps();

    for (
        const z of zombies
    ) {

        drawZombie(z);
    }

    drawBullets();

    drawFriend();

    if (gameRunning) {

        drawPlayer();

        drawWeapon();
    }
}


/* =====================================================
   GAME OVER
===================================================== */

async function endGame() {

    if (gameEnded)
        return;

    gameEnded = true;

    gameRunning = false;

    preparation = false;

    waveActive = false;

    hud.style.display =
        "none";

    gameInventory.style.display =
        "none";

    gameOver.style.display =
        "flex";

    finalScore.innerHTML = `

        ${getPlayerName() || "Jogador"}
        <br><br>

        🧟 Ondas alcançadas:
        <strong>${wave}</strong>

        <br>

        💵 Dinheiro:
        <strong>
            $${player.money.toLocaleString("pt-BR")}
        </strong>

    `;

    await saveRanking();
}


/* =====================================================
   RANKING
===================================================== */

async function saveRanking() {

    if (rankingSent)
        return;

    rankingSent = true;

    const name =
        getPlayerName();

    if (!name)
        return;

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
        }

    } catch (error) {

        console.error(
            "Erro no ranking:",
            error
        );
    }
}


function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


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

        if (error)
            throw error;

        if (
            !data ||
            data.length === 0
        ) {

            rankingContent.innerHTML = `

                <div class="ranking-empty">

                    🏆 Ainda não existem
                    jogadores no ranking.

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
            (p,index) => {

                let position =
                    `${index+1}º`;

                if (
                    index === 0
                )
                    position = "🥇";

                if (
                    index === 1
                )
                    position = "🥈";

                if (
                    index === 2
                )
                    position = "🥉";

                html += `

                    <tr>

                        <td>
                            ${position}
                        </td>

                        <td class="ranking-player">

                            ${escapeHTML(
                                p.player_name
                            )}

                        </td>

                        <td>
                            🧟 ${p.waves}
                        </td>

                        <td class="ranking-money">

                            💵 $${Number(
                                p.total_money
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

                ❌ Não foi possível
                carregar o ranking.

                <br><br>

                Verifique o Supabase.

            </div>

        `;
    }
}


/* =====================================================
   EVENTOS
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
                            b =>
                                b.classList.remove(
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


startWaveBtn.addEventListener(
    "click",
    startWave
);


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


restartBtn.addEventListener(
    "click",
    () => {

        location.reload();
    }
);


/* =====================================================
   BOTÃO PULAR PREPARAÇÃO
===================================================== */

const skipPreparationBtn =
    document.createElement(
        "button"
    );

skipPreparationBtn.id =
    "skipPreparationBtn";

skipPreparationBtn.textContent =
    "⏩ PULAR PREPARAÇÃO";

skipPreparationBtn.addEventListener(
    "click",
    skipPreparation
);

document.body.appendChild(
    skipPreparationBtn
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

function initializeAmmo() {

    weapons.forEach(
        weapon => {

            ammoInventory[
                weapon.name
            ] = 0;
        }
    );

    /*
       A pistola inicial recebe
       50 munições gratuitamente.
    */

    ammoInventory[
        weapons[0].name
    ] = 50;
}


function initializeGame() {

    player.y =
        canvas.height/2;

    initializeAmmo();

    /*
       A pistola já começa
       equipada.
    */

    inventory = [

        {
            type:"weapon",
            weapon:weapons[0]
        }

    ];

    selectedInventorySlot = 0;

    player.weapon =
        weapons[0];

    player.ammo =
        weapons[0].magazine;

    renderItems();

    renderInventory();

    updateHUD();
}


initializeGame();

requestAnimationFrame(
    gameLoop
);
