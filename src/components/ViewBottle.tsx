import React from 'react';
import { Bottle as BottleType } from '../types/Bottle';
import { MediaViewer } from './MediaViewer';
import { formatDate } from '../utils/dateUtils';
import { X, Calendar, Clock } from 'lucide-react';

interface ViewBottleProps {
  bottle: BottleType | null;
  onClose: () => void;
}

export const ViewBottle: React.FC<ViewBottleProps> = ({ bottle, onClose }) => {
  if (!bottle) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 touch-manipulation">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl sm:rounded-2xl p-4 sm:p-8 w-full sm:w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border-t sm:border border-slate-600/30 shadow-2xl">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <span className="text-3xl sm:text-4xl animate-pulse flex-shrink-0">🍾</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 truncate">
                {bottle.title || 'Untitled Message'}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-slate-400 mt-1 space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Created {formatDate(bottle.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>Unlocked {formatDate(bottle.unlockDate)}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 -m-2 min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Message */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
            <h3 className="text-base sm:text-lg font-semibold text-slate-200 mb-3 sm:mb-4 flex items-center space-x-2">
              <span>💌</span>
              <span>Your Message</span>
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {bottle.message}
              </p>
            </div>
          </div>

          {/* Media Attachments */}
          {bottle.attachments.length > 0 && (
            <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-4 sm:p-6 border border-slate-600/30">
              <MediaViewer attachments={bottle.attachments} />
            </div>
          )}

          {/* Bottle Info */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-xl p-4 sm:p-6 border border-emerald-500/20">
            <h3 className="text-base sm:text-lg font-semibold text-emerald-300 mb-3">
              ✨ Bottle Journey
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <span className="text-slate-400">Delay Period:</span>
                <span className="text-slate-200 ml-2 font-medium">{bottle.delayDays} days</span>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 ml-2 font-medium">Unlocked & Ready</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-6 sm:pt-8 border-t border-slate-700/50 mt-6 sm:mt-8">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 active:scale-95 text-slate-200 rounded-lg font-medium transition-all duration-200 shadow-lg min-h-[48px] text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};