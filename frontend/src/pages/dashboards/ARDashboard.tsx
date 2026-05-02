import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { NoticeComposer } from '../../components/NoticeComposer';
import { NoticeManager } from '../../components/NoticeManager';
import { ClipboardList, FileSpreadsheet, CheckCircle, Download } from 'lucide-react';

export const ARDashboard = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [allocations, setAllocations] = useState<any[]>([]);
  const [allocationsLoading, setAllocationsLoading] = useState(true);
  const [allocationsError, setAllocationsError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchAllocations = async () => {
    try {
      setAllocationsLoading(true);
      setAllocationsError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/applications/approved`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load approvals');
      }

      const data = await response.json();
      setAllocations(data.applications || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load approvals';
      setAllocationsError(message);
    } finally {
      setAllocationsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleFinalize = (id: number) => {
    const finalize = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/applications/${id}/ar-finalize`, {
          method: 'PATCH',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to finalize');
        }

        setAllocations((prev) => prev.filter((a) => a._id !== id));
        alert('Room allocation finalized successfully.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to finalize';
        alert(message);
      }
    };

    finalize();
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const reportData = [
        ['Block', 'Capacity', 'Occupied', 'Available', 'Gender Allocation'],
        ['Block A', '100', '95', '5', 'Female'],
        ['Block B', '100', '80', '20', 'Female'],
        ['Block C', '100', '100', '0', 'Male'],
        ['Block D', '100', '90', '10', 'Male'],
        ['Block E', '100', '85', '15', 'Female'],
      ];

      const csvContent = reportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `hostel_utilization_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    }, 1000);
  };

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
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
        <NoticeComposer />
      </div>

      <div className="mt-6">
        <NoticeManager />
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
              {allocationsLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading approved allocations...
                  </td>
                </tr>
              ) : allocationsError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-600 dark:text-red-400">
                    {allocationsError}
                  </td>
                </tr>
              ) : allocations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No allocations pending finalization.
                  </td>
                </tr>
              ) : (
                allocations.map((allocation) => (
                  <tr key={allocation._id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{allocation.fullName}</td>
                    <td className="px-6 py-4">{allocation.gender}</td>
                    <td className="px-6 py-4">{allocation.faculty}</td>
                    <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">{allocation.assignedRoom || 'Pending'}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleFinalize(allocation._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Finalize
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
