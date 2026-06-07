'use client';
import { AuthProvider } from '@/lib/authContext';

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes grow { from { width: 0; } to { width: 100%; } }`}</style>
      {children}
    </AuthProvider>
  );
}
