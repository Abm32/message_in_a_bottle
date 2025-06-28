import React, { useEffect, useState } from 'react';
import { Achievement } from '../types/Gamification';
import { X, Trophy } from 'lucide-react';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onDismiss: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievements,
  onDismiss
}) => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (achievements.length > 0) {
      setVisible(true);
      setCurrentIndex(0);
    }
  }, [achievements]);

  useEffect(() => {
    if (visible && achievements.length > 0) {
      const timer = setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setVisible(false);
          setTimeout(onDismiss, 300);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, currentIndex, achievements.length, onDismiss]);

  if (!visible || achievements.length === 0) return null;

  const achievement = achievements[currentIndex];

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 touch-manipulation">
      <div className={`
        bg-gradient-to-r from-amber-500/90 to-orange-600/90 backdrop-blur-sm
        rounded-2xl p-4 sm:p-6 border border-amber-400/30 shadow-2xl
        transform transition-all duration-500 ease-out
        ${visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95'}
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-200" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-white truncate">
                Achievement Unlocked!
              </h3>
              <button
                onClick={() => {
                  setVisible(false);
                  setTimeout(onDismiss, 300);
                }}
                className="text-amber-200 hover:text-white transition-colors p-1 -m-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{achievement.icon}</span>
              <h4 className="font-semibold text-amber-100 truncate">
                {achievement.title}
              </h4>
            </div>
            
            <p className="text-amber-100/90 text-sm leading-relaxed">
              {achievement.description}
            </p>
            
            {achievements.length > 1 && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-400/20">
                <div className="flex space-x-1">
                  {achievements.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-amber-200' 
                          : index < currentIndex 
                            ? 'bg-amber-300/60' 
                            : 'bg-amber-400/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-amber-200/80">
                  {currentIndex + 1} of {achievements.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};