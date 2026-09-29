"use strict";

/* =========================================================
   THEY ARE COMING
   LUDIX / GAMEHUB
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
   CLASSES VISUAIS E TIPOS DE MUNIÇÃO
   ========================================================= */

function getWeaponClass(name){

    const n =
        String(name || "").toLowerCase();

    if(
        n.includes("rpg") ||
        n.includes("launcher") ||
        n.includes("cannon") ||
        n.includes("railgun") ||
        n.includes("ion") ||
        n.includes("apocalypse") ||
        n.includes("black hole") ||
        n.includes("omega") ||
        n.includes("titan") ||
        n.includes("galaxy") ||
        n.includes("ultimate") ||
        n.includes("doom")
    )
        return "heavy";

    if(
        n.includes("sniper") ||
        n.includes("awp") ||
        n.includes("barrett") ||
        n.includes("dragunov") ||
        n.includes("m24") ||
        n.includes("mosin") ||
        n.includes("kar98") ||
        n.includes("intervention") ||
        n.includes("svd") ||
        n.includes("vss")
    )
        return "sniper";

    if(
        n.includes("shotgun") ||
        n.includes("double barrel") ||
        n.includes("m870") ||
        n.includes("spas") ||
        n.includes("aa-12") ||
        n.includes("saiga") ||
        n.includes("ksg") ||
        n.includes("usas")
    )
        return "shotgun";

    if(
        n.includes("uzi") ||
        n.includes("mp5") ||
        n.includes("mp7") ||
        n.includes("p90") ||
        n.includes("vector") ||
        n.includes("mp40") ||
        n.includes("thompson") ||
        n.includes("mac-") ||
        n.includes("pp-") ||
        n.includes("ppsh") ||
        n.includes("pps-") ||
        n.includes("mpx") ||
        n.includes("ump")
    )
        return "smg";

    if(
        n.includes("m249") ||
        n.includes("pkm") ||
        n.includes("rpk") ||
        n.includes("minigun")
    )
        return "machinegun";

    if(
        n.includes("laser") ||
        n.includes("plasma") ||
        n.includes("tesla") ||
        n.includes("gauss") ||
        n.includes("energy") ||
        n.includes("death ray") ||
        n.includes("shock") ||
        n.includes("ion")
    )
        return "energy";

    if(
        n.includes("flamethrower")
    )
        return "flame";

    if(
        n.includes("deagle") ||
        n.includes("desert") ||
        n.includes("magnum") ||
        n.includes("raging") ||
        n.includes("revolver")
    )
        return "revolver";

    if(
        n.includes("ak") ||
        n.includes("m4") ||
        n.includes("m16") ||
        n.includes("scar") ||
        n.includes("famas") ||
        n.includes("g36") ||
        n.includes("aug") ||
        n.includes("galil") ||
        n.includes("fnc") ||
        n.includes("hk416") ||
        n === "g3" ||
        n === "fal" ||
        n.includes("m14") ||
        n.includes("groza") ||
        n.includes("an-94") ||
        n.includes("as val")
    )
        return "rifle";

    return "pistol";
}


function getAmmoType(name){

    const n =
        String(name || "").toLowerCase();

    if(
        n.includes("rpg") ||
        n.includes("launcher") ||
        n.includes("cannon") ||
        n.includes("doom") ||
        n.includes("apocalypse") ||
        n.includes("black hole") ||
        n.includes("titan") ||
        n.includes("galaxy") ||
        n.includes("ultimate")
    )
        return "Foguete / Granada";

    if(
        n.includes("laser") ||
        n.includes("death ray")
    )
        return "Energia Laser";

    if(
        n.includes("plasma")
    )
        return "Plasma";

    if(
        n.includes("tesla") ||
        n.includes("shock") ||
        n.includes("ion")
    )
        return "Energia Elétrica";

    if(
        n.includes("gauss") ||
        n.includes("railgun")
    )
        return "Projétil Magnético";

    if(
        n.includes("flamethrower")
    )
        return "Combustível";

    if(
        n.includes("sniper") ||
        n.includes("awp") ||
        n.includes("barrett") ||
        n.includes("dragunov") ||
        n.includes("m24") ||
        n.includes("mosin") ||
        n.includes("kar98") ||
        n.includes("intervention") ||
        n.includes("svd") ||
        n.includes("vss")
    )
        return "Munição de Precisão";

    if(
        n.includes("shotgun") ||
        n.includes("double barrel") ||
        n.includes("m870") ||
        n.includes("spas") ||
        n.includes("aa-12") ||
        n.includes("saiga") ||
        n.includes("ksg") ||
        n.includes("usas")
    )
        return "Cartucho";

    if(
        n.includes("ak") ||
        n.includes("m4") ||
        n.includes("m16") ||
        n.includes("scar") ||
        n.includes("famas") ||
        n.includes("g36") ||
        n.includes("aug") ||
        n.includes("galil") ||
        n.includes("fnc") ||
        n.includes("hk416") ||
        n === "g3" ||
        n === "fal" ||
        n.includes("m14") ||
        n.includes("groza") ||
        n.includes("an-94") ||
        n.includes("as val")
    )
        return "Munição de Fuzil";

    if(
        n.includes("uzi") ||
        n.includes("mp5") ||
        n.includes("mp7") ||
        n.includes("p90") ||
        n.includes("vector") ||
        n.includes("mp40") ||
        n.includes("thompson") ||
        n.includes("mac-") ||
        n.includes("pp-") ||
        n.includes("ppsh") ||
        n.includes("pps-") ||
        n.includes("mpx") ||
        n.includes("ump")
    )
        return "Munição de SMG";

    if(
        n.includes("deagle") ||
        n.includes("desert") ||
        n.includes("magnum") ||
        n.includes("raging")
    )
        return "Munição Pesada";

    return "Munição de Pistola";
}


