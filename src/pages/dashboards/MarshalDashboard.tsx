import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ShieldCheck, AlertOctagon } from 'lucide-react';

export const MarshalDashboard = () => {
  return (
    <DashboardLayout allowedRole="Marshal">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 rounded-xl">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marshal Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Security and discipline management.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Incident Reports</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Log and review disciplinary incidents or security breaches.</p>
          <button className="text-sm font-medium text-white bg-slate-800 dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors">
            Log Incident
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
