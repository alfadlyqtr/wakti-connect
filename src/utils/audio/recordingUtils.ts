
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Initialize a meeting recording session with unique IDs
 */
export function initializeRecordingSession(userId: string) {
  const meetingId = uuidv4();
  return {
    meetingId,
    userId,
    parts: 0,
    startTime: new Date(),
  };
}

/**
 * Start recording audio using the MediaRecorder API
 */
export function startRecording(onDataAvailable: (blob: Blob) => void): Promise<MediaRecorder> {
  return new Promise(async (resolve, reject) => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Create media recorder with WebM format (good compression, widely supported)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      // Handle data available events
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onDataAvailable(event.data);
        }
      };
      
      // Start recording with 10-second chunks
      // This helps manage memory and enables faster initial transcription
      mediaRecorder.start(10000);
      resolve(mediaRecorder);
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Stop recording and return all collected data
 */
export function stopRecording(mediaRecorder: MediaRecorder): Promise<void> {
  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      // Stop all tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      resolve();
    };
    
    // Request the recorder to stop and finalize the recording
    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  });
}

/**
 * Upload audio blob directly to Supabase storage
 */
export async function uploadAudioToStorage(
  blob: Blob,
  userId: string,
  meetingId: string,
  partNumber: number
): Promise<string | null> {
  try {
    const filePath = `${userId}/${meetingId}/part_${partNumber}.webm`;
    
    // Upload the blob directly to Supabase storage
    const { data, error } = await supabase.storage
      .from('meeting-recordings')
      .upload(filePath, blob, {
        contentType: 'audio/webm',
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      console.error('Error uploading audio to Supabase:', error);
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('meeting-recordings')
      .getPublicUrl(filePath);
    
    return publicUrl;
    
  } catch (error) {
    console.error('Failed to upload audio:', error);
    return null;
  }
}

/**
 * Get a signed URL with extended expiry for secure access
 */
export async function getSignedUrl(
  userId: string,
  meetingId: string,
  partNumber: number
): Promise<string | null> {
  try {
    const filePath = `${userId}/${meetingId}/part_${partNumber}.webm`;
    
    const { data, error } = await supabase.storage
      .from('meeting-recordings')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
    
    if (error || !data) {
      console.error('Error getting signed URL:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Failed to get signed URL:', error);
    return null;
  }
}

/**
 * Transcribe audio using edge function
 */
export async function transcribeAudio(
  fileUrl: string,
  language: string = 'en'
): Promise<{ text: string; source: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('voice-transcription', {
      body: { fileUrl, language },
    });
    
    if (error) {
      console.error('Error invoking voice-transcription function:', error);
      throw error;
    }
    
    if (!data || !data.text) {
      console.error('No transcription data received');
      return null;
    }
    
    return {
      text: data.text,
      source: data.source || 'unknown',
    };
  } catch (error) {
    console.error('Transcription failed:', error);
    return null;
  }
}

/**
 * Generate a meeting summary from transcript
 */
export async function generateMeetingSummary(
  transcript: string,
  language: string = 'en'
): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-meeting-summary', {
      body: { text: transcript, language },
    });
    
    if (error) {
      console.error('Error generating meeting summary:', error);
      throw error;
    }
    
    return data?.summary || null;
  } catch (error) {
    console.error('Summary generation failed:', error);
    return null;
  }
}

/**
 * Format recording duration for display
 */
export function formatRecordingDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate current recording progress percentage
 */
export function calculateRecordingProgress(
  currentSeconds: number,
  maxDuration: number
): number {
  return Math.min((currentSeconds / maxDuration) * 100, 100);
}

/**
 * Extract information from transcript like location, attendees, etc.
 */
export function extractMeetingDetails(transcript: string): {
  detectedLocation?: string;
  detectedAttendees?: string[];
} {
  // This is a placeholder for AI-based extraction logic
  // In a real implementation, this would use NLP to extract entities
  return {
    detectedLocation: undefined,
    detectedAttendees: undefined,
  };
}
