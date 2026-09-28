const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const gameOverScreen = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const playerNameInput = document.getElementById("playerName");

const healthBar = document.getElementById("healthBar");
const ammoText = document.getElementById("ammo");
const weaponText = document.getElementById("weapon");
const waveText = document.getElementById("wave");
const enemiesText = document.getElementById("enemies");
const nameHud = document.getElementById("nameHud");
const finalScore = document.getElementById("finalScore");

let W = window.innerWidth;
let H = window.innerHeight;

canvas.width = W;
canvas.height = H;

window.addEventListener("resize", () => {

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

    if (player) {
        player.y = Math.min(player.y, H - 100);
    }
});


// ======================================================
// UTILIDADES
// ======================================================

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalize(x, y) {

    const length = Math.hypot(x, y);

    if (length === 0) {
        return { x: 0, y: 0 };
    }

    return {
        x: x / length,
        y: y / length
    };
}


// ======================================================
// INPUT
// ======================================================

const keys = {};

const mouse = {
    x: 0,
    y: 0,
    down: false
};

window.addEventListener("keydown", e => {

    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === "r") {
        reload();
    }

    if (e.key === "1") {
        equipWeapon(0);
    }

    if (e.key === "2") {
        equipWeapon(1);
    }

    if (e.key === "3") {
        equipWeapon(2);
    }

    if (e.key === " ") {
        e.preventDefault();
    }
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener("mousemove", e => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener("mousedown", e => {

    if (e.button === 0) {
        mouse.down = true;
    }
});

canvas.addEventListener("mouseup", e => {

    if (e.button === 0) {
        mouse.down = false;
    }
});


// ======================================================
// ARMAS
// ======================================================

const weapons = [

    {
        name: "PISTOLA",
        damage: 35,
        fireRate: 280,
        magazine: 12,
        ammo: 60,
        bulletSpeed: 950,
        spread: 0.025,
        recoil: 130,
        reloadTime: 850,
        pellets: 1
    },

    {
        name: "SHOTGUN",
        damage: 20,
        fireRate: 750,
        magazine: 6,
        ammo: 30,
        bulletSpeed: 850,
        spread: 0.28,
        recoil: 360,
        reloadTime: 1200,
        pellets: 7
    },

    {
        name: "SMG",
        damage: 17,
        fireRate: 85,
        magazine: 30,
        ammo: 120,
        bulletSpeed: 1050,
        spread: 0.075,
        recoil: 45,
        reloadTime: 1050,
        pellets: 1
    }

];

let currentWeapon = 0;

let weaponState = weapons.map(w => ({
    magazine: w.magazine,
    reserve: w.ammo
}));

let lastShot = 0;
let reloading = false;

function equipWeapon(index) {

    if (index < 0 || index >= weapons.length) return;

    currentWeapon = index;

    updateWeaponUI();
}

function updateWeaponUI() {

    const weapon = weapons[currentWeapon];
    const state = weaponState[currentWeapon];

    weaponText.textContent = weapon.name;

    ammoText.textContent =
        `${state.magazine} / ${state.reserve}`;
}

function reload() {

    if (!gameRunning || reloading) return;

    const weapon = weapons[currentWeapon];
    const state = weaponState[currentWeapon];

    if (
        state.magazine >= weapon.magazine ||
        state.reserve <= 0
    ) {
        return;
    }

    reloading = true;

    setTimeout(() => {

        const needed =
            weapon.magazine - state.magazine;

        const amount =
            Math.min(needed, state.reserve);

        state.magazine += amount;
        state.reserve -= amount;

        reloading = false;

        updateWeaponUI();

    }, weapon.reloadTime);
}


// ======================================================
// JOGADOR
// ======================================================

let player;

function createPlayer() {

    return {

        x: W / 2,
        y: H - 150,

        vx: 0,
        vy: 0,

        width: 35,
        height: 70,

        speed: 650,

        jumpForce: 760,

        gravity: 1900,

        health: 100,
        maxHealth: 100,

        grounded: false,

        facing: 1,

        invulnerable: 0,

        score: 0
    };
}


// ======================================================
// ZUMBIS
// ======================================================

let zombies = [];

let zombieTypes = [

    {
        name: "walker",
        health: 100,
        speed: 70,
        damage: 10,
        radius: 23,
        mass: 1,
        color: "#7f9b68"
    },

    {
        name: "runner",
        health: 70,
        speed: 135,
        damage: 14,
        radius: 19,
        mass: 0.75,
        color: "#9d7c67"
    },

    {
        name: "brute",
        health: 300,
        speed: 45,
        damage: 25,
        radius: 34,
        mass: 2.8,
        color: "#555e48"
    }
];

function spawnZombie() {

    const side =
        Math.random() < 0.5 ? -1 : 1;

    let type;

    const roll = Math.random();

    if (wave >= 4 && roll < 0.18) {
        type = zombieTypes[2];
    }
    else if (wave >= 2 && roll < 0.45) {
        type = zombieTypes[1];
    }
    else {
        type = zombieTypes[0];
    }

    const x = side === -1
        ? -80
        : W + 80;

    const zombie = {

        x: x,
        y: H - 100 - type.radius,

        vx: side === -1 ? 50 : -50,
        vy: 0,

        radius: type.radius,

        health: type.health,
        maxHealth: type.health,

        speed: type.speed,
        damage: type.damage,

        mass: type.mass,

        type: type.name,
        color: type.color,

        hitFlash: 0,

        ragdoll: false,

        parts: []
    };

    zombies.push(zombie);
}


// ======================================================
// FÍSICA DO RAGDOLL
// ======================================================

function createRagdoll(zombie, impactX, impactY) {

    zombie.ragdoll = true;

    zombie.parts = [

        {
            name: "head",
            x: zombie.x,
            y: zombie.y - zombie.radius - 12,
            vx: (zombie.x - impactX) * 4,
            vy: -random(200, 500),
            radius: zombie.radius * .45,
            mass: .7,
            angle: random(0, Math.PI * 2),
            angularVelocity: random(-10, 10)
        },

        {
            name: "body",
            x: zombie.x,
            y: zombie.y,
            vx: (zombie.x - impactX) * 3,
            vy: -random(80, 300),
            width: zombie.radius * 1.2,
            height: zombie.radius * 1.7,
            mass: 2,
            angle: random(0, Math.PI * 2),
            angularVelocity: random(-8, 8)
        },

        {
            name: "arm",
            x: zombie.x - zombie.radius,
            y: zombie.y,
            vx: random(-250, 250),
            vy: random(-300, 100),
            length: zombie.radius * 1.6,
            mass: .6,
            angle: random(0, Math.PI * 2),
            angularVelocity: random(-12, 12)
        },

        {
            name: "arm2",
            x: zombie.x + zombie.radius,
            y: zombie.y,
            vx: random(-250, 250),
            vy: random(-300, 100),
            length: zombie.radius * 1.6,
            mass: .6,
            angle: random(0, Math.PI * 2),
            angularVelocity: random(-12, 12)
        },

        {
            name: "leg",
            x: zombie.x - 10,
            y: zombie.y + zombie.radius,
            vx: random(-150, 150),
            vy: random(-200, 50),
            length: zombie.radius * 1.8,
            mass: .8,
            angle: random(0, Math.PI * 2),
            angularVelocity: random(-10, 10)
        },

        {
            name: "leg2",
            x: zombie.x + 10,
            y: zombie.y + zombie.radius,
            vx: random(-150, 150),
            vy: random(-200, 50),
            length: zombie.radius * 1.8,
            mass: .8,
            angle: random(0, Math.PI * 2),
            angularVelocity: random(-10, 10)
        }

    ];
}

function updateRagdoll(zombie, dt) {

    for (const part of zombie.parts) {

        part.vy += 1800 * dt;

        part.vx *= Math.pow(.985, dt * 60);
        part.vy *= Math.pow(.995, dt * 60);

        part.x += part.vx * dt;
        part.y += part.vy * dt;

        part.angle +=
            part.angularVelocity * dt;

        part.angularVelocity *= .99;

        const floor = H - 100;

        const radius =
            part.radius ||
            Math.max(part.width || 10, part.length || 10) / 2;

        if (part.y + radius > floor) {

            part.y = floor - radius;

            part.vy *= -.35;
            part.vx *= .82;

            part.angularVelocity *= .8;
        }
    }
}


// ======================================================
// BALAS
// ======================================================

let bullets = [];

function shoot() {

    if (!gameRunning || reloading) return;

    const now = performance.now();

    const weapon = weapons[currentWeapon];
    const state = weaponState[currentWeapon];

    if (
        now - lastShot <
        weapon.fireRate
    ) {
        return;
    }

    if (state.magazine <= 0) {

        reload();
        return;
    }

    state.magazine--;

    lastShot = now;

    const originX = player.x + player.facing * 28;
    const originY = player.y - 10;

    const targetX = mouse.x;
    const targetY = mouse.y;

    const direction =
        normalize(
            targetX - originX,
            targetY - originY
        );

    player.vx -=
        direction.x *
        weapon.recoil /
        player.speed;

    player.vy -=
        direction.y *
        weapon.recoil /
        player.speed;

    for (let i = 0; i < weapon.pellets; i++) {

        const angle =
            Math.atan2(direction.y, direction.x) +
            random(-weapon.spread, weapon.spread);

        bullets.push({

            x: originX,
            y: originY,

            vx: Math.cos(angle) *
                weapon.bulletSpeed,

            vy: Math.sin(angle) *
                weapon.bulletSpeed,

            damage:
                weapon.damage *
                random(.85, 1.15),

            life: 1.5,

            radius:
                currentWeapon === 1 ? 3 : 2
        });
    }

    updateWeaponUI();
}


// ======================================================
// BARRICADA
// ======================================================

let barricades = [];

function createBarricades() {

    barricades = [

        {
            x: W / 2 - 130,
            y: H - 150,
            width: 260,
            height: 28,
            health: 800,
            maxHealth: 800
        },

        {
            x: 100,
            y: H - 260,
            width: 170,
            height: 25,
            health: 450,
            maxHealth: 450
        },

        {
            x: W - 270,
            y: H - 260,
            width: 170,
            height: 25,
            health: 450,
            maxHealth: 450
        }
    ];
}


// ======================================================
// ONDAS
// ======================================================

let wave = 1;
let zombiesToSpawn = 0;
let spawnTimer = 0;
let waveDelay = 0;

function startWave() {

    zombiesToSpawn =
        5 + wave * 3;

    waveText.textContent =
        `ONDA ${wave}`;
}

function updateWaves(dt) {

    if (zombiesToSpawn > 0) {

        spawnTimer -= dt;

        if (spawnTimer <= 0) {

            spawnZombie();

            zombiesToSpawn--;

            spawnTimer =
                Math.max(
                    .25,
                    .9 - wave * .035
                );
        }
    }

    else if (zombies.length === 0) {

        waveDelay += dt;

        if (waveDelay > 3) {

            wave++;

            waveDelay = 0;

            repairBarricades();

            startWave();
        }
    }
}

function repairBarricades() {

    for (const b of barricades) {

        b.health =
            Math.min(
                b.maxHealth,
                b.health + b.maxHealth * .25
            );
    }
}


// ======================================================
// COLISÕES
// ======================================================

function resolveZombieCollisions() {

    for (let i = 0; i < zombies.length; i++) {

        const a = zombies[i];

        if (a.ragdoll) continue;

        for (let j = i + 1; j < zombies.length; j++) {

            const b = zombies[j];

            if (b.ragdoll) continue;

            let dx = b.x - a.x;
            let dy = b.y - a.y;

            let dist = Math.hypot(dx, dy);

            const minDist =
                a.radius + b.radius;

            if (dist < minDist) {

                if (dist === 0) {
                    dx = 1;
                    dy = 0;
                    dist = 1;
                }

                const nx = dx / dist;
                const ny = dy / dist;

                const overlap =
                    minDist - dist;

                const totalMass =
                    a.mass + b.mass;

                a.x -=
                    nx *
                    overlap *
                    (b.mass / totalMass);

                a.y -=
                    ny *
                    overlap *
                    (b.mass / totalMass);

                b.x +=
                    nx *
                    overlap *
                    (a.mass / totalMass);

                b.y +=
                    ny *
                    overlap *
                    (a.mass / totalMass);

                const relativeVelocity =
                    (b.vx - a.vx) * nx +
                    (b.vy - a.vy) * ny;

                if (relativeVelocity < 0) {

                    const impulse =
                        -relativeVelocity * .8;

                    a.vx -=
                        nx *
                        impulse *
                        (b.mass / totalMass);

                    b.vx +=
                        nx *
                        impulse *
                        (a.mass / totalMass);
                }
            }
        }
    }
}


// ======================================================
// DANO
// ======================================================

function damagePlayer(amount) {

    if (player.invulnerable > 0) {
        return;
    }

    player.health -= amount;

    player.invulnerable = .35;

    healthBar.style.width =
        `${clamp(player.health, 0, 100)}%`;

    if (player.health <= 0) {
        endGame();
    }
}

function damageBarricade(barricade, amount) {

    barricade.health -= amount;

    if (barricade.health < 0) {
        barricade.health = 0;
    }
}


// ======================================================
// UPDATE ZUMBIS
// ======================================================

function updateZombies(dt) {

    for (let i = zombies.length - 1; i >= 0; i--) {

        const z = zombies[i];

        if (z.ragdoll) {

            updateRagdoll(z, dt);

            let allSlow = true;

            for (const p of z.parts) {

                if (
                    Math.abs(p.vx) > 10 ||
                    Math.abs(p.vy) > 10
                ) {
                    allSlow = false;
                    break;
                }
            }

            if (allSlow) {

                z.deadTimer =
                    (z.deadTimer || 0) + dt;

                if (z.deadTimer > 3) {
                    zombies.splice(i, 1);
                }
            }

            continue;
        }

        z.hitFlash =
            Math.max(
                0,
                z.hitFlash - dt
            );

        const direction =
            normalize(
                player.x - z.x,
                0
            );

        z.vx =
            direction.x *
            z.speed;

        z.x += z.vx * dt;

        // chão
        z.y =
            H - 100 -
            z.radius;

        // ataque ao jogador
        if (
            Math.abs(z.x - player.x) <
            z.radius + 30
        ) {

            damagePlayer(
                z.damage * dt
            );

            // pequeno empurrão
            player.vx +=
                direction.x *
                -80 *
                dt;
        }

        // ataque às barricadas
        for (const b of barricades) {

            const closestX =
                clamp(
                    z.x,
                    b.x,
                    b.x + b.width
                );

            const closestY =
                clamp(
                    z.y,
                    b.y,
                    b.y + b.height
                );

            const dx =
                z.x - closestX;

            const dy =
                z.y - closestY;

            if (
                Math.hypot(dx, dy) <
                z.radius
            ) {

                damageBarricade(
                    b,
                    z.damage * dt
                );

                z.vx *= .3;
            }
        }
    }

    resolveZombieCollisions();

    enemiesText.textContent =
        `Zumbis: ${zombies.length + zombiesToSpawn}`;
}


// ======================================================
// UPDATE BALAS
// ======================================================

function updateBullets(dt) {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const b = bullets[i];

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        b.life -= dt;

        let remove = false;

        // colisão com zumbis
        for (const z of zombies) {

            if (z.ragdoll) continue;

            const dx =
                b.x - z.x;

            const dy =
                b.y - z.y;

            if (
                Math.hypot(dx, dy) <
                z.radius
            ) {

                z.health -=
                    b.damage;

                z.hitFlash = .1;

                const impact =
                    normalize(
                        b.vx,
                        b.vy
                    );

                z.vx +=
                    impact.x *
                    b.damage *
                    2 /
                    z.mass;

                if (z.health <= 0) {

                    player.score +=
                        z.type === "brute"
                            ? 100
                            : z.type === "runner"
                                ? 40
                                : 20;

                    createRagdoll(
                        z,
                        b.x,
                        b.y
                    );
                }

                remove = true;

                break;
            }
        }

        // colisão com barricadas
        if (!remove) {

            for (const barricade of barricades) {

                if (
                    b.x > barricade.x &&
                    b.x <
                    barricade.x +
                    barricade.width &&
                    b.y >
                    barricade.y &&
                    b.y <
                    barricade.y +
                    barricade.height
                ) {

                    damageBarricade(
                        barricade,
                        8
                    );

                    remove = true;
                    break;
                }
            }
        }

        if (
            b.life <= 0 ||
            b.x < -100 ||
            b.x > W + 100 ||
            b.y < -100 ||
            b.y > H + 100
        ) {
            remove = true;
        }

        if (remove) {
            bullets.splice(i, 1);
        }
    }
}


// ======================================================
// UPDATE PLAYER
// ======================================================

function updatePlayer(dt) {

    if (player.invulnerable > 0) {
        player.invulnerable -= dt;
    }

    let movement = 0;

    if (keys["a"] || keys["arrowleft"]) {
        movement -= 1;
    }

    if (keys["d"] || keys["arrowright"]) {
        movement += 1;
    }

    const acceleration =
        player.grounded
            ? 4200
            : 2400;

    player.vx +=
        movement *
        acceleration *
        dt;

    const friction =
        player.grounded
            ? .78
            : .97;

    player.vx *=
        Math.pow(friction, dt * 60);

    player.vx =
        clamp(
            player.vx,
            -player.speed,
            player.speed
        );

    if (
        (keys["w"] ||
        keys["arrowup"] ||
        keys[" "]) &&
        player.grounded
    ) {

        player.vy =
            -player.jumpForce;

        player.grounded = false;
    }

    player.vy +=
        player.gravity *
        dt;

    player.x +=
        player.vx *
        dt;

    player.y +=
        player.vy *
        dt;

    // limites
    player.x =
        clamp(
            player.x,
            30,
            W - 30
        );

    const floor =
        H - 100;

    if (
        player.y +
        player.height / 2 >
        floor
    ) {

        player.y =
            floor -
            player.height / 2;

        player.vy = 0;

        player.grounded = true;
    }

    if (mouse.x > player.x) {
        player.facing = 1;
    }
    else {
        player.facing = -1;
    }

    if (mouse.down) {
        shoot();
    }
}


// ======================================================
// DESENHO
// ======================================================

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#101820"
    );

    gradient.addColorStop(
        1,
        "#07090b"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    // lua
    ctx.beginPath();

    ctx.arc(
        W - 130,
        110,
        45,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(220,220,200,.15)";

    ctx.fill();

    // prédios
    for (
        let x = 0;
        x < W;
        x += 90
    ) {

        const height =
            80 +
            ((x * 17) % 130);

        ctx.fillStyle =
            "#0b1014";

        ctx.fillRect(
            x,
            H - 100 - height,
            75,
            height
        );

        for (
            let y = H - 125 - height;
            y < H - 110;
            y += 22
        ) {

            ctx.fillStyle =
                "rgba(200,160,80,.15)";

            ctx.fillRect(
                x + 10,
                y,
                8,
                10
            );

            ctx.fillRect(
                x + 35,
                y,
                8,
                10
            );

            ctx.fillRect(
                x + 58,
                y,
                8,
                10
            );
        }
    }

    // chão

    ctx.fillStyle = "#151515";

    ctx.fillRect(
        0,
        H - 100,
        W,
        100
    );

    ctx.fillStyle = "#242424";

    ctx.fillRect(
        0,
        H - 100,
        W,
        4
    );

    // linhas do chão

    for (
        let x = 0;
        x < W;
        x += 70
    ) {

        ctx.fillStyle =
            "#1c1c1c";

        ctx.fillRect(
            x,
            H - 55,
            45,
            3
        );
    }
}

function drawBarricades() {

    for (const b of barricades) {

        const health =
            b.health / b.maxHealth;

        ctx.fillStyle =
            "#5c3c22";

        ctx.fillRect(
            b.x,
            b.y,
            b.width,
            b.height
        );

        ctx.strokeStyle =
            "#27190e";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            b.x,
            b.y,
            b.width,
            b.height
        );

        // barras de madeira
        ctx.strokeStyle =
            "#8a5a31";

        ctx.lineWidth = 5;

        for (
            let x = b.x - 10;
            x < b.x + b.width;
            x += 45
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                b.y
            );

            ctx.lineTo(
                x + 25,
                b.y + b.height
            );

            ctx.stroke();
        }

        // vida

        ctx.fillStyle =
            "#300";

        ctx.fillRect(
            b.x,
            b.y - 9,
            b.width,
            5
        );

        ctx.fillStyle =
            "#ce3a32";

        ctx.fillRect(
            b.x,
            b.y - 9,
            b.width * health,
            5
        );
    }
}

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    if (player.facing < 0) {
        ctx.scale(-1, 1);
    }

    // sombra
    ctx.beginPath();

    ctx.ellipse(
        0,
        38,
        25,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(0,0,0,.5)";

    ctx.fill();

    // pernas
    ctx.fillStyle = "#292929";

    ctx.fillRect(
        -15,
        12,
        11,
        27
    );

    ctx.fillRect(
        5,
        12,
        11,
        27
    );

    // corpo
    ctx.fillStyle =
        player.invulnerable > 0
            ? "#eeeeee"
            : "#526273";

    ctx.fillRect(
        -18,
        -28,
        36,
        45
    );

    // cabeça
    ctx.beginPath();

    ctx.arc(
        0,
        -43,
        14,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#c99a78";

    ctx.fill();

    // arma

    const gunAngle =
        Math.atan2(
            mouse.y - player.y,
            Math.abs(mouse.x - player.x)
        );

    ctx.save();

    ctx.rotate(
        clamp(
            gunAngle,
            -.8,
            .8
        )
    );

    ctx.fillStyle =
        "#111";

    ctx.fillRect(
        5,
        -20,
        35,
        7
    );

    ctx.fillStyle =
        "#333";

    ctx.fillRect(
        10,
        -13,
        10,
        14
    );

    ctx.restore();

    ctx.restore();
}

function drawZombie(z) {

    if (z.ragdoll) {

        drawRagdoll(z);

        return;
    }

    ctx.save();

    ctx.translate(
        z.x,
        z.y
    );

    const direction =
        player.x > z.x ? 1 : -1;

    ctx.scale(
        direction,
        1
    );

    // sombra

    ctx.beginPath();

    ctx.ellipse(
        0,
        z.radius + 5,
        z.radius,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(0,0,0,.45)";

    ctx.fill();

    // pernas

    ctx.strokeStyle =
        "#343a2c";

    ctx.lineWidth = 9;

    ctx.beginPath();

    ctx.moveTo(
        -8,
        z.radius * .4
    );

    ctx.lineTo(
        -12,
        z.radius * 1.5
    );

    ctx.moveTo(
        8,
        z.radius * .4
    );

    ctx.lineTo(
        13,
        z.radius * 1.5
    );

    ctx.stroke();

    // corpo

    ctx.fillStyle =
        z.hitFlash > 0
            ? "#ffffff"
            : z.color;

    ctx.fillRect(
        -z.radius * .65,
        -z.radius * .5,
        z.radius * 1.3,
        z.radius * 1.4
    );

    // cabeça

    ctx.beginPath();

    ctx.arc(
        0,
        -z.radius * .9,
        z.radius * .6,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        z.hitFlash > 0
            ? "#fff"
            : "#738c5b";

    ctx.fill();

    // olhos

    ctx.fillStyle =
        "#e52c2c";

    ctx.beginPath();

    ctx.arc(
        -6,
        -z.radius * .95,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        6,
        -z.radius * .95,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // braços

    ctx.strokeStyle =
        "#738c5b";

    ctx.lineWidth = 8;

    ctx.beginPath();

    ctx.moveTo(
        -z.radius * .6,
        -z.radius * .1
    );

    ctx.lineTo(
        -z.radius * 1.25,
        z.radius * .55
    );

    ctx.moveTo(
        z.radius * .6,
        -z.radius * .1
    );

    ctx.lineTo(
        z.radius * 1.25,
        z.radius * .55
    );

    ctx.stroke();

    // barra de vida

    const health =
        z.health / z.maxHealth;

    ctx.fillStyle =
        "#250000";

    ctx.fillRect(
        -z.radius,
        -z.radius * 1.7,
        z.radius * 2,
        4
    );

    ctx.fillStyle =
        "#d63030";

    ctx.fillRect(
        -z.radius,
        -z.radius * 1.7,
        z.radius * 2 * health,
        4
    );

    ctx.restore();
}

function drawRagdoll(z) {

    for (const p of z.parts) {

        ctx.save();

        ctx.translate(
            p.x,
            p.y
        );

        ctx.rotate(
            p.angle
        );

        ctx.fillStyle =
            "#657053";

        if (p.name === "head") {

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                p.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        else if (p.name === "body") {

            ctx.fillRect(
                -p.width / 2,
                -p.height / 2,
                p.width,
                p.height
            );
        }

        else {

            ctx.fillRect(
                -5,
                -p.length / 2,
                10,
                p.length
            );
        }

        ctx.restore();
    }
}

function drawBullets() {

    for (const b of bullets) {

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            b.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffd86b";

        ctx.fill();

        // rastro

        ctx.beginPath();

        ctx.moveTo(
            b.x,
            b.y
        );

        ctx.lineTo(
            b.x -
            b.vx * .015,
            b.y -
            b.vy * .015
        );

        ctx.strokeStyle =
            "rgba(255,220,100,.4)";

        ctx.lineWidth = 2;

        ctx.stroke();
    }
}


// ======================================================
// LOOP
// ======================================================

let gameRunning = false;
let lastTime = 0;

function gameLoop(time) {

    if (!gameRunning) return;

    let dt =
        (time - lastTime) / 1000;

    lastTime = time;

    dt =
        Math.min(
            dt,
            .033
        );

    updatePlayer(dt);

    updateZombies(dt);

    updateBullets(dt);

    updateWaves(dt);

    draw();

    requestAnimationFrame(
        gameLoop
    );
}

function draw() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawBackground();

    drawBarricades();

    for (const b of bullets) {
        // desenhado depois das estruturas
    }

    for (const z of zombies) {
        drawZombie(z);
    }

    drawBullets();

    drawPlayer();
}


// ======================================================
// INICIAR
// ======================================================

function startGame() {

    let playerName =
        playerNameInput.value.trim();

    if (!playerName) {
        playerName = "Jogador";
    }

    nameHud.textContent =
        playerName;

    player =
        createPlayer();

    zombies = [];

    bullets = [];

    wave = 1;

    waveDelay = 0;

    currentWeapon = 0;

    weaponState = weapons.map(w => ({
        magazine: w.magazine,
        reserve: w.ammo
    }));

    reloading = false;

    createBarricades();

    startWave();

    healthBar.style.width =
        "100%";

    updateWeaponUI();

    menu.style.display =
        "none";

    gameOverScreen.style.display =
        "none";

    hud.style.display =
        "flex";

    gameRunning = true;

    lastTime =
        performance.now();

    requestAnimationFrame(
        gameLoop
    );
}

function endGame() {

    gameRunning = false;

    hud.style.display =
        "none";

    gameOverScreen.style.display =
        "flex";

    finalScore.textContent =
        `Pontuação: ${player.score} | Ondas alcançadas: ${wave}`;
}

startBtn.addEventListener(
    "click",
    startGame
);

restartBtn.addEventListener(
    "click",
    startGame
);

playerNameInput.addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {
            startGame();
        }
    }
);
