"use strict";

/* ============================================================
   THEY ARE COMING — LUDIX
   GAME.JS COMPLETO CORRIGIDO
   ============================================================
   SISTEMA ÚNICO:
   - Menu/loja original
   - Nome do jogador
   - 80+ armas
   - Munições
   - Armaduras
   - Amigos
   - Kits
   - Bombas
   - Armadilhas
   - Barricadas
   - Inventário
   - Ondas
   - Zumbis
   - Ranking global Supabase
   - Game Over
   ============================================================ */


/* ============================================================
   ELEMENTOS HTML
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

const gameOverPanel = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");


/* ============================================================
   CONFIGURAÇÕES
============================================================ */

const MAX_HEALTH_START = 100;
const INVENTORY_SIZE = 5;
const PREPARATION_TIME = 30;

const WORLD_WIDTH_MULTIPLIER = 1;
const ZOMBIE_DAMAGE = 5;


/* ============================================================
   CANVAS
============================================================ */

function resizeCanvas() {

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


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

    {
        name:"Walker",
        health:60,
        speed:45,
        damage:5,
        reward:100,
        icon:"🧟"
    },

    {
        name:"Runner",
        health:45,
        speed:90,
        damage:7,
        reward:150,
        icon:"🧟‍♂️"
    },

    {
        name:"Brute",
        health:180,
        speed:35,
        damage:12,
        reward:300,
        icon:"👹"
    },

    {
        name:"Crawler",
        health:80,
        speed:70,
        damage:8,
        reward:200,
        icon:"🧟"
    },

    {
        name:"Soldier",
        health:130,
        speed:55,
        damage:10,
        reward:250,
        icon:"🪖"
    },

    {
        name:"Mutant",
        health:300,
        speed:45,
        damage:15,
        reward:500,
        icon:"👾"
    },

    {
        name:"Burning",
        health:220,
        speed:60,
        damage:18,
        reward:700,
        icon:"🔥"
    },

    {
        name:"Toxic",
        health:250,
        speed:50,
        damage:20,
        reward:800,
        icon:"☣️"
    },

    {
        name:"Tank",
        health:700,
        speed:25,
        damage:25,
        reward:1500,
        icon:"👹"
    },

    {
        name:"Boss",
        health:2000,
        speed:20,
        damage:35,
        reward:5000,
        icon:"💀"
    }

];


/* ============================================================
   JOGADOR
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
   ESTADO DO JOGO
============================================================ */

let zombies = [];
let bullets = [];

let placedTraps = [];
let placedBarricades = [];

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

let lastFrameTime = 0;

let messageTimer = null;


/* ============================================================
   EFEITOS
============================================================ */

let particles = [];
let explosions = [];

let screenShake = 0;


/* ============================================================
   NOME
============================================================ */

function getPlayerName(){

    if(!playerNameInput){
        return "Jogador";
    }

    return playerNameInput.value
        .trim()
        .replace(/\s+/g," ")
        .slice(0,20);

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

    savePlayerName(name);

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
   MUNIÇÃO
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
        n.includes("raging hunter") ||
        n.includes("revolver")
    ){
        return "Munição de Revólver";
    }

    return "Munição de Pistola";

}


weapons.forEach(
    weapon=>{
        weapon.ammoType = getAmmoType(weapon.name);
    }
);


/* ============================================================
   CLASSE VISUAL DAS ARMAS
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


function weaponSkin(name){

    const hash = [...name]
        .reduce(
            (a,c)=>a+c.charCodeAt(0),
            0
        );

    return {

        accent:`hsl(${hash % 360} 55% 48%)`,

        dark:"#16191b",

        metal:
            hash % 2
                ? "#596168"
                : "#737b82",

        wood:
            hash % 3
                ? "#5b3a25"
                : "#70482d"

    };

}


/* ============================================================
   DESENHO DAS ARMAS
============================================================ */

