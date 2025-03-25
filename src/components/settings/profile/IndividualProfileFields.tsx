
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { Separator } from "@/components/ui/separator";
import { Briefcase } from "lucide-react";

interface IndividualProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
  errors?: FieldErrors<ProfileFormData>;
}

const IndividualProfileFields: React.FC<IndividualProfileFieldsProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-wakti-blue" />
          <h3 className="text-lg font-medium">Professional Information</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Tell us about your professional background
        </p>
      </div>
      
      <Separator className="bg-gray-200" />
      
      <div className="space-y-2">
        <Label htmlFor="occupation" className="font-medium">Occupation</Label>
        <Input 
          id="occupation" 
          placeholder="Your job title or profession" 
          className="border-gray-300 focus-visible:ring-wakti-blue"
          {...register("occupation")} 
        />
        {errors?.occupation && (
          <p className="text-sm font-medium text-destructive">{errors.occupation.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="business_address" className="font-medium">About Me</Label>
        <Textarea 
          id="business_address" 
          placeholder="Tell us about yourself, your skills and expertise"
          className="min-h-[100px] border-gray-300 focus-visible:ring-wakti-blue" 
          {...register("business_address")} 
        />
      </div>
    </div>
  );
};

export default IndividualProfileFields;
