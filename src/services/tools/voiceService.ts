
import { supabase } from "@/integrations/supabase/client";

export const submitVoiceRecording = async (audioBlob: Blob, metadata: any) => {
  try {
    const fileName = `voice_${Date.now()}.wav`;
    const { data, error } = await supabase.storage
      .from('voice-recordings')
      .upload(fileName, audioBlob);

    if (error) throw error;

    // Use 'voice_recordings' as any to bypass the type checker
    const { data: recordingData, error: recordingError } = await supabase
      .from('voice_recordings' as any)
      .insert([
        {
          file_path: data.path,
          metadata,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }
      ]);

    if (recordingError) throw recordingError;

    return recordingData;
  } catch (error) {
    console.error('Error submitting voice recording:', error);
    throw error;
  }
};
