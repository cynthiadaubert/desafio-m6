import { rtdb } from "./realtimeDB";
import { firestore } from "./database";
import express from "express";
import nanoid from "nanoid";
import * as path from "path";
import cors from "cors";
import "dotenv/config";

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
              roomId: "",
              history: { playerOne: 0, playerTwo: 0 },
              playerOne: {
                name: "",
                id: "",
                choice: "",
                score: 0,
                online: false,
                start: false,
              },
              playerTwo: {
                name: "",
                id: "",
                choice: "",
                score: 0,
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

// ACTUALIZA LAS MANOS ELEGIDAS DEL P1

app.patch("/rooms/:rtdbRoomId/current-game/playerOne/choice", (req, res) => {
  const rtdbRoomId = req.params.rtdbRoomId;
  const choice = req.body.choice;

  const roomRef = rtdb.ref(`/rooms/${rtdbRoomId}/current-game/playerOne`);
  roomRef.update({ choice }).then((data) => {
    res.status(202).json({
      choice,
    });
  });
});

// ACTUALIZA LAS MANOS ELEGIDAS DEL P2
app.patch("/rooms/:rtdbRoomId/current-game/playerTwo/choice", (req, res) => {
  const rtdbRoomId = req.params.rtdbRoomId;
  const choice = req.body.choice;

  const roomRef = rtdb.ref(`/rooms/${rtdbRoomId}/current-game/playerTwo`);
  roomRef.update({ choice }).then((data) => {
    res.status(202).json({
      choice,
    });
  });
});

// DEVUELVE LOS MOVIMIENTOS DE LOS JUGADORES
app.get("/rooms/:rtdbRoomId/current-game", (req, res) => {
  const rtdbRoomId = req.params.rtdbRoomId;
  const roomRef = rtdb.ref(`/rooms/${rtdbRoomId}/current-game`);

  roomRef.get().then((snap) => {
    if (snap.exists) {
      const snapData = snap.val();
      const snapDataEntries = Object.values(snapData);
      const p1 = snapDataEntries[1];
      const p2 = snapDataEntries[2];

      return res.json({
        p1,
        p2,
      });
    }
  });
});

// Ejecuta express static y escucha el puerto //

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});

app.listen(port, () => {
  console.log("Server connected at http://localhost:${port}");
});
