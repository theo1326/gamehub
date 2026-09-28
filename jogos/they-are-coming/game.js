"use strict";

/* =========================================================
   THEY ARE COMING - GAMEHUB
   Versão com visual de personagens e itens ilustrados
========================================================= */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const shopScreen = document.getElementById("shopScreen");
const shopContent = document.getElementById("shopContent");
const moneyEl = document.getElementById("money");
const moneyHud = document.getElementById("moneyHud");

const playerNameInput = document.getElementById("playerName");
const startWaveBtn = document.getElementById("startWaveBtn");

const healthBar = document.getElementById("healthBar");
const armorHud = document.getElementById("armorHud");
const armorBar = document.getElementById("armorBar");

const nameHud = document.getElementById("nameHud");
const waveEl = document.getElementById("wave");
const enemiesEl = document.getElementById("enemies");

const weaponEl = document.getElementById("weapon");
const ammoEl = document.getElementById("ammo");

const menuInventory = document.getElementById("menuInventory");
const gameInventory = document.getElementById("gameInventorySlots");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const categoryButtons =
    document.querySelectorAll(".category-btn");


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const MAX_HEALTH = 100;
const INVENTORY_SIZE = 5;
const ZOMBIE_DAMAGE = 5;

let money = 500;
let wave = 1;
let running = false;
let gameStarted = false;

let keys = {};

let mouse = {
    x: 0,
    y: 0,
    down: false
};


/* =========================================================
   ARMAS
========================================================= */

const weapons = [

    {
        name: "Pistola",
        damage: 25,
        fireRate: 300,
        mag: 12,
        reserve: 30,
        price: 0,
        color: "#777"
    },

    {
        name: "Glock",
        damage: 28,
        fireRate: 240,
        mag: 15,
        reserve: 45,
        price: 300,
        color: "#444"
    },

    {
        name: "Desert Eagle",
        damage: 60,
        fireRate: 550,
        mag: 7,
        reserve: 28,
        price: 600,
        color: "#b08d57"
    },

    {
        name: "Uzi",
        damage: 18,
        fireRate: 90,
        mag: 32,
        reserve: 96,
        price: 800,
        color: "#333"
    },

    {
        name: "MP5",
        damage: 25,
        fireRate: 110,
        mag: 30,
        reserve: 120,
        price: 1000,
        color: "#444"
    },

    {
        name: "MP7",
        damage: 27,
        fireRate: 95,
        mag: 40,
        reserve: 120,
        price: 1200,
        color: "#333"
    },

    {
        name: "P90",
        damage: 23,
        fireRate: 75,
        mag: 50,
        reserve: 200,
        price: 1400,
        color: "#555"
    },

    {
        name: "Shotgun",
        damage: 85,
        fireRate: 800,
        mag: 6,
        reserve: 30,
        price: 1200,
        color: "#654321"
    },

    {
        name: "Double Barrel",
        damage: 120,
        fireRate: 1100,
        mag: 2,
        reserve: 20,
        price: 1600,
        color: "#5d4037"
    },

    {
        name: "M870",
        damage: 100,
        fireRate: 900,
        mag: 8,
        reserve: 40,
        price: 1800,
        color: "#704214"
    },

    {
        name: "AK-47",
        damage: 40,
        fireRate: 150,
        mag: 30,
        reserve: 120,
        price: 2000,
        color: "#6b4f2a"
    },

    {
        name: "AK-74",
        damage: 45,
        fireRate: 140,
        mag: 30,
        reserve: 120,
        price: 2300,
        color: "#555"
    },

    {
        name: "M4",
        damage: 42,
        fireRate: 120,
        mag: 30,
        reserve: 150,
        price: 2500,
        color: "#3b3b3b"
    },

    {
        name: "M16",
        damage: 48,
        fireRate: 130,
        mag: 30,
        reserve: 150,
        price: 2700,
        color: "#444"
    },

    {
        name: "SCAR",
        damage: 55,
        fireRate: 150,
        mag: 30,
        reserve: 120,
        price: 3000,
        color: "#333"
    },

    {
        name: "FAMAS",
        damage: 50,
        fireRate: 110,
        mag: 25,
        reserve: 125,
        price: 3200,
        color: "#555"
    },

    {
        name: "G36",
        damage: 47,
        fireRate: 105,
        mag: 30,
        reserve: 150,
        price: 3400,
        color: "#333"
    },

    {
        name: "AUG",
        damage: 52,
        fireRate: 115,
        mag: 30,
        reserve: 150,
        price: 3600,
        color: "#666"
    },

    {
        name: "FN P90",
        damage: 30,
        fireRate: 70,
        mag: 50,
        reserve: 250,
        price: 3800,
        color: "#444"
    },

    {
        name: "Vector",
        damage: 35,
        fireRate: 65,
        mag: 33,
        reserve: 198,
        price: 4000,
        color: "#222"
    },

    {
        name: "MP40",
        damage: 38,
        fireRate: 120,
        mag: 32,
        reserve: 128,
        price: 4200,
        color: "#444"
    },

    {
        name: "Thompson",
        damage: 42,
        fireRate: 130,
        mag: 50,
        reserve: 200,
        price: 4500,
        color: "#704214"
    },

    {
        name: "M249",
        damage: 45,
        fireRate: 80,
        mag: 100,
        reserve: 400,
        price: 5000,
        color: "#333"
    },

    {
        name: "PKM",
        damage: 55,
        fireRate: 100,
        mag: 100,
        reserve: 300,
        price: 5500,
        color: "#444"
    },

    {
        name: "RPK",
        damage: 50,
        fireRate: 100,
        mag: 75,
        reserve: 225,
        price: 5200,
        color: "#555"
    },

    {
        name: "Sniper",
        damage: 180,
        fireRate: 1300,
        mag: 5,
        reserve: 25,
        price: 6000,
        color: "#292929"
    },

    {
        name: "AWP",
        damage: 250,
        fireRate: 1600,
        mag: 5,
        reserve: 25,
        price: 8000,
        color: "#444"
    },

    {
        name: "Barrett",
        damage: 350,
        fireRate: 1900,
        mag: 5,
        reserve: 20,
        price: 10000,
        color: "#333"
    },

    {
        name: "RPG",
        damage: 500,
        fireRate: 2200,
        mag: 1,
        reserve: 5,
        price: 12000,
        color: "#3d5c35"
    },

    {
        name: "Minigun",
        damage: 35,
        fireRate: 45,
        mag: 200,
        reserve: 600,
        price: 15000,
        color: "#555"
    },

    {
        name: "Railgun",
        damage: 700,
        fireRate: 2500,
        mag: 3,
        reserve: 15,
        price: 20000,
        color: "#4169e1"
    },

    {
        name: "Laser Gun",
        damage: 400,
        fireRate: 120,
        mag: 50,
        reserve: 250,
        price: 18000,
        color: "#00bcd4"
    },

    {
        name: "Plasma Rifle",
        damage: 600,
        fireRate: 180,
        mag: 40,
        reserve: 200,
        price: 25000,
        color: "#7e57c2"
    },

    {
        name: "Doom Cannon",
        damage: 1000,
        fireRate: 3000,
        mag: 2,
        reserve: 10,
        price: 40000,
        color: "#b71c1c"
    }

];


