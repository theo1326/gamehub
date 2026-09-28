const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");


let W =
    window.innerWidth;

let H =
    window.innerHeight;


canvas.width = W;
canvas.height = H;


// =====================================================
// ELEMENTOS
// =====================================================

const shopScreen =
    document.getElementById("shopScreen");

const shopWeapons =
    document.getElementById("shopWeapons");

const moneyText =
    document.getElementById("money");

const ammoBtn =
    document.getElementById("ammoBtn");

const startWaveBtn =
    document.getElementById("startWaveBtn");

const playerNameInput =
    document.getElementById("playerName");

const hud =
    document.getElementById("hud");

const nameHud =
    document.getElementById("nameHud");

const healthBar =
    document.getElementById("healthBar");

const armorBar =
    document.getElementById("armorBar");

const waveText =
    document.getElementById("wave");

const enemiesText =
    document.getElementById("enemies");

const weaponText =
    document.getElementById("weapon");

const ammoText =
    document.getElementById("ammo");

const moneyHud =
    document.getElementById("moneyHud");

const gameOver =
    document.getElementById("gameOver");

const finalScore =
    document.getElementById("finalScore");

const restartBtn =
    document.getElementById("restartBtn");


// =====================================================
// ESTADO
// =====================================================

let gameRunning = false;

let player = null;

let zombies = [];

let bullets = [];

let objects = [];

let particles = [];

let wave = 1;

let zombiesToSpawn = 0;

let spawnTimer = 0;

let waveActive = false;

let money = 1000;

let score = 0;

let lastTime = 0;

let currentWeapon = 0;

let reloading = false;

let lastShot = 0;


// =====================================================
// INPUT
// =====================================================

const keys = {};

const mouse = {

    x: 0,

    y: 0,

    down: false

};


