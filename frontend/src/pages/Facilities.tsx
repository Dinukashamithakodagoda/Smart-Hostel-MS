import React from 'react';
import { Wifi, Utensils, BookOpen, WashingMachine, MonitorPlay, Dumbbell, Coffee } from 'lucide-react';

const facilities = [
  {
    title: 'High-Speed Wi-Fi',
    description: '24/7 unlimited internet access across all blocks and common areas for uninterrupted studying.',
    icon: Wifi,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Cafeteria & Mess',
    description: 'Hygienic and nutritious meals served three times a day, with options for special dietary requirements.',
    icon: Utensils,
    color: 'text-orange-600',
    bg: 'bg-orange-50'
  },
  {
    title: 'Study Rooms',
    description: 'Quiet, air-conditioned study halls equipped with comfortable seating and charging ports.',
    icon: BookOpen,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    title: 'Laundry Services',
    description: 'On-site automated washing machines and drying areas available for all residents.',
    icon: WashingMachine,
    color: 'text-teal-600',
    bg: 'bg-teal-50'
  },
  {
    title: 'Recreation Room',
    description: 'Indoor games including table tennis, carrom, chess, and a TV lounge for relaxation.',
    icon: MonitorPlay,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    title: 'Gymnasium',
    description: 'Well-equipped fitness center available for students to maintain their physical health.',
    icon: Dumbbell,
    color: 'text-red-600',
    bg: 'bg-red-50'
  },
  {
    title: 'Canteen Management',
    description: 'Order food online, track your orders, and manage your canteen expenses directly from the dashboard.',
    icon: Coffee,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  }
];

export const Facilities = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Hostel Facilities</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide state-of-the-art amenities to ensure our students have a comfortable, productive, and enjoyable stay on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${facility.bg} dark:bg-opacity-20 ${facility.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{facility.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{facility.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
