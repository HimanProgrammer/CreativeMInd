'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Firebase Auth isn't initialised — nobody is signed in. We deliberately
      // do NOT fabricate a user from the cookie: the cookie's mere presence
      // proves nothing, and doing so displayed a fake "admin@creativemind.com"
      // identity while granting access to the whole panel.
      setUser(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        document.cookie = `admin_token=${token}; path=/; max-age=3600`;
        setUser(firebaseUser);
      } else {
        document.cookie = 'admin_token=; path=/; max-age=0';
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function login(email, password) {
    if (!auth) throw { code: 'auth/not-configured' };
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    document.cookie = `admin_token=${token}; path=/; max-age=3600`;
    return cred.user;
  }

  async function register(email, password, displayName) {
    if (!auth) throw { code: 'auth/not-configured' };
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const token = await cred.user.getIdToken();
    document.cookie = `admin_token=${token}; path=/; max-age=3600`;
    return cred.user;
  }

  async function loginWithGoogle() {
    if (!auth || !googleProvider) throw { code: 'auth/not-configured' };
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const token = await cred.user.getIdToken();
      document.cookie = `admin_token=${token}; path=/; max-age=3600`;
      return cred.user;
    } catch (err) {
      // The popup account-chooser is the intended flow. Only fall back to a
      // full-page redirect when a popup is genuinely impossible (blocked by the
      // browser, or an embedded webview that cannot open one).
      //
      // Deliberately NOT included:
      //   auth/popup-closed-by-user      -> the user cancelled; respect that
      //   auth/cancelled-popup-request   -> a double-click superseded the first
      //                                     popup; redirecting here would yank
      //                                     the page away mid-sign-in
      const cannotPopup = [
        'auth/popup-blocked',
        'auth/operation-not-supported-in-this-environment',
      ].includes(err?.code);

      if (cannotPopup) {
        const { signInWithRedirect } = await import('firebase/auth');
        await signInWithRedirect(auth, googleProvider);
        return null; // page navigates away; onAuthStateChanged finishes the job
      }
      throw err;
    }
  }

  async function logout() {
    if (auth) await signOut(auth);
    document.cookie = 'admin_token=; path=/; max-age=0';
  }

  async function resetPassword(email) {
    if (!auth) throw { code: 'auth/not-configured' };
    await sendPasswordResetEmail(auth, email);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