window.addEventListener(
    "keydown",
    e => {

        keys[
            e.key.toLowerCase()
        ] = true;

        if (
            e.key.toLowerCase()
            === "r"
        ) {

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

    }
);


window.addEventListener(
    "keyup",
    e => {

        keys[
            e.key.toLowerCase()
        ] = false;

    }
);


canvas.addEventListener(
    "mousemove",
    e => {

        mouse.x =
            e.clientX;

        mouse.y =
            e.clientY;

    }
);


canvas.addEventListener(
    "mousedown",
    e => {

        if (e.button === 0) {

            mouse.down = true;
        }

    }
);


canvas.addEventListener(
    "mouseup",
    e => {

        if (e.button === 0) {

            mouse.down = false;
        }

    }
);


// =====================================================
// ARMAS
// =====================================================

const weapons = [

    {
        name: "PISTOLA",

        icon: "🔫",

        price: 0,

        damage: 35,

        fireRate: 280,

        magazine: 12,

        reserve: 60,

        bulletSpeed: 1000,

        spread: .025,

        recoil: 120,

        reloadTime: 800
    },

    {
        name: "ESCOPETA",

        icon: "💥",

        price: 1500,

        damage: 24,

        fireRate: 750,

        magazine: 6,

        reserve: 30,

        bulletSpeed: 850,

        spread: .22,

        pellets: 8,

        recoil: 350,

        reloadTime: 1100
    },

    {
        name: "SMG",

        icon: "🔫",

        price: 2500,

        damage: 18,

        fireRate: 90,

        magazine: 30,

        reserve: 120,

        bulletSpeed: 1100,

        spread: .07,

        pellets: 1,

        recoil: 40,

        reloadTime: 1000
    },

    {
        name: "RIFLE",

        icon: "🎯",

        price: 4000,

        damage: 85,

        fireRate: 500,

        magazine: 8,

        reserve: 40,

        bulletSpeed: 1500,

        spread: .01,

        pellets: 1,

        recoil: 240,

        reloadTime: 1300
    }

];


let weaponState =
    weapons.map(
        weapon => ({

            owned:
                weapon.price === 0,

            magazine:
                weapon.magazine,

            reserve:
                weapon.reserve

        })
    );


// =====================================================
// LOJA
// =====================================================

function renderShop() {

    moneyText.textContent =
        money.toLocaleString(
            "pt-BR"
        );


    shopWeapons.innerHTML =
        "";


    weapons.forEach(
        (weapon, index) => {

            const state =
                weaponState[index];


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "weapon-card";


            if (state.owned) {

                card.classList.add(
                    "owned"
                );
            }


            const buttonText =
                state.owned
                    ? "EQUIPAR"
                    : `COMPRAR — $${weapon.price}`;


            card.innerHTML = `

                <div class="weapon-icon">
                    ${weapon.icon}
                </div>

                <h3>
                    ${weapon.name}
                </h3>

                <p>
                    Dano: ${weapon.damage}<br>
                    Carregador: ${weapon.magazine}<br>
                    Munição: ${weapon.reserve}
                </p>

                <div class="weapon-price">
                    ${
                        state.owned
                        ? "✓ DESBLOQUEADA"
                        : "$" +
                          weapon.price
                    }
                </div>

                <button
                    class="weapon-button"
                    data-index="${index}">
                    ${buttonText}
                </button>

            `;


            const button =
                card.querySelector(
                    ".weapon-button"
                );


            button.addEventListener(
                "click",
                () => {

                    buyOrEquipWeapon(
                        index
                    );

                }
            );


            shopWeapons.appendChild(
                card
            );

        }
    );
}


function buyOrEquipWeapon(index) {

    const weapon =
        weapons[index];

    const state =
        weaponState[index];


    if (state.owned) {

        currentWeapon =
            index;

        renderShop();

        return;
    }


    if (
        money <
        weapon.price
    ) {

        alert(
            "Dinheiro insuficiente!"
        );

        return;
    }


    money -=
        weapon.price;


    state.owned =
        true;


    currentWeapon =
        index;


    renderShop();

    updateUI();
}


ammoBtn.addEventListener(
    "click",
    () => {

        const state =
            weaponState[
                currentWeapon
            ];

        const weapon =
            weapons[
                currentWeapon
            ];


        const price = 250;


        if (
            money <
            price
        ) {

            alert(
                "Você não tem dinheiro suficiente."
            );

            return;
        }


        money -= price;


        state.reserve +=
            weapon.reserve;


        renderShop();

        updateUI();

    }
);


startWaveBtn.addEventListener(
    "click",
    startWave
);


// =====================================================
// PLAYER
// =====================================================

function createPlayer() {

    return {

        x:
            W / 2,

        y:
            H - 170,

        vx: 0,

        vy: 0,

        width: 38,

        height: 72,

        speed: 650,

        jumpForce: 760,

        gravity: 1900,

        grounded: false,

        facing: 1,

        health: 100,

        maxHealth: 100,

        armor: 100,

        maxArmor: 100,

        invulnerable: 0

    };

}


// =====================================================
// OBJETOS DO PLAYGROUND
// =====================================================

function createObjects() {

    objects = [];


    // caixas

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        objects.push({

            type: "box",

            x:
                100 +
                i * 130,

            y:
                H - 135 -

                (
                    i % 2
                ) * 60,

            width: 50,

            height: 50,

            vx: 0,

            vy: 0,

            mass: 1,

            health: 100

        });

    }


    // barris

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        objects.push({

            type: "barrel",

            x:
                150 +
                i * 190,

            y:
                H - 135,

            radius: 25,

            vx: 0,

            vy: 0,

            mass: 1.3,

            health: 150

        });

    }


    // plataformas

    objects.push({

        type: "platform",

        x: 40,

        y: H - 300,

        width: 220,

        height: 22,

        vx: 0,

        vy: 0,

        mass: 999,

        health: 1000

    });


    objects.push({

        type: "platform",

        x: W - 260,

        y: H - 300,

        width: 220,

        height: 22,

        vx: 0,

        vy: 0,

        mass: 999,

        health: 1000

    });

}


// =====================================================
// ZUMBIS
// =====================================================

const zombieTypes = [

    {

        type: "walker",

        health: 100,

        speed: 65,

        damage: 10,

        radius: 23,

        mass: 1,

        color: "#758b62"

    },

    {

        type: "runner",

        health: 70,

        speed: 135,

        damage: 15,

        radius: 19,

        mass: .7,

        color: "#9c755d"

    },

    {

        type: "brute",

        health: 350,

        speed: 42,

        damage: 25,

        radius: 34,

        mass: 3,

        color: "#566044"

    }

];


function spawnZombie() {

    const side =
        Math.random() <
        .5
            ? -1
            : 1;


    const roll =
        Math.random();


    let type;


    if (
        wave >= 4 &&
        roll < .15
    ) {

        type =
            zombieTypes[2];

    }
    else if (
        wave >= 2 &&
        roll < .45
    ) {

        type =
            zombieTypes[1];

    }
    else {

        type =
            zombieTypes[0];

    }


    zombies.push({

        x:
            side === -1
                ? -80
                : W + 80,

        y:
            H -
            100 -
            type.radius,

        vx:
            side === -1
                ? 50
                : -50,

        vy: 0,

        radius:
            type.radius,

        health:
            type.health,

        maxHealth:
            type.health,

        speed:
            type.speed,

        damage:
            type.damage,

        mass:
            type.mass,

        type:
            type.type,

        color:
            type.color,

        ragdoll: false,

        parts: [],

        hitFlash: 0

    });

}


