
import React from "react";
import { Button } from "@/components/ui/button";

interface TaskClaimButtonProps {
  taskId: string;
  onClaim: () => void;
  disabled?: boolean;
}

// This is a stub component since task claiming functionality has been removed
export const TaskClaimButton: React.FC<TaskClaimButtonProps> = ({
  taskId,
  onClaim,
  disabled = false
}) => {
  return null; // Don't render anything
};
