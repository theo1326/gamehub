"use strict";

/* ============================================================
   LUDIX — THEY ARE COMING
   GAME.JS — MOTOR CORRIGIDO
============================================================ */

/* ============================================================
   ELEMENTOS DO HTML
============================================================ */

const canvas = document.getElementById("game");
const ctx = canvas ? canvas.getContext("2d") : null;

const shopScreen = document.getElementById("shopScreen");
const shopContent = document.getElementById("shopContent");
const moneyEl = document.getElementById("money");

const playerNameInput = document.getElementById("playerName");
const nameWarning = document.getElementById("nameWarning");
const startWaveBtn = document.getElementById("startWaveBtn");

const rankingBtn = document.getElementById("rankingBtn");
const rankingScreen = document.getElementById("rankingScreen");
const rankingContent = document.getElementById("rankingContent");
const closeRankingBtn = document.getElementById("closeRankingBtn");

const hud = document.getElementById("hud");
const nameHud = document.getElementById("nameHud");
const healthBar = document.getElementById("healthBar");
const armorBar = document.getElementById("armorBar");
const waveEl = document.getElementById("wave");
const enemiesEl = document.getElementById("enemies");
const weaponEl = document.getElementById("weapon");
const ammoEl = document.getElementById("ammo");
const moneyHud = document.getElementById("moneyHud");

const gameInventory = document.getElementById("gameInventory");
const gameInventorySlots = document.getElementById("gameInventorySlots");
const menuInventory = document.getElementById("menuInventory");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

/* ============================================================
   CONFIGURAÇÕES
============================================================ */

const MAX_HEALTH_START = 100;
const INVENTORY_SIZE = 5;
const PREPARATION_TIME = 30;

/* ============================================================
   TAMANHO DO CANVAS
============================================================ */

function resizeCanvas() {
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (player && !player.y) {
        player.y = canvas.height / 2;
    }
}

window.addEventListener("resize", resizeCanvas);

/* ============================================================
   ARMAS
============================================================ */

const weapons = [

    {name:"Pistola",damage:18,fireRate:350,magazine:12,ammo:60,price:300,range:700},
    {name:"Glock 17",damage:20,fireRate:300,magazine:17,ammo:85,price:450,range:700},
    {name:"Desert Eagle",damage:45,fireRate:650,magazine:7,ammo:35,price:900,range:750},
    {name:"Uzi",damage:15,fireRate:100,magazine:32,ammo:160,price:850,range:650},
    {name:"MP5",damage:20,fireRate:110,magazine:30,ammo:150,price:1200,range:700},
    {name:"MP7",damage:18,fireRate:85,magazine:40,ammo:200,price:1400,range:680},
    {name:"P90",damage:19,fireRate:75,magazine:50,ammo:250,price:1700,range:700},

    {
        name:"Shotgun",
        damage:65,
        fireRate:850,
        magazine:6,
        ammo:36,
        price:1100,
        range:450,
        pellets:6,
        spread:.30
    },

    {
        name:"Double Barrel",
        damage:95,
        fireRate:1100,
        magazine:2,
        ammo:24,
        price:1500,
        range:430,
        pellets:8,
        spread:.42
    },

    {
        name:"M870",
        damage:72,
        fireRate:750,
        magazine:8,
        ammo:48,
        price:1800,
        range:500,
        pellets:6,
        spread:.28
    },

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

    {
        name:"RPG",
        damage:500,
        fireRate:2200,
        magazine:1,
        ammo:10,
        price:7000,
        range:1200,
        explosive:true
    },

    {name:"Minigun",damage:28,fireRate:40,magazine:200,ammo:1000,price:8000,range:1000},
    {name:"Railgun",damage:800,fireRate:2200,magazine:3,ammo:18,price:10000,range:1800},
    {name:"Laser Gun",damage:100,fireRate:80,magazine:100,ammo:500,price:9000,range:1200},
    {name:"Plasma Rifle",damage:180,fireRate:250,magazine:30,ammo:150,price:12000,range:1300},

    {
        name:"Doom Cannon",
        damage:1200,
        fireRate:3000,
        magazine:1,
        ammo:10,
        price:20000,
        range:1600,
        explosive:true
    },

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

    {
        name:"SPAS-12",
        damage:85,
        fireRate:700,
        magazine:8,
        ammo:48,
        price:3200,
        range:520,
        pellets:7,
        spread:.30
    },

    {
        name:"AA-12",
        damage:55,
        fireRate:130,
        magazine:20,
        ammo:160,
        price:5000,
        range:500,
        pellets:5,
        spread:.28
    },

    {
        name:"Saiga-12",
        damage:70,
        fireRate:300,
        magazine:10,
        ammo:80,
        price:3800,
        range:520,
        pellets:6,
        spread:.30
    },

    {
        name:"KSG",
        damage:100,
        fireRate:850,
        magazine:14,
        ammo:70,
        price:4500,
        range:550,
        pellets:6,
        spread:.28
    },

    {
        name:"USAS-12",
        damage:62,
        fireRate:150,
        magazine:20,
        ammo:160,
        price:5200,
        range:540,
        pellets:5,
        spread:.28
    },

    {name:"Flamethrower",damage:75,fireRate:100,magazine:150,ammo:750,price:7000,range:450},

    {
        name:"Grenade Launcher",
        damage:400,
        fireRate:1800,
        magazine:6,
        ammo:30,
        price:6500,
        range:1100,
        explosive:true
    },

    {
        name:"Heavy Cannon",
        damage:650,
        fireRate:2300,
        magazine:4,
        ammo:20,
        price:7500,
        range:1300,
        explosive:true
    },

    {name:"Gauss Rifle",damage:700,fireRate:1800,magazine:5,ammo:25,price:8500,range:1800},
    {name:"Tesla Rifle",damage:350,fireRate:500,magazine:20,ammo:100,price:8000,range:1000},
    {name:"Shock Blaster",damage:450,fireRate:700,magazine:15,ammo:90,price:9000,range:1100},
    {name:"Ion Cannon",damage:900,fireRate:2500,magazine:2,ammo:12,price:14000,range:1800},
    {name:"Energy Destroyer",damage:1000,fireRate:1800,magazine:5,ammo:30,price:15000,range:1700},
    {name:"Death Ray",damage:1500,fireRate:3000,magazine:3,ammo:15,price:18000,range:2000},

    {
        name:"Apocalypse Gun",
        damage:2000,
        fireRate:3500,
        magazine:2,
        ammo:10,
        price:25000,
        range:2200,
        explosive:true
    },

    {
        name:"Black Hole Gun",
        damage:3000,
        fireRate:4000,
        magazine:1,
        ammo:5,
        price:35000,
        range:2000,
        explosive:true
    },

    {name:"Omega Rifle",damage:2500,fireRate:2000,magazine:10,ammo:50,price:30000,range:2200},

    {
        name:"Titan Cannon",
        damage:3500,
        fireRate:4000,
        magazine:3,
        ammo:15,
        price:40000,
        range:2300,
        explosive:true
    },

    {name:"Galaxy Blaster",damage:5000,fireRate:4500,magazine:2,ammo:10,price:50000,range:2500},

    {
        name:"Ultimate Destroyer",
        damage:8000,
        fireRate:5000,
        magazine:1,
        ammo:5,
        price:75000,
        range:3000,
        explosive:true
    }
];

/* ============================================================
   ARMADURAS
============================================================ */

const armors = [
    {name:"Colete Leve",armor:20,price:500},
    {name:"Colete Tático",armor:40,price:1200},
    {name:"Armadura Pesada",armor:60,price:2500},
    {name:"Armadura Militar",armor:80,price:4500},
    {name:"Armadura Especial",armor:100,price:7000}
];

/* ============================================================
   AMIGOS
============================================================ */

const friends = [
    {name:"Cachorro",damage:10,price:1000,icon:"🐕"},
    {name:"Rottweiler",damage:18,price:2000,icon:"🐕"},
    {name:"Leopardo",damage:25,price:3500,icon:"🐆"},
    {name:"Tigre",damage:35,price:5000,icon:"🐅"},
    {name:"Leão",damage:50,price:7500,icon:"🦁"},
    {name:"Velociraptor",damage:70,price:12000,icon:"🦖"}
];

/* ============================================================
   KITS
============================================================ */

const kits = [
    {name:"Kit Médico",heal:30,price:300,icon:"🩹"},
    {name:"Kit Médico Grande",heal:70,price:700,icon:"🏥"},
    {name:"+5 de Vida",permanentHealth:5,price:1000,icon:"❤️"}
];

/* ============================================================
   BOMBAS
============================================================ */

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

/* ============================================================
   ARMADILHAS
============================================================ */

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

/* ============================================================
   BARRICADAS
============================================================ */

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

/* ============================================================
   ZUMBIS
============================================================ */

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

/* ============================================================
   TIPOS DE MUNIÇÃO
============================================================ */

function getAmmoType(name){

    const n = String(name || "").toLowerCase();

    if(
        n.includes("rpg") ||
        n.includes("launcher") ||
        n.includes("cannon")
    ){
        return "Foguete / Granada";
    }

    if(
        n.includes("laser") ||
        n.includes("railgun") ||
        n.includes("ion") ||
        n.includes("tesla") ||
        n.includes("shock") ||
        n.includes("energy") ||
        n.includes("death ray") ||
        n.includes("gauss") ||
        n.includes("plasma")
    ){
        return "Energia / Plasma";
    }

    if(n.includes("flamethrower")){
        return "Combustível";
    }

    if(
        n.includes("shotgun") ||
        n.includes("double barrel") ||
        n.includes("m870") ||
        n.includes("spas") ||
        n.includes("aa-12") ||
        n.includes("saiga") ||
        n.includes("ksg") ||
        n.includes("usas")
    ){
        return "Cartucho";
    }

    if(
        n.includes("sniper") ||
        n.includes("awp") ||
        n.includes("barrett") ||
        n.includes("svd") ||
        n.includes("m24") ||
        n.includes("mosin") ||
        n.includes("kar98") ||
        n.includes("intervention") ||
        n.includes("vss")
    ){
        return "Munição de Precisão";
    }

    if(
        n.includes("m249") ||
        n.includes("pkm") ||
        n.includes("rpk") ||
        n.includes("minigun") ||
        n.includes("doom") ||
        n.includes("omega") ||
        n.includes("titan")
    ){
        return "Munição Pesada";
    }

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
    ){
        return "Munição de SMG";
    }

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
    ){
        return "Munição de Fuzil";
    }

    if(
        n.includes("desert eagle") ||
        n.includes("magnum") ||
        n.includes("raging hunter")
    ){
        return "Munição de Revólver";
    }

    return "Munição de Pistola";
}