// =====================================================
// RAGDOLL
// =====================================================

function createRagdoll(
    zombie,
    impactX,
    impactY
) {

    zombie.ragdoll =
        true;


    const forceX =
        (
            zombie.x -
            impactX
        ) * 3;


    zombie.parts = [

        {

            type: "head",

            x:
                zombie.x,

            y:
                zombie.y -
                30,

            vx:
                forceX,

            vy:
                -350,

            radius:
                10,

            angle: 0,

            angular:
                random(
                    -8,
                    8
                )

        },

        {

            type: "body",

            x:
                zombie.x,

            y:
                zombie.y,

            vx:
                forceX,

            vy:
                -220,

            width:
                28,

            height:
                42,

            angle: 0,

            angular:
                random(
                    -8,
                    8
                )

        },

        {

            type: "limb",

            x:
                zombie.x -
                20,

            y:
                zombie.y,

            vx:
                forceX -
                150,

            vy:
                -180,

            length:
                40,

            angle: 0,

            angular:
                random(
                    -10,
                    10
                )

        },

        {

            type: "limb",

            x:
                zombie.x +
                20,

            y:
                zombie.y,

            vx:
                forceX +
                150,

            vy:
                -180,

            length:
                40,

            angle: 0,

            angular:
                random(
                    -10,
                    10
                )

        },

        {

            type: "limb",

            x:
                zombie.x -
                10,

            y:
                zombie.y +
                35,

            vx:
                forceX -
                80,

            vy:
                -100,

            length:
                48,

            angle: 0,

            angular:
                random(
                    -10,
                    10
                )

        },

        {

            type: "limb",

            x:
                zombie.x +
                10,

            y:
                zombie.y +
                35,

            vx:
                forceX +
                80,

            vy:
                -100,

            length:
                48,

            angle: 0,

            angular:
                random(
                    -10,
                    10
                )

        }

    ];

}


function updateRagdoll(
    zombie,
    dt
) {

    let moving =
        false;


    for (
        const part
        of zombie.parts
    ) {

        part.vy +=
            1800 * dt;


        part.vx *=
            .985;


        part.vy *=
            .995;


        part.x +=
            part.vx * dt;


        part.y +=
            part.vy * dt;


        part.angle +=
            part.angular * dt;


        part.angular *=
            .985;


        const floor =
            H - 100;


        const radius =
            part.radius ||
            10;


        if (
            part.y +
            radius >
            floor
        ) {

            part.y =
                floor -
                radius;


            part.vy *=
                -.35;


            part.vx *=
                .82;


            part.angular *=
                .8;

        }


        if (
            Math.abs(
                part.vx
            ) > 10 ||
            Math.abs(
                part.vy
            ) > 10
        ) {

            moving =
                true;

        }

    }


    if (!moving) {

        zombie.deadTime =
            (
                zombie.deadTime ||
                0
            ) + dt;

    }

}


// =====================================================
// BALAS
// =====================================================

function shoot() {

    if (
        !gameRunning ||
        reloading
    ) return;


    const now =
        performance.now();


    const weapon =
        weapons[
            currentWeapon
        ];


    const state =
        weaponState[
            currentWeapon
        ];


    if (
        now -
        lastShot <
        weapon.fireRate
    ) {

        return;

    }


    if (
        state.magazine <= 0
    ) {

        reload();

        return;

    }


    state.magazine--;


    lastShot =
        now;


    const originX =
        player.x +
        player.facing *
        25;


    const originY =
        player.y -
        12;


    const direction =
        normalize(

            mouse.x -
            originX,

            mouse.y -
            originY

        );


    player.vx -=
        direction.x *
        weapon.recoil /
        5;


    player.vy -=
        direction.y *
        weapon.recoil /
        10;


    const pellets =
        weapon.pellets ||
        1;


    for (
        let i = 0;
        i < pellets;
        i++
    ) {

        const angle =
            Math.atan2(
                direction.y,
                direction.x
            ) +
            random(
                -weapon.spread,
                weapon.spread
            );


        bullets.push({

            x:
                originX,

            y:
                originY,

            vx:
                Math.cos(angle) *
                weapon.bulletSpeed,

            vy:
                Math.sin(angle) *
                weapon.bulletSpeed,

            damage:
                weapon.damage *
                random(
                    .85,
                    1.15
                ),

            life:
                1.5

        });

    }


    updateUI();

}


