"use strict";

/* =====================================================
   THEY ARE COMING
   VERSÃO CORRIGIDA
===================================================== */


/* =====================================================
   ELEMENTOS
===================================================== */

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
const preparationText = document.getElementById("preparationText");

const weaponEl = document.getElementById("weapon");
const ammoEl = document.getElementById("ammo");
const moneyHud = document.getElementById("moneyHud");

const gameInventory = document.getElementById("gameInventory");
const gameInventorySlots =
    document.getElementById("gameInventorySlots");

const menuInventory =
    document.getElementById("menuInventory");

const skipPreparationBtn =
    document.getElementById("skipPreparationBtn");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const restartBtn =
    document.getElementById("restartBtn");


/* =====================================================
   CONFIGURAÇÃO
===================================================== */

const MAX_HEALTH_START = 100;
const INVENTORY_SIZE = 5;

const NORMAL_ZOMBIE_REWARD = 50;

const BOSS_BASE_HP = 500;
const BOSS_BASE_REWARD = 5000;

const BOMB_RANGE_BONUS = 150;


/* =====================================================
   CANVAS
===================================================== */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =====================================================
   ARMAS
===================================================== */

const weapons = [

    {
        name: "Pistola",
        damage: 18,
        fireRate: 350,
        magazine: 12,
        ammo: 60,
        price: 300,
        range: 700,
        ammoType: "9mm",
        ammoPrice: 100,
        visual: "🔫"
    },

    {
        name: "Glock 17",
        damage: 20,
        fireRate: 300,
        magazine: 17,
        ammo: 85,
        price: 450,
        range: 700,
        ammoType: "9mm",
        ammoPrice: 100,
        visual: "🔫"
    },

    {
        name: "Desert Eagle",
        damage: 45,
        fireRate: 650,
        magazine: 7,
        ammo: 35,
        price: 900,
        range: 750,
        ammoType: ".50 AE",
        ammoPrice: 150,
        visual: "🔫"
    },

    {
        name: "Uzi",
        damage: 15,
        fireRate: 100,
        magazine: 32,
        ammo: 160,
        price: 850,
        range: 650,
        ammoType: "9mm SMG",
        ammoPrice: 200,
        visual: "🔫"
    },

    {
        name: "MP5",
        damage: 20,
        fireRate: 110,
        magazine: 30,
        ammo: 150,
        price: 1200,
        range: 700,
        ammoType: "9mm SMG",
        ammoPrice: 200,
        visual: "🔫"
    },

    {
        name: "MP7",
        damage: 18,
        fireRate: 85,
        magazine: 40,
        ammo: 200,
        price: 1400,
        range: 680,
        ammoType: "4.6mm",
        ammoPrice: 250,
        visual: "🔫"
    },

    {
        name: "P90",
        damage: 19,
        fireRate: 75,
        magazine: 50,
        ammo: 250,
        price: 1700,
        range: 700,
        ammoType: "5.7mm",
        ammoPrice: 300,
        visual: "🔫"
    },

    {
        name: "Shotgun",
        damage: 65,
        fireRate: 850,
        magazine: 6,
        ammo: 36,
        price: 1100,
        range: 450,
        ammoType: "12 Gauge",
        ammoPrice: 350,
        visual: "🔫"
    },

    {
        name: "Double Barrel",
        damage: 95,
        fireRate: 1100,
        magazine: 2,
        ammo: 24,
        price: 1500,
        range: 430,
        ammoType: "12 Gauge",
        ammoPrice: 350,
        visual: "🔫"
    },

    {
        name: "M870",
        damage: 72,
        fireRate: 750,
        magazine: 8,
        ammo: 48,
        price: 1800,
        range: 500,
        ammoType: "12 Gauge",
        ammoPrice: 350,
        visual: "🔫"
    },

    {
        name: "AK-47",
        damage: 32,
        fireRate: 150,
        magazine: 30,
        ammo: 150,
        price: 2200,
        range: 800,
        ammoType: "7.62mm",
        ammoPrice: 400,
        visual: "🔫"
    },

    {
        name: "AK-74",
        damage: 35,
        fireRate: 145,
        magazine: 30,
        ammo: 150,
        price: 2400,
        range: 800,
        ammoType: "5.45mm",
        ammoPrice: 450,
        visual: "🔫"
    },

    {
        name: "M4",
        damage: 30,
        fireRate: 120,
        magazine: 30,
        ammo: 180,
        price: 2300,
        range: 850,
        ammoType: "5.56mm",
        ammoPrice: 500,
        visual: "🔫"
    },

    {
        name: "M16",
        damage: 34,
        fireRate: 130,
        magazine: 30,
        ammo: 180,
        price: 2500,
        range: 900,
        ammoType: "5.56mm",
        ammoPrice: 500,
        visual: "🔫"
    },

    {
        name: "SCAR",
        damage: 40,
        fireRate: 170,
        magazine: 20,
        ammo: 120,
        price: 2800,
        range: 900,
        ammoType: "7.62mm",
        ammoPrice: 400,
        visual: "🔫"
    },

    {
        name: "FAMAS",
        damage: 31,
        fireRate: 100,
        magazine: 25,
        ammo: 150,
        price: 2500,
        range: 820,
        ammoType: "5.56mm",
        ammoPrice: 500,
        visual: "🔫"
    },

    {
        name: "G36",
        damage: 34,
        fireRate: 115,
        magazine: 30,
        ammo: 180,
        price: 2700,
        range: 850,
        ammoType: "5.56mm",
        ammoPrice: 500,
        visual: "🔫"
    },

    {
        name: "AUG",
        damage: 38,
        fireRate: 120,
        magazine: 30,
        ammo: 180,
        price: 2900,
        range: 900,
        ammoType: "5.56mm",
        ammoPrice: 500,
        visual: "🔫"
    },

    {
        name: "M249",
        damage: 42,
        fireRate: 95,
        magazine: 100,
        ammo: 500,
        price: 4000,
        range: 900,
        ammoType: "5.56mm MG",
        ammoPrice: 550,
        visual: "🔫"
    },

    {
        name: "PKM",
        damage: 45,
        fireRate: 105,
        magazine: 100,
        ammo: 500,
        price: 4500,
        range: 950,
        ammoType: "7.62mm MG",
        ammoPrice: 600,
        visual: "🔫"
    },

    {
        name: "Sniper",
        damage: 150,
        fireRate: 1100,
        magazine: 5,
        ammo: 30,
        price: 3500,
        range: 1500,
        ammoType: "Sniper",
        ammoPrice: 650,
        visual: "🎯"
    },

    {
        name: "AWP",
        damage: 220,
        fireRate: 1400,
        magazine: 5,
        ammo: 25,
        price: 5000,
        range: 1700,
        ammoType: "Heavy Sniper",
        ammoPrice: 700,
        visual: "🎯"
    },

    {
        name: "Barrett",
        damage: 300,
        fireRate: 1800,
        magazine: 10,
        ammo: 50,
        price: 6500,
        range: 1900,
        ammoType: "Anti-Material",
        ammoPrice: 750,
        visual: "🎯"
    },

    {
        name: "RPG",
        damage: 500,
        fireRate: 2200,
        magazine: 1,
        ammo: 10,
        price: 7000,
        range: 1200,
        ammoType: "Rocket",
        ammoPrice: 800,
        visual: "🚀"
    },

    {
        name: "Minigun",
        damage: 28,
        fireRate: 40,
        magazine: 200,
        ammo: 1000,
        price: 8000,
        range: 1000,
        ammoType: "Minigun",
        ammoPrice: 850,
        visual: "🔫"
    },

    {
        name: "Railgun",
        damage: 800,
        fireRate: 2200,
        magazine: 3,
        ammo: 18,
        price: 10000,
        range: 1800,
        ammoType: "Rail",
        ammoPrice: 900,
        visual: "⚡"
    },

    {
        name: "Laser Gun",
        damage: 100,
        fireRate: 80,
        magazine: 100,
        ammo: 500,
        price: 9000,
        range: 1200,
        ammoType: "Laser",
        ammoPrice: 950,
        visual: "🔴"
    },

    {
        name: "Plasma Rifle",
        damage: 180,
        fireRate: 250,
        magazine: 30,
        ammo: 150,
        price: 12000,
        range: 1300,
        ammoType: "Plasma",
        ammoPrice: 1000,
        visual: "🟣"
    },

    {
        name: "Doom Cannon",
        damage: 1200,
        fireRate: 3000,
        magazine: 1,
        ammo: 10,
        price: 20000,
        range: 1600,
        ammoType: "Doom",
        ammoPrice: 1050,
        visual: "💀"
    },

    /* 20 NOVAS ARMAS */

    {
        name: "Beretta M9",
        damage: 22,
        fireRate: 280,
        magazine: 15,
        ammo: 90,
        price: 500,
        range: 700,
        ammoType: "Beretta",
        ammoPrice: 150,
        visual: "🔫"
    },

    {
        name: "Colt 1911",
        damage: 30,
        fireRate: 420,
        magazine: 8,
        ammo: 48,
        price: 650,
        range: 700,
        ammoType: "45 ACP",
        ammoPrice: 200,
        visual: "🔫"
    },

    {
        name: "Five Seven",
        damage: 24,
        fireRate: 250,
        magazine: 20,
        ammo: 120,
        price: 850,
        range: 720,
        ammoType: "5.7mm",
        ammoPrice: 300,
        visual: "🔫"
    },

    {
        name: "USP Tactical",
        damage: 28,
        fireRate: 300,
        magazine: 12,
        ammo: 72,
        price: 1000,
        range: 760,
        ammoType: "USP",
        ammoPrice: 250,
        visual: "🔫"
    },

    {
        name: "Magnum 44",
        damage: 70,
        fireRate: 800,
        magazine: 6,
        ammo: 36,
        price: 1600,
        range: 850,
        ammoType: "44 Magnum",
        ammoPrice: 250,
        visual: "🔫"
    },

    {
        name: "MAC-10",
        damage: 17,
        fireRate: 90,
        magazine: 30,
        ammo: 180,
        price: 1000,
        range: 620,
        ammoType: "SMG Ammo",
        ammoPrice: 200,
        visual: "🔫"
    },

    {
        name: "UMP45",
        damage: 30,
        fireRate: 125,
        magazine: 25,
        ammo: 150,
        price: 1900,
        range: 750,
        ammoType: "45 SMG",
        ammoPrice: 300,
        visual: "🔫"
    },

    {
        name: "PPSh-41",
        damage: 24,
        fireRate: 80,
        magazine: 71,
        ammo: 355,
        price: 2400,
        range: 650,
        ammoType: "7.62 Soviet",
        ammoPrice: 400,
        visual: "🔫"
    },

    {
        name: "HK416",
        damage: 42,
        fireRate: 100,
        magazine: 30,
        ammo: 210,
        price: 3500,
        range: 950,
        ammoType: "HK 5.56",
        ammoPrice: 550,
        visual: "🔫"
    },

    {
        name: "G3",
        damage: 55,
        fireRate: 220,
        magazine: 20,
        ammo: 120,
        price: 4000,
        range: 1000,
        ammoType: "G3 7.62",
        ammoPrice: 600,
        visual: "🔫"
    },

    {
        name: "FAL",
        damage: 58,
        fireRate: 200,
        magazine: 20,
        ammo: 120,
        price: 4200,
        range: 1050,
        ammoType: "FAL 7.62",
        ammoPrice: 600,
        visual: "🔫"
    },

    {
        name: "M14",
        damage: 60,
        fireRate: 260,
        magazine: 20,
        ammo: 120,
        price: 3800,
        range: 1100,
        ammoType: "M14",
        ammoPrice: 650,
        visual: "🎯"
    },

    {
        name: "SVD Dragunov",
        damage: 180,
        fireRate: 900,
        magazine: 10,
        ammo: 60,
        price: 5500,
        range: 1500,
        ammoType: "SVD",
        ammoPrice: 700,
        visual: "🎯"
    },

    {
        name: "M24",
        damage: 210,
        fireRate: 1200,
        magazine: 5,
        ammo: 35,
        price: 5200,
        range: 1600,
        ammoType: "M24",
        ammoPrice: 700,
        visual: "🎯"
    },

    {
        name: "SPAS-12",
        damage: 85,
        fireRate: 700,
        magazine: 8,
        ammo: 48,
        price: 3200,
        range: 520,
        ammoType: "SPAS",
        ammoPrice: 350,
        visual: "🔫"
    },

    {
        name: "AA-12",
        damage: 55,
        fireRate: 130,
        magazine: 20,
        ammo: 160,
        price: 5000,
        range: 500,
        ammoType: "AA12",
        ammoPrice: 400,
        visual: "🔫"
    },

    {
        name: "Flamethrower",
        damage: 75,
        fireRate: 100,
        magazine: 150,
        ammo: 750,
        price: 7000,
        range: 450,
        ammoType: "Fuel",
        ammoPrice: 800,
        visual: "🔥"
    },

    {
        name: "Grenade Launcher",
        damage: 400,
        fireRate: 1800,
        magazine: 6,
        ammo: 30,
        price: 6500,
        range: 1100,
        ammoType: "40mm",
        ammoPrice: 850,
        visual: "💥"
    },

    {
        name: "Gauss Rifle",
        damage: 700,
        fireRate: 1800,
        magazine: 5,
        ammo: 25,
        price: 8500,
        range: 1800,
        ammoType: "Gauss",
        ammoPrice: 900,
        visual: "⚡"
    },

    {
        name: "Death Ray",
        damage: 1500,
        fireRate: 3000,
        magazine: 3,
        ammo: 15,
        price: 18000,
        range: 2000,
        ammoType: "Death Energy",
        ammoPrice: 1050,
        visual: "☠️"
    },

    {
        name: "Galaxy Blaster",
        damage: 5000,
        fireRate: 4500,
        magazine: 2,
        ammo: 10,
        price: 50000,
        range: 2500,
        ammoType: "Galaxy",
        ammoPrice: 1200,
        visual: "🌌"
    }
];


