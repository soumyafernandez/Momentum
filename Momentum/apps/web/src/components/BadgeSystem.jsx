import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Trophy, Star, Zap, Target } from 'lucide-react';

const BadgeSystem = ({ badges, stats }) => {
  const badgeDefinitions = [
    {
      id: 'perfectWeek',
      name: 'Perfect Week',
      description: 'Complete all tasks for 7 days straight',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      condition: () => stats.streak >= 7
    },
    {
      id: 'centuryClub',
      name: 'Century Club',
      description: 'Earn 100 XP in total',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-500',
      condition: () => stats.totalXP >= 100
    },
    {
      id: 'consistent',
      name: 'Consistency King',
      description: 'Complete tasks 30 days in a row',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      condition: () => stats.streak >= 30
    },
    {
      id: 'overachiever',
      name: 'Overachiever',
      description: 'Reach 100% completion 10 times',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      condition: () => stats.perfectDays >= 10
    },
    {
      id: 'momentum',
      name: 'Momentum Master',
      description: 'Maintain 80%+ Life Score for a week',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      condition: () => stats.highScoreWeek
    },
    {
      id: 'legendary',
      name: 'Legendary',
      description: 'Earn 1000 XP in total',
      icon: Award,
      color: 'from-violet-500 to-fuchsia-500',
      condition: () => stats.totalXP >= 1000
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Achievements
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badgeDefinitions.map((badge) => {
          const isEarned = badges[badge.id]?.earned || badge.condition();
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: isEarned ? 1.05 : 1 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isEarned
                  ? 'border-transparent bg-gradient-to-br ' + badge.color
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-50'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-full mb-3 ${
                  isEarned ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-800'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isEarned ? 'text-white' : 'text-gray-400 dark:text-gray-600'
                  }`} />
                </div>
                <h4 className={`font-semibold text-sm mb-1 ${
                  isEarned ? 'text-white' : 'text-gray-700 dark:text-gray-400'
                }`}>
                  {badge.name}
                </h4>
                <p className={`text-xs ${
                  isEarned ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {badge.description}
                </p>
                {isEarned && badges[badge.id]?.date && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1"
                  >
                    <Star className="w-4 h-4 text-yellow-900 fill-yellow-900" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeSystem;