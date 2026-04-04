import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">SmartHostel</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              An integrated smart hostel management system designed to streamline operations, 
              enhance student living experience, and provide efficient administrative control.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/rules" className="hover:text-indigo-400 transition-colors">Hostel Rules</Link></li>
              <li><Link to="/facilities" className="hover:text-indigo-400 transition-colors">Facilities</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>University Campus, Main Road, City, 10000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>hostel@university.edu</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartHostel Management System. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
