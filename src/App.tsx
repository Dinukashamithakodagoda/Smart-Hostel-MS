/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
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

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ComplaintProvider>
            <CanteenProvider>
              <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <Navbar />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </CanteenProvider>
          </ComplaintProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

