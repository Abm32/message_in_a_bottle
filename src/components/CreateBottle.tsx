import React, { useState } from 'react';
import { CreateBottleData } from '../types/Bottle';
import { processFiles, formatFileSize } from '../utils/fileUtils';
import { X, Upload, Plus } from 'lucide-react';

interface CreateBottleProps {
  onCreateBottle: (data: CreateBottleData) => Promise<void>;
  onClose: () => void;
  isVisible: boolean;
}

export const CreateBottle: React.FC<CreateBottleProps> = ({
  onCreateBottle,
  onClose,
  isVisible
}) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    delayDays: 7
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsLoading(true);
    try {
      await onCreateBottle({
        ...formData,
        attachments
      });
      setFormData({ title: '', message: '', delayDays: 7 });
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error('Error creating bottle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-600/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <span className="text-3xl">🍾</span>
            <span>Create Message Bottle</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              placeholder="Give your message a title..."
              maxLength={100}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none"
              placeholder="Write your message to the future..."
              rows={6}
              required
              maxLength={5000}
            />
            <div className="text-xs text-slate-400 mt-1 text-right">
              {formData.message.length}/5000
            </div>
          </div>

          {/* Delay */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Unlock Delay
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="365"
                value={formData.delayDays}
                onChange={(e) => setFormData(prev => ({ ...prev, delayDays: parseInt(e.target.value) || 1 }))}
                className="w-24 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
              <span className="text-slate-300">days</span>
              <span className="text-sm text-slate-400">
                (Will unlock on {new Date(Date.now() + formData.delayDays * 24 * 60 * 60 * 1000).toLocaleDateString()})
              </span>
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Attachments (Optional)
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700/20 hover:bg-slate-700/40 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-slate-400" />
                    <p className="mb-2 text-sm text-slate-400">
                      <span className="font-semibold">Click to upload</span> files
                    </p>
                    <p className="text-xs text-slate-500">Images, audio, or video files</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,audio/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-300">Selected Files:</h4>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-300">{file.name}</span>
                        <span className="text-xs text-slate-400">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-6 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-600/50 hover:bg-slate-600/70 text-slate-200 rounded-lg font-medium transition-all duration-200 border border-slate-500/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.message.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Bottle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};