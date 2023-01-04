"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handsComp = void 0;
const state_1 = require("../../state");
const imagePiedraURL = require("url:../../img/piedra.png");
const imagePapelURL = require("url:../../img/papel.png");
const imageTijeraURL = require("url:../../img/tijera.png");
function handsComp() {
    customElements.define("hands-comp", class handsComp extends HTMLElement {
        shadow;
        type;
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
            this.render();
        }
        render() {
            const currentState = state_1.state.getState();
            const div = document.createElement("div");
            const style = document.createElement("style");
            div.className = "hands";
            div.innerHTML = `
  
          <img variant="selected" class="piedra hand" src=${imagePiedraURL}>
          <img variant="selected" class="papel hand" src=${imagePapelURL}>
          <img variant="selected" class="tijera hand" src=${imageTijeraURL}>
  
        `;
            style.innerHTML = `

          img {
            width: 56px,
            height: 126px;
          }

          @media (min-width:769px) {
            img{
              width: 60px;
              height: 120px;
            }
          }

          .piedra {
              padding-right: 40px;
          }

          .papel {
              padding-right:40px;
          }

          @media (min-width:769px){
            .hands {
              width: max-content;
              height: 120px;
              bottom: 0;
              margin-top: 20px;
              padding: 0;
            }
          }

          .transparent {
              opacity: 0.5;
          }
            
          `;
            const piedra = div.querySelector(".piedra");
            const papel = div.querySelector(".papel");
            const tijera = div.querySelector(".tijera");
            if (this.getAttribute("variant") == "selected") {
                piedra.addEventListener("click", () => {
                    papel.classList.add("transparent");
                    tijera.classList.add("transparent");
                    if (currentState.isPlayerOne == true) {
                        state_1.state.setMyMove("piedra");
                        console.log("piedra, JUGADOR 1");
                    }
                    else {
                        state_1.state.setRivalMove("piedra");
                        console.log("piedra, JUGADOR 2");
                    }
                });
            }
            if (this.getAttribute("variant") == "selected") {
                papel.addEventListener("click", () => {
                    piedra.classList.add("transparent");
                    tijera.classList.add("transparent");
                    if (currentState.isPlayerOne == true) {
                        state_1.state.setMyMove("papel");
                        console.log("papel, JUGADOR 1");
                    }
                    else {
                        state_1.state.setRivalMove("papel");
                        console.log("papel, jugador 2");
                    }
                });
            }
            if (this.getAttribute("variant") == "selected") {
                tijera.addEventListener("click", () => {
                    papel.classList.add("transparent");
                    piedra.classList.add("transparent");
                    if (currentState.isPlayerOne == true) {
                        state_1.state.setMyMove("tijera");
                        console.log("tijera, JUGADOR 1");
                    }
                    else {
                        state_1.state.setRivalMove("tijera");
                        console.log("tijera, jugador 2");
                    }
                });
            }
            this.shadow.appendChild(style);
            this.shadow.appendChild(div);
        }
    });
}
exports.handsComp = handsComp;
