
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { slugifyBusinessName } from "@/utils/authUtils";
import { AccountType, UserRole, getEffectiveRole } from "@/types/user";

// Correct ID for the super admin - used for direct comparison to avoid RLS issues
const SUPER_ADMIN_ID = "28e863b3-0a91-4220-8330-fbee7ecd3f96";

export interface DashboardUserProfile {
  account_type: AccountType;
  display_name: string | null;
  business_name: string | null;
  full_name: string | null;
  theme_preference: string | null;
}

export function useDashboardUserProfile() {
  const navigate = useNavigate();
  const [errorLogged, setErrorLogged] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(localStorage.getItem('isSuperAdmin') === 'true');

  // Setup auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed in dashboard layout:", event);
      
      if (event === 'SIGNED_OUT') {
        // Clear stored user role on sign out
        localStorage.removeItem('userRole');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('isSuperAdmin');
        navigate("/auth");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch user profile data for the dashboard
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session found, redirecting to auth page");
          navigate("/auth");
          return null;
        }
        
        // Direct check for hard-coded super admin ID - avoids RLS issues
        if (session.user.id === SUPER_ADMIN_ID) {
          console.log("Hard-coded super admin detected in dashboard profile check");
          setIsSuperAdmin(true);
          localStorage.setItem('isSuperAdmin', 'true');
          localStorage.setItem('userRole', 'super-admin');
          setUserId(session.user.id);

          // Return a minimal profile for the super admin
          return {
            account_type: 'business' as AccountType, // Map to business for UI compatibility
            display_name: 'System Administrator',
            business_name: 'WAKTI Administration',
            full_name: 'System Administrator',
            theme_preference: 'dark'
          };
        }

        // Attempt to use RPC function to check super admin status
        let isUserSuperAdmin = false;
        try {
          const { data: isSuperAdminResult, error: rpcError } = await supabase.rpc('is_super_admin');
          
          if (!rpcError && isSuperAdminResult === true) {
            console.log("RPC confirmed user is super admin");
            isUserSuperAdmin = true;
          }
        } catch (rpcError) {
          console.error("Error checking super admin status via RPC:", rpcError);
          // Fall back to localStorage if RPC fails
          isUserSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
        }
        
        if (isUserSuperAdmin) {
          console.log("User confirmed as super admin in dashboard profile check");
          setIsSuperAdmin(true);
          localStorage.setItem('isSuperAdmin', 'true');
          localStorage.setItem('userRole', 'super-admin');
          setUserId(session.user.id);

          // Return a minimal profile for the super admin
          return {
            account_type: 'business' as AccountType, // Map to business for UI compatibility
            display_name: 'System Administrator',
            business_name: 'WAKTI Administration',
            full_name: 'System Administrator',
            theme_preference: 'dark'
          };
        } else {
          setIsSuperAdmin(false);
          localStorage.setItem('isSuperAdmin', 'false');
        }
        
        // Store userId for StaffDashboardHeader
        setUserId(session.user.id);
        
        // Get user profile data first to determine primary account type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('account_type, display_name, business_name, full_name, theme_preference')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          // Handle profile error later in code
        } else {
          console.log("Profile fetched successfully:", profileData);
        }
        
        // Check if user is staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', session.user.id)
          .maybeSingle();
          
        if (staffData) {
          console.log("User identified as staff member");
          setIsStaff(true);
          localStorage.setItem('isStaff', 'true');
        } else {
          console.log("User is not a staff member");
          setIsStaff(false);
          localStorage.setItem('isStaff', 'false');
        }
        
        // Handle profile error from earlier
        if (profileError) {
          if (profileError.code === 'PGRST116' && !errorLogged) {
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
                return newProfileData as DashboardUserProfile;
              }
            } catch (createError) {
              console.error("Failed to create profile:", createError);
            }
          }
          return null;
        }
        
        // Set userRole based on account_type and staff status - IMPORTANT, use our helper
        const effectiveRole = getEffectiveRole(
          profileData?.account_type as AccountType, 
          !!staffData,
          isSuperAdmin
        );
        
        // Store role in localStorage for components that need it
        localStorage.setItem('userRole', effectiveRole);
        
        if (profileData?.account_type === 'business' && !profileData.business_name) {
          // If business account but no business name is set, inform the user
          toast({
            title: "Complete your business profile",
            description: "Please set your business name in your profile settings",
            action: (
              <button 
                className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                onClick={() => navigate("/dashboard/settings")}
              >
                Update Profile
              </button>
            )
          });
        }
        
        return profileData as DashboardUserProfile;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    retry: 1, // Reduce retries to avoid unnecessary flickering
    retryDelay: 500,
  });

  // Set theme based on user preference
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

  // Determine effective user role using our helper
  const userRole = getEffectiveRole(
    profileData?.account_type as AccountType, 
    isStaff,
    isSuperAdmin
  );

  return {
    profileData,
    profileLoading,
    userId,
    isStaff,
    userRole,
    isSuperAdmin,
    businessSlug: profileData?.business_name ? slugifyBusinessName(profileData.business_name) : undefined
  };
}
