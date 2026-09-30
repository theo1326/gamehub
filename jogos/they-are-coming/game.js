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
}// ===============================
// GAME.JS — PARTE 2
// ===============================

// ===============================
// SISTEMA DE ARMAS
// ===============================

const WEAPONS = [

    // ---------- PISTOLAS ----------
    {
        id: "pistol",
        name: "Pistola 9mm",
        category: "Armas de fogo",
        icon: "🔫",
        price: 250,
        ammoType: "9mm",
        ammoPrice: 5,
        damage: 18,
        fireRate: 380,
        magazine: 12,
        maxAmmo: 120,
        range: 420,
        spread: 0.04,
        description: "Pistola equilibrada para combates próximos."
    },

    {
        id: "revolver",
        name: "Revólver .357",
        category: "Armas de fogo",
        icon: "🔫",
        price: 450,
        ammoType: ".357",
        ammoPrice: 12,
        damage: 42,
        fireRate: 650,
        magazine: 6,
        maxAmmo: 60,
        range: 500,
        spread: 0.025,
        description: "Poucos disparos, mas enorme poder de fogo."
    },

    {
        id: "desert_eagle",
        name: "Desert Eagle",
        category: "Armas de fogo",
        icon: "🔫",
        price: 900,
        ammoType: ".50 AE",
        ammoPrice: 20,
        damage: 70,
        fireRate: 750,
        magazine: 7,
        maxAmmo: 42,
        range: 520,
        spread: 0.035,
        description: "Pistola pesada com dano extremamente alto."
    },

    {
        id: "machine_pistol",
        name: "Machine Pistol",
        category: "Armas de fogo",
        icon: "🔫",
        price: 700,
        ammoType: "9mm",
        ammoPrice: 6,
        damage: 15,
        fireRate: 110,
        magazine: 20,
        maxAmmo: 160,
        range: 350,
        spread: 0.11,
        description: "Pistola automática de curto alcance."
    },

    // ---------- SMGs ----------
    {
        id: "smg",
        name: "SMG",
        category: "Submetralhadoras",
        icon: "🔫",
        price: 1100,
        ammoType: "9mm",
        ammoPrice: 6,
        damage: 16,
        fireRate: 100,
        magazine: 30,
        maxAmmo: 240,
        range: 420,
        spread: 0.09,
        description: "Alta cadência para eliminar vários inimigos."
    },

    {
        id: "mp5",
        name: "MP5",
        category: "Submetralhadoras",
        icon: "🔫",
        price: 1500,
        ammoType: "9mm",
        ammoPrice: 7,
        damage: 20,
        fireRate: 90,
        magazine: 30,
        maxAmmo: 270,
        range: 480,
        spread: 0.065,
        description: "Submetralhadora estável e precisa."
    },

    {
        id: "vector",
        name: "Vector",
        category: "Submetralhadoras",
        icon: "🔫",
        price: 2100,
        ammoType: "9mm",
        ammoPrice: 8,
        damage: 17,
        fireRate: 65,
        magazine: 33,
        maxAmmo: 297,
        range: 400,
        spread: 0.085,
        description: "Cadência extremamente rápida."
    },

    {
        id: "p90",
        name: "P90",
        category: "Submetralhadoras",
        icon: "🔫",
        price: 2300,
        ammoType: "5.7mm",
        ammoPrice: 9,
        damage: 19,
        fireRate: 75,
        magazine: 50,
        maxAmmo: 400,
        range: 500,
        spread: 0.055,
        description: "Grande carregador e ótima velocidade."
    },

    // ---------- SHOTGUNS ----------
    {
        id: "shotgun",
        name: "Escopeta",
        category: "Espingardas",
        icon: "💥",
        price: 1200,
        ammoType: "12 Gauge",
        ammoPrice: 18,
        damage: 15,
        pellets: 9,
        fireRate: 850,
        magazine: 6,
        maxAmmo: 48,
        range: 260,
        spread: 0.25,
        description: "Dispara vários projéteis de uma vez."
    },

    {
        id: "double_barrel",
        name: "Escopeta Dupla",
        category: "Espingardas",
        icon: "💥",
        price: 1000,
        ammoType: "12 Gauge",
        ammoPrice: 18,
        damage: 28,
        pellets: 12,
        fireRate: 1000,
        magazine: 2,
        maxAmmo: 30,
        range: 230,
        spread: 0.32,
        description: "Dois disparos devastadores a curta distância."
    },

    {
        id: "combat_shotgun",
        name: "Combat Shotgun",
        category: "Espingardas",
        icon: "💥",
        price: 2800,
        ammoType: "12 Gauge",
        ammoPrice: 20,
        damage: 18,
        pellets: 10,
        fireRate: 500,
        magazine: 8,
        maxAmmo: 64,
        range: 300,
        spread: 0.22,
        description: "Escopeta automática para situações extremas."
    },

    // ---------- RIFLES ----------
    {
        id: "rifle",
        name: "Rifle de Assalto",
        category: "Rifles",
        icon: "🔫",
        price: 1800,
        ammoType: "5.56mm",
        ammoPrice: 10,
        damage: 27,
        fireRate: 130,
        magazine: 30,
        maxAmmo: 240,
        range: 700,
        spread: 0.045,
        description: "Rifle equilibrado para média distância."
    },

    {
        id: "ak47",
        name: "AK-47",
        category: "Rifles",
        icon: "🔫",
        price: 2200,
        ammoType: "7.62mm",
        ammoPrice: 12,
        damage: 34,
        fireRate: 145,
        magazine: 30,
        maxAmmo: 210,
        range: 650,
        spread: 0.07,
        description: "Muito dano, mas maior recuo."
    },

    {
        id: "m4",
        name: "M4A1",
        category: "Rifles",
        icon: "🔫",
        price: 2500,
        ammoType: "5.56mm",
        ammoPrice: 10,
        damage: 29,
        fireRate: 105,
        magazine: 30,
        maxAmmo: 270,
        range: 750,
        spread: 0.035,
        description: "Rifle preciso e versátil."
    },

    {
        id: "famas",
        name: "FAMAS",
        category: "Rifles",
        icon: "🔫",
        price: 2700,
        ammoType: "5.56mm",
        ammoPrice: 11,
        damage: 31,
        fireRate: 95,
        magazine: 25,
        maxAmmo: 225,
        range: 720,
        spread: 0.05,
        description: "Rifle rápido com excelente alcance."
    },

    {
        id: "g36",
        name: "G36",
        category: "Rifles",
        icon: "🔫",
        price: 2900,
        ammoType: "5.56mm",
        ammoPrice: 11,
        damage: 30,
        fireRate: 100,
        magazine: 30,
        maxAmmo: 270,
        range: 760,
        spread: 0.032,
        description: "Alta precisão e estabilidade."
    },

    // ---------- SNIPERS ----------
    {
        id: "sniper",
        name: "Rifle de Precisão",
        category: "Snipers",
        icon: "🎯",
        price: 3500,
        ammoType: "7.62mm",
        ammoPrice: 25,
        damage: 110,
        fireRate: 1400,
        magazine: 5,
        maxAmmo: 40,
        range: 1300,
        spread: 0.008,
        description: "Dano enorme em longa distância."
    },

    {
        id: "marksman",
        name: "DMR",
        category: "Snipers",
        icon: "🎯",
        price: 3200,
        ammoType: "7.62mm",
        ammoPrice: 20,
        damage: 75,
        fireRate: 650,
        magazine: 10,
        maxAmmo: 80,
        range: 1100,
        spread: 0.018,
        description: "Rifle semiautomático de precisão."
    },

    {
        id: "heavy_sniper",
        name: "Heavy Sniper",
        category: "Snipers",
        icon: "🎯",
        price: 6000,
        ammoType: ".50 BMG",
        ammoPrice: 50,
        damage: 250,
        fireRate: 1900,
        magazine: 5,
        maxAmmo: 25,
        range: 1600,
        spread: 0.004,
        description: "Extremamente poderoso contra inimigos resistentes."
    },

    // ---------- ARMAS PESADAS ----------
    {
        id: "minigun",
        name: "Minigun",
        category: "Armas pesadas",
        icon: "🔥",
        price: 9000,
        ammoType: "7.62mm",
        ammoPrice: 15,
        damage: 25,
        fireRate: 45,
        magazine: 100,
        maxAmmo: 1000,
        range: 650,
        spread: 0.12,
        description: "Uma chuva de balas capaz de destruir hordas."
    },

    {
        id: "rpg",
        name: "RPG",
        category: "Armas pesadas",
        icon: "🚀",
        price: 8500,
        ammoType: "Foguete",
        ammoPrice: 600,
        damage: 500,
        fireRate: 2200,
        magazine: 1,
        maxAmmo: 10,
        range: 1000,
        spread: 0,
        explosive: true,
        explosionRadius: 130,
        description: "Lança foguetes explosivos."
    },

    {
        id: "grenade_launcher",
        name: "Lança-granadas",
        category: "Armas pesadas",
        icon: "💣",
        price: 7000,
        ammoType: "Granada",
        ammoPrice: 350,
        damage: 350,
        fireRate: 1500,
        magazine: 6,
        maxAmmo: 30,
        range: 800,
        spread: 0.02,
        explosive: true,
        explosionRadius: 100,
        description: "Dispara granadas explosivas."
    },

    // ---------- CORPO A CORPO ----------
    {
        id: "knife",
        name: "Faca",
        category: "Combate corpo a corpo",
        icon: "🔪",
        price: 100,
        ammoType: null,
        damage: 55,
        fireRate: 500,
        range: 80,
        spread: 0,
        description: "Arma silenciosa para combate próximo."
    },

    {
        id: "bat",
        name: "Taco de Baseball",
        category: "Combate corpo a corpo",
        icon: "🏏",
        price: 150,
        ammoType: null,
        damage: 75,
        fireRate: 700,
        range: 90,
        spread: 0,
        description: "Golpe forte contra inimigos próximos."
    },

    {
        id: "machete",
        name: "Facão",
        category: "Combate corpo a corpo",
        icon: "⚔️",
        price: 300,
        ammoType: null,
        damage: 100,
        fireRate: 800,
        range: 100,
        spread: 0,
        description: "Arma pesada para combate corpo a corpo."
    },

    {
        id: "hammer",
        name: "Martelo",
        category: "Combate corpo a corpo",
        icon: "🔨",
        price: 250,
        ammoType: null,
        damage: 120,
        fireRate: 1000,
        range: 85,
        spread: 0,
        description: "Ataque lento, porém muito poderoso."
    },

    // ---------- ESPECIAIS ----------
    {
        id: "laser",
        name: "Laser Experimental",
        category: "Especiais",
        icon: "🔴",
        price: 12000,
        ammoType: "Célula",
        ammoPrice: 80,
        damage: 95,
        fireRate: 180,
        magazine: 30,
        maxAmmo: 300,
        range: 900,
        spread: 0.01,
        description: "Arma experimental de energia."
    },

    {
        id: "plasma",
        name: "Rifle de Plasma",
        category: "Especiais",
        icon: "🟢",
        price: 15000,
        ammoType: "Plasma",
        ammoPrice: 120,
        damage: 140,
        fireRate: 300,
        magazine: 20,
        maxAmmo: 160,
        range: 1000,
        spread: 0.015,
        description: "Projéteis de plasma extremamente poderosos."
    },

    {
        id: "railgun",
        name: "Railgun",
        category: "Especiais",
        icon: "⚡",
        price: 25000,
        ammoType: "Carga",
        ammoPrice: 500,
        damage: 500,
        fireRate: 2500,
        magazine: 1,
        maxAmmo: 15,
        range: 1800,
        spread: 0,
        description: "Disparo energético de altíssimo dano."
    }
];


// ===============================
// INVENTÁRIO
// ===============================

const inventory = {
    weapons: {},
    ammo: {},
    items: {},
    money: 5000
};


// ===============================
// ADICIONAR ARMA AO INVENTÁRIO
// ===============================

function addWeapon(id) {

    if (!inventory.weapons[id]) {
        inventory.weapons[id] = {
            owned: true,
            ammo: 0
        };
    }

}


// ===============================
// COMPRAR ARMA
// ===============================

function buyWeapon(id) {

    if (!preparationPhase) {
        showMessage("Você só pode comprar armas durante a preparação.");
        return;
    }

    const weapon = WEAPONS.find(w => w.id === id);

    if (!weapon) return;

    if (inventory.weapons[id]?.owned) {
        showMessage("Você já possui essa arma.");
        return;
    }

    if (inventory.money < weapon.price) {
        showMessage("Dinheiro insuficiente.");
        return;
    }

    inventory.money -= weapon.price;

    addWeapon(id);

    showMessage(`${weapon.name} comprada!`);

    updateShop();
    updateInventory();
}


// ===============================
// COMPRAR MUNIÇÃO
// ===============================

function buyAmmo(id, amount = 1) {

    if (!preparationPhase) {
        showMessage("A munição só pode ser comprada na preparação.");
        return;
    }

    const weapon = WEAPONS.find(w => w.id === id);

    if (!weapon || !weapon.ammoType) return;

    if (!inventory.weapons[id]?.owned) {
        showMessage("Você ainda não possui essa arma.");
        return;
    }

    const price = weapon.ammoPrice * amount;

    if (inventory.money < price) {
        showMessage("Dinheiro insuficiente.");
        return;
    }

    inventory.money -= price;

    if (!inventory.ammo[weapon.ammoType]) {
        inventory.ammo[weapon.ammoType] = 0;
    }

    inventory.ammo[weapon.ammoType] += amount;

    showMessage(`+${amount} munição ${weapon.ammoType}`);

    updateShop();
    updateInventory();
}


// ===============================
// EQUIPAR ARMA
// ===============================

let currentWeapon = "pistol";

function equipWeapon(id) {

    if (!inventory.weapons[id]?.owned) {
        showMessage("Você não possui essa arma.");
        return;
    }

    currentWeapon = id;

    const weapon = WEAPONS.find(w => w.id === id);

    if (weapon) {
        showMessage(`${weapon.name} equipada.`);
    }

    updateInventory();
    updateHUD();
}


// ===============================
// GET WEAPON
// ===============================

function getCurrentWeapon() {

    return WEAPONS.find(w => w.id === currentWeapon);

}


// ===============================
// MUNIÇÃO ATUAL
// ===============================

function getCurrentAmmo() {

    const weapon = getCurrentWeapon();

    if (!weapon || !weapon.ammoType) {
        return Infinity;
    }

    return inventory.ammo[weapon.ammoType] || 0;

}


// ===============================
// GASTAR MUNIÇÃO
// ===============================

function consumeAmmo(amount = 1) {

    const weapon = getCurrentWeapon();

    if (!weapon || !weapon.ammoType) {
        return true;
    }

    const current = inventory.ammo[weapon.ammoType] || 0;

    if (current < amount) {
        showMessage("Sem munição!");
        return false;
    }

    inventory.ammo[weapon.ammoType] -= amount;

    updateHUD();

    return true;

}


// ===============================
// SHOP
// ===============================

function updateShop() {

    const shop = document.getElementById("shop");

    if (!shop) return;

    shop.innerHTML = "";

    WEAPONS.forEach(weapon => {

        const owned = inventory.weapons[weapon.id]?.owned;

        const card = document.createElement("div");

        card.className = "shop-item";

        card.innerHTML = `
            <div class="shop-icon">${weapon.icon}</div>

            <div class="shop-info">

                <h3>${weapon.name}</h3>

                <span>${weapon.category}</span>

                <p>${weapon.description}</p>

                <strong>
                    ${weapon.price.toLocaleString("pt-BR")} $
                </strong>

            </div>

            <div class="shop-actions">

                ${
                    owned

                    ? `
                        <button onclick="equipWeapon('${weapon.id}')">
                            EQUIPAR
                        </button>

                        ${
                            weapon.ammoType
                            ? `
                                <button onclick="buyAmmo('${weapon.id}',10)">
                                    +10 MUNIÇÃO
                                </button>
                            `
                            : ""
                        }
                    `

                    : `
                        <button onclick="buyWeapon('${weapon.id}')">
                            COMPRAR
                        </button>
                    `
                }

            </div>
        `;

        shop.appendChild(card);

    });

}


// ===============================
// INVENTÁRIO
// ===============================

function updateInventory() {

    const inv = document.getElementById("inventory");

    if (!inv) return;

    inv.innerHTML = "";

    WEAPONS.forEach(weapon => {

        if (!inventory.weapons[weapon.id]?.owned) return;

        const selected = currentWeapon === weapon.id;

        const ammo = weapon.ammoType
            ? getAmmoForWeapon(weapon)
            : "∞";

        const item = document.createElement("div");

        item.className =
            "inventory-item" +
            (selected ? " selected" : "");

        item.innerHTML = `

            <div class="inventory-icon">
                ${weapon.icon}
            </div>

            <div class="inventory-details">

                <strong>${weapon.name}</strong>

                <span>
                    Munição: ${ammo}
                </span>

            </div>

            <button onclick="equipWeapon('${weapon.id}')">
                ${selected ? "EQUIPADA" : "EQUIPAR"}
            </button>

        `;

        inv.appendChild(item);

    });

}


// ===============================
// PEGAR MUNIÇÃO DA ARMA
// ===============================

function getAmmoForWeapon(weapon) {

    if (!weapon.ammoType) return Infinity;

    return inventory.ammo[weapon.ammoType] || 0;

}


// ===============================
// HUD
// ===============================

function updateHUD() {

    const weapon = getCurrentWeapon();

    if (!weapon) return;

    const weaponName =
        document.getElementById("weaponName");

    const ammo =
        document.getElementById("ammo");

    const money =
        document.getElementById("money");

    if (weaponName) {
        weaponName.textContent = weapon.name;
    }

    if (ammo) {

        if (!weapon.ammoType) {

            ammo.textContent = "∞";

        } else {

            ammo.textContent =
                getCurrentAmmo();

        }

    }

    if (money) {

        money.textContent =
            `${inventory.money.toLocaleString("pt-BR")} $`;

    }

}


// ===============================
// MENSAGENS
// ===============================

function showMessage(text) {

    let box =
        document.getElementById("gameMessage");

    if (!box) {

        box = document.createElement("div");

        box.id = "gameMessage";

        document.body.appendChild(box);

    }

    box.textContent = text;

    box.classList.add("show");

    clearTimeout(box._timer);

    box._timer = setTimeout(() => {

        box.classList.remove("show");

    }, 1800);

}


// ===============================
// INICIALIZAÇÃO
// ===============================

function initializeWeapons() {

    if (!inventory.weapons.pistol) {

        inventory.weapons.pistol = {
            owned: true,
            ammo: 0
        };

        inventory.ammo["9mm"] = 120;

    }

    currentWeapon = "pistol";

    updateShop();
    updateInventory();
    updateHUD();

}


// ===============================
// EXECUTAR QUANDO PÁGINA CARREGAR
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    initializeWeapons();

});// ============================================================
// GAME.JS — PARTE 3
// COMBATE + INIMIGOS + ONDAS + PREPARAÇÃO
// ============================================================


