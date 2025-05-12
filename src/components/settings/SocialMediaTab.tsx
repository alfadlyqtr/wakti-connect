
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileSettings } from "@/hooks/useProfileSettings";
import SocialMediaForm from "@/components/settings/profile/SocialMediaForm";
import { Share2 } from "lucide-react";

const SocialMediaTab = () => {
  const { data: profile, isLoading, error } = useProfileSettings();
  
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Loading social media information...</CardDescription>
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
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            {error ? "Error loading social media information" : "No business information found"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-wakti-blue/5 to-wakti-blue/10">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-wakti-blue" />
          <div>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Connect your business to social platforms</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <SocialMediaForm businessId={profile.id} />
      </CardContent>
    </Card>
  );
};

export default SocialMediaTab;