function reload() {

    if (
        reloading ||
        !gameRunning
    ) return;


    const weapon =
        weapons[
            currentWeapon
        ];


    const state =
        weaponState[
            currentWeapon
        ];


    if (
        state.magazine >=
        weapon.magazine ||
        state.reserve <= 0
    ) {

        return;

    }


    reloading =
        true;


    setTimeout(
        () => {

            const needed =
                weapon.magazine -
                state.magazine;


            const amount =
                Math.min(
                    needed,
                    state.reserve
                );


            state.magazine +=
                amount;


            state.reserve -=
                amount;


            reloading =
                false;


            updateUI();

        },

        weapon.reloadTime
    );

}


// =====================================================
// UPDATE PLAYER
// =====================================================

function updatePlayer(dt) {

    if (
        player.invulnerable >
        0
    ) {

        player.invulnerable -=
            dt;

    }


    let movement =
        0;


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        movement--;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        movement++;

    }


    player.vx +=
        movement *
        4000 *
        dt;


    player.vx *=
        Math.pow(
            player.grounded
                ? .78
                : .96,

            dt * 60
        );


    player.vx =
        clamp(
            player.vx,
            -player.speed,
            player.speed
        );


    if (
        (
            keys["w"] ||
            keys["arrowup"] ||
            keys[" "]
        ) &&
        player.grounded
    ) {

        player.vy =
            -player.jumpForce;

        player.grounded =
            false;

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


    player.x =
        clamp(
            player.x,
            25,
            W - 25
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

        player.vy =
            0;

        player.grounded =
            true;

    }


    player.facing =
        mouse.x >
        player.x
            ? 1
            : -1;


    if (mouse.down) {

        shoot();

    }


    updateObjectCollisions();

}


// =====================================================
// OBJETOS FÍSICOS
// =====================================================

function updateObjects(dt) {

    for (
        const object
        of objects
    ) {

        if (
            object.type ===
            "platform"
        ) continue;


        object.vy +=
            1800 * dt;


        object.vx *=
            .985;


        object.vy *=
            .995;


        object.x +=
            object.vx * dt;


        object.y +=
            object.vy * dt;


        if (
            object.type ===
            "box"
        ) {

            const floor =
                H - 100;


            if (
                object.y +
                object.height >
                floor
            ) {

                object.y =
                    floor -
                    object.height;

                object.vy *=
                    -.25;

                object.vx *=
                    .8;

            }

        }


        if (
            object.type ===
            "barrel"
        ) {

            const floor =
                H - 100;


            if (
                object.y +
                object.radius >
                floor
            ) {

                object.y =
                    floor -
                    object.radius;

                object.vy *=
                    -.3;

                object.vx *=
                    .8;

            }

        }

    }

}


function updateObjectCollisions() {

    for (
        const object
        of objects
    ) {

        if (
            object.type ===
            "platform"
        ) {

            if (
                player.x >
                object.x &&
                player.x <
                object.x +
                object.width &&
                player.y +
                player.height /
                2 >
                object.y &&
                player.y +
                player.height /
                2 <
                object.y +
                30 &&
                player.vy >= 0
            ) {

                player.y =
                    object.y -
                    player.height /
                    2;

                player.vy =
                    0;

                player.grounded =
                    true;

            }

        }

    }

}


// =====================================================
// ZUMBIS
// =====================================================

function updateZombies(dt) {

    for (
        let i =
        zombies.length - 1;

        i >= 0;

        i--
    ) {

        const z =
            zombies[i];


        if (
            z.ragdoll
        ) {

            updateRagdoll(
                z,
                dt
            );


            if (
                z.deadTime >
                3
            ) {

                zombies.splice(
                    i,
                    1
                );

            }

            continue;

        }


        z.hitFlash =
            Math.max(
                0,
                z.hitFlash - dt
            );


        const dir =
            normalize(
                player.x -
                z.x,
                0
            );


        z.vx =
            dir.x *
            z.speed;


        z.x +=
            z.vx * dt;


        z.y =
            H -
            100 -
            z.radius;


        if (
            Math.abs(
                z.x -
                player.x
            ) <
            z.radius +
            28
        ) {

            damagePlayer(
                z.damage *
                dt
            );

        }

    }


    resolveZombieCollisions();


    enemiesText.textContent =
        `Zumbis: ${
            zombies.length +
            zombiesToSpawn
        }`;

}


