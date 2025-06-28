import React, { useState, useRef } from 'react';
import { CreateBottleData } from '../types/Bottle';
import { processFiles, formatFileSize } from '../utils/fileUtils';
import { X, Upload, Plus, Camera, Mic } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 touch-manipulation">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl sm:rounded-2xl p-4 sm:p-8 w-full sm:w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border-t sm:border border-slate-600/30 shadow-2xl">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <span className="text-2xl sm:text-3xl">🍾</span>
            <span>Create Message Bottle</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 -m-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base"
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
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none text-base"
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
                className="w-20 sm:w-24 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base"
              />
              <span className="text-slate-300 text-sm sm:text-base">days</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-2">
              Will unlock on {new Date(Date.now() + formData.delayDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Attachments (Optional)
            </label>
            <div className="space-y-3">
              {/* Mobile-optimized upload buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center p-4 border-2 border-slate-600 border-dashed rounded-lg bg-slate-700/20 hover:bg-slate-700/40 active:scale-95 transition-all min-h-[80px]"
                >
                  <Upload className="w-6 h-6 mb-2 text-slate-400" />
                  <span className="text-xs text-slate-400 text-center">Upload Files</span>
                </button>
                
                <button
                  type="button"
                  onClick={triggerCameraInput}
                  className="flex flex-col items-center justify-center p-4 border-2 border-slate-600 border-dashed rounded-lg bg-slate-700/20 hover:bg-slate-700/40 active:scale-95 transition-all min-h-[80px] sm:hidden"
                >
                  <Camera className="w-6 h-6 mb-2 text-slate-400" />
                  <span className="text-xs text-slate-400 text-center">Take Photo</span>
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,audio/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-300">Selected Files:</h4>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="text-sm text-slate-300 truncate">{file.name}</span>
                        <span className="text-xs text-slate-400 flex-shrink-0">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1 -m-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-6 py-3 bg-slate-600/50 hover:bg-slate-600/70 active:scale-95 text-slate-200 rounded-lg font-medium transition-all duration-200 border border-slate-500/30 min-h-[48px] text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.message.trim() || isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 active:scale-95 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/25 disabled:shadow-none min-h-[48px] text-base"
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