/* =========================================================
   ARMADURAS
========================================================= */

const armors = [

    {
        name: "Colete Básico",
        armor: 25,
        price: 300
    },

    {
        name: "Colete Militar",
        armor: 50,
        price: 800
    },

    {
        name: "Armadura Pesada",
        armor: 75,
        price: 1600
    },

    {
        name: "Armadura Tática",
        armor: 100,
        price: 3000
    },

    {
        name: "Armadura Especial",
        armor: 150,
        price: 6000
    }

];


/* =========================================================
   AMIGOS
========================================================= */

const friends = [

    {
        name: "Cachorro",
        damage: 10,
        speed: 2.5,
        price: 500,
        icon: "🐕"
    },

    {
        name: "Rottweiler",
        damage: 18,
        speed: 2.8,
        price: 1000,
        icon: "🐕"
    },

    {
        name: "Leopardo",
        damage: 25,
        speed: 3.5,
        price: 1800,
        icon: "🐆"
    },

    {
        name: "Tigre",
        damage: 35,
        speed: 3,
        price: 3000,
        icon: "🐅"
    },

    {
        name: "Leão",
        damage: 50,
        speed: 2.5,
        price: 5000,
        icon: "🦁"
    },

    {
        name: "Velociraptor",
        damage: 70,
        speed: 4,
        price: 8000,
        icon: "🦖"
    }

];


/* =========================================================
   BOMBAS
========================================================= */

const bombCatalog = [

    {
        name: "Granada",
        damage: 100,
        radius: 100,
        price: 300,
        icon: "💣"
    },

    {
        name: "Granada Pesada",
        damage: 180,
        radius: 130,
        price: 500,
        icon: "💣"
    },

    {
        name: "C4",
        damage: 300,
        radius: 160,
        price: 1000,
        icon: "🧨"
    },

    {
        name: "Mina",
        damage: 250,
        radius: 120,
        price: 700,
        icon: "💣"
    },

    {
        name: "Bomba Incendiária",
        damage: 350,
        radius: 150,
        price: 1500,
        icon: "🔥"
    },

    {
        name: "Bomba Tóxica",
        damage: 400,
        radius: 160,
        price: 2000,
        icon: "☢️"
    },

    {
        name: "Bomba Elétrica",
        damage: 500,
        radius: 180,
        price: 3000,
        icon: "⚡"
    },

    {
        name: "Bomba Nuclear",
        damage: 1000,
        radius: 250,
        price: 10000,
        icon: "☢️"
    },

    {
        name: "Bomba Infernal",
        damage: 1500,
        radius: 280,
        price: 15000,
        icon: "🔥"
    },

    {
        name: "Bomba Apocalipse",
        damage: 3000,
        radius: 350,
        price: 30000,
        icon: "💥"
    }

];


/* =========================================================
   ARMADILHAS
========================================================= */

const trapCatalog = [

    {
        name: "Armadilha Simples",
        damage: 50,
        price: 200,
        icon: "🪤"
    },

    {
        name: "Armadilha de Ferro",
        damage: 100,
        price: 400,
        icon: "🪤"
    },

    {
        name: "Armadilha Pesada",
        damage: 180,
        price: 700,
        icon: "🪤"
    },

    {
        name: "Armadilha Elétrica",
        damage: 250,
        price: 1000,
        icon: "⚡"
    },

    {
        name: "Armadilha Flamejante",
        damage: 350,
        price: 1500,
        icon: "🔥"
    },

    {
        name: "Armadilha Tóxica",
        damage: 400,
        price: 1800,
        icon: "☢️"
    },

    {
        name: "Armadilha Militar",
        damage: 500,
        price: 2500,
        icon: "🪤"
    },

    {
        name: "Armadilha Brutal",
        damage: 700,
        price: 4000,
        icon: "💀"
    },

    {
        name: "Armadilha Infernal",
        damage: 1000,
        price: 7000,
        icon: "🔥"
    },

    {
        name: "Armadilha Apocalipse",
        damage: 2000,
        price: 15000,
        icon: "☠️"
    },

    {
        name: "Lâminas",
        damage: 300,
        price: 1200,
        icon: "⚔️"
    },

    {
        name: "Mina de Espinhos",
        damage: 450,
        price: 2200,
        icon: "✹"
    },

    {
        name: "Choque",
        damage: 600,
        price: 3500,
        icon: "⚡"
    },

    {
        name: "Gás Mortal",
        damage: 800,
        price: 5000,
        icon: "☣️"
    },

    {
        name: "Aniquiladora",
        damage: 1500,
        price: 10000,
        icon: "💀"
    }

];


/* =========================================================
   BARRICADAS
========================================================= */

const barricadeCatalog = [

    {
        name: "Barricada de Madeira",
        health: 150,
        price: 300,
        icon: "🧱"
    },

    {
        name: "Barricada Reforçada",
        health: 300,
        price: 600,
        icon: "🧱"
    },

    {
        name: "Barricada Militar",
        health: 500,
        price: 1200,
        icon: "🛡️"
    },

    {
        name: "Muro de Metal",
        health: 800,
        price: 2500,
        icon: "🧱"
    },

    {
        name: "Muro Blindado",
        health: 1200,
        price: 4000,
        icon: "🧱"
    },

    {
        name: "Barreira Pesada",
        health: 1800,
        price: 6000,
        icon: "🧱"
    },

    {
        name: "Muralha",
        health: 2500,
        price: 9000,
        icon: "🏰"
    },

    {
        name: "Muralha Militar",
        health: 4000,
        price: 13000,
        icon: "🏰"
    },

    {
        name: "Fortificação",
        health: 6000,
        price: 20000,
        icon: "🏰"
    },

    {
        name: "Fortaleza",
        health: 10000,
        price: 30000,
        icon: "🏰"
    }

];


