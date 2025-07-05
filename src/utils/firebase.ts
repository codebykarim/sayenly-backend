import admin from "firebase-admin";

console.log("🔥 Initializing Firebase Admin...");
console.log("📋 Firebase Config:", {
  projectId: process.env.PROJECTID ? "✅ Set" : "❌ Missing",
  clientEmail: process.env.CLIENTEMAIL ? "✅ Set" : "❌ Missing",
  privateKey: process.env.PRIVATEKEY ? "✅ Set" : "❌ Missing",
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECTID,
    clientEmail: process.env.CLIENTEMAIL,
    privateKey: process.env.PRIVATEKEY!.replace(/\\n/g, "\n"),
  }),
});

console.log("✅ Firebase Admin initialized successfully");

const adminMessage = admin.messaging();

export { adminMessage };