// =====================================================
// COLISÕES ENTRE ZUMBIS
// =====================================================

function resolveZombieCollisions() {

    for (
        let i = 0;
        i < zombies.length;
        i++
    ) {

        const a =
            zombies[i];


        if (
            a.ragdoll
        ) continue;


        for (
            let j =
            i + 1;

            j <
            zombies.length;

            j++
        ) {

            const b =
                zombies[j];


            if (
                b.ragdoll
            ) continue;


            const dx =
                b.x -
                a.x;


            const distance =
                Math.abs(dx);


            const minimum =
                a.radius +
                b.radius;


            if (
                distance <
                minimum
            ) {

                const push =
                    (
                        minimum -
                        distance
                    ) / 2;


                if (
                    dx > 0
                ) {

                    a.x -=
                        push;

                    b.x +=
                        push;

                }
                else {

                    a.x +=
                        push;

                    b.x -=
                        push;

                }

            }

        }

    }

}


// =====================================================
// BALAS
// =====================================================

function updateBullets(dt) {

    for (
        let i =
        bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            bullets[i];


        bullet.x +=
            bullet.vx *
            dt;


        bullet.y +=
            bullet.vy *
            dt;


        bullet.life -=
            dt;


        let remove =
            false;


        for (
            const z
            of zombies
        ) {

            if (
                z.ragdoll
            ) continue;


            const d =
                Math.hypot(

                    bullet.x -
                    z.x,

                    bullet.y -
                    z.y

                );


            if (
                d <
                z.radius
            ) {

                z.health -=
                    bullet.damage;


                z.hitFlash =
                    .12;


                const direction =
                    normalize(
                        bullet.vx,
                        bullet.vy
                    );


                z.vx +=
                    direction.x *
                    bullet.damage *
                    2 /
                    z.mass;


                createHitParticles(
                    bullet.x,
                    bullet.y
                );


                if (
                    z.health <=
                    0
                ) {

                    killZombie(
                        z,
                        bullet.x,
                        bullet.y
                    );

                }


                remove =
                    true;

                break;

            }

        }


        if (
            bullet.life <=
            0 ||
            bullet.x <
            -100 ||
            bullet.x >
            W + 100 ||
            bullet.y <
            -100 ||
            bullet.y >
            H + 100
        ) {

            remove =
                true;

        }


        if (remove) {

            bullets.splice(
                i,
                1
            );

        }

    }

}


// =====================================================
// MORTE DO ZUMBI
// =====================================================

function killZombie(
    zombie,
    x,
    y
) {

    if (
        zombie.ragdoll
    ) return;


    // 💰 CADA ZUMBI = $100

    money +=
        100;


    score +=
        100;


    createRagdoll(
        zombie,
        x,
        y
    );


    createHitParticles(
        x,
        y,
        12
    );


    updateUI();

}


// =====================================================
// DANO
// =====================================================

function damagePlayer(
    amount
) {

    if (
        player.invulnerable >
        0
    ) return;


    let damage =
        amount;


    if (
        player.armor >
        0
    ) {

        const armorDamage =
            Math.min(
                player.armor,
                damage
            );


        player.armor -=
            armorDamage;


        damage -=
            armorDamage;

    }


    player.health -=
        damage;


    player.invulnerable =
        .25;


    if (
        player.health <=
        0
    ) {

        endGame();

    }


    updateUI();

}


// =====================================================
// PARTÍCULAS
// =====================================================

function createHitParticles(
    x,
    y,
    amount = 5
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        particles.push({

            x,

            y,

            vx:
                random(
                    -250,
                    250
                ),

            vy:
                random(
                    -300,
                    50
                ),

            life:
                random(
                    .2,
                    .6
                ),

            size:
                random(
                    2,
                    5
                )

        });

    }

}


function updateParticles(dt) {

    for (
        let i =
        particles.length - 1;

        i >= 0;

        i--
    ) {

        const p =
            particles[i];


        p.vy +=
            900 *
            dt;


        p.x +=
            p.vx *
            dt;


        p.y +=
            p.vy *
            dt;


        p.life -=
            dt;


        if (
            p.life <=
            0
        ) {

            particles.splice(
                i,
                1
            );

        }

    }

}


// =====================================================
// ONDAS
// =====================================================

