"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
const router = new router_1.Router(document.querySelector(".root"));
router.setRoutes([
    { path: "/", component: "welcome-page" },
    { path: "/welcome", component: "welcome-page" },
    { path: "/newgame", component: "newgame-page" },
    { path: "/openroom", component: "open-room" },
    { path: "/sharecode", component: "sharecode-page" },
    { path: "/connection", component: "waiting-page" },
    { path: "/instructions", component: "instructions-page" },
    { path: "/instr", component: "instr-page" },
    { path: "/play", component: "play-page" },
    { path: "/showhands", component: "showhands-page" },
    { path: "/results", component: "results-page" },
    { path: "/error", component: "error-page" },
]);
