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

(function () {
  buttonComp({});
  handsComp();
  state.initState();
  /* (.a) */ state.subscribe(() => {
    /* console.log("soy el subscribe del index", state.getState().myUserId); */
  });
  const root = document.querySelector(".root");
  /*   initRouter(root as Element); */

  /* state.setPlayerName("cmed");
  state.signUp(async () => {
    try {
      await state.askNewRoom();
    } catch (err) {
      console.log(err);
    }
  });

  state.listenRooms(); */
})();

//////////////////////////////////////////////////////////////////////////////

/* (.a) El subscribe no estaba funcionando porque no estaba respetando los callbacks de la función Signup en el state.
state.signUp va a usar una arrow function para respetar el scope(this) y si existiera un parámetro a recibir 
sería solamente(err).SI NO HAY PARÁMETRO NO HAY ERROR, y con eso chequeamos.

Hacemos este método de callback para que el signin nos pueda avisar que la promesa ha terminado.
Como esta función es asíncrona, hasta que no termine no se va a poder ejecutar asknewRoom() */

/* (err) => {
    if (err) {
      console.error("hubo un error en el signup");
      state.askNewRoom(() => {
        state.accessExistentRoom();
      });
    }
  }); */
//localStorage.removeItem("saved-data");

/* window.onbeforeunload = function () {
  localStorage.removeItem("saved-data");
  return "";
};
 */
