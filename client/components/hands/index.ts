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

      render() {
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

        if (this.getAttribute("variant") == "selected") {
          piedra.addEventListener("click", () => {
            papel.classList.add("transparent");
            tijera.classList.add("transparent");
            state.setMove("piedra");
          });
        }
        if (this.getAttribute("variant") == "selected") {
          papel.addEventListener("click", () => {
            piedra.classList.add("transparent");
            tijera.classList.add("transparent");
            state.setMove("papel");
          });
        }
        if (this.getAttribute("variant") == "selected") {
          tijera.addEventListener("click", () => {
            papel.classList.add("transparent");
            piedra.classList.add("transparent");
            state.setMove("tijera");
          });
        }

        this.shadow.appendChild(style);
        this.shadow.appendChild(div);
      }
    }
  );
}
