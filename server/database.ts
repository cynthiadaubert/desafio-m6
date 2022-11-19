/* import * as admin from "firebase-admin";
import * as firebaseKey from "./firebaseKey.json";

const app = admin.initializeApp({
  credential: admin.credential.cert(firebaseKey as any),
  databaseURL: "https://clase-firebase-e7501-default-rtdb.firebaseio.com/",
});

const firestoreDB = admin.firestore();
const realtimeDB = admin.database();

export { firestoreDB, realtimeDB }; */

import * as admin from "firebase-admin";

import * as serviceAccount from "./firebaseKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://clase-firebase-e7501-default-rtdb.firebaseio.com/",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore };

/* 
unificar en un solo archivo para la realtime y el admin */
