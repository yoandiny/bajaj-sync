import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement, restaurer la session depuis le token stocké
  useEffect(() => {
    const restoreSession = async () => {
      const userStr = localStorage.getItem('bajajsync_user');
      if (!userStr) {
        setIsLoading(false);
        return;
      }
      try {
        // Vérifier que le token est encore valide côté serveur
        const currentUser = await authService.me();
        setUser(currentUser);
      } catch {
        // Token expiré ou invalide : nettoyer
        localStorage.removeItem('bajajsync_user');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (identifier: string, password: string): Promise<void> => {
    const data = await authService.login(identifier, password);
    // authService.login stocke déjà {token, ...user} dans localStorage
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('bajajsync_user');
    setUser(null);
    authService.logout().catch(() => { }); // fire-and-forget
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