// ============================================================
// ESTADO PRINCIPAL DO JOGO
// ============================================================

let gameRunning = false;
let preparationPhase = true;

let currentWave = 0;
let totalWaves = 0;

let waveEnemies = [];
let enemiesAlive = 0;

let player = {
    x: 0,
    y: 0,
    width: 34,
    height: 34,
    speed: 4,
    health: 100,
    maxHealth: 100,
    kills: 0,
    score: 0
};

let mouse = {
    x: 0,
    y: 0,
    down: false
};

let keys = {};

let lastShot = 0;
let gameAnimation = null;


// ============================================================
// CANVAS
// ============================================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas ? canvas.getContext("2d") : null;


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function resizeCanvas() {

    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (!player.x) {
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
    }

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ============================================================
// CONTROLES
// ============================================================

document.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

    if (
        event.key === " " ||
        event.code === "Space"
    ) {
        event.preventDefault();
    }

});

document.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});


// ============================================================
// MOUSE
// ============================================================

if (canvas) {

    canvas.addEventListener("mousemove", event => {

        mouse.x = event.clientX;
        mouse.y = event.clientY;

    });

    canvas.addEventListener("mousedown", event => {

        if (event.button === 0) {
            mouse.down = true;
        }

    });

    canvas.addEventListener("mouseup", event => {

        if (event.button === 0) {
            mouse.down = false;
        }

    });

}


// ============================================================
// TIPOS DE INIMIGOS
// ============================================================

const ENEMY_TYPES = {

    normal: {
        name: "Zumbi",
        health: 100,
        speed: 1.1,
        damage: 8,
        radius: 17,
        reward: 50,
        color: "#55c95b"
    },

    runner: {
        name: "Corredor",
        health: 70,
        speed: 2.2,
        damage: 7,
        radius: 14,
        reward: 70,
        color: "#f1d84b"
    },

    tank: {
        name: "Tanque",
        health: 450,
        speed: 0.55,
        damage: 20,
        radius: 25,
        reward: 200,
        color: "#b64a4a"
    },

    brute: {
        name: "Bruto",
        health: 800,
        speed: 0.45,
        damage: 30,
        radius: 30,
        reward: 350,
        color: "#793f9b"
    }
};


// ============================================================
// CRIAR INIMIGO
// ============================================================

function createEnemy(type = "normal") {

    const data =
        ENEMY_TYPES[type] ||
        ENEMY_TYPES.normal;

    let x;
    let y;

    const side =
        Math.floor(Math.random() * 4);

    if (side === 0) {

        x = Math.random() * canvas.width;
        y = -50;

    } else if (side === 1) {

        x = canvas.width + 50;
        y = Math.random() * canvas.height;

    } else if (side === 2) {

        x = Math.random() * canvas.width;
        y = canvas.height + 50;

    } else {

        x = -50;
        y = Math.random() * canvas.height;

    }

    return {

        id:
            Date.now() +
            Math.random(),

        type,

        name: data.name,

        x,
        y,

        radius: data.radius,

        health: data.health,

        maxHealth: data.health,

        speed: data.speed,

        damage: data.damage,

        reward: data.reward,

        color: data.color,

        attackCooldown: 0,

        hitFlash: 0

    };

}


// ============================================================
// CRIAR ONDA
// ============================================================

function createWave(wave) {

    waveEnemies = [];

    let amount =
        5 +
        Math.floor(wave * 2.5);

    for (let i = 0; i < amount; i++) {

        let type = "normal";

        const random =
            Math.random();

        if (wave >= 3 && random < 0.15) {

            type = "runner";

        }

        if (wave >= 5 && random < 0.10) {

            type = "tank";

        }

        if (wave >= 10 && random < 0.05) {

            type = "brute";

        }

        waveEnemies.push(
            createEnemy(type)
        );

    }

    enemiesAlive =
        waveEnemies.length;

}


// ============================================================
// COMEÇAR ONDA
// ============================================================

function startWave() {

    if (gameRunning) return;

    preparationPhase = false;
    gameRunning = true;

    currentWave++;

    createWave(currentWave);

    hidePreparationMenu();

    updateWaveHUD();

    gameLoop();

}


// ============================================================
// PULAR PREPARAÇÃO
// ============================================================

function skipPreparation() {

    if (!preparationPhase) return;

    startWave();

}


// ============================================================
// FINALIZAR ONDA
// ============================================================

function finishWave() {

    gameRunning = false;

    preparationPhase = true;

    waveEnemies = [];

    enemiesAlive = 0;

    mouse.down = false;

    showPreparationMenu();

    updateWaveHUD();

    updateShop();

    updateInventory();

    updateHUD();

}


// ============================================================
// MOVIMENTO DO JOGADOR
// ============================================================

function updatePlayer() {

    if (!gameRunning) return;

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

    if (dx !== 0 || dy !== 0) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        dx /= length;
        dy /= length;

        player.x +=
            dx * player.speed;

        player.y +=
            dy * player.speed;

    }

    const margin = 20;

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


// ============================================================
// DISTÂNCIA
// ============================================================

function distance(
    x1,
    y1,
    x2,
    y2
) {

    const dx = x2 - x1;
    const dy = y2 - y1;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ============================================================
// DIREÇÃO ATÉ O MOUSE
// ============================================================

function getAimAngle() {

    return Math.atan2(
        mouse.y - player.y,
        mouse.x - player.x
    );

}


// ============================================================
// DISPARAR
// ============================================================

function shoot() {

    if (!gameRunning) return;

    const weapon =
        getCurrentWeapon();

    if (!weapon) return;

    const now =
        performance.now();

    if (
        now - lastShot <
        weapon.fireRate
    ) {
        return;
    }

    lastShot = now;

    if (
        weapon.ammoType &&
        !consumeAmmo(1)
    ) {
        return;
    }

    const angle =
        getAimAngle();

    // ========================================================
    // ARMAS DE CORPO A CORPO
    // ========================================================

    if (!weapon.ammoType) {

        meleeAttack(
            weapon,
            angle
        );

        return;
    }

    // ========================================================
    // ESCOPETA
    // ========================================================

    if (weapon.pellets) {

        for (
            let i = 0;
            i < weapon.pellets;
            i++
        ) {

            const spread =
                (Math.random() - 0.5) *
                weapon.spread;

            createBullet(
                angle + spread,
                weapon
            );

        }

        return;
    }

    // ========================================================
    // TIRO NORMAL
    // ========================================================

    createBullet(
        angle,
        weapon
    );

}


// ============================================================
// CRIAR PROJÉTIL
// ============================================================

let bullets = [];

function createBullet(
    angle,
    weapon
) {

    bullets.push({

        x: player.x,

        y: player.y,

        vx:
            Math.cos(angle) * 13,

        vy:
            Math.sin(angle) * 13,

        damage: weapon.damage,

        range: weapon.range,

        traveled: 0,

        explosive:
            weapon.explosive || false,

        explosionRadius:
            weapon.explosionRadius || 0,

        size:
            weapon.explosive
                ? 7
                : 4

    });

}


// ============================================================
// ATAQUE CORPO A CORPO
// ============================================================

function meleeAttack(
    weapon,
    angle
) {

    const attackRange =
        weapon.range || 80;

    for (
        const enemy of waveEnemies
    ) {

        const d =
            distance(
                player.x,
                player.y,
                enemy.x,
                enemy.y
            );

        if (d > attackRange) {
            continue;
        }

        const enemyAngle =
            Math.atan2(
                enemy.y - player.y,
                enemy.x - player.x
            );

        let difference =
            Math.abs(
                normalizeAngle(
                    enemyAngle -
                    angle
                )
            );

        if (
            difference <
            Math.PI / 2
        ) {

            damageEnemy(
                enemy,
                weapon.damage
            );

        }

    }

}


// ============================================================
// NORMALIZAR ÂNGULO
// ============================================================

function normalizeAngle(angle) {

    while (
        angle > Math.PI
    ) {
        angle -=
            Math.PI * 2;
    }

    while (
        angle < -Math.PI
    ) {
        angle +=
            Math.PI * 2;
    }

    return angle;

}


// ============================================================
// ATUALIZAR PROJÉTEIS
// ============================================================

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

        bullet.traveled +=
            Math.sqrt(
                bullet.vx *
                bullet.vx +
                bullet.vy *
                bullet.vy
            );

        let hit = false;

        for (
            const enemy of waveEnemies
        ) {

            if (
                enemy.health <= 0
            ) {
                continue;
            }

            const d =
                distance(
                    bullet.x,
                    bullet.y,
                    enemy.x,
                    enemy.y
                );

            if (
                d <=
                enemy.radius +
                bullet.size
            ) {

                if (
                    bullet.explosive
                ) {

                    explosionDamage(
                        bullet.x,
                        bullet.y,
                        bullet.explosionRadius,
                        bullet.damage
                    );

                } else {

                    damageEnemy(
                        enemy,
                        bullet.damage
                    );

                }

                hit = true;

                break;
            }

        }

        if (
            hit ||
            bullet.traveled >
                bullet.range ||
            bullet.x < -100 ||
            bullet.x >
                canvas.width + 100 ||
            bullet.y < -100 ||
            bullet.y >
                canvas.height + 100
        ) {

            bullets.splice(
                i,
                1
            );

        }

    }

}


// ============================================================
// EXPLOSÃO
// ============================================================

function explosionDamage(
    x,
    y,
    radius,
    damage
) {

    for (
        const enemy of waveEnemies
    ) {

        if (
            enemy.health <= 0
        ) {
            continue;
        }

        const d =
            distance(
                x,
                y,
                enemy.x,
                enemy.y
            );

        if (d <= radius) {

            const multiplier =
                1 -
                Math.min(
                    d / radius,
                    0.8
                );

            damageEnemy(
                enemy,
                damage * multiplier
            );

        }

    }

}


// ============================================================
// DANO NO INIMIGO
// ============================================================

function damageEnemy(
    enemy,
    damage
) {

    if (
        enemy.health <= 0
    ) {
        return;
    }

    enemy.health -= damage;

    enemy.hitFlash = 5;

    if (
        enemy.health <= 0
    ) {

        enemy.health = 0;

        killEnemy(enemy);

    }

}


// ============================================================
// MATAR INIMIGO
// ============================================================

function killEnemy(enemy) {

    player.kills++;

    player.score +=
        enemy.reward;

    inventory.money +=
        enemy.reward;

    enemiesAlive--;

    updateHUD();

    if (
        enemiesAlive <= 0
    ) {

        setTimeout(() => {

            if (
                gameRunning
            ) {
                finishWave();
            }

        }, 700);

    }

}


// ============================================================
// ATUALIZAR INIMIGOS
// ============================================================

function updateEnemies() {

    if (!gameRunning) return;

    for (
        const enemy of waveEnemies
    ) {

        if (
            enemy.health <= 0
        ) {
            continue;
        }

        const dx =
            player.x -
            enemy.x;

        const dy =
            player.y -
            enemy.y;

        const d =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (d > 1) {

            enemy.x +=
                (dx / d) *
                enemy.speed;

            enemy.y +=
                (dy / d) *
                enemy.speed;

        }

        if (
            enemy.attackCooldown >
            0
        ) {

            enemy.attackCooldown--;

        }

        if (
            d <
            enemy.radius +
            player.width / 2
        ) {

            if (
                enemy.attackCooldown <= 0
            ) {

                damagePlayer(
                    enemy.damage
                );

                enemy.attackCooldown =
                    60;

            }

        }

        if (
            enemy.hitFlash > 0
        ) {

            enemy.hitFlash--;

        }

    }

}


// ============================================================
// DANO NO JOGADOR
// ============================================================

function damagePlayer(
    damage
) {

    if (!gameRunning) return;

    player.health -= damage;

    if (
        player.health <= 0
    ) {

        player.health = 0;

        gameOver();

    }

    updateHUD();

}


// ============================================================
// GAME OVER
// ============================================================

function gameOver() {

    gameRunning = false;

    preparationPhase = false;

    mouse.down = false;

    bullets = [];

    waveEnemies = [];

    enemiesAlive = 0;

    showGameOver();

}


// ============================================================
// DISPARO CONTÍNUO
// ============================================================

function handleShooting() {

    if (
        mouse.down &&
        gameRunning
    ) {

        shoot();

    }

}


// ============================================================
// DESENHAR JOGADOR
// ============================================================

function drawPlayer() {

    if (!ctx) return;

    const angle =
        getAimAngle();

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    ctx.rotate(angle);

    // corpo
    ctx.fillStyle = "#3f8cff";

    ctx.fillRect(
        -17,
        -17,
        34,
        34
    );

    // direção da arma
    ctx.fillStyle = "#222";

    ctx.fillRect(
        5,
        -5,
        25,
        10
    );

    ctx.restore();

}


// ============================================================
// DESENHAR INIMIGOS
// ============================================================

function drawEnemies() {

    if (!ctx) return;

    for (
        const enemy of waveEnemies
    ) {

        if (
            enemy.health <= 0
        ) {
            continue;
        }

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            enemy.hitFlash > 0
                ? "#ffffff"
                : enemy.color;

        ctx.fill();

        ctx.closePath();

        // barra de vida

        const barWidth =
            enemy.radius * 2;

        const healthPercent =
            enemy.health /
            enemy.maxHealth;

        ctx.fillStyle =
            "#222";

        ctx.fillRect(
            enemy.x -
                barWidth / 2,
            enemy.y -
                enemy.radius -
                10,
            barWidth,
            5
        );

        ctx.fillStyle =
            "#42d66b";

        ctx.fillRect(
            enemy.x -
                barWidth / 2,
            enemy.y -
                enemy.radius -
                10,
            barWidth *
                Math.max(
                    0,
                    healthPercent
                ),
            5
        );

        ctx.restore();

    }

}


// ============================================================
// DESENHAR PROJÉTEIS
// ============================================================

function drawBullets() {

    if (!ctx) return;

    for (
        const bullet of bullets
    ) {

        ctx.beginPath();

        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            bullet.explosive
                ? "#ff8c00"
                : "#ffe66d";

        ctx.fill();

        ctx.closePath();

    }

}


// ============================================================
// FUNDO
// ============================================================

function drawBackground() {

    if (!ctx) return;

    ctx.fillStyle =
        "#10141a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // grade

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;

    const size = 50;

    for (
        let x = 0;
        x < canvas.width;
        x += size
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
        y += size
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


// ============================================================
// DESENHAR TUDO
// ============================================================

function renderGame() {

    if (!ctx) return;

    drawBackground();

    drawBullets();

    drawEnemies();

    drawPlayer();

}


// ============================================================
// LOOP DO JOGO
// ============================================================

function gameLoop() {

    if (!gameRunning) {

        renderGame();

        return;

    }

    updatePlayer();

    updateBullets();

    updateEnemies();

    handleShooting();

    renderGame();

    updateHUD();

    gameAnimation =
        requestAnimationFrame(
            gameLoop
        );

}


// ============================================================
// HUD DA ONDA
// ============================================================

function updateWaveHUD() {

    const waveElement =
        document.getElementById("wave");

    const enemiesElement =
        document.getElementById("enemies");

    const healthElement =
        document.getElementById("health");

    if (waveElement) {

        waveElement.textContent =
            currentWave;

    }

    if (enemiesElement) {

        enemiesElement.textContent =
            enemiesAlive;

    }

    if (healthElement) {

        healthElement.textContent =
            `${Math.max(
                0,
                Math.floor(
                    player.health
                )
            )}/${player.maxHealth}`;

    }

}


// ============================================================
// ATUALIZAR HUD ORIGINAL
// ============================================================

const oldUpdateHUD =
    typeof updateHUD === "function"
        ? updateHUD
        : null;


// ============================================================
// PREPARAÇÃO
// ============================================================

function showPreparationMenu() {

    preparationPhase = true;

    const menu =
        document.getElementById(
            "preparationMenu"
        );

    if (menu) {

        menu.style.display =
            "flex";

    }

    const game =
        document.getElementById(
            "gameScreen"
        );

    if (game) {

        game.classList.remove(
            "active"
        );

    }

    updateShop();

    updateInventory();

    updateHUD();

}


function hidePreparationMenu() {

    const menu =
        document.getElementById(
            "preparationMenu"
        );

    if (menu) {

        menu.style.display =
            "none";

    }

    const game =
        document.getElementById(
            "gameScreen"
        );

    if (game) {

        game.classList.add(
            "active"
        );

    }

}


// ============================================================
// BOTÃO DE INICIAR ONDA
// ============================================================

document.addEventListener(
    "click",
    event => {

        const startButton =
            event.target.closest(
                "#startWaveBtn"
            );

        if (
            startButton
        ) {

            startWave();

        }

        const skipButton =
            event.target.closest(
                "#skipPreparationBtn"
            );

        if (
            skipButton
        ) {

            skipPreparation();

        }

    }
);


// ============================================================
// GAME OVER — TELA
// ============================================================

function showGameOver() {

    let screen =
        document.getElementById(
            "gameOverScreen"
        );

    if (!screen) {

        screen =
            document.createElement(
                "div"
            );

        screen.id =
            "gameOverScreen";

        screen.innerHTML = `

            <div class="game-over-box">

                <h1>VOCÊ MORREU</h1>

                <p>
                    Onda alcançada:
                    <strong id="finalWave">
                        ${currentWave}
                    </strong>
                </p>

                <p>
                    Inimigos eliminados:
                    <strong id="finalKills">
                        ${player.kills}
                    </strong>
                </p>

                <p>
                    Pontuação:
                    <strong id="finalScore">
                        ${player.score}
                    </strong>
                </p>

                <button
                    id="restartGameBtn"
                >
                    JOGAR NOVAMENTE
                </button>

                <button
                    id="returnMenuBtn"
                >
                    VOLTAR AO MENU
                </button>

            </div>

        `;

        document.body.appendChild(
            screen
        );

    } else {

        screen.style.display =
            "flex";

    }

    const finalWave =
        document.getElementById(
            "finalWave"
        );

    const finalKills =
        document.getElementById(
            "finalKills"
        );

    const finalScore =
        document.getElementById(
            "finalScore"
        );

    if (finalWave) {

        finalWave.textContent =
            currentWave;

    }

    if (finalKills) {

        finalKills.textContent =
            player.kills;

    }

    if (finalScore) {

        finalScore.textContent =
            player.score;

    }

}


// ============================================================
// REINICIAR JOGO
// ============================================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "restartGameBtn"
        ) {

            restartGame();

        }

    }
);


function restartGame() {

    const screen =
        document.getElementById(
            "gameOverScreen"
        );

    if (screen) {

        screen.style.display =
            "none";

    }

    currentWave = 0;

    player.health =
        player.maxHealth;

    player.kills = 0;

    player.score = 0;

    player.x =
        canvas.width / 2;

    player.y =
        canvas.height / 2;

    bullets = [];

    waveEnemies = [];

    enemiesAlive = 0;

    preparationPhase = true;

    gameRunning = false;

    showPreparationMenu();

    updateWaveHUD();

    updateHUD();

}


