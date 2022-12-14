import { Router } from "@vaadin/router";
import { state } from "../../state";

class NewGamePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    let shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");

    div.className = "box";

    div.innerHTML = `
    <h1 class="title">Piedra papel o tijera</h1>
    
    <label for="Nombre">Tu nombre</label>
    <form class="submit">
      <input type="text" name="nombre">
      <button class="button">Empezar</button>
    </form>
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

  label {
    font-size: 45px;
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
    background-color: #006CFC;
    font-size: 45px;
    border: 10px solid #001997;
    border-radius: 10px;
    min-width: 300px;
    height: 87px;
    font-family: Odibee sans;
    color: #D8FCFC;
    margin-top: 30px;
    }

    @media (min-width: 769px){
      .button {
        margin-top: 15px;
        margin-bottom: 20px;
        width: 336px;
        height: 87px;
      }
    }

    .submit{
      display: flex;
      flex-direction: column;
    }
  
    .hands{
      margin-top: 32px;
    }
  
    @media (min-width: 769px){
      .hands {
        margin-top: 0px;
      }
    }

  `;

    //////// IR A LA SIGUIENTE P??GINA /////////

    const form: any = div.querySelector(".submit");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target["nombre"].value;
      state.setMyName(name);

      if (!name) {
        alert("Ingrese nombre de usuario");
      } else {
        state.mySignUp(() => {
          state.askNewRoom(() => {
            state.accessExistentRoom();
            Router.go("/sharecode");
          });
        });
      }
    });

    shadow.appendChild(div);
    shadow.appendChild(style);
  }
}

customElements.define("newgame-page", NewGamePage);
