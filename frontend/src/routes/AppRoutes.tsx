/**
 * Application Routes
 * Defines all the routes and pages available in the application
 * Organized by user role and functionality
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Public pages
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { About } from '../pages/About';
import { Rules } from '../pages/Rules';
import { Facilities } from '../pages/Facilities';
import { FAQ } from '../pages/FAQ';
// Dashboards for different roles
import { StudentDashboard } from '../pages/dashboards/StudentDashboard';
import { WardenDashboard } from '../pages/dashboards/WardenDashboard';
import { SubWardenDashboard } from '../pages/dashboards/SubWardenDashboard';
import { ARDashboard } from '../pages/dashboards/ARDashboard';
import { MarshalDashboard } from '../pages/dashboards/MarshalDashboard';
import { MaintenanceDashboard } from '../pages/dashboards/MaintenanceDashboard';
import { CleaningDashboard } from '../pages/dashboards/CleaningDashboard';
import { CanteenMenu } from '../pages/canteen/CanteenMenu';
import { CanteenOrder } from '../pages/canteen/CanteenOrder';
import { CanteenManagerDashboard } from '../pages/dashboards/CanteenManagerDashboard';
import { AttendanceDashboard } from '../pages/dashboards/AttendanceDashboard';

/**
 * AppRoutes Component - Defines all application routes
 * Maps URLs to React components
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public pages - accessible without authentication */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* Role-based Dashboards */}
      {/* Student dashboard - for hostel students */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      {/* Attendance dashboard - for AR (Attendance Register) role */}
      <Route path="/attendance-dashboard" element={<AttendanceDashboard />} />
      {/* Warden dashboard - for main hostel administrator */}
      <Route path="/warden-dashboard" element={<WardenDashboard />} />
      {/* Sub-warden dashboard - for assistant warden */}
      <Route path="/subwarden-dashboard" element={<SubWardenDashboard />} />
      {/* AR (Attendance Register) dashboard */}
      <Route path="/ar-dashboard" element={<ARDashboard />} />
      {/* Marshal dashboard - for discipline and conduct */}
      <Route path="/marshal-dashboard" element={<MarshalDashboard />} />
      {/* Maintenance supervisor dashboard */}
      <Route path="/maintenance-dashboard" element={<MaintenanceDashboard />} />
      {/* Cleaning supervisor dashboard */}
      <Route path="/cleaning-dashboard" element={<CleaningDashboard />} />
      {/* Canteen manager dashboard */}
      <Route path="/canteen-dashboard" element={<CanteenManagerDashboard />} />
      
      {/* Canteen Pages - for students to browse and order */}
      {/* Canteen menu page - browse available items */}
      <Route path="/canteen-menu" element={<CanteenMenu />} />
      {/* Canteen order page - place and manage orders */}
      <Route path="/canteen-order" element={<CanteenOrder />} />
    </Routes>
  );
};
