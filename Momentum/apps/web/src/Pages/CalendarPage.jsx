import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import CalendarHeatmap from '@/components/CalendarHeatmap';

const CalendarPage = () => {
  const [history, setHistory] = useState({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('momentum-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Calendar - Momentum</title>
        <meta name="description" content="View your productivity calendar and track your progress over time" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
          >
            Productivity Calendar
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CalendarHeatmap history={history} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Use the Calendar
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span>Each square represents a day. Darker colors indicate higher completion rates.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span>Click on any day to see detailed statistics for that date.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span>Use the navigation arrows to view different months.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                <span>Build streaks by completing all your tasks every day!</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;