weapons.forEach(w=>{
    w.ammoType = getAmmoType(w.name);
});

/* ============================================================
   ESTADO DO JOGADOR
============================================================ */

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

    score:0,
    kills:0
};

/* ============================================================
   ESTADOS
============================================================ */

let zombies = [];
let bullets = [];

let placedTraps = [];
let placedBarricades = [];

let particles = [];
let explosions = [];

let inventory = [];

let currentCategory = "armadura";
let selectedShopWeapon = weapons[0];

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

/* ============================================================
   NOME DO JOGADOR
============================================================ */

function getPlayerName(){

    if(!playerNameInput){
        return "";
    }

    return playerNameInput.value
        .trim()
        .replace(/\s+/g," ")
        .slice(0,16);
}

function validatePlayerName(){

    const name = getPlayerName();

    if(!name){

        if(nameWarning){
            nameWarning.style.display = "block";
        }

        if(playerNameInput){
            playerNameInput.focus();
        }

        return false;
    }

    if(nameWarning){
        nameWarning.style.display = "none";
    }

    try{
        localStorage.setItem(
            "ludix_player_name",
            name
        );
    }catch(error){}

    playerName = name;

    return true;
}

if(playerNameInput){

    playerNameInput.addEventListener(
        "input",
        ()=>{
            if(getPlayerName() && nameWarning){
                nameWarning.style.display = "none";
            }
        }
    );
}

/* ============================================================
   CLASSE DAS ARMAS
============================================================ */

function weaponClass(name){

    const n = name.toLowerCase();

    if([
        "pistola",
        "glock",
        "beretta",
        "colt",
        "five seven",
        "usp",
        "cz 75",
        "magnum",
        "raging hunter",
        "desert eagle"
    ].some(v=>n.includes(v))){
        return "pistol";
    }

    if([
        "uzi",
        "mp5",
        "mp7",
        "p90",
        "fn p90",
        "vector",
        "mp40",
        "thompson",
        "mac-10",
        "pp-19",
        "mpx",
        "ump45",
        "ppsh",
        "pps-43",
        "mp5sd",
        "mac-11"
    ].some(v=>n.includes(v))){
        return "smg";
    }

    if([
        "shotgun",
        "double barrel",
        "m870",
        "spas",
        "aa-12",
        "saiga",
        "ksg",
        "usas"
    ].some(v=>n.includes(v))){
        return "shotgun";
    }

    if([
        "ak-47",
        "ak-74",
        "m4",
        "m16",
        "scar",
        "famas",
        "g36",
        "aug",
        "galil",
        "fnc",
        "hk416",
        "g3",
        "fal",
        "m14",
        "groza",
        "an-94",
        "as val",
        "vss",
        "rpk",
        "pkm",
        "m249"
    ].some(v=>n.includes(v))){
        return "rifle";
    }

    if([
        "sniper",
        "awp",
        "barrett",
        "svd",
        "m24",
        "mosin",
        "kar98",
        "intervention"
    ].some(v=>n.includes(v))){
        return "sniper";
    }

    if([
        "rpg",
        "grenade launcher",
        "heavy cannon",
        "gauss rifle",
        "minigun"
    ].some(v=>n.includes(v))){
        return "heavy";
    }

    if([
        "flamethrower",
        "laser",
        "plasma",
        "railgun",
        "tesla",
        "shock",
        "ion",
        "energy",
        "death ray",
        "apocalypse",
        "black hole",
        "omega",
        "titan",
        "galaxy",
        "ultimate",
        "doom"
    ].some(v=>n.includes(v))){
        return "energy";
    }

    return "rifle";
}

/* ============================================================
   VISUAL DA ARMA
============================================================ */

function weaponSkin(name){

    const hash =
        [...name].reduce(
            (a,c)=>a+c.charCodeAt(0),
            0
        );

    return {
        accent:`hsl(${hash % 360} 55% 48%)`,
        dark:"#16191b",
        metal:hash % 2
            ? "#596168"
            : "#737b82",
        wood:hash % 3
            ? "#5b3a25"
            : "#70482d"
    };
}

function drawWeapon(ctx2,name,scale=1){

    const kind = weaponClass(name);
    const c = weaponSkin(name);
    const n = name.toLowerCase();

    ctx2.save();

    ctx2.scale(scale,scale);

    ctx2.lineCap = "round";
    ctx2.lineJoin = "round";

    ctx2.fillStyle =
        "rgba(0,0,0,.28)";

    ctx2.fillRect(
        18,
        3,
        kind === "sniper" ? 92 : 62,
        5
    );

    if(kind === "pistol"){

        const long =
            n.includes("desert") ||
            n.includes("magnum") ||
            n.includes("raging")
            ? 46
            : 34;

        ctx2.fillStyle = c.metal;

        ctx2.fillRect(
            18,
            -7,
            long,
            9
        );

        ctx2.fillStyle = c.dark;

        ctx2.fillRect(
            25,
            2,
            12,
            9
        );

        ctx2.fillStyle = c.wood;

        ctx2.fillRect(
            29,
            8,
            8,
            12
        );

        ctx2.fillStyle = "#0b0c0d";

        ctx2.fillRect(
            18,
            -9,
            long*.7,
            3
        );

    }else if(kind === "smg"){

        const long =
            n.includes("p90")
            ? 47
            : 58;

        ctx2.fillStyle = c.metal;

        ctx2.fillRect(
            17,
            -7,
            long,
            9
        );

        ctx2.fillStyle = c.dark;

        ctx2.fillRect(
            24,
            2,
            10,
            8
        );

        ctx2.fillRect(
            30,
            8,
            7,
            13
        );

        ctx2.fillStyle = "#0b0c0d";

        ctx2.fillRect(
            17,
            -10,
            long*.55,
            3
        );

    }else if(kind === "shotgun"){

        const double =
            n.includes("double barrel");

        const long =
            double
            ? 62
            : 70;

        ctx2.fillStyle = c.metal;

        ctx2.fillRect(
            18,
            -8,
            long,
            7
        );

        ctx2.fillStyle = c.dark;

        if(double){

            ctx2.fillRect(
                18,
                -12,
                long,
                3
            );

            ctx2.fillRect(
                27,
                0,
                11,
                9
            );

        }else{

            ctx2.fillRect(
                24,
                0,
                12,
                9
            );
        }

        ctx2.fillStyle = c.wood;

        ctx2.fillRect(
            31,
            7,
            7,
            16
        );

    }else if(kind === "rifle"){

        const long =
            n.includes("m249") ||
            n.includes("pkm")
            ? 82
            : 72;

        ctx2.fillStyle = c.metal;

        ctx2.fillRect(
            18,
            -8,
            long,
            7
        );

        ctx2.fillStyle = c.dark;

        ctx2.fillRect(
            24,
            0,
            11,
            9
        );

        ctx2.fillRect(
            30,
            7,
            7,
            17
        );

        ctx2.fillStyle = c.wood;

        ctx2.fillRect(
            11,
            -3,
            14,
            5
        );

        ctx2.fillStyle = "#0a0b0c";

        ctx2.fillRect(
            18,
            -11,
            long*.45,
            3
        );

    }else if(kind === "sniper"){

        ctx2.fillStyle = c.metal;

        ctx2.fillRect(
            16,
            -7,
            91,
            6
        );

        ctx2.fillStyle = c.dark;

        ctx2.fillRect(
            27,
            0,
            12,
            9
        );

        ctx2.fillRect(
            31,
            7,
            7,
            16
        );

        ctx2.fillStyle = c.wood;

        ctx2.fillRect(
            10,
            -3,
            19,
            5
        );

        ctx2.fillStyle = "#252a2e";

        ctx2.fillRect(
            45,
            -13,
            30,
            5
        );

    }else if(kind === "heavy"){

        ctx2.fillStyle = c.metal;

        ctx2.fillRect(
            14,
            -9,
            86,
            11
        );

        ctx2.fillStyle = c.dark;

        ctx2.fillRect(
            25,
            2,
            15,
            12
        );

        ctx2.fillRect(
            31,
            13,
            8,
            14
        );

        if(n.includes("rpg")){

            ctx2.fillStyle = "#4e5b50";

            ctx2.fillRect(
                15,
                -14,
                70,
                4
            );

            ctx2.fillStyle = "#202629";

            ctx2.fillRect(
                80,
                -11,
                14,
                8
            );

        }else if(n.includes("minigun")){

            ctx2.fillStyle = "#444a4e";

            for(let i=0;i<5;i++){

                ctx2.fillRect(
                    55+i*7,
                    -4,
                    4,
                    27
                );
            }
        }

    }else{

        ctx2.fillStyle = c.dark;

        ctx2.fillRect(
            15,
            -9,
            82,
            10
        );

        ctx2.fillStyle = c.accent;

        ctx2.fillRect(
            30,
            -5,
            52,
            4
        );

        ctx2.fillRect(
            55,
            -13,
            22,
            4
        );

        ctx2.fillStyle = "#b9f4ff";

        ctx2.fillRect(
            80,
            -6,
            20,
            5
        );

        ctx2.strokeStyle = c.accent;
        ctx2.lineWidth = 2;

        ctx2.strokeRect(
            46,
            -15,
            28,
            5
        );
    }

    ctx2.restore();
}

/* ============================================================
   LOJA
============================================================ */

function itemVisual(item,type){

    if(item.icon){
        return item.icon;
    }

    if(type === "armas") return "🔫";
    if(type === "armadura") return "🛡️";
    if(type === "amigos") return "🐾";
    if(type === "municao") return "📦";
    if(type === "kits") return "🩹";
    if(type === "bombas") return "💣";
    if(type === "armadilhas") return "🪤";
    if(type === "barricadas") return "🧱";

    return "📦";
}

