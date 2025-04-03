
import { useState, useCallback } from "react";
import { AIMessage } from "@/types/ai-assistant.types";
import { v4 as uuidv4 } from "uuid";

export const useAIMessages = (userName: string = "") => {
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const addUserMessage = useCallback((content: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: uuidv4(),
        role: "user",
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: uuidv4(),
        role: "assistant",
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addSystemMessage = useCallback((content: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: uuidv4(),
        role: "assistant",
        content,
        timestamp: new Date(),
        isSystem: true
      } as AIMessage,
    ]);
  }, []);

  const addErrorMessage = useCallback((error: any) => {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: uuidv4(),
        role: "assistant",
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
        isError: true
      } as AIMessage,
    ]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    addErrorMessage,
    clearMessages,
  };
};
