require("dotenv").config();
const admin = require("firebase-admin");

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} = process.env;

// ================= VALIDATION =================
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error("❌ Firebase ENV missing");
  process.exit(1);
}

// ================= FIX PRIVATE KEY =================
// Render / .env issue: \n comes as string
const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

// ================= INIT =================
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log("🔥 Firebase Admin Initialized");

  } catch (error) {
    console.error("❌ Firebase Admin Init Error:", error.message);
    process.exit(1);
  }
}

module.exports = admin;