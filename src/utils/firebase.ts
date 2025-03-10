import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECTID,
    clientEmail: process.env.CLIENTEMAIL,
    privateKey: process.env.PRIVATEKEY!.replace(/\\n/g, "\n"),
  }),
});

const adminMessage = admin.messaging();

export { adminMessage };
