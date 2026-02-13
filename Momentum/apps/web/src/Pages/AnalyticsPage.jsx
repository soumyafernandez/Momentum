import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Calendar, Zap } from 'lucide-react';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    dailyTrend: [],
    categoryPerformance: [],
    consistencyScore: 0,
    mostProductiveDay: '',
    totalXP: 0,
    insights: []
  });

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const calculateAnalytics = () => {
    const history = JSON.parse(localStorage.getItem('momentum-history') || '{}');
    const tasks = JSON.parse(localStorage.getItem('momentum-tasks') || '[]');

    // Daily trend data (last 30 days)
    const dailyTrend = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = history[dateStr] || { completionPercentage: 0 };
      
      dailyTrend.push({
        date: date.getDate(),
        completion: Math.round(dayData.completionPercentage)
      });
    }

    // Category performance
    const categoryStats = {};
    Object.values(history).forEach(day => {
      if (day.tasks) {
        day.tasks.forEach(taskName => {
          const task = tasks.find(t => t.name === taskName);
          if (task) {
            if (!categoryStats[task.category]) {
              categoryStats[task.category] = { completed: 0, total: 0 };
            }
            categoryStats[task.category].completed++;
          }
        });
      }
    });

    tasks.forEach(task => {
      if (!categoryStats[task.category]) {
        categoryStats[task.category] = { completed: 0, total: 0 };
      }
      categoryStats[task.category].total++;
    });

    const categoryPerformance = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));

    // Consistency score (days with 100% completion)
    const perfectDays = Object.values(history).filter(
      day => day.completionPercentage === 100
    ).length;

    // Most productive day
    let maxCompletion = 0;
    let mostProductiveDay = 'N/A';
    Object.entries(history).forEach(([date, data]) => {
      if (data.completionPercentage > maxCompletion) {
        maxCompletion = data.completionPercentage;
        mostProductiveDay = new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    });

    // Total XP
    const totalXP = Object.values(history).reduce((sum, day) => sum + (day.xpEarned || 0), 0);

    // Generate insights
    const insights = [];
    const avgCompletion = dailyTrend.reduce((sum, d) => sum + d.completion, 0) / dailyTrend.length;
    
    if (avgCompletion >= 80) {
      insights.push("Exceptional consistency! You're maintaining high performance.");
    } else if (avgCompletion >= 60) {
      insights.push("Good progress! Try to maintain this momentum.");
    } else {
      insights.push("There's room for improvement. Focus on completing more tasks daily.");
    }

    if (perfectDays >= 7) {
      insights.push(`You've achieved ${perfectDays} perfect days! Outstanding dedication.`);
    }

    const bestCategory = categoryPerformance.reduce((best, cat) => 
      cat.percentage > (best?.percentage || 0) ? cat : best
    , null);
    
    if (bestCategory) {
      insights.push(`Your strongest category is ${bestCategory.category} at ${bestCategory.percentage}% completion.`);
    }

    setAnalytics({
      dailyTrend,
      categoryPerformance,
      consistencyScore: perfectDays,
      mostProductiveDay,
      totalXP,
      insights
    });
  };

  return (
    <>
      <Helmet>
        <title>Analytics - Momentum</title>
        <meta name="description" content="Analyze your productivity trends and performance metrics" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
          >
            Analytics Dashboard
          </motion.h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Consistency Score</h3>
                <Award className="w-5 h-5 text-violet-500" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {analytics.consistencyScore}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Perfect days</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Productive Day</h3>
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {analytics.mostProductiveDay}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Highest completion</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total XP Earned</h3>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {analytics.totalXP}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">All time</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Daily Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daily Completion Trend (Last 30 Days)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Performance Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance by Category
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="category" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="#8B5CF6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-violet-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Insights
              </h3>
            </div>
            <div className="space-y-3">
              {analytics.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-violet-500 mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;