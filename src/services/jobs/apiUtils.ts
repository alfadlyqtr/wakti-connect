
import { supabase } from "@/integrations/supabase/client";
import { PaymentMethod } from "@/types/job.types";

/**
 * Utility to check if user is a staff member
 */
export const fetchStaffRelation = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from('business_staff')
    .select('id, business_id')
    .eq('staff_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  
  if (error) throw new Error(`Error fetching staff relation: ${error.message}`);
  return data;
};

/**
 * Ensure payment method is properly typed from database
 */
export const ensurePaymentMethodType = (paymentMethod: string): PaymentMethod => {
  return paymentMethod as PaymentMethod;
};
