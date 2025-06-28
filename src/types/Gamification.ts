export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'milestone' | 'streak' | 'creativity' | 'patience' | 'dedication';
    unlockedAt?: Date;
    isUnlocked: boolean;
    progress?: number;
    maxProgress?: number;
  }
  
  export interface UserStats {
    bottlesCreated: number;
    bottlesOpened: number;
    totalDaysWaited: number;
    longestWait: number;
    currentStreak: number;
    longestStreak: number;
    lastOpenedDate?: Date;
    firstBottleDate?: Date;
    totalAttachments: number;
    averageMessageLength: number;
  }
  
  export interface StreakData {
    current: number;
    longest: number;
    lastOpenedDate?: Date;
    streakDates: string[]; // ISO date strings
  }
  
  export const ACHIEVEMENTS: Achievement[] = [
    // Milestone Achievements
    {
      id: 'first-bottle',
      title: 'Message in a Bottle',
      description: 'Create your very first bottle',
      icon: '🍾',
      category: 'milestone',
      isUnlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'first-unlock',
      title: 'Time Traveler',
      description: 'Open your first bottle from the past',
      icon: '⏰',
      category: 'milestone',
      isUnlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'bottles-5',
      title: 'Bottle Collector',
      description: 'Create 5 bottles',
      icon: '🗂️',
      category: 'milestone',
      isUnlocked: false,
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'bottles-25',
      title: 'Message Master',
      description: 'Create 25 bottles',
      icon: '📚',
      category: 'milestone',
      isUnlocked: false,
      progress: 0,
      maxProgress: 25
    },
    {
      id: 'bottles-100',
      title: 'Ocean of Memories',
      description: 'Create 100 bottles',
      icon: '🌊',
      category: 'milestone',
      isUnlocked: false,
      progress: 0,
      maxProgress: 100
    },
  
    // Patience Achievements
    {
      id: 'wait-30',
      title: 'Patient Soul',
      description: 'Wait 30 days for a bottle to unlock',
      icon: '🧘',
      category: 'patience',
      isUnlocked: false,
      progress: 0,
      maxProgress: 30
    },
    {
      id: 'wait-100',
      title: 'Zen Master',
      description: 'Wait 100 days for a bottle to unlock',
      icon: '🕯️',
      category: 'patience',
      isUnlocked: false,
      progress: 0,
      maxProgress: 100
    },
    {
      id: 'wait-365',
      title: 'Time Keeper',
      description: 'Wait a full year for a bottle to unlock',
      icon: '📅',
      category: 'patience',
      isUnlocked: false,
      progress: 0,
      maxProgress: 365
    },
  
    // Streak Achievements
    {
      id: 'streak-3',
      title: 'Getting Started',
      description: 'Open bottles for 3 days in a row',
      icon: '🔥',
      category: 'streak',
      isUnlocked: false,
      progress: 0,
      maxProgress: 3
    },
    {
      id: 'streak-7',
      title: 'Weekly Warrior',
      description: 'Open bottles for 7 days in a row',
      icon: '⚡',
      category: 'streak',
      isUnlocked: false,
      progress: 0,
      maxProgress: 7
    },
    {
      id: 'streak-30',
      title: 'Dedication Champion',
      description: 'Open bottles for 30 days in a row',
      icon: '👑',
      category: 'streak',
      isUnlocked: false,
      progress: 0,
      maxProgress: 30
    },
  
    // Creativity Achievements
    {
      id: 'media-master',
      title: 'Media Master',
      description: 'Attach media to 10 different bottles',
      icon: '🎨',
      category: 'creativity',
      isUnlocked: false,
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'storyteller',
      title: 'Storyteller',
      description: 'Write a message over 1000 characters',
      icon: '📖',
      category: 'creativity',
      isUnlocked: false,
      progress: 0,
      maxProgress: 1000
    },
    {
      id: 'variety-pack',
      title: 'Variety Pack',
      description: 'Create bottles with 5 different delay periods',
      icon: '🎭',
      category: 'creativity',
      isUnlocked: false,
      progress: 0,
      maxProgress: 5
    },
  
    // Dedication Achievements
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Open a bottle within an hour of it unlocking',
      icon: '🐦',
      category: 'dedication',
      isUnlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Create a bottle between midnight and 6 AM',
      icon: '🦉',
      category: 'dedication',
      isUnlocked: false,
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'anniversary',
      title: 'Anniversary',
      description: 'Use the app for 365 days',
      icon: '🎂',
      category: 'dedication',
      isUnlocked: false,
      progress: 0,
      maxProgress: 365
    }
  ];