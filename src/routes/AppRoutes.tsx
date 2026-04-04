import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { About } from '../pages/About';
import { Rules } from '../pages/Rules';
import { Facilities } from '../pages/Facilities';
import { FAQ } from '../pages/FAQ';
import { StudentDashboard } from '../pages/dashboards/StudentDashboard';
import { WardenDashboard } from '../pages/dashboards/WardenDashboard';
import { SubWardenDashboard } from '../pages/dashboards/SubWardenDashboard';
import { ARDashboard } from '../pages/dashboards/ARDashboard';
import { MarshalDashboard } from '../pages/dashboards/MarshalDashboard';
import { MaintenanceDashboard } from '../pages/dashboards/MaintenanceDashboard';
import { CleaningDashboard } from '../pages/dashboards/CleaningDashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route path="/faq" element={<FAQ />} />
      
      {/* Dashboards */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/warden-dashboard" element={<WardenDashboard />} />
      <Route path="/subwarden-dashboard" element={<SubWardenDashboard />} />
      <Route path="/ar-dashboard" element={<ARDashboard />} />
      <Route path="/marshal-dashboard" element={<MarshalDashboard />} />
      <Route path="/maintenance-dashboard" element={<MaintenanceDashboard />} />
      <Route path="/cleaning-dashboard" element={<CleaningDashboard />} />
    </Routes>
  );
};
