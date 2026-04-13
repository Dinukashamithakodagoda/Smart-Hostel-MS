import React from 'react';

const faqs = [
  {
    question: "How do I apply for hostel accommodation?",
    answer: "You can apply by clicking the 'Register' button on the home page. Fill out the application form with your details, including your distance from campus. Allocations are made based on availability and university criteria."
  },
  {
    question: "How do I log a maintenance complaint?",
    answer: "Log in to your Student Dashboard, click on 'Log New Issue' under the Complaints section. Fill in the details, select the category (e.g., Maintenance, Cleaning), and you can even attach a photo of the issue."
  },
  {
    question: "Can I change my allocated room?",
    answer: "Room changes are generally not permitted during the semester. However, in exceptional circumstances, you may submit a written request to the Warden through the Sub-Warden of your block."
  },
  {
    question: "What should I do if I lose my room key?",
    answer: "Report the loss immediately to your Sub-Warden or the Marshal. A replacement key will be issued, and a standard replacement fee will be charged to your account."
  },
  {
    question: "How do I pay my hostel fees?",
    answer: "Hostel fees can be paid online through the university payment portal or at the designated bank branches. Ensure you keep the payment receipt and upload it if required by the AR."
  },
  {
    question: "Are there any medical facilities available?",
    answer: "Yes, the university medical center is available 24/7 for emergencies. For minor issues, first aid kits are available with the Sub-Warden of each block."
  }
];

export const FAQ = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Find answers to common questions about hostel life and the management system.</p>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-100 dark:border-indigo-800 text-center">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Still have questions?</h4>
          <p className="text-indigo-700 dark:text-indigo-400 text-sm">Contact the hostel administration office at <a href="mailto:hostel@university.edu" className="underline font-medium">hostel@university.edu</a></p>
        </div>
      </div>
    </div>
  );
};
