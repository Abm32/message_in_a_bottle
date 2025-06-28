import React from 'react';
import { MediaAttachment } from '../types/Bottle';
import { formatFileSize, getFileTypeIcon } from '../utils/fileUtils';

interface MediaViewerProps {
  attachments: MediaAttachment[];
}

export const MediaViewer: React.FC<MediaViewerProps> = ({ attachments }) => {
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-3">Attachments</h3>
      <div className="grid gap-4">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getFileTypeIcon(attachment.type)}</span>
                <span className="text-sm font-medium text-slate-300 truncate">
                  {attachment.name}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {formatFileSize(attachment.size)}
              </span>
            </div>
            
            {attachment.type.startsWith('image/') && (
              <img
                src={attachment.data}
                alt={attachment.name}
                className="w-full max-h-64 object-contain rounded-lg bg-slate-900/50"
              />
            )}
            
            {attachment.type.startsWith('audio/') && (
              <audio
                controls
                className="w-full"
                src={attachment.data}
              />
            )}
            
            {attachment.type.startsWith('video/') && (
              <video
                controls
                className="w-full max-h-64 rounded-lg"
                src={attachment.data}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};