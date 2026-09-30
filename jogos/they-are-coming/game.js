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

const skipPreparationBtn =
    document.getElementById("skipPreparationBtn");

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
const MIN_PREPARATION_TIME = 15;
const AMMO_PACK_SIZE = 50;
const MAX_WEAPON_SLOTS = 5;


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
    {name:"Ultimate Destroyer",damage:8000,fireRate:5000,magazine:1,ammo:5,price:75000,range:3000},

    /* +20 ARMAS NOVAS */
    {name:"FAMAS G2",damage:36,fireRate:105,magazine:25,ammo:150,price:3200,range:850,icon:"🔫"},
    {name:"HK G36C",damage:37,fireRate:100,magazine:30,ammo:180,price:3300,range:880,icon:"🔫"},
    {name:"M4A1",damage:34,fireRate:105,magazine:30,ammo:180,price:3000,range:900,icon:"🔫"},
    {name:"AK-12",damage:43,fireRate:115,magazine:30,ammo:180,price:3600,range:900,icon:"🔫"},
    {name:"SCAR-H",damage:52,fireRate:190,magazine:20,ammo:120,price:4500,range:1050,icon:"🔫"},
    {name:"MP5K",damage:27,fireRate:90,magazine:30,ammo:180,price:2100,range:680,icon:"🔫"},
    {name:"P90 Tactical",damage:25,fireRate:65,magazine:50,ammo:300,price:2600,range:740,icon:"🔫"},
    {name:"Vector Gen II",damage:27,fireRate:55,magazine:40,ammo:240,price:2800,range:700,icon:"🔫"},
    {name:"SPAS-15",damage:92,fireRate:650,magazine:6,ammo:36,price:3600,range:540,icon:"🔫"},
    {name:"Benelli M4",damage:82,fireRate:620,magazine:8,ammo:48,price:3400,range:560,icon:"🔫"},
    {name:"M200 Intervention",damage:280,fireRate:1700,magazine:5,ammo:30,price:7200,range:1900,icon:"🔫"},
    {name:"CheyTac",damage:340,fireRate:2100,magazine:5,ammo:25,price:9000,range:2200,icon:"🔫"},
    {name:"DMR-14",damage:125,fireRate:300,magazine:20,ammo:120,price:5000,range:1350,icon:"🔫"},
    {name:"MK14",damage:145,fireRate:280,magazine:20,ammo:120,price:5600,range:1450,icon:"🔫"},
    {name:"RPG-7",damage:650,fireRate:2500,magazine:1,ammo:12,price:8500,range:1300,icon:"🚀"},
    {name:"MGL",damage:500,fireRate:900,magazine:6,ammo:36,price:9000,range:1200,icon:"💥"},
    {name:"Incinerator",damage:110,fireRate:80,magazine:120,ammo:600,price:9500,range:500,icon:"🔥"},
    {name:"Plasma Carbine",damage:240,fireRate:180,magazine:35,ammo:175,price:13500,range:1450,icon:"⚡"},
    {name:"Arc Rifle",damage:500,fireRate:450,magazine:12,ammo:72,price:15000,range:1250,icon:"⚡"},
    {name:"Meteor Cannon",damage:2500,fireRate:3800,magazine:2,ammo:10,price:30000,range:2400,icon:"☄️"},
];

/* =========================================================
   CORPO A CORPO
   ========================================================= */

const meleeWeapons = [
    {name:"Faca de Combate",damage:80,fireRate:350,range:115,price:600,icon:"🔪",isMelee:true,visual:"knife"},
    {name:"Machado",damage:140,fireRate:650,range:120,price:1200,icon:"🪓",isMelee:true,visual:"axe"},
    {name:"Taco de Beisebol",damage:100,fireRate:500,range:125,price:900,icon:"🏏",isMelee:true,visual:"bat"},
    {name:"Pé de Cabra",damage:115,fireRate:520,range:120,price:1000,icon:"🔧",isMelee:true,visual:"crowbar"},
    {name:"Katana",damage:220,fireRate:550,range:140,price:3000,icon:"⚔️",isMelee:true,visual:"katana"},
    {name:"Machete",damage:180,fireRate:500,range:130,price:2200,icon:"🔪",isMelee:true,visual:"machete"},
    {name:"Marreta",damage:260,fireRate:850,range:125,price:3200,icon:"🔨",isMelee:true,visual:"hammer"},
    {name:"Lança",damage:210,fireRate:600,range:155,price:3500,icon:"🗡️",isMelee:true,visual:"spear"},
    {name:"Foice",damage:240,fireRate:700,range:145,price:4000,icon:"⚔️",isMelee:true,visual:"scythe"},
    {name:"Corrente",damage:160,fireRate:420,range:150,price:2600,icon:"⛓️",isMelee:true,visual:"chain"},
    {name:"Bastão de Ferro",damage:150,fireRate:480,range:125,price:1800,icon:"🔩",isMelee:true,visual:"bat"},
    {name:"Espada",damage:280,fireRate:600,range:145,price:4500,icon:"🗡️",isMelee:true,visual:"sword"},
    {name:"Martelo de Guerra",damage:360,fireRate:1000,range:130,price:6000,icon:"🔨",isMelee:true,visual:"hammer"},
    {name:"Lâmina Dupla",damage:330,fireRate:420,range:140,price:6500,icon:"⚔️",isMelee:true,visual:"dual"},
    {name:"Espada de Energia",damage:600,fireRate:350,range:150,price:12000,icon:"⚡",isMelee:true,visual:"energyblade"}
];





