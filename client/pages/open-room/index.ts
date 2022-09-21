import { initRouter } from "../../router";

export function openRoomPage(params) {
  const div = document.createElement("div");
  div.className = "box";

  div.innerHTML = `
 
    <h1 class="title">Piedra papel o tijera</h1>
    
    <input type="text" placeholder="Ingresar código" name="Codigo"/>
    <button-comp class="button">Empezar</button-comp>
    
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
  
  `;

  //////// IR A LA SIGUIENTE PÁGINA /////////

  const buttonElem: any = div.querySelector("button-comp");

  buttonElem.addEventListener("click", () => {
    params.goTo("/instructions");
  });

  div.appendChild(style);
  return div;
}
