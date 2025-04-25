
import { supabase } from "@/integrations/supabase/client";

export const uploadSummaryDocument = async (file: File, metadata: any) => {
  try {
    const { data, error } = await supabase.storage
      .from('summaries')
      .upload(`documents/${Date.now()}_${file.name}`, file);

    if (error) throw error;

    const { data: summaryData, error: summaryError } = await supabase
      .from('summaries')
      .insert([{
        file_path: data.path,
        metadata,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (summaryError) throw summaryError;

    return summaryData;
  } catch (error) {
    console.error('Error uploading summary document:', error);
    throw error;
  }
};

export const getSummaryList = async () => {
  const { data, error } = await supabase
    .from('summaries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching summaries:', error);
    return [];
  }

  return data;
};
