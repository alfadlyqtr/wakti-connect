
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MeetingContext, extractMeetingContext } from '@/utils/text/transcriptionUtils';

export interface SavedMeeting {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  location?: string;
}

export const useMeetingStorage = () => {
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const saveMeetingToSupabase = useCallback(async (
    summary: string,
    transcribedText: string,
    recordingTime: number,
    language: string,
    audioData: Blob | null,
    title?: string
  ) => {
    try {
      if (!summary) {
        return null;
      }

      // Extract location from transcript if available
      const meetingContext = extractMeetingContext(transcribedText);
      
      // Determine title - use provided title, extract from transcript, or use default
      const meetingTitle = title || 
        (meetingContext?.title || 'Meeting Summary');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save to Supabase
      const { data, error } = await supabase.from('meetings').insert({
        summary: summary,
        duration: recordingTime,
        date: new Date().toISOString(),
        location: meetingContext?.location || null,
        language: language,
        title: meetingTitle,
        user_id: user.id
      }).select();

      if (error) {
        throw new Error(error.message);
      }

      // Save audio data if available
      if (audioData) {
        const audioFile = new File(
          [audioData], 
          `meeting_${data[0].id}.webm`, 
          { type: 'audio/webm' }
        );

        const { error: uploadError } = await supabase.storage
          .from('meeting-recordings')
          .upload(`${data[0].id}.webm`, audioFile);

        if (uploadError) {
          console.error('Error uploading audio:', uploadError);
        }
      }

      toast({
        title: "Meeting saved",
        description: "Your meeting summary has been saved successfully.",
      });

      // Refresh the list of saved meetings
      loadSavedMeetings();
      
      return data[0];
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save meeting summary.",
        variant: "destructive"
      });
      return null;
    }
  }, []);

  const loadSavedMeetings = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(error.message);
      }

      setSavedMeetings(data.map(meeting => ({
        id: meeting.id,
        date: meeting.date,
        summary: meeting.summary,
        duration: meeting.duration,
        title: meeting.title || 'Untitled Meeting',
        location: meeting.location
      })));
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast({
        title: "Error loading history",
        description: error instanceof Error ? error.message : "Failed to load meeting history.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Also remove the audio recording if it exists
      await supabase.storage
        .from('meeting-recordings')
        .remove([`${id}.webm`]);

      // Update local state
      setSavedMeetings(prevMeetings => 
        prevMeetings.filter(meeting => meeting.id !== id)
      );

      toast({
        title: "Meeting deleted",
        description: "The meeting has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete the meeting.",
        variant: "destructive"
      });
    }
  };

  const updateMeetingTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('meetings')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setSavedMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === id ? { ...meeting, title: newTitle } : meeting
        )
      );

      toast({
        title: "Title updated",
        description: "The meeting title has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update the meeting title.",
        variant: "destructive"
      });
    }
  };

  return {
    savedMeetings,
    isLoadingHistory,
    saveMeetingToSupabase,
    loadSavedMeetings,
    deleteMeeting,
    updateMeetingTitle,
  };
};
