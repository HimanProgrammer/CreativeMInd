import { initializeApp, getApps } from 'firebase/app';
// IMPORTANT: use a static ESM import here, NOT require('firebase/auth').
// Mixing require() here with `import` in authContext.js gives the bundler two
// separate copies of the module, so the GoogleAuthProvider created here fails
// the instanceof check inside signInWithPopup — which surfaces as the very
// unhelpful "auth/argument-error" and no popup ever opens.
// Importing is safe: it does not create the OAuth iframe. Only calling
// getAuth() does, which stays behind the flag below.
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Realtime Database URL. Defaults to this project's default RTDB; override with
// NEXT_PUBLIC_FIREBASE_DATABASE_URL if your DB lives in a non-US region
// (e.g. https://<project>-default-rtdb.asia-southeast1.firebasedatabase.app).
const DATABASE_URL =
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
  'https://creatieminditsolutions-default-rtdb.firebaseio.com';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app, auth, googleProvider, analytics, rtdb;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // Realtime Database — used by the contact form. Guarded so a bad/unset URL
  // never crashes the app on import.
  try { rtdb = getDatabase(app); } catch { rtdb = null; }

  // Auth stays behind a flag so projects without an authorized domain don't
  // trigger the OAuth iframe error. Authorized domains for this project:
  // localhost, creatieminditsolutions.firebaseapp.com,
  // creatieminditsolutions.web.app, creativemind-zeta.vercel.app
  if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_ENABLED === 'true') {
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    // Always show the Google account chooser dialog, even if the browser
    // already has a single session — so you can pick which Gmail to use.
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  }

  // Analytics — safe, does not trigger the OAuth iframe
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((yes) => {
      if (yes) analytics = getAnalytics(app);
    });
  });
}

export { auth, googleProvider, analytics, rtdb };
