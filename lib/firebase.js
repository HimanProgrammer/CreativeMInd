import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app, auth, googleProvider, analytics;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // ─── Firebase Auth is disabled until your domain is authorized ───────────
  // The Firebase Auth SDK loads an OAuth iframe immediately on getAuth().
  // If your domain (e.g. creativemind-zeta.vercel.app) is NOT yet added to
  // Firebase Console → Authentication → Settings → Authorized Domains,
  // this causes the "iframe.js" console error.
  //
  // TO ENABLE:
  //  1. Go to Firebase Console → Authentication → Settings → Authorized Domains
  //  2. Add:  creativemind-zeta.vercel.app  (and localhost)
  //  3. Add this to Vercel env vars:  NEXT_PUBLIC_FIREBASE_AUTH_ENABLED = true
  // ─────────────────────────────────────────────────────────────────────────
  if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_ENABLED === 'true') {
    const { getAuth, GoogleAuthProvider } = require('firebase/auth');
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  }

  // Analytics — safe, does not trigger the OAuth iframe
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((yes) => {
      if (yes) analytics = getAnalytics(app);
    });
  });
}

export { auth, googleProvider, analytics };