/* =========================================================
   KITS
========================================================= */

const kits = [

    {
        name: "Kit Médico",
        price: 250,
        effect: "Cura 50 de vida",
        icon: "🩹"
    },

    {
        name: "Kit de Velocidade",
        price: 500,
        effect: "+5 velocidade",
        icon: "⚡"
    }

];


/* =========================================================
   ZUMBIS
========================================================= */

const zombieTypes = [

    {
        name: "Walker",
        health: 50,
        speed: 0.8,
        damage: 5,
        size: 24,
        color: "#607d55"
    },

    {
        name: "Runner",
        health: 40,
        speed: 1.8,
        damage: 5,
        size: 21,
        color: "#795548"
    },

    {
        name: "Brute",
        health: 180,
        speed: 0.55,
        damage: 5,
        size: 34,
        color: "#4e6048"
    },

    {
        name: "Crawler",
        health: 70,
        speed: 1.4,
        damage: 5,
        size: 19,
        color: "#566b42"
    },

    {
        name: "Soldier",
        health: 120,
        speed: 1,
        damage: 5,
        size: 27,
        color: "#3d4638"
    },

    {
        name: "Mutant",
        health: 250,
        speed: 1.1,
        damage: 5,
        size: 32,
        color: "#754f76"
    },

    {
        name: "Burning",
        health: 150,
        speed: 1.3,
        damage: 5,
        size: 28,
        color: "#8a4932"
    },

    {
        name: "Toxic",
        health: 200,
        speed: 0.9,
        damage: 5,
        size: 30,
        color: "#4e7547"
    },

    {
        name: "Tank",
        health: 600,
        speed: 0.4,
        damage: 5,
        size: 45,
        color: "#46504a"
    },

    {
        name: "Boss",
        health: 1500,
        speed: 0.6,
        damage: 5,
        size: 58,
        color: "#594060"
    }

];


/* =========================================================
   ESTADO DO JOGO
========================================================= */

let player = null;

let zombies = [];

let bullets = [];

let inventory = [];

let activeTraps = [];

let activeBarricades = [];

let friend = null;

let lastShot = 0;

let score = 0;

let selectedInventory = 0;


/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =========================================================
   UTILITÁRIOS VISUAIS
========================================================= */

function roundedRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {

    context.beginPath();

    context.roundRect(
        x,
        y,
        width,
        height,
        radius
    );

    context.fill();

}


