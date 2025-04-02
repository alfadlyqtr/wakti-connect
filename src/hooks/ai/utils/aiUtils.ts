import { supabase } from '@/integrations/supabase/client';

// Helper function to fetch user profile
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, display_name')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return { firstName: '' };
    }
    
    // Try to get first name from different fields
    let firstName = '';
    if (profile?.full_name) {
      firstName = profile.full_name.split(' ')[0] || '';
    } else if (profile?.display_name) {
      firstName = profile.display_name.split(' ')[0] || '';
    }
    
    return { firstName };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return { firstName: '' };
  }
};

// Placeholder for the document processing function
export const processDocument = async (file: File) => {
  // This would typically call an API to process the document
  // For now, we'll return a mock response
  return {
    id: 'doc-' + Math.random().toString(36).substring(2, 9),
    title: file.name,
    content: `Content extracted from ${file.name}`,
    document_type: file.type,
    created_at: new Date().toISOString(),
  };
};

// Helper function to determine if a message is off-topic
export const checkIfOffTopic = (message: string): boolean => {
  // This would be a much more sophisticated check in production
  // For now, we'll just check for some keywords that are definitely on-topic
  const onTopicKeywords = [
    'task', 'event', 'schedule', 'booking', 'meeting', 'appointment', 
    'reminder', 'todo', 'to-do', 'wakti', 'business', 'work', 
    'project', 'deadline', 'priority', 'staff', 'team', 'client'
  ];
  
  const messageLower = message.toLowerCase();
  const isOnTopic = onTopicKeywords.some(keyword => messageLower.includes(keyword));
  
  return !isOnTopic;
};

// Helper function to call the AI assistant
export const callAIAssistant = async (token: string, message: string, userName: string, context: any = {}) => {
  try {
    // In production, this would call a Supabase Edge Function
    // For now, return a mock response
    return {
      response: `This is a placeholder response to: "${message}". The real AI would provide a helpful response here.`,
    };
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    throw new Error('Failed to get a response from the AI assistant. Please try again.');
  }
};
