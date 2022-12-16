import { state } from "../../state";

const imagePiedraURL = require("url:../../img/piedra.png");
const imagePapelURL = require("url:../../img/papel.png");
const imageTijeraURL = require("url:../../img/tijera.png");

export function handsComp() {
  customElements.define(
    "hands-comp",

    class handsComp extends HTMLElement {
      shadow: ShadowRoot;
      type: string;

      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
      }

      connectedCallback() {
        this.render();
      }

      addListeners() {
        const handImg: any = document.querySelector(".hand");

        this.addEventListener("click", () => {
          const handSelectedEvent = new CustomEvent("handClick", {
            detail: {
              handMove: this.getAttribute("hand"),
            },
          });
          this.dispatchEvent(handSelectedEvent);
        });
      }

      render() {
        const currentState = state.getState();
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

        const piedra: any = div.querySelector(".piedra");
        const papel: any = div.querySelector(".papel");
        const tijera: any = div.querySelector(".tijera");

        /*         const handsSelect = div.querySelectorAll("hand");

        handsSelect.forEach((hand) => {
          hand.addEventListener("handClick", (e: any) => {
            const choice = e.detail.handMove;

            if (currentState.isPlayerOne == true) {
              state.setMyMove(choice);
              console.log(choice);
            } else {
              state.setRivalMove(choice);
              console.log(choice);
            }
          });
        }); */

        if (this.getAttribute("variant") == "selected") {
          piedra.addEventListener("click", () => {
            papel.classList.add("transparent");
            tijera.classList.add("transparent");
            if (currentState.isPlayerOne == true) {
              state.setMyMove("piedra");
              console.log("piedra, fue el jdr 1");
            } else {
              state.setRivalMove("piedra");
              console.log("piedra, jugador 2");
            }
          });
        }
        if (this.getAttribute("variant") == "selected") {
          papel.addEventListener("click", () => {
            piedra.classList.add("transparent");
            tijera.classList.add("transparent");
            if (currentState.isPlayerOne == true) {
              state.setMyMove("papel");
              console.log("papel, fue el jdr 1");
            } else {
              state.setRivalMove("papel");
              console.log("papel, jugador 2");
            }
          });
        }
        if (this.getAttribute("variant") == "selected") {
          tijera.addEventListener("click", () => {
            papel.classList.add("transparent");
            piedra.classList.add("transparent");
            if (currentState.isPlayerOne == true) {
              state.setMyMove("tijera");
              console.log("tijera, fue el jdr 1");
            } else {
              state.setRivalMove("tijera");
              console.log("tijera, jugador 2");
            }
          });
        }

        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
        this.addListeners();
      }
    }
  );
}
