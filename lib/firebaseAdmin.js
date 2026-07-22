// SERVER ONLY — never import this from a client component.
// Requires a Firebase service-account key, supplied as a single JSON string in
// FIREBASE_SERVICE_ACCOUNT_KEY (no NEXT_PUBLIC_ prefix — it must stay secret).
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let app = null;
let initError = null;

function init() {
  if (app || initError) return;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    initError = 'FIREBASE_SERVICE_ACCOUNT_KEY is not set.';
    return;
  }
  try {
    const creds = JSON.parse(raw);
    // Vercel/env files often escape the newlines in the private key.
    if (creds.private_key) creds.private_key = creds.private_key.replace(/\\n/g, '\n');
    app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(creds) });
  } catch (e) {
    initError = `Could not parse FIREBASE_SERVICE_ACCOUNT_KEY: ${e.message}`;
  }
}

export function adminAuth() {
  init();
  if (!app) throw new Error(initError || 'Firebase Admin not initialised.');
  return getAuth(app);
}

export function adminConfigured() {
  init();
  return Boolean(app);
}

export function adminConfigError() {
  init();
  return initError;
}
