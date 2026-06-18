/**
 * Complaint Context
 * Manages complaint state including submission and status tracking
 * Provides complaint operations throughout the application
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Complaint status types
 */
export type ComplaintStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Resolved';

/**
 * Complaint category types
 */
export type ComplaintCategory = 'Maintenance' | 'Cleaning' | 'Furniture' | 'Security' | 'Canteen' | 'Other';

/**
 * Complaint data structure
 */
export interface Complaint {
  id: string;                  // Unique complaint identifier
  subject: string;             // Complaint subject/title
  category: ComplaintCategory; // Category of complaint
  description: string;         // Detailed description
  photo: string | null;        // Photo URL (if available)
  status: ComplaintStatus;     // Current status
  submittedByRole: string;     // Role of person who submitted
  submittedByName: string;     // Name of person who submitted
  date: string;                // Submission date
}

/**
 * Complaint context type definition
 */
interface ComplaintContextType {
  complaints: Complaint[];                                           // List of all complaints
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'date'>) => void;  // Add new complaint
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;           // Update complaint status
}

// Create the Complaint context
const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

/**
 * ComplaintProvider Component
 * Provides complaint management to the application
 * Initializes with sample complaint data
 */
export const ComplaintProvider = ({ children }: { children: ReactNode }) => {
  // Initialize complaints state with sample data
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

  /**
   * Add a new complaint
   * Generates ID and timestamp automatically
   * Sets status to Pending by default
   * @param complaintData - Complaint data without ID, status, and date
   */
  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'date'>) => {
    // Generate new complaint with ID and timestamp
    const newComplaint: Complaint = {
      ...complaintData,
      // Generate unique ID
      id: `COMP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      // Set initial status to Pending
      status: 'Pending',
      // Set current date as submission date
      date: new Date().toISOString(),
    };
    // Add new complaint to the beginning of the list
    setComplaints(prev => [newComplaint, ...prev]);
  };

  /**
   * Update the status of a complaint
   * @param id - Complaint ID to update
   * @param status - New status value
   */
  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateComplaintStatus }}>
      {children}
    </ComplaintContext.Provider>
  );
};

/**
 * Hook to use complaint context
 * Must be used within ComplaintProvider
 * @returns Complaint context with complaints list and operations
 * @throws Error if used outside ComplaintProvider
 */
export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
