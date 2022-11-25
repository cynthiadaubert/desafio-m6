import { rtdb } from "./realtimeDB";
import { firestore } from "./database";
import express from "express";
import nanoid from "nanoid";
/* import * as cors from "cors"; */
import cors from "cors";
import "dotenv/config";

const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

const playerCollection = firestore.collection("players");
const playroomCollection = firestore.collection("rooms");

// REGISTRA AL USUARIO

app.post("/signup", (req, res) => {
  const name = req.body.name;
  playerCollection
    .where("name", "==", name)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        playerCollection.add({ name }).then((newPlayerCreated) => {
          res.json({
            id: newPlayerCreated.id,
            new: true,
          });
        });
      } else {
        res.status(400).json({
          message: "usuario ya registrado",
        });
      }
    });
});

// CREA UNA NUEVA ROOM

app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  playerCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const playerData = doc.data();
        const roomRef = rtdb.ref("rooms/" + nanoid());
        roomRef
          .set({
            owner: playerData.name,
            ownerId: userId,
            "current-game": {
              playerOne: {
                name: "",
                id: "",
                choice: "",
                score: "",
                online: false,
                start: false,
              },
              playerTwo: {
                name: "",
                id: "",
                choice: "",
                score: "",
                online: false,
                start: false,
              },
            },
          })
          .then(() => {
            const roomRealId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            playroomCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomRealId,
              })
              .then(() => {
                res.json({
                  id: roomId,
                });
              });
          });
      } else {
        res.status(401).json({
          message: "el usuario no existe, no se pudo crear la room",
        });
      }
    });
});

// PEDIR UNA ROOM EXISTENTE

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  playerCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        playroomCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.status(200).json(data);
          });
      } else {
        res.status(401).json({
          message: "el id de la room no existe",
        });
      }
    });
});

// ACTUALIZA A START PARA QUE AMBOS JUGADORES PUEDAN EMPEZAR

app.patch("/start", (req, res) => {
  const { userId, rtdbId, start } = req.body;
  const rtdbPlayersCollection = rtdb.ref("rooms/" + rtdbId + "/current-game");

  rtdbPlayersCollection.on("value", (snap) => {
    const roomData = snap.val();
    console.log("soy el room data patch", roomData);
    const { playerOne } = roomData;

    if (playerOne.name == userId) {
      roomData.playerOne.start = start;
    } else {
      roomData.playerTwo.start = start;
    }

    rtdbPlayersCollection.update(roomData);

    res.status(200).json({
      message: "Start seteado a true",
    });
  });
});

app.patch("/start", (req, res) => {
  const { userId, rtdbId, start } = req.body;
  const rtdbPlayersCollection = rtdb.ref("rooms/" + rtdbId + "/current-game");

  rtdbPlayersCollection.on("value", (snap) => {
    const roomData = snap.val();
    console.log("soy el room data patch", roomData);
    const { playerOne } = roomData;

    if (playerOne.name == userId) {
      roomData.playerOne.start = start;
    } else {
      roomData.playerTwo.start = start;
    }

    rtdbPlayersCollection.update(roomData);

    res.status(200).json({
      message: "Start seteado a true",
    });
  });
});

// CONECTAR PLAYER 2 A LA SALA

app.post("/rooms/:rtdbId", (req, res) => {
  const { rtdbId } = req.params;
  const { userId } = req.body;

  const rtdbPlayersCollection = rtdb.ref("rooms/" + rtdbId + "/current-game");

  rtdbPlayersCollection.on("value", (snap) => {
    const roomData = snap.val();
    const { playerOne, playerTwo } = roomData;
    if (playerTwo.name == "" && playerOne.name !== userId) {
      roomData.playerTwo.name = userId;
      rtdbPlayersCollection.update(roomData);
      res.status(200).json({
        message: "Player 2 joined",
        rivalName: playerOne.name,
        computer: playerOne.computerScore,
        me: playerTwo.myScore,
      });
    } else if (playerOne.name == userId) {
      res.status(200).json({
        message: "Player  joined",
        rivalName: playerTwo.name,
        computer: playerTwo.computerScore,
        me: playerOne.myScore,
      });
    } else if (playerTwo.name == userId) {
      res.status(200).json({
        message: "Player 2 joined",
        rivalName: playerOne.name,
        computer: playerOne.computerScore,
        me: playerTwo.myScore,
      });
    } else {
      res.status(400).json({
        message: "Usuario no válido para esta room",
      });
    }
  });
});

// ACTUALIZA LAS JUGADAS DE LOS JUGADORES EN LA DB
app.patch("/moves", (req, res) => {
  const { userId, rtdbId, playerMove } = req.body;
  const rtdbPlayersCollection = rtdb.ref("rooms/" + rtdbId + "/current-game");
  /* (resolver por que la room data nos la devuelve en null) */

  rtdbPlayersCollection.on("value", (snap) => {
    const roomData = snap.val();
    console.log("soy la roomdata", roomData);
    const { playerOne } = roomData;

    if (playerOne.name == userId) {
      roomData.playerOne.choice = playerMove;
    } else {
      roomData.playerTwo.choice = playerMove;
    }

    rtdbPlayersCollection.update(roomData);

    res.status(200).json({
      message: "Jugadas actualizadas",
    });
  });
});

// ACTUALIZA EL PUNTAJE DE LOS JUGADORES EN LA DB
app.patch("/score", (req, res) => {
  const { winner, rtdbId } = req.body;
  const rtdbPlayersCollection = rtdb.ref("rooms/" + rtdbId + "/current-game");

  rtdbPlayersCollection.on("value", (snap) => {
    const roomData = snap.val();
    const { playerOne } = roomData;

    if (playerOne.name == winner) {
      roomData.playerOne.score + 1;
    } else {
      roomData.playerTwo.score + 1;
    }

    rtdbPlayersCollection.update(roomData);

    res.status(200).json({
      message: "Puntajes actualizados",
    });
  });
});

// Ejecutar express static y escuchar el puerto //

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
  /*   
  import * as path from "path"
const rutaRelativa = path.resolve(__dirname, "../una-carpeta/",  "un-archivo.html");
console.log(rutaRelativa)
AGREGAR ARRIBA SI LO NECESITAMOS
import * as path from "path";
const pathResolve = path.resolve("", "dist/index.html");
  res.sendFile(pathResolve); */
});

app.use(express.static("dist"));

app.listen(port, () => {
  console.log("Server connected at http://localhost:${port}");
});
