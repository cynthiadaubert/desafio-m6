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
exports.handsComp = void 0;
var state_1 = require("../../state");
var imagePiedraURL = require("url:../img/piedra.png");
var imagePapelURL = require("url:../img/papel.png");
var imageTijeraURL = require("url:../img/tijera.png");
function handsComp() {
    customElements.define("hands-comp", /** @class */ (function (_super) {
        __extends(handsComp, _super);
        function handsComp() {
            var _this = _super.call(this) || this;
            _this.shadow = _this.attachShadow({ mode: "open" });
            return _this;
        }
        handsComp.prototype.connectedCallback = function () {
            this.render();
        };
        handsComp.prototype.render = function () {
            var div = document.createElement("div");
            var style = document.createElement("style");
            div.className = "hands";
            div.innerHTML = "\n  \n          <img variant=\"selected\" class=\"piedra\" src=".concat(imagePiedraURL, ">\n          <img variant=\"selected\" class=\"papel\" src=").concat(imagePapelURL, ">\n          <img variant=\"selected\" class=\"tijera\" src=").concat(imageTijeraURL, ">\n  \n        ");
            style.innerHTML = "\n\n          img {\n            width: 56px,\n            height: 126px;\n          }\n\n          @media (min-width:769px) {\n            img{\n              width: 80px;\n              height: 180px;\n            }\n          }\n\n          .piedra {\n              padding-right: 40px;\n          }\n\n          .papel {\n              padding-right:40px;\n          }\n\n          @media (min-width:769px){\n            .hands {\n              width: 500px;\n              position: fixed;\n              bottom: 0;\n            }\n          }\n\n          .transparent {\n              opacity: 0.5;\n          }\n            \n          ";
            var piedra = div.querySelector(".piedra");
            var papel = div.querySelector(".papel");
            var tijera = div.querySelector(".tijera");
            if (this.getAttribute("variant") == "selected") {
                piedra.addEventListener("click", function () {
                    papel.classList.add("transparent");
                    tijera.classList.add("transparent");
                    state_1.state.setMove("piedra");
                });
            }
            if (this.getAttribute("variant") == "selected") {
                papel.addEventListener("click", function () {
                    piedra.classList.add("transparent");
                    tijera.classList.add("transparent");
                    state_1.state.setMove("papel");
                });
            }
            if (this.getAttribute("variant") == "selected") {
                tijera.addEventListener("click", function () {
                    papel.classList.add("transparent");
                    piedra.classList.add("transparent");
                    state_1.state.setMove("tijera");
                });
            }
            this.shadow.appendChild(style);
            this.shadow.appendChild(div);
        };
        return handsComp;
    }(HTMLElement)));
}
exports.handsComp = handsComp;
