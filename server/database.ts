import * as admin from "firebase-admin";

import * as firebaseKey from "./firebaseKey.json";

admin.initializeApp({
  credential: admin.credential.cert(firebaseKey as any),
  databaseURL: "https://clase-firebase-e7501-default-rtdb.firebaseio.com/",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore };
