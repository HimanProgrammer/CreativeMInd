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
    if (!auth) { setLoading(false); return; }
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
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    document.cookie = `admin_token=${token}; path=/; max-age=3600`;
    return cred.user;
  }

  async function register(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const token = await cred.user.getIdToken();
    document.cookie = `admin_token=${token}; path=/; max-age=3600`;
    return cred.user;
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    const token = await cred.user.getIdToken();
    document.cookie = `admin_token=${token}; path=/; max-age=3600`;
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
    document.cookie = 'admin_token=; path=/; max-age=0';
  }

  async function resetPassword(email) {
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
