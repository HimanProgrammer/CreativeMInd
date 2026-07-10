// Run once: node scripts/create-admin-user.js
// Creates the admin Firebase user so login works

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyCsRBQrLxpommdKdFTz_3yRkV1EzAns-NE',
  authDomain: 'creatieminditsolutions.firebaseapp.com',
  projectId: 'creatieminditsolutions',
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

const EMAIL    = 'admin@creativemind.com';
const PASSWORD = 'admin123';

(async () => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
    console.log('✅ Admin user created:', cred.user.email);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('ℹ️  User already exists, trying sign-in...');
      try {
        await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
        console.log('✅ Login works! Use:', EMAIL, '/', PASSWORD);
      } catch (e2) {
        console.error('❌ Login failed:', e2.message);
      }
    } else {
      console.error('❌ Error:', err.message);
    }
  }
  process.exit(0);
})();
