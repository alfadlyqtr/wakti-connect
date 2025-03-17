
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";

interface IndividualProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
}

const IndividualProfileFields: React.FC<IndividualProfileFieldsProps> = ({ register }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="displayName">Username</Label>
        <Input 
          id="displayName" 
          placeholder="Username" 
          {...register("display_name")} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          className="w-full min-h-[100px]"
          placeholder="Tell us about yourself"
          {...register("occupation")}
        />
      </div>
    </>
  );
};

export default IndividualProfileFields;
