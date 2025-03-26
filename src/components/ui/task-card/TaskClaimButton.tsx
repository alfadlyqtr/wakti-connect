
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2Icon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface TaskClaimButtonProps {
  taskId: string;
  delegatedEmail: string;
  refetch?: () => void;
}

export const TaskClaimButton: React.FC<TaskClaimButtonProps> = ({
  taskId,
  delegatedEmail,
  refetch
}) => {
  const [isClaimingTask, setIsClaimingTask] = useState(false);
  
  const handleClaimTask = async () => {
    try {
      setIsClaimingTask(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to claim tasks",
          variant: "destructive"
        });
        return;
      }
      
      const { claimDelegatedTask } = await import('@/services/task/claimDelegatedTask');
      
      const success = await claimDelegatedTask(taskId);
      
      if (success) {
        toast({
          title: "Task claimed successfully",
          description: "This task is now assigned to you"
        });
        
        if (typeof refetch === 'function') {
          refetch();
        } else {
          setTimeout(() => window.location.reload(), 500);
        }
      }
    } catch (error) {
      console.error("Error claiming task:", error);
      toast({
        title: "Failed to claim task",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsClaimingTask(false);
    }
  };

  return (
    <div className="mt-3 mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full border-dashed border-blue-300 text-blue-500 hover:text-blue-700"
        onClick={handleClaimTask}
        disabled={isClaimingTask}
      >
        {isClaimingTask ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Claiming Task...
          </>
        ) : (
          <>
            <CheckCircle2Icon className="mr-2 h-4 w-4" /> 
            Claim This Task
          </>
        )}
      </Button>
    </div>
  );
};
