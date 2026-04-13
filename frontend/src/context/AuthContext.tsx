import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type Role = 
  | 'Student' 
  | 'Warden' 
  | 'Sub-Warden' 
  | 'AR' 
  | 'Marshal' 
  | 'Maintenance Supervisor' 
  | 'Cleaning Supervisor'
  | 'Canteen';

interface User {
  email: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const login = async (email: string, password: string) => {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Login failed');
    }

    const loggedInUser: User = {
      email: data.user.email,
      role: data.user.role,
      name: data.user.name,
    };

    localStorage.setItem('auth_token', data.token);
    setUser(loggedInUser);

    switch (loggedInUser.role) {
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
      case 'Canteen':
        navigate('/canteen-dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
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
