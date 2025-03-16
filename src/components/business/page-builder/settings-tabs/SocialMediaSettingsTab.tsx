
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SocialMediaLinks from "../SocialMediaLinks";
import { BusinessSocialLink } from "@/types/business.types";

interface SocialMediaSettingsTabProps {
  socialLinks: BusinessSocialLink[];
  addSocialLink: any;
  updateSocialLink: any;
  deleteSocialLink: any;
}

const SocialMediaSettingsTab: React.FC<SocialMediaSettingsTabProps> = ({
  socialLinks,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Add your social media profiles to display on your business page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialMediaLinks 
          socialLinks={socialLinks || []} 
          onAdd={addSocialLink}
          onUpdate={updateSocialLink}
          onDelete={deleteSocialLink}
        />
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettingsTab;
