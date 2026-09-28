const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


/* =====================================================
   TAMANHO DA TELA
===================================================== */

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);

resize();


/* =====================================================
   ELEMENTOS
===================================================== */

const shopScreen = document.getElementById("shopScreen");
const shopContent = document.getElementById("shopContent");

const moneyEl = document.getElementById("money");
const moneyHud = document.getElementById("moneyHud");

const playerNameInput =
    document.getElementById("playerName");

const startWaveBtn =
    document.getElementById("startWaveBtn");

const hud =
    document.getElementById("hud");

const gameOver =
    document.getElementById("gameOver");

const restartBtn =
    document.getElementById("restartBtn");

const healthBar =
    document.getElementById("healthBar");

const armorHud =
    document.getElementById("armorHud");

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

const nameHud =
    document.getElementById("nameHud");

const gameInventorySlots =
    document.getElementById("gameInventorySlots");

const menuInventory =
    document.getElementById("menuInventory");


/* =====================================================
   DINHEIRO
===================================================== */

let money = 1000;


/* =====================================================
   JOGADOR
===================================================== */

const player = {

    x: 300,

    y: 500,

    width: 35,

    height: 80,

    speed: 5,

    jump: 13,

    velocityY: 0,

    health: 100,

    armor: 0,

    hasArmor: false,

    grounded: false
};


/* =====================================================
   ONDAS
===================================================== */

let wave = 1;

let score = 0;

let gameRunning = false;

let waveFinished = false;


/* =====================================================
   ARMAS
===================================================== */

const weapons = {

    pistol: {

        name: "PISTOLA",

        icon: "🔫",

        price: 0,

        damage: 35,

        magazineSize: 12,

        ammo: 12,

        reserve: 60,

        ammoPrice: 100,

        ammoPack: 30,

        owned: true

    },


    shotgun: {

        name: "ESCOPETA",

        icon: "💥",

        price: 1500,

        damage: 25,

        magazineSize: 6,

        ammo: 6,

        reserve: 30,

        ammoPrice: 180,

        ammoPack: 12,

        pellets: 6,

        owned: false

    },


    smg: {

        name: "SMG",

        icon: "🔫",

        price: 2500,

        damage: 18,

        magazineSize: 30,

        ammo: 30,

        reserve: 120,

        ammoPrice: 200,

        ammoPack: 60,

        owned: false

    },


    rifle: {

        name: "RIFLE",

        icon: "🎯",

        price: 4000,

        damage: 85,

        magazineSize: 8,

        ammo: 8,

        reserve: 40,

        ammoPrice: 250,

        ammoPack: 16,

        owned: false

    }

};


let equippedWeapon = "pistol";


/* =====================================================
   ARMADURAS
===================================================== */

const armors = [

    {
        id: "lightArmor",
        name: "Colete leve",
        icon: "🦺",
        price: 1200,
        protection: 50,
        owned: false
    },

    {
        id: "heavyArmor",
        name: "Colete pesado",
        icon: "🛡️",
        price: 2500,
        protection: 100,
        owned: false
    }

];


/* =====================================================
   CACHORROS
===================================================== */

const dogs = [

    {
        id: "dog1",
        name: "Pastor",
        icon: "🐕",
        price: 1800,
        damage: 12,
        owned: false
    },

    {
        id: "dog2",
        name: "Rottweiler",
        icon: "🐕‍🦺",
        price: 3000,
        damage: 20,
        owned: false
    }

];


let equippedDog = null;


/* =====================================================
   KITS
===================================================== */

let medkits = 0;

const medkitPrice = 250;

const medkitHeal = 50;


/* =====================================================
   BOMBAS
===================================================== */

let bombs = 0;

const bombPrice = 300;


/* =====================================================
   ARMADILHAS
===================================================== */

let traps = 0;

const trapPrice = 200;


/* =====================================================
   BARRICADAS
===================================================== */

let barricades = 0;

const barricadePrice = 250;


/* =====================================================
   INVENTÁRIO
===================================================== */

let inventory = [

    null,

    null,

    null,

    null,

    null

];

let selectedSlot = 0;


/* =====================================================
   MAPA DE ITENS
===================================================== */

function addInventoryItem(item) {

    const emptySlot =
        inventory.findIndex(
            slot => slot === null
        );

    if (emptySlot === -1) {

        alert(
            "Seu inventário está cheio! Existem apenas 5 espaços."
        );

        return false;
    }

    inventory[emptySlot] = item;

    renderInventory();

    return true;
}


function removeInventoryItem(index) {

    inventory[index] = null;

    renderInventory();
}


