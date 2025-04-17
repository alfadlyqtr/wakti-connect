
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface SavedMeeting {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  location?: string;
}

export const useMeetingStorage = (storageType: 'meeting-recordings' | 'lecture-notes' = 'meeting-recordings') => {
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const folder = storageType === 'lecture-notes' ? 'lecture-recordings' : 'meeting-recordings';
  const tableName = storageType === 'lecture-notes' ? 'lecture_notes' : 'meeting_summaries';
  const locationField = storageType === 'lecture-notes' ? 'course' : 'location';

  const loadSavedMeetings = useCallback(async () => {
    setIsLoadingHistory(true);

    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return [];
      }

      // Load from local storage as fallback
      const localMeetings = localStorage.getItem(`${folder}_history`);
      if (localMeetings) {
        try {
          const parsed = JSON.parse(localMeetings);
          if (Array.isArray(parsed)) {
            setSavedMeetings(parsed);
          }
        } catch (e) {
          console.error('Error parsing local storage meetings', e);
        }
      }

      // Try to load from Supabase
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const formattedMeetings = data.map(item => ({
            id: item.id,
            date: item.created_at,
            summary: item.summary,
            duration: item.duration,
            title: item.title || (storageType === 'lecture-notes' ? 'Untitled Lecture' : 'Untitled Meeting'),
            location: item[locationField]
          }));

          setSavedMeetings(formattedMeetings);
          
          // Update local storage with the latest data
          localStorage.setItem(`${folder}_history`, JSON.stringify(formattedMeetings));
          
          return formattedMeetings;
        }
      } catch (supabaseError) {
        console.error('Error fetching from Supabase:', supabaseError);
        // If Supabase fails, we'll use local storage data
      }

      return savedMeetings;
    } catch (error) {
      console.error(`Error loading ${storageType.replace('-', ' ')}:`, error);
      toast({
        title: `Error loading ${storageType.replace('-', ' ')}`,
        description: "We couldn't retrieve your saved data.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoadingHistory(false);
    }
  }, [folder, savedMeetings, tableName, locationField, storageType]);

  const saveMeetingToSupabase = useCallback(async (
    summary: string,
    transcript: string,
    duration: number,
    language: string,
    audioData: Blob | null,
    title?: string,
    type: 'meeting' | 'lecture' = 'meeting'
  ) => {
    try {
      const meetingId = uuidv4();
      const defaultTitle = type === 'lecture' ? 'Untitled Lecture' : 'Untitled Meeting';
      const finalTitle = title || defaultTitle;
      
      // Extract location or course name if possible
      const locationMatch = summary.match(/Location:?\s([^\n]+)/i);
      const courseMatch = summary.match(/Course:?\s([^\n]+)/i);
      const location = type === 'lecture' ? (courseMatch?.[1]?.trim() || null) : (locationMatch?.[1]?.trim() || null);
      
      // Try to save to Supabase
      let isSupabaseSaved = false;
      
      if (supabase) {
        try {
          const insertData = {
            id: meetingId,
            title: finalTitle,
            summary: summary,
            transcript: transcript,
            duration: duration,
            language: language,
            [type === 'lecture' ? 'course' : 'location']: location
          };
          
          const { error } = await supabase
            .from(type === 'lecture' ? 'lecture_notes' : 'meeting_summaries')
            .insert(insertData);
          
          if (error) throw error;
          
          // Upload audio if available
          if (audioData) {
            const { error: uploadError } = await supabase.storage
              .from(folder)
              .upload(`${meetingId}.webm`, audioData, {
                contentType: 'audio/webm',
                upsert: true
              });
            
            if (uploadError) {
              console.error('Error uploading audio:', uploadError);
            }
          }
          
          isSupabaseSaved = true;
        } catch (supabaseError) {
          console.error('Supabase save error:', supabaseError);
          // Continue with local storage fallback
        }
      }
      
      // Local storage fallback if Supabase fails
      if (!isSupabaseSaved) {
        const newMeeting = {
          id: meetingId,
          date: new Date().toISOString(),
          summary: summary,
          duration: duration,
          title: finalTitle,
          location: location
        };
        
        const updatedMeetings = [newMeeting, ...savedMeetings];
        setSavedMeetings(updatedMeetings);
        localStorage.setItem(`${folder}_history`, JSON.stringify(updatedMeetings));
      }
      
      // Regardless of storage method, refresh the list
      await loadSavedMeetings();
      
      toast({
        title: type === 'lecture' ? "Lecture notes saved" : "Meeting summary saved",
        description: "Your recording has been saved successfully.",
      });
      
      return meetingId;
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      toast({
        title: `Failed to save ${type}`,
        description: "An error occurred while saving your recording.",
        variant: "destructive"
      });
      return null;
    }
  }, [savedMeetings, folder, loadSavedMeetings]);

  const deleteMeeting = useCallback(async (meetingId: string) => {
    try {
      // Try to delete from Supabase first
      let isSupabaseDeleted = false;
      
      if (supabase) {
        try {
          // Delete the database record
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', meetingId);
          
          if (error) throw error;
          
          // Delete the audio file
          const { error: storageError } = await supabase.storage
            .from(folder)
            .remove([`${meetingId}.webm`]);
          
          // Storage error is not critical
          if (storageError) {
            console.warn('Storage delete error (non-critical):', storageError);
          }
          
          isSupabaseDeleted = true;
        } catch (supabaseError) {
          console.error('Supabase delete error:', supabaseError);
          // Continue with local storage fallback
        }
      }
      
      // Update local storage
      const updatedMeetings = savedMeetings.filter(meeting => meeting.id !== meetingId);
      setSavedMeetings(updatedMeetings);
      localStorage.setItem(`${folder}_history`, JSON.stringify(updatedMeetings));
      
      toast({
        title: storageType === 'lecture-notes' ? "Lecture notes deleted" : "Meeting summary deleted",
        description: "The recording has been removed successfully.",
      });
    } catch (error) {
      console.error(`Error deleting ${storageType.replace('-', ' ')}:`, error);
      toast({
        title: "Deletion failed",
        description: `Failed to delete the ${storageType.replace('-', ' ')}.`,
        variant: "destructive"
      });
    }
  }, [savedMeetings, folder, supabase, tableName, storageType]);

  const updateMeetingTitle = useCallback(async (meetingId: string, newTitle: string) => {
    try {
      // Try to update in Supabase first
      let isSupabaseUpdated = false;
      
      if (supabase) {
        try {
          const { error } = await supabase
            .from(tableName)
            .update({ title: newTitle })
            .eq('id', meetingId);
          
          if (error) throw error;
          
          isSupabaseUpdated = true;
        } catch (supabaseError) {
          console.error('Supabase update error:', supabaseError);
          // Continue with local storage fallback
        }
      }
      
      // Update local storage regardless
      const updatedMeetings = savedMeetings.map(meeting => {
        if (meeting.id === meetingId) {
          return { ...meeting, title: newTitle };
        }
        return meeting;
      });
      
      setSavedMeetings(updatedMeetings);
      localStorage.setItem(`${folder}_history`, JSON.stringify(updatedMeetings));
      
      toast({
        title: "Title updated",
        description: "The title has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: "Update failed",
        description: "Failed to update the title.",
        variant: "destructive"
      });
    }
  }, [savedMeetings, folder, supabase, tableName]);

  return {
    savedMeetings,
    isLoadingHistory,
    saveMeetingToSupabase,
    loadSavedMeetings,
    deleteMeeting,
    updateMeetingTitle,
  };
};
