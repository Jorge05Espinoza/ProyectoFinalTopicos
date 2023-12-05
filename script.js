const apiKey = 'dd5f2a8446fd4105a5a4bf528ff33999';
const videoGameList = document.getElementById('videoGame-container');
let carritoGuardar = [];
let videoGamesResult = null;
let tipoVideogame = [];
let allGames = [];


document.getElementById('search').addEventListener('click', () => {
    displayVideoGame();
    document.getElementById('mostrarGuardados').style.display = 'inline-block';
});

document.getElementById('mostrarGuardados').addEventListener('click', () => {
    mostrarJuegosGuardados();
});

document.getElementById('vaciarCarrito').addEventListener('click', () => {
    vaciarCarrito();
});
const gameName = document.getElementById('nameGame').value;

async function displayVideoGame() {
    const gameNameInput = document.getElementById('nameGame');
    const gameName = gameNameInput.value;

    if (!gameName) {
        displayErrorMessage("Favor de ingresar un juego en el buscador");
        return;
    }

    videoGameList.innerHTML = ''; // Limpiar el contenido actual

    try {
        const videoGames = await getVideoGame(gameName);
        if (videoGames && videoGames.results && videoGames.results.length > 0) {
            videoGames.results.forEach(videoGame => {
                addVideoGame(videoGame); // Pasar el objeto completo del juego
            });
        } else {
            displayErrorMessage("No se ha encontrado ningún videojuego");
        }
    } catch (error) {
        console.error(error);
        displayErrorMessage("Error al buscar el juego");
    }
}
function addVideoGame(videoGame) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    const gameCard = document.createElement('div');
    gameCard.classList.add('card');

    gameCard.innerHTML = `
        <img class="card-image" src="${videoGame.background_image}" alt="${videoGame.name}">
        <div class="card-details">
            <strong>Id</strong>: ${videoGame.id}
            <strong>Name</strong>: ${videoGame.name}
            <strong>Description</strong>: ${videoGame.description || 'No disponible'} <!-- Verificación de existencia de descripción -->
            <strong>Fecha de lanzamiento</strong>: ${videoGame.released}
            <button onclick="guardarJuego(${videoGame.id})">Guardar en Carrito</button>
        </div>
    `;

    cardContainer.appendChild(gameCard);
    videoGameList.appendChild(cardContainer);
    console.log(videoGame);
}


async function getVideoGame(name) {
    try {
        let response = await fetch(`https://api.rawg.io/api/games?search=${name}&key=${apiKey}`);
        if (response.ok) {
            let res = await response.json();
            allGames.push(res)
            return res
        } else {
            throw new Error(`Error de red: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los datos del juego');
    }
}

function guardarJuego(videoGameId) {
    console.log('allGames:', allGames);

    // Utilizamos flatMap para obtener un arreglo plano de resultados
    var allResults = allGames.flatMap(game => game.results);

    var findGame = allResults.find(game => game.id == videoGameId);

    if (findGame) {
        const gameToSave = carritoGuardar.find(game => game.id === videoGameId);
        if (gameToSave) {
            alert('El juego ya está en el carrito: ' + gameToSave.name);
        } else {
            carritoGuardar.push(findGame);
            alert('Juego agregado al carrito: ' + findGame.name);
        }
    } else {
        alert('No se encontró información para el juego con ID: ' + videoGameId);
    }
}




function mostrarJuegosGuardados() {
    videoGameList.innerHTML = ''; // Limpiar el contenido actual

    if (carritoGuardar.length === 0) {
        const carritoVacio = document.createElement('h1');
        carritoVacio.innerHTML = '<string>No has guardado juegos</string>';
        videoGameList.appendChild(carritoVacio);

        // Ocultar el botón "Vaciar Carrito" si el carrito está vacío
        document.getElementById('vaciarCarrito').style.display = 'none';
        document.getElementById('mostrarGuardados').style.display = 'none';
        return;
    }

    // Ocultar los botones "Guardar en Carrito" y "Mostrar Carrito"
    document.getElementById('mostrarGuardados').style.display = 'none';

    // Ordenar por nombre
    carritoGuardar.sort((a, b) => a.name.localeCompare(b.name));

    // Mostrar los videojuegos ordenados
    displaySortedVideoGames();

    // Mostrar el botón "Vaciar Carrito" si hay elementos en el carrito
    document.getElementById('vaciarCarrito').style.display = 'inline-block';
}



function displaySortedVideoGames() {
    // Agrega el encabezado <h1>Listado del Carrito</h1> una vez
    const carritoHTML = document.createElement('div');
    carritoHTML.innerHTML = '<h1>Listado del Carrito</h1>';

    // Mostrar los videojuegos ordenados
    carritoGuardar.forEach(videoGame => {
        if (videoGame && videoGame.genres) {
            ImprimirVideoGame(videoGame, carritoHTML);
        }
    });

    videoGameList.appendChild(carritoHTML);
}

function ImprimirVideoGame(videoGame, container) {
    //const genresList = videoGame.genres.map(genre => genre.name);

    const gameElement = document.createElement('div');
    gameElement.innerHTML = `
    <img class="card-image" src="${videoGame.background_image}" alt="${videoGame.name}">
    <div class="card-details">
        <strong>Id</strong>: ${videoGame.id}
        <strong>Name</strong>: ${videoGame.name}
        <strong>Description</strong>: ${videoGame.description || 'No disponible'} <!-- Verificación de existencia de descripción -->
        <strong>Fecha de lanzamiento</strong>: ${videoGame.released}
        <button onclick="guardarJuego(${videoGame.id})">Guardar en Carrito</button>
    </div>
        `;

    container.appendChild(gameElement);
}

function vaciarCarrito() {
    carritoGuardar = [];
    // Limpiar el contenido actual en el contenedor
    videoGameList.innerHTML = '';

    // Mostrar un mensaje indicando que el carrito ha sido vaciado
    const mensajeVaciado = document.createElement('p');
    mensajeVaciado.innerHTML = '<string>¡El carrito ha sido vaciado!</string>';
    videoGameList.appendChild(mensajeVaciado);

    // Mostrar nuevamente los botones "Guardar en Carrito" y "Mostrar Carrito"
    
    document.getElementById('vaciarCarrito').style.display = 'none';
}
