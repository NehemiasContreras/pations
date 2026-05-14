const input = document.querySelector("header input");
const cards = document.querySelector(".cards");
const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const volume = document.getElementById("volume");

const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");

const randomBtn = document.getElementById("randomBtn");
const sectionTitle = document.getElementById("sectionTitle");

let cancionesActuales = [];
let currentIndex = 0;

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* CARGA INICIAL */

buscarCanciones("Duki");

/* BUSCADOR */

input.addEventListener("keydown", (e) => {

    if(e.key === "Enter"){

        const valor = input.value.trim();

        if(valor !== ""){

            buscarCanciones(valor);

        }

    }

});

/* RANDOM */

randomBtn.addEventListener("click", () => {

    const artistas = [
        "Duki",
        "Bad Bunny",
        "Drake",
        "Travis Scott",
        "Feid",
        "Milo J",
        "The Weeknd"
    ];

    const random = artistas[Math.floor(Math.random() * artistas.length)];

    buscarCanciones(random);

});

/* API */

async function buscarCanciones(busqueda){

    sectionTitle.innerHTML = `Resultados de: ${busqueda}`;

    cards.innerHTML = "<p>Buscando canciones...</p>";

    try{

        const url = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(busqueda)}`;

        const response = await fetch(url);

        const data = await response.json();

        cancionesActuales = data.data;

        mostrarCanciones(cancionesActuales);

    }catch(error){

        console.log(error);

        cards.innerHTML = "<p>Error al cargar canciones.</p>";

    }

}

/* MOSTRAR */

function mostrarCanciones(canciones){

    cards.innerHTML = "";

    canciones.forEach((cancion,index) => {

        cards.innerHTML += `

        <div class="card">

            <img src="${cancion.album.cover_big}">

            <h4>${cancion.title}</h4>

            <p>${cancion.artist.name}</p>

            <div class="card-buttons">

                <button onclick="reproducir(${index})">
                    Play
                </button>

                <button onclick="guardarFavorito(${index})">
                    ❤
                </button>

            </div>

        </div>

        `;

    });

}

/* REPRODUCIR */

function reproducir(index){

    currentIndex = index;

    const cancion = cancionesActuales[index];

    audio.src = cancion.preview;

    audio.play();

    playBtn.innerHTML = "⏸";

    playerTitle.innerHTML = cancion.title;

    playerArtist.innerHTML = cancion.artist.name;

    playerCover.src = cancion.album.cover_medium;

}

/* PLAY/PAUSE */

playBtn.addEventListener("click", () => {

    if(audio.src === "") return;

    if(audio.paused){

        audio.play();

        playBtn.innerHTML = "⏸";

    }else{

        audio.pause();

        playBtn.innerHTML = "▶";

    }

});

/* NEXT */

nextBtn.addEventListener("click", () => {

    currentIndex++;

    if(currentIndex >= cancionesActuales.length){

        currentIndex = 0;

    }

    reproducir(currentIndex);

});

/* PREV */

prevBtn.addEventListener("click", () => {

    currentIndex--;

    if(currentIndex < 0){

        currentIndex = cancionesActuales.length - 1;

    }

    reproducir(currentIndex);

});

/* VOLUMEN */

volume.addEventListener("input", () => {

    audio.volume = volume.value;

});

/* FAVORITOS */

function guardarFavorito(index){

    favoritos.push(cancionesActuales[index]);

    localStorage.setItem("favoritos", JSON.stringify(favoritos));

    alert("Guardado en favoritos");

}

/* MENUS */

const menus = document.querySelectorAll(".menu");

menus.forEach(menu => {

    menu.addEventListener("click", (e) => {

        e.preventDefault();

        menus.forEach(m => m.classList.remove("active"));

        menu.classList.add("active");

        const page = menu.dataset.page;

        if(page === "inicio"){

            buscarCanciones("top music");

        }

        if(page === "explorar"){

            buscarCanciones("viral");

        }

        if(page === "biblioteca"){

            buscarCanciones("lofi");

        }

        if(page === "favoritos"){

            mostrarFavoritos();

        }

        if(page === "perfil"){

            sectionTitle.innerHTML = "Perfil";

            cards.innerHTML = `

                <div class="card">

                    <h2>Pations User</h2>

                    <p>Favoritos: ${favoritos.length}</p>

                </div>

            `;

        }

    });

});

/* FAVORITOS */

function mostrarFavoritos(){

    sectionTitle.innerHTML = "Tus favoritos";

    cards.innerHTML = "";

    favoritos.forEach((cancion,index) => {

        cards.innerHTML += `

        <div class="card">

            <img src="${cancion.album.cover_big}">

            <h4>${cancion.title}</h4>

            <p>${cancion.artist.name}</p>

            <div class="card-buttons">

                <button onclick="reproducirFavorito(${index})">
                    Play
                </button>

            </div>

        </div>

        `;

    });

}

/* PLAY FAVORITO */

function reproducirFavorito(index){

    const cancion = favoritos[index];

    audio.src = cancion.preview;

    audio.play();

    playerTitle.innerHTML = cancion.title;

    playerArtist.innerHTML = cancion.artist.name;

    playerCover.src = cancion.album.cover_medium;

    playBtn.innerHTML = "⏸";

}