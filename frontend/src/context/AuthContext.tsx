/**
 * Authentication Context
 * Manages user authentication state and login/logout operations
 * Provides authenticated user information to the entire application
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * All available user roles in the system
 */
export type Role = 
  | 'Student' 
  | 'Warden' 
  | 'Sub-Warden' 
  | 'AR' 
  | 'Marshal' 
  | 'Maintenance Supervisor' 
  | 'Cleaning Supervisor'
  | 'Canteen';

/**
 * User information interface
 */
interface User {
  email: string;          // User's email
  role: Role;             // User's role in the system
  name: string;           // User's full name
}

/**
 * Auth context type definition
 * Provides authentication methods and state
 */
interface AuthContextType {
  user: User | null;                                 // Current logged-in user or null
  login: (email: string, password: string) => Promise<void>;  // Login method
  logout: () => void;                                // Logout method
  isAuthenticated: boolean;                          // Whether user is logged in
}

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * Wraps the app to provide authentication state to all components
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Store current logged-in user
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  /**
   * Login function - authenticates user with email and password
   * Stores JWT token in localStorage
   * Routes user to appropriate dashboard based on role
   * @param email - User's email
   * @param password - User's password
   * @throws Error if login fails
   */
  const login = async (email: string, password: string) => {
    // Send login request to backend
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Parse response
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Login failed');
    }

    // Create user object from response
    const loggedInUser: User = {
      email: data.user.email,
      role: data.user.role,
      name: data.user.name,
    };

    // Store JWT token in localStorage for API authentication
    localStorage.setItem('auth_token', data.token);
    // Update user state
    setUser(loggedInUser);

    // Route to appropriate dashboard based on user role
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

  /**
   * Logout function - clears authentication
   * Removes token from localStorage
   * Clears user state
   * Redirects to home page
   */
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

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 * @returns Auth context with user, login, logout, isAuthenticated
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
