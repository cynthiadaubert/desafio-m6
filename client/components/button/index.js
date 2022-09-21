"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.buttonComp = void 0;
function buttonComp(params) {
    customElements.define("button-comp", /** @class */ (function (_super) {
        __extends(ButtonComp, _super);
        function ButtonComp() {
            var _this = _super.call(this) || this;
            _this.shadow = _this.attachShadow({ mode: "open" });
            return _this;
        }
        ButtonComp.prototype.connectedCallback = function () {
            this.render();
        };
        ButtonComp.prototype.render = function () {
            var button = document.createElement("button");
            button.className = "button";
            var style = document.createElement("style");
            style.innerHTML = "\n                \n        .button {\n    \n        background-color: #006CFC;\n        font-size: 45px;\n        border: 10px solid #001997;\n        border-radius: 10px;\n        min-width: 300px;\n        height: 87px;\n        font-family: Odibee sans;\n        color: #D8FCFC;\n        margin-top: 20px;\n        }\n\n        @media (min-width: 769px) {\n          .button {\n            min-width: 600px;\n            margin-top: 60px;\n          }\n        }\n                \n        ";
            button.textContent = this.textContent;
            this.shadow.appendChild(button);
            this.shadow.appendChild(style);
        };
        return ButtonComp;
    }(HTMLElement)));
}
exports.buttonComp = buttonComp;
;
