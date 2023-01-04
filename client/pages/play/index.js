"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
const state_1 = require("../../state");
class PlayPage extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    async getResults() {
        const cs = state_1.state.getState();
        try {
            await state_1.state.getPlayerChoices(() => {
                const p1 = cs.roomData.playerOne.choice;
                const p2 = cs.roomData.playerTwo.choice;
                /*     console.log("get results", cs.roomData); */
                if (!p1) {
                    state_1.state.setMyMove("null");
                    /*    console.log("mi move es null"); */
                }
                if (!p2) {
                    state_1.state.setRivalMove("null");
                    /*   console.log("rival es null"); */
                }
                else if (!p1 && !p2) {
                    state_1.state.setMyMove("null");
                    state_1.state.setRivalMove("null");
                    /*     console.log("ambos null"); */
                }
                router_1.Router.go("/showhands");
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    render() {
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
        const currentState = state_1.state.getState();
        let counter = 5;
        const countdownElem = document.querySelector(".circle");
        const intervalId = setInterval(() => {
            countdownElem.innerHTML = `${counter}`;
            counter--;
            if (counter < 0) {
                clearInterval(intervalId);
                this.getResults(); /* .then(() => {
                  Router.go("/showhands");
                }); */
                /* state.getPlayerChoices(async () => {
                  const p1 = currentState.roomData.playerOne.choice;
                  const p2 = currentState.roomData.playerTwo.choice;
                  try {
                    await console.log("?");
                    if (p1 && p2 == undefined) {
                      console.log("sin definir");
                      Router.go("/results");
                    }
                  } catch (err) {
                    console.log(err);
                  }
                }); */
                /*  Router.go("/showhands"); */
            }
        }, 1000);
        this.appendChild(style);
    }
}
customElements.define("play-page", PlayPage);
