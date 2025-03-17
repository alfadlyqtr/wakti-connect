
import React from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useProfileForm } from "@/hooks/useProfileForm";
import BusinessProfileFields from "./BusinessProfileFields";
import IndividualProfileFields from "./IndividualProfileFields";

interface ProfileFormProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    isSubmitting,
    isBusinessAccount
  } = useProfileForm(profile);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {isBusinessAccount ? (
          <BusinessProfileFields register={register} />
        ) : (
          <IndividualProfileFields register={register} />
        )}
        
        <Button 
          type="submit"
          className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (isBusinessAccount ? "Save Business Info" : "Save Profile")}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
