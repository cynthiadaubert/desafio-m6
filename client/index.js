"use strict";
exports.__esModule = true;
var state_1 = require("./state");
var hands_1 = require("./components/hands");
var button_1 = require("./components/button");
(function () {
    (0, button_1.buttonComp)({});
    (0, hands_1.handsComp)();
    state_1.state.initState();
    var root = document.querySelector(".root");
    /*  initRouter(root as Element); */
})();
