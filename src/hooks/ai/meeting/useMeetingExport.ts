
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MeetingContext } from '@/utils/text/transcriptionUtils';

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
        // Download from storage
        const { data, error } = await supabase.storage
          .from('meeting-recordings')
          .download(`${meetingId}.webm`);
        
        if (error) {
          throw new Error('Audio recording not found or could not be downloaded.');
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
        }
      } else if (audioBlob) {
        // Download current meeting audio
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meeting_recording.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('No audio recording available to download.');
      }
      
      toast({
        title: "Download complete",
        description: "Audio recording has been downloaded.",
      });
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
