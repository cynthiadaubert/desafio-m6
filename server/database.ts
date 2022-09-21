import * as admin from "firebase-admin";

import * as serviceAccount from "./firebaseKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://clase-firebase-e7501-default-rtdb.firebaseio.com/",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
