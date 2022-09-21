import { rtdb } from "./realtimeDB";
import { firestore } from "./database";
import express from "express";
import nanoid from "nanoid";
import "dotenv/config";

const port = process.env.PORT || 3009;
const app = express();

/* app.use(cors()); */

const playerCollectionRef = firestore.collection("players");
const playroomCollection = firestore.collection("playrooms");

app.post("/signup", (req, res) => {
  const name = req.body.name;
  playerCollectionRef
    .where("name", "==", name)
    .get()
    .then((searchRes) => {
      if (searchRes.empty) {
        playerCollectionRef.add({ name }).then((newPlayerRef) => {
          res.json({
            id: newPlayerRef.id,
            new: true,
          });
        });
      } else {
        res.status(400).json({ message: "usuario ya registrado" });
      }
    });
});

/* app.post("/signup", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  userCollectionRef
    .where("email", "==", email)
    .get()
    .then((searchRes) => {
      console.log("soy la respuesta de la busqueda", searchRes);
      if (searchRes.empty) {
        userCollectionRef
          .add({
            email,
            name,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "usuario ya registrado",
        });
      }
    });

  userCollectionRef.doc("1234");
});
 */

// Ejecutar express static y escuchar el puerto //

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.use(express.static("dist"));

app.listen(port, () => {
  console.log("Server connected at http://localhost:${port}");
});
