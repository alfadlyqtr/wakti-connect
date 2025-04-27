import { useState } from 'react';

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, this would contain various AI assistant methods
  
  return { isLoading };
};
