
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/types/jobs.types";
import { ensurePaymentMethodType } from "./jobCardsApi";

/**
 * Fetch job cards with detailed information for reporting
 */
export const fetchJobCardsWithDetails = async (
  staffRelationId: string,
  startDate?: string
): Promise<JobCard[]> => {
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
      ),
      business_staff:staff_relation_id (
        id,
        name
      )
    `);
  
  // Apply staff relation filter if provided
  if (staffRelationId) {
    query = query.eq('staff_relation_id', staffRelationId);
  }
  
  // Apply date filter if provided
  if (startDate) {
    query = query.gte('start_time', startDate);
  }
  
  // Order by most recent first
  query = query.order('start_time', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching job cards for reporting:", error);
    throw new Error(`Error fetching job cards for reporting: ${error.message}`);
  }
  
  // Process and map the data
  return data.map(card => {
    // Extract job information
    const jobData = card.jobs || undefined;
    
    // Extract staff name for reporting - with proper type guards for null safety
    let staffName = "Unknown Staff";
    
    // Use a type guard function to check if business_staff exists and has the right structure
    const hasValidStaffData = (
      staff: any
    ): staff is { id: string; name: string } => {
      return (
        staff !== null &&
        typeof staff === 'object' &&
        staff !== undefined &&
        'name' in staff &&
        typeof staff.name === 'string'
      );
    };
    
    // Apply the type guard
    if (hasValidStaffData(card.business_staff)) {
      staffName = card.business_staff.name;
    }
    
    // Create a properly typed JobCard object
    const jobCard: JobCard = {
      ...card,
      job: jobData ? {
        ...jobData,
        business_id: '', // Add required fields that might be missing
        created_at: '',
        updated_at: ''
      } : undefined,
      staff_name: staffName,
      payment_method: ensurePaymentMethodType(card.payment_method)
    };
    
    // Remove unnecessary nested data
    delete (jobCard as any).jobs;
    delete (jobCard as any).business_staff;
    
    return jobCard;
  });
};

/**
 * Fetch staff performance summary for a business
 */
export const fetchStaffPerformanceSummary = async (businessId: string, timeRange: string = 'month') => {
  try {
    // This would be a more complex query in a real application
    // It would aggregate job cards by staff member and calculate performance metrics
    
    // For now, we're returning placeholder data
    return {
      staffMetrics: [],
      timeRange,
      totalJobs: 0,
      totalEarnings: 0
    };
  } catch (error) {
    console.error("Error fetching staff performance summary:", error);
    throw error;
  }
};
