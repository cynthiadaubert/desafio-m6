import { Router } from "@vaadin/router";
import { state } from "../../state";

class WaitingPage extends HTMLElement {
  connectedCallback() {
    this.render();

    this.addListeners();

    state.subscribe(() => {
      this.render;
    });
  }

  addListeners() {
    state.setMyStart(async () => {
      try {
        await state.listenStart();
      } catch (err) {
        console.log(err);
      }
    });

    // When the tab is closed, change the ready status to false
    /*     window.onbeforeunload = () => {
      state.changeReadyStatus(false, () => {
        return;
      });
    }; */
  }
  render() {
    const currentState = state.getState();

    let { rivalName } = currentState;

    rivalName = rivalName || "rival";

    let shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.className = "box";

    div.innerHTML = `
 
    <div class="info">
    
      <div class="points">
        <div class="user-box">
          <div class="user-room">${state.data.myName}: ${state.data.history.me}</div>
          <div class="user-room two">${state.data.rivalName}: ${state.data.history.computer} </div>
        </div>
      </div>

      <div class="room">
      
        <div>Sala</div>
        <div class="roomId">${state.data.roomId}</div>
      
      </div>

    </div>
    

    <h1 class="courier">Esperando a que ${state.data.myName} presione ¡Jugar!...</h1> 
    
    <hands-comp class="hands"></hands-comp>
   
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
      align-items: center;
      justify-content: space-between;
      height: 380px;
      max-width: 400px;
      padding-top: 30px; 
      margin: 0 auto;
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
      margin-bottom: 180px;
    }
  }

  h1 {
    font-size: 35px;
    width: 300px;
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
     .courier{
      font-size: 42px;
      width: 100%;
      height 100%;
      margin-bottom: 195px;
    }
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


  `;

    shadow.appendChild(div);
    shadow.appendChild(style);
  }
}
customElements.define("waiting-page", WaitingPage);
