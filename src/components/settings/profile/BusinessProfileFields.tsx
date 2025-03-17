
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";

interface BusinessProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
}

const BusinessProfileFields: React.FC<BusinessProfileFieldsProps> = ({ register }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="displayName">Position</Label>
        <Input 
          id="displayName" 
          placeholder="Account Admin" 
          {...register("display_name")} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input 
          id="businessName" 
          placeholder="Your business name" 
          {...register("business_name")}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Business Description</Label>
        <Textarea
          id="bio"
          className="w-full min-h-[100px]"
          placeholder="Tell us about your business"
          {...register("occupation")}
        />
      </div>
    </>
  );
};

export default BusinessProfileFields;
