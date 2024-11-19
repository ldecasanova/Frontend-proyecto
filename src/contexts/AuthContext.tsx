// src/contexts/AuthContext.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface AuthContextType {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
    // Opcional: Hacer una solicitud al backend para cerrar sesión y eliminar la cookie
  };

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userId, setUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
