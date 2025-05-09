
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import useIsMobile from "@/hooks/use-mobile";
import ProfileAvatar from "./profile/ProfileAvatar";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import ThemeToggle from "./profile/ThemeToggle";
import FeedbackForm from "./profile/FeedbackForm";
import { Palette, MessageSquare, UserCog } from "lucide-react";
import AccountInfoForm from "./account/AccountInfoForm";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";

interface ProfileTabProps {
  profile?: (Tables<"profiles"> & {
    email?: string;
  });
}

const ProfileTab: React.FC<ProfileTabProps> = ({ profile: propProfile }) => {
  const isMobile = useIsMobile();
  const { data: fetchedProfile, isLoading } = useProfileSettings();
  const { isStaff } = useStaffPermissions();
  
  // Use either the provided profile or the fetched one
  const profile = propProfile || fetchedProfile;
  
  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Loading account information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Could not load profile. Please refresh the page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Account Information Section - First card */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-wakti-blue" />
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                {isStaff ? "View your account settings" : "Manage your account settings and personal details"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pt-4">
          <div className={`${isMobile ? 'flex flex-col' : 'flex items-center'} gap-4 mb-5`}>
            <ProfileAvatar profile={profile} />
          </div>
          <AccountInfoForm profile={profile} />
        </CardContent>
      </Card>
      
      {/* Theme Toggle Section - Second card */}
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-wakti-blue" />
            <div>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Choose your preferred theme</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pt-4">
          <ThemeToggle initialTheme={profile.theme_preference || 'light'} />
        </CardContent>
      </Card>
      
      {/* Feedback Section - Last card - Hide for staff users */}
      {!isStaff && (
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-wakti-blue" />
              <div>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>Share your thoughts with us</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pt-4">
            <FeedbackForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileTab;
