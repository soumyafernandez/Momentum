import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Edit2, Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Water: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      Study: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      Gym: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      Finance: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      Custom: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return colors[category] || colors.Custom;
  };

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
      >
        <Target className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add your first task to start tracking your momentum!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border transition-all ${
              task.completed
                ? 'border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10'
                : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Completion Toggle */}
              <motion.button
                onClick={() => onToggleComplete(task.id)}
                className="mt-1 flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" />
                )}
              </motion.button>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                </div>
                <h4 className={`font-semibold mb-1 ${
                  task.completed
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Target: {task.dailyTarget} {task.category === 'Water' ? 'glasses' : 'units'} per day
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  onClick={() => onEdit(task)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDelete(task.id)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;