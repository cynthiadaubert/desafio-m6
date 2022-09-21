import { initRouter } from "../../router";

export function welcomePage(params) {
  const div = document.createElement("div");
  div.className = "box";

  div.innerHTML = `
 
    <h1 class="title">Piedra papel o tijera</h1>
    
    <button-comp class="button">Nuevo juego</button-comp>
    <button-comp class="button-room">Ingresar a una sala</button-comp>
    
    <hands-comp class="hand"></hands-comp>
   
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
    height: 100vh;
    width: 375px;
    padding: 0px 35px 0px 35px;
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
    font-size: 62px;
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

  .hands{
    margin-top: 38px;
  }

  `;

  //////// IR A LA SIGUIENTE PÁGINA /////////

  const buttonElem: any = div.querySelector("button-comp");

  buttonElem.addEventListener("click", () => {
    params.goTo("/newgame");
  });

  const buttonRoom: any = div.querySelector(".button-room");

  buttonRoom.addEventListener("click", () => {
    params.goTo("/openroom");
  });

  div.appendChild(style);
  return div;
}
