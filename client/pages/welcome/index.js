"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
class WelcomePage extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
    <div class="box">
        <h1 class="title">Piedra papel o tijera</h1>
    
        <button-comp class="button">Nuevo juego</button-comp>
        <button-comp class="button-room">Ingresar a una sala</button-comp>
  
        <hands-comp class="hand"></hands-comp>
    </div>
   
      `;
        //////// ESTILOS //////////
        const style = document.createElement("style");
        style.innerHTML = `

    body {
    box-sizing: border-box;
    margin: 0 auto;
    height: fit-content;
    }

    .root {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: fit-content;
    }
  
    .box {
      display: flex;
      flex-direction: column;
      height: max-content;
      width: 375px;
      padding: 0px 35px 0px 35px;
      margin: 0 auto;
    }

    @media (min-width: 769px) {
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: max-content;
        max-width: 336px;
        margin: 0 auto;
        padding: 0px;
      }
    }

    .title {
      font-size: 80px;
      font-family: courier new;
      text-align: center;
      width: 284px;
      height 204px;
      font-style: bold;
      color: #009048;
      margin: 30px 0px 30px 0px ;
      padding; 0;
    }

    @media (min-width: 769px) {
      .title {
        font-size: 80px;
        width: 284px;
        height 204px;
        margin-top: 60px;
      }
    }

    .hand {
      margin-top: 42px;
      mergin-bottom: 0;
      padding: 0;
    }

    `;
        //////// IR A LA SIGUIENTE PÁGINA /////////
        const buttonElem = document.querySelector("button-comp");
        buttonElem.addEventListener("click", () => {
            router_1.Router.go("/newgame");
        });
        const buttonRoom = document.querySelector(".button-room");
        buttonRoom.addEventListener("click", () => {
            router_1.Router.go("/openroom");
        });
        this.appendChild(style);
    }
}
customElements.define("welcome-page", WelcomePage);
