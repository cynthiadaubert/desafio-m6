"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
const state_1 = require("../../state");
class HandsPage extends HTMLElement {
    connectedCallback() {
        const currentState = state_1.state.getState();
        state_1.state.listenRoom(currentState.rtdbRoomId);
        this.render();
    }
    async render() {
        const imagePiedraURL = require("url:../../img/piedra.png");
        const imagePapelURL = require("url:../../img/papel.png");
        const imageTijeraURL = require("url:../../img/tijera.png");
        let shadow = this.attachShadow({ mode: "open" });
        const div = document.createElement("div");
        div.className = "box";
        try {
            const currentState = state_1.state.getState();
            await state_1.state.getPlayerChoices(() => {
                const playerPlay = currentState.roomData.playerOne.choice;
                const pcPlay = currentState.roomData.playerTwo.choice;
                /*   console.log("players showhands", playerPlay, pcPlay); */
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
                if ((playerPlay == "null" || undefined) && pcPlay == "papel") {
                    div.innerHTML = `
          <img class="computer-hand" src=${imagePapelURL}>
          <img class="player-hand" src=${imagePapelURL}>
          
          `;
                }
                if ((playerPlay == "null" || undefined) && pcPlay == "piedra") {
                    div.innerHTML = `
          <img class="computer-hand" src=${imagePiedraURL}>
          <img class="player-hand" src=${imagePiedraURL}>
          
          `;
                }
                if ((playerPlay == "null" || undefined) && pcPlay == "tijera") {
                    div.innerHTML = `
          <img class="computer-hand" src=${imageTijeraURL}>
          <img class="player-hand" src=${imageTijeraURL}>
          
          `;
                }
                if (playerPlay == "piedra" && (pcPlay == "null" || undefined)) {
                    div.innerHTML = `
          <img class="computer-hand" src=${imagePiedraURL}>
          <img class="player-hand" src=${imagePiedraURL}>
          
          `;
                }
                if (playerPlay == "papel" && (pcPlay == "null" || undefined)) {
                    div.innerHTML = `
          <img class="computer-hand" src=${imagePapelURL}>
          <img class="player-hand" src=${imagePapelURL}>
          
          `;
                }
                if (playerPlay == "tijera" && (pcPlay == "null" || undefined)) {
                    div.innerHTML = `
          <img class="computer-hand" src=${imageTijeraURL}>
          <img class="player-hand" src=${imageTijeraURL}>
          
          `;
                }
                if (playerPlay && pcPlay == ("null" || undefined)) {
                    div.innerHTML = `

          <h1 class="pep">?</h1>
          <h1 class="pep">?</h1>
          `;
                }
            });
        }
        catch (err) {
            console.log(err);
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

    .pep{
      font-size: 80px;
      padding: 30px 0px 30px 0px;
    }
    `;
        ////// PASAR A LA PÁGINA FINAL ///////
        setTimeout(() => {
            router_1.Router.go("/results");
        }, 4000);
        shadow.appendChild(div);
        shadow.appendChild(style);
    }
}
customElements.define("showhands-page", HandsPage);
