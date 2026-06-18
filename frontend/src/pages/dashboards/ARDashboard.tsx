import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { NoticeComposer } from '../../components/NoticeComposer';
import { NoticeManager } from '../../components/NoticeManager';
import { ClipboardList, FileSpreadsheet, CheckCircle, Download, Search, ChevronRight, ArrowLeft } from 'lucide-react';

export const ARDashboard = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [allocations, setAllocations] = useState<any[]>([]);
  const [allocationsLoading, setAllocationsLoading] = useState(true);
  const [allocationsError, setAllocationsError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Student Search State
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [isViewingStudentDetails, setIsViewingStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

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

  const searchStudent = async (query: string) => {
    if (!query.trim()) {
      setStudents([]);
      setStudentSearchQuery('');
      return;
    }

    try {
      setStudentsLoading(true);
      setStudentsError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/applications/search/students?search=${encodeURIComponent(query)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to search students');
      }

      const data = await response.json();
      setStudents(data.students || []);
      setStudentSearchQuery(query);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search students';
      setStudentsError(message);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStudentSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchStudent(studentSearchQuery);
  };

  const handleClearStudentSearch = () => {
    setStudentSearchQuery('');
    setStudents([]);
    setStudentsError(null);
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

  if (isViewingStudentDetails && selectedStudent) {
    return (
      <DashboardLayout allowedRole="AR">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => {
              setIsViewingStudentDetails(false);
              setSelectedStudent(null);
            }}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Details</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">View comprehensive student information and allocation.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                {selectedStudent.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedStudent.fullName}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{selectedStudent.studentId}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{selectedStudent.email}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {selectedStudent.status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Student ID</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1 font-mono">{selectedStudent.studentId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">ID Card Number</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1 font-mono">{selectedStudent.idCardNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">{selectedStudent.gender || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1 break-all">{selectedStudent.email}</dd>
              </div>
            </dl>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">{selectedStudent.contactNumber || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Faculty</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">{selectedStudent.faculty || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Year</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1">{selectedStudent.yearOfStudy || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Room Allocation */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Allocation</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Block</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1 font-medium">{selectedStudent.assignedBlock || 'Not Assigned'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Room</dt>
                <dd className="text-sm text-gray-900 dark:text-white mt-1 font-medium text-emerald-600 dark:text-emerald-400">{selectedStudent.assignedRoom || 'Not Assigned'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-col lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Search Students</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Find a student by name, student ID, or email and open their allocation details.</p>
          </div>
        </div>

        <form onSubmit={handleStudentSearchSubmit} className="mt-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, student ID, or email..."
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              type="button"
              onClick={handleClearStudentSearch}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </form>

        {studentSearchQuery && (
          <div className="mt-5 max-h-64 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto">
            {studentsLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Searching students...
              </div>
            ) : studentsError ? (
              <div className="p-4 text-center text-red-600 dark:text-red-400">
                {studentsError}
              </div>
            ) : students.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No students found.
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => (
                  <button
                    key={student._id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsViewingStudentDetails(true);
                    }}
                    className="w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {student.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{student.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.studentId} • {student.idCardNumber}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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
