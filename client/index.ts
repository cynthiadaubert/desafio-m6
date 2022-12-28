import "./pages/welcome";
import "./pages/new-game";
import "./pages/open-room";
import "./pages/share-code";
import "./pages/instructions";
import "./pages/instr";
import "./pages/waiting-page";
import "./pages/play";
import "./pages/show-hands";
import "./pages/results";
import "./pages/error";
import "./router";
import { state } from "./state";
import { handsComp } from "./components/hands";
import { buttonComp } from "./components/button";

async function beforeunloadUpdate() {
  state.setRealtimeConnection(false);
  state.restartValues();
  state.setState(state.data);
  /*   localStorage.removeItem("saved-data");
  localStorage.removeItem("room-data"); */
}

(function () {
  buttonComp({});
  handsComp();
  state.initState();
  window.addEventListener("beforeunload", async () => {
    await beforeunloadUpdate();
  });
})();
