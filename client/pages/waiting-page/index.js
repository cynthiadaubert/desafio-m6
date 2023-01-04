"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("../../state");
class WaitingPage extends HTMLElement {
    connectedCallback() {
        const cs = state_1.state.getState();
        const rtdbRoomId = cs.rtdbRoomId;
        state_1.state.listenConnectedPlayers() == false
            ? state_1.state.getPlayersStart(rtdbRoomId)
            : console.log("status checked");
        state_1.state.subscribe(() => {
            this.render();
        });
        this.render();
    }
    render() {
        const currentState = state_1.state.getState();
        this.className = "box";
        this.innerHTML = `
 
    <div class="info">
    
      <div class="points">
        <div class="user-box">
          <div class="user-room">${currentState.myName}: ${currentState.history.me}</div>
          <div class="user-room two">${currentState.rivalName}: ${currentState.history.computer} </div>
        </div>
      </div>

      <div class="room">
      
        <div>Sala</div>
        <div class="roomId">${currentState.roomId}</div>
      
      </div>

    </div>
    

    <h1 class="courier">Esperando a que el oponente presione ¡Jugar!...</h1> 
    
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
        this.appendChild(style);
    }
}
customElements.define("waiting-page", WaitingPage);
