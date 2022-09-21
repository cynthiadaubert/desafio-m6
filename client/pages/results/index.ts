import { state } from "../../state";

const imageWin = require("url:../../img/ganaste.png");
const imageLose = require("url:../../img/perdiste.png");
const imageTie = require("url:../../img/empate.png");

export function resultsPage(params) {
  const box = document.createElement("div");
  const style = document.createElement("style");

  const currentState = state.getState();

  //// SETEA LAS IMAGENES SEGUN SI GANA, PIERDE O EMPATA ////
  let res = state.whoWins();

  if (state.whoWins() == "win") {
    res = imageWin;
  } else if (state.whoWins() == "lose") {
    res = imageLose;
  } else {
    res = imageTie;
  }

  //// MUESTRA EL SCORE CON LOS PUNTOS Y BOTONES ////
  box.innerHTML = `

    <div class="container">
      <img class="star" src=${res}>
      <div class="score">
        <h1 class="title">Score</h1>
        <div class="myPlay"> Vos:${currentState.history.me}</div>
        <div class="computerPlay"> Máquina:${currentState.history.computer}</div>
      </div>

      <button-comp class="home">Volver a jugar</button-comp>
      <button-comp class="reset">Reiniciar puntaje</button-comp>
    </div>    
  `;

  //// ESTILOS ////
  style.innerHTML = `

  .root {
    box-sizing: border-box;
    font-family: odibee sans;
    margin: 0 auto;
    height: 100%;
    padding: 35px 0px 35px 0px;
  }

  .star {
      height: 254px;
      width: 254px;
      margin-bottom: 20px;
    }

  .container {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
  }
  
  .win {
    background-color: rgba(136, 137, 73, 0.9);
    height: 100vh;
  }
  
  .lose {
    background-color: rgba(137, 73, 73, 0.9);
    height: 100vh;
  }

  .tie {
    background-color: rgba(139, 76, 167, 0.9);
    height: 100vh;
  }

  @media (min-width: 769px) {
    .container {
      height: 800px; 
    }
  }

  .title {
    font-size: 55px;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 769px) {
    .title {
      font-size: 80px;
    }
  }

  .score {
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 45px;
      border: solid 10px black;
      border-radius: 10px;
      width: 260px;
      height: 217px;
  }

  @media (min-width: 769px) {
    .score {
      width: 400px;
      height: 380px;
    }
  }

  .myPlay {
      text-align: right;
      margin-right: 10px;

  }
  .computerPlay {
      text-align: right;
      margin-right: 10px;
  }

  .home {
    margin-top: 20px;
  }

  .reset {
    margin-bottom: 35px;
  }

  `;

  //// COLOR DE FONDO SEGUN RESULTADO ////

  let result = state.whoWins();

  if (state.whoWins() == "win") {
    result = "win";
  } else if (state.whoWins() == "lose") {
    result = "lose";
  } else {
    result = "tie";
  }

  document.body.className = result;

  //// BOTON VOLVER A JUGAR Y REINICIAR PUNTAJE ////

  const buttonElem: any = box.querySelector(".home");
  buttonElem.addEventListener("click", () => {
    params.goTo("/play");
  });

  const buttonReset: any = box.querySelector(".reset");
  buttonReset.addEventListener("click", () => {
    (state.data.history.computer = 0), (state.data.history.me = 0);
    params.goTo("/welcome");
    console.log("puntaje reiniciado");
  });

  box.appendChild(style);
  return box;
}

/* localStorage.setItem(
  "saved-data",
  JSON.stringify({
    currentGame: {
      computerPlay: "",
      myPlay: "",
    },

    history: {
      computer: 0,
      me: 0,
    },
  })
); */