/* =========================================================
   SISTEMA DE MUNIÇÃO / VISUAIS
   ========================================================= */

function configureWeaponData() {
    weapons.forEach((w, i) => {
        if (w.isMelee) return;
        const n = w.name.toLowerCase();
        let ammoType = "fuzil";
        let ammoPrice = 250;
        if (/pistola|glock|beretta|colt|five|usp|cz 75|magnum|raging/.test(n)) { ammoType = "pistola"; ammoPrice = 100; }
        else if (/uzi|mp5|mp7|p90|vector|mac-|pp-|mpx|ump|ppsh|pps|mp40|thompson/.test(n)) { ammoType = "submetralhadora"; ammoPrice = 150; }
        else if (/shotgun|double barrel|m870|spas|aa-12|saiga|ksg|usas|benelli/.test(n)) { ammoType = "escopeta"; ammoPrice = 200; }
        else if (/sniper|awp|barrett|svd|m24|mosin|kar98|intervention|cheytac|m200/.test(n)) { ammoType = "precisão"; ammoPrice = 300; }
        else if (/rpg|grenade launcher|heavy cannon|mgl|meteor|doom cannon/.test(n)) { ammoType = "explosiva"; ammoPrice = 350; }
        else if (/laser|plasma|railgun|gauss|tesla|shock|ion|energy|death ray|apocalypse|black hole|omega|titan|galaxy|ultimate|arc rifle|incinerator/.test(n)) { ammoType = "energia"; ammoPrice = 400; }
        w.ammoType = ammoType;
        w.ammoPrice = ammoPrice;
        w.visual = w.visual || (i % 14);
    });
    meleeWeapons.forEach((w, i) => { w.ammoType = "corpo a corpo"; w.ammoPrice = 0; w.visual = w.visual || `melee-${i}`; });
}

configureWeaponData();

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
    {name:"Velociraptor",damage:70,price:20000,icon:"🦖"},
    {name:"Urso",damage:90,price:25000,icon:"🐻"},
    {name:"Lobo",damage:80,price:18000,icon:"🐺"},
    {name:"Rinoceronte",damage:130,price:35000,icon:"🦏"},
    {name:"T-Rex",damage:220,price:60000,icon:"🦖"},
    {name:"Dragão",damage:350,price:100000,icon:"🐉"}
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
    {name:"Granada",damage:100,radius:250,price:300,icon:"💣"},
    {name:"Granada Explosiva",damage:180,radius:280,price:600,icon:"💣"},
    {name:"Bomba Pesada",damage:300,radius:310,price:1000,icon:"💥"},
    {name:"C4",damage:500,radius:340,price:1800,icon:"🧨"},
    {name:"Mina Explosiva",damage:350,radius:290,price:1200,icon:"💣"},
    {name:"Bomba Incendiária",damage:250,radius:300,price:1400,icon:"🔥"},
    {name:"Granada de Plasma",damage:600,radius:330,price:3000,icon:"⚡"},
    {name:"Bomba Nuclear",damage:1500,radius:450,price:10000,icon:"☢️"},
    {name:"Bomba Infernal",damage:2500,radius:500,price:20000,icon:"🔥"},
    {name:"Bomba Apocalipse",damage:5000,radius:600,price:40000,icon:"☢️"}
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
    {name:"Walker",health:60,speed:45,damage:5,reward:50,icon:"🧟",color:"#77806e",scale:1,ability:"normal"},
    {name:"Runner",health:45,speed:90,damage:7,reward:50,icon:"🧟‍♂️",color:"#b9b34d",scale:.9,ability:"runner"},
    {name:"Brute",health:180,speed:35,damage:12,reward:50,icon:"👹",color:"#7b5148",scale:1.3,ability:"normal"},
    {name:"Crawler",health:80,speed:70,damage:8,reward:50,icon:"🧟",color:"#596f63",scale:.75,ability:"crawler"},
    {name:"Soldier",health:130,speed:55,damage:10,reward:50,icon:"🪖",color:"#53634e",scale:1.05,ability:"armor"},
    {name:"Mutant",health:300,speed:45,damage:15,reward:50,icon:"👾",color:"#657a5b",scale:1.25,ability:"normal"},
    {name:"Burning",health:220,speed:60,damage:18,reward:50,icon:"🔥",color:"#8a3d28",scale:1.1,ability:"burn"},
    {name:"Toxic",health:250,speed:50,damage:20,reward:50,icon:"☣️",color:"#355d37",scale:1.05,ability:"toxic"},
    {name:"Electric",health:280,speed:75,damage:22,reward:50,icon:"⚡",color:"#315b82",scale:1.05,ability:"electric"},
    {name:"Vampire",health:350,speed:65,damage:24,reward:50,icon:"🧛",color:"#522d55",scale:1.1,ability:"vampire"},
    {name:"Splitter",health:420,speed:40,damage:20,reward:50,icon:"👺",color:"#6d4a2c",scale:1.25,ability:"splitter"},
    {name:"Tank",health:700,speed:25,damage:25,reward:50,icon:"👹",color:"#4b4f55",scale:1.5,ability:"tank"}
];