function startWave() {

    if (
        waveActive
    ) return;


    shopScreen.style.display =
        "none";


    hud.style.display =
        "flex";


    if (
        !player
    ) {

        player =
            createPlayer();

    }


    player.health =
        player.maxHealth;


    player.armor =
        player.maxArmor;


    zombies = [];

    bullets = [];


    zombiesToSpawn =
        5 +
        wave * 3;


    spawnTimer =
        0;


    waveActive =
        true;


    gameRunning =
        true;


    updateUI();


    lastTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


function updateWave(dt) {

    if (
        zombiesToSpawn >
        0
    ) {

        spawnTimer -=
            dt;


        if (
            spawnTimer <=
            0
        ) {

            spawnZombie();


            zombiesToSpawn--;


            spawnTimer =
                Math.max(

                    .25,

                    .9 -
                    wave *
                    .035

                );

        }

    }


    else if (
        zombies.length ===
        0
    ) {

        finishWave();

    }

}


function finishWave() {

    if (
        !waveActive
    ) return;


    waveActive =
        false;


    gameRunning =
        false;


    hud.style.display =
        "none";


    wave++;


    // pequena recompensa
    money +=
        250;


    renderShop();


    shopScreen.style.display =
        "flex";


    updateUI();

}


// =====================================================
// UI
// =====================================================

function updateUI() {

    moneyText.textContent =
        money.toLocaleString(
            "pt-BR"
        );


    moneyHud.textContent =
        `💵 $${money.toLocaleString(
            "pt-BR"
        )}`;


    healthBar.style.width =
        `${clamp(
            player
                ? player.health
                : 100,
            0,
            100
        )}%`;


    armorBar.style.width =
        `${clamp(
            player
                ? player.armor
                : 100,
            0,
            100
        )}%`;


    const weapon =
        weapons[
            currentWeapon
        ];


    const state =
        weaponState[
            currentWeapon
        ];


    weaponText.textContent =
        weapon.name;


    ammoText.textContent =
        `${state.magazine} / ${state.reserve}`;


    waveText.textContent =
        `ONDA ${wave}`;


    nameHud.textContent =
        playerNameInput.value
        .trim() ||
        "Jogador";

}


// =====================================================
// EQUIPAR
// =====================================================

function equipWeapon(
    index
) {

    if (
        !weaponState[index]
            .owned
    ) return;


    currentWeapon =
        index;


    updateUI();

}


// =====================================================
// DESENHO DO CENÁRIO
// =====================================================

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
        "#1b2229"
    );


    gradient.addColorStop(
        1,
        "#080a0c"
    );


    ctx.fillStyle =
        gradient;


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
        100,
        45,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#c9c6a6";

    ctx.globalAlpha =
        .12;

    ctx.fill();

    ctx.globalAlpha =
        1;


    // prédios

    for (
        let x = 0;
        x < W;
        x += 100
    ) {

        const buildingHeight =
            100 +
            (
                x * 13
            ) %
            180;


        ctx.fillStyle =
            "#11171c";


        ctx.fillRect(

            x,

            H -
            100 -
            buildingHeight,

            82,

            buildingHeight

        );


        // janelas

        for (
            let y =
            H -
            120 -
            buildingHeight;

            y <
            H - 110;

            y += 25
        ) {

            ctx.fillStyle =
                "#8c713d";


            ctx.globalAlpha =
                .18;


            ctx.fillRect(
                x + 12,
                y,
                9,
                12
            );


            ctx.fillRect(
                x + 38,
                y,
                9,
                12
            );


            ctx.fillRect(
                x + 63,
                y,
                9,
                12
            );


            ctx.globalAlpha =
                1;

        }

    }


    // chão

    ctx.fillStyle =
        "#242424";


    ctx.fillRect(
        0,
        H - 100,
        W,
        100
    );


    // rua

    ctx.fillStyle =
        "#303030";


    ctx.fillRect(
        0,
        H - 45,
        W,
        5
    );


    // marcações

    for (
        let x = 0;
        x < W;
        x += 100
    ) {

        ctx.fillStyle =
            "#464646";


        ctx.fillRect(
            x,
            H - 22,
            55,
            3
        );

    }

}


// =====================================================
// DESENHAR OBJETOS
// =====================================================

