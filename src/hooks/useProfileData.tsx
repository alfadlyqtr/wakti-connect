
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface ProfileData {
  account_type: "free" | "individual" | "business";
  display_name: string | null;
  business_name: string | null;
  full_name: string | null;
  theme_preference: string | null;
}

export const useProfileData = () => {
  const navigate = useNavigate();
  const [errorLogged, setErrorLogged] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session found, redirecting to auth page");
          navigate("/auth");
          return null;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('account_type, display_name, business_name, full_name, theme_preference')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          if (error.code === 'PGRST116' && !errorLogged) {
            console.log("Profile not found, user may need to sign up");
            setErrorLogged(true);
            
            // Try to create a profile for this user if it doesn't exist
            try {
              const { data: newProfileData, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  full_name: session.user.email?.split('@')[0] || 'User',
                  display_name: session.user.email?.split('@')[0] || 'User',
                  account_type: 'free'
                })
                .select()
                .single();
                
              if (createError) {
                console.error("Error creating profile:", createError);
              } else {
                console.log("Created new profile:", newProfileData);
                return newProfileData as ProfileData;
              }
            } catch (createError) {
              console.error("Failed to create profile:", createError);
            }
          }
          return null;
        }
        
        // Store user role in localStorage for use in other components
        if (data?.account_type) {
          localStorage.setItem('userRole', data.account_type);
        }
        
        if (data?.account_type === 'business' && !data.business_name) {
          // If business account but no business name is set, inform the user
          toast({
            title: "Complete your business profile",
            description: "Please set your business name in your profile settings",
            action: {
              label: "Update Profile",
              onClick: () => navigate("/dashboard/settings")
            }
          });
        }
        
        return data as ProfileData;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  return { profileData, isLoading };
};
