import { rtdb } from "./realtimeDB";
import { firestore } from "./database";
import express from "express";
import nanoid from "nanoid";
import cors from "cors";
import "dotenv/config";

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

const playerCollection = firestore.collection("players");
const playroomCollection = firestore.collection("playrooms");

app.post("/user", (req, res) => {
  res.json({
    name: "",
  });
});

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

// Ejecutar express static y escuchar el puerto //

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.use(express.static("dist"));

app.listen(port, () => {
  console.log("Server connected at http://localhost:${port}");
});
