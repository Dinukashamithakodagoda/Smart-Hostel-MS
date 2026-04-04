import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Trash2, Sparkles } from 'lucide-react';

export const CleaningDashboard = () => {
  return (
    <DashboardLayout allowedRole="Cleaning Supervisor">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-teal-50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-xl">
          <Trash2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cleaning Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Oversee sanitation and cleaning schedules across all blocks.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Block A and B common areas scheduled for deep cleaning today.</p>
          <button className="text-sm font-medium text-white bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Manage Schedule
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