function drawWeapon(ctx,name,scale=1){

    const kind = weaponClass(name);
    const c = weaponSkin(name);
    const n = name.toLowerCase();

    ctx.save();

    ctx.scale(scale,scale);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.fillStyle = "rgba(0,0,0,.28)";

    ctx.fillRect(
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

        ctx.fillStyle = c.metal;
        ctx.fillRect(18,-7,long,9);

        ctx.fillStyle = c.dark;
        ctx.fillRect(25,2,12,9);

        ctx.fillStyle = c.wood;
        ctx.fillRect(29,8,8,12);

        ctx.fillStyle = "#0b0c0d";
        ctx.fillRect(18,-9,long*.7,3);

        ctx.fillRect(
            18+long-5,
            -5,
            6,
            5
        );

    }


    else if(kind === "smg"){

        const long =
            n.includes("p90")
                ? 47
                : 58;

        ctx.fillStyle = c.metal;
        ctx.fillRect(17,-7,long,9);

        ctx.fillStyle = c.dark;

        ctx.fillRect(24,2,10,8);
        ctx.fillRect(30,8,7,13);

        ctx.fillStyle = "#0b0c0d";

        ctx.fillRect(
            17,
            -10,
            long*.55,
            3
        );

        ctx.fillRect(
            42,
            -1,
            15,
            3
        );

    }


    else if(kind === "shotgun"){

        const double =
            n.includes("double barrel");

        const long =
            double
                ? 62
                : 70;

        ctx.fillStyle = c.metal;

        ctx.fillRect(
            18,
            -8,
            long,
            7
        );

        ctx.fillStyle = c.dark;

        if(double){

            ctx.fillRect(
                18,
                -12,
                long,
                3
            );

            ctx.fillRect(
                27,
                0,
                11,
                9
            );

        }else{

            ctx.fillRect(
                24,
                0,
                12,
                9
            );

        }

        ctx.fillStyle = c.wood;

        ctx.fillRect(
            31,
            7,
            7,
            16
        );

        ctx.fillRect(
            14,
            -3,
            13,
            5
        );

    }


    else if(kind === "rifle"){

        const long =
            n.includes("m249") ||
            n.includes("pkm")
                ? 82
                : 72;

        ctx.fillStyle = c.metal;

        ctx.fillRect(
            18,
            -8,
            long,
            7
        );

        ctx.fillStyle = c.dark;

        ctx.fillRect(
            24,
            0,
            11,
            9
        );

        ctx.fillRect(
            30,
            7,
            7,
            17
        );

        ctx.fillStyle = c.wood;

        ctx.fillRect(
            11,
            -3,
            14,
            5
        );

        ctx.fillStyle = "#0a0b0c";

        ctx.fillRect(
            18,
            -11,
            long*.45,
            3
        );

        if(
            n.includes("ak") ||
            n.includes("galil") ||
            n.includes("rpk")
        ){

            ctx.fillStyle = c.wood;

            ctx.fillRect(
                44,
                0,
                10,
                5
            );

        }

    }


    else if(kind === "sniper"){

        ctx.fillStyle = c.metal;

        ctx.fillRect(
            16,
            -7,
            91,
            6
        );

        ctx.fillStyle = c.dark;

        ctx.fillRect(
            27,
            0,
            12,
            9
        );

        ctx.fillRect(
            31,
            7,
            7,
            16
        );

        ctx.fillStyle = c.wood;

        ctx.fillRect(
            10,
            -3,
            19,
            5
        );

        ctx.fillStyle = "#252a2e";

        ctx.fillRect(
            45,
            -13,
            30,
            5
        );

        ctx.beginPath();
        ctx.arc(49,-10,5,0,Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(72,-10,5,0,Math.PI*2);
        ctx.fill();

    }


    else if(kind === "heavy"){

        ctx.fillStyle = c.metal;

        ctx.fillRect(
            14,
            -9,
            86,
            11
        );

        ctx.fillStyle = c.dark;

        ctx.fillRect(
            25,
            2,
            15,
            12
        );

        ctx.fillRect(
            31,
            13,
            8,
            14
        );

        ctx.fillStyle = c.wood;

        ctx.fillRect(
            8,
            -3,
            18,
            6
        );

        if(n.includes("rpg")){

            ctx.fillStyle = "#4e5b50";

            ctx.fillRect(
                15,
                -14,
                70,
                4
            );

            ctx.fillStyle = "#202629";

            ctx.fillRect(
                80,
                -11,
                14,
                8
            );

        }

        else if(n.includes("minigun")){

            ctx.fillStyle = "#444a4e";

            for(let i=0;i<5;i++){

                ctx.fillRect(
                    55+i*7,
                    -4,
                    4,
                    27
                );

            }

        }

    }


    else{

        ctx.fillStyle = c.dark;

        ctx.fillRect(
            15,
            -9,
            82,
            10
        );

        ctx.fillStyle = c.accent;

        ctx.fillRect(
            30,
            -5,
            52,
            4
        );

        ctx.fillRect(
            55,
            -13,
            22,
            4
        );

        ctx.fillStyle = "#b9f4ff";

        ctx.fillRect(
            80,
            -6,
            20,
            5
        );

        ctx.fillStyle = "#30373b";

        ctx.fillRect(
            24,
            1,
            13,
            11
        );

        ctx.fillRect(
            31,
            9,
            7,
            14
        );

        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 2;

        ctx.strokeRect(
            46,
            -15,
            28,
            5
        );

    }

    ctx.restore();

}


/* ============================================================
   VISUAL DE ITENS
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
            <small>
                Depois de comprar: T vende por 50%
            </small>
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

            return `
                Vida máxima +${item.permanentHealth}
                permanentemente
            `;

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


/* ============================================================
   CATEGORIAS
============================================================ */

function getCategoryItems(){

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


function selectCategory(category){

    if(!category) return;

    currentCategory =
        String(category)
            .toLowerCase();

    renderItems();

}


window.selectCategory = selectCategory;
window.setCategory = selectCategory;
window.changeCategory = selectCategory;


/* ============================================================
   RENDERIZAR LOJA ORIGINAL
============================================================ */

function renderItems(){

    if(!shopContent) return;

    shopContent.innerHTML = "";

    if(currentCategory === "municao"){

        shopContent.innerHTML = `

            <div class="shop-item">

                <div class="item-visual">
                    📦
                </div>

                <h3>
                    Munição +30
                </h3>

                <p>
                    Adiciona 30 munições
                    para a arma atual.
                </p>

                <strong>
                    $150
                </strong>

                <button
                    onclick="buyAmmo()"
                >
                    COMPRAR
                </button>

            </div>

        `;

        return;
    }


    const items = getCategoryItems();


    items.forEach(
        (item,index)=>{

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
                    onclick="buyItem(${index})"
                >
                    COMPRAR
                </button>

            `;

            shopContent.appendChild(card);

        }
    );

}


/* ============================================================
   COMPRAR ITEM
============================================================ */

window.buyItem = function(index){

    const items =
        getCategoryItems();

    const item =
        items[index];

    if(!item) return;


    if(player.money < item.price){

        showMessage(
            "Dinheiro insuficiente!"
        );

        return;
    }


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

        showMessage(
            item.name + " adquirida!"
        );

        return;
    }


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


    if(currentCategory === "bombas"){

        if(
            !addInventory({
                type:"bomb",
                item:item
            })
        ){

            showMessage(
                "Inventário cheio!"
            );

            return;
        }

        player.money -= item.price;

        renderInventory();
        renderItems();

        return;
    }


    if(currentCategory === "armadilhas"){

        if(
            !addInventory({
                type:"trap",
                item:item
            })
        ){

            showMessage(
                "Inventário cheio!"
            );

            return;
        }

        player.money -= item.price;

        renderInventory();
        renderItems();

        return;
    }


    if(currentCategory === "barricadas"){

        if(
            !addInventory({
                type:"barricade",
                item:item
            })
        ){

            showMessage(
                "Inventário cheio!"
            );

            return;
        }

        player.money -= item.price;

        renderInventory();
        renderItems();

        return;
    }

};


/* ============================================================
   COMPRAR MUNIÇÃO
============================================================ */

window.buyAmmo = function(){

    const price = 150;

    if(player.money < price){

        showMessage(
            "Dinheiro insuficiente!"
        );

        return;
    }

    player.money -= price;

    player.reserveAmmo += 30;

    updateHUD();

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

        showMessage(
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


    if(!confirmed) return;


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


    for(
        let i=0;
        i<INVENTORY_SIZE;
        i++
    ){

        const menuSlot =
            document.createElement("div");

        menuSlot.className =
            "inventory-slot";


        const gameSlot =
            document.createElement("div");

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


/* ============================================================
   USAR INVENTÁRIO
============================================================ */

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


    else if(item.type === "trap"){

        if(placeTrap(item.item)){
            inventory.splice(
                index,
                1
            );
        }

    }


    else if(item.type === "barricade"){

        if(placeBarricade(item.item)){
            inventory.splice(
                index,
                1
            );
        }

    }


    renderInventory();

}


window.useInventory =
    useInventory;


/* ============================================================
   USAR ITEM COM E
============================================================ */

function usePlacementItem(){

    if(inventory.length > 0){
        useInventory(0);
    }

}


/* ============================================================
   INICIAR JOGO
============================================================ */

function startWave(){

    if(gameEnded){
        return;
    }

    if(!validatePlayerName()){
        return;
    }


    if(!gameRunning){

        gameRunning = true;

        gameEnded = false;

        player.health =
            player.maxHealth;

        player.armor = 0;

        player.money = 500;

        player.score = 0;

        player.kills = 0;

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

        player.x = 180;

        player.y =
            canvas.height / 2;

        zombies = [];
        bullets = [];

        placedTraps = [];
        placedBarricades = [];

        inventory = [];

        friend = null;

        wave = 1;

        rankingSent = false;

    }


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


    preparation = true;

    waveActive = false;

    preparationTime =
        PREPARATION_TIME;


    renderInventory();
    updateHUD();

    lastFrameTime = 0;

    requestAnimationFrame(
        gameLoop
    );

}


if(startWaveBtn){

    startWaveBtn.addEventListener(
        "click",
        startWave
    );

}


/* ============================================================
   PREPARAÇÃO
============================================================ */

function updatePreparation(dt){

    if(!preparation){
        return;
    }

    preparationTime -= dt;


    if(preparationTime <= 0){

        preparationTime = 0;

        preparation = false;

        waveActive = true;

        spawnWave();

    }

}


/* ============================================================
   SPAWN DA ONDA
============================================================ */

function spawnWave(){

    zombies = [];

    const amount =
        5 +
        wave * 3;


    for(
        let i=0;
        i<amount;
        i++
    ){

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
                Math.random() *
                250,

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

            speed:
                type.speed +
                wave * 0.7,

            damage:
                type.damage +
                Math.floor(
                    wave / 4
                ),

            reward:
                type.reward +
                wave * 10,

            type:type.name,

            icon:type.icon,

            attackCooldown:0,

            hitFlash:0

        });

    }

    updateHUD();

}


/* ============================================================
   JOGADOR
============================================================ */

function updatePlayer(dt){

    if(!gameRunning || gameEnded){
        return;
    }

    let dx = 0;
    let dy = 0;


    if(
        keys["w"] ||
        keys["arrowup"]
    ){
        dy -= 1;
    }

    if(
        keys["s"] ||
        keys["arrowdown"]
    ){
        dy += 1;
    }

    if(
        keys["a"] ||
        keys["arrowleft"]
    ){
        dx -= 1;
    }

    if(
        keys["d"] ||
        keys["arrowright"]
    ){
        dx += 1;
    }


    if(dx !== 0 || dy !== 0){

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
   TIRO
============================================================ */

function shoot(){

    if(!waveActive){
        return;
    }

    const now =
        performance.now();


    if(
        now -
        player.lastShot <
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
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );


    const weaponName =
        player.weapon.name;


    const kind =
        weaponClass(
            weaponName
        );


    let bulletSpeed =
        1000;


    if(kind === "heavy"){
        bulletSpeed = 650;
    }

    if(kind === "sniper"){
        bulletSpeed = 1500;
    }

    if(kind === "energy"){
        bulletSpeed = 1200;
    }


    const damage =
        player.weapon.damage;


    const pellets =
        kind === "shotgun"
            ? 6
            : 1;


    for(
        let i=0;
        i<pellets;
        i++
    ){

        let finalAngle =
            angle;


        if(pellets > 1){

            finalAngle +=
                (
                    Math.random() -
                    0.5
                ) *
                0.45;

        }


        bullets.push({

            x:player.x,
            y:player.y,

            vx:
                Math.cos(finalAngle) *
                bulletSpeed,

            vy:
                Math.sin(finalAngle) *
                bulletSpeed,

            damage:
                pellets > 1
                    ? damage / 2
                    : damage,

            life:
                player.weapon.range /
                bulletSpeed,

            size:
                kind === "energy"
                    ? 4
                    : kind === "heavy"
                        ? 5
                        : 3,

            color:
                kind === "energy"
                    ? "#62e8ff"
                    : kind === "heavy"
                        ? "#ff8a32"
                        : "#ffd34d"

        });

    }


    if(
        weaponName === "RPG" ||
        weaponName === "Grenade Launcher" ||
        weaponName === "Heavy Cannon" ||
        weaponName === "Doom Cannon"
    ){

        createExplosionEffect(
            player.x,
            player.y,
            30
        );

    }


    updateHUD();

}


/* ============================================================
   RECARREGAR
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

    player.reloadTime =
        1.3;

}


function updateReload(dt){

    if(player.reloadTime <= 0){
        return;
    }


    player.reloadTime -= dt;


    if(player.reloadTime <= 0){

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


/* ============================================================
   BALAS
============================================================ */

function updateBullets(dt){

    for(
        let i=bullets.length-1;
        i>=0;
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


        for(
            let j=zombies.length-1;
            j>=0;
            j--
        ){

            const zombie =
                zombies[j];


            const distance =
                Math.hypot(
                    bullet.x - zombie.x,
                    bullet.y - zombie.y
                );


            if(distance < 32){

                zombie.health -=
                    bullet.damage;

                zombie.hitFlash =
                    0.08;

                hit = true;


                if(
                    zombie.health <= 0
                ){

                    killZombie(
                        zombie
                    );

                }


                break;

            }

        }


        if(
            hit ||
            bullet.life <= 0 ||
            bullet.x < -100 ||
            bullet.x >
                canvas.width + 100 ||
            bullet.y < -100 ||
            bullet.y >
                canvas.height + 100
        ){

            bullets.splice(
                i,
                1
            );

        }

    }

}


/* ============================================================
   MATAR ZUMBI
============================================================ */

function killZombie(zombie){

    const index =
        zombies.indexOf(
            zombie
        );


    if(index === -1){
        return;
    }


    player.money +=
        zombie.reward;

    player.score +=
        zombie.reward;

    player.kills++;


    createBlood(
        zombie.x,
        zombie.y
    );


    zombies.splice(
        index,
        1
    );


    updateHUD();

}


/* ============================================================
   ZUMBIS
============================================================ */

function updateZombies(dt){

    for(
        let i=zombies.length-1;
        i>=0;
        i--
    ){

        const z =
            zombies[i];


        if(z.hitFlash > 0){
            z.hitFlash -= dt;
        }


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


        if(distance > 55){

            z.x +=
                (
                    dx /
                    Math.max(
                        distance,
                        1
                    )
                ) *
                z.speed *
                dt;


            z.y +=
                (
                    dy /
                    Math.max(
                        distance,
                        1
                    )
                ) *
                z.speed *
                dt;

        }else{

            z.attackCooldown -=
                dt;


            if(
                z.attackCooldown <= 0
            ){

                damagePlayer(
                    z.damage
                );

                z.attackCooldown =
                    0.8;

            }

        }

    }


    updateFriend();

}


/* ============================================================
   AMIGO
============================================================ */

function updateFriend(){

    if(!friend){
        return;
    }


    if(
        !zombies.length
    ){
        return;
    }


    let nearest = null;

    let nearestDistance =
        Infinity;


    for(
        const zombie of zombies
    ){

        const distance =
            Math.hypot(
                zombie.x - player.x,
                zombie.y - player.y
            );


        if(
            distance <
            nearestDistance
        ){

            nearest =
                zombie;

            nearestDistance =
                distance;

        }

    }


    if(
        !nearest ||
        nearestDistance > 500
    ){
        return;
    }


    const now =
        performance.now();


    if(
        now -
        friend.lastAttack <
        700
    ){
        return;
    }


    nearest.health -=
        friend.damage;

    friend.lastAttack =
        now;


    if(
        nearest.health <= 0
    ){

        killZombie(
            nearest
        );

    }

}


/* ============================================================
   DANO NO JOGADOR
============================================================ */

function damagePlayer(amount){

    if(gameEnded){
        return;
    }


    let remaining =
        amount;


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
   BOMBA
============================================================ */

function useBomb(bomb){

    if(
        !waveActive &&
        !preparation
    ){
        return;
    }


    const x =
        player.x;

    const y =
        player.y;


    for(
        let i=zombies.length-1;
        i>=0;
        i--
    ){

        const z =
            zombies[i];


        const distance =
            Math.hypot(
                z.x - x,
                z.y - y
            );


        if(
            distance <=
            bomb.radius
        ){

            z.health -=
                bomb.damage;


            if(
                z.health <= 0
            ){

                killZombie(
                    z
                );

            }

        }

    }


    explosions.push({

        x:x,
        y:y,

        radius:10,

        maxRadius:
            bomb.radius,

        life:0.5

    });


    updateHUD();

}


/* ============================================================
   ARMADILHAS
============================================================ */

function placeTrap(trap){

    if(!preparation){

        showMessage(
            "Armadilhas só podem ser colocadas durante os 30 segundos de preparação!"
        );

        return false;
    }


    placedTraps.push({

        x:player.x,
        y:player.y,

        damage:trap.damage,

        radius:35,

        active:true

    });


    return true;

}


function updateTraps(){

    for(
        const trap of placedTraps
    ){

        if(!trap.active){
            continue;
        }


        for(
            let i=zombies.length-1;
            i>=0;
            i--
        ){

            const z =
                zombies[i];


            const distance =
                Math.hypot(
                    z.x - trap.x,
                    z.y - trap.y
                );


            if(
                distance <
                trap.radius
            ){

                z.health -=
                    trap.damage;

                trap.active =
                    false;


                if(
                    z.health <= 0
                ){

                    killZombie(
                        z
                    );

                }


                break;

            }

        }

    }


    placedTraps =
        placedTraps.filter(
            trap =>
                trap.active
        );

}


/* ============================================================
   BARRICADAS
============================================================ */

function placeBarricade(barricade){

    if(!preparation){

        showMessage(
            "Barricadas só podem ser colocadas durante os 30 segundos de preparação!"
        );

        return false;
    }


    placedBarricades.push({

        x:player.x,

        y:player.y,

        width:80,

        height:30,

        health:barricade.health,

        maxHealth:barricade.health

    });


    return true;

}


/* ============================================================
   BARRICADAS CONTRA ZUMBIS
============================================================ */

function updateBarricades(dt){

    for(
        const barricade of placedBarricades
    ){

        for(
            const zombie of zombies
        ){

            const distance =
                Math.hypot(
                    zombie.x -
                    barricade.x,

                    zombie.y -
                    barricade.y
                );


            if(distance < 55){

                barricade.health -=
                    zombie.damage *
                    dt;

                zombie.x +=
                    zombie.x >
                    barricade.x
                        ? 0.5
                        : -0.5;

            }

        }

    }


    placedBarricades =
        placedBarricades.filter(
            barricade =>
                barricade.health > 0
        );

}


/* ============================================================
   ONDAS
============================================================ */

function updateWave(){

    if(!waveActive){
        return;
    }


    if(
        zombies.length === 0
    ){

        finishWave();

    }

}


/* ============================================================
   TERMINAR ONDA
============================================================ */

function finishWave(){

    if(!waveActive){
        return;
    }


    waveActive = false;


    player.money +=
        50 +
        wave * 15;


    player.score +=
        wave * 100;


    showMessage(
        `ONDA ${wave} COMPLETA!`
    );


    updateHUD();


    setTimeout(
        ()=>{

            if(
                !gameRunning ||
                gameEnded
            ){
                return;
            }


            wave++;


            preparation = true;

            preparationTime =
                PREPARATION_TIME;


            if(shopScreen){

                shopScreen.style.display =
                    "block";

            }


            if(gameInventory){

                gameInventory.style.display =
                    "none";

            }


            updateHUD();


        },
        900
    );

}


/* ============================================================
   EFEITOS
============================================================ */

function createBlood(x,y){

    for(
        let i=0;
        i<8;
        i++
    ){

        particles.push({

            x:x,
            y:y,

            vx:
                (Math.random()-0.5) *
                150,

            vy:
                (Math.random()-0.5) *
                150,

            life:
                0.4 +
                Math.random()*0.4,

            size:
                2 +
                Math.random()*4

        });

    }

}


function createExplosionEffect(
    x,
    y,
    radius
){

    explosions.push({

        x:x,
        y:y,

        radius:10,

        maxRadius:radius,

        life:0.35

    });

}


function updateEffects(dt){

    for(
        let i=particles.length-1;
        i>=0;
        i--
    ){

        const p =
            particles[i];


        p.x +=
            p.vx *
            dt;

        p.y +=
            p.vy *
            dt;


        p.life -=
            dt;


        if(
            p.life <= 0
        ){

            particles.splice(
                i,
                1
            );

        }

    }


    for(
        let i=explosions.length-1;
        i>=0;
        i--
    ){

        const e =
            explosions[i];


        e.radius +=
            (
                e.maxRadius -
                e.radius
            ) *
            0.25;


        e.life -=
            dt;


        if(
            e.life <= 0
        ){

            explosions.splice(
                i,
                1
            );

        }

    }

}


/* ============================================================
   DESENHAR CENÁRIO
============================================================ */

function drawWorld(){

    if(!ctx || !canvas){
        return;
    }


    ctx.fillStyle =
        "#101419";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* chão */

    ctx.fillStyle =
        "#1a2025";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* grade */

    const gridSize =
        70;


    ctx.strokeStyle =
        "rgba(255,255,255,.035)";

    ctx.lineWidth = 1;


    for(
        let x=0;
        x<canvas.width;
        x+=gridSize
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
        let y=0;
        y<canvas.height;
        y+=gridSize
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


    /* manchas do chão */

    for(
        let i=0;
        i<35;
        i++
    ){

        const x =
            (i * 137) %
            canvas.width;

        const y =
            (i * 83) %
            canvas.height;


        ctx.fillStyle =
            "rgba(0,0,0,.12)";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            20 + (i%5)*8,
            0,
            Math.PI*2
        );

        ctx.fill();

    }


    /* bordas */

    ctx.strokeStyle =
        "rgba(255,255,255,.08)";

    ctx.lineWidth = 4;

    ctx.strokeRect(
        10,
        10,
        canvas.width-20,
        canvas.height-20
    );

}


/* ============================================================
   DESENHAR BARRICADAS
============================================================ */

function drawBarricades(){

    for(
        const b of placedBarricades
    ){

        const percent =
            Math.max(
                0,
                b.health /
                b.maxHealth
            );


        ctx.save();

        ctx.translate(
            b.x,
            b.y
        );


        ctx.fillStyle =
            "#70482d";


        ctx.fillRect(
            -b.width/2,
            -b.height/2,
            b.width,
            b.height
        );


        ctx.strokeStyle =
            "#1b1b1b";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            -b.width/2,
            -b.height/2,
            b.width,
            b.height
        );


        ctx.fillStyle =
            "#202020";

        ctx.fillRect(
            -40,
            -24,
            80,
            5
        );


        ctx.fillStyle =
            "#40d060";

        ctx.fillRect(
            -40,
            -24,
            80 * percent,
            5
        );


        ctx.restore();

    }

}


/* ============================================================
   DESENHAR ARMADILHAS
============================================================ */

function drawTraps(){

    for(
        const trap of placedTraps
    ){

        ctx.save();

        ctx.translate(
            trap.x,
            trap.y
        );


        ctx.fillStyle =
            "#252525";


        ctx.strokeStyle =
            "#aeb4ba";

        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.arc(
            0,
            0,
            18,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.stroke();


        ctx.strokeStyle =
            "#e74c3c";

        ctx.beginPath();

        ctx.moveTo(
            -12,
            -12
        );

        ctx.lineTo(
            12,
            12
        );

        ctx.moveTo(
            12,
            -12
        );

        ctx.lineTo(
            -12,
            12
        );

        ctx.stroke();


        ctx.restore();

    }

}


/* ============================================================
   DESENHAR JOGADOR
============================================================ */

function drawPlayer(){

    if(!ctx) return;


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


    ctx.rotate(
        angle
    );


    /* sombra */

    ctx.fillStyle =
        "rgba(0,0,0,.3)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        22,
        22,
        8,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* corpo */

    ctx.fillStyle =
        "#247cff";

    ctx.fillRect(
        -16,
        -24,
        32,
        48
    );


    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        -16,
        -24,
        32,
        48
    );


    /* cabeça */

    ctx.fillStyle =
        "#f0b27a";

    ctx.beginPath();

    ctx.arc(
        0,
        -29,
        10,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* arma */

    ctx.translate(
        10,
        0
    );


    drawWeapon(
        ctx,
        player.weapon.name,
        0.75
    );


    ctx.restore();

}


/* ============================================================
   DESENHAR ZUMBI
============================================================ */

function drawZombie(zombie){

    if(!zombie) return;


    ctx.save();

    ctx.translate(
        zombie.x,
        zombie.y
    );


    let color =
        "#65a34a";


    if(
        zombie.type === "Runner"
    ){
        color =
            "#d5a33d";
    }


    if(
        zombie.type === "Brute"
    ){
        color =
            "#803f3f";
    }


    if(
        zombie.type === "Crawler"
    ){
        color =
            "#7350a8";
    }


    if(
        zombie.type === "Soldier"
    ){
        color =
            "#667078";
    }


    if(
        zombie.type === "Mutant"
    ){
        color =
            "#8c42a8";
    }


    if(
        zombie.type === "Burning"
    ){
        color =
            "#e05b27";
    }


    if(
        zombie.type === "Toxic"
    ){
        color =
            "#5ab84b";
    }


    if(
        zombie.type === "Tank"
    ){
        color =
            "#6b4141";
    }


    if(
        zombie.type === "Boss"
    ){
        color =
            "#442d55";
    }


    if(
        zombie.hitFlash > 0
    ){
        color =
            "#ffffff";
    }


    /* corpo */

    ctx.fillStyle =
        color;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        24,
        0,
        Math.PI*2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#161616";

    ctx.lineWidth = 3;

    ctx.stroke();


    /* olhos */

    ctx.fillStyle =
        "#ff3333";


    ctx.beginPath();

    ctx.arc(
        -7,
        -5,
        3,
        0,
        Math.PI*2
    );

    ctx.arc(
        7,
        -5,
        3,
        0,
        Math.PI*2
    );

    ctx.fill();


    /* barra de vida */

    const barWidth =
        50;


    const hpPercent =
        Math.max(
            0,
            Math.min(
                1,
                zombie.health /
                zombie.maxHealth
            )
        );


    ctx.fillStyle =
        "#181818";

    ctx.fillRect(
        -25,
        -38,
        50,
        5
    );


    ctx.fillStyle =
        "#35d05f";

    ctx.fillRect(
        -25,
        -38,
        barWidth *
        hpPercent,
        5
    );


    ctx.restore();

}


/* ============================================================
   BALAS
============================================================ */

function drawBullets(){

    for(
        const bullet of bullets
    ){

        ctx.fillStyle =
            bullet.color;


        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

}


/* ============================================================
   PARTÍCULAS
============================================================ */

function drawParticles(){

    for(
        const particle of particles
    ){

        ctx.save();

        ctx.globalAlpha =
            Math.max(
                0,
                Math.min(
                    1,
                    particle.life
                )
            );


        ctx.fillStyle =
            "#b51f28";


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI*2
        );

        ctx.fill();


        ctx.restore();

    }

}


/* ============================================================
   EXPLOSÕES
============================================================ */

function drawExplosions(){

    for(
        const explosion of explosions
    ){

        ctx.save();

        ctx.globalAlpha =
            Math.max(
                0,
                explosion.life /
                0.35
            );


        ctx.strokeStyle =
            "#ff9d00";

        ctx.lineWidth = 6;


        ctx.beginPath();

        ctx.arc(
            explosion.x,
            explosion.y,
            explosion.radius,
            0,
            Math.PI*2
        );

        ctx.stroke();


        ctx.fillStyle =
            "rgba(255,80,0,.12)";


        ctx.fill();


        ctx.restore();

    }

}


/* ============================================================
   MIRA
============================================================ */

function drawCrosshair(){

    if(!gameRunning){
        return;
    }


    ctx.save();


    ctx.strokeStyle =
        "rgba(255,255,255,.9)";

    ctx.lineWidth = 2;


    ctx.beginPath();


    ctx.moveTo(
        mouse.x-8,
        mouse.y
    );

    ctx.lineTo(
        mouse.x+8,
        mouse.y
    );


    ctx.moveTo(
        mouse.x,
        mouse.y-8
    );

    ctx.lineTo(
        mouse.x,
        mouse.y+8
    );


    ctx.stroke();


    ctx.restore();

}


/* ============================================================
   HUD
============================================================ */

function updateHUD(){

    if(
        healthBar
    ){

        const percent =
            Math.max(
                0,
                Math.min(
                    100,
                    (
                        player.health /
                        player.maxHealth
                    ) *
                    100
                )
            );


        healthBar.style.width =
            percent + "%";

    }


    if(
        armorBar
    ){

        const percent =
            player.maxArmor > 0
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            player.armor /
                            player.maxArmor
                        ) *
                        100
                    )
                )
                : 0;


        armorBar.style.width =
            percent + "%";

    }


    if(nameHud){

        nameHud.textContent =
            getPlayerName() ||
            playerName ||
            "Jogador";

    }


    if(waveEl){

        waveEl.textContent =
            wave;

    }


    if(enemiesEl){

        enemiesEl.textContent =
            zombies.length;

    }


    if(moneyEl){

        moneyEl.textContent =
            "$" +
            Math.floor(
                player.money
            );

    }


    if(moneyHud){

        moneyHud.textContent =
            "$" +
            Math.floor(
                player.money
            );

    }


    if(weaponEl){

        weaponEl.textContent =
            player.weapon
                ? player.weapon.name
                : "Pistola";

    }


    if(ammoEl){

        ammoEl.textContent =
            (
                player.ammo || 0
            ) +
            " / " +
            (
                player.reserveAmmo || 0
            );

    }


    const healthNumber =
        document.getElementById(
            "health"
        );


    if(healthNumber){

        healthNumber.textContent =
            Math.ceil(
                player.health
            );

    }


    const scoreEl =
        document.getElementById(
            "score"
        );


    if(scoreEl){

        scoreEl.textContent =
            player.score;

    }


    renderInventory();

}


/* ============================================================
   MENSAGEM
============================================================ */

function showMessage(text){

    let box =
        document.getElementById(
            "gameMessage"
        );


    if(!box){

        box =
            document.createElement(
                "div"
            );


        box.id =
            "gameMessage";


        box.style.position =
            "fixed";

        box.style.left =
            "50%";

        box.style.top =
            "18%";

        box.style.transform =
            "translateX(-50%)";

        box.style.zIndex =
            "999999";

        box.style.padding =
            "12px 22px";

        box.style.borderRadius =
            "12px";

        box.style.background =
            "rgba(10,10,10,.9)";

        box.style.color =
            "#fff";

        box.style.fontWeight =
            "800";

        box.style.pointerEvents =
            "none";

        box.style.opacity =
            "0";

        box.style.transition =
            "opacity .2s";


        document.body.appendChild(
            box
        );

    }


    box.textContent =
        text;


    box.style.opacity =
        "1";


    clearTimeout(
        messageTimer
    );


    messageTimer =
        setTimeout(
            ()=>{
                box.style.opacity =
                    "0";
            },
            1800
        );

}


/* ============================================================
   DESENHAR JOGO
============================================================ */

function drawGame(){

    if(!ctx){
        return;
    }


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawWorld();

    drawBarricades();

    drawTraps();


    for(
        const zombie of zombies
    ){

        drawZombie(
            zombie
        );

    }


    drawBullets();

    drawParticles();

    drawExplosions();

    drawPlayer();

    drawCrosshair();


    /* contador de preparação */

    if(
        preparation &&
        gameRunning
    ){

        ctx.save();


        ctx.fillStyle =
            "rgba(0,0,0,.55)";


        ctx.fillRect(
            canvas.width/2 - 170,
            20,
            340,
            58
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 22px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            `PREPARAÇÃO: ${Math.ceil(preparationTime)}s`,
            canvas.width/2,
            56
        );


        ctx.restore();

    }

}


/* ============================================================
   LOOP PRINCIPAL
============================================================ */

function gameLoop(timestamp){

    if(!gameRunning){
        return;
    }


    if(!lastFrameTime){

        lastFrameTime =
            timestamp;

    }


    let dt =
        (
            timestamp -
            lastFrameTime
        ) /
        1000;


    lastFrameTime =
        timestamp;


    if(dt > 0.05){
        dt = 0.05;
    }


    updatePreparation(dt);

    updateReload(dt);

    updatePlayer(dt);

    updateBullets(dt);

    updateZombies(dt);

    updateTraps();

    updateBarricades(dt);

    updateWave();

    updateEffects(dt);

    updateHUD();

    drawGame();


    if(gameRunning){

        requestAnimationFrame(
            gameLoop
        );

    }

}


/* ============================================================
   GAME OVER
============================================================ */

function endGame(){

    if(gameEnded){
        return;
    }


    gameEnded = true;

    gameRunning = false;

    waveActive = false;

    preparation = false;


    saveAllScores();


    if(gameOverPanel){

        gameOverPanel.style.display =
            "flex";

        gameOverPanel.classList.add(
            "active"
        );

    }


    if(finalScore){

        finalScore.textContent =
            player.score;

    }


    if(hud){

        hud.style.display =
            "none";

    }


    if(gameInventory){

        gameInventory.style.display =
            "none";

    }


    showMessage(
        "FIM DE JOGO"
    );


    setTimeout(
        ()=>{
            loadGlobalRanking();
        },
        500
    );

}


/* ============================================================
   REINICIAR
============================================================ */

function restartGame(){

    if(gameOverPanel){

        gameOverPanel.style.display =
            "none";

        gameOverPanel.classList.remove(
            "active"
        );

    }


    gameEnded = false;

    rankingSent = false;

    gameRunning = true;

    wave = 1;

    waveActive = false;

    preparation = true;

    preparationTime =
        PREPARATION_TIME;


    player.x =
        180;

    player.y =
        canvas.height /
        2;


    player.health =
        player.maxHealth;


    player.armor = 0;

    player.money = 500;

    player.score = 0;

    player.kills = 0;


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


    zombies = [];
    bullets = [];

    placedTraps = [];
    placedBarricades = [];

    inventory = [];

    friend = null;


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


    renderInventory();

    updateHUD();


    lastFrameTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


if(restartBtn){

    restartBtn.addEventListener(
        "click",
        restartGame
    );

}


/* ============================================================
   TECLADO
============================================================ */

window.addEventListener(
    "keydown",
    event=>{

        keys[
            event.key.toLowerCase()
        ] = true;


        if(
            event.code ===
            "Space"
        ){

            event.preventDefault();

            if(gameRunning){
                shoot();
            }

        }


        if(
            event.key.toLowerCase() ===
            "r"
        ){

            if(gameRunning){
                reload();
            }

        }


        if(
            ["1","2","3","4","5"]
                .includes(event.key)
        ){

            useInventory(
                Number(event.key)-1
            );

        }


        if(
            event.key.toLowerCase() ===
            "e"
        ){

            usePlacementItem();

        }


        if(
            event.key.toLowerCase() ===
            "t"
        ){

            if(
                shopScreen &&
                shopScreen.style.display !==
                "none"
            ){

                sellSelectedWeapon();

            }

        }


        if(
            event.key ===
            "Escape"
        ){

            closeRanking();

        }

    }
);


window.addEventListener(
    "keyup",
    event=>{

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
        event=>{

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
        event=>{

            if(
                event.button === 0 &&
                gameRunning
            ){

                mouse.down = true;

                shoot();

            }

        }
    );


    canvas.addEventListener(
        "mouseup",
        event=>{

            if(
                event.button === 0
            ){

                mouse.down = false;

            }

        }
    );


    canvas.addEventListener(
        "mouseleave",
        ()=>{
            mouse.down = false;
        }
    );


    canvas.addEventListener(
        "contextmenu",
        event=>{
            event.preventDefault();
        }
    );

}


/* ============================================================
   TIRO AUTOMÁTICO
============================================================ */

setInterval(
    ()=>{

        if(
            gameRunning &&
            mouse.down
        ){

            shoot();

        }

    },
    35
);


/* ============================================================
   SUPABASE / RANKING
============================================================ */

const SUPABASE_URL =
    window.SUPABASE_URL ||
    "";

const SUPABASE_ANON_KEY =
    window.SUPABASE_ANON_KEY ||
    "";

let supabaseClient = null;

let playerName = "";

let rankingRefreshTimer = null;


/* ============================================================
   SUPABASE
============================================================ */

function initializeSupabase(){

    if(
        typeof window.supabase ===
        "undefined"
    ){

        console.warn(
            "Supabase não encontrado."
        );

        return false;

    }


    if(
        !SUPABASE_URL ||
        !SUPABASE_ANON_KEY
    ){

        console.warn(
            "Supabase não configurado."
        );

        return false;

    }


    try{

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        return true;

    }catch(error){

        console.error(
            "Erro no Supabase:",
            error
        );

        return false;

    }

}


/* ============================================================
   NOME SALVO
============================================================ */

function loadPlayerName(){

    try{

        playerName =
            localStorage.getItem(
                "ludix_player_name"
            ) || "";


        if(
            playerNameInput &&
            playerName
        ){

            playerNameInput.value =
                playerName;

        }

    }catch(error){

        playerName = "";

    }

}


function savePlayerName(name){

    playerName =
        String(name || "")
            .trim()
            .replace(/\s+/g," ")
            .slice(0,20);


    if(!playerName){

        playerName =
            "Jogador";

    }


    try{

        localStorage.setItem(
            "ludix_player_name",
            playerName
        );

    }catch(error){}


    if(
        playerNameInput &&
        playerName !== "Jogador"
    ){

        playerNameInput.value =
            playerName;

    }


    return playerName;

}


/* ============================================================
   ESCAPAR HTML
============================================================ */

function escapeHTML(value){

    return String(
        value ?? ""
    )
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
   SALVAR SCORE
============================================================ */

async function saveScore(){

    if(rankingSent){
        return;
    }


    if(!player){
        return;
    }


    if(!playerName){
        loadPlayerName();
    }


    if(!playerName){

        playerName =
            getPlayerName();

    }


    if(!playerName){
        return;
    }


    if(!supabaseClient){

        initializeSupabase();

    }


    if(!supabaseClient){
        return;
    }


    if(
        Number(player.score) <= 0
    ){
        return;
    }


    rankingSent = true;


    const data = {

        player_name:
            playerName,

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

        const result =
            await supabaseClient
                .from(
                    "they_are_coming_scores"
                )
                .insert([
                    data
                ]);


        if(result.error){

            rankingSent = false;

            console.error(
                "Erro ao salvar ranking:",
                result.error
            );

            return;

        }


        console.log(
            "Score enviado para o ranking."
        );


    }catch(error){

        rankingSent = false;

        console.error(
            "Erro no ranking:",
            error
        );

    }

}


/* ============================================================
   RANKING GLOBAL
============================================================ */

async function loadGlobalRanking(){

    let container =
        rankingContent;


    if(!container){

        container =
            document.getElementById(
                "globalRanking"
            );

    }


    if(!container){
        return;
    }


    if(!supabaseClient){

        initializeSupabase();

    }


    if(!supabaseClient){

        container.innerHTML = `
            <div class="ranking-empty">
                Ranking global indisponível.
            </div>
        `;

        return;

    }


    container.innerHTML = `
        <div class="ranking-loading">
            Carregando ranking...
        </div>
    `;


    try{

        const result =
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


        if(result.error){

            console.error(
                "Erro ao carregar ranking:",
                result.error
            );


            container.innerHTML = `
                <div class="ranking-empty">
                    Erro ao carregar ranking.
                </div>
            `;

            return;

        }


        renderGlobalRanking(
            result.data || []
        );


    }catch(error){

        console.error(
            error
        );


        container.innerHTML = `
            <div class="ranking-empty">
                Erro de conexão.
            </div>
        `;

    }

}


/* ============================================================
   RENDER RANKING
============================================================ */

function renderGlobalRanking(scores){

    let container =
        rankingContent;


    if(!container){

        container =
            document.getElementById(
                "globalRanking"
            );

    }


    if(!container){
        return;
    }


    if(
        !scores ||
        scores.length === 0
    ){

        container.innerHTML = `
            <div class="ranking-empty">
                Ainda não existem pontuações.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    scores.forEach(
        (item,index)=>{

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "ranking-row";


            let position =
                index + 1;


            if(index === 0){
                position = "🥇";
            }

            if(index === 1){
                position = "🥈";
            }

            if(index === 2){
                position = "🥉";
            }


            row.innerHTML = `

                <div class="ranking-position">
                    ${position}
                </div>

                <div class="ranking-player">

                    <strong>
                        ${escapeHTML(
                            item.player_name
                        )}
                    </strong>

                    <span>
                        Onda
                        ${Number(
                            item.wave || 0
                        )}
                        ·
                        ${Number(
                            item.kills || 0
                        )}
                        eliminações
                    </span>

                </div>

                <div class="ranking-score">

                    ${Number(
                        item.score || 0
                    ).toLocaleString(
                        "pt-BR"
                    )}

                </div>

            `;


            container.appendChild(
                row
            );

        }
    );

}


/* ============================================================
   ABRIR RANKING
============================================================ */

function openRanking(){

    if(rankingScreen){

        rankingScreen.style.display =
            "flex";

        rankingScreen.classList.add(
            "active"
        );


        if(rankingContent){

            loadGlobalRanking();

        }

        return;

    }


    loadGlobalRanking();

}


function closeRanking(){

    if(rankingScreen){

        rankingScreen.style.display =
            "none";

        rankingScreen.classList.remove(
            "active"
        );

    }

}


if(rankingBtn){

    rankingBtn.addEventListener(
        "click",
        openRanking
    );

}


if(closeRankingBtn){

    closeRankingBtn.addEventListener(
        "click",
        closeRanking
    );

}


/* ============================================================
   RANKING AUTOMÁTICO
============================================================ */

function startRankingRefresh(){

    if(rankingRefreshTimer){

        clearInterval(
            rankingRefreshTimer
        );

    }


    rankingRefreshTimer =
        setInterval(
            ()=>{

                if(
                    rankingScreen &&
                    (
                        rankingScreen.style.display ===
                        "flex" ||
                        rankingScreen.classList.contains(
                            "active"
                        )
                    )
                ){

                    loadGlobalRanking();

                }

            },
            15000
        );

}


/* ============================================================
   RECORDE LOCAL
============================================================ */

function getLocalBestScore(){

    try{

        return Number(
            localStorage.getItem(
                "ludix_best_score"
            ) || 0
        );

    }catch(error){

        return 0;

    }

}


function saveLocalBestScore(){

    if(!player){
        return;
    }


    const old =
        getLocalBestScore();


    if(
        player.score <= old
    ){
        return;
    }


    try{

        localStorage.setItem(
            "ludix_best_score",
            String(
                player.score
            )
        );

    }catch(error){}

}


function saveAllScores(){

    saveLocalBestScore();

    saveScore();

}


/* ============================================================
   CATEGORIAS POR DATA-ATTRIBUTE
============================================================ */

document.addEventListener(
    "click",
    event=>{

        const button =
            event.target.closest(
                "[data-category]"
            );


        if(button){

            selectCategory(
                button.dataset.category
            );

        }

    }
);


/* ============================================================
   INICIALIZAÇÃO
============================================================ */

loadPlayerName();

initializeSupabase();

startRankingRefresh();


/* ============================================================
   ESTADO INICIAL — IMPORTANTE
============================================================ */

/*
   NÃO inicia o jogo automaticamente.

   O jogador continua vendo o menu original.
*/

gameRunning = false;

gameEnded = false;

waveActive = false;

preparation = false;

wave = 1;


if(shopScreen){

    shopScreen.style.display =
        "block";

}


if(hud){

    hud.style.display =
        "none";

}


if(gameInventory){

    gameInventory.style.display =
        "none";

}


renderItems();

renderInventory();

updateHUD();


/* ============================================================
   GARANTIA DE RENDERIZAÇÃO DO MENU
============================================================ */

if(
    shopContent &&
    shopContent.children.length === 0
){

    currentCategory =
        "armadura";

    renderItems();

}


console.log(
    "LUDIX — They Are Coming carregado corretamente."
);
