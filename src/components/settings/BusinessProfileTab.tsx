
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import ProfileForm from "@/components/settings/profile/ProfileForm";
import BusinessProfileInfo from "@/components/settings/profile/BusinessProfileInfo";
import { Building, Users } from "lucide-react";

const BusinessProfileTab = () => {
  const { data: profile, isLoading, error } = useProfileSettings();
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Loading business information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !profile) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>
            {error ? "Error loading business information" : "No business information found"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Business Profile Info Card */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-wakti-blue" />
            <div>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Manage your business details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <BusinessProfileInfo profile={profile} />
        </CardContent>
      </Card>
      
      {/* Business Profile Form Card */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-wakti-blue" />
            <div>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your business profile information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfileTab;
