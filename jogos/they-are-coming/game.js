const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

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

const menuInventory =
    document.getElementById("menuInventory");

const gameInventorySlots =
    document.getElementById("gameInventorySlots");


/* =====================================================
   ESTADO INICIAL
===================================================== */

const INITIAL_MONEY = 500;

let money = INITIAL_MONEY;

let wave = 1;

let score = 0;

let gameRunning = false;

let waveFinished = false;

let currentCategory = "armadura";

let selectedSlot = 0;


/* =====================================================
   JOGADOR
===================================================== */

const DEFAULT_SPEED = 5;

const player = {

    x: 300,

    y: 500,

    width: 35,

    height: 80,

    speed: DEFAULT_SPEED,

    jump: 13,

    velocityY: 0,

    health: 100,

    armor: 0,

    hasArmor: false,

    armorMax: 0,

    grounded: false

};


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


/* =====================================================
   ARMAS
===================================================== */

const weapons = {};


/*
   Pistola inicial
*/

weapons.pistol = {

    name: "Pistola",

    icon: "🔫",

    price: 0,

    damage: 35,

    magazineSize: 12,

    ammo: 12,

    reserve: 30,

    ammoPrice: 100,

    ammoPack: 30,

    owned: true

};


/*
   30 ARMAS NOVAS
*/

const newWeapons = [

    ["revolver", "Revólver", "🔫", 700, 45, 6, 30],
    ["uzi", "Uzi", "🔫", 1000, 22, 25, 100],
    ["mp5", "MP5", "🔫", 1400, 25, 30, 120],
    ["ak47", "AK-47", "🔫", 2200, 45, 30, 120],
    ["m4", "M4", "🔫", 2400, 40, 30, 150],
    ["scar", "SCAR", "🔫", 3000, 55, 25, 125],
    ["famas", "FAMAS", "🔫", 2800, 42, 25, 100],
    ["aug", "AUG", "🔫", 3200, 48, 30, 120],
    ["g36", "G36", "🔫", 3000, 43, 30, 120],
    ["vector", "Vector", "🔫", 3500, 20, 33, 165],

    ["p90", "P90", "🔫", 3800, 21, 50, 200],
    ["mac10", "MAC-10", "🔫", 1800, 19, 30, 150],
    ["mp7", "MP7", "🔫", 2500, 24, 40, 160],
    ["tommy", "Tommy Gun", "🔫", 2600, 38, 30, 120],
    ["m249", "M249", "🔫", 4500, 35, 100, 300],

    ["dmr", "DMR", "🎯", 4200, 75, 10, 50],
    ["sniper", "Sniper", "🎯", 5000, 140, 5, 25],
    ["hunting", "Rifle de caça", "🎯", 2800, 90, 5, 30],
    ["crossbow", "Besta", "🏹", 3200, 120, 1, 15],
    ["marksman", "Marksman", "🎯", 3600, 80, 12, 60],

    ["double", "Escopeta dupla", "💥", 2500, 55, 2, 20],
    ["pump", "Pump Shotgun", "💥", 2200, 45, 8, 40],
    ["autoShotgun", "Escopeta automática", "💥", 4000, 35, 12, 60],
    ["sawed", "Escopeta serrada", "💥", 1800, 60, 2, 20],
    ["riot", "Riot Shotgun", "💥", 3500, 48, 8, 40],

    ["laser", "Laser Gun", "⚡", 5500, 100, 10, 50],
    ["plasma", "Plasma Gun", "🟣", 7000, 150, 8, 40],
    ["rail", "Railgun", "⚡", 9000, 300, 3, 15],
    ["flame", "Lança-chamas", "🔥", 6000, 30, 50, 200],
    ["grenadeLauncher", "Lança-granadas", "💣", 7500, 200, 4, 20]

];


newWeapons.forEach(
    data => {

        const [
            id,
            name,
            icon,
            price,
            damage,
            magazine,
            reserve
        ] = data;


        weapons[id] = {

            name,

            icon,

            price,

            damage,

            magazineSize: magazine,

            ammo: magazine,

            reserve,

            ammoPrice:
                Math.max(
                    100,
                    Math.floor(price * .08)
                ),

            ammoPack:
                Math.max(
                    5,
                    Math.floor(
                        magazine * 2
                    )
                ),

            owned: false

        };

    }
);


/* =====================================================
   ARMADURAS — 5 TIPOS
===================================================== */