function drawShadow(x, y, rx, ry) {

    ctx.fillStyle =
        "rgba(0,0,0,0.38)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        rx,
        ry,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


/* =========================================================
   VISUAL DO JOGADOR
========================================================= */

function drawPlayer() {

    if (!player) return;

    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        );

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    /*
       sombra
    */

    drawShadow(
        0,
        22,
        20,
        7
    );

    /*
       pernas
    */

    ctx.fillStyle = "#20252a";

    roundedRect(
        ctx,
        -12,
        5,
        10,
        20,
        3
    );

    roundedRect(
        ctx,
        2,
        5,
        10,
        20,
        3
    );

    /*
       botas
    */

    ctx.fillStyle = "#111";

    ctx.fillRect(
        -15,
        20,
        13,
        7
    );

    ctx.fillRect(
        2,
        20,
        13,
        7
    );

    /*
       corpo
    */

    ctx.fillStyle =
        player.armor > 0
            ? "#465866"
            : "#354b58";

    roundedRect(
        ctx,
        -17,
        -12,
        34,
        30,
        7
    );

    /*
       colete
    */

    ctx.fillStyle = "#26343d";

    ctx.fillRect(
        -12,
        -7,
        24,
        5
    );

    ctx.fillRect(
        -14,
        4,
        28,
        4
    );

    /*
       bolsos
    */

    ctx.fillStyle = "#596b70";

    ctx.fillRect(
        -12,
        9,
        8,
        6
    );

    ctx.fillRect(
        4,
        9,
        8,
        6
    );

    /*
       pescoço
    */

    ctx.fillStyle = "#b97856";

    ctx.fillRect(
        -5,
        -17,
        10,
        8
    );

    /*
       cabeça
    */

    ctx.fillStyle = "#bd805d";

    ctx.beginPath();

    ctx.arc(
        0,
        -22,
        11,
        0,
        Math.PI * 2
    );

    ctx.fill();

    /*
       cabelo
    */

    ctx.fillStyle = "#17191b";

    ctx.beginPath();

    ctx.arc(
        0,
        -25,
        11,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    /*
       capacete
    */

    ctx.fillStyle = "#293a40";

    ctx.beginPath();

    ctx.arc(
        0,
        -27,
        12,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillRect(
        -13,
        -27,
        26,
        5
    );

    /*
       rosto
    */

    ctx.fillStyle = "#111";

    ctx.fillRect(
        -6,
        -23,
        3,
        2
    );

    ctx.fillRect(
        3,
        -23,
        3,
        2
    );

    /*
       braços e arma
    */

    ctx.rotate(angle);

    ctx.fillStyle = "#bd805d";

    roundedRect(
        ctx,
        -19,
        -7,
        15,
        7,
        3
    );

    roundedRect(
        ctx,
        8,
        -7,
        16,
        7,
        3
    );

    if (player.weapon) {

        const color =
            player.weapon.data.color ||
            "#555";

        /*
           arma
        */

        ctx.fillStyle = color;

        roundedRect(
            ctx,
            9,
            -6,
            27,
            8,
            2
        );

        /*
           cano
        */

        ctx.fillStyle = "#151515";

        ctx.fillRect(
            34,
            -3,
            13,
            4
        );

        /*
           carregador
        */

        ctx.fillStyle = "#222";

        ctx.fillRect(
            15,
            2,
            6,
            11
        );

        /*
           mira
        */

        ctx.fillStyle = "#111";

        ctx.fillRect(
            25,
            -9,
            3,
            4
        );

    }

    /*
       armadura
    */

    if (player.armor > 0) {

        ctx.strokeStyle = "#9eabb0";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            -19,
            -14,
            38,
            34
        );

    }

    ctx.restore();

}


/* =========================================================
   VISUAL DOS ZUMBIS
========================================================= */

function drawZombie(zombie) {

    const s = zombie.type.size;

    ctx.save();

    ctx.translate(
        zombie.x,
        zombie.y
    );

    const angle =
        Math.atan2(
            player.y - zombie.y,
            player.x - zombie.x
        );

    ctx.rotate(angle);

    drawShadow(
        0,
        s * 0.45,
        s * 0.48,
        s * 0.18
    );

    /*
       CRAWLER
    */

    if (zombie.type.name === "Crawler") {

        ctx.fillStyle =
            zombie.hitFlash > 0
                ? "#fff"
                : zombie.type.color;

        roundedRect(
            ctx,
            -s * 0.48,
            -s * 0.2,
            s * 0.95,
            s * 0.55,
            5
        );

        ctx.strokeStyle =
            zombie.type.color;

        ctx.lineWidth = 6;

        ctx.beginPath();

        ctx.moveTo(
            -s * 0.35,
            s * 0.1
        );

        ctx.lineTo(
            -s * 0.7,
            s * 0.45
        );

        ctx.moveTo(
            s * 0.35,
            s * 0.1
        );

        ctx.lineTo(
            s * 0.7,
            s * 0.45
        );

        ctx.stroke();

    } else {

        /*
           pernas
        */

        ctx.fillStyle =
            zombie.hitFlash > 0
                ? "#fff"
                : "#292d2d";

        ctx.fillRect(
            -s * 0.32,
            s * 0.18,
            s * 0.2,
            s * 0.4
        );

        ctx.fillRect(
            s * 0.12,
            s * 0.18,
            s * 0.2,
            s * 0.4
        );

        /*
           corpo
        */

        ctx.fillStyle =
            zombie.hitFlash > 0
                ? "#fff"
                : zombie.type.color;

        roundedRect(
            ctx,
            -s * 0.4,
            -s * 0.12,
            s * 0.8,
            s * 0.7,
            6
        );

        /*
           braços
        */

        ctx.strokeStyle =
            zombie.hitFlash > 0
                ? "#fff"
                : zombie.type.color;

        ctx.lineWidth =
            Math.max(
                5,
                s * 0.15
            );

        ctx.beginPath();

        ctx.moveTo(
            -s * 0.32,
            0
        );

        ctx.lineTo(
            -s * 0.65,
            s * 0.35
        );

        ctx.moveTo(
            s * 0.32,
            0
        );

        ctx.lineTo(
            s * 0.65,
            s * 0.35
        );

        ctx.stroke();

        /*
           cabeça
        */

        ctx.fillStyle =
            zombie.hitFlash > 0
                ? "#fff"
                : zombie.type.color;

        ctx.beginPath();

        ctx.arc(
            0,
            -s * 0.37,
            s * 0.34,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    /*
       olhos
    */

    ctx.fillStyle = "#ff2929";

    ctx.fillRect(
        -s * 0.18,
        -s * 0.43,
        s * 0.11,
        s * 0.08
    );

    ctx.fillRect(
        s * 0.07,
        -s * 0.43,
        s * 0.11,
        s * 0.08
    );

    /*
       boca
    */

    ctx.strokeStyle = "#161616";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        -s * 0.16,
        -s * 0.27
    );

    ctx.lineTo(
        s * 0.16,
        -s * 0.27
    );

    ctx.stroke();

    /*
       MUTANT
    */

    if (zombie.type.name === "Mutant") {

        ctx.strokeStyle =
            zombie.type.color;

        ctx.lineWidth = 6;

        ctx.beginPath();

        ctx.moveTo(
            -s * 0.35,
            -s * 0.1
        );

        ctx.lineTo(
            -s * 0.7,
            -s * 0.45
        );

        ctx.moveTo(
            s * 0.35,
            -s * 0.1
        );

        ctx.lineTo(
            s * 0.7,
            -s * 0.45
        );

        ctx.stroke();

    }

    /*
       SOLDADO
    */

    if (zombie.type.name === "Soldier") {

        ctx.fillStyle = "#263238";

        ctx.fillRect(
            -s * 0.4,
            -s * 0.63,
            s * 0.8,
            s * 0.15
        );

        ctx.fillRect(
            -s * 0.28,
            -s * 0.72,
            s * 0.56,
            s * 0.18
        );

    }

    /*
       TANK
    */

    if (zombie.type.name === "Tank") {

        ctx.strokeStyle = "#89949a";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            -s * 0.48,
            -s * 0.5,
            s * 0.96,
            s * 1.1
        );

        ctx.fillStyle = "#222";

        ctx.fillRect(
            -s * 0.65,
            -s * 0.05,
            s * 0.3,
            s * 0.15
        );

        ctx.fillRect(
            s * 0.35,
            -s * 0.05,
            s * 0.3,
            s * 0.15
        );

    }

    /*
       BURNING
    */

    if (zombie.type.name === "Burning") {

        ctx.fillStyle = "#ff8f00";

        for (let i = 0; i < 4; i++) {

            const fx =
                (Math.random() - 0.5) * s;

            const fy =
                -s * 0.6 -
                Math.random() * s * 0.5;

            ctx.beginPath();

            ctx.arc(
                fx,
                fy,
                3 + Math.random() * 3,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    }

    /*
       TOXIC
    */

    if (zombie.type.name === "Toxic") {

        ctx.strokeStyle = "#76ff03";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            s * 0.58,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.fillStyle =
            "rgba(100,255,50,.25)";

        ctx.beginPath();

        ctx.arc(
            -s * 0.4,
            -s * 0.5,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

    /*
       BOSS
    */

    if (zombie.type.name === "Boss") {

        ctx.strokeStyle = "#ff1744";

        ctx.lineWidth = 5;

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            s * 0.62,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.fillStyle = "#8e2430";

        ctx.beginPath();

        ctx.moveTo(
            -s * 0.4,
            -s * 0.55
        );

        ctx.lineTo(
            -s * 0.65,
            -s * 0.9
        );

        ctx.lineTo(
            -s * 0.15,
            -s * 0.65
        );

        ctx.moveTo(
            s * 0.4,
            -s * 0.55
        );

        ctx.lineTo(
            s * 0.65,
            -s * 0.9
        );

        ctx.lineTo(
            s * 0.15,
            -s * 0.65
        );

        ctx.fill();

    }

    ctx.restore();


    /*
       barra de vida
    */

    const barWidth =
        Math.max(
            35,
            s * 1.4
        );

    const hp =
        Math.max(
            0,
            zombie.health /
            zombie.maxHealth
        );

    ctx.fillStyle = "#111";

    ctx.fillRect(
        zombie.x - barWidth / 2,
        zombie.y - s - 10,
        barWidth,
        5
    );

    ctx.fillStyle = "#e53935";

    ctx.fillRect(
        zombie.x - barWidth / 2,
        zombie.y - s - 10,
        barWidth * hp,
        5
    );

}


/* =========================================================
   MENU - ILUSTRAÇÕES
========================================================= */

function itemVisual(item, category) {

    let icon = item.icon || "📦";

    if (category === "armas") {

        icon = "🔫";

    } else if (category === "armadura") {

        icon = "🛡️";

    } else if (category === "amigos") {

        icon = item.icon || "🐕";

    } else if (category === "municao") {

        icon = "📦";

    } else if (category === "kits") {

        icon = item.icon || "🩹";

    } else if (category === "bombas") {

        icon = item.icon || "💣";

    } else if (category === "armadilhas") {

        icon = item.icon || "🪤";

    } else if (category === "barricadas") {

        icon = item.icon || "🧱";

    }

    return `
        <div
            class="shop-item-image"
            style="
                width:100%;
                height:115px;
                display:flex;
                align-items:center;
                justify-content:center;
                background:
                    radial-gradient(
                        circle,
                        rgba(100,130,140,.25),
                        rgba(10,14,17,.95)
                    );
                border:1px solid rgba(255,255,255,.12);
                border-radius:10px;
                margin-bottom:12px;
                overflow:hidden;
            "
        >
            <div
                style="
                    font-size:68px;
                    filter:
                        drop-shadow(0 5px 5px #000);
                "
            >
                ${icon}
            </div>
        </div>
    `;

}


/* =========================================================
   DESCRIÇÃO DOS ITENS
========================================================= */

function itemDescription(item, category) {

    if (category === "armas") {

        return `
            ⚔️ Dano: <strong>${item.damage}</strong>
            &nbsp; | &nbsp;
            🔫 Carregador: <strong>${item.mag}</strong>
        `;

    }

    if (category === "armadura") {

        return `
            🛡️ Proteção:
            <strong>${item.armor}</strong>
        `;

    }

    if (category === "amigos") {

        return `
            ⚔️ Dano:
            <strong>${item.damage}</strong>
            &nbsp; | &nbsp;
            ⚡ Velocidade:
            <strong>${item.speed}</strong>
        `;

    }

    if (category === "bombas") {

        return `
            💥 Dano:
            <strong>${item.damage}</strong>
            &nbsp; | &nbsp;
            📐 Raio:
            <strong>${item.radius}</strong>
        `;

    }

    if (category === "armadilhas") {

        return `
            💀 Dano:
            <strong>${item.damage}</strong>
        `;

    }

    if (category === "barricadas") {

        return `
            ❤️ Resistência:
            <strong>${item.health}</strong>
        `;

    }

    if (category === "kits") {

        return `
            ✚ ${item.effect}
        `;

    }

    return "";

}


/* =========================================================
   RENDERIZAÇÃO DA LOJA
========================================================= */

let currentCategory = "armadura";

function renderItems(category = currentCategory) {

    currentCategory = category;

    shopContent.innerHTML = "";

    let items = [];

    if (category === "armadura") {

        items = armors;

    } else if (category === "amigos") {

        items = friends;

    } else if (category === "armas") {

        items = weapons;

    } else if (category === "municao") {

        if (!player) {

            items = weapons.map(
                weapon => ({
                    name:
                        `Munição ${weapon.name}`,
                    price:
                        Math.ceil(
                            weapon.price / 10
                        ),
                    weapon
                })
            );

        } else {

            items = weapons.map(
                weapon => ({
                    name:
                        `Munição ${weapon.name}`,
                    price:
                        Math.max(
                            50,
                            Math.ceil(
                                weapon.price / 10
                            )
                        ),
                    weapon
                })
            );

        }

    } else if (category === "kits") {

        items = kits;

    } else if (category === "bombas") {

        items = bombCatalog;

    } else if (category === "armadilhas") {

        items = trapCatalog;

    } else if (category === "barricadas") {

        items = barricadeCatalog;

    }


    items.forEach((item, index) => {

        const card =
            document.createElement("div");

        card.className = "shop-item";

        card.style.position = "relative";
        card.style.overflow = "hidden";

        card.innerHTML = `

            ${itemVisual(item, category)}

            <h3>
                ${item.name}
            </h3>

            <p>
                ${itemDescription(
                    item,
                    category
                )}
            </p>

            <div
                style="
                    margin:8px 0;
                    font-size:18px;
                    font-weight:bold;
                "
            >
                💵 $${item.price}
            </div>

            <button>
                COMPRAR
            </button>

        `;

        const button =
            card.querySelector("button");

        button.addEventListener(
            "click",
            () => {

                buyItem(
                    item,
                    category
                );

            }
        );

        shopContent.appendChild(card);

    });

}


/* =========================================================
   COMPRA
========================================================= */

function buyItem(item, category) {

    if (money < item.price) {

        alert("Dinheiro insuficiente!");

        return;

    }


    if (
        category !== "armadura" &&
        category !== "kits" &&
        category !== "municao" &&
        inventory.length >= INVENTORY_SIZE
    ) {

        alert(
            "Seu inventário está cheio!"
        );

        return;

    }


    if (category === "armadura") {

        money -= item.price;

        player.armor = item.armor;

        player.maxArmor =
            item.armor;

    }


    else if (category === "armas") {

        money -= item.price;

        addInventory({
            type: "weapon",
            data: item
        });

    }


    else if (category === "amigos") {

        money -= item.price;

        friend = {
            ...item,
            x: player.x - 50,
            y: player.y
        };

        addInventory({
            type: "friend",
            data: item
        });

    }


    else if (category === "municao") {

        if (
            !player.weapon
        ) {

            alert(
                "Você ainda não possui uma arma."
            );

            return;

        }

        money -= item.price;

        player.reserve +=
            item.weapon.mag * 2;

    }


    else if (category === "kits") {

        money -= item.price;

        if (
            item.name === "Kit Médico"
        ) {

            player.health =
                Math.min(
                    MAX_HEALTH,
                    player.health + 50
                );

        }

        if (
            item.name === "Kit de Velocidade"
        ) {

            player.speed += 5;

        }

    }


    else if (category === "bombas") {

        money -= item.price;

        addInventory({
            type: "bomb",
            data: item
        });

    }


    else if (category === "armadilhas") {

        money -= item.price;

        addInventory({
            type: "trap",
            data: item
        });

    }


    else if (category === "barricadas") {

        money -= item.price;

        addInventory({
            type: "barricade",
            data: item
        });

    }


    updateMoney();

    renderInventory();

    renderItems(currentCategory);

}


/* =========================================================
   INVENTÁRIO
========================================================= */

function addInventory(item) {

    if (
        inventory.length >= INVENTORY_SIZE
    ) {

        return false;

    }

    inventory.push(item);

    return true;

}


function renderInventory() {

    menuInventory.innerHTML = "";

    gameInventory.innerHTML = "";


    for (
        let i = 0;
        i < INVENTORY_SIZE;
        i++
    ) {

        const item =
            inventory[i];

        const menuSlot =
            document.createElement("div");

        const gameSlot =
            document.createElement("div");

        menuSlot.className =
            "inventory-slot";

        gameSlot.className =
            "inventory-slot";


        if (item) {

            const icon =
                item.data.icon ||
                (
                    item.type === "weapon"
                        ? "🔫"
                        : "📦"
                );

            menuSlot.innerHTML = `
                <span>${icon}</span>
                <small>${item.data.name}</small>
            `;

            gameSlot.innerHTML = `
                <span>${icon}</span>
                <small>${i + 1}</small>
            `;

        } else {

            menuSlot.innerHTML =
                `<span>+</span>`;

            gameSlot.innerHTML =
                `<span>${i + 1}</span>`;

        }


        if (
            i === selectedInventory
        ) {

            gameSlot.style.outline =
                "2px solid #fff";

        }


        menuInventory.appendChild(
            menuSlot
        );

        gameInventory.appendChild(
            gameSlot
        );

    }

}


/* =========================================================
   DINHEIRO
========================================================= */

function updateMoney() {

    moneyEl.textContent =
        Math.floor(money);

    moneyHud.textContent =
        `💵 $${Math.floor(money)}`;

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeGame() {

    player = {

        x: canvas.width / 2,

        y: canvas.height / 2,

        health: MAX_HEALTH,

        armor: 0,

        maxArmor: 0,

        speed: 3,

        weapon: {

            data: weapons[0],

            ammo: weapons[0].mag,

            reserve: weapons[0].reserve

        }

    };


    inventory = [

        {

            type: "weapon",

            data: weapons[0]

        }

    ];


    zombies = [];

    bullets = [];

    activeTraps = [];

    activeBarricades = [];

    friend = null;

    wave = 1;

    score = 0;

    selectedInventory = 0;

    money = 500;

    gameStarted = false;

    running = false;


    updateMoney();

    updateHUD();

    renderInventory();

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    if (!player) return;

    healthBar.style.width =
        `${Math.max(
            0,
            player.health
        )}%`;


    if (player.maxArmor > 0) {

        armorHud.style.display =
            "block";

        armorBar.style.width =
            `${Math.max(
                0,
                (player.armor /
                player.maxArmor) * 100
            )}%`;

    } else {

        armorHud.style.display =
            "none";

    }


    nameHud.textContent =
        playerNameInput.value.trim() ||
        "Jogador";


    waveEl.textContent =
        `ONDA ${wave}`;


    enemiesEl.textContent =
        `Zumbis: ${zombies.length}`;


    if (player.weapon) {

        weaponEl.textContent =
            player.weapon.data.name;

        ammoEl.textContent =
            `${player.weapon.ammo} / ${player.weapon.reserve}`;

    }

}


/* =========================================================
   ONDA
========================================================= */

function startWave() {

    if (running) return;

    running = true;

    gameStarted = true;

    shopScreen.style.display =
        "none";

    canvas.style.display =
        "block";

    document.getElementById("hud")
        .style.display = "flex";

    document.getElementById("gameInventory")
        .style.display = "flex";


    spawnWave();

}


function spawnWave() {

    zombies = [];

    const amount =
        5 + wave * 3;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        spawnZombie();

    }

    updateHUD();

}


function spawnZombie() {

    let available =
        zombieTypes.slice(
            0,
            Math.min(
                zombieTypes.length,
                3 + Math.floor(wave / 2)
            )
        );


    if (
        wave >= 10 &&
        Math.random() < 0.1
    ) {

        available = zombieTypes;

    }


    const type =
        available[
            Math.floor(
                Math.random() *
                available.length
            )
        ];


    let x;
    let y;


    const side =
        Math.floor(
            Math.random() * 4
        );


    if (side === 0) {

        x = Math.random() *
            canvas.width;

        y = -80;

    }

    else if (side === 1) {

        x = canvas.width + 80;

        y = Math.random() *
            canvas.height;

    }

    else if (side === 2) {

        x = Math.random() *
            canvas.width;

        y = canvas.height + 80;

    }

    else {

        x = -80;

        y = Math.random() *
            canvas.height;

    }


    const multiplier =
        1 +
        (wave - 1) * 0.12;


    zombies.push({

        x,
        y,

        type,

        health:
            Math.round(
                type.health *
                multiplier
            ),

        maxHealth:
            Math.round(
                type.health *
                multiplier
            ),

        lastAttack: 0,

        hitFlash: 0

    });

}


/* =========================================================
   ATUALIZAÇÃO DOS ZUMBIS
========================================================= */

function updateZombies(delta) {

    for (
        const zombie of zombies
    ) {

        const dx =
            player.x - zombie.x;

        const dy =
            player.y - zombie.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > 1) {

            zombie.x +=
                (dx / distance) *
                zombie.type.speed;

            zombie.y +=
                (dy / distance) *
                zombie.type.speed;

        }


        if (
            distance < 45
        ) {

            const now =
                performance.now();


            if (
                now -
                zombie.lastAttack >
                700
            ) {

                damagePlayer(
                    ZOMBIE_DAMAGE
                );

                zombie.lastAttack =
                    now;

            }

        }

    }

}


/* =========================================================
   DANO AO JOGADOR
========================================================= */

function damagePlayer(amount) {

    if (!player) return;


    if (player.armor > 0) {

        const absorbed =
            Math.min(
                player.armor,
                amount
            );

        player.armor -=
            absorbed;

        amount -=
            absorbed;

    }


    if (amount > 0) {

        player.health -=
            amount;

    }


    if (
        player.health <= 0
    ) {

        player.health = 0;

        endGame();

    }


    updateHUD();

}


/* =========================================================
   TIRO
========================================================= */

function shoot() {

    if (
        !running ||
        !player ||
        !player.weapon
    ) {

        return;

    }


    const now =
        performance.now();


    if (
        now - lastShot <
        player.weapon.data.fireRate
    ) {

        return;

    }


    if (
        player.weapon.ammo <= 0
    ) {

        reload();

        return;

    }


    lastShot = now;

    player.weapon.ammo--;


    const dx =
        mouse.x - player.x;

    const dy =
        mouse.y - player.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    bullets.push({

        x: player.x,

        y: player.y,

        dx: dx / distance,

        dy: dy / distance,

        speed: 15,

        damage:
            player.weapon.data.damage,

        life: 80

    });


    updateHUD();

}


/* =========================================================
   ATUALIZA BALAS
========================================================= */

function updateBullets() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            bullets[i];


        bullet.x +=
            bullet.dx *
            bullet.speed;

        bullet.y +=
            bullet.dy *
            bullet.speed;

        bullet.life--;


        let hit = false;


        for (
            let z = zombies.length - 1;
            z >= 0;
            z--
        ) {

            const zombie =
                zombies[z];


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
                zombie.type.size
            ) {

                zombie.health -=
                    bullet.damage;

                zombie.hitFlash =
                    100;


                if (
                    zombie.health <= 0
                ) {

                    zombies.splice(
                        z,
                        1
                    );

                    money += 100;

                    score += 100;

                }


                hit = true;

                break;

            }

        }


        if (
            hit ||
            bullet.life <= 0
        ) {

            bullets.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   RECARREGAR
========================================================= */

function reload() {

    if (!player.weapon)
        return;


    const weapon =
        player.weapon;


    const needed =
        weapon.data.mag -
        weapon.ammo;


    if (
        needed <= 0 ||
        weapon.reserve <= 0
    ) {

        return;

    }


    const amount =
        Math.min(
            needed,
            weapon.reserve
        );


    weapon.ammo +=
        amount;

    weapon.reserve -=
        amount;


    updateHUD();

}


/* =========================================================
   INVENTÁRIO DURANTE O JOGO
========================================================= */

function useInventorySlot(index) {

    if (
        index < 0 ||
        index >= inventory.length
    ) {

        return;

    }


    const item =
        inventory[index];


    if (!item) return;


    selectedInventory = index;


    if (
        item.type === "weapon"
    ) {

        const current =
            player.weapon;


        if (current) {

            inventory[index] = {
                type: "weapon",
                data: current.data
            };

        }


        player.weapon = {

            data: item.data,

            ammo:
                item.data.mag,

            reserve:
                item.data.reserve

        };

    }


    else if (
        item.type === "bomb"
    ) {

        useBomb(item.data);

        inventory.splice(
            index,
            1
        );

    }


    else if (
        item.type === "trap"
    ) {

        placeTrap(item.data);

        inventory.splice(
            index,
            1
        );

    }


    else if (
        item.type === "barricade"
    ) {

        placeBarricade(
            item.data
        );

        inventory.splice(
            index,
            1
        );

    }


    renderInventory();

    updateHUD();

}


/* =========================================================
   BOMBA
========================================================= */

function useBomb(bomb) {

    const x = player.x;
    const y = player.y;


    for (
        let i = zombies.length - 1;
        i >= 0;
        i--
    ) {

        const zombie =
            zombies[i];


        const dx =
            zombie.x - x;

        const dy =
            zombie.y - y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <= bomb.radius
        ) {

            zombie.health -=
                bomb.damage;


            if (
                zombie.health <= 0
            ) {

                zombies.splice(
                    i,
                    1
                );

                money += 100;

                score += 100;

            }

        }

    }


    updateMoney();

}


/* =========================================================
   ARMADILHA
========================================================= */

function placeTrap(trap) {

    activeTraps.push({

        x: player.x,

        y: player.y,

        data: trap,

        life: 10000

    });

}


/* =========================================================
   BARRICADA
========================================================= */

function placeBarricade(
    barricade
) {

    activeBarricades.push({

        x: player.x,

        y: player.y,

        data: barricade,

        health: barricade.health

    });

}


/* =========================================================
   ATUALIZA ARMADILHAS
========================================================= */

function updateTraps() {

    for (
        let i = activeTraps.length - 1;
        i >= 0;
        i--
    ) {

        const trap =
            activeTraps[i];


        trap.life--;


        for (
            let z = zombies.length - 1;
            z >= 0;
            z--
        ) {

            const zombie =
                zombies[z];


            const dx =
                zombie.x -
                trap.x;

            const dy =
                zombie.y -
                trap.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance < 45
            ) {

                zombie.health -=
                    trap.data.damage;

                trap.life = 0;


                if (
                    zombie.health <= 0
                ) {

                    zombies.splice(
                        z,
                        1
                    );

                    money += 100;

                    score += 100;

                }

                break;

            }

        }


        if (
            trap.life <= 0
        ) {

            activeTraps.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   DESENHAR BALAS
========================================================= */

function drawBullets() {

    ctx.fillStyle = "#ffe082";

    for (
        const bullet of bullets
    ) {

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


/* =========================================================
   DESENHAR ARMADILHAS
========================================================= */

function drawTraps() {

    for (
        const trap of activeTraps
    ) {

        ctx.save();

        ctx.translate(
            trap.x,
            trap.y
        );

        ctx.fillStyle = "#252525";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            20,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = "#aaa";

        ctx.lineWidth = 4;

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const a =
                i *
                Math.PI /
                4;

            ctx.beginPath();

            ctx.moveTo(
                Math.cos(a) * 12,
                Math.sin(a) * 12
            );

            ctx.lineTo(
                Math.cos(a) * 27,
                Math.sin(a) * 27
            );

            ctx.stroke();

        }

        ctx.restore();

    }

}


/* =========================================================
   DESENHAR BARRICADAS
========================================================= */

function drawBarricades() {

    for (
        const barricade of activeBarricades
    ) {

        ctx.save();

        ctx.translate(
            barricade.x,
            barricade.y
        );

        ctx.fillStyle = "#68452d";

        ctx.fillRect(
            -35,
            -12,
            70,
            10
        );

        ctx.fillRect(
            -35,
            4,
            70,
            10
        );

        ctx.strokeStyle = "#342219";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            -35,
            -12,
            70,
            26
        );

        ctx.restore();

    }

}


/* =========================================================
   DESENHAR AMIGO
========================================================= */

function drawFriend() {

    if (!friend)
        return;

    const dx =
        player.x -
        friend.x;

    const dy =
        player.y -
        friend.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance > 70) {

        friend.x +=
            (dx / distance) *
            friend.speed;

        friend.y +=
            (dy / distance) *
            friend.speed;

    }


    ctx.save();

    ctx.translate(
        friend.x,
        friend.y
    );


    drawShadow(
        0,
        14,
        18,
        6
    );


    ctx.font = "38px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        friend.icon,
        0,
        0
    );


    ctx.restore();

}


/* =========================================================
   FUNDO
========================================================= */

function drawBackground() {

    ctx.fillStyle = "#20262a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
       piso
    */

    ctx.strokeStyle =
        "rgba(255,255,255,.035)";

    ctx.lineWidth = 1;


    const grid = 70;


    for (
        let x = 0;
        x < canvas.width;
        x += grid
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

}


/* =========================================================
   CONTROLES
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;


        if (
            event.code === "KeyR"
        ) {

            reload();

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            shoot();

        }


        if (
            event.code >= "Digit1" &&
            event.code <= "Digit5"
        ) {

            const index =
                Number(
                    event.code.replace(
                        "Digit",
                        ""
                    )
                ) - 1;

            useInventorySlot(
                index
            );

        }


        if (
            event.code === "KeyE"
        ) {

            const item =
                inventory[selectedInventory];

            if (
                item &&
                (
                    item.type === "trap" ||
                    item.type === "barricade"
                )
            ) {

                useInventorySlot(
                    selectedInventory
                );

            }

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.code] = false;

    }
);


/* =========================================================
   MOUSE
========================================================= */

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

        if (
            event.button === 0
        ) {

            mouse.down = true;

            shoot();

        }

    }
);


window.addEventListener(
    "mouseup",
    event => {

        if (
            event.button === 0
        ) {

            mouse.down = false;

        }

    }
);


/* =========================================================
   MOVIMENTO
========================================================= */

function updatePlayer() {

    if (!player)
        return;


    let dx = 0;
    let dy = 0;


    if (
        keys["KeyW"] ||
        keys["ArrowUp"]
    ) {

        dy--;

    }


    if (
        keys["KeyS"] ||
        keys["ArrowDown"]
    ) {

        dy++;

    }


    if (
        keys["KeyA"] ||
        keys["ArrowLeft"]
    ) {

        dx--;

    }


    if (
        keys["KeyD"] ||
        keys["ArrowRight"]
    ) {

        dx++;

    }


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        dx /= length;
        dy /= length;


        player.x +=
            dx *
            player.speed;

        player.y +=
            dy *
            player.speed;

    }


    const margin = 30;


    player.x =
        Math.max(
            margin,
            Math.min(
                canvas.width - margin,
                player.x
            )
        );


    player.y =
        Math.max(
            margin,
            Math.min(
                canvas.height - margin,
                player.y
            )
        );

}


/* =========================================================
   LOOP PRINCIPAL
========================================================= */

let lastFrame =
    performance.now();


function gameLoop(time) {

    const delta =
        time - lastFrame;

    lastFrame = time;


    requestAnimationFrame(
        gameLoop
    );


    drawBackground();


    if (!player)
        return;


    if (running) {

        updatePlayer();

        updateZombies(delta);

        updateBullets();

        updateTraps();


        if (mouse.down) {

            shoot();

        }


        if (
            zombies.length === 0
        ) {

            wave++;

            running = false;

            shopScreen.style.display =
                "flex";

            spawnWave();

        }

    }


    drawBarricades();

    drawTraps();

    drawBullets();

    drawFriend();

    for (
        const zombie of zombies
    ) {

        drawZombie(
            zombie
        );

    }


    drawPlayer();

    updateHUD();

}


requestAnimationFrame(
    gameLoop
);


/* =========================================================
   BOTÕES DO MENU
========================================================= */

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(
                    b =>
                        b.classList.remove(
                            "active"
                        )
                );

                button.classList.add(
                    "active"
                );

                renderItems(
                    button.dataset.category
                );

            }
        );

    }
);