/* =========================================================
   ESTADO
   ========================================================= */

let player = {
    x:180, y:0, width:34, height:58, speed:250,
    health:MAX_HEALTH_START, maxHealth:MAX_HEALTH_START,
    armor:0, maxArmor:0, money:500,
    weapon:weapons[0], ammo:weapons[0].magazine, reserveAmmo:weapons[0].ammo,
    weaponInventory:[weapons[0]], currentWeaponIndex:0,
    lastShot:0, reloadTime:0, score:0
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
let mouse = {x:0,y:0,down:false};
let friend = null;
let rankingSent = false;

/* =========================================================
   CONTROLES
   ========================================================= */

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === " ") e.preventDefault();
    if (e.key.toLowerCase() === "r") reload();
    if (["1","2","3","4","5"].includes(e.key) && gameRunning) {
        switchWeapon(Number(e.key) - 1);
    }
    if (e.key.toLowerCase() === "e") usePlacementItem();
    if (e.key.toLowerCase() === "b") useUtilityItem();
});
window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });
canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", () => { mouse.down = true; });
canvas.addEventListener("mouseup", () => { mouse.down = false; });
canvas.addEventListener("mouseleave", () => { mouse.down = false; });

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
    if (item.icon) return item.icon;
    if (type === "armas") return "🔫";
    if (type === "corpo-a-corpo") return "⚔️";
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
    if (type === "armas") return `Dano: ${item.damage} | Carregador: ${item.magazine}<br>Munição: ${item.ammoType || "fuzil"}`;
    if (type === "corpo-a-corpo") return `Dano: ${item.damage} | Alcance: ${item.range}`;
    if (type === "armadura") return `Proteção: ${item.armor}`;
    if (type === "amigos") return `Dano: ${item.damage}`;
    if (type === "kits") return item.permanentHealth ? `Vida máxima +${item.permanentHealth} permanentemente` : `Recupera ${item.heal} de vida`;
    if (type === "bombas") return `Dano: ${item.damage} | Área: ${item.radius}`;
    if (type === "armadilhas") return `Dano: ${item.damage}`;
    if (type === "barricadas") return `Resistência: ${item.health}`;
    return "Item especial";
}

/* =========================================================
   LOJA
   ========================================================= */

function renderItems() {
    shopContent.innerHTML = "";
    let items = [];
    if (currentCategory === "armadura") items = armors;
    if (currentCategory === "armas") items = weapons;
    if (currentCategory === "corpo-a-corpo") items = meleeWeapons;
    if (currentCategory === "amigos") items = friends;
    if (currentCategory === "kits") items = kits;
    if (currentCategory === "bombas") items = bombs;
    if (currentCategory === "armadilhas") items = traps;
    if (currentCategory === "barricadas") items = barricades;

    if (currentCategory === "municao") {
        const w = player.weapon;
        const price = w.isMelee ? 0 : (w.ammoPrice || 100);
        shopContent.innerHTML = w.isMelee ? `
            <div class="shop-item"><div class="item-visual">⚔️</div><h3>Arma corpo a corpo</h3><p>${w.name} não usa munição.</p><strong>—</strong></div>` : `
            <div class="shop-item"><div class="item-visual">📦</div><h3>Munição: ${w.ammoType}</h3><p>+${AMMO_PACK_SIZE} balas para ${w.name}.</p><strong>$${price.toLocaleString("pt-BR")}</strong><button onclick="buyAmmo()">COMPRAR</button></div>`;
        return;
    }

    items.forEach((item,index) => {
        const card = document.createElement("div");
        card.className = "shop-item";
        let extra = "";
        if (currentCategory === "armas" || currentCategory === "corpo-a-corpo") {
            const owned = player.weaponInventory.includes(item);
            extra = owned ? " <span style='color:#72d572'>✓ NO INVENTÁRIO</span>" : "";
        }
        card.innerHTML = `
            <div class="item-visual">${itemVisual(item,currentCategory)}</div>
            <h3>${item.name}${extra}</h3>
            <p>${itemDescription(item,currentCategory)}</p>
            <strong>$${item.price.toLocaleString("pt-BR")}</strong>
            <button onclick="buyItem(${index})">COMPRAR</button>`;
        shopContent.appendChild(card);
    });
}

