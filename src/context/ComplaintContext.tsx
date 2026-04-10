import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ComplaintStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Resolved';
export type ComplaintCategory = 'Maintenance' | 'Cleaning' | 'Furniture' | 'Security' | 'Canteen' | 'Other';

export interface Complaint {
  id: string;
  subject: string;
  category: ComplaintCategory;
  description: string;
  photo: string | null;
  status: ComplaintStatus;
  submittedByRole: string;
  submittedByName: string;
  date: string;
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'date'>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 'COMP-001',
      subject: 'Leaking tap in Block A',
      category: 'Maintenance',
      description: 'The tap in the 2nd floor washroom is leaking continuously.',
      photo: null,
      status: 'Pending',
      submittedByRole: 'Student',
      submittedByName: 'Student User',
      date: new Date().toISOString(),
    }
  ]);

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'date'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: `COMP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      status: 'Pending',
      date: new Date().toISOString(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateComplaintStatus }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
