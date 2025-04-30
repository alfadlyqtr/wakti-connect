
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FormHeaderProps {
  isEdit: boolean;
  onCancel?: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEdit, onCancel }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{isEdit ? 'Edit Event' : 'Create Event'}</CardTitle>
      {onCancel && (
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </CardHeader>
  );
};

export default FormHeader;
