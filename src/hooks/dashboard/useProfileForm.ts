
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Form schema for profile
export const profileFormSchema = z.object({
  full_name: z.string().optional(),
  display_name: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }).optional(),
  business_name: z.string().optional().refine(value => {
    // Business name is required for business accounts
    return true; // This will be checked in the onSubmit handler
  }),
  occupation: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface ProfileData {
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

export function useProfileForm(profile: ProfileData | undefined) {
  const queryClient = useQueryClient();
  
  // Setup form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      display_name: profile?.display_name || "",
      business_name: profile?.business_name || "",
      occupation: profile?.occupation || "",
    },
  });

  // Reset form when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
        display_name: profile.display_name || "",
        business_name: profile.business_name || "",
        occupation: profile.occupation || "",
      });
    }
  }, [profile, form]);

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No active session");
      }
      
      // For business accounts, business name is required
      if (profile?.account_type === 'business' && !values.business_name) {
        throw new Error("Business name is required for business accounts");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', session.user.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profileDetails'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['sidebarProfile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    // Business users must have a business name
    if (profile?.account_type === 'business' && !values.business_name) {
      form.setError('business_name', {
        type: 'manual',
        message: 'Business name is required for business accounts',
      });
      return;
    }
    
    updateProfile.mutate(values);
  };

  return {
    form,
    onSubmit,
    updateProfile
  };
}
