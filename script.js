const games=[
{name:"Neon Racer",category:"Corrida",icon:"🏎️",description:"Corra em pistas futuristas e tente bater seu recorde."},
{name:"Space Battle",category:"Ação",icon:"🚀",description:"Enfrente inimigos no espaço e sobreviva o máximo possível."},
{name:"Brain Blocks",category:"Puzzle",icon:"🧩",description:"Resolva desafios e complete cada fase."},
{name:"Jungle Quest",category:"Aventura",icon:"🌴",description:"Explore uma floresta cheia de desafios."},
{name:"Ninja Dash",category:"Ação",icon:"🥷",description:"Desvie dos obstáculos e avance o mais longe possível."},
{name:"Rocket Run",category:"Corrida",icon:"🚀",description:"Controle seu foguete e supere seus adversários."}];

const grid=document.getElementById("gameGrid"),search=document.getElementById("search"),empty=document.getElementById("empty"),count=document.getElementById("resultCount");
let category="Todos";
function render(){
const term=search.value.trim().toLowerCase();
const filtered=games.filter(g=>(category==="Todos"||g.category===category)&&(g.name.toLowerCase().includes(term)||g.category.toLowerCase().includes(term)||g.description.toLowerCase().includes(term)));
grid.innerHTML=filtered.map(g=>`<article class="game-card"><div class="game-cover">${g.icon}</div><div class="game-info"><h3>${g.name}</h3><p>${g.description}</p><span class="tag">${g.category}</span><button class="play" onclick="playGame('${g.name}')">▶ Jogar</button></div></article>`).join("");
count.textContent=`${filtered.length} ${filtered.length===1?"jogo encontrado":"jogos encontrados"}`;
empty.classList.toggle("hidden",filtered.length!==0);
}
function playGame(name){alert("O jogo "+name+" está pronto para receber o seu jogo real!\n\nSubstitua esta função pelo link ou código do seu jogo.");}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.category;render();}));
search.addEventListener("input",render);
document.getElementById("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("light");document.getElementById("themeBtn").textContent=document.body.classList.contains("light")?"🌙":"☀️";});
render();