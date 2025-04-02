
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StaffFormSchema, StaffFormValues } from "../StaffFormSchema";
import { useCreateStaffMutation } from "@/hooks/staff/creation/createStaffMutation";
import { useUpdateStaffMutation } from "@/hooks/staff/creation/updateStaffMutation";
import { supabase } from "@/integrations/supabase/client";
import { getAutoAddStaffSetting } from "@/services/contacts/contactSync";

export const useStaffDialog = (
  staffId: string | null, 
  onSuccess: () => void,
  onClose: (open: boolean) => void
) => {
  const [activeTab, setActiveTab] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoAddToContacts, setAutoAddToContacts] = useState(true);
  
  const isEditing = !!staffId;
  
  const createStaff = useCreateStaffMutation();
  const updateStaff = useUpdateStaffMutation();
  
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(StaffFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: "",
      isCoAdmin: false,
      isServiceProvider: false,
      permissions: {
        can_manage_tasks: false,
        can_manage_bookings: false, 
        can_track_hours: true,
        can_log_earnings: false,
        can_view_analytics: false
      },
      addToContacts: true
    }
  });
  
  // Load staff data when editing
  useEffect(() => {
    const loadStaffData = async () => {
      if (!staffId) return;
      
      try {
        const { data, error } = await supabase
          .from('business_staff')
          .select('*')
          .eq('id', staffId)
          .single();
          
        if (error) throw error;
        if (!data) throw new Error("Staff not found");
        
        form.reset({
          fullName: data.name,
          position: data.position || "",
          isCoAdmin: data.role === "co-admin",
          isServiceProvider: data.is_service_provider || false,
          permissions: data.permissions || {
            can_manage_tasks: false,
            can_manage_bookings: false, 
            can_track_hours: true,
            can_log_earnings: false,
            can_view_analytics: false
          },
          addToContacts: true
        });
      } catch (error) {
        console.error("Error loading staff data:", error);
        setError("Failed to load staff data. Please try again.");
      }
    };
    
    // Check user's auto-add staff setting
    const checkAutoAddSetting = async () => {
      try {
        const autoAdd = await getAutoAddStaffSetting();
        setAutoAddToContacts(autoAdd);
        form.setValue("addToContacts", autoAdd);
      } catch (error) {
        console.error("Error fetching auto-add staff setting:", error);
      }
    };
    
    loadStaffData();
    checkAutoAddSetting();
  }, [staffId, form]);
  
  const handleSubmit = async (values: StaffFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditing) {
        const result = await updateStaff.mutateAsync({
          staffId,
          data: {
            ...values,
            addToContacts: values.addToContacts
          }
        });
        
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || "Failed to update staff");
        }
      } else {
        const result = await createStaff.mutateAsync({
          ...values,
          addToContacts: values.addToContacts 
        });
        
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || "Failed to create staff");
        }
      }
    } catch (error) {
      console.error("Error submitting staff form:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    isEditing,
    activeTab,
    setActiveTab,
    handleSubmit,
    error,
    autoAddToContacts,
    setAutoAddToContacts
  };
};
