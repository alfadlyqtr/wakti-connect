
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StaffStatus {
  isStaff: boolean;
  isLoading: boolean;
  staffRelationId: string | null;
  businessId: string | null;
}

export const useStaffStatus = (): StaffStatus => {
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const checkStaffStatus = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsStaff(false);
          setIsLoading(false);
          return;
        }
        
        // Check if the user is a staff member
        const { data, error } = await supabase
          .from('business_staff')
          .select('id, business_id')
          .eq('staff_id', user.id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // No data found error, just means they're not staff
            setIsStaff(false);
          } else {
            console.error("Error checking staff status:", error);
            setIsStaff(false);
          }
        } else {
          setIsStaff(!!data);
          if (data) {
            setStaffRelationId(data.id);
            setBusinessId(data.business_id);
            
            // Store staff status in localStorage for quick access
            localStorage.setItem('isStaff', 'true');
            localStorage.setItem('staffRelationId', data.id);
            localStorage.setItem('staffBusinessId', data.business_id);
          } else {
            localStorage.removeItem('isStaff');
            localStorage.removeItem('staffRelationId');
            localStorage.removeItem('staffBusinessId');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkStaffStatus();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkStaffStatus();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { isStaff, isLoading, staffRelationId, businessId };
};