window.buyItem = function(index) {
    let items = [];
    if (currentCategory === "armadura") items = armors;
    if (currentCategory === "armas") items = weapons;
    if (currentCategory === "corpo-a-corpo") items = meleeWeapons;
    if (currentCategory === "amigos") items = friends;
    if (currentCategory === "kits") items = kits;
    if (currentCategory === "bombas") items = bombs;
    if (currentCategory === "armadilhas") items = traps;
    if (currentCategory === "barricadas") items = barricades;
    const item = items[index];
    if (!item) return;
    if (player.money < item.price) { alert("Dinheiro insuficiente!"); return; }

    if (currentCategory === "armas" || currentCategory === "corpo-a-corpo") {
        if (player.weaponInventory.length >= MAX_WEAPON_SLOTS) { alert("Seu inventário de armas está cheio! (5/5)"); return; }
        if (player.weaponInventory.includes(item)) { alert("Você já possui essa arma!"); return; }
        player.money -= item.price;
        if(!item.isMelee){
            item._loadedAmmo=item.magazine;
            if(!player.reserveAmmoByWeapon) player.reserveAmmoByWeapon={};
            player.reserveAmmoByWeapon[item.name]=item.ammo;
        }
        player.weaponInventory.push(item);
        switchWeapon(player.weaponInventory.length - 1);
        updateHUD(); renderWeaponInventory(); renderItems(); return;
    }
    if (currentCategory === "armadura") { player.money -= item.price; player.armor=item.armor; player.maxArmor=item.armor; updateHUD(); renderItems(); return; }
    if (currentCategory === "amigos") { player.money -= item.price; friend={name:item.name,damage:item.damage,icon:item.icon,lastAttack:0}; updateHUD(); renderItems(); return; }
    if (currentCategory === "kits") {
        player.money -= item.price;
        if (item.permanentHealth) { player.maxHealth += item.permanentHealth; player.health += item.permanentHealth; }
        else player.health = Math.min(player.maxHealth, player.health + item.heal);
        updateHUD(); renderItems(); return;
    }
    if (["bombas","armadilhas","barricadas"].includes(currentCategory)) {
        const type = currentCategory === "bombas" ? "bomb" : currentCategory === "armadilhas" ? "trap" : "barricade";
        if (!addInventory({type,item})) { alert("Inventário de utilidades cheio!"); return; }
        player.money -= item.price; renderInventory(); renderItems(); return;
    }
};

window.buyAmmo = function() {
    if (player.weapon.isMelee) { alert("Esta arma não usa munição."); return; }

    const price = player.weapon.ammoPrice || 100;

    if (player.money < price) {
        alert("Dinheiro insuficiente!");
        return;
    }

    if(!player.reserveAmmoByWeapon) player.reserveAmmoByWeapon={};

    player.money -= price;
    player.reserveAmmo += AMMO_PACK_SIZE;
    player.reserveAmmoByWeapon[player.weapon.name]=player.reserveAmmo;

    updateHUD();
    renderItems();
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
    if (typeof menuInventory !== "undefined" && menuInventory) {
        menuInventory.innerHTML = "";
        for (let i=0;i<INVENTORY_SIZE;i++) {
            const slot=document.createElement("div"); slot.className="inventory-slot";
            slot.innerHTML=inventory[i] ? `${itemVisual(inventory[i].item, inventory[i].type === "bomb" ? "bombas" : inventory[i].type === "trap" ? "armadilhas" : "barricadas")}<span class="slot-number">${i+1}</span>` : `<span class="slot-number">${i+1}</span>—`;
            menuInventory.appendChild(slot);
        }
        let title=document.getElementById("weaponInventoryMenuTitle");
        if(!title){ title=document.createElement("div"); title.id="weaponInventoryMenuTitle"; title.className="weapon-inventory-title"; menuInventory.parentElement.appendChild(title); }
        title.textContent=`🔫 ARMAS — ${player.weaponInventory.length}/${MAX_WEAPON_SLOTS} (1–5 durante a partida)`;
        let row=document.getElementById("weaponInventoryMenu");
        if(!row){ row=document.createElement("div"); row.id="weaponInventoryMenu"; row.className="inventory-slots"; menuInventory.parentElement.appendChild(row); }
        row.innerHTML="";
        for(let i=0;i<MAX_WEAPON_SLOTS;i++){ const slot=document.createElement("div"); slot.className="inventory-slot weapon-slot"+(player.currentWeaponIndex===i?" selected":""); slot.innerHTML=player.weaponInventory[i] ? `${itemVisual(player.weaponInventory[i],player.weaponInventory[i].isMelee?"corpo-a-corpo":"armas")}<span class="slot-number">${i+1}</span><span class="slot-name">${player.weaponInventory[i].name}</span>` : `<span class="slot-number">${i+1}</span>—`; row.appendChild(slot); }
    }
    if (typeof gameInventorySlots !== "undefined" && gameInventorySlots) {
        gameInventorySlots.innerHTML="";
        for(let i=0;i<INVENTORY_SIZE;i++){ const slot=document.createElement("div"); slot.className="inventory-slot"; slot.innerHTML=inventory[i] ? `${itemVisual(inventory[i].item, inventory[i].type === "bomb" ? "bombas" : inventory[i].type === "trap" ? "armadilhas" : "barricadas")}<span class="slot-number">${i+1}</span>` : `<span class="slot-number">${i+1}</span>—`; gameInventorySlots.appendChild(slot); }
    }
    renderWeaponInventory();
}

