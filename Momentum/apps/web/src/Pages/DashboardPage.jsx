import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Flame, Target } from 'lucide-react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import BadgeSystem from '@/components/BadgeSystem';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [metrics, setMetrics] = useState({
    lifeScore: 0,
    dailyCompletion: 0,
    xpToday: 0,
    streak: 0
  });
  const [badges, setBadges] = useState({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('momentum-tasks');
    const savedHistory = localStorage.getItem('momentum-history');
    const savedBadges = localStorage.getItem('momentum-badges');
    const savedStreak = localStorage.getItem('momentum-streak');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    
    calculateMetrics(
      savedTasks ? JSON.parse(savedTasks) : [],
      savedHistory ? JSON.parse(savedHistory) : {},
      savedStreak ? parseInt(savedStreak) : 0
    );
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('momentum-tasks', JSON.stringify(tasks));
      updateHistory();
    }
  }, [tasks]);

  const calculateMetrics = (currentTasks, history, streak) => {
    const completedCount = currentTasks.filter(t => t.completed).length;
    const totalCount = currentTasks.length;
    const dailyCompletion = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    // Calculate XP (10 XP per completed task)
    const xpToday = completedCount * 10;

    // Calculate Life Score (average of all historical completion percentages)
    const historyValues = Object.values(history);
    const lifeScore = historyValues.length > 0
      ? historyValues.reduce((sum, day) => sum + day.completionPercentage, 0) / historyValues.length
      : dailyCompletion;

    setMetrics({
      lifeScore: Math.round(lifeScore),
      dailyCompletion: Math.round(dailyCompletion),
      xpToday,
      streak
    });
  };

  const updateHistory = () => {
    const today = new Date().toISOString().split('T')[0];
    const history = JSON.parse(localStorage.getItem('momentum-history') || '{}');
    
    const completedTasks = tasks.filter(t => t.completed);
    const completionPercentage = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    
    history[today] = {
      completionPercentage,
      xpEarned: completedTasks.length * 10,
      tasks: completedTasks.map(t => t.name)
    };

    localStorage.setItem('momentum-history', JSON.stringify(history));
    
    // Update streak
    updateStreak(history);
    
    // Recalculate metrics
    const streak = parseInt(localStorage.getItem('momentum-streak') || '0');
    calculateMetrics(tasks, history, streak);
  };

  const updateStreak = (history) => {
    const dates = Object.keys(history).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const dayData = history[date];
      
      if (dayData.completionPercentage === 100) {
        streak++;
      } else if (date !== today) {
        break;
      }
    }
    
    localStorage.setItem('momentum-streak', streak.toString());
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskData) => {
    setTasks(tasks.map(t => 
      t.id === editingTask.id 
        ? { ...t, ...taskData }
        : t
    ));
    setEditingTask(null);
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId 
        ? { ...t, completed: !t.completed }
        : t
    ));
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const getMotivationalMessage = () => {
    if (metrics.lifeScore >= 80) {
      return "🔥 You're crushing it! Keep up the amazing work!";
    }
    if (metrics.lifeScore >= 60) {
      return "💪 Great progress! You're building solid momentum!";
    }
    if (metrics.lifeScore >= 40) {
      return "🌟 You're on the right track! Keep pushing forward!";
    }
    return "🚀 Every journey starts with a single step. You've got this!";
  };

  const stats = {
    streak: metrics.streak,
    totalXP: parseInt(localStorage.getItem('momentum-total-xp') || '0'),
    perfectDays: Object.values(JSON.parse(localStorage.getItem('momentum-history') || '{}')).filter(d => d.completionPercentage === 100).length,
    highScoreWeek: false // Would need more complex calculation
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Momentum</title>
        <meta name="description" content="Track your daily tasks and build momentum towards your goals" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Life Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium opacity-90">Life Score</h3>
                <Target className="w-5 h-5 opacity-80" />
              </div>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-5xl font-bold mb-2"
                >
                  {metrics.lifeScore}%
                </motion.div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.lifeScore}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-white rounded-full h-2"
                  />
                </div>
              </div>
            </motion.div>

            {/* Daily Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Progress</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-gray-900 dark:text-white"
              >
                {metrics.dailyCompletion}%
              </motion.div>
            </motion.div>

            {/* XP Today */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">XP Earned Today</h3>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-gray-900 dark:text-white"
              >
                {metrics.xpToday}
              </motion.div>
            </motion.div>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</h3>
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-bold text-gray-900 dark:text-white"
              >
                {metrics.streak} days
              </motion.div>
            </motion.div>
          </div>

          {/* Motivational Message */}
          {metrics.lifeScore >= 80 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 mb-8 text-center font-medium shadow-lg"
            >
              {getMotivationalMessage()}
            </motion.div>
          )}

          {/* Badges */}
          <div className="mb-8">
            <BadgeSystem badges={badges} stats={stats} />
          </div>

          {/* Task Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TaskForm
                onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                onCancel={editingTask ? () => setEditingTask(null) : null}
                initialTask={editingTask}
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Tasks
              </h2>
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;