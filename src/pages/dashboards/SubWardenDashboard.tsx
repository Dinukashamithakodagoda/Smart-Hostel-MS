import React, { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Users, ClipboardCheck, CheckCircle, XCircle, Save, ArrowLeft } from 'lucide-react';

const BLOCKS = [
  { id: 'A', name: 'Block A (Female)' },
  { id: 'B', name: 'Block B (Female)' },
  { id: 'C', name: 'Block C (Male)' },
  { id: 'D', name: 'Block D (Male)' },
  { id: 'E', name: 'Block E (Female)' },
];

const INITIAL_STUDENTS = {
  'A': [
    { id: 1, name: 'Nimali Silva', room: 'A-101', present: true },
    { id: 2, name: 'Sunita Perera', room: 'A-102', present: true },
    { id: 3, name: 'Kamani Fernando', room: 'A-103', present: true },
  ],
  'B': [
    { id: 4, name: 'Ruwani Jayasooriya', room: 'B-101', present: true },
    { id: 5, name: 'Samanthi Silva', room: 'B-102', present: true },
  ],
  'C': [
    { id: 6, name: 'Kamal Perera', room: 'C-101', present: true },
    { id: 7, name: 'Sunil Fernando', room: 'C-102', present: true },
    { id: 8, name: 'Nimal Bandara', room: 'C-103', present: true },
  ],
  'D': [
    { id: 9, name: 'Ruwan Kumara', room: 'D-101', present: true },
    { id: 10, name: 'Nuwan Pradeep', room: 'D-102', present: true },
  ],
  'E': [
    { id: 11, name: 'Kasuni Rathnayake', room: 'E-101', present: true },
    { id: 12, name: 'Dasuni Perera', room: 'E-102', present: true },
  ],
};

export const SubWardenDashboard = () => {
  const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0].id);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [studentsData, setStudentsData] = useState(INITIAL_STUDENTS);

  const currentBlockName = BLOCKS.find(b => b.id === selectedBlock)?.name;
  const currentStudents = studentsData[selectedBlock as keyof typeof studentsData];

  const toggleAttendance = (studentId: number) => {
    setStudentsData(prev => ({
      ...prev,
      [selectedBlock]: prev[selectedBlock as keyof typeof prev].map(student => 
        student.id === studentId ? { ...student, present: !student.present } : student
      )
    }));
  };

  const handleSaveAttendance = () => {
    alert(`Attendance for ${currentBlockName} saved successfully!`);
    setIsMarkingAttendance(false);
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
              {BLOCKS.map(block => (
                <option key={block.id} value={block.id}>{block.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {!isMarkingAttendance ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Daily Attendance - {currentBlockName}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Mark and review student attendance for your assigned block.</p>
            <button 
              onClick={() => setIsMarkingAttendance(true)}
              className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Mark Attendance
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
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">{currentBlockName} - {new Date().toLocaleDateString()}</p>
            </div>
            <button 
              onClick={handleSaveAttendance}
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
                {currentStudents.map((student) => (
                  <tr key={student.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                        onClick={() => toggleAttendance(student.id)}
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