function renderWeaponInventory() {
    const menuRow=document.getElementById("weaponInventoryMenu");
    const gameRow=document.getElementById("gameWeaponSlots");
    [menuRow,gameRow].forEach(row=>{
        if(!row) return; row.innerHTML="";
        for(let i=0;i<MAX_WEAPON_SLOTS;i++){
            const w=player.weaponInventory[i]; const slot=document.createElement("div");
            slot.className="inventory-slot weapon-slot"+(player.currentWeaponIndex===i?" selected":"");
            slot.innerHTML=w ? `${itemVisual(w,w.isMelee?"corpo-a-corpo":"armas")}<span class="slot-number">${i+1}</span><span class="slot-name">${w.name}</span>` : `<span class="slot-number">${i+1}</span>—`;
            row.appendChild(slot);
        }
    });
}

function addInventory(item) { if (inventory.length >= INVENTORY_SIZE) return false; inventory.push(item); return true; }

function useInventory(index) {
    if(!inventory[index]) return; const item=inventory[index];
    if(item.type === "bomb"){ useBomb(item.item); inventory.splice(index,1); }
    else if(item.type === "trap"){ if(preparation){ placeTrap(item.item); inventory.splice(index,1); } }
    else if(item.type === "barricade"){ if(preparation){ placeBarricade(item.item); inventory.splice(index,1); } }
    renderInventory();
}

function useUtilityItem(){ if(inventory.length) useInventory(0); }

function switchWeapon(index){
    if(index<0 || index>=player.weaponInventory.length) return;

    if(!player.reserveAmmoByWeapon) player.reserveAmmoByWeapon={};

    // Guarda a munição da arma atual antes de trocar.
    if(player.weapon && !player.weapon.isMelee){
        player.reserveAmmoByWeapon[player.weapon.name]=player.reserveAmmo;
        player.weapon._loadedAmmo=player.ammo;
    }

    const w=player.weaponInventory[index];
    player.currentWeaponIndex=index;
    player.weapon=w;

    if(w.isMelee){
        player.ammo=0;
        player.reserveAmmo=0;
    }else{
        player.ammo=Number.isFinite(w._loadedAmmo) ? w._loadedAmmo : w.magazine;
        player.reserveAmmo=player.reserveAmmoByWeapon[w.name] ?? w.ammo;
        player.reserveAmmoByWeapon[w.name]=player.reserveAmmo;
    }

    player.reloadTime=0;
    updateHUD();
    renderWeaponInventory();
}

function saveCurrentWeaponAmmo(){
    if(!player.reserveAmmoByWeapon) player.reserveAmmoByWeapon={};
    if(player.weapon && !player.weapon.isMelee){
        player.reserveAmmoByWeapon[player.weapon.name]=player.reserveAmmo;
        player.weapon._loadedAmmo=player.ammo;
    }
}

/* =========================================================
   INICIAR ONDA
   ========================================================= */

function getPreparationDuration() { return Math.max(MIN_PREPARATION_TIME, PREPARATION_TIME - (wave - 1) * 5); }

function startWave() {
    if(gameEnded) return;
    if(!validatePlayerName()) return;
    shopScreen.style.display="none"; hud.style.display="flex"; gameInventory.style.display="block";
    saveCurrentWeaponAmmo();
    if(!player.reserveAmmoByWeapon) player.reserveAmmoByWeapon={};
    gameRunning=true; player.x=180; player.y=canvas.height/2; zombies=[]; bullets=[]; placedTraps=[]; placedBarricades=[];
    preparation=true; waveActive=false; preparationTime=getPreparationDuration();
    updateHUD(); renderInventory();
}

startWaveBtn.addEventListener("click", startWave);

function skipPreparation(){
    if(!preparation || !gameRunning || gameEnded) return;
    preparationTime=0;
    preparation=false;
    waveActive=true;
    if(skipPreparationBtn) skipPreparationBtn.style.display="none";
    spawnWave();
    updateHUD();
}
if (skipPreparationBtn) skipPreparationBtn.addEventListener("click", skipPreparation);

function updatePreparation(dt){
    preparationTime -= dt;
    if(preparationTime <= 0){ preparationTime=0; preparation=false; waveActive=true; spawnWave(); }
}

function spawnWave(){
    zombies=[];
    const amount=5 + wave*3;
    const available = wave >= 5 ? zombieTypes : zombieTypes.slice(0,5);
    for(let i=0;i<amount;i++) {
        const type=available[Math.floor(Math.random()*available.length)];
        const bonusHP = wave >= 5 ? (wave-4)*5 : 0;
        const hp=type.health+bonusHP;
        zombies.push({
            x:canvas.width+60+Math.random()*250,
            y:70+Math.random()*Math.max(100,canvas.height-140),
            width:38*type.scale, height:60*type.scale,
            health:hp, maxHealth:hp, speed:type.speed, damage:type.damage, reward:50,
            type:type.name, icon:type.icon, color:type.color, scale:type.scale, ability:type.ability, attackCooldown:0, abilityCooldown:0
        });
    }
    if(wave % 10 === 0){
        const bossNumber=wave/10;
        const bossHP=500*Math.pow(2,bossNumber-1);
        zombies.push({
            x:canvas.width+120, y:canvas.height/2, width:90, height:130,
            health:bossHP, maxHealth:bossHP, speed:20,
            damage:Math.max(1,Math.ceil(player.maxHealth/3)), reward:5000*Math.pow(2,bossNumber-1),
            type:"Boss", icon:"💀", color:"#6d1010", scale:2.1, ability:"boss", attackCooldown:0, abilityCooldown:0
        });
    }
    updateHUD();
}

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

