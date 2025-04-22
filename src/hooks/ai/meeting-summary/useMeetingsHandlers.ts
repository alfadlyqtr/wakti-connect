
import { useCallback } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client'; // Import directly

export const useMeetingsHandlers = () => {
  const loadSavedMeetings = useCallback(async () => {
    try {
      // Get user directly from supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("Error getting user:", userError);
        toast("User authentication required to load meetings");
        return [];
      }
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Raw meetings data from database:", data);
      return data || [];
      
    } catch (error) {
      console.error("Error loading meetings:", error);
      toast("There was an error retrieving your saved meetings");
      return [];
    }
  }, []);

  const deleteMeeting = useCallback(async (meetingId: string) => {
    try {
      // First get the meeting data to check if it has an audio file
      const { data: meeting, error: fetchError } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // If there's an audio file in storage, delete it first
      if (meeting.has_audio && meeting.audio_storage_path) {
        const { error: storageError } = await supabase.storage
          .from('meeting-recordings')
          .remove([meeting.audio_storage_path]);
          
        if (storageError) {
          console.warn("Could not delete audio file:", storageError);
          // Continue with deletion even if storage removal fails
        }
      }
      
      // Now delete the meeting record
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);
      
      if (error) {
        throw error;
      }
      
      toast("Meeting deleted successfully");
      return true;
      
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast("There was an error deleting the meeting");
      return false;
    }
  }, []);

  return {
    loadSavedMeetings,
    deleteMeeting
  };
};
