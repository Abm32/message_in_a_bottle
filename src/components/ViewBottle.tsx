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
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-600/30 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-4xl animate-pulse">🍾</span>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">
                {bottle.title || 'Untitled Message'}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(bottle.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Unlocked {formatDate(bottle.unlockDate)}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Message */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-6 border border-slate-600/30">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <span>💌</span>
              <span>Your Message</span>
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
                {bottle.message}
              </p>
            </div>
          </div>

          {/* Media Attachments */}
          {bottle.attachments.length > 0 && (
            <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl p-6 border border-slate-600/30">
              <MediaViewer attachments={bottle.attachments} />
            </div>
          )}

          {/* Bottle Info */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-xl p-6 border border-emerald-500/20">
            <h3 className="text-lg font-semibold text-emerald-300 mb-3">
              ✨ Bottle Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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

        <div className="flex justify-center pt-8 border-t border-slate-700/50 mt-8">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-slate-200 rounded-lg font-medium transition-all duration-200 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};