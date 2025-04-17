
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { MeetingContext, extractMeetingContext } from '@/utils/text/transcriptionUtils';

interface SummaryState {
  isSummarizing: boolean;
  summary: string;
  detectedLocation: string | null;
}

export const useMeetingSummaryGeneration = () => {
  const [state, setState] = useState<SummaryState>({
    isSummarizing: false,
    summary: '',
    detectedLocation: null,
  });

  const generateSummary = useCallback(async (transcribedText: string, language: string) => {
    if (!transcribedText) {
      toast({
        title: "Nothing to summarize",
        description: "Please record a meeting or transcribe some text first.",
      });
      return null;
    }

    setState(prevState => ({ ...prevState, isSummarizing: true }));

    try {
      const response = await fetch('/api/ai/meeting-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcribedText, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setState(prevState => ({
        ...prevState,
        summary: data.summary,
        detectedLocation: data.location || null,
      }));
      
      return {
        summary: data.summary,
        location: data.location
      };
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary failed",
        description: error instanceof Error ? error.message : "Failed to generate meeting summary.",
        variant: "destructive"
      });
      return null;
    } finally {
      setState(prevState => ({ ...prevState, isSummarizing: false }));
    }
  }, []);

  const clearSummary = useCallback(() => {
    setState({
      isSummarizing: false,
      summary: '',
      detectedLocation: null,
    });
  }, []);

  return {
    summaryState: state,
    generateSummary,
    clearSummary,
  };
};
