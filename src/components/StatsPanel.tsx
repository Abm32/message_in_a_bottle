import React from 'react';
import { UserStats, StreakData, Achievement } from '../types/Gamification';
import { Trophy, Flame, Calendar, Clock, Target, Star } from 'lucide-react';

interface StatsPanelProps {
  stats: UserStats;
  streakData: StreakData;
  achievements: Achievement[];
  streakMessage: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  streakData,
  achievements,
  streakMessage
}) => {
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) acc[achievement.category] = [];
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const categoryIcons = {
    milestone: '🎯',
    streak: '🔥',
    creativity: '🎨',
    patience: '🧘',
    dedication: '💪'
  };

  const categoryNames = {
    milestone: 'Milestones',
    streak: 'Streaks',
    creativity: 'Creativity',
    patience: 'Patience',
    dedication: 'Dedication'
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl p-4 sm:p-6 border border-slate-600/30">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-100">Your Journey</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.bottlesCreated}</div>
            <div className="text-xs text-slate-400">Bottles Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.bottlesOpened}</div>
            <div className="text-xs text-slate-400">Bottles Opened</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{stats.longestWait}</div>
            <div className="text-xs text-slate-400">Longest Wait (days)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{unlockedAchievements.length}</div>
            <div className="text-xs text-slate-400">Achievements</div>
          </div>
        </div>
      </div>

      {/* Streak Section */}
      <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl p-4 sm:p-6 border border-orange-400/30">
        <div className="flex items-center space-x-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-slate-100">Opening Streak</h3>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-orange-400 mb-2">
            {streakData.current}
          </div>
          <div className="text-sm text-slate-300 mb-2">Current Streak</div>
          <div className="text-xs text-slate-400">
            Longest: {streakData.longest} days
          </div>
        </div>
        
        <div className="bg-slate-900/30 rounded-lg p-3 text-center">
          <p className="text-sm text-slate-300">{streakMessage}</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl p-4 sm:p-6 border border-slate-600/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-slate-100">Achievements</h3>
          </div>
          <div className="text-sm text-slate-400">
            {unlockedAchievements.length} / {achievements.length}
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(categoryNames).map(([category, name]) => {
            const categoryAchievements = achievementsByCategory[category] || [];
            const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length;
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                    <span className="text-sm font-medium text-slate-300">{name}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {unlockedInCategory} / {categoryAchievements.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {categoryAchievements.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg border transition-all
                        ${achievement.isUnlocked
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-slate-700/30 border-slate-600/30'
                        }
                      `}
                    >
                      <span className={`text-xl ${achievement.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium truncate ${
                            achievement.isUnlocked ? 'text-emerald-300' : 'text-slate-400'
                          }`}>
                            {achievement.title}
                          </h4>
                          {achievement.isUnlocked && (
                            <Trophy className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className={`text-xs leading-relaxed ${
                          achievement.isUnlocked ? 'text-emerald-400/80' : 'text-slate-500'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        {!achievement.isUnlocked && achievement.maxProgress && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress} / {achievement.maxProgress}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                              <div
                                className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};