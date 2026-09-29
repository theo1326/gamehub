"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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

const MAX_HEALTH_START = 100;
const INVENTORY_SIZE = 5;
const ZOMBIE_DAMAGE = 5;
const PREPARATION_TIME = 30;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

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

const armors = [
    {name:"Colete Leve",armor:20,price:500},
    {name:"Colete Tático",armor:40,price:1200},
    {name:"Armadura Pesada",armor:60,price:2500},
    {name:"Armadura Militar",armor:80,price:4500},
    {name:"Armadura Especial",armor:100,price:7000}
];

const friends = [
    {name:"Cachorro",damage:10,price:1000,icon:"🐕"},
    {name:"Rottweiler",damage:18,price:2000,icon:"🐕"},
    {name:"Leopardo",damage:25,price:3500,icon:"🐆"},
    {name:"Tigre",damage:35,price:5000,icon:"🐅"},
    {name:"Leão",damage:50,price:7500,icon:"🦁"},
    {name:"Velociraptor",damage:70,price:12000,icon:"🦖"}
];

const kits = [
    {name:"Kit Médico",heal:30,price:300,icon:"🩹"},
    {name:"Kit Médico Grande",heal:70,price:700,icon:"🏥"},
    {name:"+5 de Vida",permanentHealth:5,price:1000,icon:"❤️"}
];

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
let selectedShopWeapon = weapons[0];
let wave = 1;
let waveActive = false;
let preparation = false;
let preparationTime = PREPARATION_TIME;
let gameRunning = false;
let gameEnded = false;
let keys = {};
let mouse = {x:0,y:0,down:false};
let friend = null;
let rankingSent = false;

window.addEventListener("keydown",e=>{
    keys[e.key.toLowerCase()] = true;

    if(e.key === " "){
        e.preventDefault();
    }

    if(e.key.toLowerCase() === "r"){
        reload();
    }

    if(["1","2","3","4","5"].includes(e.key)){
        useInventory(Number(e.key)-1);
    }

    if(e.key.toLowerCase() === "e"){
        usePlacementItem();
    }

    if(
        e.key.toLowerCase() === "t" &&
        !gameRunning &&
        !gameEnded &&
        shopScreen &&
        shopScreen.style.display !== "none" &&
        document.activeElement !== playerNameInput
    ){
        sellSelectedWeapon();
    }
});

window.addEventListener("keyup",e=>{
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener("mousemove",e=>{
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mousedown",()=>{
    mouse.down = true;
});

canvas.addEventListener("mouseup",()=>{
    mouse.down = false;
});

canvas.addEventListener("mouseleave",()=>{
    mouse.down = false;
});

function getPlayerName(){
    return playerNameInput.value
        .trim()
        .replace(/\s+/g," ")
        .slice(0,16);
}

function validatePlayerName(){
    const name = getPlayerName();

    if(!name){
        nameWarning.style.display = "block";
        playerNameInput.focus();
        return false;
    }

    nameWarning.style.display = "none";
    return true;
}

playerNameInput.addEventListener("input",()=>{
    if(getPlayerName()){
        nameWarning.style.display = "none";
    }
});

function getAmmoType(name){
    const n = String(name || "").toLowerCase();

    if(
        n.includes("rpg") ||
        n.includes("launcher") ||
        n.includes("cannon")
    ) return "Foguete / Granada";

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
    ) return "Energia / Plasma";

    if(n.includes("flamethrower"))
        return "Combustível";

    if(
        n.includes("shotgun") ||
        n.includes("double barrel") ||
        n.includes("m870") ||
        n.includes("spas") ||
        n.includes("aa-12") ||
        n.includes("saiga") ||
        n.includes("ksg") ||
        n.includes("usas")
    ) return "Cartucho";

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
    ) return "Munição de Precisão";

    if(
        n.includes("m249") ||
        n.includes("pkm") ||
        n.includes("rpk") ||
        n.includes("minigun") ||
        n.includes("doom") ||
        n.includes("omega") ||
        n.includes("titan")
    ) return "Munição Pesada";

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
    ) return "Munição de SMG";

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
    ) return "Munição de Fuzil";

    if(
        n.includes("desert eagle") ||
        n.includes("magnum") ||
        n.includes("raging hunter") ||
        n.includes("revolver")
    ) return "Munição de Revólver";

    return "Munição de Pistola";
}

weapons.forEach(w=>{
    w.ammoType = getAmmoType(w.name);
});

function weaponClass(name){
    const n = name.toLowerCase();

    if(
        [
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
        ].some(v=>n.includes(v))
    ) return "pistol";

    if(
        [
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
        ].some(v=>n.includes(v))
    ) return "smg";

    if(
        [
            "shotgun",
            "double barrel",
            "m870",
            "spas",
            "aa-12",
            "saiga",
            "ksg",
            "usas"
        ].some(v=>n.includes(v))
    ) return "shotgun";

    if(
        [
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
        ].some(v=>n.includes(v))
    ) return "rifle";

    if(
        [
            "sniper",
            "awp",
            "barrett",
            "svd",
            "m24",
            "mosin",
            "kar98",
            "intervention"
        ].some(v=>n.includes(v))
    ) return "sniper";

    if(
        [
            "rpg",
            "grenade launcher",
            "heavy cannon",
            "gauss rifle",
            "minigun"
        ].some(v=>n.includes(v))
    ) return "heavy";

    if(
        [
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
        ].some(v=>n.includes(v))
    ) return "energy";

    return "rifle";
}

function weaponSkin(name){
    const hash = [...name]
        .reduce((a,c)=>a+c.charCodeAt(0),0);

    return {
        accent:`hsl(${hash % 360} 55% 48%)`,
        dark:"#16191b",
        metal:hash % 2 ? "#596168" : "#737b82",
        wood:hash % 3 ? "#5b3a25" : "#70482d"
    };
}

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
        ctx.fillRect(18+long-5,-5,6,5);
    }

    else if(kind === "smg"){
        const long = n.includes("p90") ? 47 : 58;

        ctx.fillStyle = c.metal;
        ctx.fillRect(17,-7,long,9);

        ctx.fillStyle = c.dark;
        ctx.fillRect(24,2,10,8);
        ctx.fillRect(30,8,7,13);

        ctx.fillStyle = "#0b0c0d";
        ctx.fillRect(17,-10,long*.55,3);
        ctx.fillRect(42,-1,15,3);
    }

    else if(kind === "shotgun"){
        const double = n.includes("double barrel");
        const long = double ? 62 : 70;

        ctx.fillStyle = c.metal;
        ctx.fillRect(18,-8,long,7);

        ctx.fillStyle = c.dark;

        if(double){
            ctx.fillRect(18,-12,long,3);
            ctx.fillRect(27,0,11,9);
        }else{
            ctx.fillRect(24,0,12,9);
        }

        ctx.fillStyle = c.wood;
        ctx.fillRect(31,7,7,16);
        ctx.fillRect(14,-3,13,5);
    }

    else if(kind === "rifle"){
        const long =
            n.includes("m249") ||
            n.includes("pkm")
                ? 82
                : 72;

        ctx.fillStyle = c.metal;
        ctx.fillRect(18,-8,long,7);

        ctx.fillStyle = c.dark;
        ctx.fillRect(24,0,11,9);
        ctx.fillRect(30,7,7,17);

        ctx.fillStyle = c.wood;
        ctx.fillRect(11,-3,14,5);

        ctx.fillStyle = "#0a0b0c";
        ctx.fillRect(18,-11,long*.45,3);

        if(
            n.includes("ak") ||
            n.includes("galil") ||
            n.includes("rpk")
        ){
            ctx.fillStyle = c.wood;
            ctx.fillRect(44,0,10,5);
        }
    }

    else if(kind === "sniper"){
        ctx.fillStyle = c.metal;
        ctx.fillRect(16,-7,91,6);

        ctx.fillStyle = c.dark;
        ctx.fillRect(27,0,12,9);
        ctx.fillRect(31,7,7,16);

        ctx.fillStyle = c.wood;
        ctx.fillRect(10,-3,19,5);

        ctx.fillStyle = "#252a2e";
        ctx.fillRect(45,-13,30,5);

        ctx.beginPath();
        ctx.arc(49,-10,5,0,Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(72,-10,5,0,Math.PI*2);
        ctx.fill();
    }

    else if(kind === "heavy"){
        ctx.fillStyle = c.metal;
        ctx.fillRect(14,-9,86,11);

        ctx.fillStyle = c.dark;
        ctx.fillRect(25,2,15,12);
        ctx.fillRect(31,13,8,14);

        ctx.fillStyle = c.wood;
        ctx.fillRect(8,-3,18,6);

        if(n.includes("rpg")){
            ctx.fillStyle = "#4e5b50";
            ctx.fillRect(15,-14,70,4);

            ctx.fillStyle = "#202629";
            ctx.fillRect(80,-11,14,8);
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
        ctx.fillRect(15,-9,82,10);

        ctx.fillStyle = c.accent;
        ctx.fillRect(30,-5,52,4);
        ctx.fillRect(55,-13,22,4);

        ctx.fillStyle = "#b9f4ff";
        ctx.fillRect(80,-6,20,5);

        ctx.fillStyle = "#30373b";
        ctx.fillRect(24,1,13,11);
        ctx.fillRect(31,9,7,14);

        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(46,-15,28,5);
    }

    ctx.restore();
} 
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

            return `
                Vida máxima +${item.permanentHealth}
                permanentemente
            `;
        }

        return `Recupera ${item.heal} de vida`;
    }

    if(type === "bombas"){

        return `
            Dano: ${item.damage}
            |
            Área: ${item.radius}
        `;
    }

    if(type === "armadilhas"){
        return `Dano: ${item.damage}`;
    }

    if(type === "barricadas"){
        return `Resistência: ${item.health}`;
    }

    return "Item especial";
}


