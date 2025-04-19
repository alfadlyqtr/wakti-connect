import { useCallback } from 'react';
import { toast } from "sonner";
import { MeetingSummaryState } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useSummaryHandlers = (
  state: MeetingSummaryState,
  setState: React.Dispatch<React.SetStateAction<MeetingSummaryState>>
) => {
  const generateSummary = useCallback(async () => {
    if (!state.transcribedText) return;
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-meeting-summary', {
        body: { text: state.transcribedText }
      });
      
      if (error) throw error;
      
      const { summary } = data;
      
      setState(prev => ({
        ...prev,
        summary,
        isSummarizing: false
      }));
      
      // Save meeting data if we have recording parts
      if (state.meetingParts.length > 0 && state.audioBlobs) {
        const totalDuration = state.meetingParts.reduce((sum, part) => sum + part.duration, 0);
        
        await saveMeetingSummary({
          title: state.meetingTitle || "Untitled Meeting",
          date: state.meetingDate || new Date().toISOString().split('T')[0],
          location: state.meetingLocation || state.detectedLocation,
          summary,
          duration: totalDuration,
          audioBlobs: state.audioBlobs
        });
      }
      
    } catch (error) {
      console.error("Error generating summary:", error);
      setState(prev => ({ ...prev, isSummarizing: false }));
      toast.error("Failed to generate summary. Please try again.");
    }
  }, [state, setState]);

  return { generateSummary };
};

const saveMeetingSummary = async ({ 
  title, 
  date, 
  location, 
  summary, 
  duration,
  audioBlobs 
}: { 
  title: string, 
  date: string, 
  location: string, 
  summary: string, 
  duration: number,
  audioBlobs: Blob[] 
}) => {
  try {
    // Get the current user directly from supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Error getting user:", userError);
      toast("User authentication required to save meeting");
      return;
    }
    
    const meetingId = uuidv4();
    
    const { error } = await supabase.from('meetings').insert({
      id: meetingId,
      user_id: user.id,
      title,
      date,
      location,
      summary,
      duration,
      has_audio: audioBlobs.length > 0,
      language: 'en',
      created_at: new Date().toISOString()
    });
    
    if (error) {
      throw error;
    }
    
    toast("Meeting summary saved successfully!");
    
  } catch (error) {
    console.error("Error saving meeting:", error);
    toast("There was an error saving your meeting data");
  }
};
