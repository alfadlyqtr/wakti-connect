
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FormHeaderProps {
  isEdit: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEdit, isLoading, onCancel }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{isEdit ? 'Edit Event' : 'Create Event'}</CardTitle>
      {onCancel && (
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      )}
    </CardHeader>
  );
};

export default FormHeader;
