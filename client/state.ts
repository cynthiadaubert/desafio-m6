import { Router } from "@vaadin/router";
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
    rtdbIsConnected: false,

    currentGame: {
      computerPlay: "",
      myPlay: "",
    },

    history: {
      computer: 0,
      me: 0,
    },
  },

  listeners: [],

  initState() {
    const localData = localStorage.getItem("saved-data");

    if (!localData) {
      return;
    } else {
      this.setState(JSON.parse(localData));
    }
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
          if (data.message) {
            alert("Usuario ya registrado");
            return;
          } else {
            console.log("soy la data del fetch SignUp", data);
            currentState.myUserId = data.id;
            this.setState(currentState);
            callback();
          }
        });
    } else {
      callback(true);
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
          if (data.message) {
            alert("Usuario ya registrado");
            return;
          } else {
            console.log("soy la data del fetch SignUp RIVAL", data);
            currentState.rivalUserId = data.id;
            this.setState(currentState);
          }
        });
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
        if (data.message) {
          alert("El id de la room no es correcto o no existe");
          return;
        } else {
          console.log("soy la data del fetch accessExistentRoom", data);
          currentState.rtdbRoomId = data.rtdbRoomId;
          this.setRtdbMyValues();
          this.setRtdbRivalValues();
          this.listenRoom(data.rtdbRoomId);
          this.setState(currentState);
          if (callback) {
            callback();
          }
        }
      });
  },

  listenRoom(rtdbRoomId?: string) {
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
      const myScore = rtdbData.playerOne.score;
      const rivalScore = rtdbData.playerTwo.score;

      this.setState({
        ...currentState,
        myName,
        rivalName,
        online,
        rivalOnline,
        myStart,
        rivalStart,
        myPlay,
        computerPlay,
        myScore,
        rivalScore,
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
          score: 0,
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
          score: 0,
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
          score: 0,
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
          score: 0,
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
    console.log("is player 1");
  },

  imThePlayerTwo() {
    const currentState = this.getState();
    currentState.isPlayerTwo = true;
    this.setState(currentState);
    console.log("is player 2");
  },

  setRealtimeConnection(boolean) {
    const currentState = this.getState();
    currentState.rtdbIsConnected = boolean;
    this.setState(currentState);
  },

  listenConnectedPlayers() {
    const currentState = this.getState();
    const isConnected = currentState.rtdbIsConnected;
    console.log("is connected", isConnected);
    return isConnected;
  },

  getPlayersStart(rtdbRoomId?: string) {
    const rtdbRoomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/current-game");
    rtdbRoomRef.on("value", (snap) => {
      const rtdbData = snap.val();
      let p1Start = rtdbData.playerOne.start;
      let p2Start = rtdbData.playerTwo.start;

      if (
        p1Start == true &&
        p2Start == false &&
        location.pathname == "/connection"
      ) {
        this.listenConnectedPlayers() == false
          ? this.setRealtimeConnection(true)
          : "";
      } else if (
        p1Start == true &&
        p2Start == true &&
        location.pathname == "/connection"
      ) {
        this.listenConnectedPlayers() == false
          ? this.setRealtimeConnection(true)
          : "";
        console.log("conectadosssss");
        Router.go("/play");
      }
    });
  },

  /*   >>>>>>>>>>>>>>>>>>>>>>>>>>>>> FUNCIONES PARA LAS JUGADAS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */
  setMyMove(choice: Jugada) {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;
    fetch(
      API_BASE_URL +
        "/rooms/" +
        rtdbRoomId +
        "/current-game" +
        "/playerOne/choice",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ choice }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.currentGame.myPlay = data.choice;
        console.log("current", currentState);
        console.log("FETCH MOVE PLAYER 1", data.choice);
      });

    this.setState(currentState);
    console.log(currentState.currentGame.myPlay);
  },

  setRivalMove(choice: Jugada) {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;
    fetch(
      API_BASE_URL +
        "/rooms/" +
        rtdbRoomId +
        "/current-game" +
        "/playerTwo/choice",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ choice }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.currentGame.computerPlay = data.choice;
        console.log("current, rival", currentState);
        console.log("FETCH MOVE RIVAL", data.choice);
      });
    this.setState(currentState);
    console.log(currentState.currentGame.computerPlay);
  },

  getPlayerChoices(callback?) {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbRoomId;

    fetch(API_BASE_URL + "/rooms/" + rtdbRoomId + "/current-game")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const p1 = data["p1"].choice;
        const p2 = data["p2"].choice;
        currentState.currentGame.myPlay == p1;
        currentState.currentGame.computerPlay == p2;
        state.setState(currentState);
        console.log(
          "soy la data del fetch getplayers",
          "player 1",
          p1,
          "player 2",
          p2
          /*           data["p1"].choice,
          data["p2"].choice,
          currentState.currentGame */
        );
      });
    if (callback) {
      callback();
    }
  },

  //// DECIDE SI GANA, PIERDE O EMPATA ////
  whoWins(myPlay: Jugada, computerPlay: Jugada) {
    console.log("who wins", myPlay, computerPlay);
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

    if (win == true && location.pathname == "/results") {
      currentState.history.me++;
      result = "win";
    } else if (lose == true && location.pathname == "/results") {
      currentState.history.computer++;
      result = "lose";
    } else {
      result = "tie";
    }

    currentState.currentGame.myPlay = myPlay;
    currentState.currentGame.computerPlay = computerPlay;
    /* this.setState("STATE EN WHO WINS", currentState); */

    return result;
  },

  setScore() {
    const cs = this.getState();
    const p1Score = cs.history.me;
    const p2Score = cs.history.computer;
    console.log("p1 score y p2score", p1Score, p2Score);
    const rtdbRoomRef = rtdb.ref("/rooms/" + cs.rtdbRoomId + "/current-game");
    rtdbRoomRef.update({
      history: {
        playerOne: p1Score,
        playerTwo: p2Score,
      },
      playerOne: {
        name: cs.myName,
        id: cs.myUserId,
        online: true,
        start: true,
        choice: cs.roomData.playerOne.choice,
        score: p1Score,
      },
      playerTwo: {
        name: cs.rivalName,
        id: cs.rivalUserId,
        online: true,
        start: true,
        choice: cs.roomData.playerTwo.choice,
        score: p2Score,
      },
    });

    this.setState(cs);
    console.log("current score", cs.roomData);
  },

  restartPoints() {
    const currentState = state.getState();
    const rtdbRoomRef = rtdb.ref(
      "/rooms/" + currentState.rtdbRoomId + "/current-game"
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
    this.setState(currentState);
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("saved-data", JSON.stringify(newState));
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
