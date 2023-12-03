    const apiKey = 'dd5f2a8446fd4105a5a4bf528ff33999';
    const videoGameList = document.getElementById('videoGame-container');
    let carritoGuardar = [];
    let tipoVideogame = [];

    document.getElementById('search').addEventListener('click', () => {
    displayVideoGame();
    });

    document.getElementById('carroGuardar').addEventListener('click', () => {
    buttoncarritoGuardar();
    });

    document.getElementById('mostrarGuardados').addEventListener('click', () => {
        mostrarJuegosGuardados();
    });

    async function displayVideoGame() {
    videoGameList.innerHTML = ''; // Limpiar el contenido actual
        
    // Mostrar los botones "Guardar en Carrito" y "Mostrar Carrito"
    document.getElementById('carroGuardar').style.display = 'inline-block';
    document.getElementById('mostrarGuardados').style.display = 'inline-block';

    const gameName = document.getElementById('nameGame').value;
    const videoGame = await getVideoGame(gameName);

    if (!gameName) {
        alert("Favor de ingresar un juego en el buscador");
    } else if (videoGame) {
        addVideoGame(videoGame);
    } else {
        const errorMessage = document.createElement('p');
        errorMessage.innerHTML = '<string>No se ha encontrado su video juego</string>';
        videoGameList.appendChild(errorMessage);
    }
    }

    async function getVideoGame(name) {
    try {
        let response = await fetch(`https://api.rawg.io/api/games/${name}?key=${apiKey}`);
        if (response.ok) {
        return await response.json();
        } else {
        throw new Error(`Error de red: ${response.status}`);
        }
    } catch (error) {
        console.log(error);
    }
    }

    function addVideoGame(videoGame) {
    const element = document.createElement('div');
    const genresList = videoGame.genres.map((genre) => genre.name);
    element.innerHTML = `
        <img src="${videoGame.background_image}" alt="${videoGame.name}">
        <strong>Id</strong>: ${videoGame.id}
        <strong>Name</strong>: ${videoGame.name}
        <strong>Description</strong>: ${videoGame.description}
        <strong>Fecha de lanzamiento</strong>: ${videoGame.released}
        <strong>Genero</strong>: ${genresList.join(', ')}
    `;
    videoGameList.appendChild(element);
    }
    async function buttoncarritoGuardar() {
        const gameName = document.getElementById('nameGame').value;
        if (gameName) {
        const newVideoGame = await getVideoGame(gameName);
        if (newVideoGame) {
            const isAlreadyInCart = carritoGuardar.some((game) => game && game.id === newVideoGame.id);
            if (!isAlreadyInCart) {
            carritoGuardar.push(newVideoGame);
            console.log('Juego agregado al carrito:', newVideoGame.name);
            } else {
            console.log('El juego ya está en el carrito:', newVideoGame.name);
            }
        } else {
            console.log('No se encontró información para el juego:', gameName);
        }
        }
    }

    function mostrarJuegosGuardados() {
        videoGameList.innerHTML = ''; // Limpiar el contenido actual
    
        if (carritoGuardar.length === 0) {
            const carritoVacio = document.createElement('h1');
            carritoVacio.innerHTML = '<string>No has guardado juegos</string>';
            videoGameList.appendChild(carritoVacio);
            return;
        }
    
        // Ocultar los botones "Guardar en Carrito" y "Mostrar Carrito"
        document.getElementById('carroGuardar').style.display = 'none';
        document.getElementById('mostrarGuardados').style.display = 'none';
    
        // Ordenar por nombre
        carritoGuardar.sort((a, b) => a.name.localeCompare(b.name));
    
        // Mostrar los videojuegos ordenados
        displaySortedVideoGames();
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
        const genresList = videoGame.genres.map(genre => genre.name);
    
        const gameElement = document.createElement('div');
        gameElement.innerHTML = `
            <img src="${videoGame.background_image}" alt="${videoGame.name}">
            <strong>Id</strong>: ${videoGame.id}
            <strong>Name</strong>: ${videoGame.name}
            <strong>Description</strong>: ${videoGame.description}
            <strong>Fecha de lanzamiento</strong>: ${videoGame.released}
            <strong>Genero</strong>: ${genresList.join(', ')}
        `;
    
        container.appendChild(gameElement);
    }
        
