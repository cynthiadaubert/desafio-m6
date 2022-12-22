import { Router } from "@vaadin/router";
import { state } from "../../state";

class PlayPage extends HTMLElement {
  connectedCallback() {
    this.render();
    /*     state.subscribe(() => {});
    this.render(); */
  }

  render() {
    /*    const div = document.createElement("div"); */
    this.className = "container-play";

    this.innerHTML = `
 
    <div class=circle></div>
      <hands-comp class="hands" variant="selected"></hands-comp>
  `;
    //////* ESTILOS *//////

    const style = document.createElement("style");
    style.innerHTML = `

  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 118px 0px 80px 0px;
    width: 100%;
  }

  @media (min-width:769px) {
    .root {
      height: 100vh;
      width: 100%;
    }
  }

  .container-play{
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding-top: 80px;
  }

  @media (min-width: 769px) {
    .container-play {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: max-content;
      max-width: 500px;
      margin: 0 auto;
      padding-top: 80px;
    }
  }

  .circle {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 243px;
    height: 243px;
    padding: 20px 0px 0px 0px;
    margin-bottom: 80px;
    background-color: none;
    border: 24px solid #000;
    color: #000;
    text-align: center;
    font-family: arial black;
    font-size: 100px;
    animation: loading 3s forwards;
    animation-delay: 1s;
  }

  .hands {
    margin: 0;
    position: fixed;
    bottom: 0;
  }

  @keyframes loading {

    0% {
      
      border-top: 24px solid grey;
      border-right: 24px solid black;
      border-bottom: 24px solid black;
      border-left: 24px solid black;
    }

    25% {
  
      border-right: 24px solid grey;
      border-bottom: 24px solid black;
      border-left: 24px solid black;
    }

    75% {
      
      border-right: 24px solid white;
      border-bottom: 24px solid white;
      border-left: 24px solid black;
    }

    100% {
      border-top: 24px solid white;
      border-right: 24px solid white;
      border-bottom: 24px solid white;
      border-left: 24px solid white;
    }

    .transparent {
      opacity: 50%;
    }

  }

  `;

    ///// CUENTA ATRÁS DEL CÍRCULO ////

    const currentState = state.getState();

    let counter = 5;

    const countdownElem = document.querySelector(".circle") as any;

    const intervalId = setInterval(() => {
      countdownElem.innerHTML = `${counter}`;
      counter--;
      if (counter < 0) {
        /* if (
          currentState.isPlayerOne == true &&
          currentState.currentGame.myPlay == ""
        ) {
          state.setMyMove("null");
              state.setState(currentState); 
          console.log("soy null");
          Router.go("/instr");
        } else if (
          currentState.isPlayerTwo == true &&
          currentState.currentGame.computerPlay == ""
        ) {
          state.setRivalMove("null");
          /*    state.setState(currentState); 
          console.log("rival es null");
          Router.go("/instructions");
        }*/
        clearInterval(intervalId);

        /*  Router.go("/showhands"); */
      }
    }, 1000);

    ////// TIMEOUT PARA PASAR A LAS MANOS //////

    /*     const handsContainer: any = document.querySelector(".hands");

    handsContainer.addEventListener("click", () => {
      console.log("cliqueaste mano");
      clearInterval(intervalId);
      setTimeout(() => {
        Router.go("/showhands");
      }, 1000);
    }); */

    /* shadow.appendChild(div); */
    this.appendChild(style);
  }
}
customElements.define("play-page", PlayPage);
