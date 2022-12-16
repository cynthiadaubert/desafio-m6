type Jugada = "piedra" | "papel" | "tijera" | "null";

const API_BASE_URL =
  /* "https://desafiom6.onrender.com" || */ "http://localhost:8000";

import map from "lodash/map";

import { rtdb } from "../server/realtimeDB";

const state = {
  //// DATOS INICIALES ////
  data: {
    myName: "",
    myUserId: "",
    rivalName: "",
    rivalUserId: "",
    roomId: "",
    rtdbRoomId: "",
    myStart: false,
    online: false,
    rivalStart: false,
    rivalOnline: false,
    roomData: {},
    isPlayerOne: false,
    isPlayerTwo: false,

    currentGame: {
      computerPlay: "",
      myPlay: "",
    },

    history: {
      computer: 0,
      me: 0,
    },
  },

  listeners: [] /* <___ escucha todos los cambios por fuera de la sala */,

  initState() {
    const localData = localStorage.getItem("saved-data");

    if (!localData) {
      return;
    } else {
      this.setState(JSON.parse(localData));
    }
    /*     const localData = localStorage.getItem("saved-data");
    if (localData !== null) {
      this.setState(JSON.parse(localData));
    } */
  },

  getState() {
    return this.data;
  },

  /*   >>>>>>>>>>>>>>>>>>>>>>>>>>>>> FUNCIONES PARA LA RTDB <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  setMyName(name?: string) {
    const currentState = this.getState();
    currentState.myName = name;
    this.setState(currentState);
  },

  setRivalName(name?: string) {
    const currentState = this.getState();
    currentState.rivalName = name;
    this.setState(currentState);
  },

  mySignUp(callback?) {
    const currentState = this.getState();
    if (currentState.myName) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: currentState.myName }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("soy la data del fetch SignUp", data);
          currentState.myUserId = data.id;

          this.setState(currentState);
          callback(); /* -->cuando no hay error */
        });
    } else {
      console.error("No hay nombre en el state.data ");
      callback(true); /* ---> cuando hay error */
    }
  },

  rivalSignUp(callback?) {
    const currentState = this.getState();
    if (currentState.rivalName) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: currentState.rivalName }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("soy la data del fetch SignUp RIVAL", data);
          currentState.rivalUserId = data.id;
          this.setState(currentState);
          /* -->cuando no hay error */
        });
    } else {
      console.error("No hay nombre en el state.data ");
      /* ---> cuando hay error */
    }
    if (callback) {
      callback();
    }
  },

  askNewRoom(callback?) {
    const currentState = this.getState();
    if (currentState.myUserId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: currentState.myUserId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("soy la data del fetch asknewRoom", data);
          currentState.roomId = data.id;
          /*   this.accessExistentRoom(); */
          this.setState(currentState);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay user id en el state");
    }
  },

  accessExistentRoom(callback?) {
    const currentState = this.getState();
    const roomId = currentState.roomId;
    const userId = currentState.myUserId || currentState.rivalUserId;

    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("soy la data del fetch accessExistentRoom", data);
        currentState.rtdbRoomId = data.rtdbRoomId;
        this.setRtdbMyValues();
        this.setRtdbRivalValues();
        this.listenRoom(data.rtdbRoomId);
        this.setState(currentState);
        if (callback) {
          callback();
        }
      });
  },

  playerChoices(rtdbRoomId?: string) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref("rooms/" + rtdbRoomId);
    rtdbRoomRef.get().then((snap) => {
      const rtdbData = snap.val();
      const myChoice = rtdbData["current-game"].playerOne.start;
      const rivalChoice = rtdbData["current-game"].playerTwo.start;
      console.log("RTDB COMPLETA", myChoice, rivalChoice);

      if (currentState.myUserId == rtdbData.ownerId) {
        currentState.owner = currentState.myName;
      }
      this.setState(currentState);
    });
  },

  listenRoom(rtdbRoomId?: string) {
    console.log("room id nuevo listen rooms", rtdbRoomId);
    const rtdbRoomRef = rtdb.ref("rooms/" + rtdbRoomId + "/current-game");
    rtdbRoomRef.on("value", (snap) => {
      const rtdbData = snap.val();
      const currentState = state.getState();
      currentState.roomData = rtdbData;
      const myName = rtdbData.playerOne.name;
      const rivalName = rtdbData.playerTwo.name;
      const myPlay = rtdbData.playerOne.choice;
      const computerPlay = rtdbData.playerTwo.choice;
      const online = rtdbData.playerOne.online;
      const rivalOnline = rtdbData.playerTwo.online;
      const myStart = rtdbData.playerOne.start;
      const rivalStart = rtdbData.playerTwo.start;
      console.log("ROOM DATA:", rtdbData);
      this.setState({
        ...currentState,
        myName,
        rivalName,
        myPlay,
        computerPlay,
        online,
        rivalOnline,
        myStart,
        rivalStart,
      });

      const newRoomData = state.getState();
      localStorage.setItem("room-data", JSON.stringify({ ...newRoomData }));
    });
  },

  setRtdbMyValues(callback?) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );

    if (currentState.myName && currentState.myUserId) {
      rtdbRoomRef.update({
        playerOne: {
          name: currentState.myName,
          id: currentState.myUserId,
          online: true,
          start: false,
          choice: "",
        },
      });
      currentState.online = true;
    }
    this.setState(currentState);
    console.log("valores seteados");
    if (callback) {
      callback();
    }
  },

  setRtdbRivalValues(callback?) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );

    if (currentState.rivalName && currentState.rivalUserId) {
      rtdbRoomRef.update({
        playerTwo: {
          name: currentState.rivalName,
          id: currentState.rivalUserId,
          online: true,
          start: false,
          choice: "",
        },
      });
      currentState.rivalOnline = true;
    }
    this.setState(currentState);
    if (callback) {
      callback();
    }
  },

  setMyStart(callback?) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );
    if (currentState.myName && currentState.myUserId) {
      rtdbRoomRef.update({
        playerOne: {
          name: currentState.myName,
          id: currentState.myUserId,
          online: true,
          start: true,
        },
      });
      currentState.myStart = true;
    }
    this.setState(currentState);
    if (callback) {
      callback();
    }
  },

  setRivalStart(callback?) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );
    if (currentState.rivalName /* && currentState.rivalUserId */) {
      rtdbRoomRef.update({
        playerTwo: {
          name: currentState.rivalName,
          id: currentState.rivalUserId,
          online: true,
          start: true,
        },
      });
      currentState.rivalStart = true;
    }
    this.setState(currentState);
    console.log("el start del rival es:", currentState.rivalStart);
    if (callback) {
      callback();
    }
  },

  imThePlayerOne() {
    const currentState = this.getState();
    currentState.isPlayerOne = true;
    this.setState(currentState);
  },

  imThePlayerTwo() {
    const currentState = this.getState();
    currentState.isPlayerTwo = true;
    this.setState(currentState);
  },

  /*   listenStart(callback?) {
    const currentState = this.getState();
    const { myName, rivalName } = currentState;
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );
    rtdbRoomRef.on("value", (snap) => {
      const roomData = snap.val();
      const { playerOne, playerTwo } = roomData;
      // If there's no opponent name, get it and save the state
      if (!rivalName && playerOne.name && playerTwo.name !== myName) {
        // Player1 is the opponent
        currentState.opponentName = playerOne.name;
        this.setState(currentState);
      } else if (!rivalName && playerTwo.name && playerTwo.name !== myName) {
        // Player2 is the opponent
        currentState.opponentName = playerTwo.name;
        this.setState(currentState);
      }
      // When both players are ready, go to the Game Page
      if (playerOne.ready && playerTwo.ready) {
        // Disconnect the listener
        rtdbRoomRef.off("value");
        if (callback) {
          callback();
        }
      }
    });
  }, */

  /*   >>>>>>>>>>>>>>>>>>>>>>>>>>>>> FUNCIONES PARA LAS JUGADAS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  /*   setMoveState(move: Jugada) {
    const currentState = this.getState();
    currentState.move = move;
    this.setState(currentState);
  },

  setMovetoRtdb(move: Jugada) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/moves"
    );

    rtdbRoomRef.update({
      moves: [move],
    });

    this.setState(currentState);
  }, */

  //// SETEA MOVIMIENTOS DE LAS MANOS ////

  setMyMove(move: Jugada) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );

    if (currentState.myName) {
      rtdbRoomRef.update({
        playerOne: {
          name: currentState.myName,
          id: currentState.myUserId,
          online: true,
          start: true,
          choice: move,
        },
      });
      currentState.currentGame.myPlay = move;
    }
    /*   this.pushToHistory(); */
    this.setState(currentState);
  },
  setRivalMove(move: Jugada) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );

    if (currentState.rivalName) {
      rtdbRoomRef.update({
        playerTwo: {
          name: currentState.rivalName,
          id: currentState.rivalUserId,
          online: true,
          start: true,
          choice: move,
        },
      });
      currentState.currentGame.computerPlay = move;
    }
    /* this.pushToHistory(); */
    this.setState(currentState);
  },

  /*   listenPlayerMoves(move: Jugada) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );
    if (currentState.myName) {
      rtdbRoomRef.update({
        playerOne: {
          name: currentState.myName,
          id: currentState.myUserId,
          start: false,
          move: move,
        },
      });
      currentState.currentGame.myPlay = move;
    } else if (currentState.rivalName) {
      rtdbRoomRef.update({
        playerTwo: {
          name: currentState.rivalName,
          id: currentState.rivalUserId,
          start: false,
          move: move,
        },
      });
      currentState.currentGame.computerPlay = move;
    }
    this.setState(currentState);
    this.pushToHistory();
  }, */

  //// DECIDE SI GANA, PIERDE O EMPATA ////
  whoWins(myPlay: Jugada, computerPlay: Jugada) {
    const currentState = this.getState();

    const ganeConTijeras =
      myPlay == "tijera" && computerPlay == ("papel" || "null");
    const ganeConPiedra =
      myPlay == "piedra" && computerPlay == ("tijera" || "null");
    const ganeConPapel =
      myPlay == "papel" && computerPlay == ("piedra" || "null");

    const pcGanaTijeras =
      myPlay == ("papel" || "null") && computerPlay == "tijera";
    const pcGanaPiedra =
      myPlay == ("tijera" || "null") && computerPlay == "piedra";
    const pcGanaPapel =
      myPlay == ("piedra" || "null") && computerPlay == "papel";

    const win = [ganeConTijeras || ganeConPiedra || ganeConPapel].includes(
      true
    );
    const lose = [pcGanaPapel || pcGanaPiedra || pcGanaTijeras].includes(true);

    let result;

    if (win == true) {
      currentState.history.me++;
      currentState.roomData.history.playerOne++;
      result = "win";
    } else if (lose == true) {
      currentState.history.computer++;
      currentState.roomData.history.playerTwo++;
      result = "lose";
    } else {
      result = "tie";
      currentState.roomData.history.playerOne += 0;
      currentState.roomData.history.playerTwo += 0;
    }

    this.setState(currentState);
    return result;

    /* 
    const roomId = currentState.roomId;

    fetch(API_BASE_URL + "/rooms/" + roomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ result }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {});
    return result; */
  },

  restartPoints() {
    const currentState = state.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms" + currentState.rtdbRoomId + "current-game"
    );
    if (currentState.myName) {
      rtdbRoomRef.update({
        playerOne: {
          choice: "",
          name: currentState.myName,
          online: true,
          start: false,
          score: "",
        },
      });
    }
    if (currentState.rivalName) {
      rtdbRoomRef.update({
        playerTwo: {
          choice: "",
          name: currentState.rivalName,
          online: true,
          start: false,
          score: "",
        },
      });
    }
    currentState.currentGame.myPlay = "";
    currentState.currentGame.computerPlay = "";
    this.setState(
      currentState
    ); /* <-- se tiene que guardar antes todo el , en el init para guardar todos los cambios todo el tiempo */

    //// SETEA ESTE NUEVO ESTADO EN EL LOCALSTORAGE ////
    /*   localStorage.setItem("saved-data", JSON.stringify(state.data));
     */
    //VER EL SUSCRIBE PARA CONECTAR LOS JUGADORES EN LOS COMPONENTES.
    //PUSHEAR LAS MANOS ELEGIDAS A LA RTDB
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem(
      "saved-data",
      JSON.stringify(newState)
    ); /* --->tenemos habilitada SIEMPRE la última versión */
    console.log("Soy el state en setState, he cambiado:", this.data);
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
