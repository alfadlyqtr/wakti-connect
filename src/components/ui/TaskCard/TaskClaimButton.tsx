
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
      
      // Simulating the claim action, but actually not doing anything
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Task assignment disabled",
        description: "Task assignment functionality is currently disabled",
        variant: "default"
      });
      
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
        className="w-full opacity-50" 
        onClick={handleClaimTask}
        disabled={isClaiming}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        {isClaiming ? "Claiming..." : "Claim this task (Disabled)"}
      </Button>
    </div>
  );
};
