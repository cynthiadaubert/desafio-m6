import { Router } from "@vaadin/router";
import { state } from "../../state";

class HandsPage extends HTMLElement {
  connectedCallback() {
    const currentState = state.getState();
    state.listenRoom(currentState.rtdbRoomId);

    const p1 = currentState.roomData.playerOne.choice;
    const p2 = currentState.roomData.playerTwo.choice;
    if (p1 == undefined) {
      state.setMyMove("null");
    }
    if (p2 == undefined) {
      state.setRivalMove("null");
    } /* else if (p1 && p2 == undefined) {
       Router.go("/results"); 
    }*/
    this.render();
  }

  render() {
    const imagePiedraURL = require("url:../../img/piedra.png");
    const imagePapelURL = require("url:../../img/papel.png");
    const imageTijeraURL = require("url:../../img/tijera.png");

    let shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.className = "box";

    const currentState = state.getState();
    const playerPlay = currentState.roomData.playerOne.choice;
    const pcPlay = currentState.roomData.playerTwo.choice;
    console.log("players showhands", playerPlay, pcPlay);

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
    if (playerPlay == "null" && pcPlay == "papel") {
      div.innerHTML = `
        <img class="computer-hand" src=${imagePapelURL}>
        <img class="player-hand" src=${imagePapelURL}>
        
        `;
    }
    if (playerPlay == "null" && pcPlay == "piedra") {
      div.innerHTML = `
        <img class="computer-hand" src=${imagePiedraURL}>
        <img class="player-hand" src=${imagePiedraURL}>
        
        `;
    }
    if (playerPlay == "null" && pcPlay == "tijera") {
      div.innerHTML = `
        <img class="computer-hand" src=${imageTijeraURL}>
        <img class="player-hand" src=${imageTijeraURL}>
        
        `;
    }
    if (playerPlay == "piedra" && pcPlay == "null") {
      div.innerHTML = `
        <img class="computer-hand" src=${imagePiedraURL}>
        <img class="player-hand" src=${imagePiedraURL}>
        
        `;
    }
    if (playerPlay == "papel" && pcPlay == "null") {
      div.innerHTML = `
        <img class="computer-hand" src=${imagePapelURL}>
        <img class="player-hand" src=${imagePapelURL}>
        
        `;
    }
    if (playerPlay == "tijera" && pcPlay == "null") {
      div.innerHTML = `
        <img class="computer-hand" src=${imageTijeraURL}>
        <img class="player-hand" src=${imageTijeraURL}>
        
        `;
    }
    if (playerPlay == "null" && pcPlay == "null") {
      div.innerHTML = `
      <h1>?</h1>
      <h1>?</h1>
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
      Router.go("/results");
    }, 5000);

    shadow.appendChild(div);
    shadow.appendChild(style);
  }
}
customElements.define("showhands-page", HandsPage);
