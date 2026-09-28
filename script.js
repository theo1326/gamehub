const games = [
    {
        name: "they are comming",
        category: "ação",
        icon: "🧟",
        description: "seja o melhor sobrevivente nesse mundo zumbi."
    },

    {
        name: "batalha naval",
        category: "Ação",
        icon: "🚢",
        description: "destrua seu inimigos usando seu navio e se torne o lider da marinha."
    },

    {
        name: "Plants vs Zombies",
        category: "Ação",
        icon: "🌱",
        description: "Defenda sua casa usando plantas contra ondas de zumbis.",
        link: "jogos/plants-vs-zombies/index.html"
    },

    {
        name: "minecraft",
        category: "Aventura",
        icon: "🌴",
        description: "Explore um mundo cheio de desafios."
    },

    {
        name: "blox fruits",
        category: "Ação",
        icon: "🍈",
        description: "one piece."
    },

    {
       {
    name: "gta5",
    category: "Ação",
    icon: "🚗",
    description: "Explore uma cidade 3D, dirija carros e complete missões.",
    link: "jogos/gta5/index.html"
},
    },

    // 🐍 NOSSO PRIMEIRO JOGO REAL
    {
        name: "Cobrinha",
        category: "Ação",
        icon: "🐍",
        description: "Coma a comida, cresça e faça a maior pontuação!",
        link: "jogos/cobrinha/index.html"
    }
];

const grid = document.getElementById("gameGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
const count = document.getElementById("resultCount");

let category = "Todos";

function render() {

    const term = search.value.trim().toLowerCase();

    const filtered = games.filter(g =>
        (category === "Todos" || g.category === category) &&
        (
            g.name.toLowerCase().includes(term) ||
            g.category.toLowerCase().includes(term) ||
            g.description.toLowerCase().includes(term)
        )
    );

    grid.innerHTML = filtered.map(g => `

        <article class="game-card">

            <div class="game-cover">
                ${g.icon}
            </div>

            <div class="game-info">

                <h3>${g.name}</h3>

                <p>${g.description}</p>

                <span class="tag">
                    ${g.category}
                </span>

                <button
                    class="play"
                    onclick="playGame('${g.name}')">
                    ▶ Jogar
                </button>

            </div>

        </article>

    `).join("");

    count.textContent =
        `${filtered.length} ${
            filtered.length === 1
            ? "jogo encontrado"
            : "jogos encontrados"
        }`;

    empty.classList.toggle(
        "hidden",
        filtered.length !== 0
    );
}

function playGame(name) {

    const game = games.find(g => g.name === name);

    if (game && game.link) {

        window.location.href = game.link;

    } else {

        alert(
            "O jogo " +
            name +
            " ainda não foi adicionado."
        );

    }
}

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".filter")
            .forEach(x =>
                x.classList.remove("active")
            );

        button.classList.add("active");

        category = button.dataset.category;

        render();
    });

});

search.addEventListener("input", render);

document
    .getElementById("themeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle("light");

        document.getElementById("themeBtn").textContent =
            document.body.classList.contains("light")
            ? "🌙"
            : "☀️";

    });

render();
