export function instructionsPage(params) {
  const div = document.createElement("div");
  div.className = "box";

  div.innerHTML = `

    <div class="info">
    
      <div class="points">
        <div class="user-box">
          <div class="user-room courier">Marce: 0 </div>
          <div class="user-room two courier">Paula: 0 </div>
        </div>
      </div>

      <div class="room courier">
  
        <div class="courier">Sala</div>
        <div class="roomId courier">76hh23</div>
      </div>

    </div>
   
      <h1 class="text">Presioná jugar
      y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</h1>
      
      <button-comp class="button">¡Jugar!</button-comp>
    
      <hands-comp class="hand"></handscomp>
      
    `;

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
      height: 100%;
    }
  
    @media (min-width: 769px) {
      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: max-content;
        max-width: 500px;
        margin: 0 auto;
        padding-top: 0px;
      }
    }
  
    .hands {
      margin-top: 80px;
      padding: 0;
      bottom: 0,
    }
  
  
    @media (min-width: 769px) {
      .hands {
       margin-right: 365px;
      }
    }
    
   .text {
    background-image: none;
      font-size: 28px;
      font-family: courier new;
      width: 316px;
      height 240px;
      text-align: center;
      margin: 0px 0px 20px 0px;
      padding: 0;
    }
  
    @media (min-width: 769px) {
      .text {
        font-size: 42px;
        width: 100%;
        height 100%;
        margin-bottom: 35px;
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
       .user-room {
       font-size: 24px;
       font-family: Courier New;
       font-weight: bold;
     }
   }

  .two {
    color: #FF6442;
  }

  .info {
    font-size: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 30px 0px 80px 0px;
    padding: 0;
    width: 320px; 
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

  .courier{
    font-family: Courier New;
    font-size: 24px;
    font-weight: bold;
  }

  @media (min-width: 769px) {
      .points{
      margin: 0;
      padding: 0;
    }
  }

  @media (min-width: 769px) {
      .button {
      margin-bottom: 70px;
    }
  }

`;

  const buttonElem: any = div.querySelector("button-comp");

  buttonElem.addEventListener("click", () => {
    params.goTo("/play");
  });

  div.appendChild(style);
  return div;
}
