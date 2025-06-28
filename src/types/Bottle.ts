export interface MediaAttachment {
  id: string;
  name: string;
  type: string;
  data: string; // base64 encoded data
  size: number;
}

export interface Bottle {
  id: string;
  title: string;
  message: string;
  attachments: MediaAttachment[];
  createdAt: Date;
  unlockDate: Date;
  isUnlocked: boolean;
  delayDays: number;
}

export interface CreateBottleData {
  title: string;
  message: string;
  delayDays: number;
  attachments: File[];
}