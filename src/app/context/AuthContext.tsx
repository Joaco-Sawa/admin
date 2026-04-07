import { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface AuthContextType {
  currentUser: AuthUser;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuario por defecto (el que inició sesión)
const defaultUser: AuthUser = {
  id: 'admin-001',
  name: 'Francisca León',
  email: 'admin@example.com',
  role: 'Admin Cliente',
  initials: 'FL'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('🔐 AuthProvider: Inicializando...');
  const [currentUser, setCurrentUser] = useState<AuthUser>(defaultUser);

  const login = (email: string, password: string): boolean => {
    // Validación simple para el login
    if (email === 'admin@example.com' && password === 'admin') {
      setCurrentUser(defaultUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Limpiar datos del usuario
    setCurrentUser(defaultUser);
  };

  console.log('✅ AuthProvider: Renderizando con usuario', currentUser.name);
  
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
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