/* =====================================================
   15 ARMAS CORPO A CORPO
===================================================== */

const meleeWeapons = [

    {
        name: "Faca",
        damage: 45,
        range: 85,
        cooldown: 450,
        price: 250,
        visual: "🔪"
    },

    {
        name: "Faca Militar",
        damage: 65,
        range: 90,
        cooldown: 420,
        price: 500,
        visual: "🔪"
    },

    {
        name: "Facão",
        damage: 90,
        range: 100,
        cooldown: 550,
        price: 800,
        visual: "🗡️"
    },

    {
        name: "Machado",
        damage: 130,
        range: 100,
        cooldown: 750,
        price: 1200,
        visual: "🪓"
    },

    {
        name: "Machado Pesado",
        damage: 220,
        range: 110,
        cooldown: 950,
        price: 2000,
        visual: "🪓"
    },

    {
        name: "Taco",
        damage: 75,
        range: 100,
        cooldown: 500,
        price: 450,
        visual: "🏏"
    },

    {
        name: "Taco de Metal",
        damage: 120,
        range: 105,
        cooldown: 600,
        price: 1000,
        visual: "🏏"
    },

    {
        name: "Marreta",
        damage: 250,
        range: 100,
        cooldown: 1000,
        price: 2500,
        visual: "🔨"
    },

    {
        name: "Katana",
        damage: 180,
        range: 120,
        cooldown: 600,
        price: 3500,
        visual: "⚔️"
    },

    {
        name: "Espada",
        damage: 210,
        range: 120,
        cooldown: 650,
        price: 4000,
        visual: "⚔️"
    },

    {
        name: "Espada Pesada",
        damage: 350,
        range: 125,
        cooldown: 950,
        price: 6500,
        visual: "⚔️"
    },

    {
        name: "Lança",
        damage: 280,
        range: 160,
        cooldown: 850,
        price: 5000,
        visual: "🔱"
    },

    {
        name: "Corrente",
        damage: 160,
        range: 145,
        cooldown: 700,
        price: 3000,
        visual: "⛓️"
    },

    {
        name: "Martelo de Guerra",
        damage: 450,
        range: 125,
        cooldown: 1200,
        price: 9000,
        visual: "🔨"
    },

    {
        name: "Lâmina Omega",
        damage: 1000,
        range: 150,
        cooldown: 1000,
        price: 20000,
        visual: "⚔️"
    }
];


