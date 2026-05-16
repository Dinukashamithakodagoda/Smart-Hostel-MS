import React, { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { NoticeComposer } from '../../components/NoticeComposer';
import { NoticeManager } from '../../components/NoticeManager';
import { Users, ClipboardCheck, CheckCircle, XCircle, Save, ArrowLeft, Search, ChevronRight } from 'lucide-react';

interface Block {
  id: string;
  name: string;
}

interface AttendanceEntry {
  studentId: string;
  name: string;
  room: string;
  present: boolean;
}

export const SubWardenDashboard = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState('');
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Student Search State
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [isViewingStudentDetails, setIsViewingStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const currentBlockName = blocks.find(b => b.id === selectedBlock)?.name;
  const currentStudents = entries;

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/attendance/blocks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load blocks');
      }

      const data = await response.json();
      const newBlocks = data.blocks || [];
      setBlocks(newBlocks);
      if (newBlocks.length > 0 && !selectedBlock) {
        setSelectedBlock(newBlocks[0].id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load blocks';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRosterAndAttendance = async (blockId: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');

      const rosterResponse = await fetch(`${apiBaseUrl}/api/attendance/blocks/${blockId}/roster`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!rosterResponse.ok) {
        const data = await rosterResponse.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load roster');
      }

      const rosterData = await rosterResponse.json();
      const roster = rosterData.roster || [];

      const recordResponse = await fetch(`${apiBaseUrl}/api/attendance/records?block=${blockId}&date=${today}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!recordResponse.ok) {
        const data = await recordResponse.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load attendance');
      }

      const recordData = await recordResponse.json();
      const existing = recordData.record?.entries || [];

      const merged = roster.map((student: any) => {
        const match = existing.find((entry: any) => entry.studentId === student.id);
        return {
          studentId: student.id,
          name: student.name,
          room: student.room,
          present: match ? match.present : true,
        };
      });

      setEntries(merged);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load roster';
      setError(message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  useEffect(() => {
    if (selectedBlock) {
      fetchRosterAndAttendance(selectedBlock);
    }
  }, [selectedBlock]);

  const toggleAttendance = (studentId: string) => {
    setEntries((prev) => prev.map(student => 
      student.studentId === studentId ? { ...student, present: !student.present } : student
    ));
  };

  const handleSaveAttendance = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/attendance/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          block: selectedBlock,
          date: today,
          entries,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to save attendance');
      }

      alert(`Attendance for ${currentBlockName} saved successfully!`);
      setIsMarkingAttendance(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save attendance';
      alert(message);
    }
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

  return (
    <DashboardLayout allowedRole="Sub-Warden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sub-Warden Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Daily student management.</p>
          </div>
        </div>

        {!isMarkingAttendance && (
          <div className="flex items-center gap-2">
            <label htmlFor="block-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Block:
            </label>
            <select
              id="block-select"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
            >
              {blocks.map(block => (
                <option key={block.id} value={block.id}>{block.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      <div className="mb-6 space-y-6">
        <NoticeComposer />
        <NoticeManager />
        
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Search Students</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Find students by name, ID, or email.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={studentSearchQuery}
              onChange={(e) => {
                const query = e.target.value;
                setStudentSearchQuery(query);
                if (query.length > 0) {
                  searchStudent(query);
                } else {
                  setStudents([]);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
            {studentSearchQuery && (
              <div className="max-h-64 border border-gray-200 dark:border-gray-700 rounded-lg overflow-y-auto">
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
        </div>
      </div>

      {!isMarkingAttendance ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Daily Attendance - {currentBlockName}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Mark and review student attendance for your assigned block.</p>
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 mb-2">{error}</p>
            )}
            <button 
              onClick={() => setIsMarkingAttendance(true)}
              disabled={loading || !selectedBlock}
              className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {loading ? 'Loading...' : 'Mark Attendance'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button 
                  onClick={() => setIsMarkingAttendance(false)}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  title="Go Back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h3 className="font-semibold text-gray-900 dark:text-white">Marking Attendance</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">{currentBlockName} - {today}</p>
            </div>
            <button 
              onClick={handleSaveAttendance}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Attendance
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                      Loading roster...
                    </td>
                  </tr>
                ) : currentStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                      No students assigned.
                    </td>
                  </tr>
                ) : currentStudents.map((student) => (
                  <tr key={student.studentId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student.room}</td>
                    <td className="px-6 py-4">{student.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.present 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {student.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleAttendance(student.studentId)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          student.present
                            ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40'
                            : 'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40'
                        }`}
                      >
                        {student.present ? (
                          <><XCircle className="w-4 h-4" /> Mark Absent</>
                        ) : (
                          <><CheckCircle className="w-4 h-4" /> Mark Present</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