const armors = [

    {
        id: "armor1",
        name: "Colete leve",
        icon: "🦺",
        price: 800,
        protection: 50,
        owned: false
    },

    {
        id: "armor2",
        name: "Colete policial",
        icon: "🛡️",
        price: 1500,
        protection: 75,
        owned: false
    },

    {
        id: "armor3",
        name: "Colete militar",
        icon: "🛡️",
        price: 3000,
        protection: 100,
        owned: false
    },

    {
        id: "armor4",
        name: "Armadura pesada",
        icon: "🦾",
        price: 5000,
        protection: 150,
        owned: false
    },

    {
        id: "armor5",
        name: "Armadura blindada",
        icon: "⚙️",
        price: 8000,
        protection: 200,
        owned: false
    }

];


/* =====================================================
   AMIGOS
===================================================== */

const friends = [

    {
        id: "dog",
        name: "Cachorro",
        icon: "🐕",
        price: 1800,
        damage: 12,
        owned: false
    },

    {
        id: "rottweiler",
        name: "Rottweiler",
        icon: "🐕‍🦺",
        price: 3000,
        damage: 20,
        owned: false
    },

    {
        id: "leopard",
        name: "Leopardo",
        icon: "🐆",
        price: 5000,
        damage: 30,
        owned: false
    },

    {
        id: "tiger",
        name: "Tigre",
        icon: "🐅",
        price: 10000,
        damage: 50,
        owned: false
    },

    {
        id: "lion",
        name: "Leão",
        icon: "🦁",
        price: 13000,
        damage: 65,
        owned: false
    },

    {
        id: "raptor",
        name: "Velociraptor",
        icon: "🦖",
        price: 20000,
        damage: 90,
        owned: false
    }

];


let equippedFriend = null;


/* =====================================================
   KITS
===================================================== */

let medkits = 0;

const MEDKIT_PRICE = 250;

const MEDKIT_HEAL = 50;


/*
   Velocidade é uma melhoria permanente.
*/

let speedLevel = 0;

const SPEED_PRICE = 500;

const SPEED_INCREASE = 5;


/* =====================================================
   BOMBAS — 10
===================================================== */

const bombs = [

    ["bomb1", "Granada", "💣", 300, 200],
    ["bomb2", "Granada incendiária", "🔥", 600, 300],
    ["bomb3", "Granada elétrica", "⚡", 900, 400],
    ["bomb4", "Granada tóxica", "☣️", 1000, 450],
    ["bomb5", "C4", "💥", 1500, 700],
    ["bomb6", "Mina explosiva", "💣", 1200, 550],
    ["bomb7", "Bomba de fragmentação", "💥", 1800, 800],
    ["bomb8", "Bomba incendiária", "🔥", 2200, 1000],
    ["bomb9", "Bomba pesada", "💣", 3000, 1500],
    ["bomb10", "Bomba nuclear", "☢️", 10000, 5000]

].map(
    x => ({

        id: x[0],
        name: x[1],
        icon: x[2],
        price: x[3],
        damage: x[4],
        owned: 0

    })
);


/* =====================================================
   ARMADILHAS — 15
===================================================== */

const traps = [

    ["trap1", "Armadilha simples", "🪤", 200, 100],
    ["trap2", "Armadilha de espinhos", "🪤", 350, 150],
    ["trap3", "Armadilha elétrica", "⚡", 600, 300],
    ["trap4", "Armadilha de fogo", "🔥", 700, 350],
    ["trap5", "Armadilha tóxica", "☣️", 800, 400],
    ["trap6", "Mina", "💣", 900, 500],
    ["trap7", "Serra", "⚙️", 1200, 650],
    ["trap8", "Armadilha pesada", "🪤", 1500, 800],
    ["trap9", "Armadilha explosiva", "💥", 1800, 1000],
    ["trap10", "Armadilha elétrica dupla", "⚡", 2000, 1200],
    ["trap11", "Armadilha de fogo dupla", "🔥", 2500, 1500],
    ["trap12", "Mina militar", "💣", 3000, 1800],
    ["trap13", "Torre automática", "🔫", 5000, 2500],
    ["trap14", "Armadilha laser", "🔴", 7000, 3500],
    ["trap15", "Armadilha suprema", "☠️", 10000, 6000]

].map(
    x => ({

        id: x[0],
        name: x[1],
        icon: x[2],
        price: x[3],
        damage: x[4],
        owned: 0

    })
);


/* =====================================================
   BARRICADAS — 10
===================================================== */