/* =====================================================
   ARMADURAS
===================================================== */

const armors = [

    {
        name: "Colete Leve",
        armor: 20,
        price: 500,
        visual: "🛡️"
    },

    {
        name: "Colete Tático",
        armor: 40,
        price: 1200,
        visual: "🛡️"
    },

    {
        name: "Armadura Pesada",
        armor: 60,
        price: 2500,
        visual: "🛡️"
    },

    {
        name: "Armadura Militar",
        armor: 80,
        price: 4500,
        visual: "🛡️"
    },

    {
        name: "Armadura Especial",
        armor: 100,
        price: 7000,
        visual: "🛡️"
    }
];


/* =====================================================
   AMIGOS
===================================================== */

const friends = [

    {
        name: "Cachorro",
        damage: 10,
        price: 1000,
        icon: "🐕"
    },

    {
        name: "Rottweiler",
        damage: 18,
        price: 2000,
        icon: "🐕"
    },

    {
        name: "Leopardo",
        damage: 25,
        price: 3500,
        icon: "🐆"
    },

    {
        name: "Tigre",
        damage: 35,
        price: 5000,
        icon: "🐅"
    },

    {
        name: "Leão",
        damage: 50,
        price: 7500,
        icon: "🦁"
    },

    {
        name: "Velociraptor",
        damage: 70,
        price: 20000,
        icon: "🦖"
    },

    {
        name: "Lobo",
        damage: 80,
        price: 10000,
        icon: "🐺"
    },

    {
        name: "Urso",
        damage: 100,
        price: 15000,
        icon: "🐻"
    },

    {
        name: "Gorila",
        damage: 130,
        price: 25000,
        icon: "🦍"
    },

    {
        name: "T-Rex",
        damage: 200,
        price: 50000,
        icon: "🦖"
    },

    {
        name: "Dragão",
        damage: 300,
        price: 100000,
        icon: "🐉"
    }
];


/* =====================================================
   KITS
===================================================== */

const kits = [

    {
        name: "Kit Médico",
        heal: 30,
        price: 300,
        icon: "🩹"
    },

    {
        name: "Kit Médico Grande",
        heal: 70,
        price: 700,
        icon: "🏥"
    },

    {
        name: "+5 Vida",
        permanentHealth: 5,
        price: 1000,
        icon: "❤️"
    }
];


/* =====================================================
   BOMBAS
   +150 DE RAIO
===================================================== */

