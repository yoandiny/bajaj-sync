import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mock';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking local storage for token
    const storedUser = localStorage.getItem('bajajsync_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    // MOCK LOGIN LOGIC
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // In real app, send to backend. Here we check mock users.
        const foundUser = MOCK_USERS.find(u => 
          (u.email === identifier || u.phone === identifier)
        );

        if (foundUser) {
          if (foundUser.status === 'REVOKED') {
            reject(new Error('Ce compte a été désactivé. Contactez le support.'));
            return;
          }
          setUser(foundUser);
          localStorage.setItem('bajajsync_user', JSON.stringify(foundUser));
          resolve();
        } else {
          reject(new Error('Identifiants incorrects'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bajajsync_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
