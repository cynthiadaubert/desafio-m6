type Jugada = "piedra" | "papel" | "tijera";

const state = {
  //// DATOS INICIALES ////
  data: {
    currentGame: {
      computerPlay: "",
      myPlay: "",
    },

    history: {
      computer: 0,
      me: 0,
    },
  },

  //// INICIAR CON EL ESTADO GUARDADO ////
  initState() {
    const localData = localStorage.getItem("saved-data");

    if (localData !== null) {
      this.setState(JSON.parse(localData));
    }
  },

  //// GETTER ////
  getState() {
    return this.data;
  },

  //// SETER ////
  setState(newState) {
    this.data = newState;
  },

  //// SETEA MOVIMIENTOS DE LAS MANOS ////
  setMove(move: Jugada) {
    const options = ["piedra", "papel", "tijera"];
    const currentState = this.getState();
    currentState.currentGame.myPlay = move;
    const randomMove = options[Math.floor(Math.random() * 3)];
    const pcMove = (currentState.currentGame.computerPlay = randomMove);

    this.pushToHistory();
  },

  //// DECIDE SI GANA, PIERDE O EMPATA ////
  whoWins() {
    const currentState = this.getState();
    const myPlay = currentState.currentGame.myPlay;
    const computerPlay = currentState.currentGame.computerPlay;

    const ganeConTijeras = myPlay == "tijera" && computerPlay == "papel";
    const ganeConPiedra = myPlay == "piedra" && computerPlay == "tijera";
    const ganeConPapel = myPlay == "papel" && computerPlay == "piedra";

    const pcGanaTijeras = myPlay == "papel" && computerPlay == "tijera";
    const pcGanaPiedra = myPlay == "tijera" && computerPlay == "piedra";
    const pcGanaPapel = myPlay == "piedra" && computerPlay == "papel";

    const win = [ganeConTijeras || ganeConPiedra || ganeConPapel].includes(
      true
    );
    const lose = [pcGanaPapel || pcGanaPiedra || pcGanaTijeras].includes(true);

    let result;

    if (win == true) {
      result = "win";
    } else if (lose == true) {
      result = "lose";
    } else {
      result = "tie";
    }

    return result;
  },

  //// GUARDA LOS PUNTOS SEGUN EL RESULTADO DE WHO WINS ////
  pushToHistory() {
    const result = this.whoWins();
    const currentState = this.getState();
    const computerScore = currentState.history.computer;
    const myScore = currentState.history.me;

    if (result == "win") {
      this.setState({
        ...currentState,
        history: {
          computer: computerScore,
          me: myScore + 1,
        },
      });
    }
    if (result == "lose") {
      this.setState({
        ...currentState,
        history: {
          computer: computerScore + 1,
          me: myScore,
        },
      });
    }
    if (result == "tie") {
      this.setState({
        ...currentState,
        history: {
          computer: computerScore,
          me: myScore,
        },
      });
    }

    //// SETEA ESTE NUEVO ESTADO EN EL LOCALSTORAGE ////
    localStorage.setItem("saved-data", JSON.stringify(state.data));
  },
};

export { state };
