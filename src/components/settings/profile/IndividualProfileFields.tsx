
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { ProfileFormData } from "@/hooks/useProfileForm";
import { Separator } from "@/components/ui/separator";
import { Briefcase } from "lucide-react";

interface IndividualProfileFieldsProps {
  register: UseFormRegister<ProfileFormData>;
}

const IndividualProfileFields: React.FC<IndividualProfileFieldsProps> = ({ register }) => {
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
      
      <Separator />
      
      <div className="space-y-2">
        <Label htmlFor="occupation" className="font-medium">Occupation / Profession</Label>
        <Textarea
          id="occupation"
          className="w-full min-h-[120px]"
          placeholder="Tell us about what you do"
          {...register("occupation")}
        />
      </div>
    </div>
  );
};

export default IndividualProfileFields;
