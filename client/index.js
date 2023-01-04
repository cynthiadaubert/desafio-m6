"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./pages/welcome");
require("./pages/new-game");
require("./pages/open-room");
require("./pages/share-code");
require("./pages/instructions");
require("./pages/instr");
require("./pages/waiting-page");
require("./pages/play");
require("./pages/show-hands");
require("./pages/results");
require("./pages/error");
require("./router");
const state_1 = require("./state");
const hands_1 = require("./components/hands");
const button_1 = require("./components/button");
async function beforeunloadUpdate() {
    state_1.state.setRealtimeConnection(false);
    state_1.state.restartValues();
    state_1.state.setState(state_1.state.data);
    /*   localStorage.removeItem("saved-data");
    localStorage.removeItem("room-data"); */
}
(function () {
    (0, button_1.buttonComp)({});
    (0, hands_1.handsComp)();
    state_1.state.initState();
    window.addEventListener("beforeunload", async () => {
        await beforeunloadUpdate();
    });
})();
