
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

interface ConversationContext {
  id: string;
  wakti_focus_level: number;
  last_wakti_topic: string | null;
  session_id: string;
}

export const useWAKTIFocusedConversation = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [context, setContext] = useState<ConversationContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load or create conversation context
  useEffect(() => {
    const loadContext = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Try to get an existing active session from the last hour
        const { data: existingContext, error: fetchError } = await supabase
          .from('ai_conversation_contexts')
          .select('*')
          .eq('user_id', user.id)
          .gt('last_interaction', new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .order('last_interaction', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (fetchError) {
          console.error('Error fetching conversation context:', fetchError);
          throw fetchError;
        }
        
        if (existingContext) {
          // Use existing context
          setContext({
            id: existingContext.id,
            wakti_focus_level: existingContext.wakti_focus_level,
            last_wakti_topic: existingContext.last_wakti_topic,
            session_id: existingContext.session_id
          });
          setSessionId(existingContext.session_id);
          
          // Update the last interaction time
          await supabase
            .from('ai_conversation_contexts')
            .update({ 
              last_interaction: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingContext.id);
            
        } else {
          // Create new context
          const newSessionId = uuidv4();
          setSessionId(newSessionId);
          
          const { data: newContext, error: insertError } = await supabase
            .from('ai_conversation_contexts')
            .insert({
              user_id: user.id,
              session_id: newSessionId,
              wakti_focus_level: 5, // Start with medium focus
              last_wakti_topic: null
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating conversation context:', insertError);
            throw insertError;
          }
          
          if (newContext) {
            setContext({
              id: newContext.id,
              wakti_focus_level: newContext.wakti_focus_level,
              last_wakti_topic: newContext.last_wakti_topic,
              session_id: newContext.session_id
            });
          }
        }
      } catch (error) {
        console.error('Error in conversation context setup:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContext();
  }, [user]);
  
  // Update focus level
  const updateFocusLevel = async (newLevel: number, topic?: string) => {
    if (!user || !context) return;
    
    try {
      const updatedContext = {
        wakti_focus_level: Math.max(1, Math.min(10, newLevel)), // Clamp between 1-10
        last_wakti_topic: topic || context.last_wakti_topic,
        last_interaction: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('ai_conversation_contexts')
        .update(updatedContext)
        .eq('id', context.id);
        
      if (error) {
        console.error('Error updating conversation context:', error);
        return;
      }
      
      setContext({
        ...context,
        wakti_focus_level: updatedContext.wakti_focus_level,
        last_wakti_topic: updatedContext.last_wakti_topic
      });
    } catch (error) {
      console.error('Error updating focus level:', error);
    }
  };
  
  // Increase focus on WAKTI
  const increaseFocus = async (topic?: string) => {
    if (!context) return;
    await updateFocusLevel(context.wakti_focus_level + 1, topic);
  };
  
  // Decrease focus on WAKTI
  const decreaseFocus = async () => {
    if (!context) return;
    await updateFocusLevel(context.wakti_focus_level - 1);
  };
  
  // Reset focus to default
  const resetFocus = async () => {
    if (!context) return;
    await updateFocusLevel(5);
  };
  
  // Prepare message with WAKTI context
  const prepareMessageWithContext = (message: string) => {
    if (!context) return message;
    
    let contextMessage = message;
    
    // If focus level is high enough, append context to the message
    if (context.wakti_focus_level >= 7) {
      contextMessage = `[WAKTI FOCUS LEVEL: HIGH] ${message}`;
    } else if (context.wakti_focus_level >= 4) {
      contextMessage = `[WAKTI FOCUS LEVEL: MEDIUM] ${message}`;
    } else {
      contextMessage = `[WAKTI FOCUS LEVEL: LOW] ${message}`;
    }
    
    // Add recent topic if available
    if (context.last_wakti_topic) {
      contextMessage = `${contextMessage} [RECENT WAKTI TOPIC: ${context.last_wakti_topic}]`;
    }
    
    return contextMessage;
  };
  
  return {
    sessionId,
    focusLevel: context?.wakti_focus_level || 5,
    lastTopic: context?.last_wakti_topic,
    isLoading,
    increaseFocus,
    decreaseFocus,
    resetFocus,
    updateFocusLevel,
    prepareMessageWithContext
  };
};
