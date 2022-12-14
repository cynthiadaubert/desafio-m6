import { Router } from "@vaadin/router";
import { state } from "../../state";

const imageWin = require("url:../../img/ganaste.png");
const imageLose = require("url:../../img/perdiste.png");
const imageTie = require("url:../../img/empate.png");

class ResultsPage extends HTMLElement {
  connectedCallback() {
    this.render();
    const currentState = state.getState();
    state.listenRoom(currentState.rtdbRoomId);
    state.subscribe(() => {});
  }

  render() {
    const box = document.createElement("div");
    const style = document.createElement("style");

    const currentState = state.getState();

    const myMove = currentState.roomData.playerOne.choice;
    const rivalMove = currentState.roomData.playerTwo.choice;

    //// SETEA LAS IMAGENES SEGUN SI GANA, PIERDE O EMPATA ////

    let res: string = state.whoWins(myMove, rivalMove);

    if (currentState.isPlayerOne == true && res == "win") {
      res = imageWin;
      box.className = "win";
    } else if (currentState.isPlayerOne == true && res == "lose") {
      res = imageLose;
      box.className = "lose";
    } else if (currentState.isPlayerTwo == true && res == "win") {
      res = imageLose;
      box.className = "lose";
    } else if (currentState.isPlayerTwo == true && res == "lose") {
      res = imageWin;
      box.className = "win";
    } else {
      res = imageTie;
      box.className = "tie";
    }

    //// MUESTRA EL SCORE CON LOS PUNTOS Y BOTONES ////

    box.innerHTML = `

    <div class="container">
      <img class="star" src=${res}>
      <div class="score">
        <h1 class="title">Score</h1>
        <div class="myPlay"> ${currentState.myName}:${currentState.history.me}</div>
        <div class="computerPlay"> ${currentState.rivalName}:${currentState.history.computer}</div>
      </div>

      <button-comp class="home">Volver a jugar</button-comp>
      <button-comp class="reset">Reiniciar puntaje</button-comp>
    </div>    
  `;

    box.style.height = "max-content";

    //// ESTILOS ////

    style.innerHTML = `

  .root {
    box-sizing: border-box;
    font-family: odibee sans;
    margin: 0 auto;
    height: 100%;
    
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

    state.setScore();

    //// BOTON VOLVER A JUGAR Y REINICIAR PUNTAJE ////

    const buttonElem: any = box.querySelector(".home");
    buttonElem.addEventListener("click", () => {
      if (currentState.isPlayerOne) {
        Router.go("/instr");
      } else if (currentState.isPlayerTwo) {
        Router.go("/instructions");
      }
    });

    const buttonReset: any = box.querySelector(".reset");
    buttonReset.addEventListener("click", async () => {
      const restart: any = state.restartValues();
      restart.then(() => {
        Router.go("/welcome");
      });
    });

    this.appendChild(box);
    this.appendChild(style);
  }
}
customElements.define("results-page", ResultsPage);
