
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/types/jobs.types";
import { ensurePaymentMethodType } from "./jobCardsApi";

/**
 * Fetch job cards with detailed information for reporting
 * @param staffRelationId - The staff relation ID to filter by (required)
 * @param startDate - Optional date to filter results from
 * @returns Promise with array of job cards with additional details
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
        default_price,
        business_id,
        created_at,
        updated_at
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
        ...jobData
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
 * This is used by business owners to see aggregate performance data
 * @param businessId The business ID to fetch performance data for
 * @param timeRange Time range for the report (day, week, month, etc.)
 */
export const fetchStaffPerformanceSummary = async (
  businessId: string, 
  timeRange: string = 'month'
) => {
  try {
    // Get current date and calculate start date based on time range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1)); // Default to month
    }
    
    // Query job cards for all staff in this business
    const { data: staffRelations, error: staffError } = await supabase
      .from('business_staff')
      .select('id, name')
      .eq('business_id', businessId)
      .eq('status', 'active');
      
    if (staffError) {
      console.error("Error fetching staff relations:", staffError);
      throw new Error(`Error fetching staff relations: ${staffError.message}`);
    }
    
    // Collect performance metrics for each staff member
    const staffMetrics = [];
    let totalJobs = 0;
    let totalEarnings = 0;
    
    for (const staff of staffRelations || []) {
      // Get job cards for this staff member
      const { data: jobCards, error: jobsError } = await supabase
        .from('job_cards')
        .select('*, jobs:job_id(*)')
        .eq('staff_relation_id', staff.id)
        .gte('start_time', startDate.toISOString());
        
      if (jobsError) {
        console.error(`Error fetching job cards for staff ${staff.id}:`, jobsError);
        continue;
      }
      
      // Calculate metrics
      const staffJobs = jobCards?.length || 0;
      const staffEarnings = jobCards?.reduce((sum, card) => sum + (card.payment_amount || 0), 0) || 0;
      
      totalJobs += staffJobs;
      totalEarnings += staffEarnings;
      
      // Add to staff metrics if they have job cards
      if (staffJobs > 0) {
        staffMetrics.push({
          staffId: staff.id,
          staffName: staff.name,
          totalJobs: staffJobs,
          totalEarnings: staffEarnings,
          avgPerJob: staffJobs > 0 ? staffEarnings / staffJobs : 0
        });
      }
    }
    
    // Sort by earnings (highest first)
    staffMetrics.sort((a, b) => b.totalEarnings - a.totalEarnings);
    
    return {
      staffMetrics,
      timeRange,
      totalJobs,
      totalEarnings
    };
  } catch (error) {
    console.error("Error fetching staff performance summary:", error);
    throw error;
  }
};
