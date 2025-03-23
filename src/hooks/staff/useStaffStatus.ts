
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";

interface StaffStatusReturn {
  isStaff: boolean;
  staffRelationId: string | null;
  isCoAdmin: boolean;
  isLoading: boolean;
}

export function useStaffStatus(): StaffStatusReturn {
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [staffRelationId, setStaffRelationId] = useState<string | null>(null);
  const [isCoAdmin, setIsCoAdmin] = useState<boolean>(false);
  
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  const { data: staffData, isLoading: isStaffLoading } = useQuery({
    queryKey: ['staffStatus', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Use the dynamic helper to avoid TypeScript issues with the missing table
      const { data, error } = await fromTable('business_staff')
        .select()
        .eq('staff_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) {
        console.error("Error checking staff status:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!user
  });
  
  useEffect(() => {
    if (staffData) {
      setIsStaff(true);
      setStaffRelationId(staffData.id);
      setIsCoAdmin(staffData.role === 'co-admin');
    } else {
      setIsStaff(false);
      setStaffRelationId(null);
      setIsCoAdmin(false);
    }
  }, [staffData]);
  
  return {
    isStaff,
    staffRelationId,
    isCoAdmin,
    isLoading: isUserLoading || isStaffLoading
  };
}