/* =====================================================
   MENU DA LOJA
===================================================== */

let currentCategory = "armadura";


const categories = {

    armadura: [

        {
            type: "armor",
            id: "lightArmor",
            name: "Colete leve",
            icon: "🦺",
            description:
                "Adiciona 50 pontos de proteção.",
            price: 1200
        },

        {
            type: "armor",
            id: "heavyArmor",
            name: "Colete pesado",
            icon: "🛡️",
            description:
                "Adiciona 100 pontos de proteção.",
            price: 2500
        }

    ],


    amigo: [

        {
            type: "dog",
            id: "dog1",
            name: "Pastor",
            icon: "🐕",
            description:
                "Ataca os zumbis automaticamente.",
            price: 1800
        },

        {
            type: "dog",
            id: "dog2",
            name: "Rottweiler",
            icon: "🐕‍🦺",
            description:
                "Causa muito mais dano aos zumbis.",
            price: 3000
        }

    ],


    armas: [

        {
            type: "weapon",
            id: "pistol",
            name: "Pistola",
            icon: "🔫",
            description:
                "Arma básica.",
            price: 0
        },

        {
            type: "weapon",
            id: "shotgun",
            name: "Escopeta",
            icon: "💥",
            description:
                "Dispara vários projéteis.",
            price: 1500
        },

        {
            type: "weapon",
            id: "smg",
            name: "SMG",
            icon: "🔫",
            description:
                "Alta velocidade de disparo.",
            price: 2500
        },

        {
            type: "weapon",
            id: "rifle",
            name: "Rifle",
            icon: "🎯",
            description:
                "Muito dano por disparo.",
            price: 4000
        }

    ],


    kits: [

        {
            type: "medkit",
            id: "medkit",
            name: "Kit médico",
            icon: "🩹",
            description:
                "Recupera 50 de vida. Uso somente no menu.",
            price: 250
        }

    ],


    bombas: [

        {
            type: "bomb",
            id: "bomb",
            name: "Granada",
            icon: "💣",
            description:
                "Explode e causa dano em vários zumbis.",
            price: 300
        }

    ],


    armadilhas: [

        {
            type: "trap",
            id: "trap",
            name: "Armadilha",
            icon: "🪤",
            description:
                "Pode ser colocada durante a onda.",
            price: 200
        }

    ],


    barricadas: [

        {
            type: "barricade",
            id: "barricade",
            name: "Barricada",
            icon: "🧱",
            description:
                "Bloqueia os zumbis durante a onda.",
            price: 250
        }

    ]

};


/* =====================================================
   RENDER DA LOJA
===================================================== */

function renderShop() {

    const list =
        categories[currentCategory];

    shopContent.innerHTML = "";


    const grid =
        document.createElement("div");

    grid.className = "shop-grid";


    list.forEach(item => {

        const card =
            document.createElement("div");

        card.className = "item-card";


        let owned = false;


        if (item.type === "weapon") {

            owned =
                weapons[item.id].owned;
        }


        if (item.type === "armor") {

            owned =
                armors.find(
                    a => a.id === item.id
                ).owned;
        }


        if (item.type === "dog") {

            owned =
                dogs.find(
                    d => d.id === item.id
                ).owned;
        }


        card.innerHTML = `

            <div class="item-icon">
                ${item.icon}
            </div>

            <h3>
                ${item.name}
            </h3>

            <p>
                ${item.description}
            </p>

            <div class="item-price">
                💵 $${item.price}
            </div>

            <button class="item-button">

                ${owned ? "EQUIPAR" : "COMPRAR"}

            </button>

        `;


        const button =
            card.querySelector(
                ".item-button"
            );


        button.addEventListener(
            "click",
            () => buyItem(item)
        );


        if (owned) {

            card.classList.add("owned");
        }


        grid.appendChild(card);

    });


    shopContent.appendChild(grid);


    renderInventory();

    updateMoney();
}


/* =====================================================
   COMPRAR ITEM
===================================================== */

