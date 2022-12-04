import { Router } from "@vaadin/router";
import { state } from "../../state";

class ShareCodePage extends HTMLElement {
  connectedCallback() {
    const currentState = state.getState();
    state.setRtdbMyValues();

    /* state.listenRoom(); */
    /* console.log(currentState, "current state en share code"); */

    state.subscribe(() => {
      if (
        currentState.roomData["current-game"].online === true &&
        window.location.pathname == "/sharecode"
      ) {
        console.log("online");
        /*       Router.go("/instr");  */
      }
      this.render();
    });
  }

  render() {
    const currentState = state.getState();

    this.innerHTML = `
 
    <div class="box">
    <div class="info">
    
      <div class="points">
        <div class="user-box">
          <div class="user-room">${state.data.myName}: ${state.data.history.me} </div>
        </div>
      </div>
      <div class="room">
      
        <div>Sala</div>
        <div class="roomId">${currentState.roomId}</div>
      
      </div>
    </div>
    
    <h1 class="courier">Compartí el código:</h1> 
      <h1 class="short-code courier">${currentState.roomId}</h1>
    
    <h1 class="courier">con tu contrincante</h1>
    <h1 class="lil courier">Esperando conexión...</h1>
    <h1 class="lil courier on">Conectado a la sala</h1>
    
    <hands-comp class="hands"></hands-comp>
   </div>
  `;

    //////// ESTILOS //////////

    const style = document.createElement("style");
    style.innerHTML = `
    body {
      box-sizing: border-box;
      margin: 0 auto;
    }
    .root {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      width: 100vw;
      height: 100vh;
    }
    @media (min-width: 769px) {
      .box {
      display: flex;
      flex-direction: column;
      max-width: 400px;
      margin: 0 auto;
      padding-top: 30px;
      }
    }
    .info {
      font-size: 24px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 0;
      padding: 0;
    }
    @media (min-width: 769px) {
        .info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 400px;
        margin-bottom: 120px;
      }
    }
    h1 {
      font-size: 35px;
    }
    .short-code {
      font-size: 48px;
      font-weight: bold;
    }
    .courier {
      font-family: Courier New;
      text-align: center;
    }
    @media (min-width: 769px) {
      .room {
        font-size: 24px;
        font-family: Courier New;
        font-weight: bold;
        margin: 0;
        padding: 0;
      }
    } 
  
    @media (min-width: 769px) {
        .user-room, roomId {
        font-size: 24px;
        font-family: Courier New;
        font-weight: bold;
      }
    }
    .two {
      color: #FF6442;
    }
    .points {
      margin-right: 100px;
      padding: 0;
    }
    @media (min-width: 769px) {
        .points{
        margin: 0;
        padding: 0;
      }
    }
    .lil {
      font-size: 24px;
    }
    .on {
      display: none;
    }
  `;

    this.appendChild(style);
  }
}
customElements.define("sharecode-page", ShareCodePage);
