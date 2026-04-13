import React, { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ShieldCheck, Users, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Wrench, Sparkles, Send, Camera, Upload, X, Coffee, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WardenDashboard = () => {
  const { user } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [complaints, setComplaints] = useState<any[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [allocationsLoading, setAllocationsLoading] = useState(true);
  const [allocationsError, setAllocationsError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ totalCapacity: number; allocatedCount: number; availableRooms: number } | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState<string | null>(null);
  const [isViewingIssues, setIsViewingIssues] = useState(false);
  const [isViewingComplaints, setIsViewingComplaints] = useState(false);
  
  // Service Request State
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestType, setRequestType] = useState<'Maintenance' | 'Cleaning' | 'Canteen'>('Maintenance');
  const [requestForm, setRequestForm] = useState({
    location: '',
    description: '',
    urgency: 'Normal'
  });
    const fetchComplaints = async () => {
      try {
        setComplaintsLoading(true);
        setComplaintsError(null);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/complaints/assigned`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to load complaints');
        }

        const data = await response.json();
        setComplaints(data.complaints || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load complaints';
        setComplaintsError(message);
      } finally {
        setComplaintsLoading(false);
      }
    };
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingRequest(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: `${requestType} Request - ${requestForm.location} (${requestForm.urgency} Urgency)`,
          category: requestType,
          description: requestForm.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to submit request');
      }

      alert(`${requestType} request submitted successfully for ${requestForm.location}!`);
      setIsSubmittingRequest(false);
      setRequestForm({ location: '', description: '', urgency: 'Normal' });
      setPhotoPreview(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit request';
      alert(message);
      setIsSubmittingRequest(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/warden/stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load stats');
      }

      const data = await response.json();
      setStats(data.stats || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load stats';
      setStatsError(message);
    }
  };

  const fetchIssues = async () => {
    try {
      setIssuesLoading(true);
      setIssuesError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/issues`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load issues');
      }

      const data = await response.json();
      setIssues(data.issues || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load issues';
      setIssuesError(message);
    } finally {
      setIssuesLoading(false);
    }
  };

  const fetchAllocations = async () => {
    try {
      setAllocationsLoading(true);
      setAllocationsError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/applications/pending`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load applications');
      }

      const data = await response.json();
      setAllocations(data.applications || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load applications';
      setAllocationsError(message);
    } finally {
      setAllocationsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
    fetchComplaints();
    fetchStats();
    fetchIssues();
  }, []);
  const handleComplaintStatus = async (id: string, status: 'in_progress' | 'resolved') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to update complaint');
      }

      setComplaints((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update complaint';
      alert(message);
    }
  };

  const handleApprove = (id: number) => {
    const approve = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/applications/${id}/warden-approve`, {
          method: 'PATCH',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to approve');
        }

        setAllocations((prev) => prev.filter((a) => a._id !== id));
        alert('Allocation approved and forwarded to AR.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to approve';
        alert(message);
      }
    };

    approve();
  };

  const handleReject = (id: number) => {
    const reject = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/applications/${id}/warden-reject`, {
          method: 'PATCH',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to reject');
        }

        setAllocations((prev) => prev.filter((a) => a._id !== id));
        alert('Allocation rejected.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to reject';
        alert(message);
      }
    };

    reject();
  };

  const updateIssueStatus = async (id: string, newStatus: 'Pending' | 'Reviewed' | 'Resolved') => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/issues/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to update issue');
      }

      setIssues((prev) => prev.map((issue) => (issue._id === id ? { ...issue, status: newStatus } : issue)));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update issue';
      alert(message);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const pendingIssuesCount = issues.filter(i => i.status === 'Pending').length;

  if (isSubmittingRequest) {
    return (
      <DashboardLayout allowedRole="Warden">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => {
              setIsSubmittingRequest(false);
              setPhotoPreview(null);
            }}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              New {requestType} Request
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Submit a direct request to the {requestType.toLowerCase()} team.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleRequestSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input 
                type="text" 
                required
                value={requestForm.location}
                onChange={(e) => setRequestForm({...requestForm, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Block A, Room 101 or Common Area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea 
                required
                rows={4}
                value={requestForm.description}
                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={`Describe the ${requestType.toLowerCase()} issue in detail...`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo Evidence (Optional)</label>
              {photoPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-contain" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                >
                  <Camera className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Click to upload photo</span>
                  <span className="text-xs mt-1 opacity-75">PNG, JPG up to 5MB</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urgency</label>
              <select
                value={requestForm.urgency}
                onChange={(e) => setRequestForm({...requestForm, urgency: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setIsSubmittingRequest(false);
                  setPhotoPreview(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  if (isViewingIssues) {
    return (
      <DashboardLayout allowedRole="Warden">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setIsViewingIssues(false)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Critical Issues</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Review and manage escalated hostel issues.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Issue</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Reported By</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Priority</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {issuesLoading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      Loading issues...
                    </td>
                  </tr>
                ) : issuesError ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-red-600 dark:text-red-400">
                      {issuesError}
                    </td>
                  </tr>
                ) : issues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      No issues found.
                    </td>
                  </tr>
                ) : issues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{issue.description}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{issue.reportedByRole}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{new Date(issue.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        issue.priority === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        issue.status === 'Reviewed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={issue.status}
                        onChange={(e) => updateIssueStatus(issue._id, e.target.value as any)}
                        className="text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
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

  if (isViewingComplaints) {
    return (
      <DashboardLayout allowedRole="Warden">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setIsViewingComplaints(false)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Complaints</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Review, accept, or reject student complaints.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Complaint</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Submitted By</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {complaintsLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      Loading complaints...
                    </td>
                  </tr>
                ) : complaintsError ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-red-600 dark:text-red-400">
                      {complaintsError}
                    </td>
                  </tr>
                ) : complaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No complaints found.
                    </td>
                  </tr>
                ) : complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{complaint.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{complaint.description}</p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      {complaint.submittedByName || 'Student'}<br/>
                      <span className="text-xs text-gray-400">{complaint.submittedByRole || 'Student'}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {complaint.status === 'resolved' ? 'Resolved' : complaint.status === 'in_progress' ? 'Accepted' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      {complaint.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              handleComplaintStatus(complaint._id, 'in_progress');
                              alert('Complaint accepted and forwarded to team.');
                            }}
                            className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                            title="Accept"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleComplaintStatus(complaint._id, 'resolved')}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Occupancy Stats</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Total Capacity:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats?.totalCapacity ?? '--'}</span>
            </div>
            <div className="flex justify-between">
              <span>Currently Allocated:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats?.allocatedCount ?? '--'}</span>
            </div>
            <div className="flex justify-between">
              <span>Available Rooms:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats?.availableRooms ?? '--'}</span>
            </div>
            {statsError && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">{statsError}</p>
            )}
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Critical Issues</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {pendingIssuesCount} pending {pendingIssuesCount === 1 ? 'issue requires' : 'issues require'} warden approval.
          </p>
          <button 
            onClick={() => setIsViewingIssues(true)}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            Review Issues &rarr;
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-red-600 dark:text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Student Complaints</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {complaints.filter(c => c.status === 'Pending').length} pending complaints require review.
          </p>
          <button 
            onClick={() => setIsViewingComplaints(true)}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            Review Complaints &rarr;
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Service Requests</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Submit direct requests to maintenance or cleaning teams.
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            <button 
              onClick={() => { setRequestType('Maintenance'); setIsSubmittingRequest(true); }}
              className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 flex items-center gap-1.5"
            >
              <Wrench className="h-3.5 w-3.5" />
              Maintenance
            </button>
            <button 
              onClick={() => { setRequestType('Cleaning'); setIsSubmittingRequest(true); }}
              className="text-xs font-medium text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors dark:bg-teal-900/30 dark:text-teal-400 dark:hover:bg-teal-900/50 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Cleaning
            </button>
            <button 
              onClick={() => { setRequestType('Canteen'); setIsSubmittingRequest(true); }}
              className="text-xs font-medium text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 flex items-center gap-1.5"
            >
              <Coffee className="h-3.5 w-3.5" />
              Canteen
            </button>
          </div>
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
              {allocationsLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Loading pending allocations...
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
                    No pending allocations to review.
                  </td>
                </tr>
              ) : (
                allocations.map((allocation) => (
                  <tr key={allocation._id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{allocation.fullName}</td>
                    <td className="px-6 py-4">{allocation.gender}</td>
                    <td className="px-6 py-4">{allocation.faculty}</td>
                    <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{allocation.assignedRoom || 'Pending'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(allocation._id)}
                          className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleReject(allocation._id)}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
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
