import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ClipboardList, FileSpreadsheet, CheckCircle } from 'lucide-react';

const mockFinalAllocations = [
  { id: 1, name: 'Kamal Perera', gender: 'Male', faculty: 'Engineering', allocatedRoom: 'Block C - 101', wardenStatus: 'Approved' },
  { id: 2, name: 'Nimali Silva', gender: 'Female', faculty: 'Science', allocatedRoom: 'Block A - 205', wardenStatus: 'Approved' },
];

export const ARDashboard = () => {
  return (
    <DashboardLayout allowedRole="AR">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AR Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Assistant Registrar - Policy and allocations overview.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <FileSpreadsheet className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Reports & Analytics</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Generate comprehensive reports on hostel utilization and student demographics.</p>
          <button className="text-sm font-medium text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Finalize Room Allocations</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and give final approval for allocations approved by the Warden.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3">Faculty</th>
                <th className="px-6 py-3">Allocated Room</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockFinalAllocations.map((allocation) => (
                <tr key={allocation.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{allocation.name}</td>
                  <td className="px-6 py-4">{allocation.gender}</td>
                  <td className="px-6 py-4">{allocation.faculty}</td>
                  <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">{allocation.allocatedRoom}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Finalize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