// ============================================================
// VOLTAR PARA O MENU
// ============================================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "returnMenuBtn"
        ) {

            returnToMainMenu();

        }

    }
);


function returnToMainMenu() {

    gameRunning = false;

    preparationPhase = true;

    bullets = [];

    waveEnemies = [];

    enemiesAlive = 0;

    const gameOver =
        document.getElementById(
            "gameOverScreen"
        );

    if (gameOver) {

        gameOver.style.display =
            "none";

    }

    showPreparationMenu();

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeWeapons();

        updateWaveHUD();

        updateHUD();

        renderGame();

    }
);


// ============================================================
// LOOP DE ATUALIZAÇÃO DO HUD
// ============================================================

setInterval(
    () => {

        updateWaveHUD();

        updateHUD();

    },
    100
);// ============================================================
// GAME.JS — PARTE 4
// MENU + CATEGORIAS + KITS + AMIGOS + RANKING
// ============================================================


// ============================================================
// ESTADO DO MENU
// ============================================================

let currentMenuSection = "home";

let menuOpen = true;

let selectedCategory = "armas";


// ============================================================
// ELEMENTOS DO MENU
// ============================================================

const mainMenu =
    document.getElementById("mainMenu");

const gameScreen =
    document.getElementById("gameScreen");


// ============================================================
// ABRIR MENU PRINCIPAL
// ============================================================

function openMainMenu() {

    menuOpen = true;

    currentMenuSection = "home";

    if (mainMenu) {
        mainMenu.style.display = "flex";
    }

    if (gameScreen) {
        gameScreen.style.display = "none";
    }

    hideAllMenuSections();

}


// ============================================================
// FECHAR MENU PRINCIPAL
// ============================================================

function closeMainMenu() {

    menuOpen = false;

    if (mainMenu) {
        mainMenu.style.display = "none";
    }

}


// ============================================================
// MOSTRAR JOGO
// ============================================================

function showGameScreen() {

    menuOpen = false;

    if (mainMenu) {
        mainMenu.style.display = "none";
    }

    if (gameScreen) {
        gameScreen.style.display = "block";
    }

}


// ============================================================
// ESCONDER SEÇÕES
// ============================================================

function hideAllMenuSections() {

    const sections = [

        "menuHome",
        "menuWeapons",
        "menuMelee",
        "menuKits",
        "menuFriends",
        "menuRanking"

    ];

    sections.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            element.style.display = "none";

        }

    });

}


// ============================================================
// MOSTRAR SEÇÃO
// ============================================================

function showMenuSection(section) {

    hideAllMenuSections();

    currentMenuSection = section;

    let id = "";

    switch (section) {

        case "home":
            id = "menuHome";
            break;

        case "weapons":
            id = "menuWeapons";
            break;

        case "melee":
            id = "menuMelee";
            break;

        case "kits":
            id = "menuKits";
            break;

        case "friends":
            id = "menuFriends";
            break;

        case "ranking":
            id = "menuRanking";
            break;

    }

    const element =
        document.getElementById(id);

    if (element) {

        element.style.display = "block";

    }

}


// ============================================================
// MENU DE ARMAS
// ============================================================

function openWeaponsMenu() {

    showMenuSection("weapons");

    renderWeaponCategories();

}


// ============================================================
// CATEGORIAS DE ARMAS
// ============================================================

const weaponCategories = [

    {
        id: "armas-de-fogo",
        name: "Armas de fogo",
        icon: "🔫"
    },

    {
        id: "submetralhadoras",
        name: "Submetralhadoras",
        icon: "⚡"
    },

    {
        id: "espingardas",
        name: "Espingardas",
        icon: "💥"
    },

    {
        id: "rifles",
        name: "Rifles",
        icon: "🎯"
    },

    {
        id: "snipers",
        name: "Snipers",
        icon: "🔭"
    },

    {
        id: "armas-pesadas",
        name: "Armas pesadas",
        icon: "🚀"
    },

    {
        id: "especiais",
        name: "Especiais",
        icon: "⚡"
    }

];


// ============================================================
// RENDERIZAR CATEGORIAS
// ============================================================

function renderWeaponCategories() {

    const container =
        document.getElementById(
            "weaponCategories"
        );

    if (!container) return;

    container.innerHTML = "";

    weaponCategories.forEach(category => {

        const button =
            document.createElement("button");

        button.className =
            "weapon-category";

        button.innerHTML = `

            <span class="category-icon">
                ${category.icon}
            </span>

            <span>
                ${category.name}
            </span>

        `;

        button.addEventListener(
            "click",
            () => {

                selectedCategory =
                    category.name;

                renderCategoryWeapons(
                    category.name
                );

            }
        );

        container.appendChild(button);

    });

}


// ============================================================
// ARMAS DA CATEGORIA
// ============================================================

function renderCategoryWeapons(
    category
) {

    const container =
        document.getElementById(
            "categoryWeapons"
        );

    if (!container) return;

    container.innerHTML = "";

    const weapons =
        WEAPONS.filter(
            weapon =>
                weapon.category ===
                category
        );

    weapons.forEach(weapon => {

        const owned =
            inventory.weapons[
                weapon.id
            ]?.owned;

        const card =
            document.createElement("div");

        card.className =
            "weapon-card";

        card.innerHTML = `

            <div class="weapon-card-icon">
                ${weapon.icon}
            </div>

            <div class="weapon-card-content">

                <h3>
                    ${weapon.name}
                </h3>

                <p>
                    ${weapon.description}
                </p>

                <div class="weapon-stats">

                    <span>
                        Dano:
                        ${weapon.damage}
                    </span>

                    <span>
                        Cadência:
                        ${weapon.fireRate}ms
                    </span>

                    <span>
                        Alcance:
                        ${weapon.range}
                    </span>

                </div>

                <div class="weapon-card-actions">

                    ${
                        owned

                        ? `
                            <button
                                onclick="
                                equipWeapon(
                                    '${weapon.id}'
                                )
                                "
                            >
                                EQUIPAR
                            </button>
                        `

                        : `
                            <button
                                onclick="
                                buyWeapon(
                                    '${weapon.id}'
                                )
                                "
                            >
                                COMPRAR
                                ${weapon.price.toLocaleString("pt-BR")} $
                            </button>
                        `
                    }

                    ${
                        owned &&
                        weapon.ammoType

                        ? `
                            <button
                                onclick="
                                buyAmmo(
                                    '${weapon.id}',
                                    10
                                )
                                "
                            >
                                +10 MUNIÇÃO
                            </button>
                        `

                        : ""
                    }

                </div>

            </div>

        `;

        container.appendChild(card);

    });

}


// ============================================================
// CORPO A CORPO
// ============================================================

function openMeleeMenu() {

    showMenuSection("melee");

    renderMeleeWeapons();

}


function renderMeleeWeapons() {

    const container =
        document.getElementById(
            "meleeWeapons"
        );

    if (!container) return;

    container.innerHTML = "";

    const weapons =
        WEAPONS.filter(
            weapon =>
                weapon.category ===
                "Combate corpo a corpo"
        );

    weapons.forEach(weapon => {

        const owned =
            inventory.weapons[
                weapon.id
            ]?.owned;

        const card =
            document.createElement("div");

        card.className =
            "weapon-card melee-card";

        card.innerHTML = `

            <div class="weapon-card-icon">
                ${weapon.icon}
            </div>

            <h3>
                ${weapon.name}
            </h3>

            <p>
                ${weapon.description}
            </p>

            <strong>
                Dano: ${weapon.damage}
            </strong>

            ${
                owned

                ? `
                    <button
                        onclick="
                        equipWeapon(
                            '${weapon.id}'
                        )
                        "
                    >
                        EQUIPAR
                    </button>
                `

                : `
                    <button
                        onclick="
                        buyWeapon(
                            '${weapon.id}'
                        )
                        "
                    >
                        COMPRAR
                        ${weapon.price.toLocaleString("pt-BR")} $
                    </button>
                `
            }

        `;

        container.appendChild(card);

    });

}


// ============================================================
// KITS
// ============================================================

const KITS = [

    {
        id: "medkit",
        name: "Kit Médico",
        icon: "🩹",
        price: 300,
        description:
            "Recupera 50 pontos de vida.",
        effect: 50
    },

    {
        id: "big_medkit",
        name: "Kit Médico Grande",
        icon: "🏥",
        price: 700,
        description:
            "Recupera 100 pontos de vida.",
        effect: 100
    },

    {
        id: "armor",
        name: "Colete Blindado",
        icon: "🦺",
        price: 900,
        description:
            "Aumenta sua proteção durante a onda.",
        effect: 30
    },

    {
        id: "ammo_box",
        name: "Caixa de Munição",
        icon: "📦",
        price: 500,
        description:
            "Adiciona munição para a arma equipada.",
        effect: 50
    }

];


const kitInventory = {};


// ============================================================
// ABRIR KITS
// ============================================================

function openKitsMenu() {

    showMenuSection("kits");

    renderKits();

}


// ============================================================
// RENDERIZAR KITS
// ============================================================

function renderKits() {

    const container =
        document.getElementById(
            "kitsList"
        );

    if (!container) return;

    container.innerHTML = "";

    KITS.forEach(kit => {

        const quantity =
            kitInventory[kit.id] || 0;

        const card =
            document.createElement("div");

        card.className =
            "kit-card";

        card.innerHTML = `

            <div class="kit-icon">
                ${kit.icon}
            </div>

            <div class="kit-info">

                <h3>
                    ${kit.name}
                </h3>

                <p>
                    ${kit.description}
                </p>

                <span>
                    Possui: ${quantity}
                </span>

                <strong>
                    ${kit.price.toLocaleString("pt-BR")} $
                </strong>

            </div>

            <button
                onclick="
                    buyKit('${kit.id}')
                "
            >
                COMPRAR
            </button>

        `;

        container.appendChild(card);

    });

}


// ============================================================
// COMPRAR KIT
// ============================================================

function buyKit(id) {

    if (!preparationPhase) {

        showMessage(
            "Você só pode comprar kits durante a preparação."
        );

        return;

    }

    const kit =
        KITS.find(
            item => item.id === id
        );

    if (!kit) return;

    if (
        inventory.money <
        kit.price
    ) {

        showMessage(
            "Dinheiro insuficiente."
        );

        return;

    }

    inventory.money -=
        kit.price;

    kitInventory[id] =
        (kitInventory[id] || 0) +
        1;

    showMessage(
        `${kit.name} comprado!`
    );

    renderKits();

    updateHUD();

}


// ============================================================
// USAR KIT
// ============================================================

function useKit(id) {

    const quantity =
        kitInventory[id] || 0;

    if (quantity <= 0) {

        showMessage(
            "Você não possui esse kit."
        );

        return;

    }

    const kit =
        KITS.find(
            item => item.id === id
        );

    if (!kit) return;

    if (id === "medkit") {

        player.health =
            Math.min(
                player.maxHealth,
                player.health +
                kit.effect
            );

    }

    if (id === "big_medkit") {

        player.health =
            Math.min(
                player.maxHealth,
                player.health +
                kit.effect
            );

    }

    if (id === "armor") {

        player.maxHealth +=
            kit.effect;

        player.health +=
            kit.effect;

    }

    if (id === "ammo_box") {

        const weapon =
            getCurrentWeapon();

        if (
            weapon &&
            weapon.ammoType
        ) {

            inventory.ammo[
                weapon.ammoType
            ] =
                (
                    inventory.ammo[
                        weapon.ammoType
                    ] || 0
                ) +
                kit.effect;

        }

    }

    kitInventory[id]--;

    updateHUD();

    renderKits();

    showMessage(
        `${kit.name} utilizado!`
    );

}


// ============================================================
// AMIGOS
// ============================================================

let friends = [];


// ============================================================
// ABRIR AMIGOS
// ============================================================

function openFriendsMenu() {

    showMenuSection("friends");

    renderFriends();

}


// ============================================================
// RENDERIZAR AMIGOS
// ============================================================

