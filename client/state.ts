type Jugada = "piedra" | "papel" | "tijera";

const API_BASE_URL =
  /* "https://desafiom6.onrender.com" || */ "http://localhost:8080";

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
    online: "",
    rivalStart: false,
    rivalOnline: "",
    roomData: {},

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

    if (localData !== null) {
      this.setState(JSON.parse(localData));
    }
  },

  getState() {
    return this.data;
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

  /*   >>>>>>>>>>>>>>>>>>>>>>>>>>>>> FUNCIONES PARA LA RTDB <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  listenRoom(callback?) {
    /* ---->aca escucha todo el tiempo los jugadores en la room */
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "rooms/" + currentState.rtdbRoomId + "/current-game"
    );
    rtdbRoomRef.on("value", (snap) => {
      const roomData = snap.val();
      currentState.roomData = roomData;
      /*      const currentGameList = map(roomData.currentGame);
      currentState.roomData = currentGameList; */
      this.setState(currentState);
      console.log("ROOM DATA:", roomData);
    });
    if (callback) {
      callback();
    }
  },

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
          console.log("soy la data del fetch SignUp", data);
          currentState.rivalUserId = data.id;
          this.setState(currentState);
          callback(); /* -->cuando no hay error */
        });
    } else {
      console.error("No hay nombre en el state.data ");
      callback(true); /* ---> cuando hay error */
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
          this.accessExistentRoom();
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
    const userId = currentState.myUserId;
    if (userId) {
      fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("soy la data del fetch accessExistentRoom", data);
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setRtdbMyValues();
          this.listenRoom();
          this.setState(currentState);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay user id en el state");
    }
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

    if (currentState.rivalName) {
      rtdbRoomRef.update({
        playerTwo: {
          name: currentState.rivalName,
          /*       id: currentState.rivalUserId, */
          online: true,
        },
      });
      currentState.rivalOnline = true;
    }
    this.setState(currentState);
    console.log("rival values", currentState.roomData.playerTwo);
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
    if (currentState.rivalName && currentState.rivalUserId) {
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
    if (callback) {
      callback();
    }
  },

  listenStart(callback?) {
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
  },

  roomIsFull() {
    const currentState = this.getState();
    const roomData = currentState.roomData;
    if (Object.keys(roomData).length == 3) {
      console.error("sala llena");
    }
  },
  /*   >>>>>>>>>>>>>>>>>>>>>>>>>>>>> FUNCIONES PARA LAS JUGADAS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

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
          start: false,
          move,
        },
      });
      currentState.currentGame.myPlay = move;
    }
    this.pushToHistory();
    this.setState(currentState);
  },
  setRivalMove(move: Jugada) {
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
    );

    if (currentState.rivalName) {
      rtdbRoomRef.update({
        playerOne: {
          name: currentState.rivalName,
          id: currentState.rivalUserId,
          online: true,
          start: false,
          move,
        },
      });
      currentState.currentGame.computerPlay = move;
    }
    this.pushToHistory();
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
      currentState.history.me++;
      result = "win";
    } else if (lose == true) {
      currentState.history.computer++;
      result = "lose";
    } else {
      result = "tie";
    }

    const roomId = currentState.roomId;

    fetch(API_BASE_URL + "/rooms" + roomId, {
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
    return result;
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
        },
      });
    }
    currentState.currentGame.myPlay = "";
    currentState.currentGame.computerPlay = "";
    this.setState(currentState);

    //// SETEA ESTE NUEVO ESTADO EN EL LOCALSTORAGE ////
    localStorage.setItem(
      "saved-data",
      JSON.stringify(state.data)
    ); /* <-- se tiene que guardar antes todo el , en el init para guardar todos los cambios todo el tiempo */

    //VER EL SUSCRIBE PARA CONECTAR LOS JUGADORES EN LOS COMPONENTES.
    //PUSHEAR LAS MANOS ELEGIDAS A LA RTDB
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
