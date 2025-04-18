
import { useCallback } from 'react';
import { toast } from "sonner";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';
import { MeetingSummaryState } from './types';

export const useSummaryHandlers = (
  state: MeetingSummaryState,
  setState: React.Dispatch<React.SetStateAction<MeetingSummaryState>>
) => {
  const generateSummary = useCallback(async () => {
    if (!state.transcribedText) return;
    
    setState(prev => ({ ...prev, isSummarizing: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSummary = `
        ## Meeting Summary

        ### Key Points:
        - Point 1: Important discussion about project timeline.
        - Point 2: Decision to allocate more resources to development.
        - Point 3: Agreement on next sprint goals.

        ### Action Items:
        - Action 1: Team to prepare status report by Friday.
        - Action 2: Schedule follow-up meeting next week.
        - Action 3: Review budget allocations.

        ### Decisions:
        - Decision 1: Approved new feature roadmap.
        - Decision 2: Postponed marketing campaign until Q3.
      `;
      
      const detectedLocation = state.meetingLocation || "Conference Room A";
      const detectedAttendees = ["John Doe", "Jane Smith", "Alex Johnson"];
      
      setState(prev => ({
        ...prev,
        summary: mockSummary,
        isSummarizing: false,
        detectedLocation,
        detectedAttendees
      }));
      
      if (state.meetingParts.length > 0 && state.audioBlobs) {
        const totalDuration = state.meetingParts.reduce((sum, part) => sum + part.duration, 0);
        
        await saveMeetingSummary({
          title: state.meetingTitle || "Untitled Meeting",
          date: state.meetingDate || new Date().toISOString().split('T')[0],
          location: detectedLocation,
          summary: mockSummary,
          duration: totalDuration,
          audioBlobs: state.audioBlobs
        });
      }
      
    } catch (error) {
      console.error("Error generating summary:", error);
      setState(prev => ({ ...prev, isSummarizing: false }));
      toast("Failed to generate summary. Please try again.");
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
    const supabase = useSupabaseClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    
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
