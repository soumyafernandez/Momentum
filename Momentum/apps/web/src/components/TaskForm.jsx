import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TaskForm = ({ onSubmit, onCancel, initialTask = null }) => {
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState('Water');
  const [dailyTarget, setDailyTarget] = useState('');
  const [errors, setErrors] = useState({});

  const categories = ['Water', 'Study', 'Gym', 'Finance', 'Custom'];

  useEffect(() => {
    if (initialTask) {
      setTaskName(initialTask.name);
      setCategory(initialTask.category);
      setDailyTarget(initialTask.dailyTarget.toString());
    }
  }, [initialTask]);

  const validate = () => {
    const newErrors = {};
    if (!taskName.trim()) newErrors.taskName = 'Task name is required';
    if (!dailyTarget || dailyTarget <= 0) newErrors.dailyTarget = 'Target must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: taskName,
        category,
        dailyTarget: parseFloat(dailyTarget)
      });
      if (!initialTask) {
        setTaskName('');
        setCategory('Water');
        setDailyTarget('');
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {initialTask ? 'Edit Task' : 'Add New Task'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Task Name
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., Drink water"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          {errors.taskName && (
            <p className="mt-1 text-sm text-red-500">{errors.taskName}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Daily Target */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Daily Target
          </label>
          <input
            type="number"
            value={dailyTarget}
            onChange={(e) => setDailyTarget(e.target.value)}
            placeholder="e.g., 8 (glasses)"
            min="0"
            step="0.1"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          {errors.dailyTarget && (
            <p className="mt-1 text-sm text-red-500">{errors.dailyTarget}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {initialTask ? 'Update Task' : 'Add Task'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default TaskForm;