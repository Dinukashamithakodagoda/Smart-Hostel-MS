import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { HardHat, Wrench } from 'lucide-react';

export const MaintenanceDashboard = () => {
  return (
    <DashboardLayout allowedRole="Maintenance Supervisor">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-xl">
          <HardHat className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage repair requests and preventive maintenance schedules.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Pending Requests</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">12 maintenance requests pending assignment.</p>
          <button className="text-sm font-medium text-white bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            View Requests
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