function buyItem(item) {


    /* ARMADURA */

    if (item.type === "armor") {

        const armor =
            armors.find(
                a => a.id === item.id
            );


        if (!armor.owned) {

            if (money < armor.price) {

                alert("Dinheiro insuficiente.");

                return;
            }


            money -= armor.price;

            armor.owned = true;

            player.armor =
                armor.protection;

            player.hasArmor = true;

            addInventoryItem({

                type: "armor",

                id: armor.id,

                name: armor.name,

                icon: armor.icon

            });

        }


        player.armor =
            armor.protection;

        player.hasArmor = true;


        renderShop();

        updateHUD();

        return;
    }


    /* CACHORRO */

    if (item.type === "dog") {

        const dog =
            dogs.find(
                d => d.id === item.id
            );


        if (!dog.owned) {

            if (money < dog.price) {

                alert("Dinheiro insuficiente.");

                return;
            }


            money -= dog.price;

            dog.owned = true;

            addInventoryItem({

                type: "dog",

                id: dog.id,

                name: dog.name,

                icon: dog.icon

            });
        }


        equippedDog = dog.id;

        renderShop();

        updateHUD();

        return;
    }


    /* ARMAS */

    if (item.type === "weapon") {

        const weapon =
            weapons[item.id];


        if (!weapon.owned) {

            if (money < weapon.price) {

                alert("Dinheiro insuficiente.");

                return;
            }


            money -= weapon.price;

            weapon.owned = true;


            addInventoryItem({

                type: "weapon",

                id: item.id,

                name: weapon.name,

                icon: weapon.icon

            });
        }


        equippedWeapon =
            item.id;


        renderShop();

        updateHUD();

        return;
    }


    /* KIT MÉDICO */

    if (item.type === "medkit") {

        if (money < medkitPrice) {

            alert("Dinheiro insuficiente.");

            return;
        }


        money -= medkitPrice;

        medkits++;

        renderShop();

        updateHUD();

        return;
    }


    /* BOMBA */

    if (item.type === "bomb") {

        if (money < bombPrice) {

            alert("Dinheiro insuficiente.");

            return;
        }


        money -= bombPrice;

        bombs++;

        addInventoryItem({

            type: "bomb",

            id: "bomb",

            name: "Granada",

            icon: "💣"

        });


        renderShop();

        return;
    }


    /* ARMADILHA */

    if (item.type === "trap") {

        if (money < trapPrice) {

            alert("Dinheiro insuficiente.");

            return;
        }


        money -= trapPrice;

        traps++;

        addInventoryItem({

            type: "trap",

            id: "trap",

            name: "Armadilha",

            icon: "🪤"

        });


        renderShop();

        return;
    }


    /* BARRICADA */

    if (item.type === "barricade") {

        if (money < barricadePrice) {

            alert("Dinheiro insuficiente.");

            return;
        }


        money -= barricadePrice;

        barricades++;

        addInventoryItem({

            type: "barricade",

            id: "barricade",

            name: "Barricada",

            icon: "🧱"

        });


        renderShop();

        return;
    }

}


/* =====================================================
   CATEGORIAS
===================================================== */

document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category-btn")
                    .forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                button.classList.add("active");


                currentCategory =
                    button.dataset.category;


                renderShop();
            }
        );

    });


/* =====================================================
   INVENTÁRIO
===================================================== */

function renderInventory() {

    menuInventory.innerHTML = "";

    gameInventorySlots.innerHTML = "";


    for (let i = 0; i < 5; i++) {

        const item =
            inventory[i];


        const menuSlot =
            createInventorySlot(
                item,
                i
            );


        const gameSlot =
            createInventorySlot(
                item,
                i
            );


        if (i === selectedSlot) {

            menuSlot.classList.add(
                "selected"
            );

            gameSlot.classList.add(
                "selected"
            );
        }


        menuInventory.appendChild(
            menuSlot
        );

        gameInventorySlots.appendChild(
            gameSlot
        );

    }

}


function createInventorySlot(item, index) {

    const slot =
        document.createElement("div");

    slot.className =
        "inventory-slot";


    slot.innerHTML = `

        <span class="slot-number">
            ${index + 1}
        </span>

        <span>
            ${item ? item.icon : "—"}
        </span>

        <span class="slot-name">
            ${item ? item.name : "Vazio"}
        </span>

    `;


    return slot;
}


/* =====================================================
   TECLAS 1-5
===================================================== */

window.addEventListener(
    "keydown",
    event => {

        if (
            ["1","2","3","4","5"]
                .includes(event.key)
        ) {

            const number =
                Number(event.key);

            selectedSlot =
                number - 1;


            useInventorySlot(
                selectedSlot
            );


            renderInventory();
        }

    }
);


/* =====================================================
   USAR ITEM
===================================================== */

