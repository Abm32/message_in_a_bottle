import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '../utils/dateUtils';

interface CountdownProps {
  targetDate: Date;
  onComplete?: () => void;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({ 
  targetDate, 
  onComplete, 
  className = '' 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(targetDate);
      setTimeRemaining(remaining);
      
      if (remaining === 'Unlocked!' && onComplete) {
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const isUnlocked = timeRemaining === 'Unlocked!';

  return (
    <div className={`font-mono text-center ${className}`}>
      <div className={`text-base sm:text-lg font-semibold ${
        isUnlocked 
          ? 'text-emerald-400 animate-pulse' 
          : 'text-cyan-300'
      }`}>
        {timeRemaining}
      </div>
      {!isUnlocked && (
        <div className="text-xs text-slate-400 mt-1">
          until unlock
        </div>
      )}
    </div>
  );
};