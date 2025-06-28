import { MediaAttachment } from '../types/Bottle';

export const processFiles = async (files: File[]): Promise<MediaAttachment[]> => {
  const attachments: MediaAttachment[] = [];
  
  for (const file of files) {
    try {
      const data = await fileToBase64(file);
      attachments.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        data,
        size: file.size
      });
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
    }
  }
  
  return attachments;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('audio/')) return '🎵';
  if (type.startsWith('video/')) return '🎬';
  return '📄';
};