import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { HardHat, Wrench, ArrowLeft, CheckCircle, Clock, PlayCircle } from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  reportedBy: string;
  date: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

export const MaintenanceDashboard = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [isViewingRequests, setIsViewingRequests] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/complaints/assigned`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load requests');
      }

      const data = await response.json();
      const mapped = (data.complaints || []).map((complaint: any) => ({
        id: complaint._id,
        title: complaint.title,
        description: complaint.description,
        reportedBy: complaint.submittedByRole || complaint.submittedByName || 'Warden',
        date: new Date(complaint.createdAt).toLocaleDateString(),
        status: complaint.status,
      }));
      setRequests(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load requests';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to update status');
      }

      setRequests((prev) => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      alert(message);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (isViewingRequests) {
    return (
      <DashboardLayout allowedRole="Maintenance Supervisor">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setIsViewingRequests(false)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Update repair statuses and progress</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Reported By</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      Loading requests...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-red-600 dark:text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No assigned requests.
                    </td>
                  </tr>
                ) : requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm text-gray-900 dark:text-white font-medium">{request.title}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{request.description}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{request.reportedBy}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{request.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        request.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {request.status === 'resolved' && <CheckCircle className="h-3.5 w-3.5" />}
                        {request.status === 'in_progress' && <PlayCircle className="h-3.5 w-3.5" />}
                        {request.status === 'pending' && <Clock className="h-3.5 w-3.5" />}
                        {request.status === 'resolved' ? 'Resolved' : request.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value as any)}
                        className="text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
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
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {pendingCount} maintenance {pendingCount === 1 ? 'request' : 'requests'} pending assignment.
          </p>
          <button 
            onClick={() => setIsViewingRequests(true)}
            className="text-sm font-medium text-white bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            View Requests
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};
