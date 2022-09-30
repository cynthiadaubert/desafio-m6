import { rtdb } from "./realtimeDB";
import { firestore } from "./database";
import express from "express";
import nanoid from "nanoid";
import cors from "cors";
import "dotenv/config";
import { AppCheck } from "firebase-admin/lib/app-check/app-check";

const port = process.env.PORT || 8000;

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
        res.status(400).json({ message: "usuario ya registrado" });
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
        const roomRef = rtdb.ref("rooms/" + nanoid());
        roomRef
          .set({
            ownerId: userId,
            currentGame: {
              playerOne: {
                name: "",
                choice: "",
                online: false,
                start: false,
              },
              playerTwo: {
                name: "",
                choice: "",
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
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "el id de la room no existe",
        });
      }
    });
});

// CONECTAR PLAYER 2 A LA SALA

app.post("/rooms/:rtdbId", (req, res) => {
  const { rtdbId } = req.params;
  const { userId } = req.query;

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
        message: "Player 2 joined",
        rivalName: playerTwo.name,
        computer: playerTwo.computerScore,
        me: playerOne.myScore,
      });
    } else if (playerOne.name == userId) {
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

// ACTUALIZA A START PARA QUE AMBOS JUGADORES PUEDAN EMPEZAR

app.patch("/start", (req, res) => {
  const { userId, rtdbId, start } = req.body;
  const rtdbPlayersCollection = rtdb.ref("rooms/" + rtdbId + "/current-game");

  rtdbPlayersCollection.on("value", (snap) => {
    const roomData = snap.val();
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

// ACTUALIZA LAS JUGADAS DE LOS JUGADORES
app.patch("/setMove", (req, res) => {
  const { userId, rtdbId, playerMove } = req.body;
  const rtdbPlayersCollection = rtdb.ref("rooms/" + rtdbId + "/current-game");

  rtdbPlayersCollection.on("value", (snap) => {
    const roomData = snap.val();
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

// Ejecutar express static y escuchar el puerto //

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
  /*   
AGREGAR ARRIBA SI LO NECESITAMOS
import * as path from "path";

const pathResolve = path.resolve("", "dist/index.html");
  res.sendFile(pathResolve); */
});

app.use(express.static("dist"));

app.listen(port, () => {
  console.log("Server connected at http://localhost:${port}");
});