weapons.forEach(
    w => {

        w.weaponClass =
            getWeaponClass(w.name);

        w.ammoType =
            getAmmoType(w.name);

    }
);


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

    weaponPurchased:false,

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

    if (e.key.toLowerCase() === "t") {

        const tag =
            e.target &&
            e.target.tagName
                ? e.target.tagName.toLowerCase()
                : "";

        if (
            tag !== "input" &&
            tag !== "textarea"
        ) {

            sellCurrentWeapon();

        }
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

    if(type === "armas") {

        return `
            Classe:
            ${(item.weaponClass ||
            getWeaponClass(item.name))
            .toUpperCase()}

            <br>
            Dano: ${item.damage}

            <br>
            Carregador: ${item.magazine}

            <br>
            Munição:
            ${item.ammoType ||
            getAmmoType(item.name)}
        `;
    }

    if(type === "armadura")
        return `Proteção: ${item.armor}`;

    if(type === "amigos")
        return `Dano: ${item.damage}`;

    if(type === "kits") {

        if(item.permanentHealth) {

            return `
                Vida máxima
                +${item.permanentHealth}
                permanentemente
            `;
        }

        return `
            Recupera
            ${item.heal}
            de vida
        `;
    }

    if(type === "bombas") {

        return `
            Dano: ${item.damage}
            |
            Área: ${item.radius}
        `;
    }

    if(type === "armadilhas")
        return `Dano: ${item.damage}`;

    if(type === "barricadas")
        return `Resistência: ${item.health}`;

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
                ${currentCategory === "armas"
                    ? "🔫"
                    : itemVisual(
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

            <button onclick="buyItem(${index})">
                COMPRAR
            </button>

            ${
                currentCategory === "armas"
                    ?
                    `<small style="
                        display:block;
                        margin-top:7px;
                        opacity:.75">
                        Depois de comprar:
                        T vende por 50%
                    </small>`
                    :
                    ""
            }

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

    if (!item)
        return;


    if (player.money < item.price) {

        alert(
            "Dinheiro insuficiente!"
        );

        return;
    }


    /* ARMAS */

    if (currentCategory === "armas") {

        player.money -= item.price;

        player.weapon = item;

        player.weaponPurchased = true;

        player.ammo =
            item.magazine;

        player.reserveAmmo =
            item.ammo;

        player.reloadTime = 0;

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

    if (currentCategory === "armadilhas") {

        if (!addInventory({

            type:"trap",

            item:item

        })) {

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

    if (currentCategory === "barricadas") {

        if (!addInventory({

            type:"barricade",

            item:item

        })) {

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


/* =========================================================
   VENDER ARMA — TECLA T
   ========================================================= */

function sellCurrentWeapon() {

    if (
        !shopScreen ||
        shopScreen.style.display === "none"
    ) {
        return;
    }


    if (
        !player.weaponPurchased ||
        player.weapon === weapons[0]
    ) {
        return;
    }


    const weapon =
        player.weapon;

    const sellPrice =
        Math.floor(
            weapon.price / 2
        );


    const confirmSale =
        confirm(
            `Vender ${weapon.name} por $${sellPrice.toLocaleString("pt-BR")}?`
        );


    if (!confirmSale)
        return;


    player.money +=
        sellPrice;


    player.weapon =
        weapons[0];

    player.weaponPurchased =
        false;


    player.ammo =
        player.weapon.magazine;

    player.reserveAmmo =
        player.weapon.ammo;

    player.reloadTime = 0;


    updateHUD();

    renderItems();
}


/* =========================================================
   MUNIÇÃO
   ========================================================= */

window.buyAmmo = function() {

    const price = 150;


    if (player.money < price) {

        alert(
            "Dinheiro insuficiente!"
        );

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

        inventory.splice(
            index,
            1
        );
    }


    if (item.type === "trap") {

        placeTrap(item.item);

        if (preparation) {

            inventory.splice(
                index,
                1
            );
        }
    }


    if (item.type === "barricade") {

        placeBarricade(item.item);

        if (preparation) {

            inventory.splice(
                index,
                1
            );
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
            Math.hypot(
                dx,
                dy
            );

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
            1000,

        ammoType:
            player.weapon.ammoType ||
            getAmmoType(
                player.weapon.name
            ),

        weaponClass:
            player.weapon.weaponClass ||
            getWeaponClass(
                player.weapon.name
            ),

        weaponName:
            player.weapon.name

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


    if (
        player.reserveAmmo <= 0
    )
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


function updateBarricades() {

    for (
        const b of placedBarricades
    ) {

        for (
            const z of zombies
        ) {

            if (
                z.x >
                    b.x - b.width / 2 &&
                z.x <
                    b.x + b.width / 2 &&
                z.y >
                    b.y - b.height / 2 &&
                z.y <
                    b.y + b.height / 2
            ) {

                z.x -=
                    Math.sign(
                        z.x - b.x
                    ) *
                    z.speed *
                    0.02;

                b.health -=
                    z.damage * 0.01;
            }
        }
    }


    placedBarricades =
        placedBarricades.filter(
            b =>
                b.health > 0
        );
}


/* =========================================================
   POSICIONAMENTO
   ========================================================= */

function usePlacementItem() {

    if (
        !preparation ||
        inventory.length === 0
    ) {
        return;
    }

    useInventory(0);
}


/* =========================================================
   HUD
   ========================================================= */

function updateHUD() {

    if (!player)
        return;


    if (nameHud) {

        nameHud.textContent =
            getPlayerName() ||
            "Jogador";
    }


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
        `${player.weapon.name.toUpperCase()} • ${
            player.weapon.ammoType ||
            getAmmoType(player.weapon.name)
        }`;


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
   DESENHO DO MAPA
   ========================================================= */

function drawBackground() {

    ctx.fillStyle =
        "#171a18";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const roadY =
        canvas.height * 0.5;

    const roadH =
        Math.max(
            150,
            canvas.height * 0.24
        );


    /* ASPECTO DO ASFALTO */

    ctx.fillStyle =
        "#202321";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* ESTRADA */

    ctx.fillStyle =
        "#121513";

    ctx.fillRect(
        0,
        roadY - roadH / 2,
        canvas.width,
        roadH
    );


    /* CALÇADAS */

    ctx.fillStyle =
        "#3b413e";

    ctx.fillRect(
        0,
        roadY - roadH / 2 - 12,
        canvas.width,
        12
    );

    ctx.fillRect(
        0,
        roadY + roadH / 2,
        canvas.width,
        12
    );


    /* FAIXA CENTRAL */

    ctx.strokeStyle =
        "rgba(231,206,90,.65)";

    ctx.lineWidth = 4;

    ctx.setLineDash([
        35,
        28
    ]);

    ctx.beginPath();

    ctx.moveTo(
        0,
        roadY
    );

    ctx.lineTo(
        canvas.width,
        roadY
    );

    ctx.stroke();

    ctx.setLineDash([]);


    /* GRADE */

    ctx.strokeStyle =
        "rgba(255,255,255,.025)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < canvas.width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y < canvas.height;
        y += 50
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


    /* PRÉDIOS */

    const buildingW = 125;

    const topH =
        Math.max(
            130,
            roadY -
            roadH / 2 -
            25
        );

    const bottomY =
        roadY +
        roadH / 2 +
        25;

    const bottomH =
        Math.max(
            100,
            canvas.height -
            bottomY
        );


    for (
        let x = 20,
        i = 0;
        x < canvas.width;
        x += 147,
        i++
    ) {

        const h =
            Math.min(
                topH,
                105 +
                (i * 47) % 90
            );


        ctx.fillStyle =
            i % 2
                ? "#292e2b"
                : "#252a28";

        ctx.fillRect(
            x,
            12,
            buildingW,
            h
        );


        ctx.fillStyle =
            "#111513";

        ctx.fillRect(
            x + 8,
            22,
            buildingW - 16,
            8
        );


        for (
            let wx = x + 18;
            wx < x + buildingW - 12;
            wx += 25
        ) {

            for (
                let wy = 45;
                wy < h - 12;
                wy += 28
            ) {

                ctx.fillStyle =
                    (
                        (wx + wy + i) % 3 === 0
                    )
                    ? "#b9a35a"
                    : "#3f4843";

                ctx.fillRect(
                    wx,
                    wy,
                    10,
                    13
                );
            }
        }
    }


    for (
        let x = 20,
        i = 0;
        x < canvas.width;
        x += 147,
        i++
    ) {

        const h =
            Math.min(
                bottomH,
                90 +
                (i * 61) % 100
            );


        ctx.fillStyle =
            i % 2
                ? "#272c29"
                : "#303531";

        ctx.fillRect(
            x,
            bottomY,
            buildingW,
            h
        );


        for (
            let wx = x + 18;
            wx < x + buildingW - 12;
            wx += 25
        ) {

            for (
                let wy = bottomY + 18;
                wy < bottomY + h - 10;
                wy += 28
            ) {

                ctx.fillStyle =
                    (
                        (wx + wy + i) % 4 === 0
                    )
                    ? "#b9a35a"
                    : "#424b46";

                ctx.fillRect(
                    wx,
                    wy,
                    10,
                    13
                );
            }
        }
    }


    /* POSTES */

    for (
        let x = 70;
        x < canvas.width;
        x += 210
    ) {

        ctx.fillStyle =
            "#3e4541";

        ctx.fillRect(
            x,
            roadY -
                roadH / 2 -
                9,
            5,
            38
        );

        ctx.fillStyle =
            "#d9d39c";

        ctx.beginPath();

        ctx.arc(
            x + 3,
            roadY -
                roadH / 2 -
                11,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#3e4541";

        ctx.fillRect(
            x,
            roadY +
                roadH / 2 +
                4,
            5,
            38
        );


        ctx.fillStyle =
            "#d9d39c";

        ctx.beginPath();

        ctx.arc(
            x + 3,
            roadY +
                roadH / 2 +
                42,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* ÁRVORES */

    for (
        let x = 45,
        i = 0;
        x < canvas.width;
        x += 180,
        i++
    ) {

        const y =
            i % 2 === 0
                ?
                Math.max(
                    65,
                    roadY -
                    roadH / 2 -
                    55
                )
                :
                Math.min(
                    canvas.height - 55,
                    roadY +
                    roadH / 2 +
                    55
                );


        ctx.fillStyle =
            "#3b2920";

        ctx.fillRect(
            x,
            y,
            7,
            28
        );


        ctx.fillStyle =
            "#25452e";

        ctx.beginPath();

        ctx.arc(
            x + 3,
            y - 5,
            23,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#31613a";

        ctx.beginPath();

        ctx.arc(
            x - 10,
            y + 3,
            15,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            x + 15,
            y + 3,
            15,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* ENTRADA DOS ZUMBIS */

    if (preparation) {

        const zoneX =
            canvas.width - 120;


        ctx.fillStyle =
            "rgba(160,0,0,.18)";

        ctx.fillRect(
            zoneX,
            0,
            120,
            canvas.height
        );


        ctx.strokeStyle =
            "rgba(255,50,50,.65)";

        ctx.lineWidth = 2;

        ctx.setLineDash([
            10,
            10
        ]);

        ctx.beginPath();

        ctx.moveTo(
            zoneX,
            0
        );

        ctx.lineTo(
            zoneX,
            canvas.height
        );

        ctx.stroke();

        ctx.setLineDash([]);


        ctx.fillStyle =
            "#ff5757";

        ctx.font =
            "bold 18px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "ZUMBIS",
            canvas.width - 60,
            35
        );

        ctx.fillText(
            "→",
            canvas.width - 60,
            62
        );
    }
}


/* =========================================================
   JOGADOR
   ========================================================= */

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


    /* SOMBRA */

    ctx.save();

    ctx.rotate(-angle);

    ctx.fillStyle =
        "rgba(0,0,0,.38)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        39,
        27,
        9,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();


    /* PERNAS */

    ctx.fillStyle =
        "#151918";

    ctx.fillRect(
        -13,
        10,
        10,
        29
    );

    ctx.fillRect(
        3,
        10,
        10,
        29
    );


    /* BOTAS */

    ctx.fillStyle =
        "#050606";

    ctx.fillRect(
        -16,
        34,
        14,
        8
    );

    ctx.fillRect(
        3,
        34,
        14,
        8
    );


    /* CORPO */

    const body =
        ctx.createLinearGradient(
            -18,
            -12,
            18,
            24
        );

    body.addColorStop(
        0,
        "#526258"
    );

    body.addColorStop(
        1,
        "#18211c"
    );


    ctx.fillStyle =
        body;

    ctx.beginPath();

    ctx.roundRect(
        -18,
        -12,
        36,
        36,
        6
    );

    ctx.fill();


    /* COLETE */

    ctx.fillStyle =
        "#151a18";

    ctx.fillRect(
        -15,
        -8,
        30,
        28
    );


    ctx.strokeStyle =
        "#69766e";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        -15,
        -8,
        30,
        28
    );


    ctx.fillStyle =
        "#303a35";

    ctx.fillRect(
        -12,
        3,
        8,
        9
    );

    ctx.fillRect(
        4,
        3,
        8,
        9
    );


    /* PESCOÇO */

    ctx.fillStyle =
        "#ad7455";

    ctx.fillRect(
        -6,
        -19,
        12,
        9
    );


    /* CABEÇA */

    ctx.fillStyle =
        "#c98b69";

    ctx.beginPath();

    ctx.arc(
        0,
        -27,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* ROSTO */

    ctx.fillStyle =
        "#30251f";

    ctx.fillRect(
        5,
        -29,
        3,
        3
    );

    ctx.fillRect(
        9,
        -22,
        4,
        2
    );


    /* CAPACETE */

    ctx.fillStyle =
        "#202a24";

    ctx.beginPath();

    ctx.arc(
        0,
        -30,
        15,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        -16,
        -30,
        32,
        5
    );


    ctx.fillStyle =
        "#38473e";

    ctx.fillRect(
        -9,
        -40,
        18,
        5
    );


    /* BRAÇO DE APOIO */

    ctx.fillStyle =
        "#34433a";

    ctx.fillRect(
        -27,
        -3,
        19,
        8
    );


    ctx.fillStyle =
        "#b87b5b";

    ctx.beginPath();

    ctx.arc(
        -27,
        1,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* ARMA */

    drawWeaponSkin(
        player.weapon
    );


    /* BRAÇO PRINCIPAL */

    ctx.fillStyle =
        "#3d4c42";

    ctx.fillRect(
        8,
        -5,
        29,
        9
    );


    ctx.fillStyle =
        "#b87b5b";

    ctx.beginPath();

    ctx.arc(
        36,
        0,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* ARMADURA */

    if (player.armor > 0) {

        ctx.strokeStyle =
            "#bdc8bf";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            -19,
            -14,
            38,
            40
        );
    }


    ctx.restore();
}


/* =========================================================
   SKINS DAS ARMAS
   ========================================================= */

function drawWeaponSkin(w) {

    if (!w)
        return;


    const type =
        w.weaponClass ||
        getWeaponClass(w.name);

    const n =
        String(
            w.name
        ).toLowerCase();


    /* PISTOLA */

    if (type === "pistol") {

        ctx.fillStyle =
            "#171a1b";

        ctx.fillRect(
            17,
            -9,
            32,
            7
        );


        ctx.fillStyle =
            "#35393b";

        ctx.fillRect(
            25,
            -7,
            10,
            4
        );


        ctx.fillStyle =
            "#111213";

        ctx.fillRect(
            39,
            -7,
            15,
            4
        );


        ctx.fillStyle =
            "#161819";

        ctx.beginPath();

        ctx.moveTo(
            24,
            -2
        );

        ctx.lineTo(
            34,
            -2
        );

        ctx.lineTo(
            31,
            13
        );

        ctx.lineTo(
            22,
            9
        );

        ctx.closePath();

        ctx.fill();


        ctx.fillStyle =
            "#929b96";

        ctx.fillRect(
            42,
            -12,
            5,
            3
        );

        return;
    }


    /* REVÓLVER */

    if (type === "revolver") {

        ctx.fillStyle =
            "#292c2d";

        ctx.fillRect(
            18,
            -9,
            34,
            7
        );


        ctx.fillStyle =
            "#55595a";

        ctx.beginPath();

        ctx.arc(
            31,
            -3,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#111";

        ctx.fillRect(
            37,
            -10,
            25,
            5
        );


        ctx.fillStyle =
            "#3b2419";

        ctx.fillRect(
            22,
            3,
            9,
            14
        );

        return;
    }


    /* SMG */

    if (type === "smg") {

        ctx.fillStyle =
            "#171a1b";

        ctx.fillRect(
            15,
            -10,
            48,
            8
        );


        ctx.fillStyle =
            "#2c3233";

        ctx.fillRect(
            20,
            -13,
            22,
            10
        );


        ctx.fillStyle =
            "#0d0e0f";

        ctx.fillRect(
            28,
            0,
            8,
            17
        );


        ctx.fillStyle =
            "#161819";

        ctx.fillRect(
            19,
            -1,
            9,
            13
        );


        ctx.fillStyle =
            "#070808";

        ctx.fillRect(
            56,
            -8,
            15,
            4
        );

        return;
    }


    /* RIFLE */

    if (type === "rifle") {

        ctx.fillStyle =
            "#222824";

        ctx.fillRect(
            13,
            -10,
            53,
            9
        );


        ctx.fillStyle =
            "#151916";

        ctx.fillRect(
            4,
            -7,
            19,
            8
        );


        ctx.fillStyle =
            "#0e1010";

        ctx.beginPath();

        ctx.moveTo(
            31,
            -1
        );

        ctx.lineTo(
            41,
            -1
        );

        ctx.lineTo(
            37,
            15
        );

        ctx.lineTo(
            29,
            12
        );

        ctx.closePath();

        ctx.fill();


        ctx.fillStyle =
            "#070808";

        ctx.fillRect(
            61,
            -7,
            20,
            4
        );


        ctx.fillStyle =
            "#6b746e";

        ctx.fillRect(
            39,
            -14,
            11,
            3
        );

        return;
    }


    /* SHOTGUN */

    if (type === "shotgun") {

        ctx.fillStyle =
            "#633e28";

        ctx.fillRect(
            4,
            -4,
            23,
            9
        );


        ctx.fillStyle =
            "#242728";

        ctx.fillRect(
            23,
            -11,
            31,
            9
        );


        ctx.fillStyle =
            "#080909";

        ctx.fillRect(
            50,
            -12,
            32,
            5
        );

        ctx.fillRect(
            50,
            -5,
            32,
            5
        );


        ctx.fillStyle =
            "#121313";

        ctx.fillRect(
            29,
            0,
            8,
            15
        );

        return;
    }


    /* METRALHADORA */

    if (type === "machinegun") {

        ctx.fillStyle =
            "#1b1e1f";

        ctx.fillRect(
            11,
            -12,
            67,
            12
        );


        ctx.fillStyle =
            "#070808";

        ctx.fillRect(
            67,
            -9,
            28,
            6
        );


        ctx.fillStyle =
            "#101112";

        ctx.beginPath();

        ctx.arc(
            37,
            5,
            13,
            0,
            Math.PI
        );

        ctx.fill();


        ctx.fillStyle =
            "#555b59";

        ctx.fillRect(
            19,
            0,
            4,
            18
        );

        ctx.fillRect(
            60,
            0,
            4,
            18
        );

        return;
    }


    /* SNIPER */

    if (type === "sniper") {

        ctx.fillStyle =
            "#463528";

        ctx.fillRect(
            4,
            -5,
            28,
            9
        );


        ctx.fillStyle =
            "#202425";

        ctx.fillRect(
            21,
            -11,
            58,
            8
        );


        ctx.fillStyle =
            "#080909";

        ctx.fillRect(
            71,
            -8,
            40,
            5
        );


        ctx.fillStyle =
            "#111";

        ctx.fillRect(
            41,
            -18,
            20,
            7
        );


        ctx.fillStyle =
            "#5b6260";

        ctx.beginPath();

        ctx.arc(
            51,
            -14,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#111";

        ctx.fillRect(
            31,
            -3,
            7,
            14
        );

        return;
    }


    /* RPG */

    if (
        type === "heavy" &&
        n.includes("rpg")
    ) {

        ctx.fillStyle =
            "#354037";

        ctx.fillRect(
            8,
            -14,
            70,
            16
        );


        ctx.fillStyle =
            "#090a0a";

        ctx.beginPath();

        ctx.arc(
            80,
            -6,
            11,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#7b847b";

        ctx.lineWidth = 2;

        ctx.stroke();


        ctx.fillStyle =
            "#171b18";

        ctx.fillRect(
            30,
            1,
            9,
            18
        );

        ctx.fillRect(
            54,
            1,
            7,
            17
        );

        return;
    }


    /* CANHÕES PESADOS */

    if (type === "heavy") {

        ctx.fillStyle =
            "#272c2d";

        ctx.fillRect(
            8,
            -15,
            72,
            18
        );


        ctx.fillStyle =
            "#080909";

        ctx.fillRect(
            70,
            -11,
            38,
            10
        );


        ctx.fillStyle =
            "#4a514e";

        ctx.fillRect(
            20,
            3,
            8,
            18
        );

        return;
    }


    /* ENERGIA */

    if (type === "energy") {

        ctx.fillStyle =
            "#242a2c";

        ctx.fillRect(
            11,
            -11,
            61,
            11
        );


        ctx.shadowBlur = 14;

        ctx.shadowColor =
            "#74faff";


        ctx.fillStyle =
            "#c8ffff";

        ctx.beginPath();

        ctx.arc(
            39,
            -6,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.shadowBlur = 0;


        ctx.fillStyle =
            "#ecffff";

        ctx.fillRect(
            68,
            -9,
            20,
            6
        );

        return;
    }


    /* LANÇA-CHAMAS */

    if (type === "flame") {

        ctx.fillStyle =
            "#2a2d2d";

        ctx.fillRect(
            8,
            -13,
            50,
            14
        );


        ctx.fillStyle =
            "#5a2921";

        ctx.beginPath();

        ctx.arc(
            18,
            7,
            12,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#111";

        ctx.fillRect(
            52,
            -9,
            25,
            6
        );


        ctx.fillStyle =
            "#ff7800";

        ctx.beginPath();

        ctx.moveTo(
            77,
            -6
        );

        ctx.lineTo(
            92,
            -14
        );

        ctx.lineTo(
            87,
            -4
        );

        ctx.lineTo(
            95,
            0
        );

        ctx.lineTo(
            77,
            0
        );

        ctx.closePath();

        ctx.fill();
    }
}


/* =========================================================
   ZUMBI
   ========================================================= */

function drawZombie(z) {

    ctx.save();

    ctx.translate(
        z.x,
        z.y
    );


    const t =
        String(
            z.type ||
            "Walker"
        ).toLowerCase();


    const boss =
        t === "boss";

    const mutant =
        t === "mutant" ||
        t === "tank";

    const burning =
        t === "burning";

    const toxic =
        t === "toxic";

    const runner =
        t === "runner";


    /* SOMBRA */

    ctx.fillStyle =
        "rgba(0,0,0,.32)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        43,
        boss ? 29 : 21,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    const scale =
        boss
            ? 1.28
            : mutant
            ? 1.12
            : runner
            ? .92
            : 1;


    ctx.scale(
        scale,
        scale
    );


    /* PERNAS */

    ctx.fillStyle =
        boss
            ? "#1d1b1b"
            : "#292c2b";

    ctx.fillRect(
        -13,
        17,
        10,
        29
    );

    ctx.fillRect(
        3,
        17,
        10,
        29
    );


    /* CORPO */

    let body =
        "#3f4742";


    if (burning)
        body = "#713225";

    if (toxic)
        body = "#345d39";

    if (mutant)
        body = "#4f604b";

    if (boss)
        body = "#33252a";

    if (t === "soldier")
        body = "#303b34";


    ctx.fillStyle =
        body;


    ctx.beginPath();

    ctx.roundRect(
        -18,
        -11,
        36,
        35,
        6
    );

    ctx.fill();


    /* ROUPA */

    ctx.fillStyle =
        boss
            ? "#5b303b"
            : "#59645d";

    ctx.fillRect(
        -15,
        -5,
        30,
        4
    );


    ctx.fillStyle =
        "#252a27";

    ctx.fillRect(
        -11,
        7,
        8,
        9
    );

    ctx.fillRect(
        3,
        7,
        8,
        9
    );


    /* BRAÇOS */

    ctx.fillStyle =
        mutant
            ? "#60715a"
            : "#59635b";

    ctx.fillRect(
        -35,
        -4,
        19,
        9
    );

    ctx.fillRect(
        16,
        -4,
        19,
        9
    );


    if (mutant) {

        ctx.fillRect(
            -38,
            4,
            9,
            15
        );

        ctx.fillRect(
            29,
            4,
            9,
            15
        );
    }


    /* CABEÇA */

    let skin =
        "#77806e";

    if (mutant)
        skin = "#657a5b";

    if (toxic)
        skin = "#638a59";

    if (burning)
        skin = "#87513b";

    if (boss)
        skin = "#6e4d54";


    ctx.fillStyle =
        skin;

    ctx.beginPath();

    ctx.arc(
        0,
        -25,
        boss ? 17 : 15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* CABELO */

    ctx.fillStyle =
        t === "soldier"
            ? "#29322e"
            : "#303632";


    ctx.beginPath();

    ctx.arc(
        0,
        -29,
        boss ? 18 : 15,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* OLHOS */

    ctx.fillStyle =
        toxic
            ? "#c5ff62"
            : burning
            ? "#ffb13b"
            : boss
            ? "#ff194d"
            : "#ff3030";


    ctx.shadowBlur = 8;

    ctx.shadowColor =
        ctx.fillStyle;


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


    ctx.shadowBlur = 0;


    /* BOCA */

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        -8,
        -18,
        16,
        5
    );


    ctx.fillStyle =
        "#d9d2bc";


    for (
        let i = -5;
        i <= 5;
        i += 5
    ) {

        ctx.fillRect(
            i,
            -18,
            3,
            3
        );
    }


    /* ZUMBI EM CHAMAS */

    if (burning) {

        ctx.fillStyle =
            "#ff6b00";

        ctx.beginPath();

        ctx.arc(
            -12,
            -4,
            7,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#ffbd38";

        ctx.beginPath();

        ctx.arc(
            10,
            7,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* ZUMBI TÓXICO */

    if (toxic) {

        ctx.strokeStyle =
            "rgba(125,255,110,.7)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            12,
            6,
            8,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        ctx.fillStyle =
            "#aaff5c";

        ctx.beginPath();

        ctx.arc(
            14,
            7,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    /* BOSS */

    if (boss) {

        ctx.strokeStyle =
            "rgba(255,0,65,.85)";

        ctx.lineWidth = 3;

        ctx.shadowBlur = 12;

        ctx.shadowColor =
            "#ff003c";


        ctx.strokeRect(
            -24,
            -45,
            48,
            78
        );


        ctx.shadowBlur = 0;


        ctx.fillStyle =
            "#a41d39";

        ctx.fillRect(
            -7,
            -45,
            14,
            4
        );
    }


    /* VIDA */

    const barWidth =
        boss
            ? 72
            : 55;


    ctx.fillStyle =
        "#171817";

    ctx.fillRect(
        -barWidth / 2,
        -52,
        barWidth,
        6
    );


    ctx.fillStyle =
        boss
            ? "#ff174f"
            : "#e33";


    ctx.fillRect(
        -barWidth / 2,
        -52,
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


/* =========================================================
   BALAS / MUNIÇÕES
   ========================================================= */

function drawBullets() {

    for (
        const b of bullets
    ) {

        ctx.save();


        ctx.translate(
            b.x,
            b.y
        );


        ctx.rotate(
            Math.atan2(
                b.vy,
                b.vx
            )
        );


        const type =
            b.ammoType ||
            "Munição de Pistola";


        /* FOGUETE */

        if (
            type ===
            "Foguete / Granada"
        ) {

            ctx.fillStyle =
                "#5b6158";

            ctx.fillRect(
                -14,
                -4,
                24,
                8
            );


            ctx.fillStyle =
                "#222";

            ctx.beginPath();

            ctx.moveTo(
                10,
                -4
            );

            ctx.lineTo(
                17,
                0
            );

            ctx.lineTo(
                10,
                4
            );

            ctx.closePath();

            ctx.fill();


            ctx.fillStyle =
                "#ff7b00";

            ctx.beginPath();

            ctx.moveTo(
                -14,
                -3
            );

            ctx.lineTo(
                -24,
                0
            );

            ctx.lineTo(
                -14,
                3
            );

            ctx.closePath();

            ctx.fill();
        }


        /* PLASMA */

        else if (
            type === "Plasma" ||
            type === "Energia Laser"
        ) {

            ctx.shadowBlur = 12;

            ctx.shadowColor =
                "#72faff";

            ctx.fillStyle =
                "#d5ffff";


            ctx.beginPath();

            ctx.ellipse(
                0,
                0,
                10,
                3,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }


        /* ELÉTRICA */

        else if (
            type ===
            "Energia Elétrica"
        ) {

            ctx.strokeStyle =
                "#75faff";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                -9,
                0
            );

            ctx.lineTo(
                -3,
                -4
            );

            ctx.lineTo(
                2,
                4
            );

            ctx.lineTo(
                9,
                0
            );

            ctx.stroke();
        }


        /* MAGNÉTICA */

        else if (
            type ===
            "Projétil Magnético"
        ) {

            ctx.fillStyle =
                "#d7dce0";

            ctx.fillRect(
                -9,
                -2,
                18,
                4
            );

            ctx.fillStyle =
                "#667078";

            ctx.fillRect(
                4,
                -2,
                5,
                4
            );
        }


        /* CARTUCHO */

        else if (
            type === "Cartucho"
        ) {

            ctx.fillStyle =
                "#d3a03b";

            ctx.fillRect(
                -8,
                -3,
                15,
                6
            );

            ctx.fillStyle =
                "#7b7d7a";

            ctx.fillRect(
                5,
                -3,
                4,
                6
            );
        }


        /* MUNIÇÃO PESADA */

        else if (
            type ===
            "Munição Pesada"
        ) {

            ctx.fillStyle =
                "#d5a83d";

            ctx.fillRect(
                -8,
                -3,
                14,
                6
            );

            ctx.fillStyle =
                "#b85d2e";

            ctx.fillRect(
                4,
                -3,
                5,
                6
            );
        }


        /* MUNIÇÃO NORMAL */

        else {

            ctx.fillStyle =
                "#ffd45c";

            ctx.fillRect(
                -7,
                -2,
                14,
                4
            );


            ctx.fillStyle =
                "#fff2a5";

            ctx.fillRect(
                3,
                -1,
                5,
                2
            );
        }


        ctx.restore();
    }
}


/* =========================================================
   ARMADILHAS VISUAIS
   ========================================================= */

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
            "#4e5651";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#9ca59e";

        ctx.lineWidth = 2;

        ctx.stroke();


        ctx.fillStyle =
            "#d43b3b";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    }
}


/* =========================================================
   BARRICADAS VISUAIS
   ========================================================= */

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
            "#573a24";

        ctx.fillRect(
            -b.width / 2,
            -b.height / 2,
            b.width,
            b.height
        );


        ctx.strokeStyle =
            "#a87845";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            -b.width / 2,
            -b.height / 2,
            b.width,
            b.height
        );


        ctx.fillStyle =
            "#171817";

        ctx.fillRect(
            -b.width / 2,
            -3,
            b.width,
            6
        );


        const hp =
            Math.max(
                0,
                b.health /
                b.maxHealth
            );


        ctx.fillStyle =
            "#111";

        ctx.fillRect(
            -40,
            -25,
            80,
            5
        );


        ctx.fillStyle =
            "#45d66b";

        ctx.fillRect(
            -40,
            -25,
            80 * hp,
            5
        );


        ctx.restore();
    }
}


/* =========================================================
   AMIGO
   ========================================================= */

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
   FIM DA ONDA
   ========================================================= */

function checkWaveComplete() {

    if (
        !waveActive ||
        zombies.length > 0
    ) {
        return;
    }


    waveActive = false;

    wave++;


    setTimeout(
        () => {

            if (gameEnded)
                return;


            shopScreen.style.display =
                "block";

            hud.style.display =
                "none";

            gameInventory.style.display =
                "none";


            preparation = false;

            updateHUD();

            renderItems();

        },
        1200
    );
}


/* =========================================================
   RANKING SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://vkswxahmirkhcynwlzys.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_pGNNupmDtxbXRgs01aZdeg_6dJqw4Kc";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


async function saveScoreToRanking() {

    if (rankingSent)
        return;


    rankingSent = true;


    const name =
        getPlayerName();


    if (!name)
        return;


    try {

        await supabaseClient
            .from(
                "they_are_coming_scores"
            )
            .insert({

                player_name:name,

                waves:Math.max(
                    0,
                    wave - 1
                ),

                total_money:
                    player.money,

                created_at:
                    new Date().toISOString()

            });

    } catch(error) {

        console.error(
            "Erro ao salvar ranking:",
            error
        );
    }
}


async function loadRanking() {

    rankingContent.innerHTML =
        "<p>Carregando ranking...</p>";


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

            rankingContent.innerHTML =
                "<p>O ranking ainda está vazio.</p>";

            return;
        }


        rankingContent.innerHTML = "";


        data.forEach(
            (row,index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "ranking-item";


                item.innerHTML = `

                    <span>
                        #${index + 1}
                    </span>

                    <strong>
                        ${escapeHtml(
                            row.player_name
                        )}
                    </strong>

                    <span>
                        🧟 ${row.waves}
                    </span>

                    <span>
                        💵 $${Number(
                            row.total_money || 0
                        ).toLocaleString("pt-BR")}
                    </span>

                `;


                rankingContent.appendChild(
                    item
                );
            }
        );

    } catch(error) {

        console.error(
            "Erro no ranking:",
            error
        );


        rankingContent.innerHTML =
            "<p>Não foi possível carregar o ranking.</p>";
    }
}


function escapeHtml(text) {

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


/* =========================================================
   RANKING — BOTÕES
   ========================================================= */

if (rankingBtn) {

    rankingBtn.addEventListener(
        "click",
        () => {

            rankingScreen.style.display =
                "block";

            loadRanking();

        }
    );
}


if (closeRankingBtn) {

    closeRankingBtn.addEventListener(
        "click",
        () => {

            rankingScreen.style.display =
                "none";

        }
    );
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


    mouse.down = false;


    finalScore.textContent =
        `Você chegou à onda ${
            Math.max(
                0,
                wave - 1
            )
        } e terminou com $${player.money.toLocaleString("pt-BR")}.`;


    gameOver.style.display =
        "flex";


    saveScoreToRanking();
}


/* =========================================================
   REINICIAR
   ========================================================= */

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        () => {

            location.reload();

        }
    );
}


/* =========================================================
   CATEGORIAS DA LOJA
   ========================================================= */

document
    .querySelectorAll(
        "[data-category]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    currentCategory =
                        button.dataset.category;

                    renderItems();

                }
            );
        }
    );


/* =========================================================
   LOOP PRINCIPAL
   ========================================================= */

let lastTime =
    performance.now();


function gameLoop(now) {

    const dt =
        Math.min(
            0.05,
            (now - lastTime) /
            1000
        );


    lastTime = now;


    drawBackground();


    if (
        gameRunning &&
        !gameEnded
    ) {

        if (preparation) {

            updatePreparation(
                dt
            );

        } else if (waveActive) {

            updatePlayer(
                dt
            );

            updateZombies(
                dt
            );

            updateBullets(
                dt
            );

            updateTraps();

            updateBarricades();


            if (mouse.down) {

                shoot();
            }


            checkWaveComplete();
        }


        updateReload(
            dt
        );


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
