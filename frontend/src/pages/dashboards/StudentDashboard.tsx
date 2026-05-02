import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GraduationCap, Bed, FileText, Bell, X, Upload, ImagePlus, Calendar, CheckCircle, Clock, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ComplaintCategory } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [complaints, setComplaints] = useState<any[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintsError, setComplaintsError] = useState<string | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [roommatesLoading, setRoommatesLoading] = useState(true);
  const [roommatesError, setRoommatesError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoticesModalOpen, setIsNoticesModalOpen] = useState(false);
  const [notices, setNotices] = useState<any[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [noticesError, setNoticesError] = useState<string | null>(null);
  const unreadCount = notices.filter(n => !n.isRead).length;
  
  const studentComplaints = complaints;
  
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    category: 'Maintenance' as ComplaintCategory,
    description: '',
    photo: null as string | null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setApplicationLoading(true);
        setApplicationError(null);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/applications/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to load application');
        }

        const data = await response.json();
        setApplication(data.application || null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load application';
        setApplicationError(message);
      } finally {
        setApplicationLoading(false);
      }
    };

    const fetchRoommates = async () => {
      try {
        setRoommatesLoading(true);
        setRoommatesError(null);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/applications/me/roommates`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to load roommates');
        }

        const data = await response.json();
        setRoommates(data.roommates || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load roommates';
        setRoommatesError(message);
      } finally {
        setRoommatesLoading(false);
      }
    };

    fetchApplication();
    fetchRoommates();
    const fetchComplaints = async () => {
      try {
        setComplaintsLoading(true);
        setComplaintsError(null);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/complaints/mine`, {
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

    fetchComplaints();

    const fetchNotices = async () => {
      try {
        setNoticesLoading(true);
        setNoticesError(null);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/notices`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to load notices');
        }

        const data = await response.json();
        const mapped = (data.notices || []).map((notice: any) => ({
          id: notice._id,
          title: notice.title,
          date: new Date(notice.createdAt).toISOString().split('T')[0],
          content: notice.content,
          isRead: false,
        }));
        setNotices(mapped);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load notices';
        setNoticesError(message);
      } finally {
        setNoticesLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setComplaintForm({ ...complaintForm, photo: url });
      setPhotoPreview(url);
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: complaintForm.subject,
          category: complaintForm.category,
          description: complaintForm.description,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to submit complaint');
      }

      const data = await response.json().catch(() => ({}));
      if (data?.complaint) {
        setComplaints((prev) => [data.complaint, ...prev]);
      }

      alert('Complaint submitted successfully!');
      setIsModalOpen(false);
      setComplaintForm({ subject: '', category: 'Maintenance', description: '', photo: null });
      setPhotoPreview(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit complaint';
      alert(message);
    }
  };

  const normalizedStatus = application?.status
    ? String(application.status).toLowerCase().replace('-', '_')
    : null;
  const isWardenApproved = normalizedStatus === 'approved_warden' || normalizedStatus === 'approved';
  const isWardenRejected = normalizedStatus === 'rejected_warden' || normalizedStatus === 'rejected';
  const isArFinalized = normalizedStatus === 'finalized';

  return (
    <DashboardLayout allowedRole="Student">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back! Here's your hostel overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-xl md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <Bed className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">Room Allocation Status</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">System Allocated</span>
              {applicationLoading ? (
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              ) : application ? (
                <span className="font-medium text-gray-900 dark:text-white">
                  {application.assignedRoom ? `Room ${application.assignedRoom}` : 'Pending'}
                </span>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">No application</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Hostel Block</span>
                {applicationLoading ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                ) : application?.assignedBlock ? (
                  <span className="font-medium text-gray-900 dark:text-white">Block {application.assignedBlock}</span>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
                )}
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Room Number</span>
                {applicationLoading ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                ) : application?.assignedRoom ? (
                  <span className="font-medium text-gray-900 dark:text-white">{application.assignedRoom}</span>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">Pending</span>
                )}
              </div>
            </div>
            
            <div className="relative pt-2 pl-2">
              <div className="absolute left-6 top-6 bottom-4 w-0.5 bg-blue-200 dark:bg-blue-800"></div>
              <div className="space-y-4 relative">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center z-10">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">System Assigned</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Based on gender & criteria</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center z-10">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Warden Approval</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {applicationLoading
                        ? 'Loading...'
                        : isWardenApproved
                          ? 'Approved'
                          : isWardenRejected
                            ? 'Rejected'
                            : 'Waiting for Warden review'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10 border border-gray-200 dark:border-gray-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AR Final Approval</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {applicationLoading
                        ? 'Loading...'
                        : isArFinalized
                          ? 'Finalized'
                          : isWardenApproved
                            ? 'Pending AR approval'
                            : isWardenRejected
                              ? 'Rejected by Warden'
                              : 'Waiting for Warden review'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {applicationError && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">{applicationError}</p>
          )}
          <div className="mt-4 rounded-lg border border-blue-100 dark:border-blue-800/50 bg-white dark:bg-gray-800 p-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Roommates</p>
            {roommatesLoading ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading roommates...</p>
            ) : roommatesError ? (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{roommatesError}</p>
            ) : roommates.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No roommates assigned yet.</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {roommates.map((mate) => (
                  <li key={mate._id} className="text-xs text-gray-700 dark:text-gray-300">
                    {mate.fullName} ({mate.studentId})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h3 className="font-semibold text-red-900 dark:text-red-300">Complaints</h3>
          </div>
          <p className="text-sm text-red-800 dark:text-red-200 mb-1">
            {complaintsLoading
              ? 'Loading complaints...'
              : complaintsError
                ? 'Failed to load complaints'
                : `${studentComplaints.length} Active Complaints`}
          </p>
          {complaintsError && (
            <p className="text-xs text-red-700 dark:text-red-300 mb-1">{complaintsError}</p>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-2 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-3 py-1.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
          >
            Log New Issue
          </button>
        </div>

        <div className="bg-yellow-50/50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">Notices</h3>
          </div>
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-1">
            {noticesLoading
              ? 'Loading notices...'
              : noticesError
                ? 'Failed to load notices'
                : `${unreadCount} Unread Notices`}
          </p>
          {noticesError && (
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">{noticesError}</p>
          )}
          <button 
            onClick={() => {
              setIsNoticesModalOpen(true);
              // Mark all as read when opened
              setNotices(notices.map(n => ({ ...n, isRead: true })));
            }}
            className="mt-2 text-xs font-medium text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1.5 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors"
          >
            View All
          </button>
        </div>

        <div className="bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Coffee className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h3 className="font-semibold text-orange-900 dark:text-orange-300">Canteen</h3>
          </div>
          <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">Order food from the hostel canteen.</p>
          <div className="flex gap-2">
            <Link 
              to="/canteen-menu"
              className="text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 px-3 py-1.5 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors"
            >
              View Menu
            </Link>
            <Link 
              to="/canteen-order"
              className="text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50 px-3 py-1.5 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log New Complaint</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitComplaint} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={complaintForm.subject}
                  onChange={(e) => setComplaintForm({...complaintForm, subject: e.target.value})}
                  placeholder="E.g. Broken fan in Room 204"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select 
                  value={complaintForm.category}
                  onChange={(e) =>
                    setComplaintForm({
                      ...complaintForm,
                      category: e.target.value as ComplaintCategory,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="Maintenance">Maintenance (Electrical/Plumbing)</option>
                  <option value="Cleaning">Cleaning & Hygiene</option>
                  <option value="Furniture">Furniture & Assets</option>
                  <option value="Security">Security & Discipline</option>
                  <option value="Canteen">Canteen & Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                  placeholder="Provide details about the issue..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach Photo (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative">
                  <div className="space-y-1 text-center">
                    {photoPreview ? (
                      <div className="relative">
                        <img src={photoPreview} alt="Preview" className="mx-auto h-32 object-cover rounded-lg" />
                        <button 
                          type="button"
                          onClick={() => {
                            setPhotoPreview(null);
                            setComplaintForm({...complaintForm, photo: null});
                          }}
                          className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full p-1 hover:bg-red-200 dark:hover:bg-red-800/50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notices Modal */}
      {isNoticesModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hostel Notices</h3>
              </div>
              <button 
                onClick={() => setIsNoticesModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {noticesLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading notices...</p>
              ) : noticesError ? (
                <p className="text-center text-red-600 dark:text-red-400 py-8">{noticesError}</p>
              ) : notices.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No notices available.</p>
              ) : (
                notices.map(notice => (
                  <div 
                    key={notice.id} 
                    className={`p-4 rounded-xl border transition-colors ${
                      notice.isRead 
                        ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600' 
                        : 'bg-yellow-50/30 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-semibold ${notice.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-yellow-900 dark:text-yellow-400'}`}>
                        {notice.title}
                        {!notice.isRead && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300">
                            New
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {notice.date}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{notice.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
