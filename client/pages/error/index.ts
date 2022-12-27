import { Router } from "@vaadin/router";

class ErrorPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    let shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.className = "box";

    div.innerHTML = `
 
    <h1 class="title">Piedra papel o tijera</h1>
    <div class="text">Ups, esta sala está completa o tu código no coincide con ninguna sala.</div>
    <button-comp class="button">Volver</button-comp>
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
    height: 100vh;
    width: 375px;
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
    margin: 50px 0px 30px 0px ;
    padding; 0;
  }

  @media (min-width: 769px) {
    .title {
      font-size: 62px;
      width: 284px;
      height 204px;
      margin-top: 60px;
    }
  }

  .hands {
    margin-top: 30px;
  }

  @media (min-width: 769px) {
    .hands {
      position:fixed;
      bottom:0px;
      margin-top: 0px;
    }
  }
  
  .text {
      font-size: 28px;
      font-family: courier new;
      width: 316px;
      height 240px;
      font-weight: bold;
      text-align: center;
      margin: 0px 0px 20px 0px;
      padding: 0;
    }
  
    @media (min-width: 769px) {
      .text {
        font-size: 28px;
        width: 100%;
        height 100%;
      }
    }
    
  `;

    //////// IR A LA SIGUIENTE PÁGINA /////////

    const buttonElem: any = div.querySelector("button-comp");

    buttonElem.addEventListener("click", () => {
      Router.go("/welcome");
    });

    shadow.appendChild(div);
    shadow.appendChild(style);
  }
}
customElements.define("error-page", ErrorPage);
