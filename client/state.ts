type Jugada = "piedra" | "papel" | "tijera";

const API_BASE_URL =
  /* "https://desafiom6.onrender.com" || */ "http://localhost:8080";

import map from "lodash/map";

import { rtdb } from "../server/realtimeDB";

const state = {
  //// DATOS INICIALES ////
  data: {
    myName: "",
    rivalName: "",
    myUserId: "",
    rivalUserId: "",
    roomId: "",
    rtdbRoomId: "",
    myStart: false,
    rivalStart: false,
    roomData: "",

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

  listenRooms(callback?) {
    /* ---->aca escucha todo el tiempo los jugadores en la room */
    const currentState = this.getState();
    const rtdbRoomRef = rtdb.ref("rooms/" + currentState.rtdbRoomId);
    rtdbRoomRef.on("value", (snap) => {
      const roomData = snap.val();
      currentState.roomData = roomData;
      /*  console.log("soy los datos de la room", roomData); */
      /*       const currentGameData = map(roomData.currentGame);
      console.log("current game data en listenRooms()", currentGameData); */
      this.setState(currentState);
    });
    if (callback) {
      callback();
    }
  },

  setPlayerName(name?: string) {
    const currentState = this.getState();
    if (name != "" || name == name) {
      currentState.rivalName = name;
    } else {
      currentState.myName = name;
    }
    this.setState(currentState);
  },

  signUp(callback?) {
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
          this.setState(currentState);
          this.accessExistentRoom();
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
    if (currentState.myUserId) {
      fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log("soy la data del fetch accessExistentRoom", data);
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setState(currentState);
          this.listenRooms();
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay user id en el state");
    }
  },

  setStart(start: boolean, callback?) {
    const currentState = this.getState();
    const { myName, rtdbId } = currentState;

    fetch(API_BASE_URL + "/start", {
      method: "patch",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        playerName: myName,
        rtdbId: rtdbId,
        start: start,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("soy la data del fetch setstart", data);
        if (callback) {
          console.log("soy el callback", callback);
          //go waiting room
          callback();
        }
      });
  },

  listenStartPlayers(callback?) {
    /* ---->aca escucha todo el tiempo los jugadores en la room */
    const currentState = this.getState();
    const { rtdbId, myName, rivalName } = currentState;
    const rtdbRoomRef = rtdb.ref("rooms/" + rtdbId + "/current-game");

    rtdbRoomRef.on("value", (snap) => {
      const roomData = snap.val();
      const { playerOne, playerTwo } = roomData;

      if (!rivalName && playerOne.name && playerOne !== myName) {
        currentState.rivalName = playerOne.myName;
        this.setState(currentState);
      } else if (!rivalName && playerTwo.name && playerTwo !== myName) {
        currentState.rivalName = playerTwo.name;
        this.setState(currentState);
      }

      if (playerOne.start && playerTwo.start == true)
        /*  rtdbRoom.off("value") */
        callback();
      /* REDIRIGIR CON ESTE CALLBACK */
    });
  },

  /*   >>>>>>>>>>>>>>>>>>>>>>>>>>>>> FUNCIONES PARA LAS JUGADAS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

  //// SETEA MOVIMIENTOS DE LAS MANOS ////
  setMove(move: Jugada, callback?) {
    const currentState = this.getState();
    currentState.currentGame.myPlay = move;
    /* const options = ["piedra", "papel", "tijera"]; */
    /*     const randomMove = options[Math.floor(Math.random() * 3)];
    const pcMove = (currentState.currentGame.computerPlay = randomMove); */

    fetch(API_BASE_URL + "/moves", {
      method: "patch",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        playerName: currentState.myName,
        rtdbId: currentState.rtdbId,
        choice: move,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data de los moves", data);
        currentState.currentGame.myPlay = {
          /* data.rtdbRoomId */
        };
        this.setState(currentState);
        if (callback) {
          callback();
        }
      });

    this.pushToHistory();
  },

  listenPlayerMoves(callback?) {
    const currentState = this.getState();
    const { rtdbId, rivalName } = currentState;
    const rtdbRoom = rtdb.ref("rooms/" + rtdbId + "/current-game");

    rtdbRoom.on("value", (snap) => {
      const roomData = snap.val();
      const { playerOne, playerTwo } = roomData;

      if (playerOne.name == rivalName) {
        currentState.currentGame.computerPlay = playerOne.choice;
        this.setState(currentState);
      } else {
        currentState.currentGame.computerPlay = playerTwo.choice;
      }
      this.setState(currentState);
    });
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
    localStorage.setItem(
      "saved-data",
      JSON.stringify(state.data)
    ); /* <-- se tiene que guardar antes todo el , en el init para guardar todos los cambios todo el tiempo */

    //VER EL SUSCRIBE PARA CONECTAR LOS JUGADORES EN LOS COMPONENTES. QUE ES EL SUSCRIBE
    //PUSHEAR LAS MANOS ELEGIDAS A LA RTDB
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
