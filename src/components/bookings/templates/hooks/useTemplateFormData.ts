
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service.types";
import { StaffMember } from "@/types/staff";

export function useTemplateFormData() {
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch services and staff on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('business_services')
          .select('*')
          .order('name');
          
        if (servicesError) throw servicesError;
        
        // Fetch staff
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id, staff_id, business_id, name, role, is_service_provider')
          .eq('is_service_provider', true)
          .eq('status', 'active')
          .order('name');
          
        if (staffError) throw staffError;
        
        setServices(servicesData || []);
        setStaff(staffData as StaffMember[] || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  return {
    services,
    staff,
    isLoadingData
  };
}
