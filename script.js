const games = [
    {
        name: "They Are Coming",
        category: "Ação",
        icon: "🧟",
        description: "Sobreviva às ondas de inimigos.",
        link: "jogos/they-are-coming/"
    },
    {
        name: "Basquete 2 Jogadores",
        category: "Esportes",
        icon: "🏀",
        description: "Jogue basquete contra outro jogador.",
        link: "jogos/basquete/index.html"
    },
    {
        name: "Cobrinha",
        category: "Ação",
        icon: "🐍",
        description: "Faça a maior pontuação!",
        link: "jogos/cobrinha/index.html"
    }
];

const grid = document.getElementById("gameGrid");

games.forEach(game => {

    const card = document.createElement("div");

    card.className = "game-card";

    card.innerHTML = `
        <div class="game-icon">${game.icon}</div>

        <div class="game-info">
            <span class="game-category">${game.category}</span>
            <h3>${game.name}</h3>
            <p>${game.description}</p>

            <button class="play-btn">
                ▶ Jogar
            </button>
        </div>
    `;

    card.querySelector(".play-btn").addEventListener("click", () => {
        if (game.link) {
            window.location.href = game.link;
        }
    });

    grid.appendChild(card);
});
