import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

// Construct the client email from the project ID if not provided
const clientEmail = process.env.FB_CLIENT_EMAIL;

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail,
    privateKey: process.env.FB_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase Admin
const app = !getApps().length
  ? initializeApp(firebaseAdminConfig)
  : getApps()[0];
const adminAuth = getAuth(app);
const adminDatabase = getDatabase(app);

export { adminAuth, adminDatabase };
