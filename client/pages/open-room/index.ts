import { Router } from "@vaadin/router";
import { state } from "../../state";

class OpenRoomPage extends HTMLElement {
  connectedCallback() {
    this.render();

    /*  state.initState();
    const cs = state.getState();
    if (cs.rtdbRoomId) {
      console.log("ok");
    } */
  }

  render() {
    const currentState = state.getState();

    this.innerHTML = `
    <div class="box">
   
      <h1 class="title">Piedra papel o tijera</h1>
  
      <form class="submit">
        <input type="text" placeholder="Ingresar código" name="codigo">
        <input type="text" placeholder="Tu nombre" name="name">
        <button class="button">Empezar</button>
      </form>
      
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
      width: 100vw;
      height: max-content;
    }
  
    @media (min-width: 769px) {
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
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
      margin: 50px 0px 50px ;
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
  
    input {
      height: 84px;
      width: 300px;
      padding: 0px;
      margin-bottom: 20px;
      border: 10px solid #182460; 
      font-size: 32px;
      text-align: center;
    }
  
    @media (min-width: 769px) {
      input {
        width: 330px;
      }
    }
  
    .button {
      margin-bottom: 38px;
    }
  
    .button {
      
      background-color: #006CFC;
      font-size: 45px;
      border: 10px solid #001997;
      border-radius: 10px;
      min-width: 300px;
      height: 87px;
      font-family: Odibee sans;
      color: #D8FCFC;
      margin-top: 20px;
    }
  
      @media (min-width: 769px){
        .button {
          margin-top: 0px;
          margin-bottom: 20px;
          width: 336px;
          height: 87px;
        }
      }

      .submit{
        display: flex;
        flex-direction: column;
      }
    
    `;
    //////// IR A LA SIGUIENTE PÁGINA /////////

    const form = document.querySelector(".submit") as any;

    form!.addEventListener("submit", (e) => {
      const cs = state.getState();
      e.preventDefault();
      const target = e.target as any;
      const roomCode = target["codigo"].value;
      const rivalName = target["name"].value;
      state.setRivalName(rivalName);
      state.setState(cs);

      /*   state.listenRoom(currentState.rtdbRoomId); */

      /*  console.log("current state", state.data.roomId); */
      if (!roomCode) {
        alert("Ingrese el código de la room");
      } else if (!rivalName) {
        alert("Ingrese su nombre de usuario");
      } /* if (roomCode == state.data.roomId) */ else {
        state.rivalSignUp(() => {
          state.setRtdbRivalValues(() => {
            if (
              cs.roomData.playerTwo.name &&
              location.pathname == "/openroom"
            ) {
              console.log("ya hay dos jugadores");
              Router.go("/error");
            } else {
              state.accessExistentRoom();
              Router.go("/instructions");
            }
          });
        });
      } /* else {
        console.log("el código no coincide con el state");
        Router.go("/error");
      } */
    });

    this.appendChild(style);
  }
}
customElements.define("open-room", OpenRoomPage);
