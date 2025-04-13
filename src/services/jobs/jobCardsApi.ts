import { supabase } from "@/integrations/supabase/client";
import { JobCard, JobCardFormData, PaymentMethod, Job } from "@/types/jobs.types";

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
  
  // Map 'jobs' field to 'job' and handle type conversion properly
  return data.map(card => {
    // Create a properly typed job object with defaults for missing fields
    const jobData = card.jobs ? {
      ...card.jobs,
      business_id: '', // Add missing required field
      created_at: '', // Add missing required field
      updated_at: ''  // Add missing required field
    } as Job : undefined;
    
    // Create a properly typed job card object
    const jobCard: JobCard = {
      ...card,
      job: jobData,
      payment_method: ensurePaymentMethodType(card.payment_method)
    };
    
    // Remove the 'jobs' property to avoid duplication
    delete (jobCard as any).jobs;
    
    return jobCard;
  });
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
  
  // Create a properly typed JobCard object
  const jobCard: JobCard = {
    ...data,
    job: data.jobs ? {
      ...data.jobs,
      business_id: '', // Add missing required field
      created_at: '', // Add missing required field
      updated_at: ''  // Add missing required field
    } as Job : undefined,
    payment_method: ensurePaymentMethodType(data.payment_method)
  };
  
  // Remove the 'jobs' property to avoid duplication
  delete (jobCard as any).jobs;
  
  // Send notification to business owner about new job card
  import('./notificationService').then(({ sendJobCardNotification }) => {
    sendJobCardNotification(jobCard.id, 'created')
      .catch(err => console.error("Error sending job card creation notification:", err));
  });
  
  return jobCard;
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
  
  // Fetch the updated job card
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
  
  // Create a properly typed Job object with defaults for missing fields
  const jobData = data.jobs ? {
    ...data.jobs,
    business_id: '', // Add missing required field
    created_at: '', // Add missing required field
    updated_at: ''  // Add missing required field
  } as Job : undefined;
  
  // Create a properly typed JobCard object
  const jobCard: JobCard = {
    ...data,
    job: jobData,
    payment_method: ensurePaymentMethodType(data.payment_method)
  };
  
  // Remove the 'jobs' property to avoid duplication
  delete (jobCard as any).jobs;
  
  // Send notification to business owner about completed job card
  import('./notificationService').then(({ sendJobCardNotification }) => {
    sendJobCardNotification(jobCard.id, 'completed')
      .catch(err => console.error("Error sending job completion notification:", err));
  });
  
  return jobCard;
};
