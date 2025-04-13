
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { toast } from '@/components/ui/use-toast';

interface SendToTaskButtonProps {
  summary: string;
}

const SendToTaskButton: React.FC<SendToTaskButtonProps> = ({ summary }) => {
  const { sendMessage } = useAIAssistant();
  
  const handleCreateTask = async () => {
    if (!summary) return;
    
    try {
      // Prepare a message to the AI to create a task from the summary
      const taskPrompt = `Create a task based on this meeting summary: ${summary.substring(0, 500)}${summary.length > 500 ? '...' : ''}`;
      
      await sendMessage(taskPrompt);
      
      toast({
        title: "Sent to AI Assistant",
        description: "Your meeting summary has been sent to the AI to create a task."
      });
    } catch (error) {
      console.error("Error creating task from summary:", error);
      toast({
        title: "Error",
        description: "Could not create task from summary",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleCreateTask}
      disabled={!summary}
      className="h-8"
    >
      <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
      Create Task
    </Button>
  );
};

export default SendToTaskButton;
