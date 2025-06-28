import React from 'react';
import { Bottle as BottleType } from '../types/Bottle';
import { Countdown } from './Countdown';
import { formatDate } from '../utils/dateUtils';
import { MessageCircle, Calendar, Paperclip, Trash2, Unlock } from 'lucide-react';

interface BottleCardProps {
  bottle: BottleType;
  onView: (bottle: BottleType) => void;
  onDelete: (id: string) => void;
  onUnlock: (id: string) => void;
  onStatusChange: () => void;
}

export const BottleCard: React.FC<BottleCardProps> = ({
  bottle,
  onView,
  onDelete,
  onUnlock,
  onStatusChange
}) => {
  const handleUnlockEarly = () => {
    if (window.confirm('Are you sure you want to unlock this bottle early? The surprise will be ruined!')) {
      onUnlock(bottle.id);
    }
  };

  return (
    <div className={`
      group relative backdrop-blur-sm rounded-2xl p-4 sm:p-6 border transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl touch-manipulation
      ${bottle.isUnlocked 
        ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-400/30 shadow-emerald-500/20' 
        : 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 border-slate-600/30 shadow-slate-900/20'
      }
    `}>
      {/* Floating bottle animation */}
      <div className="absolute -top-2 -right-2 text-2xl sm:text-3xl animate-bounce opacity-70">
        🍾
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1 truncate pr-6 sm:pr-8">
              {bottle.title || 'Untitled Message'}
            </h3>
            <div className="flex items-center text-xs text-slate-400 space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{formatDate(bottle.createdAt)}</span>
              </div>
              {bottle.attachments.length > 0 && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <Paperclip className="w-3 h-3" />
                  <span>{bottle.attachments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message preview */}
        <div className="text-sm text-slate-300 line-clamp-3 min-h-[60px] leading-relaxed">
          {bottle.isUnlocked ? (
            <p className="opacity-90">{bottle.message}</p>
          ) : (
            <p className="opacity-50 italic">Message locked until {formatDate(bottle.unlockDate)}</p>
          )}
        </div>

        {/* Status section */}
        <div className="flex flex-col space-y-3">
          {!bottle.isUnlocked && (
            <Countdown
              targetDate={bottle.unlockDate}
              onComplete={onStatusChange}
              className="bg-slate-900/30 rounded-lg p-3"
            />
          )}
          
          {bottle.isUnlocked && (
            <div className="text-center text-emerald-400 font-semibold py-2 text-sm sm:text-base">
              ✨ Ready to Read ✨
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-3 sm:pt-4 border-t border-slate-700/50">
          {bottle.isUnlocked ? (
            <button
              onClick={() => onView(bottle)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-500/25 text-sm sm:text-base min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Read Message</span>
            </button>
          ) : (
            <button
              onClick={handleUnlockEarly}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/25 text-sm sm:text-base min-h-[44px]"
            >
              <Unlock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Unlock Early</span>
            </button>
          )}
          
          <button
            onClick={() => onDelete(bottle.id)}
            className="bg-red-500/20 hover:bg-red-500/30 active:scale-95 text-red-400 hover:text-red-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-400/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};