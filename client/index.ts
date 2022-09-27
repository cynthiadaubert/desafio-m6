import { initRouter } from "./router";
import { state } from "./state";
import { handsComp } from "./components/hands";
import { buttonComp } from "./components/button";

(function () {
  buttonComp({});
  handsComp();
  state.initState();
  const root = document.querySelector(".root");
  initRouter(root as Element);

  state.setPlayerName("pepe");
  state.signUp();
  console.log(state.data);
})();
