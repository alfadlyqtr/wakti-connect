
export interface Meeting {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  location?: string;
  user_id: string;
  language?: string;
  created_at: string;
  has_audio?: boolean;
  audio_expires_at?: string;
  audio_uploaded_at?: string;
}

export interface SavedMeeting {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  location?: string;
  hasAudio?: boolean;
  audioExpiresAt?: string;
  daysUntilExpiration?: number;
}