function drawObjects() {

    for (
        const object
        of objects
    ) {

        if (
            object.type ===
            "box"
        ) {

            ctx.fillStyle =
                "#81552f";


            ctx.fillRect(

                object.x,

                object.y,

                object.width,

                object.height

            );


            ctx.strokeStyle =
                "#c0874d";


            ctx.lineWidth =
                3;


            ctx.strokeRect(

                object.x,

                object.y,

                object.width,

                object.height

            );


            ctx.beginPath();


            ctx.moveTo(
                object.x,
                object.y
            );


            ctx.lineTo(
                object.x +
                object.width,
                object.y +
                object.height
            );


            ctx.moveTo(
                object.x +
                object.width,
                object.y
            );


            ctx.lineTo(
                object.x,
                object.y +
                object.height
            );


            ctx.stroke();

        }


        else if (
            object.type ===
            "barrel"
        ) {

            ctx.beginPath();

            ctx.arc(

                object.x,

                object.y,

                object.radius,

                0,

                Math.PI * 2

            );


            ctx.fillStyle =
                "#425e68";


            ctx.fill();


            ctx.strokeStyle =
                "#9aa5a9";


            ctx.lineWidth =
                3;


            ctx.stroke();


            ctx.strokeStyle =
                "#27363c";


            ctx.beginPath();


            ctx.arc(
                object.x,
                object.y,
                object.radius *
                .65,
                0,
                Math.PI * 2
            );


            ctx.stroke();

        }


        else if (
            object.type ===
            "platform"
        ) {

            ctx.fillStyle =
                "#634326";


            ctx.fillRect(

                object.x,

                object.y,

                object.width,

                object.height

            );


            ctx.strokeStyle =
                "#a67545";


            ctx.lineWidth =
                4;


            ctx.strokeRect(

                object.x,

                object.y,

                object.width,

                object.height

            );

        }

    }

}


// =====================================================
// PLAYER
// =====================================================

