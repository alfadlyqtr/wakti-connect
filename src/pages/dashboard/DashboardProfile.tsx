
import React, { useState, useEffect } from "react";
import ProfileHeader from "@/components/dashboard/profile/ProfileHeader";
import ProfileDetailsCard from "@/components/dashboard/profile/ProfileDetailsCard";
import AccountDetailsCard from "@/components/dashboard/profile/AccountDetailsCard";
import LoadingState from "@/components/dashboard/profile/LoadingState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfileForm, ProfileData } from "@/hooks/dashboard/useProfileForm";
import { toast } from "@/hooks/use-toast";

const DashboardProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profileDetails'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      return data as ProfileData;
    },
  });

  // Setup form and mutation hooks
  const { form, onSubmit, updateProfile } = useProfileForm(profile);

  // If this is a business account and the business name isn't set, auto-open edit mode
  useEffect(() => {
    if (profile?.account_type === 'business' && !profile?.business_name && !isEditing) {
      setIsEditing(true);
      toast({
        title: "Complete your business profile",
        description: "Please add your business name",
      });
    }
  }, [profile, isEditing]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <ProfileHeader isLoading={isLoading} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Details Card */}
        <ProfileDetailsCard 
          profile={profile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          form={form}
          onSubmit={onSubmit}
          updateProfile={updateProfile}
        />

        {/* Account Details Card */}
        <AccountDetailsCard profile={profile} />
      </div>
    </div>
  );
};

export default DashboardProfile;