function itemDescription(item,type){

    if(type === "armas"){

        return `
            Dano: ${item.damage}
            |
            Carregador: ${item.magazine}
            |
            ${item.ammoType || getAmmoType(item.name)}
            <br>
            <small>Depois de comprar: T vende por 50%</small>
        `;
    }

    if(type === "armadura"){
        return `Proteção: ${item.armor}`;
    }

    if(type === "amigos"){
        return `Dano: ${item.damage}`;
    }

    if(type === "kits"){

        if(item.permanentHealth){
            return `Vida máxima +${item.permanentHealth} permanentemente`;
        }

        return `Recupera ${item.heal} de vida`;
    }

    if(type === "bombas"){
        return `Dano: ${item.damage} | Área: ${item.radius}`;
    }

    if(type === "armadilhas"){
        return `Dano: ${item.damage}`;
    }

    if(type === "barricadas"){
        return `Resistência: ${item.health}`;
    }

    return "Item especial";
}

function getShopItems(){

    if(currentCategory === "armadura"){
        return armors;
    }

    if(currentCategory === "armas"){
        return weapons;
    }

    if(currentCategory === "amigos"){
        return friends;
    }

    if(currentCategory === "kits"){
        return kits;
    }

    if(currentCategory === "bombas"){
        return bombs;
    }

    if(currentCategory === "armadilhas"){
        return traps;
    }

    if(currentCategory === "barricadas"){
        return barricades;
    }

    return [];
}

function renderItems(){

    if(!shopContent){
        return;
    }

    shopContent.innerHTML = "";

    if(currentCategory === "municao"){

        shopContent.innerHTML = `
            <div class="shop-item">
                <div class="item-visual">📦</div>

                <h3>Munição +30</h3>

                <p>
                    Adiciona 30 munições
                    à reserva da arma atual.
                </p>

                <strong>$150</strong>

                <button onclick="buyAmmo()">
                    COMPRAR
                </button>
            </div>
        `;

        return;
    }

    const items =
        getShopItems();

    items.forEach((item,index)=>{

        const card =
            document.createElement("div");

        card.className =
            "shop-item";

        card.innerHTML = `
            <div class="item-visual">
                ${itemVisual(
                    item,
                    currentCategory
                )}
            </div>

            <h3>${item.name}</h3>

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
                onclick="buyItem(${index})"
            >
                COMPRAR
            </button>
        `;

        shopContent.appendChild(card);
    });
}

/* ============================================================
   COMPRAR ITEM
============================================================ */

