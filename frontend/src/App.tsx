/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Main Application Component
 * Sets up the root component with all necessary context providers and layout
 * - Auth Context: Manages user authentication state
 * - Theme Context: Handles dark/light mode switching
 * - Complaint Context: Manages complaint-related state
 * - Canteen Context: Manages canteen operations state
 */

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CanteenProvider } from './context/CanteenContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/AppRoutes';

/**
 * App Component - Root of the React application
 * Wraps the entire app with providers for global state management
 * Provides responsive layout with navbar, main content area, and footer
 */
export default function App() {
  return (
    // Router: Enables client-side routing
    <Router>
      {/* Authentication provider - manages login/logout and user state */}
      <AuthProvider>
        {/* Theme provider - manages dark/light mode */}
        <ThemeProvider>
          {/* Complaint context - manages complaint state across the app */}
          <ComplaintProvider>
            {/* Canteen context - manages canteen operations state */}
            <CanteenProvider>
              {/* Main layout container with responsive design */}
              <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                {/* Navigation bar at the top */}
                <Navbar />
                {/* Main content area that grows to fill available space */}
                <main className="flex-grow">
                  {/* Application routes - all page definitions */}
                  <AppRoutes />
                </main>
                {/* Footer at the bottom */}
                <Footer />
              </div>
            </CanteenProvider>
          </ComplaintProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

