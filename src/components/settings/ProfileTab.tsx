
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import useIsMobile from "@/hooks/use-mobile";
import ProfileAvatar from "./profile/ProfileAvatar";
import ProfileForm from "./profile/ProfileForm";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import ThemeToggle from "./profile/ThemeToggle";
import FeedbackForm from "./profile/FeedbackForm";

interface ProfileTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile: propProfile }) => {
  const isMobile = useIsMobile();
  const { data: fetchedProfile, isLoading } = useProfileSettings();
  
  // Use either the provided profile or the fetched one
  const profile = propProfile || fetchedProfile;
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Could not load profile. Please refresh the page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const isBusinessAccount = profile.account_type === 'business';
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isBusinessAccount ? "Business Profile" : "Profile Information"}</CardTitle>
              <CardDescription>
                {isBusinessAccount
                  ? "Manage your business profile information"
                  : "Update your public profile information"}
              </CardDescription>
            </div>
            {isBusinessAccount && (
              <span className="text-xs bg-wakti-blue/10 text-wakti-blue px-2 py-1 rounded-full">
                Business Account
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-4 sm:px-6">
          <div className={`${isMobile ? 'flex flex-col' : 'flex items-center'} gap-4 mb-5`}>
            <ProfileAvatar profile={profile} />
          </div>
          
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Appearance Settings</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ThemeToggle initialTheme={profile.theme_preference || 'light'} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Feedback</CardTitle>
          <CardDescription>Share your thoughts with us</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <FeedbackForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