window.buyItem = function(index){

    const items =
        getShopItems();

    const item =
        items[index];

    if(!item){
        return;
    }

    if(player.money < item.price){

        alert(
            "Dinheiro insuficiente!"
        );

        return;
    }

    /* ARMAS */

    if(currentCategory === "armas"){

        player.money -= item.price;

        player.weapon = item;
        player.weaponPurchased = true;

        player.ammo =
            item.magazine;

        player.reserveAmmo =
            item.ammo;

        player.reloadTime = 0;

        selectedShopWeapon = item;

        updateHUD();
        renderItems();

        return;
    }

    /* ARMADURA */

    if(currentCategory === "armadura"){

        player.money -= item.price;

        player.armor =
            item.armor;

        player.maxArmor =
            item.armor;

        updateHUD();
        renderItems();

        return;
    }

    /* AMIGO */

    if(currentCategory === "amigos"){

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

    if(currentCategory === "kits"){

        player.money -= item.price;

        if(item.permanentHealth){

            player.maxHealth +=
                item.permanentHealth;

            player.health +=
                item.permanentHealth;

        }else{

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

    if(currentCategory === "bombas"){

        if(!addInventory({
            type:"bomb",
            item:item
        })){

            alert(
                "Inventário cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        renderInventory();
        renderItems();
        updateHUD();

        return;
    }

    /* ARMADILHAS */

    if(currentCategory === "armadilhas"){

        if(!addInventory({
            type:"trap",
            item:item
        })){

            alert(
                "Inventário cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        renderInventory();
        renderItems();
        updateHUD();

        return;
    }

    /* BARRICADAS */

    if(currentCategory === "barricadas"){

        if(!addInventory({
            type:"barricade",
            item:item
        })){

            alert(
                "Inventário cheio!"
            );

            return;
        }

        player.money -=
            item.price;

        renderInventory();
        renderItems();
        updateHUD();
    }
};

/* ============================================================
   VENDER ARMA
============================================================ */

function sellSelectedWeapon(){

    if(
        !player.weaponPurchased ||
        !player.weapon ||
        player.weapon === weapons[0]
    ){

        alert(
            "Você não possui uma arma comprada para vender."
        );

        return;
    }

    const weapon =
        player.weapon;

    const value =
        Math.floor(
            weapon.price / 2
        );

    const confirmed =
        confirm(
            `Vender ${weapon.name} por $${value}?`
        );

    if(!confirmed){
        return;
    }

    player.money += value;

    player.weapon =
        weapons[0];

    player.weaponPurchased =
        false;

    player.ammo =
        weapons[0].magazine;

    player.reserveAmmo =
        weapons[0].ammo;

    player.reloadTime = 0;

    selectedShopWeapon =
        weapons[0];

    updateHUD();
    renderItems();
}

/* ============================================================
   COMPRAR MUNIÇÃO
============================================================ */

window.buyAmmo = function(){

    const price = 150;

    if(player.money < price){

        alert(
            "Dinheiro insuficiente!"
        );

        return;
    }

    player.money -= price;

    player.reserveAmmo += 30;

    updateHUD();
};

/* ============================================================
   INVENTÁRIO
============================================================ */

function addInventory(item){

    if(
        inventory.length >=
        INVENTORY_SIZE
    ){
        return false;
    }

    inventory.push(item);

    return true;
}

function renderInventory(){

    if(menuInventory){
        menuInventory.innerHTML = "";
    }

    if(gameInventorySlots){
        gameInventorySlots.innerHTML = "";
    }

    for(let i=0;i<INVENTORY_SIZE;i++){

        const menuSlot =
            document.createElement("div");

        const gameSlot =
            document.createElement("div");

        menuSlot.className =
            "inventory-slot";

        gameSlot.className =
            "inventory-slot";

        if(inventory[i]){

            const type =
                inventory[i].type === "bomb"
                ? "bombas"
                : inventory[i].type === "trap"
                ? "armadilhas"
                : "barricadas";

            const visual =
                itemVisual(
                    inventory[i].item,
                    type
                );

            menuSlot.innerHTML =
                visual;

            gameSlot.innerHTML =
                visual;

        }else{

            menuSlot.innerHTML =
                `<span>${i+1}</span>`;

            gameSlot.innerHTML =
                `<span>${i+1}</span>`;
        }

        if(menuInventory){
            menuInventory.appendChild(
                menuSlot
            );
        }

        if(gameInventorySlots){
            gameInventorySlots.appendChild(
                gameSlot
            );
        }
    }
}

function useInventory(index){

    if(!inventory[index]){
        return;
    }

    const item =
        inventory[index];

    if(item.type === "bomb"){

        useBomb(
            item.item
        );

        inventory.splice(
            index,
            1
        );
    }

    if(item.type === "trap"){

        if(placeTrap(item.item)){

            inventory.splice(
                index,
                1
            );
        }
    }

    if(item.type === "barricade"){

        if(placeBarricade(item.item)){

            inventory.splice(
                index,
                1
            );
        }
    }

    renderInventory();
}

function usePlacementItem(){

    const index =
        inventory.findIndex(
            item =>
                item.type === "trap" ||
                item.type === "barricade"
        );

    if(index >= 0){

        useInventory(index);
    }
}

/* ============================================================
   INICIAR ONDA / JOGO
============================================================ */

function startWave(){

    if(gameEnded){
        return;
    }

    if(!validatePlayerName()){
        return;
    }

    /*
       IMPORTANTE:
       Aqui o menu desaparece SOMENTE
       depois que o jogador clicar para iniciar.
    */

    if(shopScreen){
        shopScreen.style.display =
            "none";
    }

    if(hud){
        hud.style.display =
            "block";
    }

    if(gameInventory){
        gameInventory.style.display =
            "block";
    }

    gameRunning = true;

    player.x = 180;

    player.y =
        canvas.height / 2;

    zombies = [];
    bullets = [];

    particles = [];
    explosions = [];

    preparation = true;
    waveActive = false;

    preparationTime =
        PREPARATION_TIME;

    renderInventory();
    updateHUD();
}

function updatePreparation(dt){

    preparationTime -= dt;

    if(preparationTime <= 0){

        preparationTime = 0;

        preparation = false;

        waveActive = true;

        spawnWave();
    }
}

function spawnWave(){

    zombies = [];

    const amount =
        5 + wave * 3;

    for(let i=0;i<amount;i++){

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

        const hp =
            type.health +
            wave * 12;

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

            health:hp,
            maxHealth:hp,

            speed:type.speed,
            damage:type.damage,
            reward:type.reward,

            type:type.name,
            icon:type.icon,

            attackCooldown:0,
            hitFlash:0
        });
    }

    updateHUD();
}/* ============================================================
   PARTE 2 — JOGADOR, COMBATE, ZUMBIS, MAPA E LOOP
============================================================ */

/* ============================================================
   MOVIMENTO DO JOGADOR
============================================================ */

function updatePlayer(dt){

    let dx = 0;
    let dy = 0;

    if(keys["w"] || keys["arrowup"]){
        dy -= 1;
    }

    if(keys["s"] || keys["arrowdown"]){
        dy += 1;
    }

    if(keys["a"] || keys["arrowleft"]){
        dx -= 1;
    }

    if(keys["d"] || keys["arrowright"]){
        dx += 1;
    }

    if(dx !== 0 || dy !== 0){

        const length =
            Math.hypot(dx,dy);

        dx /= length;
        dy /= length;

        player.x +=
            dx * player.speed * dt;

        player.y +=
            dy * player.speed * dt;
    }

    player.x =
        Math.max(
            35,
            Math.min(
                canvas.width - 35,
                player.x
            )
        );

    player.y =
        Math.max(
            70,
            Math.min(
                canvas.height - 50,
                player.y
            )
        );
}

/* ============================================================
   DIREÇÃO DA ARMA
============================================================ */

function getPlayerAngle(){

    return Math.atan2(
        mouse.y - player.y,
        mouse.x - player.x
    );
}

/* ============================================================
   DISPARO
============================================================ */

function shoot(){

    if(!gameRunning){
        return;
    }

    if(!waveActive){
        return;
    }

    if(player.reloadTime > 0){
        return;
    }

    const now =
        performance.now();

    if(
        now - player.lastShot <
        player.weapon.fireRate
    ){
        return;
    }

    if(player.ammo <= 0){

        reload();

        return;
    }

    player.lastShot = now;

    player.ammo--;

    const angle =
        getPlayerAngle();

    const kind =
        weaponClass(
            player.weapon.name
        );

    /*
       Velocidade diferente
       para cada classe.
    */

    let bulletSpeed = 1000;

    if(kind === "pistol"){
        bulletSpeed = 1050;
    }

    if(kind === "smg"){
        bulletSpeed = 1150;
    }

    if(kind === "shotgun"){
        bulletSpeed = 900;
    }

    if(kind === "rifle"){
        bulletSpeed = 1250;
    }

    if(kind === "sniper"){
        bulletSpeed = 1500;
    }

    if(kind === "heavy"){
        bulletSpeed = 650;
    }

    if(kind === "energy"){
        bulletSpeed = 1400;
    }

    /*
       Escopetas criam vários projéteis.
    */

    const pellets =
        player.weapon.pellets || 1;

    for(let i=0;i<pellets;i++){

        let shotAngle =
            angle;

        if(pellets > 1){

            const spread =
                player.weapon.spread || .25;

            shotAngle +=
                (Math.random() - .5) *
                spread;
        }

        bullets.push({

            x:
                player.x +
                Math.cos(shotAngle) * 25,

            y:
                player.y +
                Math.sin(shotAngle) * 25,

            vx:
                Math.cos(shotAngle) *
                bulletSpeed,

            vy:
                Math.sin(shotAngle) *
                bulletSpeed,

            damage:
                pellets > 1
                ? player.weapon.damage / pellets
                : player.weapon.damage,

            life:
                player.weapon.range /
                bulletSpeed,

            ammoType:
                player.weapon.ammoType ||
                getAmmoType(
                    player.weapon.name
                ),

            weaponClass:kind,

            weaponName:
                player.weapon.name,

            explosive:
                !!player.weapon.explosive,

            radius:
                player.weapon.explosive
                ? 90
                : 4
        });
    }

    /*
       Efeito de disparo.
    */

    particles.push({
        x:
            player.x +
            Math.cos(angle) * 28,

        y:
            player.y +
            Math.sin(angle) * 28,

        vx:
            Math.cos(angle) * 70,

        vy:
            Math.sin(angle) * 70,

        life:.08,
        maxLife:.08,
        size:
            kind === "heavy"
            ? 14
            : 7,

        type:"muzzle"
    });

    updateHUD();
}

/* ============================================================
   RECARGA
============================================================ */

function reload(){

    if(player.reloadTime > 0){
        return;
    }

    if(
        player.ammo >=
        player.weapon.magazine
    ){
        return;
    }

    if(player.reserveAmmo <= 0){
        return;
    }

    player.reloadTime = 1.3;
}

function updateReload(dt){

    if(player.reloadTime <= 0){
        return;
    }

    player.reloadTime -= dt;

    if(player.reloadTime <= 0){

        player.reloadTime = 0;

        const missing =
            player.weapon.magazine -
            player.ammo;

        const amount =
            Math.min(
                missing,
                player.reserveAmmo
            );

        player.ammo += amount;

        player.reserveAmmo -= amount;

        updateHUD();
    }
}

/* ============================================================
   ATUALIZAÇÃO DAS BALAS
============================================================ */

function updateBullets(dt){

    for(
        let i = bullets.length - 1;
        i >= 0;
        i--
    ){

        const bullet =
            bullets[i];

        bullet.x +=
            bullet.vx * dt;

        bullet.y +=
            bullet.vy * dt;

        bullet.life -= dt;

        let hit = false;

        /*
           Colisão com zumbis.
        */

        for(
            let j = zombies.length - 1;
            j >= 0;
            j--
        ){

            const zombie =
                zombies[j];

            const distance =
                Math.hypot(
                    bullet.x - zombie.x,
                    bullet.y - zombie.y
                );

            const collisionRadius =
                28 +
                (bullet.radius || 0);

            if(distance < collisionRadius){

                hit = true;

                if(bullet.explosive){

                    explode(
                        bullet.x,
                        bullet.y,
                        bullet.radius || 90,
                        bullet.damage
                    );

                }else{

                    damageZombie(
                        zombie,
                        bullet.damage
                    );
                }

                break;
            }
        }

        /*
           Remove balas antigas.
        */

        if(
            hit ||
            bullet.life <= 0 ||
            bullet.x < -150 ||
            bullet.x > canvas.width + 150 ||
            bullet.y < -150 ||
            bullet.y > canvas.height + 150
        ){

            bullets.splice(
                i,
                1
            );
        }
    }
}

/* ============================================================
   DANO NO ZUMBI
============================================================ */

function damageZombie(
    zombie,
    damage
){

    if(!zombie){
        return;
    }

    zombie.health -= damage;

    zombie.hitFlash = .08;

    if(zombie.health <= 0){

        const index =
            zombies.indexOf(
                zombie
            );

        if(index !== -1){

            zombies.splice(
                index,
                1
            );
        }

        player.money +=
            zombie.reward;

        player.score +=
            zombie.reward;

        player.kills++;

        createExplosion(
            zombie.x,
            zombie.y,
            zombie.type === "Boss"
            ? 45
            : 25
        );

        /*
           Chance pequena de dinheiro extra.
        */

        if(Math.random() < .08){

            player.money += 100;

            player.score += 100;
        }

        updateHUD();
    }
}

/* ============================================================
   EXPLOSÃO
============================================================ */

function explode(
    x,
    y,
    radius,
    damage
){

    explosions.push({

        x:x,
        y:y,

        radius:0,

        maxRadius:
            radius,

        life:.45,
        maxLife:.45
    });

    /*
       Dano em área.
    */

    for(
        let i = zombies.length - 1;
        i >= 0;
        i--
    ){

        const zombie =
            zombies[i];

        const distance =
            Math.hypot(
                zombie.x - x,
                zombie.y - y
            );

        if(distance <= radius){

            /*
               O dano diminui
               conforme a distância.
            */

            const multiplier =
                Math.max(
                    .15,
                    1 - distance / radius
                );

            damageZombie(
                zombie,
                damage * multiplier
            );
        }
    }

    /*
       Partículas.
    */

    for(let i=0;i<25;i++){

        const angle =
            Math.random() *
            Math.PI * 2;

        const speed =
            80 +
            Math.random() * 300;

        particles.push({

            x:x,
            y:y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life:
                .3 +
                Math.random() * .5,

            maxLife:1,

            size:
                2 +
                Math.random() * 7,

            type:"explosion"
        });
    }
}

function createExplosion(
    x,
    y,
    radius
){

    explosions.push({

        x:x,
        y:y,

        radius:0,

        maxRadius:radius,

        life:.3,
        maxLife:.3
    });
}

/* ============================================================
   ATUALIZAÇÃO DAS EXPLOSÕES
============================================================ */

function updateExplosions(dt){

    for(
        let i = explosions.length - 1;
        i >= 0;
        i--
    ){

        const explosion =
            explosions[i];

        explosion.life -= dt;

        const progress =
            1 -
            explosion.life /
            explosion.maxLife;

        explosion.radius =
            explosion.maxRadius *
            progress;

        if(explosion.life <= 0){

            explosions.splice(
                i,
                1
            );
        }
    }
}

/* ============================================================
   PARTÍCULAS
============================================================ */

function updateParticles(dt){

    for(
        let i = particles.length - 1;
        i >= 0;
        i--
    ){

        const p =
            particles[i];

        p.x +=
            p.vx * dt;

        p.y +=
            p.vy * dt;

        p.vx *=
            Math.pow(.05,dt);

        p.vy *=
            Math.pow(.05,dt);

        p.life -= dt;

        if(p.life <= 0){

            particles.splice(
                i,
                1
            );
        }
    }
}

/* ============================================================
   DANO NO JOGADOR
============================================================ */

function damagePlayer(amount){

    let remaining =
        Math.max(
            0,
            amount
        );

    /*
       Primeiro a armadura.
    */

    if(player.armor > 0){

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

    if(player.health <= 0){

        player.health = 0;

        endGame();
    }

    updateHUD();
}

/* ============================================================
   ATUALIZAÇÃO DOS ZUMBIS
============================================================ */

function updateZombies(dt){

    /*
       Movimento dos zumbis.
    */

    for(
        let i = zombies.length - 1;
        i >= 0;
        i--
    ){

        const zombie =
            zombies[i];

        if(zombie.hitFlash > 0){

            zombie.hitFlash -=
                dt;
        }

        /*
           Procura uma barricada
           próxima.
        */

        let targetBarricade =
            null;

        let closestBarricadeDistance =
            Infinity;

        for(
            const barricade
            of placedBarricades
        ){

            const distance =
                Math.hypot(
                    zombie.x -
                    barricade.x,

                    zombie.y -
                    barricade.y
                );

            if(
                distance <
                closestBarricadeDistance
            ){

                closestBarricadeDistance =
                    distance;

                targetBarricade =
                    barricade;
            }
        }

        /*
           Se existe barricada próxima,
           o zumbi pode atacá-la.
        */

        if(
            targetBarricade &&
            closestBarricadeDistance < 65 &&
            Math.abs(
                zombie.y -
                targetBarricade.y
            ) < 55
        ){

            zombie.attackCooldown -=
                dt;

            if(
                zombie.attackCooldown <= 0
            ){

                targetBarricade.health -=
                    zombie.damage;

                zombie.attackCooldown =
                    .8;

                if(
                    targetBarricade.health <= 0
                ){

                    const index =
                        placedBarricades.indexOf(
                            targetBarricade
                        );

                    if(index !== -1){

                        placedBarricades.splice(
                            index,
                            1
                        );
                    }
                }
            }

            continue;
        }

        /*
           Caminha até o jogador.
        */

        const dx =
            player.x -
            zombie.x;

        const dy =
            player.y -
            zombie.y;

        const distance =
            Math.hypot(
                dx,
                dy
            );

        if(distance > 55){

            const safeDistance =
                Math.max(
                    distance,
                    .001
                );

            zombie.x +=
                (dx / safeDistance) *
                zombie.speed *
                dt;

            zombie.y +=
                (dy / safeDistance) *
                zombie.speed *
                dt;

        }else{

            zombie.attackCooldown -=
                dt;

            if(
                zombie.attackCooldown <= 0
            ){

                damagePlayer(
                    zombie.damage
                );

                zombie.attackCooldown =
                    .8;
            }
        }
    }

    /*
       Amigo do jogador.
    */

    if(friend){

        let nearest = null;

        let nearestDistance =
            Infinity;

        for(
            const zombie
            of zombies
        ){

            const distance =
                Math.hypot(
                    zombie.x -
                    player.x,

                    zombie.y -
                    player.y
                );

            if(
                distance <
                nearestDistance
            ){

                nearestDistance =
                    distance;

                nearest =
                    zombie;
            }
        }

        if(
            nearest &&
            nearestDistance < 500
        ){

            const now =
                performance.now();

            if(
                now -
                friend.lastAttack >
                700
            ){

                friend.lastAttack =
                    now;

                damageZombie(
                    nearest,
                    friend.damage
                );
            }
        }
    }
}

/* ============================================================
   BOMBAS
============================================================ */

function useBomb(bomb){

    if(
        !waveActive &&
        !preparation
    ){
        return;
    }

    /*
       Durante preparação a bomba
       pode ser usada, mas não haverá
       zumbis ainda.
    */

    explode(
        player.x,
        player.y,
        bomb.radius,
        bomb.damage
    );

    updateHUD();
}

/* ============================================================
   ARMADILHAS
============================================================ */

function placeTrap(trap){

    if(!preparation){

        alert(
            "Armadilhas só podem ser colocadas durante os 30 segundos de preparação!"
        );

        return false;
    }

    placedTraps.push({

        x:player.x,
        y:player.y,

        damage:
            trap.damage,

        radius:35,

        active:true,

        name:
            trap.name
    });

    return true;
}

function updateTraps(){

    for(
        let i = placedTraps.length - 1;
        i >= 0;
        i--
    ){

        const trap =
            placedTraps[i];

        if(!trap.active){
            continue;
        }

        for(
            let j = zombies.length - 1;
            j >= 0;
            j--
        ){

            const zombie =
                zombies[j];

            const distance =
                Math.hypot(
                    zombie.x -
                    trap.x,

                    zombie.y -
                    trap.y
                );

            if(
                distance <
                trap.radius
            ){

                trap.active = false;

                damageZombie(
                    zombie,
                    trap.damage
                );

                break;
            }
        }
    }

    placedTraps =
        placedTraps.filter(
            trap => trap.active
        );
}

/* ============================================================
   BARRICADAS
============================================================ */

function placeBarricade(
    barricade
){

    if(!preparation){

        alert(
            "Barricadas só podem ser colocadas durante os 30 segundos de preparação!"
        );

        return false;
    }

    placedBarricades.push({

        x:player.x,

        y:player.y,

        width:80,
        height:30,

        health:
            barricade.health,

        maxHealth:
            barricade.health,

        name:
            barricade.name
    });

    return true;
}

/* ============================================================
   CHECAGEM DA ONDA
============================================================ */

function checkWaveComplete(){

    if(
        !waveActive ||
        zombies.length > 0
    ){
        return;
    }

    waveActive = false;

    preparation = true;

    /*
       Próxima onda.
    */

    wave++;

    preparationTime =
        PREPARATION_TIME;

    /*
       Recompensa por completar
       a onda.
    */

    const waveBonus =
        wave * 100;

    player.money +=
        waveBonus;

    player.score +=
        waveBonus;

    /*
       Pequena recuperação.
    */

    player.health =
        Math.min(
            player.maxHealth,
            player.health + 10
        );

    updateHUD();
}

/* ============================================================
   HUD
============================================================ */

function updateHUD(){

    const money =
        player.money.toLocaleString(
            "pt-BR"
        );

    if(moneyEl){
        moneyEl.textContent =
            `$${money}`;
    }

    if(moneyHud){
        moneyHud.textContent =
            `$${money}`;
    }

    const name =
        getPlayerName() ||
        playerName ||
        "Jogador";

    if(nameHud){
        nameHud.textContent =
            name;
    }

    if(healthBar){

        const healthPercent =
            player.maxHealth > 0
            ? (
                player.health /
                player.maxHealth
            ) * 100
            : 0;

        healthBar.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    healthPercent
                )
            )}%`;
    }

    if(armorBar){

        const armorPercent =
            player.maxArmor > 0
            ? (
                player.armor /
                player.maxArmor
            ) * 100
            : 0;

        armorBar.style.width =
            `${Math.max(
                0,
                Math.min(
                    100,
                    armorPercent
                )
            )}%`;
    }

    if(waveEl){
        waveEl.textContent =
            wave;
    }

    if(enemiesEl){
        enemiesEl.textContent =
            zombies.length;
    }

    if(weaponEl){

        weaponEl.textContent =
            player.weapon
            ? player.weapon.name
            : "Pistola";
    }

    if(ammoEl){

        ammoEl.textContent =
            `${player.ammo} / ${player.reserveAmmo}`;
    }
}

/* ============================================================
   DESENHO DO MAPA
============================================================ */

function drawBackground(){

    /*
       Fundo principal.
    */

    ctx.fillStyle =
        "#111417";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    /*
       Piso.
    */

    ctx.fillStyle =
        "#171b1e";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    /*
       Grade.
    */

    ctx.strokeStyle =
        "rgba(255,255,255,.035)";

    ctx.lineWidth = 1;

    const gridSize = 50;

    for(
        let x = 0;
        x < canvas.width;
        x += gridSize
    ){

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

    for(
        let y = 0;
        y < canvas.height;
        y += gridSize
    ){

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
       Faixa da base.
    */

    ctx.fillStyle =
        "rgba(40,120,255,.035)";

    ctx.fillRect(
        0,
        0,
        280,
        canvas.height
    );

    /*
       Linha de defesa.
    */

    ctx.strokeStyle =
        "rgba(70,150,255,.18)";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        300,
        0
    );

    ctx.lineTo(
        300,
        canvas.height
    );

    ctx.stroke();

    /*
       Texto da base.
    */

    ctx.save();

    ctx.fillStyle =
        "rgba(120,180,255,.12)";

    ctx.font =
        "bold 24px Arial";

    ctx.fillText(
        "BASE",
        35,
        45
    );

    ctx.restore();
}

/* ============================================================
   DESENHAR BARRICADAS
============================================================ */

function drawBarricades(){

    for(
        const barricade
        of placedBarricades
    ){

        const x =
            barricade.x -
            barricade.width / 2;

        const y =
            barricade.y -
            barricade.height / 2;

        /*
           Sombra.
        */

        ctx.fillStyle =
            "rgba(0,0,0,.35)";

        ctx.fillRect(
            x + 5,
            y + 7,
            barricade.width,
            barricade.height
        );

        /*
           Corpo.
        */

        ctx.fillStyle =
            "#555c61";

        ctx.fillRect(
            x,
            y,
            barricade.width,
            barricade.height
        );

        /*
           Placas.
        */

        ctx.strokeStyle =
            "#899197";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            barricade.width,
            barricade.height
        );

        for(
            let i=10;
            i<barricade.width;
            i+=20
        ){

            ctx.strokeStyle =
                "rgba(0,0,0,.35)";

            ctx.beginPath();

            ctx.moveTo(
                x+i,
                y
            );

            ctx.lineTo(
                x+i,
                y+barricade.height
            );

            ctx.stroke();
        }

        /*
           Barra de vida.
        */

        const percent =
            barricade.maxHealth > 0
            ? barricade.health /
              barricade.maxHealth
            : 0;

        ctx.fillStyle =
            "rgba(0,0,0,.6)";

        ctx.fillRect(
            x,
            y-10,
            barricade.width,
            5
        );

        ctx.fillStyle =
            "#39d353";

        ctx.fillRect(
            x,
            y-10,
            barricade.width *
            Math.max(
                0,
                Math.min(
                    1,
                    percent
                )
            ),
            5
        );
    }
}

/* ============================================================
   DESENHAR ARMADILHAS
============================================================ */

function drawTraps(){

    for(
        const trap
        of placedTraps
    ){

        ctx.save();

        ctx.translate(
            trap.x,
            trap.y
        );

        /*
           Área.
        */

        ctx.fillStyle =
            "rgba(255,80,40,.08)";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            trap.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle =
            "rgba(255,120,50,.35)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            trap.radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        /*
           Armadilha.
        */

        ctx.fillStyle =
            "#777";

        ctx.fillRect(
            -13,
            -6,
            26,
            12
        );

        ctx.fillStyle =
            "#ff6333";

        ctx.fillRect(
            -9,
            -3,
            18,
            6
        );

        ctx.restore();
    }
}

/* ============================================================
   DESENHAR ZUMBIS
============================================================ */

function drawZombie(zombie){

    ctx.save();

    ctx.translate(
        zombie.x,
        zombie.y
    );

    /*
       Sombra.
    */

    ctx.fillStyle =
        "rgba(0,0,0,.4)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        27,
        22,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
       Corpo.
    */

    let bodyColor =
        "#687b69";

    if(zombie.type === "Runner"){
        bodyColor = "#8b9b70";
    }

    if(zombie.type === "Brute"){
        bodyColor = "#66535e";
    }

    if(zombie.type === "Mutant"){
        bodyColor = "#765b91";
    }

    if(zombie.type === "Burning"){
        bodyColor = "#a84c2d";
    }

    if(zombie.type === "Toxic"){
        bodyColor = "#5c8a55";
    }

    if(zombie.type === "Tank"){
        bodyColor = "#555b64";
    }

    if(zombie.type === "Boss"){
        bodyColor = "#493d4f";
    }

    if(zombie.hitFlash > 0){
        bodyColor = "#ffffff";
    }

    ctx.fillStyle =
        bodyColor;

    ctx.beginPath();

    ctx.roundRect(
        -17,
        -4,
        34,
        39,
        8
    );

    ctx.fill();

    /*
       Cabeça.
    */

    ctx.fillStyle =
        zombie.type === "Burning"
        ? "#ff7540"
        : "#91a58e";

    if(zombie.type === "Boss"){
        ctx.fillStyle =
            "#8d718f";
    }

    ctx.beginPath();

    ctx.arc(
        0,
        -20,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
       Olhos.
    */

    ctx.fillStyle =
        "#ef3030";

    ctx.beginPath();

    ctx.arc(
        -5,
        -22,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.arc(
        5,
        -22,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
       Boca.
    */

    ctx.strokeStyle =
        "#222";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        -6,
        -14
    );

    ctx.lineTo(
        6,
        -14
    );

    ctx.stroke();

    /*
       Tipo do zumbi.
    */

    if(
        zombie.type === "Boss" ||
        zombie.type === "Tank"
    ){

        ctx.fillStyle =
            "rgba(255,255,255,.85)";

        ctx.font =
            "bold 10px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            zombie.type,
            0,
            -43
        );
    }

    ctx.restore();

    /*
       Barra de vida.
    */

    const barWidth =
        zombie.type === "Boss"
        ? 70
        : 48;

    const healthPercent =
        zombie.maxHealth > 0
        ? zombie.health /
          zombie.maxHealth
        : 0;

    ctx.fillStyle =
        "rgba(0,0,0,.65)";

    ctx.fillRect(
        zombie.x - barWidth/2,
        zombie.y - 55,
        barWidth,
        5
    );

    ctx.fillStyle =
        zombie.type === "Boss"
        ? "#ff3d6e"
        : "#45df63";

    ctx.fillRect(
        zombie.x - barWidth/2,
        zombie.y - 55,
        barWidth *
        Math.max(
            0,
            Math.min(
                1,
                healthPercent
            )
        ),
        5
    );
}

/* ============================================================
   DESENHAR JOGADOR
============================================================ */

function drawPlayer(){

    const angle =
        getPlayerAngle();

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    /*
       Sombra.
    */

    ctx.fillStyle =
        "rgba(0,0,0,.4)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        27,
        22,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
       Corpo.
    */

    ctx.fillStyle =
        "#276fe8";

    ctx.beginPath();

    ctx.roundRect(
        -17,
        -2,
        34,
        40,
        8
    );

    ctx.fill();

    /*
       Colete.
    */

    if(player.armor > 0){

        ctx.strokeStyle =
            "#8da7b7";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            -13,
            2,
            26,
            29
        );
    }

    /*
       Cabeça.
    */

    ctx.fillStyle =
        "#d59b70";

    ctx.beginPath();

    ctx.arc(
        0,
        -20,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
       Cabelo.
    */

    ctx.fillStyle =
        "#25272b";

    ctx.beginPath();

    ctx.arc(
        0,
        -24,
        15,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    /*
       Arma.

       A arma gira de acordo
       com o mouse.
    */

    ctx.save();

    ctx.rotate(angle);

    drawWeapon(
        ctx,
        player.weapon.name,
        .55
    );

    ctx.restore();

    /*
       Indicador de direção.
    */

    ctx.strokeStyle =
        "rgba(255,255,255,.12)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        0,
        0
    );

    ctx.lineTo(
        Math.cos(angle) * 38,
        Math.sin(angle) * 38
    );

    ctx.stroke();

    ctx.restore();
}

/* ============================================================
   DESENHAR BALAS
============================================================ */

function drawBullets(){

    for(
        const bullet
        of bullets
    ){

        const kind =
            bullet.weaponClass;

        ctx.save();

        /*
           Direção.
        */

        const angle =
            Math.atan2(
                bullet.vy,
                bullet.vx
            );

        ctx.translate(
            bullet.x,
            bullet.y
        );

        ctx.rotate(angle);

        /*
           Pistolas / SMGs.
        */

        if(
            kind === "pistol" ||
            kind === "smg"
        ){

            ctx.fillStyle =
                "#ffd45a";

            ctx.fillRect(
                -6,
                -2,
                12,
                4
            );
        }

        /*
           Rifles.
        */

        else if(
            kind === "rifle"
        ){

            ctx.fillStyle =
                "#ffe8a0";

            ctx.fillRect(
                -9,
                -2,
                18,
                4
            );
        }

        /*
           Snipers.
        */

        else if(
            kind === "sniper"
        ){

            ctx.fillStyle =
                "#ffffff";

            ctx.fillRect(
                -14,
                -2,
                28,
                4
            );

            ctx.fillStyle =
                "rgba(255,255,255,.35)";

            ctx.fillRect(
                -28,
                -1,
                20,
                2
            );
        }

        /*
           Escopetas.
        */

        else if(
            kind === "shotgun"
        ){

            ctx.fillStyle =
                "#ffbc42";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        /*
           Heavy / RPG.
        */

        else if(
            kind === "heavy"
        ){

            ctx.fillStyle =
                "#ff7b31";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle =
                "rgba(255,100,20,.25)";

            ctx.beginPath();

            ctx.arc(
                -8,
                0,
                10,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        /*
           Energia.
        */

        else{

            ctx.fillStyle =
                "#72e8ff";

            ctx.shadowBlur =
                15;

            ctx.shadowColor =
                "#72e8ff";

            ctx.fillRect(
                -9,
                -2,
                18,
                4
            );
        }

        ctx.restore();
    }
}

/* ============================================================
   DESENHAR PARTÍCULAS
============================================================ */

function drawParticles(){

    for(
        const p
        of particles
    ){

        const alpha =
            Math.max(
                0,
                Math.min(
                    1,
                    p.life /
                    p.maxLife
                )
            );

        ctx.save();

        ctx.globalAlpha =
            alpha;

        if(p.type === "muzzle"){

            ctx.fillStyle =
                "#ffd36b";

        }else{

            ctx.fillStyle =
                "#ff8a3d";
        }

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

/* ============================================================
   DESENHAR EXPLOSÕES
============================================================ */

function drawExplosions(){

    for(
        const explosion
        of explosions
    ){

        const alpha =
            Math.max(
                0,
                explosion.life /
                explosion.maxLife
            );

        ctx.save();

        ctx.globalAlpha =
            alpha;

        /*
           Anel externo.
        */

        ctx.strokeStyle =
            "#ff7336";

        ctx.lineWidth = 8;

        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            explosion.radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        /*
           Centro.
        */

        ctx.fillStyle =
            "rgba(255,150,50,.25)";

        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            explosion.radius * .75,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

/* ============================================================
   CROSSHAIR
============================================================ */

function drawCrosshair(){

    if(!gameRunning){
        return;
    }

    ctx.save();

    ctx.translate(
        mouse.x,
        mouse.y
    );

    ctx.strokeStyle =
        "rgba(255,255,255,.8)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        -10,
        0
    );

    ctx.lineTo(
        -3,
        0
    );

    ctx.moveTo(
        3,
        0
    );

    ctx.lineTo(
        10,
        0
    );

    ctx.moveTo(
        0,
        -10
    );

    ctx.lineTo(
        0,
        -3
    );

    ctx.moveTo(
        0,
        3
    );

    ctx.lineTo(
        0,
        10
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        3,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

/* ============================================================
   TEXTO DE PREPARAÇÃO
============================================================ */

function drawPreparation(){

    if(!preparation){
        return;
    }

    const seconds =
        Math.ceil(
            preparationTime
        );

    ctx.save();

    /*
       Painel.
    */

    const panelWidth = 420;
    const panelHeight = 105;

    const x =
        canvas.width / 2 -
        panelWidth / 2;

    const y = 30;

    ctx.fillStyle =
        "rgba(8,10,13,.85)";

    ctx.fillRect(
        x,
        y,
        panelWidth,
        panelHeight
    );

    ctx.strokeStyle =
        "rgba(80,150,255,.45)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        x,
        y,
        panelWidth,
        panelHeight
    );

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 24px Arial";

    ctx.fillText(
        `ONDA ${wave}`,
        canvas.width / 2,
        y + 35
    );

    ctx.fillStyle =
        "#6fb3ff";

    ctx.font =
        "bold 20px Arial";

    ctx.fillText(
        `Preparação: ${seconds}s`,
        canvas.width / 2,
        y + 68
    );

    ctx.fillStyle =
        "rgba(255,255,255,.6)";

    ctx.font =
        "13px Arial";

    ctx.fillText(
        "Compre armas, coloque armadilhas e barricadas",
        canvas.width / 2,
        y + 91
    );

    ctx.restore();
}

/* ============================================================
   DESENHO PRINCIPAL
============================================================ */

function drawGame(){

    if(!ctx || !canvas){
        return;
    }

    drawBackground();

    drawTraps();

    drawBarricades();

    for(
        const zombie
        of zombies
    ){

        drawZombie(
            zombie
        );
    }

    drawBullets();

    drawParticles();

    drawExplosions();

    drawPlayer();

    drawPreparation();

    drawCrosshair();
}

/* ============================================================
   LOOP PRINCIPAL
============================================================ */

let lastFrameTime = 0;

function gameLoop(timestamp){

    if(!lastFrameTime){

        lastFrameTime =
            timestamp;
    }

    let dt =
        (timestamp -
        lastFrameTime) / 1000;

    lastFrameTime =
        timestamp;

    /*
       Evita saltos enormes
       quando a aba fica parada.
    */

    if(dt > .05){
        dt = .05;
    }

    if(gameRunning){

        if(preparation){

            updatePreparation(
                dt
            );

        }else if(waveActive){

            updatePlayer(dt);

            updateReload(dt);

            updateBullets(dt);

            updateZombies(dt);

            updateTraps();

            checkWaveComplete();

            /*
               Disparo automático enquanto
               o botão esquerdo estiver pressionado.
            */

            if(mouse.down){

                shoot();
            }
        }

        /*
           Atualiza partículas mesmo
           durante efeitos.
        */

        updateParticles(dt);

        updateExplosions(dt);

        drawGame();

    }else{

        /*
           Não mostra o mapa do jogo
           por cima do menu.

           Apenas limpa o canvas.
        */

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    requestAnimationFrame(
        gameLoop
    );
}

/* ============================================================
   CONTROLES DO TECLADO
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        /*
           Espaço não rola a página.
        */

        if(key === " "){
            event.preventDefault();
        }

        /*
           R = recarregar.
        */

        if(
            key === "r" &&
            gameRunning
        ){

            reload();
        }

        /*
           1 até 5 =
           inventário.
        */

        if(
            ["1","2","3","4","5"]
            .includes(key) &&
            gameRunning
        ){

            useInventory(
                Number(key) - 1
            );
        }

        /*
           E =
           usar item de colocação.
        */

        if(
            key === "e" &&
            gameRunning
        ){

            usePlacementItem();
        }

        /*
           T =
           vender arma na loja.
        */

        if(
            key === "t" &&
            !gameRunning &&
            shopScreen &&
            shopScreen.style.display !== "none"
        ){

            const tag =
                document.activeElement
                ?.tagName;

            if(
                tag !== "INPUT" &&
                tag !== "TEXTAREA"
            ){

                sellSelectedWeapon();
            }
        }
    }
);

document.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);

/* ============================================================
   MOUSE
============================================================ */

if(canvas){

    canvas.addEventListener(
        "mousemove",
        event => {

            mouse.x =
                event.clientX;

            mouse.y =
                event.clientY;
        }
    );

    canvas.addEventListener(
        "mousedown",
        event => {

            if(event.button !== 0){
                return;
            }

            mouse.down = true;

            if(gameRunning){
                shoot();
            }
        }
    );

    canvas.addEventListener(
        "mouseup",
        event => {

            if(event.button === 0){

                mouse.down =
                    false;
            }
        }
    );

    canvas.addEventListener(
        "mouseleave",
        () => {

            mouse.down =
                false;
        }
    );
}

/* ============================================================
   CATEGORIAS DA LOJA
============================================================ */

function selectCategory(
    category
){

    currentCategory =
        category;

    renderItems();
}

window.selectCategory =
    selectCategory;

/*
   Suporta botões que tenham:
   data-category="armas"
*/

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-category]"
            );

        if(!button){
            return;
        }

        const category =
            button.dataset.category;

        if(category){

            selectCategory(
                category
            );
        }
    }
);

/* ============================================================
   INICIALIZAÇÃO DO CANVAS
============================================================ */

resizeCanvas();

/* ============================================================
   INICIAR LOOP
============================================================ */

requestAnimationFrame(
    gameLoop
);/* ============================================================
   PARTE 3 — GAME OVER, RANKING GLOBAL, SUPABASE E INICIALIZAÇÃO
============================================================ */

/* ============================================================
   SUPABASE
============================================================ */

/*
   O HTML pode fornecer estas variáveis:

   window.SUPABASE_URL
   window.SUPABASE_ANON_KEY

   Se elas não existirem, o jogo continua funcionando
   normalmente, apenas sem ranking online.
*/

const SUPABASE_URL =
    window.SUPABASE_URL || "";

const SUPABASE_ANON_KEY =
    window.SUPABASE_ANON_KEY || "";

let supabaseClient = null;

let playerName = "";

let rankingRefreshTimer = null;

/* ============================================================
   INICIALIZAR SUPABASE
============================================================ */

function initializeSupabase(){

    /*
       Evita erro caso a biblioteca
       do Supabase não esteja carregada.
    */

    if(
        typeof window.supabase ===
        "undefined"
    ){

        console.warn(
            "Supabase não encontrado. Ranking online desativado."
        );

        return;
    }

    if(
        !SUPABASE_URL ||
        !SUPABASE_ANON_KEY
    ){

        console.warn(
            "Configuração do Supabase não encontrada."
        );

        return;
    }

    try{

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        console.log(
            "Supabase conectado."
        );

    }catch(error){

        console.error(
            "Erro ao conectar ao Supabase:",
            error
        );

        supabaseClient =
            null;
    }
}

/* ============================================================
   NOME DO JOGADOR
============================================================ */

function loadPlayerName(){

    try{

        const savedName =
            localStorage.getItem(
                "ludix_player_name"
            );

        if(
            savedName &&
            playerNameInput &&
            !playerNameInput.value.trim()
        ){

            playerNameInput.value =
                savedName;
        }

        if(savedName){

            playerName =
                savedName
                    .trim()
                    .slice(0,20);
        }

    }catch(error){

        console.warn(
            "Não foi possível carregar o nome salvo."
        );
    }
}

function savePlayerName(name){

    const cleanName =
        String(name || "")
            .trim()
            .replace(/\s+/g," ")
            .slice(0,20);

    if(!cleanName){

        playerName =
            "Jogador";

        return;
    }

    playerName =
        cleanName;

    try{

        localStorage.setItem(
            "ludix_player_name",
            cleanName
        );

    }catch(error){}
}

/* ============================================================
   SALVAR PONTUAÇÃO NO RANKING
============================================================ */

async function saveScore(){

    /*
       Evita enviar duas vezes
       a mesma partida.
    */

    if(rankingSent){
        return;
    }

    rankingSent = true;

    if(!supabaseClient){

        console.warn(
            "Ranking online indisponível."
        );

        return;
    }

    const name =
        getPlayerName() ||
        playerName ||
        "Jogador";

    savePlayerName(name);

    const data = {

        player_name:
            name,

        score:
            Number(
                player.score || 0
            ),

        wave:
            Number(
                wave || 0
            ),

        kills:
            Number(
                player.kills || 0
            )
    };

    try{

        const {
            error
        } =
            await supabaseClient
                .from(
                    "they_are_coming_scores"
                )
                .insert([
                    data
                ]);

        if(error){

            console.error(
                "Erro ao salvar ranking:",
                error
            );

            rankingSent = false;

            return;
        }

        console.log(
            "Pontuação enviada para o ranking."
        );

    }catch(error){

        console.error(
            "Erro ao enviar pontuação:",
            error
        );

        rankingSent = false;
    }
}

/* ============================================================
   MELHOR PONTUAÇÃO LOCAL
============================================================ */

function saveLocalBestScore(){

    try{

        const oldBest =
            Number(
                localStorage.getItem(
                    "ludix_best_score"
                ) || 0
            );

        if(
            Number(player.score || 0) >
            oldBest
        ){

            localStorage.setItem(
                "ludix_best_score",
                String(
                    Number(
                        player.score || 0
                    )
                )
            );
        }

    }catch(error){}
}

/* ============================================================
   SALVAR TODAS AS PONTUAÇÕES
============================================================ */

async function saveAllScores(){

    saveLocalBestScore();

    await saveScore();
}

/* ============================================================
   RANKING — CRIAR PAINEL
============================================================ */

function createRankingPanel(){

    /*
       Se o HTML já tiver um painel,
       usamos ele.
    */

    let panel =
        document.getElementById(
            "rankingPanel"
        );

    if(panel){
        return panel;
    }

    panel =
        document.createElement(
            "div"
        );

    panel.id =
        "rankingPanel";

    panel.innerHTML = `

        <div class="ranking-box">

            <button
                id="rankingCloseDynamic"
                class="ranking-close"
                type="button"
            >
                ✕
            </button>

            <div class="ranking-header">

                <div>

                    <div class="ranking-title">
                        🏆 RANKING GLOBAL
                    </div>

                    <div class="ranking-subtitle">
                        THEY ARE COMING
                    </div>

                </div>

            </div>

            <div
                id="globalRanking"
                class="global-ranking"
            >

                <div class="ranking-loading">
                    Carregando ranking...
                </div>

            </div>

        </div>
    `;

    document.body.appendChild(
        panel
    );

    const close =
        document.getElementById(
            "rankingCloseDynamic"
        );

    if(close){

        close.addEventListener(
            "click",
            closeRanking
        );
    }

    return panel;
}

/* ============================================================
   ABRIR RANKING
============================================================ */

async function openRanking(){

    const panel =
        createRankingPanel();

    if(!panel){
        return;
    }

    panel.style.display =
        "flex";

    await loadGlobalRanking();

    /*
       Atualiza a cada 15 segundos
       enquanto estiver aberto.
    */

    if(rankingRefreshTimer){

        clearInterval(
            rankingRefreshTimer
        );
    }

    rankingRefreshTimer =
        setInterval(
            () => {

                const currentPanel =
                    document.getElementById(
                        "rankingPanel"
                    );

                if(
                    currentPanel &&
                    currentPanel.style.display ===
                    "flex"
                ){

                    loadGlobalRanking();
                }

            },
            15000
        );
}

/* ============================================================
   FECHAR RANKING
============================================================ */

function closeRanking(){

    const panel =
        document.getElementById(
            "rankingPanel"
        );

    if(panel){

        panel.style.display =
            "none";
    }

    if(rankingRefreshTimer){

        clearInterval(
            rankingRefreshTimer
        );

        rankingRefreshTimer =
            null;
    }

    /*
       Caso o HTML original tenha
       um rankingScreen.
    */

    if(rankingScreen){

        rankingScreen.style.display =
            "none";
    }
}

/* ============================================================
   CARREGAR RANKING GLOBAL
============================================================ */

async function loadGlobalRanking(){

    const panel =
        createRankingPanel();

    const ranking =
        document.getElementById(
            "globalRanking"
        );

    if(!ranking){
        return;
    }

    if(!supabaseClient){

        ranking.innerHTML = `

            <div class="ranking-empty">

                <div class="ranking-empty-icon">
                    🌐
                </div>

                <strong>
                    Ranking online indisponível
                </strong>

                <p>
                    Configure o Supabase para
                    ativar o ranking global.
                </p>

            </div>
        `;

        return;
    }

    ranking.innerHTML = `

        <div class="ranking-loading">

            ⏳ Carregando jogadores...

        </div>
    `;

    try{

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "they_are_coming_scores"
                )
                .select(
                    "player_name,score,wave,kills,created_at"
                )
                .order(
                    "score",
                    {
                        ascending:false
                    }
                )
                .limit(50);

        if(error){

            console.error(
                "Erro ao carregar ranking:",
                error
            );

            ranking.innerHTML = `

                <div class="ranking-empty">

                    <div class="ranking-empty-icon">
                        ⚠️
                    </div>

                    <strong>
                        Não foi possível carregar o ranking
                    </strong>

                    <p>
                        Verifique a conexão com o banco.
                    </p>

                </div>
            `;

            return;
        }

        renderGlobalRanking(
            data || []
        );

    }catch(error){

        console.error(
            "Erro no ranking:",
            error
        );

        ranking.innerHTML = `

            <div class="ranking-empty">

                <div class="ranking-empty-icon">
                    ⚠️
                </div>

                <strong>
                    Erro ao carregar ranking
                </strong>

            </div>
        `;
    }
}

/* ============================================================
   RENDERIZAR RANKING
============================================================ */

function renderGlobalRanking(
    data
){

    const ranking =
        document.getElementById(
            "globalRanking"
        );

    if(!ranking){
        return;
    }

    if(!data.length){

        ranking.innerHTML = `

            <div class="ranking-empty">

                <div class="ranking-empty-icon">
                    🏆
                </div>

                <strong>
                    Ainda não há jogadores
                </strong>

                <p>
                    Seja o primeiro a entrar no ranking!
                </p>

            </div>
        `;

        return;
    }

    ranking.innerHTML = "";

    data.forEach(
        (item,index)=>{

            const position =
                index + 1;

            let medal =
                `${position}`;

            if(position === 1){
                medal = "🥇";
            }

            if(position === 2){
                medal = "🥈";
            }

            if(position === 3){
                medal = "🥉";
            }

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "ranking-row";

            row.innerHTML = `

                <div class="ranking-position">
                    ${medal}
                </div>

                <div class="ranking-player">

                    <div class="ranking-player-name">
                        ${escapeHtml(
                            item.player_name ||
                            "Jogador"
                        )}
                    </div>

                    <div class="ranking-details">

                        Onda
                        ${Number(
                            item.wave || 0
                        )}

                        •

                        ${Number(
                            item.kills || 0
                        )}
                        eliminações

                    </div>

                </div>

                <div class="ranking-score">

                    ${Number(
                        item.score || 0
                    ).toLocaleString(
                        "pt-BR"
                    )}

                </div>
            `;

            ranking.appendChild(
                row
            );
        }
    );
}

/* ============================================================
   SEGURANÇA PARA NOMES DO RANKING
============================================================ */

function escapeHtml(
    value
){

    return String(value)
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

/* ============================================================
   GAME OVER
============================================================ */

async function endGame(){

    if(gameEnded){
        return;
    }

    gameEnded = true;

    gameRunning = false;

    waveActive = false;

    preparation = false;

    mouse.down = false;

    /*
       Salva pontuação.
    */

    await saveAllScores();

    /*
       Mostra pontuação final.
    */

    if(finalScore){

        finalScore.textContent =
            Number(
                player.score || 0
            ).toLocaleString(
                "pt-BR"
            );
    }

    /*
       Mostra tela de Game Over.
    */

    if(gameOver){

        gameOver.style.display =
            "flex";
    }

    if(hud){

        hud.style.display =
            "none";
    }

    if(gameInventory){

        gameInventory.style.display =
            "none";
    }

    updateHUD();

    /*
       Atualiza ranking se ele
       já estiver aberto.
    */

    const panel =
        document.getElementById(
            "rankingPanel"
        );

    if(
        panel &&
        panel.style.display ===
        "flex"
    ){

        await loadGlobalRanking();
    }
}

/* ============================================================
   REINICIAR JOGO
============================================================ */

function restartGame(){

    gameRunning = false;

    gameEnded = false;

    rankingSent = false;

    wave = 1;

    waveActive = false;

    preparation = false;

    preparationTime =
        PREPARATION_TIME;

    zombies = [];

    bullets = [];

    particles = [];

    explosions = [];

    placedTraps = [];

    placedBarricades = [];

    inventory = [];

    friend = null;

    /*
       Estado inicial do jogador.
    */

    player.x = 180;

    player.y =
        canvas.height / 2;

    player.health =
        MAX_HEALTH_START;

    player.maxHealth =
        MAX_HEALTH_START;

    player.armor = 0;

    player.maxArmor = 0;

    player.money = 500;

    player.weapon =
        weapons[0];

    player.weaponPurchased =
        false;

    player.ammo =
        weapons[0].magazine;

    player.reserveAmmo =
        weapons[0].ammo;

    player.lastShot = 0;

    player.reloadTime = 0;

    player.score = 0;

    player.kills = 0;

    selectedShopWeapon =
        weapons[0];

    currentCategory =
        "armadura";

    /*
       Esconde elementos do jogo.
    */

    if(hud){

        hud.style.display =
            "none";
    }

    if(gameInventory){

        gameInventory.style.display =
            "none";
    }

    if(gameOver){

        gameOver.style.display =
            "none";
    }

    /*
       Fecha ranking.
    */

    closeRanking();

    /*
       Volta para a loja/menu original.
    */

    if(shopScreen){

        shopScreen.style.display =
            "block";
    }

    renderInventory();

    renderItems();

    updateHUD();

    /*
       Limpa canvas.
    */

    if(ctx){

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}

/* ============================================================
   BOTÕES
============================================================ */

if(startWaveBtn){

    startWaveBtn.addEventListener(
        "click",
        () => {

            startWave();
        }
    );
}

if(restartBtn){

    restartBtn.addEventListener(
        "click",
        () => {

            restartGame();
        }
    );
}

if(closeRankingBtn){

    closeRankingBtn.addEventListener(
        "click",
        () => {

            closeRanking();
        }
    );
}

if(rankingBtn){

    rankingBtn.addEventListener(
        "click",
        () => {

            openRanking();
        }
    );
}

/* ============================================================
   ESC
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape"
        ){

            closeRanking();

            /*
               Se o jogo não começou,
               ESC mantém o menu.
            */

            if(
                !gameRunning &&
                shopScreen
            ){

                shopScreen.style.display =
                    "block";
            }
        }
    }
);

/* ============================================================
   ESTILOS DO RANKING
============================================================ */

function injectRankingStyles(){

    if(
        document.getElementById(
            "ludixRankingStyles"
        )
    ){
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "ludixRankingStyles";

    style.textContent = `

        #rankingPanel {

            position:fixed;

            inset:0;

            z-index:99999;

            display:none;

            align-items:center;

            justify-content:center;

            background:
                rgba(0,0,0,.78);

            backdrop-filter:
                blur(8px);

            padding:20px;

            box-sizing:border-box;
        }

        .ranking-box {

            position:relative;

            width:min(760px,95vw);

            max-height:90vh;

            overflow:hidden;

            display:flex;

            flex-direction:column;

            background:
                linear-gradient(
                    145deg,
                    #15191e,
                    #090b0d
                );

            border:
                1px solid
                rgba(100,160,255,.35);

            border-radius:18px;

            box-shadow:
                0 30px 100px
                rgba(0,0,0,.65);
        }

        .ranking-header {

            padding:25px 30px;

            border-bottom:
                1px solid
                rgba(255,255,255,.08);

            display:flex;

            justify-content:space-between;
        }

        .ranking-title {

            color:#fff;

            font-size:26px;

            font-weight:900;

            letter-spacing:.5px;
        }

        .ranking-subtitle {

            color:#6faeff;

            font-size:12px;

            font-weight:700;

            margin-top:5px;

            letter-spacing:2px;
        }

        .ranking-close {

            position:absolute;

            top:18px;

            right:18px;

            width:38px;

            height:38px;

            border:0;

            border-radius:10px;

            background:
                rgba(255,255,255,.07);

            color:#fff;

            cursor:pointer;

            font-size:18px;
        }

        .ranking-close:hover {

            background:
                rgba(255,70,70,.2);
        }

        .global-ranking {

            overflow-y:auto;

            padding:15px;
        }

        .ranking-row {

            display:grid;

            grid-template-columns:
                65px
                1fr
                130px;

            align-items:center;

            gap:15px;

            min-height:70px;

            margin-bottom:8px;

            padding:10px 14px;

            border-radius:12px;

            background:
                rgba(255,255,255,.035);

            border:
                1px solid
                rgba(255,255,255,.05);
        }

        .ranking-row:hover {

            background:
                rgba(80,140,255,.08);
        }

        .ranking-position {

            font-size:22px;

            font-weight:900;

            color:#d9e5f5;

            text-align:center;
        }

        .ranking-player-name {

            color:#fff;

            font-weight:800;

            font-size:16px;

            overflow:hidden;

            text-overflow:ellipsis;

            white-space:nowrap;
        }

        .ranking-details {

            color:#8995a3;

            font-size:12px;

            margin-top:4px;
        }

        .ranking-score {

            color:#6fb3ff;

            font-size:20px;

            font-weight:900;

            text-align:right;
        }

        .ranking-loading,
        .ranking-empty {

            padding:55px 20px;

            text-align:center;

            color:#aab4c0;
        }

        .ranking-empty-icon {

            font-size:42px;

            margin-bottom:12px;
        }

        .ranking-empty strong {

            display:block;

            color:#fff;

            font-size:18px;

            margin-bottom:7px;
        }

        .ranking-empty p {

            margin:0;

            color:#858f9c;

            font-size:13px;
        }

        @media(max-width:600px){

            .ranking-row {

                grid-template-columns:
                    45px
                    1fr
                    95px;

                gap:8px;

                padding:9px;
            }

            .ranking-score {

                font-size:15px;
            }

            .ranking-player-name {

                font-size:14px;
            }

            .ranking-title {

                font-size:21px;
            }
        }
    `;

    document.head.appendChild(
        style
    );
}

/* ============================================================
   INICIALIZAÇÃO FINAL
============================================================ */

loadPlayerName();

initializeSupabase();

injectRankingStyles();

createRankingPanel();

/*
   Garante que o menu original
   apareça inicialmente.
*/

if(hud){

    hud.style.display =
        "none";
}

if(gameInventory){

    gameInventory.style.display =
        "none";
}

if(gameOver){

    gameOver.style.display =
        "none";
}

/*
   O shopScreen NÃO é forçado
   a aparecer se o HTML já decidiu
   sua aparência.

   Apenas renderizamos os itens.
*/

renderInventory();

renderItems();

updateHUD();

/*
   Inicializa a posição do jogador.
*/

if(canvas){

    player.y =
        canvas.height / 2;
}

/*
   Console para confirmar que
   somente este motor está carregado.
*/

console.log(
    "LUDIX — They Are Coming carregado corretamente."
);

console.log(
    "Armas:",
    weapons.length
);

console.log(
    "Ranking:",
    supabaseClient
        ? "conectado"
        : "offline"
);
