
import React from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useProfileForm } from "@/hooks/useProfileForm";
import BusinessProfileFields from "./BusinessProfileFields";
import IndividualProfileFields from "./IndividualProfileFields";
import CommonProfileFields from "./CommonProfileFields";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormProvider } from "react-hook-form";

interface ProfileFormProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile }) => {
  const { isStaff, canEditProfile, canEditTheme, canEditBasicInfo, isLoading } = useStaffPermissions();
  
  const {
    form,
    onSubmit,
    isSubmitting,
    isBusinessAccount,
    watch,
    errors,
  } = useProfileForm(profile, { canEdit: !isStaff, isStaff });
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-4">
      <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
    </div>;
  }
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {isStaff && (
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Staff members can only view profile information. Profile editing is restricted.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Common fields for all account types */}
          <CommonProfileFields 
            watch={watch} 
            errors={errors} 
            readOnly={isStaff}
            canEditBasicInfo={canEditBasicInfo}
          />
          
          {/* Account type specific fields */}
          {isBusinessAccount ? (
            <BusinessProfileFields 
              watch={watch} 
              errors={errors} 
              readOnly={isStaff} 
            />
          ) : (
            <IndividualProfileFields 
              errors={errors} 
              readOnly={isStaff} 
            />
          )}
          
          <Button 
            type="submit"
            className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
            disabled={isSubmitting || isStaff}
          >
            {isSubmitting ? "Saving..." : (isBusinessAccount ? "Save Business Info" : "Save Profile")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProfileForm;
