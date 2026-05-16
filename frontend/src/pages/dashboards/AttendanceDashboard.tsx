import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Calendar, CheckCircle, XCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  block: string;
  present: boolean;
  name: string;
  room: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: string;
}

export const AttendanceDashboard = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().substring(0, 7));

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${apiBaseUrl}/api/attendance/my-attendance`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Failed to load attendance');
        }

        const data = await response.json();
        setAttendance(data.attendance || []);
        setStats(data.statistics || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load attendance';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const filteredRecords = attendance.filter((record) => {
    const recordMonth = record.date.substring(0, 7);
    return recordMonth === filterMonth;
  });

  const getDateFormatted = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const attendanceColor =
    stats && parseFloat(stats.percentage) >= 75
      ? 'text-green-600 dark:text-green-400'
      : stats && parseFloat(stats.percentage) >= 60
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400';

  const attendanceBgColor =
    stats && parseFloat(stats.percentage) >= 75
      ? 'bg-green-50 dark:bg-green-900/20'
      : stats && parseFloat(stats.percentage) >= 60
      ? 'bg-yellow-50 dark:bg-yellow-900/20'
      : 'bg-red-50 dark:bg-red-900/20';

  return (
    <DashboardLayout allowedRole="Student">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Track your hostel attendance records.</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Records */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </div>

          {/* Present */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Present</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </div>

          {/* Absent */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Absent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </div>

          {/* Attendance Percentage */}
          <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${attendanceBgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Percentage</p>
                <p className={`text-2xl font-bold mt-1 ${attendanceColor}`}>{stats.percentage}%</p>
              </div>
              <TrendingUp className={`h-8 w-8 opacity-20 ${attendanceColor}`} />
            </div>
          </div>
        </div>
      )}

      {/* Alert for Low Attendance */}
      {stats && parseFloat(stats.percentage) < 75 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">Attendance Below 75%</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your attendance is currently {stats.percentage}%. Please ensure regular hostel check-ins to maintain minimum attendance requirements.
            </p>
          </div>
        </div>
      )}

      {/* Month Filter */}
      <div className="mb-6">
        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Month:
        </label>
        <input
          id="month-filter"
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Attendance Records Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {filterMonth.substring(0, 4)} - {filterMonth.substring(5)} Records
          </h3>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>Loading attendance records...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
              <p>{error}</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>No attendance records for this month.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Block</th>
                  <th className="px-6 py-3">Room</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr
                    key={index}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {getDateFormatted(record.date)}
                    </td>
                    <td className="px-6 py-4">{record.block}</td>
                    <td className="px-6 py-4">{record.room}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          record.present
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {record.present ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" /> Present
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5" /> Absent
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
