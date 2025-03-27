
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileAvatarSection from "./ProfileAvatarSection";
import ProfileForm from "./ProfileForm";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Form schema for profile
const profileFormSchema = z.object({
  full_name: z.string().optional(),
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }).optional(),
  business_name: z.string().optional(),
  occupation: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileData {
  id: string;
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  occupation: string | null;
  account_type: "free" | "individual" | "business";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_searchable: boolean | null;
  theme_preference: string | null;
}

interface ProfileDetailsCardProps {
  profile: ProfileData | undefined;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => void;
  updateProfile: {
    isPending: boolean;
  };
}

const ProfileDetailsCard: React.FC<ProfileDetailsCardProps> = ({
  profile,
  isEditing,
  setIsEditing,
  form,
  onSubmit,
  updateProfile
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileAvatarSection profile={profile} />
        <ProfileForm
          form={form}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSubmit={onSubmit}
          profile={profile}
          updateProfile={updateProfile}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileDetailsCard;