function shoot(){
    if(!waveActive) return;
    const now=performance.now();
    if(now-player.lastShot < player.weapon.fireRate) return;
    player.lastShot=now;
    if(player.weapon.isMelee){
        const angle=Math.atan2(mouse.y-player.y,mouse.x-player.x);
        for(let i=zombies.length-1;i>=0;i--){
            const z=zombies[i]; const dx=z.x-player.x, dy=z.y-player.y; const dist=Math.hypot(dx,dy);
            if(dist<=player.weapon.range){
                const a=Math.atan2(dy,dx); let diff=Math.atan2(Math.sin(a-angle),Math.cos(a-angle));
                if(Math.abs(diff)<0.75){ z.health-=player.weapon.damage; if(z.health<=0){ player.money+=z.reward; player.score+=z.reward; zombies.splice(i,1); } }
            }
        }
        updateHUD(); return;
    }
    if(player.ammo<=0){ reload(); return; }
    player.ammo--;
    const angle=Math.atan2(mouse.y-player.y,mouse.x-player.x);
    bullets.push({x:player.x,y:player.y,vx:Math.cos(angle)*1000,vy:Math.sin(angle)*1000,damage:player.weapon.damage,life:player.weapon.range/1000,weapon:player.weapon});
    saveCurrentWeaponAmmo(); updateHUD();
}

/* =========================================================
   RECARREGAR
   ========================================================= */

function reload(){
    if(player.weapon.isMelee) return;
    if(player.reloadTime>0 || player.ammo>=player.weapon.magazine || player.reserveAmmo<=0) return;
    player.reloadTime=1.3;
}

function updateReload(dt) {

    if (player.weapon.isMelee) return;
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

            player.reserveAmmo -= amount;
            saveCurrentWeaponAmmo();
            if(!player.reserveAmmoByWeapon) player.reserveAmmoByWeapon={};
            player.reserveAmmoByWeapon[player.weapon.name]=player.reserveAmmo;
            player.weapon._loadedAmmo=player.ammo;
            updateHUD();
        }
    }
}


/* =========================================================
   MORTE DE ZUMBI
   ========================================================= */

function killZombie(index){
    const z=zombies[index];
    if(!z) return;

    player.money += z.reward;
    player.score += z.reward;

    // Splitter cria dois corredores fracos sem recompensa extra.
    if(z.ability === "splitter" && !z.hasSplit){
        for(let n=0;n<2;n++){
            const hp=Math.max(25, Math.floor(z.maxHealth*0.22));
            zombies.push({
                x:z.x + (n===0 ? -18 : 18),
                y:z.y + (n===0 ? -12 : 12),
                width:24,
                height:38,
                health:hp,
                maxHealth:hp,
                speed:105,
                damage:8,
                reward:50,
                type:"Runner",
                icon:"🧟",
                color:"#c9b84b",
                scale:.62,
                ability:"runner",
                attackCooldown:0,
                abilityCooldown:0,
                hasSplit:true
            });
        }
    }

    zombies.splice(index,1);
}

function damageZombie(z, amount){
    z.health -= amount;
}

