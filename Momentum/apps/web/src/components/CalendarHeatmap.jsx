import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalendarHeatmap = ({ history }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getIntensityColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (percentage < 25) return 'bg-violet-200 dark:bg-violet-900/40';
    if (percentage < 50) return 'bg-violet-300 dark:bg-violet-800/60';
    if (percentage < 75) return 'bg-violet-400 dark:bg-violet-700/80';
    if (percentage < 100) return 'bg-violet-500 dark:bg-violet-600';
    return 'bg-gradient-to-br from-violet-600 to-fuchsia-600';
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayData = (date) => {
    if (!date) return null;
    const dateStr = formatDate(date);
    return history[dateStr] || { completionPercentage: 0, xpEarned: 0, tasks: [] };
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => navigateMonth(-1)}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => navigateMonth(1)}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} />;
            }

            const dayData = getDayData(date);
            const isToday = formatDate(date) === formatDate(new Date());

            return (
              <motion.button
                key={formatDate(date)}
                onClick={() => setSelectedDay({ date, data: dayData })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-lg transition-all relative ${
                  getIntensityColor(dayData.completionPercentage)
                } ${isToday ? 'ring-2 ring-violet-600 dark:ring-violet-400' : ''}`}
              >
                <span className={`text-xs font-medium ${
                  dayData.completionPercentage > 50
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {date.getDate()}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
          <div className="w-4 h-4 rounded bg-violet-200 dark:bg-violet-900/40" />
          <div className="w-4 h-4 rounded bg-violet-300 dark:bg-violet-800/60" />
          <div className="w-4 h-4 rounded bg-violet-400 dark:bg-violet-700/80" />
          <div className="w-4 h-4 rounded bg-violet-500 dark:bg-violet-600" />
        </div>
        <span>More</span>
      </div>

      {/* Day Detail Popup */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedDay.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completion</span>
                  <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                    {selectedDay.data.completionPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">XP Earned</span>
                  <span className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">
                    {selectedDay.data.xpEarned}
                  </span>
                </div>
                {selectedDay.data.tasks && selectedDay.data.tasks.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Completed Tasks:
                    </p>
                    <ul className="space-y-1">
                      {selectedDay.data.tasks.map((task, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarHeatmap;