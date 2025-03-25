
import { supabase } from "@/integrations/supabase/client";
import { JobCard, JobCardFormData, PaymentMethod } from "@/types/jobs.types";

/**
 * Ensure payment method is properly typed
 */
export const ensurePaymentMethodType = (method: string): PaymentMethod => {
  if (method === 'cash' || method === 'pos' || method === 'none') {
    return method as PaymentMethod;
  }
  return 'none';
};

/**
 * Fetch job cards, optionally filtered by staff relation ID
 */
export const fetchJobCards = async (staffRelationId?: string): Promise<JobCard[]> => {
  console.log("Fetching job cards with staff relation ID:", staffRelationId);
  
  let query = supabase
    .from('job_cards')
    .select(`
      *,
      jobs:job_id (
        id,
        name,
        description,
        duration,
        default_price
      )
    `);
    
  if (staffRelationId) {
    query = query.eq('staff_relation_id', staffRelationId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching job cards:", error);
    throw new Error(`Error fetching job cards: ${error.message}`);
  }
  
  // Add debugging to inspect job data from API
  console.log("Received job cards data:", data);
  console.log("Job relation data:", data.map(card => ({
    id: card.id,
    job_id: card.job_id,
    joined_job: card.jobs,
    has_job_data: !!card.jobs
  })));
  
  // Ensure payment_method is properly typed
  return data.map(card => ({
    ...card,
    payment_method: ensurePaymentMethodType(card.payment_method)
  })) as JobCard[];
};

/**
 * Create a new job card
 */
export const createJobCard = async (
  staffRelationId: string, 
  jobCardData: JobCardFormData
): Promise<JobCard> => {
  console.log("Creating job card with data:", jobCardData);
  
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('job_cards')
    .insert([{
      staff_relation_id: staffRelationId,
      job_id: jobCardData.job_id,
      start_time: now,
      payment_method: jobCardData.payment_method,
      payment_amount: jobCardData.payment_amount,
      notes: jobCardData.notes
    }])
    .select(`
      *,
      jobs:job_id (
        id,
        name,
        description,
        duration,
        default_price
      )
    `)
    .single();
    
  if (error) {
    console.error("Error creating job card:", error);
    throw new Error(`Error creating job card: ${error.message}`);
  }
  
  console.log("Created job card:", data);
  console.log("Created job with relation data:", {
    id: data.id,
    job_id: data.job_id,
    joined_job: data.jobs,
    has_job_data: !!data.jobs
  });
  
  // Type cast the payment_method to ensure it's the correct type
  return {
    ...data,
    payment_method: ensurePaymentMethodType(data.payment_method)
  } as JobCard;
};

/**
 * Mark a job card as completed
 */
export const completeJobCard = async (jobCardId: string): Promise<JobCard> => {
  console.log("Completing job card:", jobCardId);
  
  const now = new Date().toISOString();
  
  // Use the database function for completing the job card
  const { data: success, error: rpcError } = await supabase.rpc(
    'complete_job_card',
    {
      job_card_id: jobCardId,
      end_timestamp: now
    }
  );
  
  if (rpcError) {
    console.error("Error completing job card:", rpcError);
    throw new Error(`Error completing job card: ${rpcError.message}`);
  }
  
  if (!success) {
    throw new Error('Job card not found or already completed');
  }
  
  // Fetch the updated job card - ensure we get the jobs relation
  const { data, error } = await supabase
    .from('job_cards')
    .select(`
      *,
      jobs:job_id (
        id,
        name,
        description,
        duration,
        default_price
      )
    `)
    .eq('id', jobCardId)
    .maybeSingle();
    
  if (error) throw new Error(`Error fetching completed job card: ${error.message}`);
  if (!data) throw new Error(`Job card with ID ${jobCardId} not found after completion`);
  
  console.log("Completed job card data:", data);
  console.log("Completed job relation data:", {
    id: data.id,
    job_id: data.job_id,
    joined_job: data.jobs,
    has_job_data: !!data.jobs
  });
  
  // Type cast the payment_method to ensure it's the correct type
  return {
    ...data,
    payment_method: ensurePaymentMethodType(data.payment_method)
  } as JobCard;
};
