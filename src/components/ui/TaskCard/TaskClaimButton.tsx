
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface TaskClaimButtonProps {
  taskId: string;
  refetch: () => void;
}

export const TaskClaimButton: React.FC<TaskClaimButtonProps> = ({
  taskId,
  refetch,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimTask = async () => {
    try {
      setIsClaiming(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("You must be logged in to claim tasks");
      }
      
      // Update the task assignee
      const { error } = await supabase
        .from('tasks')
        .update({ assignee_id: session.user.id })
        .eq('id', taskId);
        
      if (error) throw error;
      
      // Create a notification for the business owner
      const { data: taskData } = await supabase
        .from('tasks')
        .select('user_id, title')
        .eq('id', taskId)
        .single();
        
      if (taskData) {
        await supabase.from('notifications').insert({
          user_id: taskData.user_id,
          type: 'task_claimed',
          content: `A staff member has claimed the task: ${taskData.title}`,
          related_id: taskId
        });
      }
      
      toast({
        title: "Task claimed",
        description: "You have successfully claimed this task",
        variant: "success"
      });
      
      // Refetch to update the UI
      refetch();
    } catch (error) {
      console.error("Error claiming task:", error);
      toast({
        title: "Failed to claim task",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleClaimTask}
        disabled={isClaiming}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        {isClaiming ? "Claiming..." : "Claim this task"}
      </Button>
    </div>
  );
};
