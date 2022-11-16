import { initRouter } from "../../router";
import { state } from "../../state";

export function shareCodePage(params) {
  const div = document.createElement("div");
  div.className = "box";

  div.innerHTML = `
 
    <div class="info">
    
      <div class="points">
        <div class="user-box">
          <div class="user-room">${state.data.myName}: ${state.data.history.me} </div>
          <div class="user-room two">${state.data.rivalName}: ${state.data.history.computer} </div>
        </div>
      </div>

      <div class="room">
      
        <div>Sala</div>
        <div class="roomId">${state.data.roomId}</div>
      
      </div>

    </div>
    

    <h1 class="courier">Compartí el código:</h1> 

      <h1 class="short-code courier">${state.data.roomId}</h1>
    
    <h1 class="courier">con tu contrincante</h1>
    <h1 class="lil courier">Esperando conexión...</h1>
    <h1 class="lil courier on">Conectado a la sala</h1>
    
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
      height: vh;
      max-width: 400px;
      margin-top: 31px;
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

  //////// IR A LA SIGUIENTE PÁGINA /////////

  /*   if (state.data.myName || state.data.rivalName) {
    state.setStart(true);

    params.goTo("/instructions"); 
    console.log("conectado", state.data.myStart, state.data.myStart);
  } */

  div.appendChild(style);
  return div;
}
