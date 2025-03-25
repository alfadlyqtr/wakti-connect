
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";

interface IndividualProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  errors?: FieldErrors<ProfileFormData>;
}

const IndividualProfileFields: React.FC<IndividualProfileFieldsProps> = ({ register, errors }) => {
  // Individual profile fields can be added here if needed
  return null;
};

export default IndividualProfileFields;
