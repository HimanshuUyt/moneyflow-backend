require("dotenv").config();
const admin = require("firebase-admin");

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

// 🔒 Validate env variables
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error("Firebase environment variables are missing");
}

// 🔥 Fix private key format safely
const privateKey = FIREBASE_PRIVATE_KEY.includes("\\n")
  ? FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : FIREBASE_PRIVATE_KEY;

// 🚀 Initialize Firebase (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

module.exports = admin;