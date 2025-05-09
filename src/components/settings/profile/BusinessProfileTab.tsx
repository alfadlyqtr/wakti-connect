
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import SimpleBusinessProfileForm from "./SimpleBusinessProfileForm";
import { Building2 } from "lucide-react";

const BusinessProfileTab = () => {
  const { data: profile, isLoading } = useProfileSettings();
  
  if (isLoading) {
    return (
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Loading profile information...</CardDescription>
        </CardHeader>
        <div className="flex justify-center py-6">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </div>
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
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="px-4 sm:px-6 pb-4 bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>
              Manage all your business information in one place
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <SimpleBusinessProfileForm profile={profile} />
    </Card>
  );
};

export default BusinessProfileTab;