startWaveBtn.addEventListener(
    "click",
    () => {

        if (
            !playerNameInput.value.trim()
        ) {

            playerNameInput.focus();

            alert(
                "Digite seu nome antes de começar!"
            );

            return;

        }


        nameHud.textContent =
            playerNameInput.value.trim();

        startWave();

    }
);


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    running = false;

    gameStarted = false;

    canvas.style.display =
        "none";

    document.getElementById("hud")
        .style.display = "none";

    document.getElementById("gameInventory")
        .style.display = "none";

    gameOver.style.display =
        "flex";


    finalScore.innerHTML = `
        ${playerNameInput.value.trim() || "Jogador"}
        <br>
        Pontuação: ${score}
        <br>
        Onda alcançada: ${wave}
    `;

}


/* =========================================================
   RECOMEÇAR
========================================================= */

restartBtn.addEventListener(
    "click",
    () => {

        gameOver.style.display =
            "none";

        shopScreen.style.display =
            "flex";

        canvas.style.display =
            "none";

        initializeGame();

        renderItems(
            "armadura"
        );

    }
);


/* =========================================================
   INICIAR
========================================================= */

initializeGame();

renderItems(
    "armadura"
);

document.getElementById("hud")
    .style.display = "none";

document.getElementById("gameInventory")
    .style.display = "none";

gameOver.style.display =
    "none";