function drawPlayer() {

    ctx.save();


    ctx.translate(
        player.x,
        player.y
    );


    if (
        player.facing <
        0
    ) {

        ctx.scale(
            -1,
            1
        );

    }


    // sombra

    ctx.beginPath();

    ctx.ellipse(
        0,
        39,
        27,
        7,
        0,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "rgba(0,0,0,.5)";


    ctx.fill();


    // pernas

    ctx.fillStyle =
        "#24272b";


    ctx.fillRect(
        -15,
        10,
        11,
        30
    );


    ctx.fillRect(
        5,
        10,
        11,
        30
    );


    // corpo

    ctx.fillStyle =
        player.invulnerable >
        0
            ? "#fff"
            : "#596979";


    ctx.fillRect(
        -18,
        -30,
        36,
        45
    );


    // cabeça

    ctx.beginPath();


    ctx.arc(
        0,
        -44,
        14,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#c79675";


    ctx.fill();


    // arma

    const angle =
        Math.atan2(

            mouse.y -
            player.y,

            Math.abs(
                mouse.x -
                player.x
            )

        );


    ctx.save();


    ctx.rotate(
        clamp(
            angle,
            -.8,
            .8
        )
    );


    ctx.fillStyle =
        "#151515";


    ctx.fillRect(
        5,
        -20,
        40,
        8
    );


    ctx.restore();


    ctx.restore();

}


// =====================================================
// ZUMBI
// =====================================================

function drawZombie(
    z
) {

    if (
        z.ragdoll
    ) {

        drawRagdoll(
            z
        );

        return;

    }


    ctx.save();


    ctx.translate(
        z.x,
        z.y
    );


    const direction =
        player.x >
        z.x
            ? 1
            : -1;


    ctx.scale(
        direction,
        1
    );


    // pernas

    ctx.strokeStyle =
        "#404a35";


    ctx.lineWidth =
        9;


    ctx.beginPath();


    ctx.moveTo(
        -8,
        z.radius *
        .4
    );


    ctx.lineTo(
        -12,
        z.radius *
        1.5
    );


    ctx.moveTo(
        8,
        z.radius *
        .4
    );


    ctx.lineTo(
        13,
        z.radius *
        1.5
    );


    ctx.stroke();


    // corpo

    ctx.fillStyle =
        z.hitFlash >
        0
            ? "#fff"
            : z.color;


    ctx.fillRect(

        -z.radius *
        .65,

        -z.radius *
        .5,

        z.radius *
        1.3,

        z.radius *
        1.4

    );


    // cabeça

    ctx.beginPath();


    ctx.arc(

        0,

        -z.radius *
        .9,

        z.radius *
        .6,

        0,

        Math.PI *
        2

    );


    ctx.fillStyle =
        "#728a5a";


    ctx.fill();


    // olhos

    ctx.fillStyle =
        "#e53939";


    ctx.beginPath();


    ctx.arc(
        -6,
        -z.radius *
        .95,
        3,
        0,
        Math.PI * 2
    );


    ctx.arc(
        6,
        -z.radius *
        .95,
        3,
        0,
        Math.PI * 2
    );


    ctx.fill();


    // braços

    ctx.strokeStyle =
        "#728a5a";


    ctx.lineWidth =
        8;


    ctx.beginPath();


    ctx.moveTo(
        -z.radius *
        .6,
        -z.radius *
        .1
    );


    ctx.lineTo(
        -z.radius *
        1.3,
        z.radius *
        .6
    );


    ctx.moveTo(
        z.radius *
        .6,
        -z.radius *
        .1
    );


    ctx.lineTo(
        z.radius *
        1.3,
        z.radius *
        .6
    );


    ctx.stroke();


    // vida

    ctx.fillStyle =
        "#250000";


    ctx.fillRect(

        -z.radius,

        -z.radius *
        1.7,

        z.radius *
        2,

        4

    );


    ctx.fillStyle =
        "#d52e2e";


    ctx.fillRect(

        -z.radius,

        -z.radius *
        1.7,

        z.radius *
        2 *
        (
            z.health /
            z.maxHealth
        ),

        4

    );


    ctx.restore();

}


function drawRagdoll(
    zombie
) {

    for (
        const p
        of zombie.parts
    ) {

        ctx.save();


        ctx.translate(
            p.x,
            p.y
        );


        ctx.rotate(
            p.angle
        );


        ctx.fillStyle =
            "#657354";


        if (
            p.type ===
            "head"
        ) {

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

        else if (
            p.type ===
            "body"
        ) {

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


// =====================================================
// BALAS E PARTÍCULAS
// =====================================================

function drawBullets() {

    for (
        const bullet
        of bullets
    ) {

        ctx.beginPath();


        ctx.arc(

            bullet.x,

            bullet.y,

            3,

            0,

            Math.PI * 2

        );


        ctx.fillStyle =
            "#ffd86a";


        ctx.fill();


    }

}


function drawParticles() {

    for (
        const p
        of particles
    ) {

        ctx.globalAlpha =
            Math.max(
                0,
                p.life
            );


        ctx.fillStyle =
            "#d99a62";


        ctx.fillRect(

            p.x,

            p.y,

            p.size,

            p.size

        );

    }


    ctx.globalAlpha =
        1;

}


// =====================================================
// DRAW
// =====================================================

function draw() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    drawBackground();


    drawObjects();


    for (
        const z
        of zombies
    ) {

        drawZombie(z);

    }


    drawBullets();


    drawParticles();


    if (
        player
    ) {

        drawPlayer();

    }

}


// =====================================================
// LOOP
// =====================================================

function gameLoop(
    time
) {

    if (
        !gameRunning
    ) return;


    let dt =
        (
            time -
            lastTime
        ) /
        1000;


    lastTime =
        time;


    dt =
        Math.min(
            dt,
            .033
        );


    updatePlayer(dt);

    updateObjects(dt);

    updateZombies(dt);

    updateBullets(dt);

    updateParticles(dt);

    updateWave(dt);


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


// =====================================================
// MORTE
// =====================================================

function endGame() {

    gameRunning =
        false;


    waveActive =
        false;


    hud.style.display =
        "none";


    gameOver.style.display =
        "flex";


    finalScore.textContent =
        `Pontuação: ${score} | Dinheiro: $${money}`;


    renderShop();

}


restartBtn.addEventListener(
    "click",
    () => {

        gameOver.style.display =
            "none";


        shopScreen.style.display =
            "flex";


        renderShop();

    }
);


// =====================================================
// UTILIDADES
// =====================================================

function random(
    min,
    max
) {

    return Math.random() *
        (
            max -
            min
        ) +
        min;

}


function clamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


function normalize(
    x,
    y
) {

    const length =
        Math.hypot(
            x,
            y
        );


    if (
        length === 0
    ) {

        return {
            x: 0,
            y: 0
        };

    }


    return {

        x:
            x /
            length,

        y:
            y /
            length

    };

}


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        W =
            window.innerWidth;

        H =
            window.innerHeight;


        canvas.width =
            W;

        canvas.height =
            H;

    }
);


// =====================================================
// INICIALIZAÇÃO
// =====================================================

player =
    createPlayer();


createObjects();


renderShop();


updateUI();
