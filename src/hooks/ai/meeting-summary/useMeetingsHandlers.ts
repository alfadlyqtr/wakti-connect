
import { useCallback } from 'react';
import { toast } from "sonner";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export const useMeetingsHandlers = () => {
  const loadSavedMeetings = useCallback(async () => {
    try {
      const supabase = useSupabaseClient();
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
      
    } catch (error) {
      console.error("Error loading meetings:", error);
      toast("There was an error retrieving your saved meetings");
      return [];
    }
  }, []);

  const deleteMeeting = useCallback(async (meetingId: string) => {
    try {
      const supabase = useSupabaseClient();
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
