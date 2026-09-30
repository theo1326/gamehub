const games = [
    {
    name: "They Are Coming",
    category: "Ação",
    icon: "🧟",
    description: "Sobreviva às ondas de inimigos, compre armas e tente chegar o mais longe possível.",
    link: "jogos/they-are-coming/"
}
    {
    name: "Basquete 2 Jogadores",
    category: "Esportes",
    icon: "🏀",
    description: "Enfrente outro jogador no mesmo computador em uma partida de basquete.",
    link: "jogos/basquete/index.html"
},
    {
        name: "Space Waves",
        category: "Ação",
        icon: "🚀",
        description: "Controle sua nave, desvie dos obstáculos e alcance a maior distância possível.",
        link: "jogos/space-waves/"
    },

    {
        name: "Batalha ",
        category: "Ação",
        icon: "🚢",
        description: "Destrua seus inimigos usando seu navio e se torne o líder da marinha."
    },

    {
        name: "Minecraft",
        category: "Aventura",
        icon: "🌴",
        description: "Explore um mundo cheio de desafios."
    },

    {
        name: "Blox Fruits",
        category: "Ação",
        icon: "🍈",
        description: "One Piece."
    },

    {
        name: "GTA 5",
        category: "Corrida e ação",
        icon: "🏎️",
        description: "Explore uma cidade 3D, dirija carros e complete missões.",
        link: "jogos/gta5/index.html"
    },

    {
        name: "Cobrinha",
        category: "Ação",
        icon: "🐍",
        description: "Coma a comida, cresça e faça a maior pontuação!",
        link: "jogos/cobrinha/index.html"
    },

    {
        name: "Plants vs Zombies",
        category: "Ação",
        icon: "🌱",
        description: "Defenda sua casa usando plantas contra ondas de zumbis.",
        link: "jogos/plants-vs-zombies/index.html"
    }
];


const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
const count = document.getElementById("resultCount");

let category = "Todos";


function render() {

    const query =
        search.value
        .trim()
        .toLowerCase();

    const filtered =
        games.filter(game => {

            const matchesSearch =
                game.name
                    .toLowerCase()
                    .includes(query) ||
                game.description
                    .toLowerCase()
                    .includes(query);

            const matchesCategory =
                category === "Todos" ||
                game.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        });


    grid.innerHTML = "";


    filtered.forEach(game => {

        const card =
            document.createElement("div");

        card.className = "game-card";


        card.innerHTML = `
            <div class="game-icon">
                ${game.icon}
            </div>

            <div class="game-info">
                <span class="game-category">
                    ${game.category}
                </span>

                <h3>${game.name}</h3>

                <p>${game.description}</p>

                <button class="play-btn">
                    ▶ Jogar
                </button>
            </div>
        `;


        const button =
            card.querySelector(".play-btn");


        button.addEventListener(
            "click",
            () => playGame(game)
        );


        grid.appendChild(card);
    });


    count.textContent =
        `${filtered.length} jogos`;


    empty.style.display =
        filtered.length === 0
        ? "block"
        : "none";
}


function playGame(game) {

    if (game.link) {

        window.location.href =
            game.link;

    } else {

        alert(
            "Esse jogo ainda não foi adicionado ao GameHub."
        );
    }
}


document
    .querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                category =
                    button.dataset.category;

                render();
            }
        );
    });


search.addEventListener(
    "input",
    render
);


const themeBtn =
    document.getElementById("themeBtn");


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light"
            );

            themeBtn.textContent =
                document.body.classList.contains("light")
                ? "🌙"
                : "☀️";
        }
    );
}


render();
