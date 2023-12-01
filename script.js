const apiKey = 'dd5f2a8446fd4105a5a4bf528ff33999';  // Reemplaza con tu clave de API de RAWG
const videoGameList = document.getElementById('videoGame-container');

document.getElementById('search').addEventListener('click', () => {
  displayVideoGame();
});


const gameId =3790; 
async function displayVideoGame() {
  const gameName = document.getElementById('nameGame').value;
  const videoGame = await getVideoGame(gameName);
  if(!gameName){
      const inputError=document.createElement('p');
      inputError.innerHTML='<string>Por favor, ingrese el nombre de un Pokémon</string>';
      videoGameList.appendChild(inputError);  
  }else if (videoGame) {
      addVideoGame(videoGame);
  } else {
      const Errormessage = document.createElement('p');
      Errormessage.innerHTML = '<string>Lo Sentimos, no se ha encontrado el Pokémon deseado</string>';
      videoGameList.appendChild(Errormessage);
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
  const genresList = videoGame.genres.map(genre => genre.name);
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