/* =========================================================
   LOJA
   ========================================================= */

function renderItems(){

    shopContent.innerHTML = "";

    let items = [];

    if(currentCategory === "armadura")
        items = armors;

    if(currentCategory === "armas")
        items = weapons;

    if(currentCategory === "amigos")
        items = friends;

    if(currentCategory === "kits")
        items = kits;

    if(currentCategory === "bombas")
        items = bombs;

    if(currentCategory === "armadilhas")
        items = traps;

    if(currentCategory === "barricadas")
        items = barricades;


    if(currentCategory === "municao"){

        shopContent.innerHTML = `

            <div class="shop-item">

                <div class="item-visual">
                    📦
                </div>

                <h3>Munição +30</h3>

                <p>
                    Adiciona 30 munições.
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


    items.forEach((item,index)=>{

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
   SELECIONAR ARMA
   ========================================================= */

function selectShopWeapon(item){

    if(!item)
        return;

    selectedShopWeapon = item;
}


/* =========================================================
   COMPRAR ITEM
   ========================================================= */

window.buyItem = function(index){

    let items = [];

    if(currentCategory === "armadura")
        items = armors;

    if(currentCategory === "armas")
        items = weapons;

    if(currentCategory === "amigos")
        items = friends;

    if(currentCategory === "kits")
        items = kits;

    if(currentCategory === "bombas")
        items = bombs;

    if(currentCategory === "armadilhas")
        items = traps;

    if(currentCategory === "barricadas")
        items = barricades;


    const item = items[index];

    if(!item)
        return;


    if(player.money < item.price){

        alert("Dinheiro insuficiente!");

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


    /* AMIGOS */

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

        return;
    }

};


/* =========================================================
   VENDER ARMA
   ========================================================= */

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

    if(!confirmed)
        return;


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


/* =========================================================
   MUNIÇÃO
   ========================================================= */

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


/* =========================================================
   INVENTÁRIO
   ========================================================= */

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

    if(!menuInventory ||
       !gameInventorySlots){

        return;
    }


    menuInventory.innerHTML = "";

    gameInventorySlots.innerHTML = "";


    for(
        let i = 0;
        i < INVENTORY_SIZE;
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
                `<span>${i + 1}</span>`;

            gameSlot.innerHTML =
                `<span>${i + 1}</span>`;
        }


        menuInventory.appendChild(
            menuSlot
        );

        gameInventorySlots.appendChild(
            gameSlot
        );
    }
}


function useInventory(index){

    if(!inventory[index])
        return;


    const item =
        inventory[index];


    if(item.type === "bomb"){

        useBomb(item.item);

        inventory.splice(
            index,
            1
        );
    }


    if(item.type === "trap"){

        placeTrap(item.item);

        if(preparation){

            inventory.splice(
                index,
                1
            );
        }
    }


    if(item.type === "barricade"){

        placeBarricade(
            item.item
        );

        if(preparation){

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

function startWave(){

    if(gameEnded)
        return;


    if(!validatePlayerName())
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


    renderInventory();

    updateHUD();
}


startWaveBtn.addEventListener(
    "click",
    startWave
);


/* =========================================================
   PREPARAÇÃO
   ========================================================= */

function updatePreparation(dt){

    preparationTime -= dt;


    if(preparationTime <= 0){

        preparationTime = 0;

        preparation = false;

        waveActive = true;

        spawnWave();
    }
}


/* =========================================================
   SPAWN DOS ZUMBIS
   ========================================================= */

function spawnWave(){

    zombies = [];


    const amount =
        5 + wave * 3;


    for(
        let i = 0;
        i < amount;
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

function updatePlayer(dt){

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


    if(
        dx !== 0 ||
        dy !== 0
    ){

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

function shoot(){

    if(!waveActive)
        return;


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


    player.lastShot =
        now;

    player.ammo--;


    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );


    const speed =
        player.weapon.name === "RPG"
            ? 550
            : 1000;


    bullets.push({

        x:player.x,

        y:player.y,

        vx:
            Math.cos(angle) *
            speed,

        vy:
            Math.sin(angle) *
            speed,

        damage:
            player.weapon.damage,

        life:
            player.weapon.range /
            speed,

        ammoType:
            player.weapon.ammoType ||
            getAmmoType(
                player.weapon.name
            ),

        weaponClass:
            weaponClass(
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

function reload(){

    if(player.reloadTime > 0)
        return;


    if(
        player.ammo >=
        player.weapon.magazine
    ){

        return;
    }


    if(player.reserveAmmo <= 0)
        return;


    player.reloadTime =
        1.3;
}


function updateReload(dt){

    if(player.reloadTime > 0){

        player.reloadTime -= dt;


        if(
            player.reloadTime <= 0
        ){

            const missing =
                player.weapon.magazine -
                player.ammo;


            const amount =
                Math.min(
                    missing,
                    player.reserveAmmo
                );


            player.ammo +=
                amount;

            player.reserveAmmo -=
                amount;


            updateHUD();
        }
    }
}


/* =========================================================
   BALAS
   ========================================================= */

function updateBullets(dt){

    for(
        let i = bullets.length - 1;
        i >= 0;
        i--
    ){

        const b =
            bullets[i];


        b.x +=
            b.vx * dt;

        b.y +=
            b.vy * dt;

        b.life -= dt;


        let hit = false;


        for(
            let j = zombies.length - 1;
            j >= 0;
            j--
        ){

            const z =
                zombies[j];


            const distance =
                Math.hypot(
                    b.x - z.x,
                    b.y - z.y
                );


            if(
                distance < 30
            ){

                z.health -=
                    b.damage;

                hit = true;


                if(
                    z.health <= 0
                ){

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


        if(
            hit ||
            b.life <= 0 ||
            b.x < -100 ||
            b.x >
                canvas.width + 100 ||
            b.y < -100 ||
            b.y >
                canvas.height + 100
        ){

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

function updateZombies(dt){

    for(
        let i = zombies.length - 1;
        i >= 0;
        i--
    ){

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


        if(
            distance > 55
        ){

            z.x +=
                (dx / distance) *
                z.speed *
                dt;

            z.y +=
                (dy / distance) *
                z.speed *
                dt;

        }else{

            z.attackCooldown -= dt;


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


    if(friend){

        const nearest =
            zombies.reduce(
                (closest,z)=>{

                    if(!closest)
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


        if(
            nearest &&
            Math.hypot(
                nearest.x - player.x,
                nearest.y - player.y
            ) < 500
        ){

            const now =
                performance.now();


            if(
                now -
                friend.lastAttack >
                700
            ){

                nearest.health -=
                    friend.damage;

                friend.lastAttack =
                    now;


                if(
                    nearest.health <= 0
                ){

                    player.money +=
                        nearest.reward;

                    player.score +=
                        nearest.reward;


                    const index =
                        zombies.indexOf(
                            nearest
                        );


                    if(index !== -1){

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
   DANO AO JOGADOR
   ========================================================= */

function damagePlayer(amount){

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


    if(
        player.health <= 0
    ){

        player.health = 0;

        endGame();
    }


    updateHUD();
}


/* =========================================================
   BOMBA
   ========================================================= */

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
        let i = zombies.length - 1;
        i >= 0;
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

function placeTrap(trap){

    if(!preparation){

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


function updateTraps(){

    for(
        const trap of placedTraps
    ){

        if(!trap.active)
            continue;


        for(
            let i = zombies.length - 1;
            i >= 0;
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

                trap.active = false;


                if(
                    z.health <= 0
                ){

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

function placeBarricade(barricade){

    if(!preparation){

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
/* ============================================================
   LUDIX / THEY ARE COMING
   GAME.JS — PARTE 3/4
   SISTEMA DE JOGO, ONDAS, ZUMBIS, ARMAS E COMBATE
============================================================ */

/* =========================
   FUNÇÕES DE ARMA
========================= */

function getCurrentWeapon() {
    if (!player || !player.inventory) return null;

    const slot = player.selectedSlot ?? 0;
    const weaponName = player.inventory[slot];

    if (!weaponName) return null;

    return weapons.find(w => w.name === weaponName) || null;
}

function getWeaponAmmo(weapon) {
    if (!weapon) return 0;

    if (!player.ammo) player.ammo = {};

    if (typeof player.ammo[weapon.ammo] !== "number") {
        player.ammo[weapon.ammo] = 0;
    }

    return player.ammo[weapon.ammo];
}

function consumeAmmo(weapon) {
    if (!weapon) return false;

    if (weapon.ammo === "infinita") return true;

    const current = getWeaponAmmo(weapon);

    if (current <= 0) {
        showMessage("SEM MUNIÇÃO!");
        return false;
    }

    player.ammo[weapon.ammo]--;
    updateHUD();

    return true;
}

function reloadWeapon() {
    const weapon = getCurrentWeapon();

    if (!weapon) return;

    if (weapon.ammo === "infinita") {
        player.reloading = false;
        return;
    }

    if (player.reloading) return;

    const maxAmmo = weapon.magazine || 6;
    const currentAmmo = player.magazineAmmo || 0;

    if (currentAmmo >= maxAmmo) return;

    if (getWeaponAmmo(weapon) <= 0) {
        showMessage("Você não possui munição!");
        return;
    }

    player.reloading = true;

    const reloadTime = weapon.reload || 900;

    setTimeout(() => {

        if (!player) return;

        const missing = maxAmmo - player.magazineAmmo;
        const available = getWeaponAmmo(weapon);

        const amount = Math.min(missing, available);

        player.magazineAmmo += amount;
        player.ammo[weapon.ammo] -= amount;

        player.reloading = false;

        updateHUD();

    }, reloadTime);
}


/* =========================
   TIRO
========================= */

function shoot() {

    if (!gameRunning) return;
    if (!player || player.dead) return;
    if (player.reloading) return;

    const weapon = getCurrentWeapon();

    if (!weapon) {
        showMessage("Equipe uma arma!");
        return;
    }

    const now = Date.now();

    if (now - player.lastShot < (weapon.fireRate || 300)) {
        return;
    }

    if (player.magazineAmmo <= 0) {

        if (getWeaponAmmo(weapon) > 0) {
            reloadWeapon();
        } else {
            showMessage("SEM MUNIÇÃO!");
        }

        return;
    }

    if (!consumeMagazineAmmo()) return;

    player.lastShot = now;

    const bullets = weapon.pellets || 1;

    for (let i = 0; i < bullets; i++) {
        createBullet(weapon);
    }

    createMuzzleFlash();

    if (weapon.sound) {
        try {
            weapon.sound();
        } catch (e) {}
    }
}

function consumeMagazineAmmo() {

    if (player.magazineAmmo <= 0) {
        return false;
    }

    player.magazineAmmo--;

    updateHUD();

    return true;
}


/* =========================
   CRIAÇÃO DE BALAS
========================= */

function createBullet(weapon) {

    const angle = player.angle || 0;

    const spread =
        ((Math.random() - 0.5) *
        ((weapon.spread || 0) * Math.PI / 180));

    const finalAngle = angle + spread;

    const speed = weapon.bulletSpeed || 12;

    bullets.push({

        x: player.x,
        y: player.y,

        vx: Math.cos(finalAngle) * speed,
        vy: Math.sin(finalAngle) * speed,

        damage: weapon.damage || 10,

        life: weapon.range || 700,

        size: weapon.bulletSize || 4,

        color: weapon.bulletColor || "#ffd34d",

        explosive: !!weapon.explosive,

        explosionRadius:
            weapon.explosionRadius || 0

    });
}


/* =========================
   FLASH DO TIRO
========================= */

function createMuzzleFlash() {

    muzzleFlash = {
        time: 90,
        x: player.x,
        y: player.y
    };
}


/* =========================
   ATUALIZAÇÃO DAS BALAS
========================= */

function updateBullets(delta) {

    for (let i = bullets.length - 1; i >= 0; i--) {

        const b = bullets[i];

        b.x += b.vx * delta;
        b.y += b.vy * delta;

        b.life -= delta;

        if (b.life <= 0) {
            bullets.splice(i, 1);
            continue;
        }

        let hit = false;

        for (let z = zombies.length - 1; z >= 0; z--) {

            const zombie = zombies[z];

            if (!zombie || zombie.dead) continue;

            const dx = zombie.x - b.x;
            const dy = zombie.y - b.y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );

            if (distance <
                (zombie.radius || 22) + b.size) {

                damageZombie(
                    zombie,
                    b.damage
                );

                if (b.explosive) {
                    explode(
                        b.x,
                        b.y,
                        b.explosionRadius
                    );
                }

                bullets.splice(i, 1);

                hit = true;
                break;
            }
        }

        if (hit) continue;

        /* colisão com paredes */

        if (
            b.x < 0 ||
            b.y < 0 ||
            b.x > world.width ||
            b.y > world.height
        ) {
            bullets.splice(i, 1);
        }
    }
}


/* =========================
   DANO NO ZUMBI
========================= */

function damageZombie(zombie, damage) {

    if (!zombie || zombie.dead) return;

    zombie.hp -= damage;

    zombie.hitFlash = 100;

    if (zombie.hp <= 0) {

        zombie.hp = 0;
        zombie.dead = true;

        player.kills++;

        const reward =
            zombie.reward ||
            Math.floor(8 + Math.random() * 15);

        player.money += reward;

        player.score +=
            zombie.score ||
            reward * 10;

        createBloodEffect(
            zombie.x,
            zombie.y
        );

        updateHUD();

        setTimeout(() => {

            const index = zombies.indexOf(zombie);

            if (index !== -1) {
                zombies.splice(index, 1);
            }

            checkWaveComplete();

        }, 150);

    }
}


/* =========================
   EXPLOSÃO
========================= */

function explode(x, y, radius) {

    if (!radius || radius <= 0) return;

    explosionEffects.push({

        x,
        y,

        radius: 10,

        maxRadius: radius,

        life: 350

    });

    for (const zombie of zombies) {

        if (!zombie || zombie.dead) continue;

        const dx = zombie.x - x;
        const dy = zombie.y - y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {

            const factor =
                1 - (distance / radius);

            damageZombie(
                zombie,
                Math.max(
                    1,
                    Math.floor(
                        100 * factor
                    )
                )
            );
        }
    }
}


/* =========================
   ZUMBIS
========================= */

function spawnZombie() {

    const side =
        Math.floor(Math.random() * 4);

    let x;
    let y;

    const margin = 100;

    if (side === 0) {
        x = margin;
        y = Math.random() * world.height;
    }

    else if (side === 1) {
        x = world.width - margin;
        y = Math.random() * world.height;
    }

    else if (side === 2) {
        x = Math.random() * world.width;
        y = margin;
    }

    else {
        x = Math.random() * world.width;
        y = world.height - margin;
    }

    const difficulty =
        1 + (wave - 1) * 0.08;

    const types = [
        {
            name: "Walker",
            hp: 80,
            speed: 1.1,
            damage: 8,
            radius: 23,
            reward: 8
        },

        {
            name: "Runner",
            hp: 55,
            speed: 2.0,
            damage: 10,
            radius: 19,
            reward: 12
        },

        {
            name: "Brute",
            hp: 260,
            speed: 0.65,
            damage: 22,
            radius: 34,
            reward: 25
        },

        {
            name: "Crawler",
            hp: 45,
            speed: 2.5,
            damage: 7,
            radius: 16,
            reward: 14
        }
    ];

    let typeIndex =
        Math.floor(
            Math.random() * types.length
        );

    if (wave < 3) {
        typeIndex = 0;
    }

    if (wave < 6 && typeIndex === 2) {
        typeIndex = 0;
    }

    const type = types[typeIndex];

    zombies.push({

        x,
        y,

        hp: Math.floor(
            type.hp * difficulty
        ),

        maxHp: Math.floor(
            type.hp * difficulty
        ),

        speed:
            type.speed *
            (1 + wave * 0.012),

        damage:
            Math.floor(
                type.damage * difficulty
            ),

        radius: type.radius,

        reward: type.reward,

        score: type.reward * 10,

        type: type.name,

        dead: false,

        attackCooldown: 0,

        hitFlash: 0

    });
}


/* =========================
   ATUALIZA ZUMBIS
========================= */

function updateZombies(delta) {

    if (!player || player.dead) return;

    for (const zombie of zombies) {

        if (!zombie || zombie.dead) continue;

        if (zombie.hitFlash > 0) {
            zombie.hitFlash -= delta;
        }

        if (zombie.attackCooldown > 0) {
            zombie.attackCooldown -= delta;
        }

        const dx = player.x - zombie.x;
        const dy = player.y - zombie.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance > player.radius + zombie.radius + 3) {

            const length =
                Math.max(distance, 1);

            zombie.x +=
                (dx / length) *
                zombie.speed *
                delta *
                0.06;

            zombie.y +=
                (dy / length) *
                zombie.speed *
                delta *
                0.06;

        } else {

            if (zombie.attackCooldown <= 0) {

                damagePlayer(
                    zombie.damage
                );

                zombie.attackCooldown =
                    800;
            }
        }

        zombie.x = Math.max(
            zombie.radius,
            Math.min(
                world.width - zombie.radius,
                zombie.x
            )
        );

        zombie.y = Math.max(
            zombie.radius,
            Math.min(
                world.height - zombie.radius,
                zombie.y
            )
        );
    }
}


/* =========================
   DANO NO JOGADOR
========================= */

function damagePlayer(amount) {

    if (!player || player.dead) return;

    if (player.invincibleUntil > Date.now()) {
        return;
    }

    let finalDamage = amount;

    if (player.armor > 0) {

        const absorbed =
            Math.min(
                player.armor,
                Math.ceil(amount * 0.45)
            );

        player.armor -= absorbed;
        finalDamage -= absorbed;
    }

    player.hp -= Math.max(
        1,
        finalDamage
    );

    player.invincibleUntil =
        Date.now() + 300;

    screenShake = 8;

    updateHUD();

    if (player.hp <= 0) {

        player.hp = 0;

        player.dead = true;

        gameOver();

    }
}


/* =========================
   EFEITOS DE SANGUE
========================= */

function createBloodEffect(x, y) {

    for (let i = 0; i < 7; i++) {

        particles.push({

            x,
            y,

            vx:
                (Math.random() - 0.5) * 5,

            vy:
                (Math.random() - 0.5) * 5,

            life:
                300 + Math.random() * 300,

            size:
                2 + Math.random() * 4

        });
    }
}


/* =========================
   PARTICULAS
========================= */

function updateParticles(delta) {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p = particles[i];

        p.x += p.vx * delta * 0.05;
        p.y += p.vy * delta * 0.05;

        p.vy += 0.01 * delta;

        p.life -= delta;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}


/* =========================
   EXPLOSÕES
========================= */

function updateExplosions(delta) {

    for (
        let i = explosionEffects.length - 1;
        i >= 0;
        i--
    ) {

        const e = explosionEffects[i];

        e.life -= delta;

        e.radius +=
            (e.maxRadius - e.radius) *
            0.15;

        if (e.life <= 0) {
            explosionEffects.splice(i, 1);
        }
    }
}


/* =========================
   MOVIMENTO DO JOGADOR
========================= */

function updatePlayer(delta) {

    if (!player || player.dead) return;

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["ArrowUp"]) {
        dy -= 1;
    }

    if (keys["s"] || keys["ArrowDown"]) {
        dy += 1;
    }

    if (keys["a"] || keys["ArrowLeft"]) {
        dx -= 1;
    }

    if (keys["d"] || keys["ArrowRight"]) {
        dx += 1;
    }

    if (dx !== 0 || dy !== 0) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        dx /= length;
        dy /= length;

        const speed =
            player.speed ||
            3.5;

        player.x +=
            dx * speed * delta * 0.06;

        player.y +=
            dy * speed * delta * 0.06;
    }

    player.x = Math.max(
        player.radius,
        Math.min(
            world.width - player.radius,
            player.x
        )
    );

    player.y = Math.max(
        player.radius,
        Math.min(
            world.height - player.radius,
            player.y
        )
    );

    if (mouse) {

        player.angle =
            Math.atan2(
                mouse.y - canvas.height / 2,
                mouse.x - canvas.width / 2
            );
    }
}


/* =========================
   DESENHAR JOGADOR
========================= */

function drawPlayer(ctx) {

    if (!player) return;

    const x =
        player.x -
        camera.x;

    const y =
        player.y -
        camera.y;

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(
        player.angle || 0
    );

    /* corpo */

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        player.radius || 18,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        player.dead
            ? "#555"
            : "#247cff";

    ctx.fill();

    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth = 2;

    ctx.stroke();

    /* cabeça */

    ctx.beginPath();

    ctx.arc(
        5,
        -5,
        8,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#f0b27a";

    ctx.fill();

    /* arma */

    const weapon =
        getCurrentWeapon();

    if (weapon) {

        ctx.fillStyle =
            weapon.color ||
            "#333";

        ctx.fillRect(
            10,
            -4,
            weapon.visualLength || 25,
            weapon.visualWidth || 7
        );
    }

    ctx.restore();
}


/* =========================
   DESENHAR ZUMBIS
========================= */

function drawZombie(ctx, zombie) {

    if (!zombie || zombie.dead) return;

    const x =
        zombie.x -
        camera.x;

    const y =
        zombie.y -
        camera.y;

    ctx.save();

    ctx.translate(x, y);

    let bodyColor =
        "#65a34a";

    if (zombie.type === "Runner") {
        bodyColor = "#d5a33d";
    }

    if (zombie.type === "Brute") {
        bodyColor = "#803f3f";
    }

    if (zombie.type === "Crawler") {
        bodyColor = "#7350a8";
    }

    if (zombie.hitFlash > 0) {
        bodyColor = "#ffffff";
    }

    ctx.fillStyle = bodyColor;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        zombie.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle =
        "#171717";

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
        Math.PI * 2
    );

    ctx.arc(
        7,
        -5,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /* barra de vida */

    const barWidth =
        zombie.radius * 2;

    const hpPercent =
        Math.max(
            0,
            zombie.hp / zombie.maxHp
        );

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        -barWidth / 2,
        -zombie.radius - 12,
        barWidth,
        5
    );

    ctx.fillStyle =
        "#35d05f";

    ctx.fillRect(
        -barWidth / 2,
        -zombie.radius - 12,
        barWidth * hpPercent,
        5
    );

    ctx.restore();
}


/* =========================
   DESENHAR BALAS
========================= */

function drawBullets(ctx) {

    for (const b of bullets) {

        const x =
            b.x -
            camera.x;

        const y =
            b.y -
            camera.y;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            b.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            b.color;

        ctx.fill();
    }
}


/* =========================
   DESENHAR PARTÍCULAS
========================= */

function drawParticles(ctx) {

    for (const p of particles) {

        const x =
            p.x -
            camera.x;

        const y =
            p.y -
            camera.y;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#b51f28";

        ctx.globalAlpha =
            Math.max(
                0,
                p.life / 600
            );

        ctx.fill();

        ctx.globalAlpha = 1;
    }
}


/* =========================
   DESENHAR EXPLOSÕES
========================= */

function drawExplosions(ctx) {

    for (const e of explosionEffects) {

        const x =
            e.x -
            camera.x;

        const y =
            e.y -
            camera.y;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            e.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "#ff9d00";

        ctx.lineWidth = 6;

        ctx.globalAlpha =
            Math.max(
                0,
                e.life / 350
            );

        ctx.stroke();

        ctx.globalAlpha = 1;
    }
}


/* =========================
   CÂMERA
========================= */

function updateCamera() {

    if (!player) return;

    camera.x =
        player.x -
        canvas.width / 2;

    camera.y =
        player.y -
        canvas.height / 2;

    camera.x =
        Math.max(
            0,
            Math.min(
                world.width -
                canvas.width,
                camera.x
            )
        );

    camera.y =
        Math.max(
            0,
            Math.min(
                world.height -
                canvas.height,
                camera.y
            )
        );
}


/* =========================
   CENÁRIO
========================= */

function drawWorld(ctx) {

    ctx.fillStyle =
        "#17191c";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const gridSize = 64;

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;

    const startX =
        -camera.x % gridSize;

    const startY =
        -camera.y % gridSize;

    for (
        let x = startX;
        x < canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        ctx.stroke();
    }

    for (
        let y = startY;
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
   LOOP PRINCIPAL
========================= */

let lastFrameTime = 0;

function gameLoop(timestamp) {

    if (!gameRunning) return;

    if (!lastFrameTime) {
        lastFrameTime = timestamp;
    }

    let delta =
        timestamp -
        lastFrameTime;

    lastFrameTime =
        timestamp;

    if (delta > 50) {
        delta = 50;
    }

    updatePlayer(delta);

    updateBullets(delta);

    updateZombies(delta);

    updateParticles(delta);

    updateExplosions(delta);

    updateCamera();

    drawGame();

    requestAnimationFrame(
        gameLoop
    );
}


/* =========================
   DESENHAR JOGO
========================= */

function drawGame() {

    if (!ctx) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawWorld(ctx);

    for (const zombie of zombies) {
        drawZombie(
            ctx,
            zombie
        );
    }

    drawBullets(ctx);

    drawParticles(ctx);

    drawExplosions(ctx);

    drawPlayer(ctx);

    drawCrosshair(ctx);

    if (screenShake > 0) {
        screenShake *= 0.85;

        if (screenShake < 0.2) {
            screenShake = 0;
        }
    }

    if (muzzleFlash) {

        muzzleFlash.time -= 16;

        if (muzzleFlash.time <= 0) {
            muzzleFlash = null;
        }
    }
}


/* =========================
   MIRA
========================= */

function drawCrosshair(ctx) {

    if (!mouse) return;

    const x = mouse.x;
    const y = mouse.y;

    ctx.save();

    ctx.strokeStyle =
        "rgba(255,255,255,.9)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        x - 8,
        y
    );

    ctx.lineTo(
        x + 8,
        y
    );

    ctx.moveTo(
        x,
        y - 8
    );

    ctx.lineTo(
        x,
        y + 8
    );

    ctx.stroke();

    ctx.restore();
}


/* =========================
   INICIAR ONDA
========================= */

function startWave() {

    if (!gameRunning) return;

    wave++;

    zombiesRemaining =
        calculateWaveZombies();

    zombiesSpawned = 0;

    waveActive = true;

    waveTimer = 0;

    spawnTimer = 0;

    showMessage(
        "ONDA " + wave
    );

    updateHUD();
}


/* =========================
   QUANTIDADE DE ZUMBIS
========================= */

function calculateWaveZombies() {

    return Math.floor(
        5 +
        wave * 3 +
        Math.pow(wave, 1.15)
    );
}


/* =========================
   SPAWN DA ONDA
========================= */

function updateWave(delta) {

    if (!waveActive) return;

    if (
        zombiesSpawned <
        zombiesRemaining
    ) {

        spawnTimer -= delta;

        if (spawnTimer <= 0) {

            spawnZombie();

            zombiesSpawned++;

            spawnTimer =
                Math.max(
                    180,
                    850 -
                    wave * 18
                );
        }
    }

    if (
        zombiesSpawned >=
        zombiesRemaining
        &&
        zombies.length === 0
    ) {

        checkWaveComplete();
    }
}


/* =========================
   FIM DA ONDA
========================= */

function checkWaveComplete() {

    if (!waveActive) return;

    if (
        zombiesSpawned <
        zombiesRemaining
    ) {
        return;
    }

    if (zombies.length > 0) {
        return;
    }

    waveActive = false;

    player.money +=
        50 +
        wave * 15;

    player.score +=
        wave * 100;

    showMessage(
        "ONDA " +
        wave +
        " COMPLETA!"
    );

    updateHUD();

    saveScore();

    setTimeout(() => {

        if (!gameRunning) return;

        openShop();

    }, 900);
}


/* =========================
   LOJA
========================= */

function openShop() {

    const shop =
        document.getElementById(
            "shop"
        );

    if (!shop) return;

    shop.classList.add(
        "active"
    );

    renderShop();
}


/* =========================
   FECHAR LOJA
========================= */

function closeShop() {

    const shop =
        document.getElementById(
            "shop"
        );

    if (!shop) return;

    shop.classList.remove(
        "active"
    );
}


/* =========================
   RENDERIZAR LOJA
========================= */

function renderShop() {

    const container =
        document.getElementById(
            "shopItems"
        );

    if (!container) return;

    container.innerHTML = "";

    const available =
        weapons.slice(
            0,
            Math.min(
                weapons.length,
                12 + wave
            )
        );

    available.forEach(
        weapon => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "shop-item";

            item.innerHTML = `

                <div class="shop-icon">
                    ${weapon.icon || "🔫"}
                </div>

                <div class="shop-info">

                    <strong>
                        ${weapon.name}
                    </strong>

                    <span>
                        ${weapon.category || "Arma"}
                    </span>

                    <small>
                        Dano:
                        ${weapon.damage || 0}
                    </small>

                </div>

                <button
                    class="buy-weapon"
                    data-weapon="${weapon.name}"
                >
                    $${weapon.price || 0}
                </button>
            `;

            container.appendChild(
                item
            );
        }
    );

    container
        .querySelectorAll(
            ".buy-weapon"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buyWeapon(
                        button.dataset.weapon
                    );

                }
            );
        });
}


/* =========================
   COMPRAR ARMA
========================= */

function buyWeapon(name) {

    const weapon =
        weapons.find(
            w => w.name === name
        );

    if (!weapon) return;

    const price =
        weapon.price || 0;

    if (player.money < price) {

        showMessage(
            "Dinheiro insuficiente!"
        );

        return;
    }

    player.money -= price;

    addWeaponToInventory(
        weapon.name
    );

    showMessage(
        weapon.name +
        " adquirida!"
    );

    updateHUD();

    renderShop();
}


/* =========================
   INVENTÁRIO
========================= */

function addWeaponToInventory(
    weaponName
) {

    if (!player.inventory) {
        player.inventory = [];
    }

    if (
        player.inventory.includes(
            weaponName
        )
    ) {

        showMessage(
            "Você já possui essa arma!"
        );

        return false;
    }

    if (
        player.inventory.length >= 5
    ) {

        showMessage(
            "Inventário cheio!"
        );

        return false;
    }

    player.inventory.push(
        weaponName
    );

    updateInventoryUI();

    return true;
}


/* =========================
   TROCAR ARMA
========================= */

function selectWeaponSlot(slot) {

    if (!player.inventory) return;

    if (
        slot < 0 ||
        slot >= player.inventory.length
    ) {
        return;
    }

    player.selectedSlot = slot;

    const weapon =
        getCurrentWeapon();

    if (!weapon) return;

    player.magazineAmmo =
        Math.min(
            weapon.magazine || 6,
            getWeaponAmmo(weapon)
        );

    updateInventoryUI();
    updateHUD();
}


/* =========================
   INVENTÁRIO VISUAL
========================= */

function updateInventoryUI() {

    const inventory =
        document.getElementById(
            "inventory"
        );

    if (!inventory) return;

    inventory.innerHTML = "";

    for (let i = 0; i < 5; i++) {

        const slot =
            document.createElement(
                "div"
            );

        slot.className =
            "inventory-slot";

        if (
            i === player.selectedSlot
        ) {
            slot.classList.add(
                "selected"
            );
        }

        const weaponName =
            player.inventory &&
            player.inventory[i];

        if (weaponName) {

            const weapon =
                weapons.find(
                    w =>
                        w.name ===
                        weaponName
                );

            slot.innerHTML = `

                <span class="slot-number">
                    ${i + 1}
                </span>

                <span class="slot-icon">
                    ${weapon?.icon || "🔫"}
                </span>

                <span class="slot-name">
                    ${weaponName}
                </span>
            `;
        } else {

            slot.innerHTML = `

                <span class="slot-number">
                    ${i + 1}
                </span>

                <span>
                    VAZIO
                </span>
            `;
        }

        slot.addEventListener(
            "click",
            () => {
                selectWeaponSlot(i);
            }
        );

        inventory.appendChild(
            slot
        );
    }
}


/* =========================
   HUD
========================= */

function updateHUD() {

    const hp =
        document.getElementById(
            "health"
        );

    const money =
        document.getElementById(
            "money"
        );

    const waveEl =
        document.getElementById(
            "wave"
        );

    const score =
        document.getElementById(
            "score"
        );

    const ammo =
        document.getElementById(
            "ammo"
        );

    if (hp) {
        hp.textContent =
            Math.ceil(
                player.hp
            );
    }

    if (money) {
        money.textContent =
            "$" +
            Math.floor(
                player.money
            );
    }

    if (waveEl) {
        waveEl.textContent =
            wave;
    }

    if (score) {
        score.textContent =
            player.score;
    }

    if (ammo) {

        const weapon =
            getCurrentWeapon();

        if (!weapon) {

            ammo.textContent =
                "0 / 0";

        } else {

            ammo.textContent =
                player.magazineAmmo +
                " / " +
                getWeaponAmmo(
                    weapon
                );
        }
    }

    updateInventoryUI();
}


/* =========================
   MENSAGEM
========================= */

function showMessage(text) {

    let box =
        document.getElementById(
            "gameMessage"
        );

    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "gameMessage";

        document.body.appendChild(
            box
        );
    }

    box.textContent = text;

    box.classList.add(
        "show"
    );

    clearTimeout(
        box._timer
    );

    box._timer =
        setTimeout(() => {

            box.classList.remove(
                "show"
            );

        }, 1800);
}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    gameRunning = false;

    waveActive = false;

    saveScore();

    const screen =
        document.getElementById(
            "gameOver"
        );

    if (screen) {

        screen.classList.add(
            "active"
        );

        const finalScore =
            screen.querySelector(
                ".final-score"
            );

        if (finalScore) {

            finalScore.textContent =
                player.score;
        }

        const finalWave =
            screen.querySelector(
                ".final-wave"
            );

        if (finalWave) {

            finalWave.textContent =
                wave;
        }
    }

    showMessage(
        "FIM DE JOGO"
    );
}


/* =========================
   REINICIAR
========================= */

function restartGame() {

    if (!player) return;

    player.x =
        world.width / 2;

    player.y =
        world.height / 2;

    player.hp =
        player.maxHp || 100;

    player.armor = 0;

    player.dead = false;

    player.score = 0;

    player.kills = 0;

    player.money = 0;

    player.selectedSlot = 0;

    player.inventory = [];

    player.ammo = {};

    bullets.length = 0;

    zombies.length = 0;

    particles.length = 0;

    explosionEffects.length = 0;

    wave = 0;

    zombiesSpawned = 0;

    zombiesRemaining = 0;

    waveActive = false;

    gameRunning = true;

    closeShop();

    updateHUD();

    startWave();

    lastFrameTime =
        performance.now();

    requestAnimationFrame(
        gameLoop
    );
}


/* =========================
   CONTROLES DO TECLADO
========================= */

document.addEventListener(
    "keydown",
    event => {

        keys[event.key] = true;

        if (
            event.key >= "1" &&
            event.key <= "5"
        ) {

            selectWeaponSlot(
                Number(event.key) - 1
            );
        }

        if (
            event.key.toLowerCase() ===
            "r"
        ) {

            reloadWeapon();
        }

        if (
            event.code ===
            "Space"
        ) {

            shoot();
        }
    }
);

document.addEventListener(
    "keyup",
    event => {

        keys[event.key] = false;
    }
);


/* =========================
   MOUSE
========================= */

if (canvas) {

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
        event => {

            if (event.button === 0) {
                mouse.down = true;
                shoot();
            }
        }
    );

    canvas.addEventListener(
        "mouseup",
        event => {

            if (event.button === 0) {
                mouse.down = false;
            }
        }
    );

    canvas.addEventListener(
        "contextmenu",
        event => {
            event.preventDefault();
        }
    );
}


/* =========================
   TIRO AUTOMÁTICO
========================= */

setInterval(() => {

    if (
        gameRunning &&
        mouse &&
        mouse.down
    ) {

        shoot();
    }

}, 35);


/* =========================
   BOTÕES
========================= */

document.addEventListener(
    "click",
    event => {

        const target =
            event.target;

        if (
            target.id ===
            "startWaveBtn"
        ) {

            closeShop();

            startWave();

            if (!gameRunning) {
                gameRunning = true;
            }

            lastFrameTime =
                performance.now();

            requestAnimationFrame(
                gameLoop
            );
        }

        if (
            target.id ===
            "restartBtn"
        ) {

            restartGame();
        }

        if (
            target.id ===
            "closeShopBtn"
        ) {

            closeShop();
        }
    }
);


/* =========================
   INICIALIZAÇÃO
========================= */

function initializeGame() {

    if (!canvas) {
        console.error(
            "Canvas do jogo não encontrado."
        );
        return;
    }

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

    if (!player) {

        player = {

            x:
                world.width / 2,

            y:
                world.height / 2,

            radius: 18,

            speed: 3.5,

            hp: 100,

            maxHp: 100,

            armor: 0,

            money: 100,

            score: 0,

            kills: 0,

            angle: 0,

            selectedSlot: 0,

            inventory: [],

            ammo: {},

            magazineAmmo: 0,

            lastShot: 0,

            reloading: false,

            dead: false,

            invincibleUntil: 0
        };
    }

    /* arma inicial */

    const firstWeapon =
        weapons[0];

    if (
        firstWeapon &&
        player.inventory.length === 0
    ) {

        player.inventory.push(
            firstWeapon.name
        );

        if (
            firstWeapon.ammo &&
            firstWeapon.ammo !==
            "infinita"
        ) {

            player.ammo[
                firstWeapon.ammo
            ] =
                firstWeapon.startAmmo ||
                60;
        }

        player.magazineAmmo =
            firstWeapon.magazine ||
            6;
    }

    updateInventoryUI();

    updateHUD();

    gameRunning = true;

    startWave();

    lastFrameTime =
        performance.now();

    requestAnimationFrame(
        gameLoop
    );
}


/* =========================
   RESPONSIVIDADE
========================= */

window.addEventListener(
    "resize",
    () => {

        if (!canvas) return;

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;
    }
);


/* =========================
   INICIAR
========================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeGame
    );

} else {

    initializeGame();
}
/* ============================================================
   LUDIX / THEY ARE COMING
   GAME.JS — PARTE 4/4
   RANKING GLOBAL + SUPABASE + SALVAMENTO
============================================================ */


/* ============================================================
   CONFIGURAÇÃO DO SUPABASE
============================================================ */

/*
   COLOQUE AQUI OS DADOS DO SEU PROJETO SUPABASE.

   Exemplo:

   const SUPABASE_URL =
       "https://xxxxxxxxxxxx.supabase.co";

   const SUPABASE_ANON_KEY =
       "eyJhbGciOiJIUzI1NiIs...";

   NÃO coloque a Service Role Key aqui.
*/

const SUPABASE_URL =
    window.SUPABASE_URL ||
    "";

const SUPABASE_ANON_KEY =
    window.SUPABASE_ANON_KEY ||
    "";


/* ============================================================
   CLIENTE SUPABASE
============================================================ */

let supabaseClient = null;

function initializeSupabase() {

    if (
        typeof window.supabase ===
        "undefined"
    ) {

        console.warn(
            "Biblioteca do Supabase não encontrada."
        );

        return false;
    }

    if (
        !SUPABASE_URL ||
        !SUPABASE_ANON_KEY
    ) {

        console.warn(
            "SUPABASE_URL ou SUPABASE_ANON_KEY não configurados."
        );

        return false;
    }

    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        return true;

    } catch (error) {

        console.error(
            "Erro ao iniciar Supabase:",
            error
        );

        return false;
    }
}


/* ============================================================
   NOME DO JOGADOR
============================================================ */

let playerName = "";


/* ============================================================
   PEGAR NOME SALVO
============================================================ */

function loadPlayerName() {

    try {

        const saved =
            localStorage.getItem(
                "ludix_player_name"
            );

        if (saved) {
            playerName = saved;
        }

    } catch (error) {

        console.warn(
            "Não foi possível carregar o nome."
        );
    }
}


/* ============================================================
   SALVAR NOME
============================================================ */

function savePlayerName(name) {

    name =
        String(name || "")
        .trim()
        .replace(/\s+/g, " ");

    if (!name) {
        name = "Jogador";
    }

    /*
       Limite de segurança para não permitir
       nomes gigantes no ranking.
    */

    name =
        name.substring(
            0,
            20
        );

    playerName = name;

    try {

        localStorage.setItem(
            "ludix_player_name",
            playerName
        );

    } catch (error) {

        console.warn(
            "Não foi possível salvar o nome."
        );
    }

    return playerName;
}


/* ============================================================
   TELA PARA DIGITAR O NOME
============================================================ */

function createNameScreen() {

    let existing =
        document.getElementById(
            "playerNameScreen"
        );

    if (existing) {
        return existing;
    }

    const screen =
        document.createElement(
            "div"
        );

    screen.id =
        "playerNameScreen";

    screen.innerHTML = `

        <div class="name-box">

            <div class="name-icon">
                🧟
            </div>

            <h1>
                THEY ARE COMING
            </h1>

            <p>
                Digite seu nome para entrar
                no ranking global.
            </p>

            <input
                id="playerNameInput"
                type="text"
                maxlength="20"
                autocomplete="off"
                placeholder="Seu nome"
            >

            <button
                id="confirmPlayerName"
                type="button"
            >
                COMEÇAR
            </button>

        </div>
    `;

    document.body.appendChild(
        screen
    );

    return screen;
}


/* ============================================================
   PEDIR NOME
============================================================ */

function askPlayerName() {

    const screen =
        createNameScreen();

    const input =
        document.getElementById(
            "playerNameInput"
        );

    const button =
        document.getElementById(
            "confirmPlayerName"
        );

    if (
        playerName &&
        input
    ) {

        input.value =
            playerName;
    }

    screen.classList.add(
        "active"
    );

    if (input) {

        setTimeout(() => {

            input.focus();

            input.select();

        }, 100);
    }

    if (button) {

        button.onclick =
            confirmPlayerName;
    }

    if (input) {

        input.onkeydown =
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    confirmPlayerName();
                }
            };
    }
}


/* ============================================================
   CONFIRMAR NOME
============================================================ */

function confirmPlayerName() {

    const input =
        document.getElementById(
            "playerNameInput"
        );

    if (!input) return;

    const name =
        input.value.trim();

    if (!name) {

        input.classList.add(
            "error"
        );

        input.placeholder =
            "Digite seu nome!";

        return;
    }

    savePlayerName(
        name
    );

    const screen =
        document.getElementById(
            "playerNameScreen"
        );

    if (screen) {

        screen.classList.remove(
            "active"
        );
    }

    startActualGame();
}


/* ============================================================
   INICIAR JOGO DE VERDADE
============================================================ */

function startActualGame() {

    if (!player) {

        initializeGame();

        return;
    }

    player.dead =
        false;

    player.hp =
        player.maxHp;

    player.score =
        0;

    player.kills =
        0;

    player.money =
        100;

    player.x =
        world.width / 2;

    player.y =
        world.height / 2;

    player.inventory =
        [];

    player.ammo =
        {};

    player.selectedSlot =
        0;

    player.magazineAmmo =
        0;

    zombies.length = 0;

    bullets.length = 0;

    particles.length = 0;

    explosionEffects.length = 0;

    wave = 0;

    zombiesSpawned = 0;

    zombiesRemaining = 0;

    waveActive = false;

    gameRunning = true;

    closeGameOver();

    updateHUD();

    startWave();

    lastFrameTime =
        performance.now();

    requestAnimationFrame(
        gameLoop
    );
}


/* ============================================================
   FECHAR GAME OVER
============================================================ */

function closeGameOver() {

    const screen =
        document.getElementById(
            "gameOver"
        );

    if (!screen) return;

    screen.classList.remove(
        "active"
    );
}


/* ============================================================
   PREPARAR SCORE
============================================================ */

function createScoreData() {

    return {

        player_name:
            playerName ||
            "Jogador",

        score:
            Number(
                player?.score || 0
            ),

        wave:
            Number(
                wave || 0
            ),

        kills:
            Number(
                player?.kills || 0
            )
    };
}


/* ============================================================
   SALVAR SCORE NO SUPABASE
============================================================ */

async function saveScore() {

    if (!player) return;

    if (
        !playerName ||
        playerName.trim() === ""
    ) {

        loadPlayerName();
    }

    if (
        !playerName ||
        playerName.trim() === ""
    ) {

        return;
    }

    if (
        !supabaseClient
    ) {

        initializeSupabase();
    }

    if (!supabaseClient) {

        console.warn(
            "Ranking global indisponível: Supabase não configurado."
        );

        return;
    }

    const data =
        createScoreData();

    if (
        data.score <= 0
    ) {

        return;
    }

    try {

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

        if (error) {

            console.error(
                "Erro ao salvar ranking:",
                error
            );

            return;
        }

        console.log(
            "Pontuação enviada ao ranking global."
        );

    } catch (error) {

        console.error(
            "Erro de conexão com ranking:",
            error
        );
    }
}


/* ============================================================
   BUSCAR RANKING GLOBAL
============================================================ */

async function loadGlobalRanking() {

    const container =
        document.getElementById(
            "globalRanking"
        );

    if (!container) {
        return;
    }

    if (
        !supabaseClient
    ) {

        initializeSupabase();
    }

    if (!supabaseClient) {

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
                "player_name, score, wave, kills, created_at"
            )
            .order(
                "score",
                {
                    ascending: false
                }
            )
            .limit(50);

        if (error) {

            console.error(
                "Erro ao carregar ranking:",
                error
            );

            container.innerHTML = `

                <div class="ranking-empty">
                    Não foi possível carregar o ranking.
                </div>

            `;

            return;
        }

        renderGlobalRanking(
            data || []
        );

    } catch (error) {

        console.error(
            "Erro no ranking:",
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
   RENDERIZAR RANKING
============================================================ */

function renderGlobalRanking(
    scores
) {

    const container =
        document.getElementById(
            "globalRanking"
        );

    if (!container) return;

    if (
        !scores ||
        scores.length === 0
    ) {

        container.innerHTML = `

            <div class="ranking-empty">
                Ainda não existem pontuações.
            </div>

        `;

        return;
    }

    container.innerHTML = "";

    scores.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "ranking-row";

            const position =
                index + 1;

            let medal =
                position;

            if (position === 1) {
                medal = "🥇";
            }

            else if (position === 2) {
                medal = "🥈";
            }

            else if (position === 3) {
                medal = "🥉";
            }

            row.innerHTML = `

                <div class="ranking-position">
                    ${medal}
                </div>

                <div class="ranking-player">

                    <strong>
                        ${escapeHTML(
                            item.player_name
                        )}
                    </strong>

                    <span>
                        Onda ${Number(
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
   PROTEÇÃO DE TEXTO HTML
============================================================ */

function escapeHTML(
    value
) {

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
   ATUALIZAÇÃO AUTOMÁTICA DO RANKING
============================================================ */

let rankingRefreshTimer =
    null;

function startRankingRefresh() {

    if (
        rankingRefreshTimer
    ) {

        clearInterval(
            rankingRefreshTimer
        );
    }

    rankingRefreshTimer =
        setInterval(
            () => {

                loadGlobalRanking();

            },
            15000
        );
}


/* ============================================================
   ABRIR RANKING
============================================================ */

function openRanking() {

    const ranking =
        document.getElementById(
            "rankingPanel"
        );

    if (!ranking) {

        /*
           Se o HTML ainda não possui
           painel de ranking, criamos um.
        */

        createRankingPanel();

    }

    const panel =
        document.getElementById(
            "rankingPanel"
        );

    if (panel) {

        panel.classList.add(
            "active"
        );
    }

    loadGlobalRanking();
}


/* ============================================================
   FECHAR RANKING
============================================================ */

function closeRanking() {

    const panel =
        document.getElementById(
            "rankingPanel"
        );

    if (!panel) return;

    panel.classList.remove(
        "active"
    );
}


/* ============================================================
   CRIAR PAINEL DE RANKING
============================================================ */

function createRankingPanel() {

    if (
        document.getElementById(
            "rankingPanel"
        )
    ) {

        return;
    }

    const panel =
        document.createElement(
            "div"
        );

    panel.id =
        "rankingPanel";

    panel.innerHTML = `

        <div class="ranking-box">

            <button
                id="closeRankingBtn"
                class="close-ranking"
            >
                ✕
            </button>

            <div class="ranking-header">

                <span>
                    🏆
                </span>

                <div>

                    <h2>
                        RANKING GLOBAL
                    </h2>

                    <p>
                        Os maiores sobreviventes
                    </p>

                </div>

            </div>

            <div
                id="globalRanking"
                class="global-ranking"
            ></div>

        </div>
    `;

    document.body.appendChild(
        panel
    );

    const close =
        document.getElementById(
            "closeRankingBtn"
        );

    if (close) {

        close.addEventListener(
            "click",
            closeRanking
        );
    }
}


/* ============================================================
   BOTÃO RANKING
============================================================ */

document.addEventListener(
    "click",
    event => {

        const target =
            event.target;

        if (
            target.closest(
                "#rankingBtn"
            )
        ) {

            openRanking();
        }

    }
);


/* ============================================================
   TECLA TAB — RANKING
============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Tab"
        ) {

            /*
               Não bloquear o comportamento
               normal do navegador.
            */
        }

        if (
            event.key ===
            "Escape"
        ) {

            closeRanking();
            closeShop();
        }
    }
);


/* ============================================================
   SCORE LOCAL
============================================================ */

function getLocalBestScore() {

    try {

        return Number(
            localStorage.getItem(
                "ludix_best_score"
            ) || 0
        );

    } catch (error) {

        return 0;
    }
}


/* ============================================================
   SALVAR MELHOR SCORE LOCAL
============================================================ */

function saveLocalBestScore() {

    if (!player) return;

    const oldScore =
        getLocalBestScore();

    if (
        player.score <= oldScore
    ) {

        return;
    }

    try {

        localStorage.setItem(
            "ludix_best_score",
            String(
                player.score
            )
        );

    } catch (error) {

        console.warn(
            "Não foi possível salvar recorde local."
        );
    }
}


/* ============================================================
   RANKING + RECORDE LOCAL
============================================================ */

function saveAllScores() {

    saveLocalBestScore();

    saveScore();
}


/* ============================================================
   SUBSTITUIR GAME OVER
============================================================ */

const originalGameOver =
    gameOver;

gameOver =
    function () {

        saveAllScores();

        originalGameOver();

        setTimeout(
            () => {

                loadGlobalRanking();

            },
            800
        );
    };


/* ============================================================
   INICIALIZAR SISTEMA DE RANKING
============================================================ */

function initializeRankingSystem() {

    loadPlayerName();

    initializeSupabase();

    createNameScreen();

    createRankingPanel();

    startRankingRefresh();
}


/* ============================================================
   INICIAR SISTEMA
============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeRankingSystem
    );

} else {

    initializeRankingSystem();
}


/* ============================================================
   CSS AUTOMÁTICO PARA ELEMENTOS CRIADOS
============================================================ */

(function injectRankingStyles() {

    if (
        document.getElementById(
            "ludixRankingStyles"
        )
    ) {

        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "ludixRankingStyles";

    style.textContent = `

        #playerNameScreen,
        #rankingPanel {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: none;

            align-items: center;

            justify-content: center;

            background:
                rgba(0,0,0,.82);

            backdrop-filter:
                blur(8px);
        }

        #playerNameScreen.active,
        #rankingPanel.active {

            display: flex;
        }

        .name-box,
        .ranking-box {

            width:
                min(92vw, 520px);

            max-height:
                90vh;

            overflow:
                auto;

            padding:
                30px;

            border-radius:
                20px;

            background:
                #11151b;

            border:
                1px solid
                rgba(255,255,255,.12);

            box-shadow:
                0 25px 80px
                rgba(0,0,0,.6);

            color:
                white;

            text-align:
                center;
        }

        .name-icon {

            font-size:
                60px;

            margin-bottom:
                10px;
        }

        .name-box h1 {

            margin:
                0 0 10px;

            font-size:
                28px;
        }

        .name-box p {

            color:
                #aeb6c2;

            margin-bottom:
                22px;
        }

        #playerNameInput {

            width:
                100%;

            box-sizing:
                border-box;

            padding:
                14px 16px;

            border-radius:
                10px;

            border:
                1px solid
                rgba(255,255,255,.15);

            background:
                #080b0f;

            color:
                white;

            outline:
                none;

            font-size:
                16px;

            margin-bottom:
                12px;
        }

        #playerNameInput:focus {

            border-color:
                #4d9cff;
        }

        #playerNameInput.error {

            border-color:
                #ff4545;
        }

        #confirmPlayerName {

            width:
                100%;

            padding:
                14px;

            border:
                0;

            border-radius:
                10px;

            background:
                #267cff;

            color:
                white;

            font-weight:
                800;

            cursor:
                pointer;
        }

        #confirmPlayerName:hover {

            filter:
                brightness(1.15);
        }

        .ranking-header {

            display:
                flex;

            align-items:
                center;

            gap:
                15px;

            text-align:
                left;

            margin-bottom:
                20px;
        }

        .ranking-header > span {

            font-size:
                42px;
        }

        .ranking-header h2 {

            margin:
                0;

            font-size:
                24px;
        }

        .ranking-header p {

            margin:
                4px 0 0;

            color:
                #9da7b5;
        }

        .ranking-row {

            display:
                flex;

            align-items:
                center;

            gap:
                12px;

            padding:
                12px;

            margin-bottom:
                8px;

            border-radius:
                12px;

            background:
                rgba(255,255,255,.05);
        }

        .ranking-position {

            width:
                38px;

            font-size:
                19px;

            font-weight:
                800;
        }

        .ranking-player {

            flex:
                1;

            text-align:
                left;

            display:
                flex;

            flex-direction:
                column;
        }

        .ranking-player strong {

            font-size:
                15px;
        }

        .ranking-player span {

            margin-top:
                3px;

            color:
                #8f99a8;

            font-size:
                11px;
        }

        .ranking-score {

            font-weight:
                900;

            font-size:
                16px;
        }

        .ranking-empty,
        .ranking-loading {

            padding:
                30px 10px;

            color:
                #a5afbd;
        }

        .close-ranking {

            position:
                absolute;

            margin:
                -18px -18px 0 0;

            right:
                50%;

            transform:
                translateX(250px);

            border:
                0;

            background:
                rgba(255,255,255,.08);

            color:
                white;

            width:
                38px;

            height:
                38px;

            border-radius:
                50%;

            cursor:
                pointer;

            font-size:
                18px;
        }

        @media(max-width:600px) {

            .name-box,
            .ranking-box {

                padding:
                    22px;

            }

            .close-ranking {

                right:
                    15px;

                transform:
                    none;
            }

        }

    `;

    document.head.appendChild(
        style
    );

})();
