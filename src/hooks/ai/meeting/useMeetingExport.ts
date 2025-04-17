
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MeetingContext } from '@/utils/text/transcriptionUtils';
import { Meeting } from '@/types/meeting';

export const useMeetingExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySummary = useCallback((summary: string) => {
    if (summary) {
      navigator.clipboard.writeText(summary)
        .then(() => {
          setCopied(true);
          toast({
            title: "Summary copied",
            description: "The meeting summary has been copied to your clipboard.",
          });
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(err => {
          console.error("Failed to copy summary:", err);
          toast({
            title: "Copy failed",
            description: "Failed to copy the meeting summary to your clipboard.",
            variant: "destructive"
          });
        });
    }
  }, []);

  const downloadAudio = useCallback(async (audioBlob: Blob | null, meetingId?: string) => {
    try {
      setIsDownloadingAudio(true);
      
      if (meetingId) {
        console.log('Downloading audio from storage for meeting:', meetingId);
        
        // First check if the meeting has audio
        const { data: meetingData, error: meetingError } = await supabase
          .from('meetings')
          .select('has_audio, audio_expires_at')
          .eq('id', meetingId)
          .single();
          
        if (meetingError) {
          console.error('Meeting data fetch error:', meetingError);
          throw new Error('Error retrieving meeting details.');
        }
        
        if (!meetingData.has_audio) {
          console.error('No audio available for meeting:', meetingId);
          throw new Error('This meeting does not have an audio recording available.');
        }
        
        if (meetingData.audio_expires_at && new Date(meetingData.audio_expires_at) < new Date()) {
          console.error('Audio recording has expired:', meetingId);
          throw new Error('The audio recording for this meeting has expired.');
        }
        
        // Check if the meeting-recordings bucket exists
        const { data: bucketData, error: bucketError } = await supabase.storage
          .getBucket('meeting-recordings');
          
        if (bucketError) {
          console.error('Bucket error:', bucketError);
          throw new Error('Audio storage not available. Please contact support.');
        }
        
        // Download from storage
        const { data, error } = await supabase.storage
          .from('meeting-recordings')
          .download(`${meetingId}.webm`);
        
        if (error) {
          console.error('Supabase download error:', error);
          throw new Error('Audio recording could not be downloaded. Please try again later.');
        }
        
        // Create download link
        if (data) {
          const url = URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = `meeting_recording_${meetingId}.webm`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast({
            title: "Download complete",
            description: "Audio recording has been downloaded.",
          });
        } else {
          throw new Error('Audio file could not be retrieved.');
        }
      } else if (audioBlob) {
        console.log('Downloading current audio blob');
        // Download current meeting audio
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meeting_recording.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Download complete",
          description: "Audio recording has been downloaded.",
        });
      } else {
        throw new Error('No audio recording available to download.');
      }
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download audio recording.",
        variant: "destructive"
      });
    } finally {
      setIsDownloadingAudio(false);
    }
  }, []);

  return {
    isExporting,
    setIsExporting,
    isDownloadingAudio,
    copied,
    copySummary,
    downloadAudio,
  };
};