function rewardAndRemoveZombie(z){
    const index=zombies.indexOf(z);
    if(index!==-1) killZombie(index);
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

                    killZombie(j);
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

function updateZombies(dt){
    for(let i=zombies.length-1;i>=0;i--){
        const z=zombies[i]; const dx=player.x-z.x, dy=player.y-z.y; const distance=Math.hypot(dx,dy);
        if(z.ability === "runner" && z.abilityCooldown<=0 && distance>120){ z.speed*=1.8; z.abilityCooldown=2; }
        if(z.abilityCooldown>0) z.abilityCooldown-=dt;
        if(z.ability === "runner" && z.abilityCooldown<=0 && z.speed>90) z.speed=Math.max(90,z.speed/1.8);
        if(distance>55){ z.x+=(dx/distance)*z.speed*dt; z.y+=(dy/distance)*z.speed*dt; }
        else {
            z.attackCooldown-=dt;
            if(z.attackCooldown<=0){
                damagePlayer(z.damage,z.type === "Boss"); z.attackCooldown=z.type === "Boss" ? 0.8 : 0.8;
                if(z.ability === "vampire") z.health=Math.min(z.maxHealth,z.health+35);
            }
        }
        if(z.ability === "burn" && distance<220) damagePlayer(2*dt,false);
        if(z.ability === "toxic" && distance<260) damagePlayer(3*dt,false);
        if(z.ability === "electric" && distance<190 && z.abilityCooldown<=0){ damagePlayer(10,false); z.abilityCooldown=3; }
        if(z.ability === "tank") z.speed=25;

        // Crawler: fica mais rápido quando está muito perto.
        if(z.ability === "crawler" && distance < 220) z.speed = 105;

        // Soldier: reduz parte do dano recebido.
        if(z.ability === "armor") z.damage = Math.max(10, z.damage);

        // Splitter: ao morrer, pode deixar dois pequenos corredores.
        // A criação é tratada pelo sistema de morte para não duplicar recompensas.
    }
    if(friend){
        const nearest=zombies.reduce((closest,z)=>{ if(!closest)return z; const d1=Math.hypot(z.x-player.x,z.y-player.y),d2=Math.hypot(closest.x-player.x,closest.y-player.y); return d1<d2?z:closest; },null);
        if(nearest && Math.hypot(nearest.x-player.x,nearest.y-player.y)<500){
            const now=performance.now(); if(now-friend.lastAttack>700){ nearest.health-=friend.damage; friend.lastAttack=now; if(nearest.health<=0){ killZombie(zombies.indexOf(nearest)); } }
        }
    }
}

/* =========================================================
   DANO
   ========================================================= */

function damagePlayer(amount,isBoss=false){
    let remaining=amount;
    if(isBoss){ player.health-=remaining; }
    else {
        if(player.armor>0){ const absorbed=Math.min(player.armor,remaining); player.armor-=absorbed; remaining-=absorbed; }
        player.health-=remaining;
    }
    if(player.health<=0){ player.health=0; endGame(); }
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

                killZombie(i);
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

                    killZombie(i);
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

function checkWaveComplete(){
    if(waveActive && zombies.length===0){
        waveActive=false; wave++;
        setTimeout(()=>{
            if(gameEnded)return;
            gameRunning=false; preparation=false; waveActive=false;
            if(hud) hud.style.display="none";
            if(gameInventory) gameInventory.style.display="none";
            if(skipPreparationBtn) skipPreparationBtn.style.display="none";
            if(shopScreen) shopScreen.style.display="block";
            renderItems(); renderInventory(); updateHUD();
        },1200);
    }
}

/* =========================================================
   PRÓXIMA PREPARAÇÃO
   ========================================================= */

function startPreparation(){ waveActive=false; preparation=true; preparationTime=getPreparationDuration(); gameRunning=true; updateHUD(); }

/* =========================================================
   HUD
   ========================================================= */

function updateHUD(){
    if(!healthBar) return;
    const name=getPlayerName()||"Jogador"; nameHud.textContent=name;
    healthBar.style.width=`${Math.max(0,(player.health/player.maxHealth)*100)}%`;
    if(armorBar){ const armorPercent=player.maxArmor>0?(player.armor/player.maxArmor)*100:0; armorBar.style.width=`${Math.max(0,armorPercent)}%`; }
    if(preparation){ waveEl.textContent=`PREPARAÇÃO — ${Math.ceil(preparationTime)}s`; enemiesEl.textContent="🪤 COLOQUE SUAS DEFESAS"; }
    else { waveEl.textContent=`ONDA ${wave}`; enemiesEl.textContent=`Zumbis: ${zombies.length}`; }
    weaponEl.textContent=player.weapon.name.toUpperCase();
    ammoEl.textContent=player.weapon.isMelee ? "CORPO A CORPO" : `${player.ammo} / ${player.reserveAmmo}`;
    moneyHud.textContent=`💵 $${player.money}`; moneyEl.textContent=player.money;
    startWaveBtn.textContent=preparation ? `⏱️ PREPARAÇÃO: ${Math.ceil(preparationTime)}s` : "▶ INICIAR ONDA";
    if(skipPreparationBtn) skipPreparationBtn.style.display=preparation ? "block" : "none";
    renderWeaponInventory();
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


    /* arma individual */
    drawCurrentWeapon();


    ctx.restore();
}


function drawCurrentWeapon(){
    const w=player.weapon;
    ctx.save();
    ctx.translate(24,0);
    ctx.lineCap="round";
    const v=w.visual;
    if(w.isMelee){
        ctx.strokeStyle="#c7c7c7"; ctx.lineWidth=5;
        if(["knife","machete"].includes(v)){ ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(28,-10);ctx.stroke(); }
        else if(v==="axe"){ctx.strokeStyle="#8d8d8d";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(28,0);ctx.stroke();ctx.lineWidth=10;ctx.strokeRect(24,-12,5,24);}
        else if(v==="bat"){ctx.strokeStyle="#7b5636";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(38,0);ctx.stroke();}
        else if(v==="crowbar"){ctx.strokeStyle="#9a9a9a";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(35,0);ctx.stroke();}
        else if(v==="hammer"){ctx.strokeStyle="#777";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(27,0);ctx.stroke();ctx.fillStyle="#555";ctx.fillRect(23,-9,14,18);}
        else if(v==="spear"){ctx.strokeStyle="#805c36";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(48,0);ctx.stroke();ctx.fillStyle="#c0c0c0";ctx.beginPath();ctx.moveTo(48,0);ctx.lineTo(38,-6);ctx.lineTo(38,6);ctx.closePath();ctx.fill();}
        else if(v==="scythe"){ctx.strokeStyle="#777";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(35,0);ctx.stroke();ctx.beginPath();ctx.arc(36,-8,14,0,Math.PI);ctx.stroke();}
        else if(v==="chain"){ctx.strokeStyle="#aaa";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(42,0);ctx.stroke();}
        else if(v==="sword"){ctx.strokeStyle="#d5d5d5";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(42,0);ctx.stroke();}
        else if(v==="dual"){ctx.strokeStyle="#d5d5d5";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(35,-12);ctx.moveTo(0,4);ctx.lineTo(35,12);ctx.stroke();}
        else {ctx.strokeStyle="#39d9ff";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(38,0);ctx.stroke();}
    } else {
        ctx.fillStyle="#090909";
        const name=w.name.toLowerCase();
        if(/shotgun|spas|saiga|ksg|usas|benelli|double barrel|m870/.test(name)){ctx.fillRect(0,-7,42,9);ctx.fillRect(3,2,13,9); if(/double/.test(name))ctx.fillRect(0,-12,42,4);}
        else if(/sniper|awp|barrett|m24|mosin|kar98|intervention|cheytac|m200|dragunov/.test(name)){ctx.fillRect(0,-5,55,6);ctx.fillRect(7,1,13,9);}
        else if(/rpg|cannon|launcher|meteor/.test(name)){ctx.fillRect(0,-8,48,14);ctx.fillRect(8,6,15,8);}
        else if(/laser|plasma|railgun|gauss|tesla|shock|ion|energy|death|apocalypse|black hole|omega|titan|galaxy|ultimate|arc|incinerator/.test(name)){ctx.fillStyle="#2f6575";ctx.fillRect(0,-6,48,9);ctx.fillStyle="#7cecff";ctx.fillRect(35,-4,15,5);}
        else if(/uzi|mp5|mp7|p90|vector|mac|mpx|ump|pp-|ppsh|pps|mp40|thompson/.test(name)){ctx.fillRect(0,-5,34,7);ctx.fillRect(4,2,10,13);ctx.fillRect(18,-2,8,12);}
        else {ctx.fillRect(0,-5,36,7);ctx.fillRect(8,2,9,11);ctx.fillRect(29,-4,12,4);}
    }
    ctx.restore();
}

function drawZombie(z){
    ctx.save(); ctx.translate(z.x,z.y); ctx.scale(z.scale||1,z.scale||1);
    ctx.fillStyle="#292929"; ctx.fillRect(-13,18,10,28); ctx.fillRect(3,18,10,28);
    ctx.fillStyle=z.color||"#3b403d"; ctx.fillRect(-18,-10,36,34);
    ctx.fillStyle="#596057"; ctx.fillRect(-35,-5,20,9); ctx.fillRect(15,-5,20,9);
    ctx.fillStyle=z.color||"#77806e"; ctx.beginPath(); ctx.arc(0,-24,15,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=z.type==="Electric"?"#8be8ff":"#ff2222"; ctx.fillRect(-7,-28,5,5);ctx.fillRect(2,-28,5,5);
    ctx.fillStyle="#111";ctx.fillRect(-7,-18,14,4);
    if(z.type==="Burning"){ctx.fillStyle="#ff6b00";ctx.beginPath();ctx.arc(0,5,9,0,Math.PI*2);ctx.fill();}
    if(z.type==="Toxic"){ctx.fillStyle="#9cff55";ctx.beginPath();ctx.arc(12,5,6,0,Math.PI*2);ctx.fill();}
    if(z.type==="Electric"){ctx.fillStyle="#b5f4ff";ctx.fillRect(-22,-36,5,15);ctx.fillRect(17,-36,5,15);}
    if(z.type==="Tank"){ctx.strokeStyle="#a6a6a6";ctx.lineWidth=5;ctx.strokeRect(-22,-40,44,65);}
    if(z.type==="Boss"){ctx.strokeStyle="#ff0000";ctx.lineWidth=4;ctx.strokeRect(-31,-55,62,95);ctx.fillStyle="#8d1111";ctx.fillRect(-25,-48,50,7);}
    const barWidth=z.type==="Boss"?90:55; ctx.fillStyle="#222";ctx.fillRect(-barWidth/2,-50,barWidth,6);ctx.fillStyle="#e33";ctx.fillRect(-barWidth/2,-50,barWidth*Math.max(0,z.health/z.maxHealth),6);
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

    player.y = canvas.height / 2;
    player.reserveAmmoByWeapon = { [weapons[0].name]: weapons[0].ammo };
    weapons[0]._loadedAmmo = weapons[0].magazine;


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


    if (gameInventory && !document.getElementById("gameWeaponSlots")) {
        const title=document.createElement("div"); title.className="weapon-inventory-title"; title.textContent="🔫 ARMAS (1–5)"; gameInventory.appendChild(title);
        const row=document.createElement("div"); row.id="gameWeaponSlots"; row.className="weapon-slots-row"; gameInventory.appendChild(row);
    }
    renderItems();
    renderInventory();
    updateHUD();
}


init();


requestAnimationFrame(
    gameLoop
);
