// =============================================
// CONTEXTE D'AUTHENTIFICATION
// =============================================
// Partage l'état d'authentification dans toute l'app

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services';
import { supabase } from '@/config/supabase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger l'état initial (une seule fois au montage de l'app)
    const loadAuthState = async () => {
      try {
        const authenticated = await authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const userData = await authService.getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur chargement auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event);
      
      const authenticated = !!session;
      setIsAuthenticated(authenticated);

      if (authenticated && session) {
        const userData = await authService.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

