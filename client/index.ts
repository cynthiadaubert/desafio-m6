import { initRouter } from "./router";
import { state } from "./state";
import { handsComp } from "./components/hands";
import { buttonComp } from "./components/button";

(function () {
  buttonComp({});
  handsComp();
  state.initState();
  /* (.a) */ state.subscribe(() => {
    console.log("soy el subscribe del index", state.getState().myUserId);
  });
  const root = document.querySelector(".root");
  initRouter(root as Element);

  state.setPlayerName("vc");
  state.signUp(
    /* (err) => {
    if (err) {
      console.error("hubo un error en el signup");
      state.askNewRoom(() => {
        state.accessExistentRoom();
      });
    }
  }); */
    async () => {
      try {
        await state.askNewRoom(state.accessExistentRoom());
      } catch (err) {
        console.log(err);
      }
    }
  );
})();

//////////////////////////////////////////////////////////////////////////////

/* (.a) El subscribe no estaba funcionando porque no estaba respetando los callbacks de la función Signup en el state.
state.signUp va a usar una arrow function para respetar el scope(this) y si existiera un parámetro a recibir 
sería solamente(err).SI NO HAY PARÁMETRO NO HAY ERROR, y con eso chequeamos.

Hacemos este método de callback para que el signin nos pueda avisar que la promesa ha terminado.
Como esta función es asíncrona, hasta que no termine no se va a poder ejecutar asknewRoom() */