function useInventorySlot(index) {

    const item =
        inventory[index];


    if (!item) {

        return;
    }


    /* BOMBA */

    if (item.type === "bomb") {

        if (!gameRunning) {

            return;
        }


        throwBomb();


        inventory[index] = null;

        bombs--;

        return;
    }


    /* ARMADILHA */

    if (item.type === "trap") {

        if (!gameRunning) {

            return;
        }


        placeTrap();


        inventory[index] = null;

        traps--;

        return;
    }


    /* BARRICADA */

    if (item.type === "barricade") {

        if (!gameRunning) {

            return;
        }


        placeBarricade();


        inventory[index] = null;

        barricades--;

        return;
    }


    /* ARMADURA */

    if (item.type === "armor") {

        const armor =
            armors.find(
                a => a.id === item.id
            );


        player.hasArmor = true;

        player.armor =
            armor.protection;


        updateHUD();

        return;
    }


    /* CACHORRO */

    if (item.type === "dog") {

        equippedDog =
            item.id;

        return;
    }


    /* ARMA */

    if (item.type === "weapon") {

        equippedWeapon =
            item.id;

        updateHUD();

        return;
    }

}


/* =====================================================
   CONTROLES
===================================================== */

const keys = {};


window.addEventListener(
    "keydown",
    e => {

        keys[e.key.toLowerCase()] =
            true;


        if (
            e.key === " " ||
            e.key === "ArrowUp" ||
            e.key.toLowerCase() === "w"
        ) {

            if (player.grounded) {

                player.velocityY =
                    -player.jump;

                player.grounded =
                    false;
            }
        }


        if (
            e.key.toLowerCase() === "r"
        ) {

            reload();
        }

    }
);


window.addEventListener(
    "keyup",
    e => {

        keys[e.key.toLowerCase()] =
            false;

    }
);


/* =====================================================
   MOUSE
===================================================== */

let mouse = {

    x: 0,

    y: 0,

    down: false
};


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
   TIRO
===================================================== */

let lastShot = 0;


function shoot() {

    const weapon =
        weapons[equippedWeapon];


    const now =
        performance.now();


    const delay =
        equippedWeapon === "smg"
            ? 100
            : equippedWeapon === "shotgun"
                ? 600
                : 300;


    if (
        now - lastShot <
        delay
    ) {

        return;
    }


    lastShot = now;


    if (weapon.ammo <= 0) {

        reload();

        return;
    }


    weapon.ammo--;


    if (
        equippedWeapon === "shotgun"
    ) {

        for (
            let i = 0;
            i < weapon.pellets;
            i++
        ) {

            fireProjectile(
                weapon.damage,
                (
                    Math.random() -
                    .5
                ) * .25
            );
        }

    } else {

        fireProjectile(
            weapon.damage,
            0
        );

    }


    updateHUD();
}


function fireProjectile(
    damage,
    spread
) {

    const angle =
        Math.atan2(
            mouse.y - player.y,
            mouse.x - player.x
        ) + spread;


    const bullet = {

        x: player.x,

        y: player.y - 25,

        vx:
            Math.cos(angle) * 15,

        vy:
            Math.sin(angle) * 15,

        damage,

        life: 60

    };


    bullets.push(bullet);
}


/* =====================================================
   RECARREGAR
===================================================== */

function reload() {

    const weapon =
        weapons[equippedWeapon];


    const needed =
        weapon.magazineSize -
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


    weapon.ammo += amount;

    weapon.reserve -= amount;


    updateHUD();
}


/* =====================================================
   ZUMBIS
===================================================== */

const zombieTypes = [

    {
        name: "Walker",
        color: "#6d9b55",
        health: 70,
        speed: 0.8,
        damage: 5,
        size: 38
    },

    {
        name: "Runner",
        color: "#b94d4d",
        health: 45,
        speed: 2.3,
        damage: 5,
        size: 34
    },

    {
        name: "Brute",
        color: "#493b32",
        health: 180,
        speed: 0.45,
        damage: 5,
        size: 60
    },

    {
        name: "Crawler",
        color: "#6d7650",
        health: 35,
        speed: 1.8,
        damage: 5,
        size: 25
    },

    {
        name: "Soldier",
        color: "#455d67",
        health: 110,
        speed: 1.1,
        damage: 5,
        size: 42
    },

    {
        name: "Mutant",
        color: "#8e49a1",
        health: 250,
        speed: 0.65,
        damage: 5,
        size: 65
    },

    {
        name: "Burning",
        color: "#d86b27",
        health: 90,
        speed: 1.5,
        damage: 5,
        size: 40
    },

    {
        name: "Toxic",
        color: "#4ac46a",
        health: 120,
        speed: 1,
        damage: 5,
        size: 44
    },

    {
        name: "Tank",
        color: "#35383d",
        health: 350,
        speed: 0.35,
        damage: 5,
        size: 75
    },

    {
        name: "Boss",
        color: "#c11e2b",
        health: 700,
        speed: 0.5,
        damage: 5,
        size: 90
    }

];