const bombs = [

    {
        name: "Granada",
        damage: 100,
        radius: 100 + BOMB_RANGE_BONUS,
        price: 300,
        icon: "💣"
    },

    {
        name: "Granada Explosiva",
        damage: 180,
        radius: 130 + BOMB_RANGE_BONUS,
        price: 600,
        icon: "💣"
    },

    {
        name: "Bomba Pesada",
        damage: 300,
        radius: 160 + BOMB_RANGE_BONUS,
        price: 1000,
        icon: "💥"
    },

    {
        name: "C4",
        damage: 500,
        radius: 190 + BOMB_RANGE_BONUS,
        price: 1800,
        icon: "🧨"
    },

    {
        name: "Bomba Incendiária",
        damage: 250,
        radius: 150 + BOMB_RANGE_BONUS,
        price: 1400,
        icon: "🔥"
    },

    {
        name: "Granada de Plasma",
        damage: 600,
        radius: 180 + BOMB_RANGE_BONUS,
        price: 3000,
        icon: "⚡"
    },

    {
        name: "Bomba Nuclear",
        damage: 1500,
        radius: 300 + BOMB_RANGE_BONUS,
        price: 10000,
        icon: "☢️"
    },

    {
        name: "Bomba Infernal",
        damage: 2500,
        radius: 350 + BOMB_RANGE_BONUS,
        price: 20000,
        icon: "🔥"
    },

    {
        name: "Bomba Apocalipse",
        damage: 5000,
        radius: 450 + BOMB_RANGE_BONUS,
        price: 40000,
        icon: "☢️"
    }
];


/* =====================================================
   ARMADILHAS
===================================================== */

const traps = [

    {
        name: "Espinhos",
        damage: 30,
        price: 150,
        icon: "🪤"
    },

    {
        name: "Armadilha de Ferro",
        damage: 60,
        price: 300,
        icon: "⚙️"
    },

    {
        name: "Lâminas",
        damage: 100,
        price: 600,
        icon: "⚔️"
    },

    {
        name: "Armadilha Elétrica",
        damage: 150,
        price: 900,
        icon: "⚡"
    },

    {
        name: "Fogo",
        damage: 200,
        price: 1200,
        icon: "🔥"
    },

    {
        name: "Tesla Trap",
        damage: 450,
        price: 2500,
        icon: "⚡"
    },

    {
        name: "Laser Trap",
        damage: 600,
        price: 4000,
        icon: "🔴"
    },

    {
        name: "Plasma Trap",
        damage: 1000,
        price: 7000,
        icon: "🟣"
    },

    {
        name: "Death Trap",
        damage: 2000,
        price: 12000,
        icon: "☠️"
    }
];


/* =====================================================
   BARRICADAS
===================================================== */

const barricades = [

    {
        name: "Barricada de Madeira",
        health: 100,
        price: 200,
        icon: "🧱"
    },

    {
        name: "Barricada Reforçada",
        health: 250,
        price: 500,
        icon: "🧱"
    },

    {
        name: "Barricada de Ferro",
        health: 500,
        price: 1000,
        icon: "🔩"
    },

    {
        name: "Muralha de Ferro",
        health: 1000,
        price: 2500,
        icon: "🏗️"
    },

    {
        name: "Muralha Militar",
        health: 2000,
        price: 5000,
        icon: "🛡️"
    },

    {
        name: "Muralha Blindada",
        health: 4000,
        price: 9000,
        icon: "🏰"
    },

    {
        name: "Muralha Titan",
        health: 15000,
        price: 25000,
        icon: "🛡️"
    },

    {
        name: "Fortaleza",
        health: 60000,
        price: 100000,
        icon: "🏯"
    }
];


/* =====================================================
   ZUMBIS
===================================================== */

const zombieTypes = [

    {
        name: "Walker",
        health: 60,
        speed: 45,
        damage: 5,
        reward: 50,
        color: "#6e756d",
        size: 1
    },

    {
        name: "Runner",
        health: 45,
        speed: 90,
        damage: 7,
        reward: 100,
        color: "#b45c5c",
        size: .85
    },

    {
        name: "Brute",
        health: 180,
        speed: 35,
        damage: 12,
        reward: 200,
        color: "#714b35",
        size: 1.35
    },

    {
        name: "Crawler",
        health: 80,
        speed: 70,
        damage: 8,
        reward: 120,
        color: "#5d795d",
        size: .75
    },

    {
        name: "Mutant",
        health: 300,
        speed: 45,
        damage: 15,
        reward: 350,
        color: "#8055a0",
        size: 1.45
    },

    {
        name: "Burning",
        health: 220,
        speed: 60,
        damage: 18,
        reward: 450,
        color: "#b64c20",
        size: 1.1
    },

    {
        name: "Toxic",
        health: 250,
        speed: 50,
        damage: 20,
        reward: 500,
        color: "#5b9b43",
        size: 1.1
    },

    {
        name: "Tank",
        health: 700,
        speed: 25,
        damage: 25,
        reward: 1000,
        color: "#52606d",
        size: 1.65
    }
];


/* =====================================================
   ESTADO
===================================================== */

let player = {

    x: 180,
    y: 0,

    speed: 250,

    health: MAX_HEALTH_START,
    maxHealth: MAX_HEALTH_START,

    armor: 0,
    maxArmor: 0,

    money: 500,

    weapon: weapons[0],

    ammo: weapons[0].magazine,

    reserveAmmo: weapons[0].ammo,

    lastShot: 0,

    reloadTime: 0,

    score: 0
};


let inventory = [];

/* A pistola inicial ocupa o primeiro espaço */
inventory.push({
    type: "weapon",
    item: weapons[0]
});


let selectedInventory = 0;

let zombies = [];
let bullets = [];

let placedTraps = [];
let placedBarricades = [];

let friend = null;

let wave = 1;

let preparation = false;
let waveActive = false;
let gameRunning = false;
let gameEnded = false;

let preparationTime = 30;

let keys = {};

let mouse = {
    x: 0,
    y: 0,
    down: false
};

let rankingSent = false;


/* =====================================================
   PREPARAÇÃO
===================================================== */

function getPreparationTime() {

    return Math.max(
        15,
        30 - ((wave - 1) * 5)
    );

}


function startPreparation() {

    preparation = true;

    waveActive = false;

    gameRunning = true;

    preparationTime =
        getPreparationTime();

    skipPreparationBtn.style.display =
        "block";

    updateHUD();
}


function skipPreparation() {

    if (!preparation)
        return;

    preparationTime = 0;

    finishPreparation();
}


function finishPreparation() {

    preparation = false;

    waveActive = true;

    skipPreparationBtn.style.display =
        "none";

    spawnWave();

    updateHUD();
}


skipPreparationBtn.addEventListener(
    "click",
    skipPreparation
);


/* =====================================================
   CONTROLES
===================================================== */

