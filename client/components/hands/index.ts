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
        /* this.type = this.getAttribute("type") */
      }

      connectedCallback() {
        this.render();
      }

      render() {
        const currentState = state.getState();
        const div = document.createElement("div");
        const style = document.createElement("style");
        div.className = "hands";

        div.innerHTML = `
  
          <img variant="selected" class="piedra" src=${imagePiedraURL}>
          <img variant="selected" class="papel" src=${imagePapelURL}>
          <img variant="selected" class="tijera" src=${imageTijeraURL}>
  
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

        /*         if (
          currentState.myName == "" &&
          currentState.currentGame.computerPlay == ""
        ) {
          state.setRivalMove("");
        } else if (
          currentState.rivalName == "" &&
          currentState.currentGame.myPlay == ""
        ) {
          state.setMyMove("");
        } */

        if (
          currentState.myName == "" &&
          this.getAttribute("variant") == "selected"
        ) {
          piedra.addEventListener("click", () => {
            papel.classList.add("transparent");
            tijera.classList.add("transparent");
            state.setRivalMove("piedra");
            console.log("el rival eligio piedra");
          });
        } else if (
          currentState.rivalName == "" &&
          this.getAttribute("variant") == "selected"
        ) {
          piedra.addEventListener("click", () => {
            papel.classList.add("transparent");
            tijera.classList.add("transparent");
            state.setMyMove("piedra");
            console.log("elegiste piedra");
          });
        }

        if (
          currentState.myName == "" &&
          this.getAttribute("variant") == "selected"
        ) {
          papel.addEventListener("click", () => {
            piedra.classList.add("transparent");
            tijera.classList.add("transparent");
            state.setRivalMove("papel");
            console.log("el rival eligio papel");
          });
        } else if (
          currentState.rivalName == "" &&
          this.getAttribute("variant") == "selected"
        ) {
          papel.addEventListener("click", () => {
            piedra.classList.add("transparent");
            tijera.classList.add("transparent");
            state.setMyMove("papel");
            console.log("elejiste papel");
          });
        }

        if (
          currentState.myName == "" &&
          this.getAttribute("variant") == "selected"
        ) {
          tijera.addEventListener("click", () => {
            papel.classList.add("transparent");
            piedra.classList.add("transparent");
            state.setRivalMove("tijera");
            console.log("el rival eligio tijera");
          });
        } else if (
          currentState.rivalName == "" &&
          this.getAttribute("variant") == "selected"
        ) {
          tijera.addEventListener("click", () => {
            papel.classList.add("transparent");
            piedra.classList.add("transparent");
            state.setMyMove("tijera");
            console.log("lelegiste tijera");
          });
        }

        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
      }
    }
  );
}
