import React from 'react';

export const About = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">About Us</h1>
        
        <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            Welcome to the <strong className="dark:text-white">Smart Hostel Management System</strong>, a comprehensive digital solution designed to streamline and enhance the residential experience for university students and administrators alike.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to provide a safe, comfortable, and well-managed living environment for students. By digitizing traditional hostel operations, we aim to eliminate paperwork, reduce response times for maintenance and complaints, and foster a transparent communication channel between students and the hostel administration.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">What We Do</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="dark:text-white">Automated Room Allocation:</strong> Fair and transparent distribution of rooms based on faculty, year, and distance from campus.</li>
            <li><strong className="dark:text-white">Digital Complaint Logging:</strong> A fast-track system for students to report maintenance, cleaning, or security issues directly to the responsible supervisors.</li>
            <li><strong className="dark:text-white">Real-time Notifications:</strong> Keeping everyone in the loop with instant alerts for fees, events, and emergency announcements.</li>
            <li><strong className="dark:text-white">Role-based Dashboards:</strong> Empowering Wardens, Sub-Wardens, ARs, Marshals, and Supervisors with the exact tools they need to perform their duties efficiently.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Our Vision</h2>
          <p>
            To be the standard for campus accommodation management, ensuring that students can focus entirely on their academic journey while we take care of their living needs.
          </p>
        </div>
      </div>
    </div>
  );
};
