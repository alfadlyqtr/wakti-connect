
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { User } from "lucide-react";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import { useStaffPermissions } from "@/hooks/useStaffPermissions";
import ProfileForm from "./profile/ProfileForm";
import BusinessProfileInfo from "./profile/BusinessProfileInfo";
import { Separator } from "@/components/ui/separator";

const BusinessProfileTab: React.FC = () => {
  const { data: profile, isLoading } = useProfileSettings();
  const { isStaff } = useStaffPermissions();
  
  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Business Profile</CardTitle>
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
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Could not load profile. Please refresh the page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-wakti-blue" />
              <div>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>
                  {isStaff 
                    ? "View business information" 
                    : "Manage your business information and contact details"}
                </CardDescription>
              </div>
            </div>
            <span className="text-xs bg-wakti-blue/10 text-wakti-blue px-3 py-1 rounded-full font-medium">
              Business Account
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-4 sm:px-6 pt-4">
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
      
      {!isStaff && (
        <BusinessProfileInfo profile={profile} />
      )}
    </div>
  );
};

export default BusinessProfileTab;
