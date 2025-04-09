
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  return (
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Creating Account...</span>
        </div>
      ) : (
        <span>Create Account</span>
      )}
    </Button>
  );
};

export default SubmitButton;
