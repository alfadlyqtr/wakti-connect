import { useState } from "react";

interface FocusedConversationHook {
  prepareMessageWithContext: (message: string) => string;
  increaseFocus: (topic?: string) => Promise<void>;
  decreaseFocus: () => Promise<void>;
  clearFocus: () => void;
  focusLevel: "HIGH" | "MEDIUM" | "LOW";
  recentTopic: string | null;
}

export const useWAKTIFocusedConversation = (): FocusedConversationHook => {
  // Track the current WAKTI focus level
  const [focusLevel, setFocusLevel] = useState<"HIGH" | "MEDIUM" | "LOW">("MEDIUM");
  // Track the most recently discussed WAKTI topic
  const [recentTopic, setRecentTopic] = useState<string | null>(null);

  /**
   * Prepare a message with appropriate WAKTI focus context
   */
  const prepareMessageWithContext = (message: string): string => {
    let contextualizedMessage = message;
    
    // Add WAKTI focus level to guide the AI's focus
    contextualizedMessage = `[WAKTI FOCUS LEVEL: ${focusLevel}] ${contextualizedMessage}`;
    
    // If there's a recent topic, include it
    if (recentTopic) {
      contextualizedMessage = `[RECENT WAKTI TOPIC: ${recentTopic}] ${contextualizedMessage}`;
    }
    
    return contextualizedMessage;
  };

  /**
   * Increase WAKTI focus when the conversation relates to WAKTI topics
   */
  const increaseFocus = async (topic?: string): Promise<void> => {
    setFocusLevel("HIGH");
    if (topic) {
      setRecentTopic(topic);
    }
    
    // Reset to medium focus after 5 messages
    setTimeout(() => {
      setFocusLevel("MEDIUM");
    }, 300000); // 5 minutes
  };

  /**
   * Slightly decrease WAKTI focus when the conversation veers away
   */
  const decreaseFocus = async (): Promise<void> => {
    if (focusLevel === "HIGH") {
      setFocusLevel("MEDIUM");
    } else if (focusLevel === "MEDIUM") {
      setFocusLevel("LOW");
    }
    // If already LOW, keep it at LOW
  };
  
  /**
   * Clear the WAKTI focus
   */
  const clearFocus = () => {
    setFocusLevel("MEDIUM");
    setRecentTopic(null);
  };

  return {
    prepareMessageWithContext,
    increaseFocus,
    decreaseFocus,
    clearFocus,
    focusLevel,
    recentTopic,
  };
};