let zombies = [];


/* =====================================================
   CRIAR ONDA
===================================================== */

function createWave() {

    zombies = [];


    const amount =
        5 + wave * 3;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const type =
            zombieTypes[
                Math.floor(
                    Math.random() *
                    zombieTypes.length
                )
            ];


        zombies.push({

            x:
                canvas.width +
                Math.random() * 1200,

            y:
                canvas.height -
                80,

            width:
                type.size,

            height:
                type.size * 1.5,

            health:
                type.health,

            maxHealth:
                type.health,

            speed:
                type.speed,

            damage:
                5,

            color:
                type.color,

            name:
                type.name,

            attackCooldown: 0,

            dead: false

        });

    }

}


/* =====================================================
   BALAS
===================================================== */

const bullets = [];


/* =====================================================
   ARMADILHAS
===================================================== */

const placedTraps = [];


/* =====================================================
   BARRICADAS
===================================================== */

const placedBarricades = [];


/* =====================================================
   BOMBA
===================================================== */

function throwBomb() {

    const bombX =
        player.x + 100;

    const bombY =
        player.y;


    setTimeout(
        () => {

            const radius = 260;


            zombies.forEach(
                zombie => {

                    const dx =
                        zombie.x -
                        bombX;

                    const dy =
                        zombie.y -
                        bombY;


                    const distance =
                        Math.sqrt(
                            dx * dx +
                            dy * dy
                        );


                    if (
                        distance <
                        radius
                    ) {

                        zombie.health -=
                            250;
                    }

                }
            );


            createExplosion(
                bombX,
                bombY
            );

        },
        600
    );

}


/* =====================================================
   EXPLOSÃO
===================================================== */

function createExplosion(
    x,
    y
) {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        particles.push({

            x,

            y,

            vx:
                (
                    Math.random() -
                    .5
                ) * 10,

            vy:
                (
                    Math.random() -
                    .5
                ) * 10,

            life: 40,

            size:
                4 +
                Math.random() * 10

        });

    }

}


/* =====================================================
   ARMADILHA
===================================================== */

function placeTrap() {

    placedTraps.push({

        x:
            player.x + 80,

        y:
            canvas.height - 50,

        radius: 70,

        used: false

    });

}


/* =====================================================
   BARRICADA
===================================================== */

function placeBarricade() {

    placedBarricades.push({

        x:
            player.x + 100,

        y:
            canvas.height - 100,

        width: 120,

        height: 100,

        health: 300

    });

}


/* =====================================================
   PARTÍCULAS
===================================================== */

const particles = [];


/* =====================================================
   ATUALIZAR JOGADOR
===================================================== */

function updatePlayer() {

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        player.x -=
            player.speed;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.x +=
            player.speed;
    }


    player.velocityY +=
        0.6;


    player.y +=
        player.velocityY;


    const floor =
        canvas.height -
        40;


    if (
        player.y >= floor
    ) {

        player.y =
            floor;

        player.velocityY =
            0;

        player.grounded =
            true;
    }


    if (player.x < 30) {

        player.x = 30;
    }


    if (
        player.x >
        canvas.width - 30
    ) {

        player.x =
            canvas.width - 30;
    }


    if (mouse.down) {

        shoot();
    }

}


/* =====================================================
   ATUALIZAR ZUMBIS
===================================================== */

function updateZombies() {

    zombies.forEach(
        zombie => {

            if (
                zombie.dead
            ) {

                return;
            }


            const distance =
                Math.abs(
                    zombie.x -
                    player.x
                );


            /* ARMADILHAS */

            placedTraps.forEach(
                trap => {

                    const d =
                        Math.abs(
                            zombie.x -
                            trap.x
                        );


                    if (
                        d <
                        trap.radius &&
                        !trap.used
                    ) {

                        zombie.health -=
                            150;

                        trap.used = true;

                    }

                }
            );


            /* BARRICADAS */

            let blocked = false;


            placedBarricades.forEach(
                barricade => {

                    if (
                        Math.abs(
                            zombie.x -
                            barricade.x
                        ) <
                        80
                    ) {

                        blocked = true;


                        if (
                            zombie.speed >
                            0
                        ) {

                            barricade.health -=
                                0.3;
                        }

                    }

                }
            );


            if (!blocked) {

                if (
                    zombie.x >
                    player.x
                ) {

                    zombie.x -=
                        zombie.speed;

                } else {

                    zombie.x +=
                        zombie.speed;
                }

            }


            /* ATAQUE */

            if (
                distance < 55
            ) {

                if (
                    zombie.attackCooldown <= 0
                ) {

                    damagePlayer(5);

                    zombie.attackCooldown =
                        50;
                }

            }


            if (
                zombie.attackCooldown >
                0
            ) {

                zombie.attackCooldown--;
            }


            /* MORTE */

            if (
                zombie.health <= 0
            ) {

                killZombie(zombie);

            }

        }
    );


    zombies =
        zombies.filter(
            zombie =>
                !zombie.dead
        );

}


