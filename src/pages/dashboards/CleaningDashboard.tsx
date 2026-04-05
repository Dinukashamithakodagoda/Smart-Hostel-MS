import React, { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Trash2, ArrowLeft, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface Schedule {
  id: number;
  block: string;
  area: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export const CleaningDashboard = () => {
  const [isManaging, setIsManaging] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 1, block: 'Block A', area: 'Common Areas', status: 'Pending' },
    { id: 2, block: 'Block B', area: 'Washrooms', status: 'In Progress' },
    { id: 3, block: 'Block C', area: 'Corridors', status: 'Completed' },
    { id: 4, block: 'Block D', area: 'Study Rooms', status: 'Pending' },
  ]);

  const updateStatus = (id: number, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  if (isManaging) {
    return (
      <DashboardLayout allowedRole="Cleaning Supervisor">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setIsManaging(false)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Schedule</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Update cleaning task statuses</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Block</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Area</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm text-gray-900 dark:text-white font-medium">{schedule.block}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{schedule.area}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        schedule.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        schedule.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {schedule.status === 'Completed' && <CheckCircle className="h-3.5 w-3.5" />}
                        {schedule.status === 'In Progress' && <PlayCircle className="h-3.5 w-3.5" />}
                        {schedule.status === 'Pending' && <Clock className="h-3.5 w-3.5" />}
                        {schedule.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={schedule.status}
                        onChange={(e) => updateStatus(schedule.id, e.target.value as any)}
                        className="text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            <h3 className="font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {schedules.filter(s => s.status !== 'Completed').length} tasks remaining for today.
          </p>
          <button 
            onClick={() => setIsManaging(true)}
            className="text-sm font-medium text-white bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Manage Schedule
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