window.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();

        keys[key] = true;

        if (key === "r") {
            reload();
        }

        if (
            ["1", "2", "3", "4", "5"]
                .includes(event.key)
        ) {

            selectInventory(
                Number(event.key) - 1
            );

        }

        if (key === "e") {
            useSelectedItem();
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
            event.clientX - rect.left;

        mouse.y =
            event.clientY - rect.top;

    }
);


canvas.addEventListener(
    "mousedown",
    () => {

        mouse.down = true;

    }
);


window.addEventListener(
    "mouseup",
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
        .replace(/\s+/g, " ")
        .slice(0, 16);

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
   VISUAL
===================================================== */

function itemVisual(item, type) {

    if (item.visual)
        return item.visual;

    if (item.icon)
        return item.icon;

    if (type === "armas")
        return "🔫";

    if (type === "corpo")
        return "⚔️";

    if (type === "armadura")
        return "🛡️";

    if (type === "amigos")
        return "🐾";

    return "📦";
}


/* =====================================================
   DESCRIÇÃO
===================================================== */

function itemDescription(item, type) {

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
            `;

        }

        return `Recupera ${item.heal} de vida`;

    }

    if (type === "bombas") {

        return `
            Dano: ${item.damage}<br>
            Raio: ${item.radius}
        `;

    }

    if (type === "armadilhas") {

        return `Dano: ${item.damage}`;

    }

    if (type === "barricadas") {

        return `Vida: ${item.health}`;

    }

    return "Item especial";
}


/* =====================================================
   RENDER DA LOJA
===================================================== */

function getCurrentItems() {

    if (currentCategory === "armadura")
        return armors;

    if (currentCategory === "amigos")
        return friends;

    if (currentCategory === "armas")
        return weapons;

    if (currentCategory === "corpo")
        return meleeWeapons;

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


function renderItems() {

    shopContent.innerHTML = "";

    if (currentCategory === "municao") {

        renderAmmoShop();

        return;
    }

    const items =
        getCurrentItems();

    items.forEach(
        (item, index) => {

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
                    ${escapeHTML(item.name)}
                </h3>

                <p>
                    ${itemDescription(
                        item,
                        currentCategory
                    )}
                </p>

                <strong>
                    $${Number(
                        item.price
                    ).toLocaleString("pt-BR")}
                </strong>

                <button class="buy-item-btn">
                    COMPRAR
                </button>
            `;

            const button =
                card.querySelector(
                    ".buy-item-btn"
                );

            button.addEventListener(
                "click",
                () => {

                    buyItem(
                        index
                    );

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

    const weapon =
        player.weapon;

    shopContent.innerHTML = `

        <div class="shop-item">

            <div class="item-visual">
                📦
            </div>

            <h3>
                ${escapeHTML(
                    weapon.name
                )}
            </h3>

            <p>
                Munição:
                <strong>
                    ${escapeHTML(
                        weapon.ammoType ||
                        "Munição"
                    )}
                </strong>
                <br>
                +50 unidades
            </p>

            <strong>
                $${weapon.ammoPrice || 100}
            </strong>

            <button id="buyAmmoButton">
                COMPRAR
            </button>

        </div>
    `;


    document
        .getElementById(
            "buyAmmoButton"
        )
        .addEventListener(
            "click",
            buyAmmo
        );
}


/* =====================================================
   COMPRAR
===================================================== */

function buyItem(index) {

    const items =
        getCurrentItems();

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
        currentCategory === "armas" ||
        currentCategory === "corpo"
    ) {

        if (
            inventory.length >=
            INVENTORY_SIZE
        ) {

            alert(
                "Inventário cheio! Você pode carregar até 5 itens."
            );

            return;
        }

        player.money -=
            item.price;

        inventory.push({
            type:
                currentCategory === "corpo"
                    ? "melee"
                    : "weapon",

            item: item
        });

        renderInventory();

        updateHUD();

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

            name: item.name,

            damage: item.damage,

            icon: item.icon,

            lastAttack: 0
        };

        updateHUD();

        return;
    }


    /* KITS */

    if (
        currentCategory ===
        "kits"
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

        return;
    }


    /* BOMBAS */

    if (
        currentCategory ===
        "bombas"
    ) {

        if (
            !addInventory({
                type: "bomb",
                item: item
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

        updateHUD();

        return;
    }


    /* ARMADILHAS */

    if (
        currentCategory ===
        "armadilhas"
    ) {

        if (
            !addInventory({
                type: "trap",
                item: item
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

        updateHUD();

        return;
    }


    /* BARRICADAS */

    if (
        currentCategory ===
        "barricadas"
    ) {

        if (
            !addInventory({
                type: "barricade",
                item: item
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

        updateHUD();

        return;
    }
}


/* =====================================================
   MUNIÇÃO
===================================================== */

function buyAmmo() {

    const price =
        player.weapon.ammoPrice ||
        100;

    if (
        player.money <
        price
    ) {

        alert(
            "Dinheiro insuficiente!"
        );

        return;
    }

    player.money -=
        price;

    player.reserveAmmo +=
        50;

    updateHUD();
}


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
        !inventory[index]
    )
        return;


    selectedInventory =
        index;

    const selected =
        inventory[index];


    if (
        selected.type ===
        "weapon"
    ) {

        equipWeapon(
            selected.item
        );

    }


    if (
        selected.type ===
        "melee"
    ) {

        equipMelee(
            selected.item
        );

    }


    renderInventory();

    updateHUD();
}


function equipWeapon(weapon) {

    player.weapon =
        weapon;

    player.ammo =
        Math.min(
            player.ammo,
            weapon.magazine
        );

    if (
        player.reserveAmmo <= 0
    ) {

        player.reserveAmmo =
            weapon.ammo;

    }

}


function equipMelee(weapon) {

    player.weapon = {

        ...weapon,

        melee: true,

        magazine: 0,

        ammo: 0,

        reserveAmmo: 0,

        fireRate:
            weapon.cooldown
    };

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
            createInventorySlot(
                i
            );

        const gameSlot =
            createInventorySlot(
                i
            );

        menuInventory.appendChild(
            menuSlot
        );

        gameInventorySlots.appendChild(
            gameSlot
        );
    }
}


function createInventorySlot(index) {

    const slot =
        document.createElement(
            "div"
        );

    slot.className =
        "inventory-slot";


    if (
        index ===
        selectedInventory
    ) {

        slot.classList.add(
            "selected"
        );

    }


    const item =
        inventory[index];


    slot.innerHTML = `

        <span class="inventory-number">
            ${index + 1}
        </span>

        ${
            item
                ? itemVisual(
                    item.item,
                    item.type === "weapon"
                        ? "armas"
                        : item.type === "melee"
                        ? "corpo"
                        : item.type === "bomb"
                        ? "bombas"
                        : item.type === "trap"
                        ? "armadilhas"
                        : "barricadas"
                )
                : "—"
        }

        ${
            item
                ? `<span class="inventory-name">
                    ${escapeHTML(
                        item.item.name
                    )}
                   </span>`
                : ""
        }
    `;


    slot.addEventListener(
        "click",
        () => {

            selectInventory(
                index
            );

        }
    );


    return slot;
}


function useSelectedItem() {

    const item =
        inventory[
            selectedInventory
        ];

    if (!item)
        return;


    if (
        item.type ===
        "bomb"
    ) {

        useBomb(
            item.item
        );

        inventory.splice(
            selectedInventory,
            1
        );

    }


    if (
        item.type ===
        "trap"
    ) {

        if (
            placeTrap(
                item.item
            )
        ) {

            inventory.splice(
                selectedInventory,
                1
            );
        }

    }


    if (
        item.type ===
        "barricade"
    ) {

        if (
            placeBarricade(
                item.item
            )
        ) {

            inventory.splice(
                selectedInventory,
                1
            );
        }

    }


    if (
        selectedInventory >=
        inventory.length
    ) {

        selectedInventory =
            Math.max(
                0,
                inventory.length - 1
            );
    }


    renderInventory();
}


/* =====================================================
   INICIAR ONDA
===================================================== */

function startWave() {

    if (gameEnded)
        return;

    if (
        !validatePlayerName()
    )
        return;


    shopScreen.style.display =
        "none";

    hud.style.display =
        "grid";

    gameInventory.style.display =
        "block";


    gameRunning = true;

    player.x = 180;

    player.y =
        canvas.height / 2;

    zombies = [];

    bullets = [];

    startPreparation();
}


startWaveBtn.addEventListener(
    "click",
    startWave
);


/* =====================================================
   ATUALIZA PREPARAÇÃO
===================================================== */

function updatePreparation(dt) {

    preparationTime -= dt;

    if (
        preparationTime <= 0
    ) {

        finishPreparation();

    }

}


/* =====================================================
   SPAWN DA ONDA
===================================================== */

function spawnWave() {

    zombies = [];


    /*
       A cada 10 ondas:
       somente o Boss.
    */

    if (
        wave % 10 === 0
    ) {

        const bossNumber =
            wave / 10;

        const bossHP =
            BOSS_BASE_HP *
            Math.pow(
                2,
                bossNumber - 1
            );

        const bossReward =
            BOSS_BASE_REWARD *
            Math.pow(
                2,
                bossNumber - 1
            );


        zombies.push({

            x:
                canvas.width + 120,

            y:
                canvas.height / 2,

            width: 90,

            height: 120,

            health: bossHP,

            maxHealth: bossHP,

            speed: 20,

            damage: 34,

            reward: bossReward,

            type: "Boss",

            color: "#a00000",

            size: 2,

            attackCooldown: 0

        });


        updateHUD();

        return;
    }


    const amount =
        5 + wave * 3;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        let type;


        /*
           Antes da onda 5:
           somente zumbis normais.
        */

        if (
            wave < 5
        ) {

            type =
                zombieTypes[0];

        } else {

            /*
               Especial a partir da onda 5.
            */

            const maxTypes =
                Math.min(
                    zombieTypes.length,
                    2 +
                    Math.floor(
                        (wave - 5) / 2
                    )
                );

            type =
                zombieTypes[
                    Math.floor(
                        Math.random() *
                        maxTypes
                    )
                ];

        }


        /*
           +5 HP por onda a partir da onda 5.
        */

        const extraHP =
            wave >= 5
                ? (wave - 4) * 5
                : 0;


        const hp =
            type.health +
            extraHP;


        zombies.push({

            x:
                canvas.width +
                80 +
                Math.random() *
                300,

            y:
                70 +
                Math.random() *
                Math.max(
                    100,
                    canvas.height - 140
                ),

            width:
                38 *
                type.size,

            height:
                60 *
                type.size,

            health: hp,

            maxHealth: hp,

            speed: type.speed,

            damage: type.damage,

            reward:
                type.name === "Walker"
                    ? NORMAL_ZOMBIE_REWARD
                    : type.reward,

            type: type.name,

            color: type.color,

            size: type.size,

            attackCooldown: 0

        });
    }


    updateHUD();
}


/* =====================================================
   PLAYER
===================================================== */

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
        dx ||
        dy
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


/* =====================================================
   TIRO
===================================================== */

function shoot() {

    if (!waveActive)
        return;


    if (
        player.weapon.melee
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
            mouse.y - player.y,
            mouse.x - player.x
        );


    bullets.push({

        x: player.x,

        y: player.y,

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


/* =====================================================
   CORPO A CORPO
===================================================== */

function meleeAttack() {

    const now =
        performance.now();


    if (
        now -
        player.lastShot <
        player.weapon.cooldown
    ) {

        return;
    }


    player.lastShot =
        now;


    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );


    for (
        let i =
            zombies.length - 1;
        i >= 0;
        i--
    ) {

        const z =
            zombies[i];


        const dx =
            z.x - player.x;

        const dy =
            z.y - player.y;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance >
            player.weapon.range
        )
            continue;


        const targetAngle =
            Math.atan2(
                dy,
                dx
            );


        let difference =
            Math.abs(
                angle -
                targetAngle
            );


        if (
            difference >
            Math.PI
        ) {

            difference =
                Math.PI * 2 -
                difference;

        }


        if (
            difference <
            Math.PI / 2
        ) {

            z.health -=
                player.weapon.damage;


            if (
                z.health <= 0
            ) {

                killZombie(
                    z,
                    i
                );

            }

        }
    }
}


/* =====================================================
   RELOAD
===================================================== */

function reload() {

    if (
        player.weapon.melee
    )
        return;


    if (
        player.reloadTime >
        0
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


    player.reloadTime =
        1.3;
}


function updateReload(dt) {

    if (
        player.reloadTime <=
        0
    )
        return;


    player.reloadTime -=
        dt;


    if (
        player.reloadTime <=
        0
    ) {

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


        b.x +=
            b.vx *
            dt;

        b.y +=
            b.vy *
            dt;

        b.life -=
            dt;


        let hit = false;


        for (
            let j =
                zombies.length - 1;
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
                distance <
                Math.max(
                    30,
                    z.width / 2
                )
            ) {

                z.health -=
                    b.damage;

                hit = true;


                if (
                    z.health <=
                    0
                ) {

                    killZombie(
                        z,
                        j
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


/* =====================================================
   MORTE DO ZUMBI
===================================================== */

function killZombie(
    zombie,
    index
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
   ZUMBIS
===================================================== */

function updateZombies(dt) {

    for (
        let i =
            zombies.length - 1;
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
            distance >
            60
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

            z.attackCooldown -=
                dt;


            if (
                z.attackCooldown <=
                0
            ) {

                damagePlayer(
                    z.damage
                );

                z.attackCooldown =
                    z.type === "Boss"
                        ? 1
                        : .8;
            }
        }
    }


    updateFriend();
}


/* =====================================================
   AMIGO
===================================================== */

function updateFriend() {

    if (!friend)
        return;


    let closest = null;

    let closestDistance =
        Infinity;


    for (
        const z of zombies
    ) {

        const distance =
            Math.hypot(
                z.x - player.x,
                z.y - player.y
            );


        if (
            distance <
            closestDistance
        ) {

            closest =
                z;

            closestDistance =
                distance;
        }
    }


    if (
        !closest ||
        closestDistance >
        500
    )
        return;


    const now =
        performance.now();


    if (
        now -
        friend.lastAttack <
        700
    )
        return;


    friend.lastAttack =
        now;


    closest.health -=
        friend.damage;


    if (
        closest.health <=
        0
    ) {

        const index =
            zombies.indexOf(
                closest
            );

        if (
            index !== -1
        ) {

            killZombie(
                closest,
                index
            );

        }
    }
}


/* =====================================================
   DANO
===================================================== */

function damagePlayer(
    amount
) {

    let remaining =
        amount;


    if (
        player.armor >
        0
    ) {

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
        player.health <=
        0
    ) {

        player.health = 0;

        endGame();
    }


    updateHUD();
}


/* =====================================================
   BOMBAS
===================================================== */

function useBomb(
    bomb
) {

    if (
        !preparation &&
        !waveActive
    )
        return;


    const x =
        player.x;

    const y =
        player.y;


    for (
        let i =
            zombies.length - 1;
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
                z.health <=
                0
            ) {

                killZombie(
                    z,
                    i
                );

            }
        }
    }


    updateHUD();
}


/* =====================================================
   ARMADILHAS
===================================================== */

function placeTrap(
    trap
) {

    if (
        !preparation
    ) {

        alert(
            "Armadilhas só podem ser colocadas durante a preparação."
        );

        return false;
    }


    placedTraps.push({

        x: player.x,

        y: player.y,

        damage: trap.damage,

        radius: 45,

        active: true

    });


    return true;
}


function updateTraps() {

    for (
        const trap of
        placedTraps
    ) {

        if (
            !trap.active
        )
            continue;


        for (
            let i =
                zombies.length - 1;
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

                trap.active =
                    false;


                if (
                    z.health <=
                    0
                ) {

                    killZombie(
                        z,
                        i
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


/* =====================================================
   BARRICADAS
===================================================== */

function placeBarricade(
    barricade
) {

    if (
        !preparation
    ) {

        alert(
            "Barricadas só podem ser colocadas durante a preparação."
        );

        return false;
    }


    placedBarricades.push({

        x: player.x,

        y: player.y,

        width: 80,

        height: 30,

        health:
            barricade.health,

        maxHealth:
            barricade.health

    });


    return true;
}


function updateBarricades(
    dt
) {

    for (
        const b of
        placedBarricades
    ) {

        for (
            const z of
            zombies
        ) {

            const distance =
                Math.hypot(
                    z.x - b.x,
                    z.y - b.y
                );


            if (
                distance <
                65
            ) {

                b.health -=
                    z.damage *
                    dt;

            }
        }
    }


    placedBarricades =
        placedBarricades.filter(
            b =>
                b.health > 0
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


                gameRunning =
                    false;

                preparation =
                    false;


                hud.style.display =
                    "none";

                gameInventory.style.display =
                    "none";

                skipPreparationBtn.style.display =
                    "none";

                shopScreen.style.display =
                    "block";


                renderItems();

                renderInventory();

                updateHUD();

            },
            1000
        );
    }
}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    if (!healthBar)
        return;


    nameHud.textContent =
        getPlayerName() ||
        "Jogador";


    healthBar.style.width =
        `${Math.max(
            0,
            (
                player.health /
                player.maxHealth
            ) * 100
        )}%`;


    armorBar.style.width =
        `${player.maxArmor > 0
            ? (
                player.armor /
                player.maxArmor
            ) * 100
            : 0
        }%`;


    if (
        preparation
    ) {

        waveEl.textContent =
            `ONDA ${wave}`;

        enemiesEl.textContent =
            "🛠️ PREPARAÇÃO";

        preparationText.textContent =
            `${Math.ceil(
                preparationTime
            )} segundos`;

    } else {

        waveEl.textContent =
            `ONDA ${wave}`;

        enemiesEl.textContent =
            `🧟 Zumbis: ${zombies.length}`;

        preparationText.textContent =
            "";

    }


    weaponEl.textContent =
        player.weapon.name.toUpperCase();


    if (
        player.weapon.melee
    ) {

        ammoEl.textContent =
            "CORPO A CORPO";

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


    if (
        preparation
    ) {

        startWaveBtn.textContent =
            `⏱️ ${Math.ceil(
                preparationTime
            )}s`;

    } else {

        startWaveBtn.textContent =
            "▶ INICIAR ONDA";

    }
}


/* =====================================================
   DESENHO DO FUNDO
===================================================== */

function drawBackground() {

    ctx.fillStyle =
        "#101410";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.strokeStyle =
        "rgba(255,255,255,.035)";


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


    if (
        preparation
    ) {

        ctx.fillStyle =
            "rgba(180,0,0,.12)";

        ctx.fillRect(
            canvas.width - 100,
            0,
            100,
            canvas.height
        );


        ctx.fillStyle =
            "#ff5555";

        ctx.font =
            "bold 17px Arial";

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


/* =====================================================
   DESENHAR PLAYER
===================================================== */

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


    /* corpo */

    ctx.fillStyle =
        "#314334";

    ctx.fillRect(
        -17,
        -10,
        34,
        32
    );


    /* colete */

    ctx.fillStyle =
        "#161c18";

    ctx.fillRect(
        -15,
        -8,
        30,
        25
    );


    ctx.strokeStyle =
        "#687568";

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
        "#273029";

    ctx.beginPath();

    ctx.arc(
        0,
        -28,
        14,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* arma visual */

    if (
        player.weapon.melee
    ) {

        ctx.fillStyle =
            "#bcbcbc";

        ctx.fillRect(
            18,
            -4,
            45,
            5
        );

    } else {

        ctx.fillStyle =
            "#090909";

        ctx.fillRect(
            20,
            -7,
            38,
            6
        );

        ctx.fillRect(
            17,
            -3,
            12,
            9
        );
    }


    ctx.restore();
}


/* =====================================================
   DESENHAR ZUMBI
===================================================== */

function drawZombie(
    z
) {

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


    if (
        z.type === "Boss"
    ) {

        drawBoss();

        ctx.restore();

        return;
    }


    /* pernas */

    ctx.fillStyle =
        "#252525";

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
        z.color;

    ctx.fillRect(
        -18,
        -10,
        36,
        34
    );


    /* braços */

    ctx.fillStyle =
        z.color;

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
        z.type === "Toxic"
            ? "#baff4b"
            : "#ff2525";

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


    /* efeitos especiais */

    if (
        z.type === "Burning"
    ) {

        ctx.fillStyle =
            "#ff6a00";

        ctx.beginPath();

        ctx.arc(
            0,
            5,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    if (
        z.type === "Toxic"
    ) {

        ctx.fillStyle =
            "#b7ff4a";

        ctx.beginPath();

        ctx.arc(
            15,
            5,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    if (
        z.type === "Mutant"
    ) {

        ctx.strokeStyle =
            "#d68cff";

        ctx.lineWidth =
            3;

        ctx.strokeRect(
            -23,
            -40,
            46,
            70
        );
    }


    drawHealthBar(
        z,
        55
    );


    ctx.restore();
}


/* =====================================================
   BOSS
===================================================== */

function drawBoss() {

    /* aura */

    ctx.fillStyle =
        "rgba(255,0,0,.15)";

    ctx.beginPath();

    ctx.arc(
        0,
        -5,
        65,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* corpo */

    ctx.fillStyle =
        "#500000";

    ctx.fillRect(
        -35,
        -25,
        70,
        75
    );


    /* cabeça */

    ctx.fillStyle =
        "#7c1010";

    ctx.beginPath();

    ctx.arc(
        0,
        -45,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* olhos */

    ctx.fillStyle =
        "#ffff00";

    ctx.fillRect(
        -14,
        -51,
        10,
        8
    );

    ctx.fillRect(
        4,
        -51,
        10,
        8
    );


    /* chifres */

    ctx.fillStyle =
        "#ddd";

    ctx.beginPath();

    ctx.moveTo(
        -23,
        -65
    );

    ctx.lineTo(
        -45,
        -95
    );

    ctx.lineTo(
        -15,
        -75
    );

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        23,
        -65
    );

    ctx.lineTo(
        45,
        -95
    );

    ctx.lineTo(
        15,
        -75
    );

    ctx.fill();


    /* vida */

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        -55,
        -110,
        110,
        10
    );

    ctx.fillStyle =
        "#e00000";

    ctx.fillRect(
        -55,
        -110,
        110 *
        Math.max(
            0,
            currentBossHealthPercent()
        ),
        10
    );
}


function currentBossHealthPercent() {

    const boss =
        zombies.find(
            z =>
                z.type ===
                "Boss"
        );

    if (!boss)
        return 0;

    return (
        boss.health /
        boss.maxHealth
    );
}


function drawHealthBar(
    z,
    width
) {

    ctx.fillStyle =
        "#222";

    ctx.fillRect(
        -width / 2,
        -50,
        width,
        6
    );

    ctx.fillStyle =
        "#e33";

    ctx.fillRect(
        -width / 2,
        -50,
        width *
        Math.max(
            0,
            z.health /
            z.maxHealth
        ),
        6
    );
}


/* =====================================================
   BALAS
===================================================== */

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


/* =====================================================
   ARMADILHAS
===================================================== */

function drawTraps() {

    for (
        const trap of
        placedTraps
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

        ctx.strokeRect(
            -20,
            -8,
            40,
            16
        );

        ctx.restore();
    }
}


/* =====================================================
   BARRICADAS
===================================================== */

function drawBarricades() {

    for (
        const b of
        placedBarricades
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
            "#24170d";

        ctx.lineWidth =
            4;

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


/* =====================================================
   AMIGO
===================================================== */

function drawFriend() {

    if (!friend)
        return;


    ctx.save();

    ctx.font =
        "40px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        friend.icon,
        player.x - 50,
        player.y + 15
    );


    ctx.restore();
}


/* =====================================================
   RANKING
===================================================== */

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
                        ascending: false
                    }
                )
                .order(
                    "total_money",
                    {
                        ascending: false
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
                    🏆 Ainda não existem jogadores.
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
            (playerData, index) => {

                let position =
                    `${index + 1}º`;

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

                        <td class="ranking-position">
                            ${position}
                        </td>

                        <td class="ranking-player">
                            ${escapeHTML(
                                playerData.player_name
                            )}
                        </td>

                        <td>
                            🧟 ${playerData.waves}
                        </td>

                        <td class="ranking-money">
                            💵 $${Number(
                                playerData.total_money
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

                Verifique o Supabase.

            </div>

        `;
    }
}


/* =====================================================
   ABRIR / FECHAR RANKING
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

                    player_name:
                        name,

                    waves:
                        wave,

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

        ${escapeHTML(
            getPlayerName() ||
            "Jogador"
        )}

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
                            btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
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
   ESCAPAR HTML
===================================================== */

function escapeHTML(
    value
) {

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
   LOOP
===================================================== */

let lastTime =
    performance.now();


function gameLoop(
    time
) {

    const dt =
        Math.min(
            0.033,
            (
                time -
                lastTime
            ) / 1000
        );


    lastTime =
        time;


    drawBackground();


    if (
        gameRunning &&
        !gameEnded
    ) {

        updatePlayer(dt);


        if (
            preparation
        ) {

            updatePreparation(
                dt
            );

        } else if (
            waveActive
        ) {

            updateZombies(
                dt
            );

            updateBullets(
                dt
            );

            updateTraps();

            updateBarricades(
                dt
            );


            if (
                mouse.down ||
                keys[" "]
            ) {

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
            const z of
            zombies
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

    player.y =
        canvas.height / 2;


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


    renderItems();

    renderInventory();

    updateHUD();


    requestAnimationFrame(
        gameLoop
    );
}


init();