/* =====================================================
   MATAR ZUMBI
===================================================== */

function killZombie(zombie) {

    zombie.dead = true;

    money += 100;

    score += 100;


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        particles.push({

            x:
                zombie.x,

            y:
                zombie.y,

            vx:
                (
                    Math.random() -
                    .5
                ) * 5,

            vy:
                (
                    Math.random() -
                    .5
                ) * 5,

            life: 30,

            size: 4

        });

    }


    updateHUD();

}


/* =====================================================
   DANO NO JOGADOR
===================================================== */

function damagePlayer(
    damage
) {

    /*
       ARMADURA PRIMEIRO
    */

    if (
        player.hasArmor &&
        player.armor > 0
    ) {

        player.armor -=
            damage;


        if (
            player.armor < 0
        ) {

            player.health +=
                player.armor;

            player.armor = 0;
        }

    } else {

        player.health -=
            damage;
    }


    if (
        player.health < 0
    ) {

        player.health = 0;
    }


    updateHUD();


    if (
        player.health <= 0
    ) {

        endGame();
    }

}


/* =====================================================
   CACHORRO
===================================================== */

let dogCooldown = 0;


function updateDog() {

    if (!equippedDog) {

        return;
    }


    if (dogCooldown > 0) {

        dogCooldown--;

        return;
    }


    const dog =
        dogs.find(
            d =>
                d.id ===
                equippedDog
        );


    if (!dog) {

        return;
    }


    let target = null;

    let nearest =
        Infinity;


    zombies.forEach(
        zombie => {

            const distance =
                Math.abs(
                    zombie.x -
                    player.x
                );


            if (
                distance <
                nearest
            ) {

                nearest =
                    distance;

                target =
                    zombie;
            }

        }
    );


    if (target) {

        target.health -=
            dog.damage;

        dogCooldown =
            35;
    }

}


/* =====================================================
   BALAS
===================================================== */

function updateBullets() {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            bullets[i];


        bullet.x +=
            bullet.vx;

        bullet.y +=
            bullet.vy;

        bullet.life--;


        let hit = false;


        zombies.forEach(
            zombie => {

                if (
                    zombie.dead
                ) {

                    return;
                }


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
                    zombie.width
                ) {

                    zombie.health -=
                        bullet.damage;

                    hit = true;

                }

            }
        );


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


/* =====================================================
   PARTÍCULAS
===================================================== */

function updateParticles() {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];


        p.x += p.vx;

        p.y += p.vy;

        p.life--;


        if (
            p.life <= 0
        ) {

            particles.splice(
                i,
                1
            );
        }

    }

}


/* =====================================================
   DESENHAR FUNDO
===================================================== */

function drawBackground() {

    ctx.fillStyle =
        "#161a1e";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* LUA */

    ctx.fillStyle =
        "#ddd";

    ctx.beginPath();

    ctx.arc(
        canvas.width - 150,
        120,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* PRÉDIOS */

    for (
        let x = 0;
        x < canvas.width;
        x += 230
    ) {

        const h =
            130 +
            (x % 200);


        ctx.fillStyle =
            "#252b30";


        ctx.fillRect(

            x,

            canvas.height -
                40 -
                h,

            190,

            h
        );


        /* JANELAS */

        ctx.fillStyle =
            "#c89d3d";


        for (
            let yy =
                canvas.height -
                20 -
                h;

            yy <
                canvas.height -
                50;

            yy += 35
        ) {

            for (
                let xx =
                    x + 20;

                xx <
                    x + 170;

                xx += 40
            ) {

                ctx.fillRect(
                    xx,
                    yy,
                    12,
                    18
                );

            }

        }

    }


    /* CHÃO */

    ctx.fillStyle =
        "#303437";

    ctx.fillRect(

        0,

        canvas.height - 40,

        canvas.width,

        40
    );


    /* RUA */

    ctx.strokeStyle =
        "#666";

    ctx.setLineDash(
        [40, 30]
    );

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        0,
        canvas.height - 20
    );

    ctx.lineTo(
        canvas.width,
        canvas.height - 20
    );

    ctx.stroke();

    ctx.setLineDash([]);
}


