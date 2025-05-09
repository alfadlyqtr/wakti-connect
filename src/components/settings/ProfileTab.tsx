
import React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ProfileForm from "./profile/ProfileForm";
import BusinessProfileTab from "./profile/BusinessProfileTab";
import { useProfileSettings } from "@/hooks/useProfileSettings";

const ProfileTab = () => {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileSettings();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }
  
  // Render business profile for business accounts
  if (profile?.account_type === 'business') {
    return <BusinessProfileTab />;
  }
  
  // For individual and free accounts
  return (
    <div className="space-y-6">
      <ProfileForm profile={profile} />
    </div>
  );
};

export default ProfileTab;
