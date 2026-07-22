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
      // Firebase not configured — check for dev bypass cookie
      const tokenCookie = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('admin_token='));
      const token = tokenCookie?.split('=').slice(1).join('=');
      if (token && token !== '') {
        setUser({ email: 'admin@creativemind.com', displayName: 'Admin', uid: 'dev-admin', photoURL: null });
      }
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
      // Popups are commonly blocked (or unsupported in embedded webviews).
      // Fall back to a full-page redirect, which always works.
      const popupIssue = [
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
        'auth/operation-not-supported-in-this-environment',
      ].includes(err?.code);
      if (popupIssue && err.code !== 'auth/popup-closed-by-user') {
        const { signInWithRedirect } = await import('firebase/auth');
        await signInWithRedirect(auth, googleProvider);
        return null; // page navigates away; result handled on return
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