/* =====================================================
   DESENHAR JOGADOR
===================================================== */

function drawPlayer() {

    ctx.fillStyle =
        "#2d78c7";


    ctx.fillRect(

        player.x - 18,

        player.y - 75,

        36,

        55
    );


    /* CABEÇA */

    ctx.fillStyle =
        "#d5a27c";


    ctx.beginPath();

    ctx.arc(

        player.x,

        player.y - 88,

        15,

        0,

        Math.PI * 2
    );

    ctx.fill();


    /* ARMA */

    ctx.strokeStyle =
        "#111";

    ctx.lineWidth = 7;


    const angle =
        Math.atan2(
            mouse.y -
                (player.y - 50),

            mouse.x -
                player.x
        );


    ctx.beginPath();

    ctx.moveTo(
        player.x,
        player.y - 50
    );

    ctx.lineTo(

        player.x +
            Math.cos(angle) * 45,

        player.y - 50 +
            Math.sin(angle) * 45

    );

    ctx.stroke();
}


/* =====================================================
   DESENHAR ZUMBIS
===================================================== */

function drawZombies() {

    zombies.forEach(
        zombie => {

            if (
                zombie.dead
            ) {

                return;
            }


            /* CORPO */

            ctx.fillStyle =
                zombie.color;


            ctx.fillRect(

                zombie.x -
                    zombie.width / 2,

                zombie.y -
                    zombie.height,

                zombie.width,

                zombie.height
            );


            /* CABEÇA */

            ctx.beginPath();

            ctx.arc(

                zombie.x,

                zombie.y -
                    zombie.height -
                    10,

                zombie.width / 2.2,

                0,

                Math.PI * 2
            );

            ctx.fill();


            /* OLHOS */

            ctx.fillStyle =
                "#ff2020";


            ctx.fillRect(

                zombie.x - 10,

                zombie.y -
                    zombie.height -
                    14,

                5,

                5
            );


            ctx.fillRect(

                zombie.x + 5,

                zombie.y -
                    zombie.height -
                    14,

                5,

                5
            );


            /* BARRA DE VIDA */

            const barWidth =
                zombie.width * 1.5;


            ctx.fillStyle =
                "#300";

            ctx.fillRect(

                zombie.x -
                    barWidth / 2,

                zombie.y -
                    zombie.height -
                    32,

                barWidth,

                5
            );


            ctx.fillStyle =
                "#e33";

            ctx.fillRect(

                zombie.x -
                    barWidth / 2,

                zombie.y -
                    zombie.height -
                    32,

                barWidth *
                    (
                        zombie.health /
                        zombie.maxHealth
                    ),

                5
            );

        }
    );

}


/* =====================================================
   DESENHAR CACHORRO
===================================================== */

function drawDog() {

    if (!equippedDog) {

        return;
    }


    ctx.font = "45px Arial";

    ctx.fillText(

        "🐕",

        player.x - 65,

        player.y - 20
    );

}


/* =====================================================
   DESENHAR BALAS
===================================================== */

function drawBullets() {

    ctx.fillStyle =
        "#ffd447";


    bullets.forEach(
        bullet => {

            ctx.beginPath();

            ctx.arc(

                bullet.x,

                bullet.y,

                4,

                0,

                Math.PI * 2
            );

            ctx.fill();

        }
    );

}


/* =====================================================
   DESENHAR TRAPS
===================================================== */

function drawTraps() {

    placedTraps.forEach(
        trap => {

            ctx.font =
                "30px Arial";


            ctx.fillText(

                "🪤",

                trap.x - 15,

                trap.y
            );

        }
    );

}


/* =====================================================
   DESENHAR BARRICADAS
===================================================== */

function drawBarricades() {

    placedBarricades.forEach(
        barricade => {

            ctx.fillStyle =
                "#76512e";


            ctx.fillRect(

                barricade.x -
                    barricade.width / 2,

                barricade.y -
                    barricade.height,

                barricade.width,

                barricade.height
            );


            ctx.strokeStyle =
                "#392617";

            ctx.lineWidth = 5;


            for (
                let i = 0;
                i < 3;
                i++
            ) {

                ctx.beginPath();

                ctx.moveTo(

                    barricade.x -
                        50,

                    barricade.y -
                        20 -
                        i * 30

                );

                ctx.lineTo(

                    barricade.x +
                        50,

                    barricade.y -
                        20 -
                        i * 30

                );

                ctx.stroke();

            }

        }
    );

}


/* =====================================================
   PARTÍCULAS
===================================================== */

