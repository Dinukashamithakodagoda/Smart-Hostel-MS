import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ShieldCheck, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const mockPendingAllocations = [
  { id: 1, name: 'Kamal Perera', gender: 'Male', faculty: 'Engineering', allocatedRoom: 'Block C - 101' },
  { id: 2, name: 'Nimali Silva', gender: 'Female', faculty: 'Science', allocatedRoom: 'Block A - 205' },
  { id: 3, name: 'Sunil Fernando', gender: 'Male', faculty: 'Computing', allocatedRoom: 'Block D - 302' },
];

export const WardenDashboard = () => {
  return (
    <DashboardLayout allowedRole="Warden">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Warden Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Hostel administration overview.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Occupancy Stats</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between"><span>Total Capacity:</span> <span className="font-medium text-gray-900 dark:text-white">500</span></div>
            <div className="flex justify-between"><span>Currently Allocated:</span> <span className="font-medium text-gray-900 dark:text-white">450</span></div>
            <div className="flex justify-between"><span>Available Rooms:</span> <span className="font-medium text-gray-900 dark:text-white">25</span></div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Critical Issues</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">3 pending issues require warden approval.</p>
          <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">Review Issues &rarr;</button>
        </div>
      </div>

      <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Pending Room Allocations (System Assigned)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and approve system-generated room allocations before forwarding to AR.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3">Faculty</th>
                <th className="px-6 py-3">System Allocated Room</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockPendingAllocations.map((allocation) => (
                <tr key={allocation.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{allocation.name}</td>
                  <td className="px-6 py-4">{allocation.gender}</td>
                  <td className="px-6 py-4">{allocation.faculty}</td>
                  <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{allocation.allocatedRoom}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Approve">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Reject">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
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
