
import { useState, useCallback } from 'react';

const WAKTI_TOPICS = [
  "task management", "to-do lists", "appointments", "bookings", 
  "calendar", "scheduling", "contacts", "business management",
  "staff", "productivity", "organization", "time management",
  "pricing", "plans", "features", "subscription"
];

export const useWAKTIFocusedConversation = () => {
  const [waktiContextLevel, setWaktiContextLevel] = useState<number>(0);
  
  // Prepare message with WAKTI context when needed
  const prepareMessageWithContext = useCallback((message: string) => {
    // If the message is not likely about WAKTI, and user has been going off-topic
    if (
      !isWaktiRelatedMessage(message) && 
      waktiContextLevel < -2
    ) {
      // Add special flag to remind about WAKTI focus
      return `${message} [CONTEXT: remind_about_wakti_focus]`;
    }
    
    return message;
  }, [waktiContextLevel]);
  
  // Check if message is related to WAKTI topics
  const isWaktiRelatedMessage = useCallback((message: string) => {
    const lowercaseMessage = message.toLowerCase();
    return WAKTI_TOPICS.some(topic => lowercaseMessage.includes(topic));
  }, []);
  
  // Increase focus when user asks about WAKTI
  const increaseFocus = useCallback(async (topic?: string) => {
    setWaktiContextLevel(prev => Math.min(prev + 1, 5));
    return true;
  }, []);
  
  // Decrease focus when user goes off-topic
  const decreaseFocus = useCallback(async () => {
    setWaktiContextLevel(prev => Math.max(prev - 1, -5));
    return true;
  }, []);
  
  return {
    waktiContextLevel,
    prepareMessageWithContext,
    isWaktiRelatedMessage,
    increaseFocus,
    decreaseFocus
  };
};