const barricades = [

    ["bar1", "Barricada de madeira", "🧱", 250, 300],
    ["bar2", "Barricada reforçada", "🧱", 500, 500],
    ["bar3", "Barricada metálica", "🔩", 800, 800],
    ["bar4", "Parede de aço", "🛡️", 1200, 1200],
    ["bar5", "Muro reforçado", "🏗️", 2000, 1800],
    ["bar6", "Barreira militar", "🚧", 3000, 2500],
    ["bar7", "Barreira blindada", "🛡️", 4500, 4000],
    ["bar8", "Muro pesado", "🏰", 6000, 6000],
    ["bar9", "Fortificação", "🏰", 9000, 10000],
    ["bar10", "Fortaleza", "🏯", 15000, 20000]

].map(
    x => ({

        id: x[0],
        name: x[1],
        icon: x[2],
        price: x[3],
        health: x[4],
        owned: 0

    })
);


/* =====================================================
   CATEGORIAS
===================================================== */

const categories = {

    armadura: armors.map(
        armor => ({

            type: "armor",

            id: armor.id,

            name: armor.name,

            icon: armor.icon,

            description:
                `Proteção: ${armor.protection}`,

            price: armor.price

        })
    ),


    amigos: friends.map(
        friend => ({

            type: "friend",

            id: friend.id,

            name: friend.name,

            icon: friend.icon,

            description:
                `Dano: ${friend.damage}`,

            price: friend.price

        })
    ),


    armas: Object.keys(
        weapons
    ).map(
        id => ({

            type: "weapon",

            id,

            name:
                weapons[id].name,

            icon:
                weapons[id].icon,

            description:
                `Dano: ${weapons[id].damage}`,

            price:
                weapons[id].price

        })
    ),


    municao: Object.keys(
        weapons
    ).map(
        id => ({

            type: "ammo",

            id,

            name:
                `Munição — ${weapons[id].name}`,

            icon: "📦",

            description:
                `+${weapons[id].ammoPack} munições`,

            price:
                weapons[id].ammoPrice

        })
    ),


    kits: [

        {
            type: "medkit",

            id: "medkit",

            name: "Kit médico",

            icon: "🩹",

            description:
                "+50 de vida no menu",

            price: MEDKIT_PRICE

        },

        {
            type: "speed",

            id: "speed",

            name: "Melhoria de velocidade",

            icon: "⚡",

            description:
                "+5 velocidade permanente",

            price: SPEED_PRICE

        }

    ],


    bombas: bombs.map(
        bomb => ({

            type: "bomb",

            id: bomb.id,

            name: bomb.name,

            icon: bomb.icon,

            description:
                `Dano: ${bomb.damage}`,

            price: bomb.price

        })
    ),


    armadilhas: traps.map(
        trap => ({

            type: "trap",

            id: trap.id,

            name: trap.name,

            icon: trap.icon,

            description:
                `Dano: ${trap.damage}`,

            price: trap.price

        })
    ),


    barricadas: barricades.map(
        barricade => ({

            type: "barricade",

            id: barricade.id,

            name: barricade.name,

            icon: barricade.icon,

            description:
                `Resistência: ${barricade.health}`,

            price: barricade.price

        })
    )

};


/* =====================================================
   RENDER LOJA
===================================================== */

