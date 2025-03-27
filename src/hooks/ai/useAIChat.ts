
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserProfile } from "./utils/aiUtils";
import { useAIChatOperations } from "./operations/useAIChatOperations";

export const useAIChat = () => {
  const { user } = useAuth();
  const [userFirstName, setUserFirstName] = useState<string>("");
  
  // Fetch user's name for personalized greetings
  useEffect(() => {
    if (user) {
      const getUserProfile = async () => {
        const { firstName } = await fetchUserProfile(user.id);
        setUserFirstName(firstName);
      };
      
      getUserProfile();
    }
  }, [user]);

  const { messages, sendMessage, clearMessages } = useAIChatOperations(
    user?.id,
    userFirstName
  );

  return {
    messages,
    sendMessage,
    isLoading: sendMessage.isPending,
    clearMessages,
  };
};