function drawParticles() {

    particles.forEach(
        p => {

            ctx.fillStyle =
                "#ff9d32";


            ctx.fillRect(

                p.x,

                p.y,

                p.size,

                p.size
            );

        }
    );

}


/* =====================================================
   LOOP
===================================================== */

function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );


    if (!gameRunning) {

        return;
    }


    updatePlayer();

    updateZombies();

    updateBullets();

    updateDog();

    updateParticles();


    drawBackground();

    drawTraps();

    drawBarricades();

    drawBullets();

    drawZombies();

    drawPlayer();

    drawDog();

    drawParticles();


    enemiesEl.textContent =
        "Zumbis: " +
        zombies.length;


    if (
        zombies.length === 0 &&
        !waveFinished
    ) {

        finishWave();

    }

}


gameLoop();


/* =====================================================
   INICIAR ONDA
===================================================== */

startWaveBtn.addEventListener(
    "click",
    startWave
);


function startWave() {

    if (
        !playerNameInput.value.trim()
    ) {

        playerNameInput.value =
            "Jogador";
    }


    nameHud.textContent =
        playerNameInput.value;


    waveFinished = false;


    player.health =
        Math.min(
            player.health,
            100
        );


    /*
       A armadura permanece entre
       as ondas.
    */


    createWave();


    shopScreen.style.display =
        "none";


    hud.style.display =
        "flex";


    document.getElementById(
        "gameInventory"
    ).style.display =
        "block";


    gameRunning = true;


    updateHUD();

}


/* =====================================================
   FINALIZAR ONDA
===================================================== */

function finishWave() {

    waveFinished = true;

    gameRunning = false;


    money += 250;


    wave++;


    shopScreen.style.display =
        "flex";


    hud.style.display =
        "none";


    document.getElementById(
        "gameInventory"
    ).style.display =
        "none";


    alert(
        "Onda concluída!\n\n" +
        "Bônus: $250\n\n" +
        "Prepare-se para a próxima onda."
    );


    renderShop();

    updateHUD();

}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    gameRunning = false;


    hud.style.display =
        "none";


    document.getElementById(
        "gameInventory"
    ).style.display =
        "none";


    gameOver.style.display =
        "flex";


    document.getElementById(
        "finalScore"
    ).textContent =

        "Pontuação: " +
        score +
        " | Onda: " +
        wave;

}


/* =====================================================
   RECOMEÇAR
===================================================== */

restartBtn.addEventListener(
    "click",
    () => {

        gameOver.style.display =
            "none";


        shopScreen.style.display =
            "flex";


        player.health = 100;


        score = 0;

        wave = 1;


        renderShop();

        updateHUD();

    }
);


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    moneyEl.textContent =
        money;


    moneyHud.textContent =
        "💵 $" +
        money;


    healthBar.style.width =
        player.health + "%";


    /*
       A BARRA AZUL SÓ APARECE
       SE TIVER ARMADURA
    */

    if (
        player.hasArmor
    ) {

        armorHud.style.display =
            "block";


        const maxArmor =
            getMaxArmor();


        armorBar.style.width =
            (
                player.armor /
                maxArmor *
                100
            ) + "%";

    } else {

        armorHud.style.display =
            "none";

    }


    const weapon =
        weapons[equippedWeapon];


    weaponEl.textContent =
        weapon.name;


    ammoEl.textContent =
        weapon.ammo +
        " / " +
        weapon.reserve;


    waveEl.textContent =
        "ONDA " +
        wave;

}


function getMaxArmor() {

    if (
        player.armor > 50
    ) {

        return 100;
    }


    return 50;
}


/* =====================================================
   VIDA NO MENU
===================================================== */

function useMedkit() {

    if (
        medkits <= 0
    ) {

        return;
    }


    if (
        player.health >= 100
    ) {

        alert(
            "Sua vida já está cheia."
        );

        return;
    }


    player.health =
        Math.min(
            100,
            player.health +
            medkitHeal
        );


    medkits--;


    alert(
        "Kit médico usado!\nVida: " +
        player.health +
        "/100"
    );


    updateHUD();
}


/*
   Clique duplo no menu
   para usar kit médico.
*/

shopContent.addEventListener(
    "dblclick",
    event => {

        if (
            currentCategory ===
            "kits"
        ) {

            useMedkit();

        }

    }
);


/* =====================================================
   ATUALIZAR DINHEIRO
===================================================== */

function updateMoney() {

    moneyEl.textContent =
        money;

    moneyHud.textContent =
        "💵 $" +
        money;
}


/* =====================================================
   INÍCIO
===================================================== */

renderShop();

updateHUD();
