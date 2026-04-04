import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type Role = 
  | 'Student' 
  | 'Warden' 
  | 'Sub-Warden' 
  | 'AR' 
  | 'Marshal' 
  | 'Maintenance Supervisor' 
  | 'Cleaning Supervisor';

interface User {
  email: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (email: string, role: Role) => {
    // Mock login logic
    const mockUser: User = {
      email,
      role,
      name: email.split('@')[0] || 'User',
    };
    setUser(mockUser);

    // Redirect based on role
    switch (role) {
      case 'Student':
        navigate('/student-dashboard');
        break;
      case 'Warden':
        navigate('/warden-dashboard');
        break;
      case 'Sub-Warden':
        navigate('/subwarden-dashboard');
        break;
      case 'AR':
        navigate('/ar-dashboard');
        break;
      case 'Marshal':
        navigate('/marshal-dashboard');
        break;
      case 'Maintenance Supervisor':
        navigate('/maintenance-dashboard');
        break;
      case 'Cleaning Supervisor':
        navigate('/cleaning-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
