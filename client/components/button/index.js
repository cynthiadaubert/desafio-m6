"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonComp = void 0;
function buttonComp(params) {
    customElements.define("button-comp", class ButtonComp extends HTMLElement {
        shadow;
        constructor() {
            super();
            this.shadow = this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
            this.render();
        }
        render() {
            const button = document.createElement("button");
            button.className = "button";
            const style = document.createElement("style");
            style.innerHTML = `
                
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
                
        `;
            button.textContent = this.textContent;
            this.shadow.appendChild(button);
            this.shadow.appendChild(style);
        }
    });
}
exports.buttonComp = buttonComp;
