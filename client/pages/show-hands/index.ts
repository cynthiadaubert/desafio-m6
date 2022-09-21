import { state } from "../../state";

const imagePiedraURL = require("url:../../img/piedra.png");
const imagePapelURL = require("url:../../img/papel.png");
const imageTijeraURL = require("url:../../img/tijera.png");

export function handsPage(params) {
  const currentState = state.getState();
  const playerPlay = currentState.currentGame.myPlay;
  const pcPlay = currentState.currentGame.computerPlay;

  const div = document.createElement("div");
  div.className = "box";

  ////// COMPROBAR MOVIMIENTOS PARA MOSTRAR MANOS //////

  if (playerPlay == "piedra" && pcPlay == "papel") {
    div.innerHTML = `
        <img class="computer-hand" src=${imagePapelURL}>
        <img class="player-hand" src=${imagePiedraURL}>
        
        `;
  }
  if (playerPlay == "piedra" && pcPlay == "piedra") {
    div.innerHTML = `
        <img class="computer-hand" src=${imagePiedraURL}>
        <img class="player-hand" src=${imagePiedraURL}>
        
        `;
  }
  if (playerPlay == "piedra" && pcPlay == "tijera") {
    div.innerHTML = `
        <img class="computer-hand" src=${imageTijeraURL}>
        <img class="player-hand" src=${imagePiedraURL}>
        
        `;
  }
  if (playerPlay == "papel" && pcPlay == "papel") {
    div.innerHTML = `
        <img class="computer-hand" src=${imagePapelURL}>
        <img class="player-hand" src=${imagePapelURL}>
        
        `;
  }
  if (playerPlay == "papel" && pcPlay == "piedra") {
    div.innerHTML = `
        <img class="computer-hand" src=${imagePiedraURL}>
        <img class="player-hand" src=${imagePapelURL}>
        
        `;
  }
  if (playerPlay == "papel" && pcPlay == "tijera") {
    div.innerHTML = `
        <img class="computer-hand" src=${imageTijeraURL}>
        <img class="player-hand" src=${imagePapelURL}>
        
        `;
  }
  if (playerPlay == "tijera" && pcPlay == "tijera") {
    div.innerHTML = `
        <img class="computer-hand" src=${imageTijeraURL}>
        <img class="player-hand" src=${imageTijeraURL}>
        
        `;
  }
  if (playerPlay == "tijera" && pcPlay == "piedra") {
    div.innerHTML = `
        <img class="computer-hand" src=${imagePiedraURL}>
        <img class="player-hand" src=${imageTijeraURL}>
        
        `;
  }
  if (playerPlay == "tijera" && pcPlay == "papel") {
    div.innerHTML = `
        <img class="computer-hand" src=${imagePapelURL}>
        <img class="player-hand" src=${imageTijeraURL}>
        
        `;
  }

  ///////// ESTILOS /////////////

  const style = document.createElement("style");
  style.innerHTML = `

    .box {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .computer-hand {
        width: 102px;
        height: 230px;
        transform:rotate(180deg);
    }

    .player-hand {
        width: 102px;
        height: 230px;
        position: fixed;
        bottom: 0;

    }

    @media (min-width:769px) {
        .computer-hand {
            width: 157px;
            height: 320px;

        }
    }

    @media (min-width:769px) {
        .player-hand {
            width: 157px;
            height: 320px;
        } 
    }

    `;

  ////// PASAR A LA PÁGINA FINAL ///////

  setTimeout(() => {
    params.goTo("/results");
  }, 3000);

  div.appendChild(style);
  return div;
}