function renderFriends() {

    const container =
        document.getElementById(
            "friendsList"
        );

    if (!container) return;

    container.innerHTML = "";

    if (
        friends.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-friends">

                <div>
                    👥
                </div>

                <h3>
                    Nenhum amigo
                </h3>

                <p>
                    Adicione amigos para jogar juntos.
                </p>

            </div>

        `;

        return;

    }

    friends.forEach(friend => {

        const element =
            document.createElement("div");

        element.className =
            "friend-item";

        element.innerHTML = `

            <div class="friend-avatar">
                👤
            </div>

            <div class="friend-info">

                <strong>
                    ${friend.name}
                </strong>

                <span>
                    ${
                        friend.online
                            ? "🟢 Online"
                            : "⚫ Offline"
                    }
                </span>

            </div>

        `;

        container.appendChild(element);

    });

}


// ============================================================
// ADICIONAR AMIGO
// ============================================================

function addFriend() {

    const input =
        document.getElementById(
            "friendNameInput"
        );

    if (!input) return;

    const name =
        input.value.trim();

    if (!name) {

        showMessage(
            "Digite um nome."
        );

        return;

    }

    if (
        friends.some(
            friend =>
                friend.name
                    .toLowerCase() ===
                name.toLowerCase()
        )
    ) {

        showMessage(
            "Esse jogador já está na lista."
        );

        return;

    }

    friends.push({

        name,

        online: false

    });

    input.value = "";

    renderFriends();

    showMessage(
        `${name} adicionado aos amigos.`
    );

}


// ============================================================
// RANKING
// ============================================================

let rankingData = [];


// ============================================================
// ABRIR RANKING
// ============================================================

function openRankingMenu() {

    showMenuSection("ranking");

    loadGlobalRanking();

}


// ============================================================
// CARREGAR RANKING
// ============================================================

async function loadGlobalRanking() {

    const container =
        document.getElementById(
            "rankingList"
        );

    if (!container) return;

    container.innerHTML = `

        <div class="ranking-loading">

            Carregando ranking...

        </div>

    `;

    /*
       Se o Supabase estiver configurado
       no restante do seu código, usamos
       a tabela global do jogo.
    */

    try {

        if (
            typeof supabaseClient !==
            "undefined"
        ) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "they_are_coming_scores"
                    )
                    .select("*")
                    .order(
                        "score",
                        {
                            ascending: false
                        }
                    )
                    .limit(100);

            if (error) {

                throw error;

            }

            rankingData =
                data || [];

        } else {

            rankingData = [];

        }

    } catch (error) {

        console.error(
            "Erro ao carregar ranking:",
            error
        );

        container.innerHTML = `

            <div class="ranking-error">

                Não foi possível carregar
                o ranking agora.

            </div>

        `;

        return;

    }

    renderRanking();

}


// ============================================================
// RENDERIZAR RANKING
// ============================================================

function renderRanking() {

    const container =
        document.getElementById(
            "rankingList"
        );

    if (!container) return;

    container.innerHTML = "";

    if (
        rankingData.length === 0
    ) {

        container.innerHTML = `

            <div class="ranking-empty">

                🏆

                <h3>
                    Ranking vazio
                </h3>

                <p>
                    Seja o primeiro a registrar uma pontuação.
                </p>

            </div>

        `;

        return;

    }

    rankingData.forEach(
        (playerData, index) => {

            const position =
                index + 1;

            const row =
                document.createElement("div");

            row.className =
                "ranking-row";

            row.innerHTML = `

                <div class="ranking-position">

                    ${
                        position === 1
                            ? "🥇"
                            : position === 2
                            ? "🥈"
                            : position === 3
                            ? "🥉"
                            : position
                    }

                </div>

                <div class="ranking-player">

                    <strong>
                        ${
                            playerData.name ||
                            playerData.username ||
                            "Jogador"
                        }
                    </strong>

                </div>

                <div class="ranking-score">

                    ${
                        Number(
                            playerData.score || 0
                        ).toLocaleString(
                            "pt-BR"
                        )
                    }

                </div>

            `;

            container.appendChild(row);

        }
    );

}


// ============================================================
// PREPARAÇÃO — MOSTRAR MENU
// ============================================================

function openPreparationMenu() {

    preparationPhase = true;

    gameRunning = false;

    showPreparationMenu();

    showGameScreen();

}


// ============================================================
// BOTÃO COMEÇAR ONDA
// ============================================================

function beginNextWave() {

    if (!preparationPhase) {

        return;

    }

    startWave();

}


// ============================================================
// BOTÃO PULAR PREPARAÇÃO
// ============================================================

function skipCurrentPreparation() {

    if (
        !preparationPhase
    ) {

        return;

    }

    startWave();

}


// ============================================================
// MENU DE NAVEGAÇÃO
// ============================================================

document.addEventListener(
    "click",
    event => {

        const target =
            event.target.closest(
                "[data-menu]"
            );

        if (!target) return;

        const menu =
            target.dataset.menu;

        switch (menu) {

            case "home":

                showMenuSection(
                    "home"
                );

                break;

            case "weapons":

                openWeaponsMenu();

                break;

            case "melee":

                openMeleeMenu();

                break;

            case "kits":

                openKitsMenu();

                break;

            case "friends":

                openFriendsMenu();

                break;

            case "ranking":

                openRankingMenu();

                break;

            case "start":

                startWave();

                break;

            case "skip":

                skipCurrentPreparation();

                break;

        }

    }
);


// ============================================================
// VOLTAR DENTRO DO MENU
// ============================================================

document.addEventListener(
    "click",
    event => {

        const backButton =
            event.target.closest(
                "[data-back-menu]"
            );

        if (!backButton) return;

        showMenuSection("home");

    }
);


// ============================================================
// TECLA ESC
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }

        if (
            gameRunning
        ) {
            return;
        }

        openMainMenu();

    }
);


// ============================================================
// BOTÃO DO RANKING
// ============================================================

function createRankingButton() {

    /*
       O ranking fica disponível
       somente no menu.
    */

    const existing =
        document.getElementById(
            "menuRankingButton"
        );

    if (existing) return;

    const container =
        document.getElementById(
            "menuButtons"
        );

    if (!container) return;

    const button =
        document.createElement("button");

    button.id =
        "menuRankingButton";

    button.dataset.menu =
        "ranking";

    button.innerHTML = `
        🏆 RANKING GLOBAL
    `;

    container.appendChild(button);

}


// ============================================================
// ATUALIZAR DINHEIRO NO MENU
// ============================================================

function updateMenuMoney() {

    const elements =
        document.querySelectorAll(
            ".menu-money"
        );

    elements.forEach(
        element => {

            element.textContent =
                `${inventory.money.toLocaleString(
                    "pt-BR"
                )} $`;

        }
    );

}


// ============================================================
// ATUALIZAÇÃO GERAL DO MENU
// ============================================================

function updateMenu() {

    updateMenuMoney();

    updateShop();

    updateInventory();

    renderKits();

    renderFriends();

    createRankingButton();

}


// ============================================================
// MODIFICAR UPDATE HUD
// ============================================================

const originalUpdateHUDFunction =
    window.updateHUD;


// ============================================================
// NOVA ATUALIZAÇÃO DO HUD
// ============================================================

window.updateHUD =
    function () {

        const weapon =
            getCurrentWeapon();

        const ammoElement =
            document.getElementById(
                "ammo"
            );

        const weaponElement =
            document.getElementById(
                "weaponName"
            );

        const moneyElement =
            document.getElementById(
                "money"
            );

        const healthElement =
            document.getElementById(
                "health"
            );

        const waveElement =
            document.getElementById(
                "wave"
            );

        const enemiesElement =
            document.getElementById(
                "enemies"
            );

        if (
            weaponElement &&
            weapon
        ) {

            weaponElement.textContent =
                weapon.name;

        }

        if (
            ammoElement &&
            weapon
        ) {

            ammoElement.textContent =
                weapon.ammoType
                    ? getCurrentAmmo()
                    : "∞";

        }

        if (moneyElement) {

            moneyElement.textContent =
                `${inventory.money.toLocaleString(
                    "pt-BR"
                )} $`;

        }

        if (healthElement) {

            healthElement.textContent =
                `${Math.max(
                    0,
                    Math.floor(
                        player.health
                    )
                )}/${player.maxHealth}`;

        }

        if (waveElement) {

            waveElement.textContent =
                currentWave;

        }

        if (enemiesElement) {

            enemiesElement.textContent =
                enemiesAlive;

        }

        updateMenuMoney();

    };


// ============================================================
// INICIALIZAÇÃO DO MENU
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateMenu();

        showMenuSection(
            "home"
        );

    }
);


// ============================================================
// GARANTIR QUE O RANKING NÃO APAREÇA DURANTE O JOGO
// ============================================================

function hideRankingDuringGame() {

    const ranking =
        document.getElementById(
            "menuRanking"
        );

    if (
        ranking &&
        gameRunning
    ) {

        ranking.style.display =
            "none";

    }

}


// ============================================================
// QUANDO UMA ONDA COMEÇAR
// ============================================================

const originalStartWave =
    window.startWave;

window.startWave =
    function () {

        closeMainMenu();

        hideRankingDuringGame();

        preparationPhase =
            false;

        gameRunning =
            true;

        currentWave++;

        createWave(
            currentWave
        );

        hidePreparationMenu();

        updateWaveHUD();

        updateHUD();

        gameLoop();

    };


// ============================================================
// QUANDO A ONDA TERMINAR
// ============================================================

const originalFinishWave =
    window.finishWave;

window.finishWave =
    function () {

        gameRunning = false;

        preparationPhase = true;

        waveEnemies = [];

        bullets = [];

        enemiesAlive = 0;

        /*
           O jogador volta automaticamente
           para a tela de preparação/menu.
        */

        openPreparationMenu();

        updateMenu();

        updateHUD();

        updateWaveHUD();

    };


// ============================================================
// CORREÇÃO DO BOTÃO DE PULAR
// ============================================================

function setupSkipButton() {

    const button =
        document.getElementById(
            "skipPreparationBtn"
        );

    if (!button) return;

    button.onclick = () => {

        if (
            preparationPhase
        ) {

            startWave();

        }

    };

}


// ============================================================
// CORREÇÃO DO BOTÃO DE COMEÇAR
// ============================================================

function setupStartButton() {

    const button =
        document.getElementById(
            "startWaveBtn"
        );

    if (!button) return;

    button.onclick = () => {

        if (
            preparationPhase
        ) {

            startWave();

        }

    };

}


// ============================================================
// FINALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupSkipButton();

        setupStartButton();

        updateMenu();

    }
);// ============================================================
// GAME.JS — PARTE 5
// INTERFACE COMPLETA + MENU + HUD + INVENTÁRIO
// ============================================================


// ============================================================
// CRIAR INTERFACE PRINCIPAL
// ============================================================

function createGameInterface() {

    // Não cria novamente se já existir
    if (document.getElementById("gameInterface")) {
        return;
    }

    const interfaceRoot =
        document.createElement("div");

    interfaceRoot.id =
        "gameInterface";

    interfaceRoot.innerHTML = `

        <!-- ================================================= -->
        <!-- MENU PRINCIPAL -->
        <!-- ================================================= -->

        <div id="mainMenu" class="game-menu">

            <div class="menu-background"></div>

            <div class="menu-container">

                <div class="menu-header">

                    <div class="game-logo">

                        <span class="logo-icon">
                            ☣
                        </span>

                        <div>
                            <h1>
                                THEY ARE COMING
                            </h1>

                            <p>
                                SURVIVAL PROTOCOL
                            </p>
                        </div>

                    </div>

                    <div class="menu-money">

                        💰
                        <span class="menu-money-value">
                            5.000 $
                        </span>

                    </div>

                </div>


                <!-- ========================================= -->
                <!-- HOME -->
                <!-- ========================================= -->

                <section
                    id="menuHome"
                    class="menu-section"
                >

                    <div class="menu-title">

                        <span>
                            PREPARAÇÃO
                        </span>

                        <h2>
                            ESCOLHA SUA ESTRATÉGIA
                        </h2>

                    </div>


                    <div
                        id="menuButtons"
                        class="menu-buttons"
                    >

                        <button
                            class="menu-button primary"
                            data-menu="start"
                        >

                            <span>▶</span>

                            COMEÇAR ONDA

                        </button>


                        <button
                            class="menu-button"
                            data-menu="weapons"
                        >

                            🔫

                            ARMAS

                        </button>


                        <button
                            class="menu-button"
                            data-menu="melee"
                        >

                            ⚔️

                            COMBATE CORPO A CORPO

                        </button>


                        <button
                            class="menu-button"
                            data-menu="kits"
                        >

                            🩹

                            KITS

                        </button>


                        <button
                            class="menu-button"
                            data-menu="friends"
                        >

                            👥

                            AMIGOS

                        </button>


                        <button
                            class="menu-button"
                            data-menu="ranking"
                        >

                            🏆

                            RANKING GLOBAL

                        </button>

                    </div>


                    <div class="wave-preview">

                        <div>

                            <small>
                                PRÓXIMA ONDA
                            </small>

                            <strong
                                id="menuNextWave"
                            >
                                1
                            </strong>

                        </div>


                        <div>

                            <small>
                                DINHEIRO
                            </small>

                            <strong
                                class="menu-money-value"
                            >
                                5.000 $
                            </strong>

                        </div>


                        <div>

                            <small>
                                ARMA
                            </small>

                            <strong
                                id="menuCurrentWeapon"
                            >
                                Pistola 9mm
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- ========================================= -->
                <!-- ARMAS -->
                <!-- ========================================= -->

                <section
                    id="menuWeapons"
                    class="menu-section"
                >

                    <div class="section-top">

                        <button
                            class="back-button"
                            data-back-menu
                        >
                            ← VOLTAR
                        </button>

                        <h2>
                            🔫 ARMAS
                        </h2>

                    </div>


                    <div
                        id="weaponCategories"
                        class="weapon-categories"
                    ></div>


                    <div
                        id="categoryWeapons"
                        class="category-weapons"
                    >

                        <div class="select-category">

                            Escolha uma categoria.

                        </div>

                    </div>

                </section>


                <!-- ========================================= -->
                <!-- CORPO A CORPO -->
                <!-- ========================================= -->

                <section
                    id="menuMelee"
                    class="menu-section"
                >

                    <div class="section-top">

                        <button
                            class="back-button"
                            data-back-menu
                        >
                            ← VOLTAR
                        </button>

                        <h2>
                            ⚔️ CORPO A CORPO
                        </h2>

                    </div>


                    <div
                        id="meleeWeapons"
                        class="category-weapons"
                    ></div>

                </section>


                <!-- ========================================= -->
                <!-- KITS -->
                <!-- ========================================= -->

                <section
                    id="menuKits"
                    class="menu-section"
                >

                    <div class="section-top">

                        <button
                            class="back-button"
                            data-back-menu
                        >
                            ← VOLTAR
                        </button>

                        <h2>
                            🩹 KITS
                        </h2>

                    </div>


                    <div
                        id="kitsList"
                        class="kits-list"
                    ></div>

                </section>


                <!-- ========================================= -->
                <!-- AMIGOS -->
                <!-- ========================================= -->

                <section
                    id="menuFriends"
                    class="menu-section"
                >

                    <div class="section-top">

                        <button
                            class="back-button"
                            data-back-menu
                        >
                            ← VOLTAR
                        </button>

                        <h2>
                            👥 AMIGOS
                        </h2>

                    </div>


                    <div class="friends-add">

                        <input
                            id="friendNameInput"
                            type="text"
                            placeholder="Nome do jogador"
                            maxlength="20"
                        >

                        <button
                            onclick="addFriend()"
                        >
                            ADICIONAR
                        </button>

                    </div>


                    <div
                        id="friendsList"
                        class="friends-list"
                    ></div>

                </section>


                <!-- ========================================= -->
                <!-- RANKING -->
                <!-- ========================================= -->

                <section
                    id="menuRanking"
                    class="menu-section"
                >

                    <div class="section-top">

                        <button
                            class="back-button"
                            data-back-menu
                        >
                            ← VOLTAR
                        </button>

                        <h2>
                            🏆 RANKING GLOBAL
                        </h2>

                    </div>


                    <div class="ranking-header">

                        <span>
                            POSIÇÃO
                        </span>

                        <span>
                            JOGADOR
                        </span>

                        <span>
                            PONTUAÇÃO
                        </span>

                    </div>


                    <div
                        id="rankingList"
                        class="ranking-list"
                    ></div>

                </section>

            </div>

        </div>


        <!-- ================================================= -->
        <!-- PREPARAÇÃO -->
        <!-- ================================================= -->

        <div
            id="preparationMenu"
            class="preparation-overlay"
        >

            <div class="preparation-box">

                <div class="preparation-label">
                    PREPARAÇÃO
                </div>

                <h2>
                    ONDA
                    <span id="preparationWave">
                        1
                    </span>
                </h2>

                <p>
                    Prepare seus equipamentos antes
                    que eles cheguem.
                </p>


                <div class="preparation-stats">

                    <div>

                        <span>
                            💰 DINHEIRO
                        </span>

                        <strong
                            id="preparationMoney"
                        >
                            5.000 $
                        </strong>

                    </div>


                    <div>

                        <span>
                            🔫 ARMA
                        </span>

                        <strong
                            id="preparationWeapon"
                        >
                            Pistola 9mm
                        </strong>

                    </div>

                </div>


                <div class="preparation-actions">

                    <button
                        id="startWaveBtn"
                        class="start-wave-button"
                    >
                        ▶ COMEÇAR ONDA
                    </button>


                    <button
                        id="skipPreparationBtn"
                        class="skip-button"
                    >
                        ⏩ PULAR PREPARAÇÃO
                    </button>

                </div>

            </div>

        </div>


        <!-- ================================================= -->
        <!-- TELA DO JOGO -->
        <!-- ================================================= -->

        <div
            id="gameScreen"
            class="game-screen"
        >

            <canvas
                id="gameCanvas"
            ></canvas>


            <!-- ============================================= -->
            <!-- HUD SUPERIOR -->
            <!-- ============================================= -->

            <div class="game-hud">

                <div class="hud-left">

                    <div class="hud-box">

                        <span>
                            ONDA
                        </span>

                        <strong id="wave">
                            0
                        </strong>

                    </div>


                    <div class="hud-box">

                        <span>
                            INIMIGOS
                        </span>

                        <strong id="enemies">
                            0
                        </strong>

                    </div>

                </div>


                <div class="hud-center">

                    <div class="health-bar">

                        <div
                            id="healthFill"
                            class="health-fill"
                        ></div>

                    </div>

                    <span id="health">
                        100/100
                    </span>

                </div>


                <div class="hud-right">

                    <div class="hud-money">

                        💰

                        <span id="money">
                            5.000 $
                        </span>

                    </div>

                </div>

            </div>


            <!-- ============================================= -->
            <!-- ARMA -->
            <!-- ============================================= -->

            <div class="weapon-hud">

                <div class="weapon-hud-icon">
                    🔫
                </div>

                <div>

                    <small>
                        ARMA EQUIPADA
                    </small>

                    <strong
                        id="weaponName"
                    >
                        Pistola 9mm
                    </strong>

                </div>


                <div class="ammo-display">

                    <span id="ammo">
                        120
                    </span>

                </div>

            </div>


            <!-- ============================================= -->
            <!-- CONTROLES -->
            <!-- ============================================= -->

            <div class="controls-hint">

                <span>
                    WASD
                </span>

                mover

                <span>
                    MOUSE
                </span>

                mirar

                <span>
                    CLIQUE
                </span>

                atirar

            </div>

        </div>


        <!-- ================================================= -->
        <!-- INVENTÁRIO -->
        <!-- ================================================= -->

        <div
            id="inventoryPanel"
            class="inventory-panel"
        >

            <div class="inventory-header">

                <h2>
                    INVENTÁRIO
                </h2>

                <button
                    onclick="closeInventory()"
                >
                    ×
                </button>

            </div>


            <div
                id="inventory"
                class="inventory-list"
            ></div>

        </div>


        <!-- ================================================= -->
        <!-- GAME OVER -->
        <!-- ================================================= -->

        <div
            id="gameOverScreen"
            class="game-over-screen"
        >

            <div class="game-over-box">

                <div class="game-over-icon">
                    ☠
                </div>

                <h1>
                    VOCÊ MORREU
                </h1>

                <p>
                    A horda foi mais forte.
                </p>


                <div class="game-over-stats">

                    <div>

                        <span>
                            ONDA
                        </span>

                        <strong
                            id="finalWave"
                        >
                            0
                        </strong>

                    </div>


                    <div>

                        <span>
                            ABATES
                        </span>

                        <strong
                            id="finalKills"
                        >
                            0
                        </strong>

                    </div>


                    <div>

                        <span>
                            PONTUAÇÃO
                        </span>

                        <strong
                            id="finalScore"
                        >
                            0
                        </strong>

                    </div>

                </div>


                <div class="game-over-buttons">

                    <button
                        id="restartGameBtn"
                    >
                        🔄 JOGAR NOVAMENTE
                    </button>

                    <button
                        id="returnMenuBtn"
                    >
                        ☰ VOLTAR AO MENU
                    </button>

                </div>

            </div>

        </div>


        <!-- ================================================= -->
        <!-- MENSAGEM -->
        <!-- ================================================= -->

        <div
            id="gameMessage"
            class="game-message"
        ></div>

    `;

    document.body.appendChild(
        interfaceRoot
    );

}


// ============================================================
// INVENTÁRIO — ABRIR
// ============================================================

function openInventory() {

    const panel =
        document.getElementById(
            "inventoryPanel"
        );

    if (!panel) return;

    panel.classList.add("open");

    updateInventory();

}


// ============================================================
// INVENTÁRIO — FECHAR
// ============================================================

function closeInventory() {

    const panel =
        document.getElementById(
            "inventoryPanel"
        );

    if (!panel) return;

    panel.classList.remove("open");

}


// ============================================================
// TECLA I — INVENTÁRIO
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key.toLowerCase() === "i"
        ) {

            if (
                gameRunning
            ) {

                openInventory();

            }

        }

        if (
            event.key === "Escape"
        ) {

            closeInventory();

        }

    }
);


// ============================================================
// ATUALIZAR INFORMAÇÕES DA PREPARAÇÃO
// ============================================================

function updatePreparationInterface() {

    const wave =
        document.getElementById(
            "preparationWave"
        );

    const money =
        document.getElementById(
            "preparationMoney"
        );

    const weapon =
        document.getElementById(
            "preparationWeapon"
        );

    if (wave) {

        wave.textContent =
            currentWave + 1;

    }

    if (money) {

        money.textContent =
            `${inventory.money.toLocaleString(
                "pt-BR"
            )} $`;

    }

    if (
        weapon &&
        getCurrentWeapon()
    ) {

        weapon.textContent =
            getCurrentWeapon().name;

    }

}


// ============================================================
// ATUALIZAR MENU
// ============================================================

function updateMenuInterface() {

    const nextWave =
        document.getElementById(
            "menuNextWave"
        );

    const weapon =
        document.getElementById(
            "menuCurrentWeapon"
        );

    if (nextWave) {

        nextWave.textContent =
            currentWave + 1;

    }

    if (
        weapon &&
        getCurrentWeapon()
    ) {

        weapon.textContent =
            getCurrentWeapon().name;

    }

    document
        .querySelectorAll(
            ".menu-money-value"
        )
        .forEach(element => {

            element.textContent =
                `${inventory.money.toLocaleString(
                    "pt-BR"
                )} $`;

        });

}


// ============================================================
// BARRA DE VIDA
// ============================================================

function updateHealthBar() {

    const fill =
        document.getElementById(
            "healthFill"
        );

    if (!fill) return;

    const percentage =
        Math.max(
            0,
            Math.min(
                100,
                (
                    player.health /
                    player.maxHealth
                ) * 100
            )
        );

    fill.style.width =
        `${percentage}%`;

}


// ============================================================
// ATUALIZAR HUD COMPLETO
// ============================================================

function updateCompleteHUD() {

    updateHUD();

    updateHealthBar();

    updatePreparationInterface();

    updateMenuInterface();

    updateWaveHUD();

}


// ============================================================
// BOTÃO VOLTAR AO MENU
// ============================================================

function goToMainMenu() {

    gameRunning = false;

    preparationPhase = true;

    mouse.down = false;

    bullets = [];

    waveEnemies = [];

    enemiesAlive = 0;

    closeInventory();

    const game =
        document.getElementById(
            "gameScreen"
        );

    const prep =
        document.getElementById(
            "preparationMenu"
        );

    const menu =
        document.getElementById(
            "mainMenu"
        );

    const gameOver =
        document.getElementById(
            "gameOverScreen"
        );

    if (game) {

        game.style.display =
            "none";

    }

    if (prep) {

        prep.style.display =
            "none";

    }

    if (gameOver) {

        gameOver.style.display =
            "none";

    }

    if (menu) {

        menu.style.display =
            "flex";

    }

    showMenuSection("home");

    updateCompleteHUD();

}


// ============================================================
// PREPARAÇÃO
// ============================================================

function enterPreparation() {

    gameRunning = false;

    preparationPhase = true;

    bullets = [];

    waveEnemies = [];

    enemiesAlive = 0;

    const game =
        document.getElementById(
            "gameScreen"
        );

    const prep =
        document.getElementById(
            "preparationMenu"
        );

    const menu =
        document.getElementById(
            "mainMenu"
        );

    if (game) {

        game.style.display =
            "none";

    }

    if (menu) {

        menu.style.display =
            "none";

    }

    if (prep) {

        prep.style.display =
            "flex";

    }

    updateCompleteHUD();

}


// ============================================================
// COMEÇAR ONDA PELA INTERFACE
// ============================================================

function startWaveFromInterface() {

    if (!preparationPhase) {
        return;
    }

    const menu =
        document.getElementById(
            "mainMenu"
        );

    const prep =
        document.getElementById(
            "preparationMenu"
        );

    const game =
        document.getElementById(
            "gameScreen"
        );

    if (menu) {

        menu.style.display =
            "none";

    }

    if (prep) {

        prep.style.display =
            "none";

    }

    if (game) {

        game.style.display =
            "block";

    }

    startWave();

}


// ============================================================
// PULAR PREPARAÇÃO
// ============================================================

function skipPreparationFromInterface() {

    if (!preparationPhase) {
        return;
    }

    startWaveFromInterface();

}


// ============================================================
// BOTÕES DA INTERFACE
// ============================================================

document.addEventListener(
    "click",
    event => {

        if (
            event.target.id ===
            "startWaveBtn"
        ) {

            startWaveFromInterface();

        }

        if (
            event.target.id ===
            "skipPreparationBtn"
        ) {

            skipPreparationFromInterface();

        }

        if (
            event.target.id ===
            "returnMenuBtn"
        ) {

            goToMainMenu();

        }

    }
);


// ============================================================
// ATUALIZAR MENU APÓS COMPRA
// ============================================================

const originalBuyWeapon =
    window.buyWeapon;

if (
    typeof originalBuyWeapon ===
    "function"
) {

    window.buyWeapon =
        function(id) {

            originalBuyWeapon(id);

            updateCompleteHUD();

        };

}


// ============================================================
// ATUALIZAR MENU APÓS COMPRA DE MUNIÇÃO
// ============================================================

const originalBuyAmmo =
    window.buyAmmo;

if (
    typeof originalBuyAmmo ===
    "function"
) {

    window.buyAmmo =
        function(
            id,
            amount = 1
        ) {

            originalBuyAmmo(
                id,
                amount
            );

            updateCompleteHUD();

        };

}


// ============================================================
// ATUALIZAR APÓS EQUIPAR
// ============================================================

const originalEquipWeapon =
    window.equipWeapon;

if (
    typeof originalEquipWeapon ===
    "function"
) {

    window.equipWeapon =
        function(id) {

            originalEquipWeapon(id);

            updateCompleteHUD();

        };

}


// ============================================================
// INICIALIZAÇÃO DA INTERFACE
// ============================================================

function initializeCompleteInterface() {

    createGameInterface();

    updateCompleteHUD();

    openMainMenu();

    const game =
        document.getElementById(
            "gameScreen"
        );

    if (game) {

        game.style.display =
            "none";

    }

    const prep =
        document.getElementById(
            "preparationMenu"
        );

    if (prep) {

        prep.style.display =
            "none";

    }

    const gameOver =
        document.getElementById(
            "gameOverScreen"
        );

    if (gameOver) {

        gameOver.style.display =
            "none";

    }

}


// ============================================================
// INICIAR INTERFACE
// ============================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCompleteInterface
    );

} else {

    initializeCompleteInterface();

}


// ============================================================
// ATUALIZAÇÃO CONTÍNUA DA INTERFACE
// ============================================================

setInterval(
    () => {

        if (
            typeof updateCompleteHUD ===
            "function"
        ) {

            updateCompleteHUD();

        }

    },
    200
);


// ============================================================
// FIM DA PARTE 5
// ============================================================/* =========================================================
   THEY ARE COMING — PARTE 6
   VISUAL COMPLETO / INTERFACE
   ========================================================= */

(function () {

    function injectGameStyles() {

        if (document.getElementById("theyAreComingStyles")) return;

        const style = document.createElement("style");
        style.id = "theyAreComingStyles";

        style.textContent = `

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            background:
                radial-gradient(circle at top, #18231d 0%, #090d0b 45%, #030504 100%);
            color: #f1f5f2;
            font-family: Arial, Helvetica, sans-serif;
            overflow-x: hidden;
        }

        button {
            font-family: inherit;
        }

        /* =========================================
           FUNDO
           ========================================= */

        #mainMenu,
        #preparationMenu,
        #gameOverScreen {
            min-height: 100vh;
            width: 100%;
            position: relative;
        }

        #mainMenu {
            background:
                linear-gradient(
                    rgba(3, 8, 5, .72),
                    rgba(3, 8, 5, .92)
                ),
                radial-gradient(
                    circle at 50% 20%,
                    #263d2e,
                    #070b08 70%
                );
        }

        #mainMenu::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: .12;
            background-image:
                linear-gradient(90deg, transparent 95%, #ffffff 95%),
                linear-gradient(transparent 95%, #ffffff 95%);
            background-size: 40px 40px;
        }

        /* =========================================
           MENU PRINCIPAL
           ========================================= */

        .tac-menu-container {
            position: relative;
            z-index: 2;
            width: min(1250px, 94%);
            margin: auto;
            padding: 35px 0 60px;
        }

        .tac-title {
            text-align: center;
            margin-bottom: 30px;
        }

        .tac-title h1 {
            margin: 0;
            font-size: clamp(38px, 7vw, 76px);
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #e8eee9;
            text-shadow:
                0 0 10px rgba(100,255,150,.15),
                4px 4px 0 #050706;
        }

        .tac-title h1 span {
            color: #77ff9b;
        }

        .tac-title p {
            margin-top: 8px;
            color: #84948a;
            letter-spacing: 3px;
            font-size: 13px;
        }

        /* =========================================
           CARDS DO MENU
           ========================================= */

        #menuHome {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
            gap: 18px;
            margin-top: 35px;
        }

        .tac-menu-card {
            min-height: 150px;
            padding: 25px 18px;
            border: 1px solid #26362c;
            border-radius: 16px;
            background:
                linear-gradient(
                    145deg,
                    rgba(24,38,29,.96),
                    rgba(8,13,10,.96)
                );
            box-shadow:
                0 10px 35px rgba(0,0,0,.35),
                inset 0 1px 0 rgba(255,255,255,.03);
            color: white;
            cursor: pointer;
            transition: .2s ease;
            position: relative;
            overflow: hidden;
        }

        .tac-menu-card::after {
            content: "";
            position: absolute;
            width: 100px;
            height: 100px;
            right: -45px;
            bottom: -45px;
            border-radius: 50%;
            background: rgba(100,255,140,.08);
        }

        .tac-menu-card:hover {
            transform: translateY(-5px);
            border-color: #65d883;
            box-shadow:
                0 15px 45px rgba(0,0,0,.5),
                0 0 25px rgba(80,255,120,.08);
        }

        .tac-menu-card .icon {
            display: block;
            font-size: 42px;
            margin-bottom: 15px;
        }

        .tac-menu-card strong {
            display: block;
            font-size: 18px;
            margin-bottom: 6px;
        }

        .tac-menu-card small {
            color: #829188;
        }

        /* =========================================
           BOTÕES
           ========================================= */

        .tac-btn {
            border: 1px solid #3d5946;
            background: linear-gradient(180deg, #233b2a, #142218);
            color: #e9fff0;
            padding: 12px 20px;
            border-radius: 9px;
            cursor: pointer;
            font-weight: bold;
            transition: .18s ease;
        }

        .tac-btn:hover {
            transform: translateY(-2px);
            border-color: #72e992;
            background: linear-gradient(180deg, #2c5136, #193020);
        }

        .tac-btn.primary {
            background: linear-gradient(180deg, #3ca95c, #1f7139);
            border-color: #76ff99;
            color: white;
        }

        .tac-btn.primary:hover {
            background: linear-gradient(180deg, #4bc96e, #268648);
        }

        .tac-btn.danger {
            background: linear-gradient(180deg, #8c302d, #571b1b);
            border-color: #d85c58;
        }

        /* =========================================
           SUBMENUS
           ========================================= */

        #menuWeapons,
        #menuMelee,
        #menuKits,
        #menuFriends,
        #menuRanking {
            width: min(1150px, 94%);
            margin: 0 auto;
            padding: 25px;
            border: 1px solid #26362c;
            border-radius: 16px;
            background: rgba(7,12,9,.96);
            box-shadow: 0 20px 60px rgba(0,0,0,.5);
        }

        .tac-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }

        .tac-section-header h2 {
            margin: 0;
            font-size: 27px;
        }

        /* =========================================
           CATEGORIAS
           ========================================= */

        #weaponCategories {
            display: flex;
            flex-wrap: wrap;
            gap: 9px;
            margin-bottom: 20px;
        }

        .weapon-category {
            padding: 9px 14px;
            border: 1px solid #304638;
            border-radius: 20px;
            background: #111a14;
            color: #9cab9f;
            cursor: pointer;
        }

        .weapon-category:hover,
        .weapon-category.active {
            color: white;
            border-color: #6ce48a;
            background: #1d3825;
        }

        /* =========================================
           ARMAS
           ========================================= */

        #weaponList,
        #meleeList,
        #kitsList,
        #friendsList {
            display: grid;
            grid-template-columns:
                repeat(auto-fill, minmax(210px, 1fr));
            gap: 15px;
        }

        .weapon-card,
        .melee-card,
        .kit-card,
        .friend-card {
            border: 1px solid #26372d;
            border-radius: 13px;
            padding: 17px;
            background:
                linear-gradient(
                    145deg,
                    #151f18,
                    #090d0a
                );
            transition: .2s;
        }

        .weapon-card:hover,
        .melee-card:hover,
        .kit-card:hover,
        .friend-card:hover {
            border-color: #62d57e;
            transform: translateY(-3px);
        }

        .weapon-icon,
        .melee-icon {
            font-size: 45px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }

        .weapon-card h3,
        .melee-card h3,
        .kit-card h3,
        .friend-card h3 {
            margin: 0 0 8px;
        }

        .weapon-card p,
        .melee-card p,
        .kit-card p,
        .friend-card p {
            color: #8e9e93;
            font-size: 13px;
            line-height: 1.45;
        }

        .weapon-price {
            color: #ffe07b;
            font-weight: bold;
            margin: 12px 0;
        }

        .weapon-ammo {
            color: #7bdcff;
            font-size: 13px;
            margin: 7px 0;
        }

        /* =========================================
           PREPARAÇÃO
           ========================================= */

        #preparationMenu {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 30px;
            background:
                radial-gradient(circle, #203427 0%, #060907 70%);
        }

        .preparation-box {
            width: min(900px, 95%);
            padding: 35px;
            border: 1px solid #3b5844;
            border-radius: 20px;
            background: rgba(8,14,10,.96);
            box-shadow: 0 25px 80px rgba(0,0,0,.65);
            text-align: center;
        }

        .preparation-box h2 {
            font-size: 38px;
            margin: 0 0 8px;
        }

        .wave-info {
            color: #7eea99;
            font-size: 18px;
            margin-bottom: 25px;
        }

        .preparation-actions {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 25px;
        }

        /* =========================================
           GAME SCREEN
           ========================================= */

        #gameScreen {
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background: #020302;
        }

        #gameCanvas {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            display: block;
            background: #050805;
        }

        /* =========================================
           HUD
           ========================================= */

        #gameHUD,
        #hud,
        .game-hud {
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            z-index: 20;
            pointer-events: none;
        }

        .hud-panel {
            display: inline-flex;
            align-items: center;
            gap: 14px;
            padding: 10px 15px;
            border-radius: 10px;
            border: 1px solid rgba(120,160,130,.25);
            background: rgba(4,8,5,.82);
            backdrop-filter: blur(8px);
        }

        .health-container {
            min-width: 210px;
        }

        .health-bar-bg {
            height: 14px;
            width: 100%;
            border-radius: 20px;
            background: #25100f;
            overflow: hidden;
            border: 1px solid #512522;
        }

        .health-bar {
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg,#35c864,#7dff9d);
            transition: width .2s;
        }

        .ammo-display {
            margin-left: auto;
            text-align: right;
            font-size: 28px;
            font-weight: bold;
        }

        .ammo-display small {
            display: block;
            font-size: 11px;
            color: #839086;
        }

        /* =========================================
           INVENTÁRIO
           ========================================= */

        #inventoryPanel {
            position: fixed;
            top: 0;
            right: 0;
            width: min(390px, 92vw);
            height: 100vh;
            z-index: 100;
            padding: 25px;
            background:
                linear-gradient(
                    145deg,
                    rgba(14,23,17,.99),
                    rgba(4,8,5,.99)
                );
            border-left: 1px solid #3a5542;
            box-shadow: -20px 0 70px rgba(0,0,0,.65);
            overflow-y: auto;
        }

        .inventory-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .inventory-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            margin-bottom: 8px;
            border-radius: 9px;
            background: #101810;
            border: 1px solid #223326;
        }

        /* =========================================
           RANKING
           ========================================= */

        .ranking-table {
            width: 100%;
            border-collapse: collapse;
        }

        .ranking-table th,
        .ranking-table td {
            padding: 13px 10px;
            text-align: left;
            border-bottom: 1px solid #223127;
        }

        .ranking-table th {
            color: #76e895;
            font-size: 13px;
            text-transform: uppercase;
        }

        .ranking-table td {
            color: #dbe4dd;
        }

        .ranking-position {
            font-weight: bold;
            color: #ffe080;
        }

        .ranking-score {
            color: #72ff9a;
            font-weight: bold;
        }

        /* =========================================
           AMIGOS
           ========================================= */

        .friend-online {
            color: #67ef8a;
        }

        .friend-offline {
            color: #778078;
        }

        /* =========================================
           GAME OVER
           ========================================= */

        #gameOverScreen {
            position: fixed;
            inset: 0;
            z-index: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
                radial-gradient(
                    circle,
                    rgba(75,15,15,.78),
                    rgba(3,4,3,.98) 70%
                );
        }

        .game-over-box {
            width: min(600px, 92%);
            text-align: center;
            padding: 40px;
            border: 1px solid #693b3b;
            border-radius: 20px;
            background: rgba(13,8,8,.97);
            box-shadow: 0 25px 90px rgba(0,0,0,.75);
        }

        .game-over-box h1 {
            margin: 0;
            font-size: 55px;
            color: #ff6d68;
            text-transform: uppercase;
            letter-spacing: 4px;
        }

        .final-score {
            font-size: 28px;
            margin: 20px 0;
            color: #fff;
        }

        /* =========================================
           MENSAGENS
           ========================================= */

        #gameMessage {
            position: fixed;
            left: 50%;
            top: 18%;
            transform: translateX(-50%);
            z-index: 300;
            padding: 13px 25px;
            border-radius: 10px;
            background: rgba(5,9,6,.92);
            border: 1px solid #4d7659;
            color: white;
            box-shadow: 0 10px 35px rgba(0,0,0,.5);
            pointer-events: none;
            animation: tacMessage .25s ease;
        }

        @keyframes tacMessage {
            from {
                opacity: 0;
                transform: translate(-50%, -10px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }

        /* =========================================
           EFEITO DE DANO
           ========================================= */

        body.tac-damaged::after {
            content: "";
            position: fixed;
            inset: 0;
            z-index: 999;
            pointer-events: none;
            background: rgba(255,0,0,.18);
            animation: damageFlash .25s ease;
        }

        @keyframes damageFlash {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        /* =========================================
           RESPONSIVO
           ========================================= */

        @media (max-width: 700px) {

            .tac-menu-container {
                padding-top: 20px;
            }

            .tac-title h1 {
                letter-spacing: 2px;
            }

            #menuWeapons,
            #menuMelee,
            #menuKits,
            #menuFriends,
            #menuRanking {
                padding: 15px;
            }

            .preparation-box {
                padding: 25px 18px;
            }

            .preparation-box h2 {
                font-size: 28px;
            }

            .health-container {
                min-width: 140px;
            }

            .ammo-display {
                font-size: 21px;
            }
        }

        `;

        document.head.appendChild(style);
    }


    /* =========================================
       EFEITO DE DANO
       ========================================= */

    window.tacDamageEffect = function () {

        document.body.classList.remove("tac-damaged");

        void document.body.offsetWidth;

        document.body.classList.add("tac-damaged");

        setTimeout(() => {
            document.body.classList.remove("tac-damaged");
        }, 300);
    };


    /* =========================================
       CROSSHAIR
       ========================================= */

    function createCrosshair() {

        if (document.getElementById("tacCrosshair")) return;

        const crosshair = document.createElement("div");

        crosshair.id = "tacCrosshair";

        crosshair.innerHTML = `
            <div class="crosshair-dot"></div>
            <div class="crosshair-line top"></div>
            <div class="crosshair-line bottom"></div>
            <div class="crosshair-line left"></div>
            <div class="crosshair-line right"></div>
        `;

        document.body.appendChild(crosshair);

        const style = document.createElement("style");

        style.textContent = `

            #tacCrosshair {
                position: fixed;
                left: 50%;
                top: 50%;
                width: 30px;
                height: 30px;
                transform: translate(-50%, -50%);
                pointer-events: none;
                z-index: 200;
            }

            .crosshair-dot {
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: white;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 5px black;
            }

            .crosshair-line {
                position: absolute;
                background: rgba(255,255,255,.85);
                box-shadow: 0 0 3px black;
            }

            .crosshair-line.top,
            .crosshair-line.bottom {
                width: 2px;
                height: 8px;
                left: 14px;
            }

            .crosshair-line.top {
                top: 0;
            }

            .crosshair-line.bottom {
                bottom: 0;
            }

            .crosshair-line.left,
            .crosshair-line.right {
                width: 8px;
                height: 2px;
                top: 14px;
            }

            .crosshair-line.left {
                left: 0;
            }

            .crosshair-line.right {
                right: 0;
            }

        `;

        document.head.appendChild(style);
    }


    /* =========================================
       MOEDA / DINHEIRO
       ========================================= */

    window.updateMoneyDisplay = function () {

        let moneyElements =
            document.querySelectorAll(".money-display");

        moneyElements.forEach(el => {

            const money =
                typeof inventory !== "undefined"
                    ? inventory.money || 0
                    : 0;

            el.textContent =
                "$ " + money.toLocaleString("pt-BR");

        });
    };


    /* =========================================
       ATUALIZAÇÃO VISUAL DA HUD
       ========================================= */

    window.updateVisualHUD = function () {

        try {

            if (typeof updateHUD === "function") {
                updateHUD();
            }

            if (typeof updateCompleteHUD === "function") {
                updateCompleteHUD();
            }

            updateMoneyDisplay();

        } catch (error) {

            console.warn(
                "HUD visual:",
                error
            );

        }
    };


    /* =========================================
       ADICIONA DINHEIRO
       ========================================= */

    window.addMoney = function (amount) {

        if (typeof inventory === "undefined") return;

        inventory.money =
            (inventory.money || 0) + amount;

        updateMoneyDisplay();

        if (typeof updateInventory === "function") {
            updateInventory();
        }

    };


    /* =========================================
       EFEITO DE COMPRA
       ========================================= */

    window.tacPurchaseEffect = function (element) {

        if (!element) return;

        element.style.transform = "scale(.94)";

        setTimeout(() => {
            element.style.transform = "";
        }, 120);

    };


    /* =========================================
       SOM VISUAL DE CLIQUE
       ========================================= */

    document.addEventListener("click", function (event) {

        const button =
            event.target.closest("button");

        if (!button) return;

        button.classList.add("tac-click");

        setTimeout(() => {
            button.classList.remove("tac-click");
        }, 120);

    });


    /* =========================================
       ESTILO DO CLIQUE
       ========================================= */

    function addClickStyle() {

        if (document.getElementById("tacClickStyle")) return;

        const style = document.createElement("style");

        style.id = "tacClickStyle";

        style.textContent = `

            .tac-click {
                transform: scale(.96) !important;
            }

        `;

        document.head.appendChild(style);
    }


    /* =========================================
       TECLADO — INVENTÁRIO
       ========================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key.toLowerCase() !== "i") {
            return;
        }

        const panel =
            document.getElementById("inventoryPanel");

        if (!panel) return;

        const hidden =
            panel.style.display === "none" ||
            getComputedStyle(panel).display === "none";

        panel.style.display =
            hidden ? "block" : "none";

    });


    /* =========================================
       ESC
       ========================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") return;

        const panel =
            document.getElementById("inventoryPanel");

        if (panel) {
            panel.style.display = "none";
        }

    });


    /* =========================================
       RESPONSIVIDADE DO CANVAS
       ========================================= */

    function resizeGameCanvas() {

        const canvas =
            document.getElementById("gameCanvas");

        if (!canvas) return;

        const rect =
            canvas.getBoundingClientRect();

        if (
            canvas.width !== Math.floor(rect.width) ||
            canvas.height !== Math.floor(rect.height)
        ) {

            canvas.width =
                Math.floor(rect.width);

            canvas.height =
                Math.floor(rect.height);

        }

    }


    window.addEventListener(
        "resize",
        resizeGameCanvas
    );


    /* =========================================
       INICIALIZAÇÃO
       ========================================= */

    function initializePart6() {

        injectGameStyles();

        addClickStyle();

        createCrosshair();

        resizeGameCanvas();

        setTimeout(() => {

            updateVisualHUD();

            updateMoneyDisplay();

        }, 300);

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializePart6
        );

    } else {

        initializePart6();

    }

})();/* =========================================================
   THEY ARE COMING
   PARTE 7 — EFEITOS DE GAMEPLAY
   ========================================================= */

(function () {

    /* =====================================================
       SISTEMA DE EFEITOS
       ===================================================== */

    window.TAC_EFFECTS = [];

    function createEffect(x, y, type, options = {}) {

        TAC_EFFECTS.push({
            x: x,
            y: y,
            type: type,
            life: options.life || 400,
            maxLife: options.life || 400,
            size: options.size || 10,
            damage: options.damage || 0,
            angle: options.angle || 0,
            speed: options.speed || 0,
            vx: options.vx || 0,
            vy: options.vy || 0
        });

    }


    /* =====================================================
       PARTÍCULAS
       ===================================================== */

    window.createParticles = function (
        x,
        y,
        amount = 10,
        type = "blood"
    ) {

        for (let i = 0; i < amount; i++) {

            const angle =
                Math.random() * Math.PI * 2;

            const speed =
                30 + Math.random() * 130;

            createEffect(
                x,
                y,
                type,
                {
                    life: 250 + Math.random() * 500,
                    size: 2 + Math.random() * 4,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed
                }
            );

        }

    };


    /* =====================================================
       MUZZLE FLASH
       ===================================================== */

    window.createMuzzleFlash = function (
        x,
        y,
        angle = 0,
        weaponType = "pistol"
    ) {

        createEffect(
            x,
            y,
            "muzzle",
            {
                life: 80,
                size:
                    weaponType === "rpg"
                        ? 35
                        : weaponType === "shotgun"
                            ? 25
                            : 15,
                angle: angle
            }
        );

    };


    /* =====================================================
       EXPLOSÃO
       ===================================================== */

    window.createExplosionEffect = function (
        x,
        y,
        size = 70
    ) {

        createEffect(
            x,
            y,
            "explosion",
            {
                life: 600,
                size: size
            }
        );

        createParticles(
            x,
            y,
            30,
            "fire"
        );

        createParticles(
            x,
            y,
            20,
            "smoke"
        );

    };


    /* =====================================================
       HIT MARKER
       ===================================================== */

    window.createHitMarker = function (
        x,
        y,
        critical = false
    ) {

        createEffect(
            x,
            y,
            critical
                ? "critical"
                : "hit",
            {
                life: 250,
                size: critical ? 18 : 12
            }
        );

    };


    /* =====================================================
       EFEITO DE MORTE
       ===================================================== */

    window.createZombieDeathEffect = function (
        enemy
    ) {

        if (!enemy) return;

        createParticles(
            enemy.x,
            enemy.y,
            enemy.type === "tank" ? 35 : 18,
            "blood"
        );

        createParticles(
            enemy.x,
            enemy.y,
            10,
            "smoke"
        );

        createEffect(
            enemy.x,
            enemy.y,
            "death",
            {
                life: 450,
                size:
                    enemy.type === "tank"
                        ? 45
                        : 25
            }
        );

    };


    /* =====================================================
       DESENHAR EFEITOS
       ===================================================== */

    window.drawTACEffects = function () {

        if (
            typeof ctx === "undefined" ||
            typeof canvas === "undefined"
        ) {
            return;
        }

        const now =
            performance.now();

        for (
            let i = TAC_EFFECTS.length - 1;
            i >= 0;
            i--
        ) {

            const effect =
                TAC_EFFECTS[i];

            effect.life -= 16;

            const progress =
                Math.max(
                    0,
                    effect.life / effect.maxLife
                );

            effect.x +=
                effect.vx * 0.016;

            effect.y +=
                effect.vy * 0.016;

            effect.vy +=
                80 * 0.016;

            if (effect.life <= 0) {

                TAC_EFFECTS.splice(i, 1);

                continue;
            }

            ctx.save();

            switch (effect.type) {

                /* -----------------------------------------
                   SANGUE
                   ----------------------------------------- */

                case "blood":

                    ctx.globalAlpha =
                        progress;

                    ctx.fillStyle =
                        "#a71919";

                    ctx.beginPath();

                    ctx.arc(
                        effect.x,
                        effect.y,
                        effect.size,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                    break;


                /* -----------------------------------------
                   FOGO
                   ----------------------------------------- */

                case "fire":

                    ctx.globalAlpha =
                        progress;

                    ctx.fillStyle =
                        "#ff7a00";

                    ctx.beginPath();

                    ctx.arc(
                        effect.x,
                        effect.y,
                        effect.size * progress,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                    break;


                /* -----------------------------------------
                   FUMAÇA
                   ----------------------------------------- */

                case "smoke":

                    ctx.globalAlpha =
                        progress * 0.5;

                    ctx.fillStyle =
                        "#555";

                    ctx.beginPath();

                    ctx.arc(
                        effect.x,
                        effect.y,
                        effect.size * 2,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                    break;


                /* -----------------------------------------
                   MUZZLE FLASH
                   ----------------------------------------- */

                case "muzzle":

                    ctx.globalAlpha =
                        progress;

                    ctx.translate(
                        effect.x,
                        effect.y
                    );

                    ctx.rotate(
                        effect.angle
                    );

                    const gradient =
                        ctx.createRadialGradient(
                            0,
                            0,
                            2,
                            0,
                            0,
                            effect.size * 2
                        );

                    gradient.addColorStop(
                        0,
                        "#ffffff"
                    );

                    gradient.addColorStop(
                        .25,
                        "#fff5a0"
                    );

                    gradient.addColorStop(
                        1,
                        "rgba(255,120,0,0)"
                    );

                    ctx.fillStyle =
                        gradient;

                    ctx.beginPath();

                    ctx.moveTo(
                        effect.size * 2,
                        0
                    );

                    ctx.lineTo(
                        -effect.size,
                        -effect.size * .7
                    );

                    ctx.lineTo(
                        -effect.size * .6,
                        0
                    );

                    ctx.lineTo(
                        -effect.size,
                        effect.size * .7
                    );

                    ctx.closePath();

                    ctx.fill();

                    break;


                /* -----------------------------------------
                   EXPLOSÃO
                   ----------------------------------------- */

                case "explosion":

                    ctx.globalAlpha =
                        progress;

                    const explosionSize =
                        effect.size *
                        (1 - progress * .35);

                    const explosionGradient =
                        ctx.createRadialGradient(
                            effect.x,
                            effect.y,
                            0,
                            effect.x,
                            effect.y,
                            explosionSize
                        );

                    explosionGradient.addColorStop(
                        0,
                        "#fff7b0"
                    );

                    explosionGradient.addColorStop(
                        .25,
                        "#ffb52e"
                    );

                    explosionGradient.addColorStop(
                        .55,
                        "#ff4b18"
                    );

                    explosionGradient.addColorStop(
                        1,
                        "rgba(100,0,0,0)"
                    );

                    ctx.fillStyle =
                        explosionGradient;

                    ctx.beginPath();

                    ctx.arc(
                        effect.x,
                        effect.y,
                        explosionSize,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();

                    break;


                /* -----------------------------------------
                   HIT
                   ----------------------------------------- */

                case "hit":

                    ctx.globalAlpha =
                        progress;

                    ctx.strokeStyle =
                        "#ffffff";

                    ctx.lineWidth = 2;

                    ctx.beginPath();

                    ctx.moveTo(
                        effect.x - effect.size,
                        effect.y - effect.size
                    );

                    ctx.lineTo(
                        effect.x + effect.size,
                        effect.y + effect.size
                    );

                    ctx.moveTo(
                        effect.x + effect.size,
                        effect.y - effect.size
                    );

                    ctx.lineTo(
                        effect.x - effect.size,
                        effect.y + effect.size
                    );

                    ctx.stroke();

                    break;


                /* -----------------------------------------
                   CRÍTICO
                   ----------------------------------------- */

                case "critical":

                    ctx.globalAlpha =
                        progress;

                    ctx.strokeStyle =
                        "#ffe600";

                    ctx.lineWidth = 3;

                    ctx.beginPath();

                    ctx.arc(
                        effect.x,
                        effect.y,
                        effect.size *
                            (1.5 - progress),
                        0,
                        Math.PI * 2
                    );

                    ctx.stroke();

                    break;


                /* -----------------------------------------
                   MORTE
                   ----------------------------------------- */

                case "death":

                    ctx.globalAlpha =
                        progress * .7;

                    ctx.strokeStyle =
                        "#ff3030";

                    ctx.lineWidth = 4;

                    ctx.beginPath();

                    ctx.arc(
                        effect.x,
                        effect.y,
                        effect.size *
                            (1 + (1 - progress)),
                        0,
                        Math.PI * 2
                    );

                    ctx.stroke();

                    break;

            }

            ctx.restore();

        }

    };


    /* =====================================================
       TIPOS VISUAIS DAS ARMAS
       ===================================================== */

    window.TAC_WEAPON_VISUALS = {

        pistol: {
            color: "#cccccc",
            size: 13,
            recoil: 4,
            muzzle: 13
        },

        revolver: {
            color: "#b8a27b",
            size: 15,
            recoil: 6,
            muzzle: 16
        },

        desert_eagle: {
            color: "#d8d8d8",
            size: 17,
            recoil: 8,
            muzzle: 19
        },

        machine_pistol: {
            color: "#888888",
            size: 14,
            recoil: 3,
            muzzle: 14
        },

        smg: {
            color: "#555555",
            size: 19,
            recoil: 3,
            muzzle: 15
        },

        mp5: {
            color: "#414141",
            size: 21,
            recoil: 3,
            muzzle: 16
        },

        vector: {
            color: "#333333",
            size: 20,
            recoil: 2,
            muzzle: 16
        },

        p90: {
            color: "#626262",
            size: 22,
            recoil: 2,
            muzzle: 17
        },

        shotgun: {
            color: "#74472e",
            size: 25,
            recoil: 12,
            muzzle: 25
        },

        double_barrel: {
            color: "#633b28",
            size: 27,
            recoil: 15,
            muzzle: 28
        },

        combat_shotgun: {
            color: "#3f3f3f",
            size: 27,
            recoil: 10,
            muzzle: 25
        },

        rifle: {
            color: "#53604d",
            size: 25,
            recoil: 5,
            muzzle: 18
        },

        ak47: {
            color: "#684b31",
            size: 27,
            recoil: 7,
            muzzle: 19
        },

        m4: {
            color: "#4a524a",
            size: 28,
            recoil: 4,
            muzzle: 19
        },

        famas: {
            color: "#4e554c",
            size: 26,
            recoil: 4,
            muzzle: 18
        },

        g36: {
            color: "#303832",
            size: 28,
            recoil: 4,
            muzzle: 18
        },

        sniper: {
            color: "#384437",
            size: 35,
            recoil: 18,
            muzzle: 25
        },

        marksman: {
            color: "#4c574a",
            size: 32,
            recoil: 12,
            muzzle: 23
        },

        heavy_sniper: {
            color: "#252b28",
            size: 42,
            recoil: 25,
            muzzle: 32
        },

        minigun: {
            color: "#454b49",
            size: 34,
            recoil: 2,
            muzzle: 20
        },

        rpg: {
            color: "#59634d",
            size: 42,
            recoil: 20,
            muzzle: 38
        },

        grenade_launcher: {
            color: "#4e5548",
            size: 35,
            recoil: 14,
            muzzle: 30
        },

        laser: {
            color: "#37e7ff",
            size: 30,
            recoil: 1,
            muzzle: 15
        },

        plasma: {
            color: "#b55cff",
            size: 30,
            recoil: 2,
            muzzle: 22
        },

        railgun: {
            color: "#6fffff",
            size: 44,
            recoil: 18,
            muzzle: 35
        }

    };


    /* =====================================================
       VISUAL DA ARMA DO JOGADOR
       ===================================================== */

    window.drawPlayerWeapon = function () {

        if (
            typeof ctx === "undefined" ||
            typeof canvas === "undefined" ||
            typeof player === "undefined"
        ) {
            return;
        }

        if (
            typeof getCurrentWeapon !== "function"
        ) {
            return;
        }

        const weapon =
            getCurrentWeapon();

        if (!weapon) return;

        const weaponId =
            weapon.id ||
            weapon.name ||
            "pistol";

        const visual =
            TAC_WEAPON_VISUALS[weaponId] ||
            TAC_WEAPON_VISUALS.pistol;

        const centerX =
            canvas.width / 2;

        const centerY =
            canvas.height / 2;

        let angle = 0;

        if (
            typeof mouse !== "undefined" &&
            mouse
        ) {

            angle =
                Math.atan2(
                    mouse.y - centerY,
                    mouse.x - centerX
                );

        }

        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );

        ctx.rotate(angle);

        /* braço */

        ctx.fillStyle = "#b98b72";

        ctx.beginPath();

        ctx.roundRect(
            4,
            4,
            48,
            14,
            7
        );

        ctx.fill();

        /* arma */

        ctx.fillStyle =
            visual.color;

        ctx.fillRect(
            20,
            -6,
            visual.size,
            12
        );

        /* cabo */

        ctx.fillRect(
            10,
            2,
            13,
            18
        );

        /* cano */

        ctx.fillRect(
            20 + visual.size - 2,
            -3,
            8,
            6
        );

        /* armas grandes */

        if (
            weaponId === "rpg" ||
            weaponId === "heavy_sniper" ||
            weaponId === "railgun"
        ) {

            ctx.fillRect(
                25,
                -10,
                visual.size + 18,
                20
            );

        }

        /* laser */

        if (weaponId === "laser") {

            ctx.fillStyle =
                "#5ff5ff";

            ctx.fillRect(
                20,
                -2,
                visual.size + 15,
                4
            );

        }

        /* plasma */

        if (weaponId === "plasma") {

            ctx.fillStyle =
                "#c875ff";

            ctx.beginPath();

            ctx.arc(
                45,
                0,
                7,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        ctx.restore();

    };


    /* =====================================================
       ATUALIZAR EFEITOS
       ===================================================== */

    window.updateTACEffects = function () {

        for (
            let i = TAC_EFFECTS.length - 1;
            i >= 0;
            i--
        ) {

            TAC_EFFECTS[i].life -= 16;

            if (
                TAC_EFFECTS[i].life <= 0
            ) {

                TAC_EFFECTS.splice(i, 1);

            }

        }

    };


    /* =====================================================
       ANIMAÇÃO DOS EFEITOS
       ===================================================== */

    function effectsLoop() {

        if (
            typeof gameRunning !== "undefined" &&
            gameRunning
        ) {

            updateTACEffects();

        }

        requestAnimationFrame(
            effectsLoop
        );

    }


    /* =====================================================
       INTEGRAR COM O LOOP EXISTENTE
       ===================================================== */

    const originalRequestAnimationFrame =
        window.requestAnimationFrame;


    /* =====================================================
       EFEITO AO CLICAR
       ===================================================== */

    document.addEventListener(
        "mousedown",
        function () {

            if (
                typeof gameRunning !== "undefined" &&
                gameRunning
            ) {

                const weapon =
                    typeof getCurrentWeapon === "function"
                        ? getCurrentWeapon()
                        : null;

                if (!weapon) return;

                const weaponId =
                    weapon.id ||
                    weapon.name ||
                    "pistol";

                const visual =
                    TAC_WEAPON_VISUALS[weaponId] ||
                    TAC_WEAPON_VISUALS.pistol;

                if (
                    typeof player !== "undefined" &&
                    typeof mouse !== "undefined"
                ) {

                    const angle =
                        Math.atan2(
                            mouse.y - player.y,
                            mouse.x - player.x
                        );

                    createMuzzleFlash(
                        player.x,
                        player.y,
                        angle,
                        weaponId
                    );

                }

            }

        }
    );


    /* =====================================================
       EFEITO QUANDO O JOGADOR LEVA DANO
       ===================================================== */

    window.tacPlayerDamageEffect = function () {

        if (
            typeof tacDamageEffect === "function"
        ) {

            tacDamageEffect();

        }

        createParticles(
            typeof player !== "undefined"
                ? player.x
                : 0,
            typeof player !== "undefined"
                ? player.y
                : 0,
            5,
            "blood"
        );

    };


    /* =====================================================
       INDICADOR DE MORTE
       ===================================================== */

    window.tacKillMessage = function (
        enemyType
    ) {

        const message =
            document.getElementById(
                "gameMessage"
            );

        if (!message) return;

        let text =
            "Zumbi eliminado!";

        if (enemyType === "runner") {
            text = "Corredor eliminado!";
        }

        if (enemyType === "tank") {
            text = "TANQUE eliminado!";
        }

        if (enemyType === "brute") {
            text = "BRUTO eliminado!";
        }

        message.textContent =
            text;

        message.style.display =
            "block";

        clearTimeout(
            window.tacMessageTimeout
        );

        window.tacMessageTimeout =
            setTimeout(() => {

                message.style.display =
                    "none";

            }, 500);

    };


    /* =====================================================
       EFEITO DE ONDA
       ===================================================== */

    window.tacWaveStartEffect = function (
        wave
    ) {

        const message =
            document.getElementById(
                "gameMessage"
            );

        if (!message) return;

        message.innerHTML = `
            <strong>
                ONDA ${wave}
            </strong>
            <br>
            <small>
                ELES ESTÃO CHEGANDO
            </small>
        `;

        message.style.display =
            "block";

        message.style.fontSize =
            "24px";

        setTimeout(() => {

            message.style.display =
                "none";

            message.style.fontSize =
                "";

        }, 1800);

    };


    /* =====================================================
       EFEITO DE FIM DA ONDA
       ===================================================== */

    window.tacWaveCompleteEffect = function (
        wave
    ) {

        const message =
            document.getElementById(
                "gameMessage"
            );

        if (!message) return;

        message.innerHTML = `
            <strong>
                ONDA ${wave} CONCLUÍDA
            </strong>
            <br>
            <small>
                PREPARE-SE PARA A PRÓXIMA
            </small>
        `;

        message.style.display =
            "block";

        setTimeout(() => {

            message.style.display =
                "none";

        }, 1600);

    };


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    function initializePart7() {

        if (
            typeof effectsLoop === "function"
        ) {

            effectsLoop();

        }

        console.log(
            "They Are Coming — Parte 7 carregada."
        );

    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePart7
        );

    } else {

        initializePart7();

    }

})();/* =========================================================
   THEY ARE COMING
   PARTE 8 — INTEGRAÇÃO E CORREÇÕES GERAIS
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       ESTADO CENTRAL
       ===================================================== */

    window.TAC = window.TAC || {};

    TAC.menu = true;
    TAC.waveActive = false;
    TAC.preparation = false;
    TAC.score = 0;
    TAC.kills = 0;
    TAC.playerName =
        localStorage.getItem("tac_player_name") || "";

    TAC.currentWave = 0;
    TAC.maxWaves = 100;

    TAC.lastWaveCompleted = 0;

    /* =====================================================
       FUNÇÃO AUXILIAR
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    function show(id) {

        const el = $(id);

        if (!el) return;

        el.style.display = "";

    }


    function hide(id) {

        const el = $(id);

        if (!el) return;

        el.style.display = "none";

    }


    /* =====================================================
       NOME DO JOGADOR
       ===================================================== */

    function requestPlayerName() {

        let name =
            localStorage.getItem("tac_player_name");

        if (!name) {

            name = prompt(
                "Digite seu nome para começar:"
            );

        }

        if (!name) {

            name = "Jogador";

        }

        name =
            String(name)
                .trim()
                .substring(0, 20);

        if (!name) {
            name = "Jogador";
        }

        localStorage.setItem(
            "tac_player_name",
            name
        );

        TAC.playerName = name;

        return name;

    }


    window.changePlayerName = function () {

        const name = prompt(
            "Digite seu novo nome:",
            TAC.playerName || "Jogador"
        );

        if (!name) return;

        const clean =
            name.trim().substring(0, 20);

        if (!clean) return;

        TAC.playerName = clean;

        localStorage.setItem(
            "tac_player_name",
            clean
        );

        showMessage(
            "Nome alterado para " + clean
        );

    };


    /* =====================================================
       MENSAGEM
       ===================================================== */

    function showMessage(text, time = 1800) {

        const message =
            $("gameMessage");

        if (!message) return;

        message.textContent = text;

        message.style.display = "block";

        clearTimeout(
            TAC.messageTimer
        );

        TAC.messageTimer =
            setTimeout(() => {

                message.style.display =
                    "none";

            }, time);

    }

    window.TACShowMessage =
        showMessage;


    /* =====================================================
       VOLTAR PARA O MENU
       ===================================================== */

    window.TACReturnToMenu = function () {

        TAC.waveActive = false;
        TAC.preparation = false;
        TAC.menu = true;

        window.gameRunning = false;

        hide("gameScreen");
        hide("preparationMenu");
        hide("gameOverScreen");

        show("mainMenu");

        try {

            if (
                typeof openMainMenu ===
                "function"
            ) {

                openMainMenu();

            }

        } catch (error) {

            console.warn(
                "Erro ao abrir menu:",
                error
            );

        }

    };


    /* =====================================================
       ENTRAR NA PREPARAÇÃO
       ===================================================== */

    window.TACEnterPreparation = function () {

        TAC.menu = false;
        TAC.preparation = true;
        TAC.waveActive = false;

        window.gameRunning = false;

        hide("mainMenu");
        hide("gameScreen");
        hide("gameOverScreen");

        show("preparationMenu");

        updatePreparationData();

    };


    /* =====================================================
       INFORMAÇÕES DA PREPARAÇÃO
       ===================================================== */

    function updatePreparationData() {

        const menu =
            $("preparationMenu");

        if (!menu) return;

        let wave =
            TAC.currentWave + 1;

        if (wave < 1) {
            wave = 1;
        }

        const old =
            menu.querySelector(
                ".tac-preparation-info"
            );

        if (old) {
            old.remove();
        }

        const info =
            document.createElement("div");

        info.className =
            "tac-preparation-info";

        info.innerHTML = `
            <div style="
                margin:20px auto;
                max-width:650px;
                padding:20px;
                border:1px solid #304737;
                border-radius:14px;
                background:#0c140e;
            ">

                <div style="
                    font-size:28px;
                    font-weight:bold;
                    color:#72ed91;
                ">
                    Onda ${wave}
                </div>

                <div style="
                    margin-top:8px;
                    color:#8e9b92;
                ">
                    Jogador:
                    <strong style="color:white">
                        ${escapeHTML(TAC.playerName)}
                    </strong>
                </div>

                <div style="
                    margin-top:8px;
                    color:#8e9b92;
                ">
                    Abates:
                    <strong style="color:white">
                        ${TAC.kills}
                    </strong>
                </div>

                <div style="
                    margin-top:5px;
                    color:#8e9b92;
                ">
                    Pontuação:
                    <strong style="color:#ffe27a">
                        ${TAC.score}
                    </strong>
                </div>

            </div>
        `;

        menu.prepend(info);

    }


    /* =====================================================
       ESCAPAR HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       INICIAR ONDA
       ===================================================== */

    window.TACStartWave = function () {

        if (TAC.waveActive) {
            return;
        }

        requestPlayerName();

        TAC.currentWave++;

        TAC.waveActive = true;
        TAC.preparation = false;
        TAC.menu = false;

        hide("mainMenu");
        hide("preparationMenu");
        hide("gameOverScreen");

        show("gameScreen");

        window.gameRunning = true;

        /* -----------------------------------------------
           CRIAR ONDA
           ----------------------------------------------- */

        try {

            if (
                typeof createWave ===
                "function"
            ) {

                createWave(
                    TAC.currentWave
                );

            }

        } catch (error) {

            console.warn(
                "Erro ao criar onda:",
                error
            );

        }

        try {

            if (
                typeof startWave ===
                "function" &&
                !TAC._callingOriginalStart
            ) {

                /*
                 * A Parte 3 já possui seu
                 * próprio sistema de início.
                 *
                 * Não chamamos novamente
                 * para evitar duplicação.
                 */

            }

        } catch (error) {

            console.warn(error);

        }

        if (
            typeof tacWaveStartEffect ===
            "function"
        ) {

            tacWaveStartEffect(
                TAC.currentWave
            );

        }

        showMessage(
            "ONDA " +
            TAC.currentWave +
            " — ELES ESTÃO CHEGANDO!",
            2200
        );

        updateGameInformation();

    };


    /* =====================================================
       PULAR PREPARAÇÃO
       ===================================================== */

    window.TACSkipPreparation = function () {

        if (!TAC.preparation) {
            return;
        }

        TACStartWave();

    };


    /* =====================================================
       FINALIZAR ONDA
       ===================================================== */

    window.TACFinishWave = function () {

        if (!TAC.waveActive) {
            return;
        }

        TAC.waveActive = false;
        TAC.preparation = false;

        window.gameRunning = false;

        TAC.lastWaveCompleted =
            TAC.currentWave;

        /* -----------------------------------------------
           RECOMPENSA
           ----------------------------------------------- */

        const reward =
            100 +
            (TAC.currentWave * 50);

        if (
            typeof addMoney ===
            "function"
        ) {

            addMoney(reward);

        } else if (
            typeof inventory !==
            "undefined"
        ) {

            inventory.money =
                (inventory.money || 0)
                + reward;

        }

        TAC.score +=
            reward;

        if (
            typeof tacWaveCompleteEffect ===
            "function"
        ) {

            tacWaveCompleteEffect(
                TAC.currentWave
            );

        }

        showMessage(
            "Onda concluída! +" +
            reward +
            " moedas",
            2200
        );

        /* -----------------------------------------------
           VOLTA PARA PREPARAÇÃO
           ----------------------------------------------- */

        setTimeout(() => {

            TACEnterPreparation();

        }, 2200);

    };


    /* =====================================================
       ATUALIZAÇÃO DE INFORMAÇÕES
       ===================================================== */

    function updateGameInformation() {

        const waveElements =
            document.querySelectorAll(
                ".wave-number"
            );

        waveElements.forEach(
            element => {

                element.textContent =
                    TAC.currentWave;

            }
        );

        const scoreElements =
            document.querySelectorAll(
                ".score-display"
            );

        scoreElements.forEach(
            element => {

                element.textContent =
                    TAC.score;

            }
        );

        const killElements =
            document.querySelectorAll(
                ".kills-display"
            );

        killElements.forEach(
            element => {

                element.textContent =
                    TAC.kills;

            }
        );

    }


    /* =====================================================
       REGISTRAR ABATE
       ===================================================== */

    window.TACRegisterKill = function (
        enemy
    ) {

        TAC.kills++;

        let points = 10;

        if (!enemy) {
            points = 10;
        }
        else if (
            enemy.type === "runner"
        ) {

            points = 15;

        }
        else if (
            enemy.type === "brute"
        ) {

            points = 35;

        }
        else if (
            enemy.type === "tank"
        ) {

            points = 100;

        }

        TAC.score += points;

        updateGameInformation();

        if (
            typeof tacKillMessage ===
            "function"
        ) {

            tacKillMessage(
                enemy
                    ? enemy.type
                    : "normal"
            );

        }

    };


    /* =====================================================
       GAME OVER
       ===================================================== */

    window.TACGameOver = function () {

        if (!TAC.waveActive) {
            return;
        }

        TAC.waveActive = false;
        TAC.preparation = false;
        TAC.menu = false;

        window.gameRunning = false;

        hide("gameScreen");
        hide("preparationMenu");

        show("gameOverScreen");

        updateGameOverScreen();

        saveScore();

    };


    /* =====================================================
       TELA DE GAME OVER
       ===================================================== */

    function updateGameOverScreen() {

        const screen =
            $("gameOverScreen");

        if (!screen) return;

        let box =
            screen.querySelector(
                ".tac-final-box"
            );

        if (!box) {

            box =
                document.createElement(
                    "div"
                );

            box.className =
                "tac-final-box";

            box.style.cssText = `
                width:min(600px,92%);
                padding:40px;
                border:1px solid #613b3b;
                border-radius:20px;
                background:#0c0808;
                text-align:center;
                box-shadow:0 25px 80px #000;
            `;

            screen.innerHTML = "";

            screen.appendChild(box);

        }

        box.innerHTML = `

            <div style="
                font-size:55px;
                font-weight:bold;
                color:#ff6460;
                letter-spacing:3px;
            ">
                VOCÊ MORREU
            </div>

            <div style="
                margin-top:20px;
                font-size:20px;
                color:#9daba0;
            ">
                ${escapeHTML(TAC.playerName)}
            </div>

            <div style="
                margin-top:25px;
                font-size:25px;
            ">
                Onda:
                <strong>
                    ${TAC.currentWave}
                </strong>
            </div>

            <div style="
                margin-top:10px;
                font-size:25px;
            ">
                Abates:
                <strong>
                    ${TAC.kills}
                </strong>
            </div>

            <div style="
                margin-top:10px;
                font-size:30px;
                color:#ffe278;
            ">
                Pontuação:
                <strong>
                    ${TAC.score}
                </strong>
            </div>

            <div style="
                display:flex;
                justify-content:center;
                gap:12px;
                flex-wrap:wrap;
                margin-top:30px;
            ">

                <button
                    class="tac-btn primary"
                    id="tacRestartButton"
                >
                    🔄 Jogar novamente
                </button>

                <button
                    class="tac-btn"
                    id="tacGameOverMenu"
                >
                    🏠 Menu
                </button>

            </div>

        `;

        const restart =
            $("tacRestartButton");

        const menu =
            $("tacGameOverMenu");

        if (restart) {

            restart.onclick = () => {

                resetRun();

                TACEnterPreparation();

            };

        }

        if (menu) {

            menu.onclick = () => {

                resetRun();

                TACReturnToMenu();

            };

        }

    }


    /* =====================================================
       RESET DA PARTIDA
       ===================================================== */

    function resetRun() {

        TAC.currentWave = 0;
        TAC.score = 0;
        TAC.kills = 0;
        TAC.waveActive = false;
        TAC.preparation = false;

        if (
            typeof waveEnemies !==
            "undefined" &&
            Array.isArray(waveEnemies)
        ) {

            waveEnemies.length = 0;

        }

        if (
            typeof enemiesAlive !==
            "undefined"
        ) {

            window.enemiesAlive = 0;

        }

        if (
            typeof player !==
            "undefined"
        ) {

            player.health =
                player.maxHealth ||
                100;

        }

    }


    /* =====================================================
       SALVAR RANKING
       ===================================================== */

    async function saveScore() {

        try {

            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                console.warn(
                    "Supabase não encontrado."
                );

                return;

            }

            const name =
                TAC.playerName ||
                "Jogador";

            const score =
                Number(TAC.score) || 0;

            const wave =
                Number(TAC.currentWave) || 0;

            const kills =
                Number(TAC.kills) || 0;

            const result =
                await supabaseClient
                    .from(
                        "they_are_coming_scores"
                    )
                    .insert([
                        {
                            player_name: name,
                            score: score,
                            wave: wave,
                            kills: kills
                        }
                    ]);

            if (result.error) {

                console.warn(
                    "Erro ao salvar ranking:",
                    result.error
                );

            }

        } catch (error) {

            console.warn(
                "Ranking:",
                error
            );

        }

    }


    /* =====================================================
       BOTÕES EXTRAS DE PREPARAÇÃO
       ===================================================== */

    function addPreparationButtons() {

        const menu =
            $("preparationMenu");

        if (!menu) return;

        let actions =
            menu.querySelector(
                ".tac-extra-actions"
            );

        if (actions) return;

        actions =
            document.createElement(
                "div"
            );

        actions.className =
            "tac-extra-actions";

        actions.style.cssText = `
            display:flex;
            justify-content:center;
            gap:10px;
            flex-wrap:wrap;
            margin-top:25px;
        `;

        actions.innerHTML = `

            <button
                class="tac-btn primary"
                id="tacStartWaveButton"
            >
                🧟 Começar onda
            </button>

            <button
                class="tac-btn"
                id="tacSkipWaveButton"
            >
                ⏩ Pular preparação
            </button>

            <button
                class="tac-btn"
                id="tacBackMenuButton"
            >
                🏠 Menu
            </button>

        `;

        menu.appendChild(actions);

        $("tacStartWaveButton").onclick =
            TACStartWave;

        $("tacSkipWaveButton").onclick =
            TACSkipPreparation;

        $("tacBackMenuButton").onclick =
            TACReturnToMenu;

    }


    /* =====================================================
       BLOQUEIO DE MENU DURANTE A ONDA
       ===================================================== */

    function protectGameplayMenu() {

        if (!TAC.waveActive) {
            return;
        }

        const mainMenu =
            $("mainMenu");

        if (mainMenu) {

            mainMenu.style.display =
                "none";

        }

        const preparation =
            $("preparationMenu");

        if (preparation) {

            preparation.style.display =
                "none";

        }

    }


    /* =====================================================
       TECLA ESC
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                TAC.waveActive
            ) {

                /*
                 * Durante a onda ESC não
                 * abre o menu.
                 */

                event.preventDefault();

                showMessage(
                    "Termine a onda para acessar o menu."
                );

            }

        }
    );


    /* =====================================================
       BLOQUEAR CLIQUE NO RANKING DURANTE ONDA
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (!TAC.waveActive) {
                return;
            }

            const target =
                event.target.closest(
                    "[data-menu='ranking'], #rankingButton"
                );

            if (!target) return;

            event.preventDefault();
            event.stopPropagation();

            showMessage(
                "O ranking só pode ser acessado no menu."
            );

        },
        true
    );


    /* =====================================================
       BLOQUEAR LOJA DURANTE A ONDA
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (!TAC.waveActive) {
                return;
            }

            const target =
                event.target.closest(
                    "[data-menu='weapons'], #weaponsButton"
                );

            if (!target) return;

            event.preventDefault();
            event.stopPropagation();

            showMessage(
                "Você só pode comprar armas no menu."
            );

        },
        true
    );


    /* =====================================================
       HUD EXTRA
       ===================================================== */

    function createExtraHUD() {

        if (
            !TAC.waveActive
        ) return;

        if (
            $("tacExtraHUD")
        ) return;

        const hud =
            document.createElement(
                "div"
            );

        hud.id =
            "tacExtraHUD";

        hud.style.cssText = `
            position:fixed;
            top:75px;
            left:18px;
            z-index:100;
            padding:10px 14px;
            border:1px solid rgba(100,160,115,.3);
            border-radius:10px;
            background:rgba(5,9,6,.78);
            color:#dce8df;
            font-size:13px;
            pointer-events:none;
            backdrop-filter:blur(5px);
        `;

        hud.innerHTML = `
            <div>
                🧟 Onda:
                <strong class="wave-number">
                    ${TAC.currentWave}
                </strong>
            </div>

            <div>
                ☠️ Abates:
                <strong class="kills-display">
                    ${TAC.kills}
                </strong>
            </div>

            <div>
                ⭐ Pontos:
                <strong class="score-display">
                    ${TAC.score}
                </strong>
            </div>
        `;

        document.body.appendChild(hud);

    }


    function removeExtraHUD() {

        const hud =
            $("tacExtraHUD");

        if (hud) {
            hud.remove();
        }

    }


    /* =====================================================
       LOOP DE INTEGRAÇÃO
       ===================================================== */

    setInterval(() => {

        if (TAC.waveActive) {

            createExtraHUD();
            protectGameplayMenu();
            updateGameInformation();

        } else {

            removeExtraHUD();

        }

    }, 500);


    /* =====================================================
       DETECTAR QUANDO TODOS OS INIMIGOS MORRERAM
       ===================================================== */

    setInterval(() => {

        if (!TAC.waveActive) {
            return;
        }

        if (
            typeof enemiesAlive !==
            "undefined" &&
            Number(enemiesAlive) <= 0
        ) {

            if (
                typeof waveEnemies !==
                "undefined" &&
                Array.isArray(waveEnemies) &&
                waveEnemies.length === 0
            ) {

                TACFinishWave();

            }

        }

    }, 600);


    /* =====================================================
       CORREÇÃO DE MORTE DO JOGADOR
       ===================================================== */

    function checkPlayerDeath() {

        if (
            typeof player ===
            "undefined"
        ) {
            return;
        }

        if (
            typeof player.health ===
            "number" &&
            player.health <= 0 &&
            TAC.waveActive
        ) {

            TACGameOver();

        }

    }


    setInterval(
        checkPlayerDeath,
        250
    );


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    function initializePart8() {

        requestPlayerName();

        addPreparationButtons();

        console.log(
            "================================="
        );

        console.log(
            "THEY ARE COMING — PARTE 8"
        );

        console.log(
            "Sistema integrado carregado."
        );

        console.log(
            "Jogador:",
            TAC.playerName
        );

        console.log(
            "================================="
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePart8
        );

    } else {

        initializePart8();

    }

})();/* =========================================================
   THEY ARE COMING
   PARTE 9 — SISTEMA AVANÇADO DE ARMAS E MUNIÇÕES
   ========================================================= */

(function () {

    "use strict";

    window.TAC_WEAPON_SYSTEM = {

        currentWeapon: null,
        lastShot: 0,
        reloading: false,
        reloadEnd: 0

    };


    /* =====================================================
       CONFIGURAÇÃO DAS ARMAS
       ===================================================== */

    const WEAPON_CONFIG = {

        pistol: {
            damage: 25,
            fireRate: 320,
            magazine: 12,
            reload: 1000,
            ammoType: "9mm",
            pellets: 1,
            spread: 0.02,
            range: 700
        },

        revolver: {
            damage: 55,
            fireRate: 650,
            magazine: 6,
            reload: 1500,
            ammoType: "357",
            pellets: 1,
            spread: 0.015,
            range: 800
        },

        desert_eagle: {
            damage: 75,
            fireRate: 600,
            magazine: 7,
            reload: 1400,
            ammoType: "50ae",
            pellets: 1,
            spread: 0.01,
            range: 850
        },

        machine_pistol: {
            damage: 18,
            fireRate: 110,
            magazine: 20,
            reload: 1000,
            ammoType: "9mm",
            pellets: 1,
            spread: 0.08,
            range: 600
        },

        smg: {
            damage: 20,
            fireRate: 95,
            magazine: 30,
            reload: 1100,
            ammoType: "9mm",
            pellets: 1,
            spread: 0.07,
            range: 650
        },

        mp5: {
            damage: 22,
            fireRate: 90,
            magazine: 30,
            reload: 1050,
            ammoType: "9mm",
            pellets: 1,
            spread: 0.06,
            range: 680
        },

        vector: {
            damage: 18,
            fireRate: 65,
            magazine: 33,
            reload: 1000,
            ammoType: "9mm",
            pellets: 1,
            spread: 0.08,
            range: 600
        },

        p90: {
            damage: 17,
            fireRate: 70,
            magazine: 50,
            reload: 1200,
            ammoType: "5.7mm",
            pellets: 1,
            spread: 0.07,
            range: 700
        },

        shotgun: {
            damage: 18,
            fireRate: 850,
            magazine: 8,
            reload: 1600,
            ammoType: "12gauge",
            pellets: 8,
            spread: 0.28,
            range: 400
        },

        double_barrel: {
            damage: 28,
            fireRate: 1000,
            magazine: 2,
            reload: 1800,
            ammoType: "12gauge",
            pellets: 12,
            spread: 0.35,
            range: 350
        },

        combat_shotgun: {
            damage: 20,
            fireRate: 500,
            magazine: 8,
            reload: 1500,
            ammoType: "12gauge",
            pellets: 9,
            spread: 0.26,
            range: 420
        },

        rifle: {
            damage: 40,
            fireRate: 180,
            magazine: 30,
            reload: 1300,
            ammoType: "556",
            pellets: 1,
            spread: 0.035,
            range: 900
        },

        ak47: {
            damage: 46,
            fireRate: 150,
            magazine: 30,
            reload: 1400,
            ammoType: "762",
            pellets: 1,
            spread: 0.055,
            range: 850
        },

        m4: {
            damage: 38,
            fireRate: 105,
            magazine: 30,
            reload: 1200,
            ammoType: "556",
            pellets: 1,
            spread: 0.03,
            range: 900
        },

        famas: {
            damage: 35,
            fireRate: 100,
            magazine: 25,
            reload: 1200,
            ammoType: "556",
            pellets: 1,
            spread: 0.04,
            range: 850
        },

        g36: {
            damage: 39,
            fireRate: 110,
            magazine: 30,
            reload: 1250,
            ammoType: "556",
            pellets: 1,
            spread: 0.035,
            range: 900
        },

        sniper: {
            damage: 180,
            fireRate: 1200,
            magazine: 5,
            reload: 1800,
            ammoType: "762",
            pellets: 1,
            spread: 0,
            range: 1500,
            critical: 2
        },

        marksman: {
            damage: 110,
            fireRate: 550,
            magazine: 10,
            reload: 1600,
            ammoType: "762",
            pellets: 1,
            spread: 0.01,
            range: 1300,
            critical: 1.7
        },

        heavy_sniper: {
            damage: 300,
            fireRate: 1800,
            magazine: 4,
            reload: 2200,
            ammoType: "50bmg",
            pellets: 1,
            spread: 0,
            range: 1800,
            critical: 2.5
        },

        minigun: {
            damage: 16,
            fireRate: 45,
            magazine: 100,
            reload: 2200,
            ammoType: "556",
            pellets: 1,
            spread: 0.12,
            range: 750
        },

        rpg: {
            damage: 350,
            fireRate: 2200,
            magazine: 1,
            reload: 2500,
            ammoType: "rocket",
            pellets: 1,
            spread: 0,
            range: 1200,
            explosive: true,
            explosionRadius: 130
        },

        grenade_launcher: {
            damage: 220,
            fireRate: 1500,
            magazine: 6,
            reload: 2000,
            ammoType: "grenade",
            pellets: 1,
            spread: 0,
            range: 900,
            explosive: true,
            explosionRadius: 100
        },

        laser: {
            damage: 65,
            fireRate: 120,
            magazine: 30,
            reload: 1200,
            ammoType: "energy",
            pellets: 1,
            spread: 0,
            range: 1000
        },

        plasma: {
            damage: 100,
            fireRate: 350,
            magazine: 15,
            reload: 1500,
            ammoType: "plasma",
            pellets: 1,
            spread: 0.02,
            range: 1100,
            explosive: true,
            explosionRadius: 50
        },

        railgun: {
            damage: 500,
            fireRate: 2500,
            magazine: 1,
            reload: 3000,
            ammoType: "rail",
            pellets: 1,
            spread: 0,
            range: 2000,
            critical: 3
        }

    };


    /* =====================================================
       MUNIÇÃO INICIAL
       ===================================================== */

    function initializeAdvancedAmmo() {

        if (
            typeof inventory ===
            "undefined"
        ) {
            return;
        }

        if (!inventory.ammo) {
            inventory.ammo = {};
        }

        const defaultAmmo = {

            "9mm": 240,
            "357": 60,
            "50ae": 42,
            "5.7mm": 250,
            "12gauge": 80,
            "556": 300,
            "762": 180,
            "50bmg": 20,
            "rocket": 10,
            "grenade": 20,
            "energy": 150,
            "plasma": 100,
            "rail": 10

        };

        for (
            const ammo in defaultAmmo
        ) {

            if (
                typeof inventory.ammo[ammo] !==
                "number"
            ) {

                inventory.ammo[ammo] =
                    defaultAmmo[ammo];

            }

        }

    }


    /* =====================================================
       PEGAR ID DA ARMA
       ===================================================== */

    function getWeaponId() {

        if (
            typeof getCurrentWeapon !==
            "function"
        ) {
            return "pistol";
        }

        const weapon =
            getCurrentWeapon();

        if (!weapon) {
            return "pistol";
        }

        return (
            weapon.id ||
            weapon.key ||
            weapon.name ||
            "pistol"
        );

    }


    /* =====================================================
       PEGAR CONFIGURAÇÃO
       ===================================================== */

    function getConfig() {

        const id =
            getWeaponId();

        return (
            WEAPON_CONFIG[id] ||
            WEAPON_CONFIG.pistol
        );

    }


    /* =====================================================
       QUANTIDADE DE MUNIÇÃO
       ===================================================== */

    function getAmmoAmount(
        ammoType
    ) {

        if (
            typeof inventory ===
            "undefined"
        ) {
            return 0;
        }

        if (!inventory.ammo) {
            inventory.ammo = {};
        }

        return Number(
            inventory.ammo[ammoType] || 0
        );

    }


    /* =====================================================
       CONSUMIR MUNIÇÃO
       ===================================================== */

    function consumeAdvancedAmmo(
        ammoType,
        amount = 1
    ) {

        if (
            typeof inventory ===
            "undefined"
        ) {
            return false;
        }

        if (!inventory.ammo) {
            inventory.ammo = {};
        }

        const current =
            getAmmoAmount(ammoType);

        if (current < amount) {

            showMessage(
                "Sem munição!"
            );

            return false;

        }

        inventory.ammo[ammoType] =
            current - amount;

        if (
            typeof updateInventory ===
            "function"
        ) {

            updateInventory();

        }

        if (
            typeof updateHUD ===
            "function"
        ) {

            updateHUD();

        }

        return true;

    }


    /* =====================================================
       RECARREGAR
       ===================================================== */

    window.TACReload = function () {

        if (
            TAC_WEAPON_SYSTEM.reloading
        ) {
            return;
        }

        const config =
            getConfig();

        const ammo =
            getAmmoAmount(
                config.ammoType
            );

        if (ammo <= 0) {

            showMessage(
                "Você não possui essa munição."
            );

            return;

        }

        TAC_WEAPON_SYSTEM.reloading =
            true;

        TAC_WEAPON_SYSTEM.reloadEnd =
            performance.now() +
            config.reload;

        showMessage(
            "Recarregando..."
        );

        setTimeout(() => {

            TAC_WEAPON_SYSTEM.reloading =
                false;

            showMessage(
                "Arma recarregada!"
            );

        }, config.reload);

    };


    /* =====================================================
       TECLA R
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key.toLowerCase() !==
                "r"
            ) {
                return;
            }

            if (
                typeof gameRunning !==
                "undefined" &&
                !gameRunning
            ) {
                return;
            }

            TACReload();

        }
    );


    /* =====================================================
       PODE ATIRAR?
       ===================================================== */

    function canShoot() {

        if (
            TAC_WEAPON_SYSTEM.reloading
        ) {
            return false;
        }

        const now =
            performance.now();

        const config =
            getConfig();

        if (
            now -
            TAC_WEAPON_SYSTEM.lastShot
            <
            config.fireRate
        ) {

            return false;

        }

        return true;

    }


    /* =====================================================
       APLICAR DANO
       ===================================================== */

    function applyDamage(
        enemy,
        damage,
        critical = false
    ) {

        if (!enemy) {
            return false;
        }

        if (
            typeof enemy.health !==
            "number"
        ) {

            enemy.health =
                enemy.maxHealth ||
                100;

        }

        enemy.health -= damage;

        if (
            typeof createHitMarker ===
            "function"
        ) {

            createHitMarker(
                enemy.x,
                enemy.y,
                critical
            );

        }

        if (
            enemy.health <= 0
        ) {

            if (
                typeof createZombieDeathEffect ===
                "function"
            ) {

                createZombieDeathEffect(
                    enemy
                );

            }

            if (
                typeof TACRegisterKill ===
                "function"
            ) {

                TACRegisterKill(
                    enemy
                );

            }

            enemy.dead = true;

            return true;

        }

        return false;

    }


    /* =====================================================
       DISTÂNCIA
       ===================================================== */

    function distance(
        x1,
        y1,
        x2,
        y2
    ) {

        return Math.sqrt(
            Math.pow(x2 - x1, 2) +
            Math.pow(y2 - y1, 2)
        );

    }


    /* =====================================================
       DISPARO EM UM INIMIGO
       ===================================================== */

    function shootAtEnemy(
        enemy,
        angle,
        config
    ) {

        if (!enemy) {
            return;
        }

        const dist =
            distance(
                player.x,
                player.y,
                enemy.x,
                enemy.y
            );

        if (
            dist >
            config.range
        ) {

            return;

        }

        let damage =
            config.damage;

        let critical = false;

        /*
         * Chance de crítico para
         * armas que possuem critical.
         */

        if (
            config.critical &&
            Math.random() < .18
        ) {

            damage *=
                config.critical;

            critical = true;

        }

        applyDamage(
            enemy,
            damage,
            critical
        );

    }


    /* =====================================================
       DISPARO PRINCIPAL
       ===================================================== */

    window.TACFireWeapon = function () {

        if (
            typeof gameRunning !==
            "undefined" &&
            !gameRunning
        ) {

            return;

        }

        if (
            typeof player ===
            "undefined"
        ) {

            return;

        }

        if (!canShoot()) {
            return;
        }

        const config =
            getConfig();

        if (
            !consumeAdvancedAmmo(
                config.ammoType,
                1
            )
        ) {

            return;

        }

        TAC_WEAPON_SYSTEM.lastShot =
            performance.now();

        /* -----------------------------------------------
           DIREÇÃO
           ----------------------------------------------- */

        let angle = 0;

        if (
            typeof mouse !==
            "undefined"
        ) {

            angle =
                Math.atan2(
                    mouse.y - player.y,
                    mouse.x - player.x
                );

        }

        /* -----------------------------------------------
           EFEITO DE TIRO
           ----------------------------------------------- */

        if (
            typeof createMuzzleFlash ===
            "function"
        ) {

            createMuzzleFlash(
                player.x,
                player.y,
                angle,
                getWeaponId()
            );

        }

        /* -----------------------------------------------
           EXPLOSIVOS
           ----------------------------------------------- */

        if (
            config.explosive
        ) {

            fireExplosive(
                angle,
                config
            );

            return;

        }

        /* -----------------------------------------------
           PROJÉTEIS
           ----------------------------------------------- */

        const pellets =
            config.pellets || 1;

        for (
            let p = 0;
            p < pellets;
            p++
        ) {

            const spread =
                (
                    Math.random() -
                    .5
                ) *
                config.spread;

            const shotAngle =
                angle + spread;

            findEnemyAlongShot(
                shotAngle,
                config
            );

        }

    };


    /* =====================================================
       ENCONTRAR INIMIGO NA LINHA DE TIRO
       ===================================================== */

    function findEnemyAlongShot(
        angle,
        config
    ) {

        if (
            typeof waveEnemies ===
            "undefined"
        ) {
            return;
        }

        if (
            !Array.isArray(waveEnemies)
        ) {
            return;
        }

        let closest = null;
        let closestDistance =
            Infinity;

        for (
            const enemy of waveEnemies
        ) {

            if (!enemy) continue;

            if (enemy.dead) continue;

            const dx =
                enemy.x -
                player.x;

            const dy =
                enemy.y -
                player.y;

            const dist =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                dist >
                config.range
            ) {
                continue;
            }

            const enemyAngle =
                Math.atan2(
                    dy,
                    dx
                );

            let angleDifference =
                Math.abs(
                    enemyAngle -
                    angle
                );

            if (
                angleDifference >
                Math.PI
            ) {

                angleDifference =
                    Math.PI * 2 -
                    angleDifference;

            }

            const hitTolerance =
                Math.max(
                    .035,
                    Math.min(
                        .15,
                        40 / dist
                    )
                );

            if (
                angleDifference <=
                hitTolerance
            ) {

                if (
                    dist <
                    closestDistance
                ) {

                    closest =
                        enemy;

                    closestDistance =
                        dist;

                }

            }

        }

        if (closest) {

            shootAtEnemy(
                closest,
                angle,
                config
            );

        }

    }


    /* =====================================================
       EXPLOSÃO
       ===================================================== */

    function fireExplosive(
        angle,
        config
    ) {

        const distanceToExplosion =
            Math.min(
                config.range,
                500
            );

        const x =
            player.x +
            Math.cos(angle) *
            distanceToExplosion;

        const y =
            player.y +
            Math.sin(angle) *
            distanceToExplosion;

        if (
            typeof createExplosionEffect ===
            "function"
        ) {

            createExplosionEffect(
                x,
                y,
                config.explosionRadius
            );

        }

        if (
            typeof waveEnemies ===
            "undefined"
        ) {
            return;
        }

        for (
            const enemy of waveEnemies
        ) {

            if (!enemy) continue;

            if (enemy.dead) continue;

            const dist =
                distance(
                    x,
                    y,
                    enemy.x,
                    enemy.y
                );

            if (
                dist <=
                config.explosionRadius
            ) {

                const multiplier =
                    1 -
                    (
                        dist /
                        config.explosionRadius
                    ) * .5;

                applyDamage(
                    enemy,
                    config.damage *
                    multiplier,
                    false
                );

            }

        }

    }


    /* =====================================================
       CLIQUE DO MOUSE
       ===================================================== */

    document.addEventListener(
        "mousedown",
        function (event) {

            if (event.button !== 0) {
                return;
            }

            if (
                typeof gameRunning !==
                "undefined" &&
                gameRunning
            ) {

                TACFireWeapon();

            }

        }
    );


    /* =====================================================
       MODO AUTOMÁTICO PARA ARMAS AUTOMÁTICAS
       ===================================================== */

    let mouseHeld = false;

    document.addEventListener(
        "mousedown",
        function (event) {

            if (event.button === 0) {
                mouseHeld = true;
            }

        }
    );

    document.addEventListener(
        "mouseup",
        function (event) {

            if (event.button === 0) {
                mouseHeld = false;
            }

        }
    );


    setInterval(() => {

        if (!mouseHeld) {
            return;
        }

        if (
            typeof gameRunning !==
            "undefined" &&
            !gameRunning
        ) {
            return;
        }

        const config =
            getConfig();

        /*
         * Armas de tiro único não
         * ficam disparando automaticamente.
         */

        const automatic =
            config.fireRate <= 180;

        if (automatic) {

            TACFireWeapon();

        }

    }, 20);


    /* =====================================================
       HUD DE MUNIÇÃO
       ===================================================== */

    function updateAdvancedAmmoHUD() {

        const config =
            getConfig();

        const ammo =
            getAmmoAmount(
                config.ammoType
            );

        const displays =
            document.querySelectorAll(
                ".ammo-display"
            );

        displays.forEach(
            display => {

                display.innerHTML = `
                    <strong>
                        ${ammo}
                    </strong>
                    <small>
                        ${config.ammoType}
                    </small>
                `;

            }
        );

    }


    setInterval(
        updateAdvancedAmmoHUD,
        150
    );


    /* =====================================================
       MOSTRAR ARMA ATUAL
       ===================================================== */

    function updateWeaponNameHUD() {

        const id =
            getWeaponId();

        const elements =
            document.querySelectorAll(
                ".current-weapon"
            );

        elements.forEach(
            element => {

                element.textContent =
                    id;

            }
        );

    }


    setInterval(
        updateWeaponNameHUD,
        250
    );


    /* =====================================================
       INICIALIZAÇÃO
       ===================================================== */

    function initializePart9() {

        initializeAdvancedAmmo();

        console.log(
            "They Are Coming — Parte 9 carregada."
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePart9
        );

    } else {

        initializePart9();

    }

})();
