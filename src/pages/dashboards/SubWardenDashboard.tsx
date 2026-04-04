import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users, ClipboardCheck } from 'lucide-react';

export const SubWardenDashboard = () => {
  return (
    <DashboardLayout allowedRole="Sub-Warden">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
          <Users className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sub-Warden Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Daily student management for Block A (Female).</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Attendance</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Mark and review student attendance for your assigned blocks.</p>
          <button className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Mark Attendance
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
