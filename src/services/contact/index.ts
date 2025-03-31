
import { supabase } from "@/integrations/supabase/client";

/**
 * Submits a contact form for a business landing page
 * Uses a Supabase Edge Function to handle form submission securely
 */
export async function submitContactForm({
  businessId,
  pageId,
  formData
}: {
  businessId: string;
  pageId: string;
  formData: {
    name: string;
    email: string | null;
    phone: string;
    message: string | null;
  };
}) {
  try {
    const { data, error } = await supabase.functions.invoke('submit-contact-form', {
      body: {
        businessId,
        pageId,
        formData
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}
