import React, { useState, useRef } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { ShieldCheck, AlertOctagon, ArrowLeft, Camera, Upload, X, Search, DoorOpen, Users, FileText } from 'lucide-react';
import { useComplaints, ComplaintCategory } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';

interface Incident {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  photoUrl?: string;
}

interface StudentRoom {
  id: string;
  name: string;
  regNo: string;
  block: string;
  room: string;
}

export const MarshalDashboard = () => {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const [isLoggingIncident, setIsLoggingIncident] = useState(false);
  const [isLoggingComplaint, setIsLoggingComplaint] = useState(false);
  const [isViewingRooms, setIsViewingRooms] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
  });
  
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    category: 'Canteen' as ComplaintCategory,
    description: '',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [studentRooms] = useState<StudentRoom[]>([
    { id: '1', name: 'John Doe', regNo: 'REG/2023/001', block: 'Block A', room: 'A-101' },
    { id: '2', name: 'Jane Smith', regNo: 'REG/2023/002', block: 'Block B', room: 'B-205' },
    { id: '3', name: 'Mike Johnson', regNo: 'REG/2023/003', block: 'Block C', room: 'C-302' },
    { id: '4', name: 'Sarah Williams', regNo: 'REG/2023/004', block: 'Block A', room: 'A-105' },
    { id: '5', name: 'David Brown', regNo: 'REG/2023/005', block: 'Block D', room: 'D-401' },
  ]);

  const filteredRooms = studentRooms.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: Incident = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: new Date().toLocaleDateString(),
      photoUrl: photoPreview || undefined,
    };
    
    setIncidents([newIncident, ...incidents]);
    setIsLoggingIncident(false);
    setFormData({ title: '', description: '', location: '' });
    removePhoto();
    alert('Incident logged successfully!');
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addComplaint({
      subject: complaintForm.subject,
      category: complaintForm.category,
      description: complaintForm.description,
      photo: photoPreview,
      submittedByRole: user?.role || 'Marshal',
      submittedByName: user?.name || 'Marshal User',
    });
    
    setIsLoggingComplaint(false);
    setComplaintForm({ subject: '', category: 'Canteen', description: '' });
    removePhoto();
    alert('Complaint logged successfully!');
  };

  if (isViewingRooms) {
    return (
      <DashboardLayout allowedRole="Marshal">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setIsViewingRooms(false)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Room Directory</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Search and view student room assignments.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name, registration number, block, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-slate-500 focus:border-slate-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Student Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Registration No</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Block</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Room No</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRooms.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 text-sm text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      {student.name}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{student.regNo}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{student.block}</td>
                    <td className="p-4 text-sm text-gray-900 dark:text-white font-medium flex items-center gap-2">
                      <DoorOpen className="h-4 w-4 text-slate-500" />
                      {student.room}
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoggingIncident) {
    return (
      <DashboardLayout allowedRole="Marshal">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setIsLoggingIncident(false)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Log New Incident</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Record details of a security breach or disciplinary issue.</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Incident Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-slate-500 focus:border-slate-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Unauthorized Entry"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input 
                type="text" 
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-slate-500 focus:border-slate-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Block B Main Gate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-slate-500 focus:border-slate-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Provide detailed description of the incident..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo Evidence (Optional)</label>
              
              {photoPreview ? (
                <div className="relative inline-block">
                  <img src={photoPreview} alt="Preview" className="h-48 w-auto rounded-lg border border-gray-200 dark:border-gray-700 object-cover" />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload a photo</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsLoggingIncident(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-700 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRole="Marshal">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 rounded-xl">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marshal Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Security and discipline management.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Incident Reports</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Log and review disciplinary incidents or security breaches.</p>
          <button 
            onClick={() => setIsLoggingIncident(true)}
            className="text-sm font-medium text-white bg-slate-800 dark:bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
          >
            Log Incident
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <DoorOpen className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Room Directory</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Search and view student room assignments and details.</p>
          <button 
            onClick={() => setIsViewingRooms(true)}
            className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            View Directory
          </button>
        </div>
      </div>

      {incidents.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Incidents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex gap-4">
                {incident.photoUrl && (
                  <img src={incident.photoUrl} alt="Incident" className="w-24 h-24 object-cover rounded-lg border border-gray-100 dark:border-gray-700" />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{incident.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{incident.date}</span>
                  </div>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">{incident.location}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{incident.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
