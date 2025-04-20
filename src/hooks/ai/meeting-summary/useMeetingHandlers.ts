
import { useCallback } from 'react';
import { toast } from "sonner";

export const useMeetingHandlers = () => {
  const downloadAudio = useCallback(async (audioUrl: string, fileName: string) => {
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error('Failed to fetch audio');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast.success('Audio downloaded successfully');
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast.error('Failed to download audio. Please try again.');
    }
  }, []);

  return { downloadAudio };
};
