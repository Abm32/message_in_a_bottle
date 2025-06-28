import { useState, useEffect } from 'react';
import { Achievement, UserStats, StreakData, ACHIEVEMENTS } from '../types/Gamification';
import { Bottle } from '../types/Bottle';

const STATS_STORAGE_KEY = 'message-bottles-stats';
const ACHIEVEMENTS_STORAGE_KEY = 'message-bottles-achievements';
const STREAK_STORAGE_KEY = 'message-bottles-streak';

export const useGamification = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    bottlesCreated: 0,
    bottlesOpened: 0,
    totalDaysWaited: 0,
    longestWait: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalAttachments: 0,
    averageMessageLength: 0
  });

  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [streakData, setStreakData] = useState<StreakData>({
    current: 0,
    longest: 0,
    streakDates: []
  });
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Load stats
      const storedStats = localStorage.getItem(STATS_STORAGE_KEY);
      if (storedStats) {
        const parsedStats = JSON.parse(storedStats);
        setUserStats({
          ...parsedStats,
          lastOpenedDate: parsedStats.lastOpenedDate ? new Date(parsedStats.lastOpenedDate) : undefined,
          firstBottleDate: parsedStats.firstBottleDate ? new Date(parsedStats.firstBottleDate) : undefined
        });
      }

      // Load achievements
      const storedAchievements = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (storedAchievements) {
        const parsedAchievements = JSON.parse(storedAchievements).map((ach: any) => ({
          ...ach,
          unlockedAt: ach.unlockedAt ? new Date(ach.unlockedAt) : undefined
        }));
        setAchievements(parsedAchievements);
      }

      // Load streak data
      const storedStreak = localStorage.getItem(STREAK_STORAGE_KEY);
      if (storedStreak) {
        const parsedStreak = JSON.parse(storedStreak);
        setStreakData({
          ...parsedStreak,
          lastOpenedDate: parsedStreak.lastOpenedDate ? new Date(parsedStreak.lastOpenedDate) : undefined
        });
      }
    } catch (error) {
      console.error('Error loading gamification data:', error);
    }
  };

  const saveData = (newStats: UserStats, newAchievements: Achievement[], newStreak: StreakData) => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(newAchievements));
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newStreak));
    } catch (error) {
      console.error('Error saving gamification data:', error);
    }
  };

  const updateStreak = (openedDate: Date = new Date()) => {
    const today = openedDate.toISOString().split('T')[0];
    const yesterday = new Date(openedDate.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let newStreak = { ...streakData };
    
    if (!newStreak.streakDates.includes(today)) {
      newStreak.streakDates.push(today);
      
      // Check if this continues a streak
      if (newStreak.lastOpenedDate) {
        const lastDate = newStreak.lastOpenedDate.toISOString().split('T')[0];
        if (lastDate === yesterday) {
          newStreak.current += 1;
        } else if (lastDate !== today) {
          newStreak.current = 1; // Reset streak
        }
      } else {
        newStreak.current = 1;
      }
      
      newStreak.longest = Math.max(newStreak.longest, newStreak.current);
      newStreak.lastOpenedDate = openedDate;
      
      setStreakData(newStreak);
      return newStreak;
    }
    
    return newStreak;
  };

  const checkAchievements = (stats: UserStats, streak: StreakData): Achievement[] => {
    const newlyUnlocked: Achievement[] = [];
    
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.isUnlocked) return achievement;
      
      let shouldUnlock = false;
      let newProgress = achievement.progress || 0;
      
      switch (achievement.id) {
        case 'first-bottle':
          newProgress = stats.bottlesCreated;
          shouldUnlock = stats.bottlesCreated >= 1;
          break;
        case 'first-unlock':
          newProgress = stats.bottlesOpened;
          shouldUnlock = stats.bottlesOpened >= 1;
          break;
        case 'bottles-5':
          newProgress = stats.bottlesCreated;
          shouldUnlock = stats.bottlesCreated >= 5;
          break;
        case 'bottles-25':
          newProgress = stats.bottlesCreated;
          shouldUnlock = stats.bottlesCreated >= 25;
          break;
        case 'bottles-100':
          newProgress = stats.bottlesCreated;
          shouldUnlock = stats.bottlesCreated >= 100;
          break;
        case 'wait-30':
          newProgress = stats.longestWait;
          shouldUnlock = stats.longestWait >= 30;
          break;
        case 'wait-100':
          newProgress = stats.longestWait;
          shouldUnlock = stats.longestWait >= 100;
          break;
        case 'wait-365':
          newProgress = stats.longestWait;
          shouldUnlock = stats.longestWait >= 365;
          break;
        case 'streak-3':
          newProgress = streak.longest;
          shouldUnlock = streak.longest >= 3;
          break;
        case 'streak-7':
          newProgress = streak.longest;
          shouldUnlock = streak.longest >= 7;
          break;
        case 'streak-30':
          newProgress = streak.longest;
          shouldUnlock = streak.longest >= 30;
          break;
        case 'media-master':
          newProgress = stats.totalAttachments;
          shouldUnlock = stats.totalAttachments >= 10;
          break;
        case 'storyteller':
          newProgress = stats.averageMessageLength;
          shouldUnlock = stats.averageMessageLength >= 1000;
          break;
        case 'early-bird':
          // This would be checked when opening a bottle
          break;
        case 'night-owl':
          // This would be checked when creating a bottle
          break;
        case 'anniversary':
          if (stats.firstBottleDate) {
            const daysSinceFirst = Math.floor((new Date().getTime() - stats.firstBottleDate.getTime()) / (1000 * 60 * 60 * 24));
            newProgress = daysSinceFirst;
            shouldUnlock = daysSinceFirst >= 365;
          }
          break;
      }
      
      if (shouldUnlock && !achievement.isUnlocked) {
        const unlockedAchievement = {
          ...achievement,
          isUnlocked: true,
          unlockedAt: new Date(),
          progress: achievement.maxProgress || newProgress
        };
        newlyUnlocked.push(unlockedAchievement);
        return unlockedAchievement;
      }
      
      return {
        ...achievement,
        progress: newProgress
      };
    });
    
    setAchievements(updatedAchievements);
    return newlyUnlocked;
  };

  const onBottleCreated = (bottle: Bottle) => {
    const now = new Date();
    const isNightOwl = now.getHours() >= 0 && now.getHours() < 6;
    
    const newStats: UserStats = {
      ...userStats,
      bottlesCreated: userStats.bottlesCreated + 1,
      firstBottleDate: userStats.firstBottleDate || now,
      totalAttachments: userStats.totalAttachments + bottle.attachments.length,
      averageMessageLength: Math.max(userStats.averageMessageLength, bottle.message.length)
    };
    
    setUserStats(newStats);
    
    // Check for night owl achievement
    if (isNightOwl) {
      const nightOwlAch = achievements.find(a => a.id === 'night-owl');
      if (nightOwlAch && !nightOwlAch.isUnlocked) {
        const updatedAchievements = achievements.map(a => 
          a.id === 'night-owl' 
            ? { ...a, isUnlocked: true, unlockedAt: now, progress: 1 }
            : a
        );
        setAchievements(updatedAchievements);
        setNewAchievements([{ ...nightOwlAch, isUnlocked: true, unlockedAt: now }]);
      }
    }
    
    const newlyUnlocked = checkAchievements(newStats, streakData);
    if (newlyUnlocked.length > 0) {
      setNewAchievements(prev => [...prev, ...newlyUnlocked]);
    }
    
    saveData(newStats, achievements, streakData);
  };

  const onBottleOpened = (bottle: Bottle) => {
    const now = new Date();
    const waitDays = Math.floor((now.getTime() - bottle.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const isEarlyBird = Math.abs(now.getTime() - bottle.unlockDate.getTime()) <= 60 * 60 * 1000; // Within 1 hour
    
    const newStats: UserStats = {
      ...userStats,
      bottlesOpened: userStats.bottlesOpened + 1,
      totalDaysWaited: userStats.totalDaysWaited + waitDays,
      longestWait: Math.max(userStats.longestWait, waitDays),
      lastOpenedDate: now
    };
    
    const newStreak = updateStreak(now);
    newStats.currentStreak = newStreak.current;
    newStats.longestStreak = newStreak.longest;
    
    setUserStats(newStats);
    
    // Check for early bird achievement
    if (isEarlyBird) {
      const earlyBirdAch = achievements.find(a => a.id === 'early-bird');
      if (earlyBirdAch && !earlyBirdAch.isUnlocked) {
        const updatedAchievements = achievements.map(a => 
          a.id === 'early-bird' 
            ? { ...a, isUnlocked: true, unlockedAt: now, progress: 1 }
            : a
        );
        setAchievements(updatedAchievements);
        setNewAchievements([{ ...earlyBirdAch, isUnlocked: true, unlockedAt: now }]);
      }
    }
    
    const newlyUnlocked = checkAchievements(newStats, newStreak);
    if (newlyUnlocked.length > 0) {
      setNewAchievements(prev => [...prev, ...newlyUnlocked]);
    }
    
    saveData(newStats, achievements, newStreak);
  };

  const dismissNewAchievements = () => {
    setNewAchievements([]);
  };

  const getStreakMessage = (): string => {
    const current = streakData.current;
    if (current === 0) return "Start your streak by opening a bottle!";
    if (current === 1) return "Great start! Keep it going!";
    if (current < 7) return `${current} day streak! You're building momentum!`;
    if (current < 30) return `${current} day streak! You're on fire! 🔥`;
    return `${current} day streak! You're a legend! 👑`;
  };

  return {
    userStats,
    achievements,
    streakData,
    newAchievements,
    onBottleCreated,
    onBottleOpened,
    dismissNewAchievements,
    getStreakMessage
  };
};