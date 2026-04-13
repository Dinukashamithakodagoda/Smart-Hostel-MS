import React from 'react';
import { AlertTriangle, Clock, Shield, Users } from 'lucide-react';

export const Rules = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Hostel Rules & Regulations</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Please read and adhere to the following guidelines to ensure a safe and harmonious living environment.</p>
        
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Curfew & Timings</h2>
            </div>
            <ul className="list-disc pl-14 space-y-2 text-gray-600 dark:text-gray-300">
              <li>The hostel gates will be closed strictly at <strong>10:00 PM</strong>.</li>
              <li>Students arriving late must sign the late register and provide a valid reason to the Sub-Warden.</li>
              <li>Silence hours are to be observed from 11:00 PM to 6:00 AM.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Visitors & Guests</h2>
            </div>
            <ul className="list-disc pl-14 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Visitors are only allowed in the designated visitor lounge between 4:00 PM and 7:00 PM.</li>
              <li>No unauthorized persons or day-scholars are permitted inside the residential blocks.</li>
              <li>Overnight stay of guests is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Prohibited Activities</h2>
            </div>
            <ul className="list-disc pl-14 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Use of high-wattage electrical appliances (heaters, hot plates) in rooms is forbidden to prevent fire hazards.</li>
              <li>Consumption, possession, or distribution of alcohol, drugs, or tobacco products is strictly banned.</li>
              <li>Ragging in any form is a criminal offense and will result in immediate expulsion and legal action.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Maintenance & Cleanliness</h2>
            </div>
            <ul className="list-disc pl-14 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Students are responsible for the furniture and fixtures allocated to them.</li>
              <li>Any damages to hostel property will be charged to the respective student(s).</li>
              <li>Rooms and common areas must be kept clean. Garbage should be disposed of in the provided bins.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