function renderShop() {

    const list =
        categories[currentCategory];

    shopContent.innerHTML = "";


    const grid =
        document.createElement("div");

    grid.className = "shop-grid";


    list.forEach(
        item => {

            const card =
                document.createElement("div");

            card.className =
                "item-card";


            const button =
                document.createElement("button");

            button.className =
                "item-button";


            let owned = false;

            let label = "COMPRAR";


            if (
                item.type === "weapon"
            ) {

                owned =
                    weapons[item.id].owned;

                label =
                    owned
                        ? "EQUIPAR"
                        : "COMPRAR";
            }


            if (
                item.type === "armor"
            ) {

                owned =
                    armors.find(
                        x =>
                            x.id ===
                            item.id
                    ).owned;

                label =
                    owned
                        ? "EQUIPAR"
                        : "COMPRAR";
            }


            if (
                item.type === "friend"
            ) {

                owned =
                    friends.find(
                        x =>
                            x.id ===
                            item.id
                    ).owned;

                label =
                    owned
                        ? "EQUIPAR"
                        : "COMPRAR";
            }


            if (
                item.type === "ammo"
            ) {

                owned =
                    weapons[item.id].owned;

                label =
                    owned
                        ? "COMPRAR MUNIÇÃO"
                        : "COMPRE A ARMA";

                if (!owned) {

                    button.disabled =
                        true;
                }
            }


            if (
                item.type === "speed"
            ) {

                label =
                    "COMPRAR +5";
            }


            if (
                item.type === "medkit"
            ) {

                label =
                    `COMPRAR (${medkits})`;
            }


            if (
                item.type === "bomb"
            ) {

                const bomb =
                    bombs.find(
                        x =>
                            x.id ===
                            item.id
                    );

                label =
                    `COMPRAR (${bomb.owned})`;
            }


            if (
                item.type === "trap"
            ) {

                const trap =
                    traps.find(
                        x =>
                            x.id ===
                            item.id
                    );

                label =
                    `COMPRAR (${trap.owned})`;
            }


            if (
                item.type === "barricade"
            ) {

                const barricade =
                    barricades.find(
                        x =>
                            x.id ===
                            item.id
                    );

                label =
                    `COMPRAR (${barricade.owned})`;
            }


            button.textContent =
                label;


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

            `;


            card.appendChild(button);


            if (owned) {

                card.classList.add(
                    "owned"
                );
            }


            button.addEventListener(
                "click",
                () => buyItem(item)
            );


            grid.appendChild(card);

        }
    );


    shopContent.appendChild(grid);

    renderInventory();

    updateHUD();
}


/* =====================================================
   COMPRAR
===================================================== */

function buyItem(item) {

    /* ARMADURA */

    if (
        item.type === "armor"
    ) {

        const armor =
            armors.find(
                x =>
                    x.id ===
                    item.id
            );


        if (!armor.owned) {

            if (
                money <
                armor.price
            ) {

                alert(
                    "Dinheiro insuficiente."
                );

                return;
            }


            money -=
                armor.price;

            armor.owned =
                true;
        }


        player.hasArmor =
            true;

        player.armorMax =
            armor.protection;

        player.armor =
            armor.protection;


        addInventoryItem({

            type: "armor",

            id: armor.id,

            name: armor.name,

            icon: armor.icon

        });


        renderShop();

        return;
    }


    /* AMIGOS */

    if (
        item.type === "friend"
    ) {

        const friend =
            friends.find(
                x =>
                    x.id ===
                    item.id
            );


        if (!friend.owned) {

            if (
                money <
                friend.price
            ) {

                alert(
                    "Dinheiro insuficiente."
                );

                return;
            }


            money -=
                friend.price;

            friend.owned =
                true;
        }


        equippedFriend =
            friend.id;


        addInventoryItem({

            type: "friend",

            id: friend.id,

            name: friend.name,

            icon: friend.icon

        });


        renderShop();

        return;
    }


    /* ARMAS */

    if (
        item.type === "weapon"
    ) {

        const weapon =
            weapons[item.id];


        if (!weapon.owned) {

            if (
                money <
                weapon.price
            ) {

                alert(
                    "Dinheiro insuficiente."
                );

                return;
            }


            money -=
                weapon.price;

            weapon.owned =
                true;
        }


        equippedWeapon =
            item.id;


        addInventoryItem({

            type: "weapon",

            id: item.id,

            name: weapon.name,

            icon: weapon.icon

        });


        renderShop();

        return;
    }


    /* MUNIÇÃO */

    if (
        item.type === "ammo"
    ) {

        const weapon =
            weapons[item.id];


        if (!weapon.owned) {

            return;
        }


        if (
            money <
            weapon.ammoPrice
        ) {

            alert(
                "Dinheiro insuficiente."
            );

            return;
        }


        money -=
            weapon.ammoPrice;


        weapon.reserve +=
            weapon.ammoPack;


        renderShop();

        return;
    }


    /* KIT MÉDICO */

    if (
        item.type === "medkit"
    ) {

        if (
            money <
            MEDKIT_PRICE
        ) {

            alert(
                "Dinheiro insuficiente."
            );

            return;
        }


        money -=
            MEDKIT_PRICE;

        medkits++;


        renderShop();

        return;
    }


    /* VELOCIDADE */

    if (
        item.type === "speed"
    ) {

        if (
            money <
            SPEED_PRICE
        ) {

            alert(
                "Dinheiro insuficiente."
            );

            return;
        }


        money -=
            SPEED_PRICE;


        speedLevel++;


        player.speed =
            DEFAULT_SPEED +
            speedLevel *
            SPEED_INCREASE;


        renderShop();

        return;
    }


    /* BOMBAS */

    if (
        item.type === "bomb"
    ) {

        const bomb =
            bombs.find(
                x =>
                    x.id ===
                    item.id
            );


        if (
            money <
            bomb.price
        ) {

            alert(
                "Dinheiro insuficiente."
            );

            return;
        }


        money -=
            bomb.price;

        bomb.owned++;


        addInventoryItem({

            type: "bomb",

            id: bomb.id,

            name: bomb.name,

            icon: bomb.icon

        });


        renderShop();

        return;
    }


    /* ARMADILHAS */

    if (
        item.type === "trap"
    ) {

        const trap =
            traps.find(
                x =>
                    x.id ===
                    item.id
            );


        if (
            money <
            trap.price
        ) {

            alert(
                "Dinheiro insuficiente."
            );

            return;
        }


        money -=
            trap.price;

        trap.owned++;


        addInventoryItem({

            type: "trap",

            id: trap.id,

            name: trap.name,

            icon: trap.icon

        });


        renderShop();

        return;
    }


    /* BARRICADAS */

    if (
        item.type === "barricade"
    ) {

        const barricade =
            barricades.find(
                x =>
                    x.id ===
                    item.id
            );


        if (
            money <
            barricade.price
        ) {

            alert(
                "Dinheiro insuficiente."
            );

            return;
        }


        money -=
            barricade.price;

        barricade.owned++;


        addInventoryItem({

            type: "barricade",

            id: barricade.id,

            name: barricade.name,

            icon: barricade.icon

        });


        renderShop();

        return;
    }

}


/* =====================================================
   INVENTÁRIO
===================================================== */

function addInventoryItem(item) {

    const empty =
        inventory.findIndex(
            x => x === null
        );


    if (
        empty === -1
    ) {

        alert(
            "Inventário cheio! Você só pode carregar 5 itens."
        );

        return false;
    }


    inventory[empty] =
        item;


    renderInventory();

    return true;
}


function renderInventory() {

    menuInventory.innerHTML = "";

    gameInventorySlots.innerHTML = "";


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const item =
            inventory[i];


        const createSlot =
            () => {

                const slot =
                    document.createElement(
                        "div"
                    );


                slot.className =
                    "inventory-slot";


                if (
                    i === selectedSlot
                ) {

                    slot.classList.add(
                        "selected"
                    );
                }


                slot.innerHTML = `

                    <span class="slot-number">
                        ${i + 1}
                    </span>

                    <span>
                        ${
                            item
                                ? item.icon
                                : "—"
                        }
                    </span>

                    <span class="slot-name">
                        ${
                            item
                                ? item.name
                                : "Vazio"
                        }
                    </span>

                `;


                return slot;
            };


        menuInventory.appendChild(
            createSlot()
        );

        gameInventorySlots.appendChild(
            createSlot()
        );

    }

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

            selectedSlot =
                Number(event.key) - 1;


            useInventoryItem(
                selectedSlot
            );


            renderInventory();
        }

    }
);


/* =====================================================
   USAR ITEM
===================================================== */

function useInventoryItem(index) {

    const item =
        inventory[index];


    if (!item) {

        return;
    }


    if (
        !gameRunning
    ) {

        if (
            item.type === "armor"
        ) {

            equipArmor(
                item.id
            );

        }


        if (
            item.type === "friend"
        ) {

            equippedFriend =
                item.id;
        }


        if (
            item.type === "weapon"
        ) {

            equippedWeapon =
                item.id;
        }


        return;
    }


    if (
        item.type === "bomb"
    ) {

        useBomb(
            item.id
        );

        inventory[index] =
            null;

        return;
    }


    if (
        item.type === "trap"
    ) {

        placeTrap(
            item.id
        );

        inventory[index] =
            null;

        return;
    }


    if (
        item.type === "barricade"
    ) {

        placeBarricade(
            item.id
        );

        inventory[index] =
            null;

    }


    if (
        item.type === "weapon"
    ) {

        equippedWeapon =
            item.id;

        updateHUD();

    }


    if (
        item.type === "friend"
    ) {

        equippedFriend =
            item.id;

    }

}


/* =====================================================
   ARMADURA
===================================================== */

function equipArmor(id) {

    const armor =
        armors.find(
            x =>
                x.id === id
        );


    if (!armor) {

        return;
    }


    player.hasArmor =
        true;

    player.armorMax =
        armor.protection;

    player.armor =
        armor.protection;


    updateHUD();
}


/* =====================================================
   CATEGORIAS
===================================================== */

document
    .querySelectorAll(".category-btn")
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
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    currentCategory =
                        button.dataset.category;


                    renderShop();

                }
            );

        }
    );


/* =====================================================
   CONTROLES
===================================================== */

const keys = {};


window.addEventListener(
    "keydown",
    e => {

        keys[
            e.key.toLowerCase()
        ] = true;


        if (
            e.key === " " ||
            e.key === "ArrowUp" ||
            e.key.toLowerCase() === "w"
        ) {

            if (
                player.grounded
            ) {

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

        keys[
            e.key.toLowerCase()
        ] = false;

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
   ARMAS
===================================================== */

let lastShot = 0;

const bullets = [];


function shoot() {

    const weapon =
        weapons[equippedWeapon];


    const now =
        performance.now();


    let delay = 300;


    if (
        equippedWeapon ===
        "smg"
    ) {

        delay = 100;

    }


    if (
        equippedWeapon ===
        "p90"
    ) {

        delay = 70;

    }


    if (
        weapon.ammo <= 0
    ) {

        reload();

        return;
    }


    if (
        now -
        lastShot <
        delay
    ) {

        return;
    }


    lastShot =
        now;


    weapon.ammo--;


    fireProjectile(
        weapon.damage
    );


    updateHUD();

}


function fireProjectile(
    damage
) {

    const angle =
        Math.atan2(
            mouse.y -
                player.y,

            mouse.x -
                player.x
        );


    bullets.push({

        x: player.x,

        y:
            player.y - 25,

        vx:
            Math.cos(angle) * 15,

        vy:
            Math.sin(angle) * 15,

        damage,

        life: 60

    });

}


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


    weapon.ammo +=
        amount;

    weapon.reserve -=
        amount;


    updateHUD();

}


/* =====================================================
   ZUMBIS — 10 TIPOS
===================================================== */

const zombieTypes = [

    {
        name: "Walker",
        color: "#6d9b55",
        health: 70,
        speed: .8
    },

    {
        name: "Runner",
        color: "#b94d4d",
        health: 45,
        speed: 2.3
    },

    {
        name: "Brute",
        color: "#493b32",
        health: 180,
        speed: .45
    },

    {
        name: "Crawler",
        color: "#6d7650",
        health: 35,
        speed: 1.8
    },

    {
        name: "Soldier",
        color: "#455d67",
        health: 110,
        speed: 1.1
    },

    {
        name: "Mutant",
        color: "#8e49a1",
        health: 250,
        speed: .65
    },

    {
        name: "Burning",
        color: "#d86b27",
        health: 90,
        speed: 1.5
    },

    {
        name: "Toxic",
        color: "#4ac46a",
        health: 120,
        speed: 1
    },

    {
        name: "Tank",
        color: "#35383d",
        health: 350,
        speed: .35
    },

    {
        name: "Boss",
        color: "#c11e2b",
        health: 700,
        speed: .5
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
                Math.random() *
                1500,

            y:
                canvas.height - 40,

            width: 40,

            height: 70,

            health:
                type.health,

            maxHealth:
                type.health,

            speed:
                type.speed,

            color:
                type.color,

            attackCooldown: 0,

            dead: false

        });

    }

}


/* =====================================================
   DANO DO ZUMBI
===================================================== */

function damagePlayer() {

    const DAMAGE = 5;


    if (
        player.hasArmor &&
        player.armor > 0
    ) {

        player.armor -=
            DAMAGE;


        if (
            player.armor < 0
        ) {

            player.health +=
                player.armor;

            player.armor = 0;
        }

    } else {

        player.health -=
            DAMAGE;

    }


    player.health =
        Math.max(
            0,
            player.health
        );


    updateHUD();


    if (
        player.health <= 0
    ) {

        endGame();

    }

}


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
        .6;


    player.y +=
        player.velocityY;


    const floor =
        canvas.height - 40;


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


    player.x =
        Math.max(
            30,
            Math.min(
                canvas.width - 30,
                player.x
            )
        );


    if (
        mouse.down
    ) {

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


            const distance =
                Math.abs(
                    zombie.x -
                    player.x
                );


            if (
                distance < 55
            ) {

                if (
                    zombie.attackCooldown <=
                    0
                ) {

                    damagePlayer();

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


            if (
                zombie.health <= 0
            ) {

                killZombie(
                    zombie
                );

            }

        }
    );


    zombies =
        zombies.filter(
            z =>
                !z.dead
        );

}


/* =====================================================
   MATAR ZUMBI
===================================================== */

function killZombie(zombie) {

    zombie.dead = true;

    money += 100;

    score += 100;

    updateHUD();

}


/* =====================================================
   AMIGOS
===================================================== */

let friendCooldown = 0;


function updateFriend() {

    if (
        !equippedFriend
    ) {

        return;
    }


    if (
        friendCooldown > 0
    ) {

        friendCooldown--;

        return;
    }


    const friend =
        friends.find(
            x =>
                x.id ===
                equippedFriend
        );


    if (!friend) {

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


    if (
        target
    ) {

        target.health -=
            friend.damage;

        friendCooldown =
            35;

    }

}


/* =====================================================
   BALAS
===================================================== */

function updateBullets() {

    for (
        let i =
            bullets.length - 1;

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
                    (
                        zombie.y -
                        zombie.height / 2
                    );


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
   BOMBAS
===================================================== */

function useBomb(id) {

    const bomb =
        bombs.find(
            x =>
                x.id === id
        );


    if (!bomb) {

        return;
    }


    setTimeout(
        () => {

            zombies.forEach(
                zombie => {

                    const distance =
                        Math.abs(
                            zombie.x -
                            player.x
                        );


                    if (
                        distance <
                        250
                    ) {

                        zombie.health -=
                            bomb.damage;

                    }

                }
            );

        },
        300
    );

}


/* =====================================================
   ARMADILHAS
===================================================== */

const placedTraps = [];


function placeTrap(id) {

    const trap =
        traps.find(
            x =>
                x.id === id
        );


    if (!trap) {

        return;
    }


    placedTraps.push({

        x:
            player.x + 100,

        y:
            canvas.height - 45,

        damage:
            trap.damage,

        used: false

    });

}


/* =====================================================
   ATUALIZAR ARMADILHAS
===================================================== */

function updateTraps() {

    placedTraps.forEach(
        trap => {

            if (
                trap.used
            ) {

                return;
            }


            zombies.forEach(
                zombie => {

                    if (
                        Math.abs(
                            zombie.x -
                            trap.x
                        ) < 70
                    ) {

                        zombie.health -=
                            trap.damage;

                        trap.used =
                            true;

                    }

                }
            );

        }
    );

}


/* =====================================================
   BARRICADAS
===================================================== */

const placedBarricades = [];


function placeBarricade(id) {

    const barricade =
        barricades.find(
            x =>
                x.id === id
        );


    if (!barricade) {

        return;
    }


    placedBarricades.push({

        x:
            player.x + 100,

        y:
            canvas.height - 40,

        width: 120,

        health:
            barricade.health

    });

}


/* =====================================================
   ATUALIZAR BARRICADAS
===================================================== */

function updateBarricades() {

    placedBarricades.forEach(
        barricade => {

            zombies.forEach(
                zombie => {

                    if (
                        Math.abs(
                            zombie.x -
                            barricade.x
                        ) < 80
                    ) {

                        barricade.health -=
                            .5;

                    }

                }
            );

        }
    );


    for (
        let i =
            placedBarricades.length - 1;

        i >= 0;

        i--
    ) {

        if (
            placedBarricades[i].health <= 0
        ) {

            placedBarricades.splice(
                i,
                1
            );

        }

    }

}


/* =====================================================
   DESENHO
===================================================== */

function drawBackground() {

    ctx.fillStyle =
        "#15191d";

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
        110,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* PRÉDIOS */

    for (
        let x = 0;
        x < canvas.width;
        x += 220
    ) {

        const height =
            150 +
            (
                x %
                180
            );


        ctx.fillStyle =
            "#252b30";


        ctx.fillRect(

            x,

            canvas.height -
                40 -
                height,

            185,

            height

        );


        ctx.fillStyle =
            "#c79d40";


        for (
            let y =
                canvas.height -
                20 -
                height;

            y <
                canvas.height -
                60;

            y += 35
        ) {

            for (
                let xx =
                    x + 20;

                xx <
                    x + 165;

                xx += 38
            ) {

                ctx.fillRect(
                    xx,
                    y,
                    11,
                    17
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

}


function drawPlayer() {

    ctx.fillStyle =
        "#2878c7";


    ctx.fillRect(

        player.x - 18,

        player.y - 75,

        36,

        55
    );


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


    ctx.strokeStyle =
        "#111";

    ctx.lineWidth =
        7;


    const angle =
        Math.atan2(
            mouse.y -
                (
                    player.y -
                    50
                ),

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
            Math.cos(angle) *
            45,

        player.y -
            50 +
            Math.sin(angle) *
            45

    );

    ctx.stroke();

}


function drawZombies() {

    zombies.forEach(
        zombie => {

            if (
                zombie.dead
            ) {

                return;
            }


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


            ctx.beginPath();

            ctx.arc(

                zombie.x,

                zombie.y -
                    zombie.height -
                    10,

                zombie.width / 2,

                0,

                Math.PI * 2

            );

            ctx.fill();


            /* OLHOS */

            ctx.fillStyle =
                "#ff2020";


            ctx.fillRect(

                zombie.x - 9,

                zombie.y -
                    zombie.height -
                    13,

                5,

                5
            );


            ctx.fillRect(

                zombie.x + 5,

                zombie.y -
                    zombie.height -
                    13,

                5,

                5
            );


            /* VIDA */

            const bar =
                zombie.width *
                1.5;


            ctx.fillStyle =
                "#300";


            ctx.fillRect(

                zombie.x -
                    bar / 2,

                zombie.y -
                    zombie.height -
                    30,

                bar,

                5
            );


            ctx.fillStyle =
                "#e33";


            ctx.fillRect(

                zombie.x -
                    bar / 2,

                zombie.y -
                    zombie.height -
                    30,

                bar *
                    (
                        zombie.health /
                        zombie.maxHealth
                    ),

                5
            );

        }
    );

}


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


function drawFriend() {

    if (
        !equippedFriend
    ) {

        return;
    }


    const friend =
        friends.find(
            x =>
                x.id ===
                equippedFriend
        );


    if (!friend) {

        return;
    }


    ctx.font =
        "40px Arial";


    ctx.fillText(

        friend.icon,

        player.x - 70,

        player.y - 10
    );

}


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


function drawBarricades() {

    placedBarricades.forEach(
        barricade => {

            ctx.fillStyle =
                "#76512e";


            ctx.fillRect(

                barricade.x - 60,

                barricade.y - 100,

                120,

                100

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

                    barricade.x - 50,

                    barricade.y -
                        20 -
                        i * 30

                );

                ctx.lineTo(

                    barricade.x + 50,

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
   LOOP
===================================================== */

function gameLoop() {

    requestAnimationFrame(
        gameLoop
    );


    if (
        !gameRunning
    ) {

        return;
    }


    updatePlayer();

    updateZombies();

    updateBullets();

    updateFriend();

    updateTraps();

    updateBarricades();


    drawBackground();

    drawTraps();

    drawBarricades();

    drawBullets();

    drawZombies();

    drawPlayer();

    drawFriend();


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


    waveFinished =
        false;


    createWave();


    shopScreen.style.display =
        "none";


    hud.style.display =
        "flex";


    document.getElementById(
        "gameInventory"
    ).style.display =
        "block";


    gameRunning =
        true;


    updateHUD();

}


/* =====================================================
   FINALIZAR ONDA
===================================================== */

function finishWave() {

    waveFinished =
        true;


    gameRunning =
        false;


    money +=
        250;


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
        "ONDA CONCLUÍDA!\n\n" +
        "+$250 de bônus"
    );


    renderShop();

    updateHUD();

}


/* =====================================================
   RESET TOTAL APÓS MORTE
===================================================== */

function resetEverything() {

    money =
        INITIAL_MONEY;


    wave =
        1;


    score =
        0;


    player.health =
        100;


    player.armor =
        0;


    player.armorMax =
        0;


    player.hasArmor =
        false;


    player.speed =
        DEFAULT_SPEED;


    speedLevel =
        0;


    equippedWeapon =
        "pistol";


    equippedFriend =
        null;


    medkits =
        0;


    inventory = [

        null,

        null,

        null,

        null,

        null

    ];


    selectedSlot =
        0;


    /* Resetar armas */

    Object.keys(
        weapons
    ).forEach(
        id => {

            weapons[id].owned =
                id === "pistol";


            weapons[id].ammo =
                weapons[id].magazineSize;


            weapons[id].reserve =
                id === "pistol"
                    ? 30
                    : weapons[id].reserve;

        }
    );


    /*
       Pistola começa com
       exatamente 30 reservas.
    */

    weapons.pistol.ammo =
        12;

    weapons.pistol.reserve =
        30;


    /* Resetar armaduras */

    armors.forEach(
        armor => {

            armor.owned =
                false;

        }
    );


    /* Resetar amigos */

    friends.forEach(
        friend => {

            friend.owned =
                false;

        }
    );


    /* Resetar bombas */

    bombs.forEach(
        bomb => {

            bomb.owned =
                0;

        }
    );


    /* Resetar armadilhas */

    traps.forEach(
        trap => {

            trap.owned =
                0;

        }
    );


    /* Resetar barricadas */

    barricades.forEach(
        barricade => {

            barricade.owned =
                0;

        }
    );


    zombies = [];

    bullets.length = 0;

    placedTraps.length = 0;

    placedBarricades.length = 0;


    waveFinished =
        false;

}


/* =====================================================
   MORTE
===================================================== */

function endGame() {

    gameRunning =
        false;


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
        score;


}


/* =====================================================
   BOTÃO RECOMEÇAR
===================================================== */

restartBtn.addEventListener(
    "click",
    () => {

        gameOver.style.display =
            "none";


        resetEverything();


        shopScreen.style.display =
            "flex";


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
       ARMADURA SÓ APARECE
       SE EXISTIR ARMADURA
    */

    if (
        player.hasArmor
    ) {

        armorHud.style.display =
            "block";


        armorBar.style.width =

            (
                player.armor /
                player.armorMax *
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


/* =====================================================
   KIT MÉDICO
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
            MEDKIT_HEAL
        );


    medkits--;


    updateHUD();

}


/* =====================================================
   INÍCIO
===================================================== */

renderShop();

updateHUD();
