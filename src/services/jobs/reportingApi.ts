
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
  try {
    console.log("Fetching job cards with details. Staff ID:", staffRelationId, "Start date:", startDate);
    
    // First fetch the basic job cards data
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
    
    const { data: jobCardsData, error: jobCardsError } = await query;
    
    if (jobCardsError) {
      console.error("Error fetching job cards:", jobCardsError);
      throw new Error(`Error fetching job cards: ${jobCardsError.message}`);
    }
    
    if (!jobCardsData || jobCardsData.length === 0) {
      console.log("No job cards found for the given criteria");
      return [];
    }
    
    // Get all unique staff_relation_ids to fetch staff names
    const staffIds = [...new Set(jobCardsData.map(card => card.staff_relation_id))];
    
    // Fetch staff names in a separate query
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('id, name')
      .in('id', staffIds);
    
    if (staffError) {
      console.error("Error fetching staff names:", staffError);
      // Continue with processing even if staff names can't be fetched
    }
    
    // Create a map of staff IDs to names for quick lookup
    const staffNameMap = new Map();
    if (staffData) {
      staffData.forEach(staff => {
        staffNameMap.set(staff.id, staff.name);
      });
    }
    
    // Process and map the data
    return jobCardsData.map(card => {
      // Extract job information with proper null/undefined handling
      const jobData = card.jobs || undefined;
      
      // Get staff name from our map, or use default
      const staffName = staffNameMap.get(card.staff_relation_id) || "Unknown Staff";
      
      // Create a properly typed JobCard object
      const jobCard: JobCard = {
        ...card,
        job: jobData,
        staff_name: staffName,
        payment_method: ensurePaymentMethodType(card.payment_method)
      };
      
      // Remove unnecessary nested data
      delete (jobCard as any).jobs;
      
      return jobCard;
    });
  } catch (error) {
    console.error("Error in fetchJobCardsWithDetails:", error);
    throw error;
  }
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
    console.log("Fetching staff performance summary. Business ID:", businessId, "Time range:", timeRange);
    
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
    
    const startDateString = startDate.toISOString();
    console.log("Using start date:", startDateString);
    
    // First get all staff for this business
    const { data: staffRelations, error: staffError } = await supabase
      .from('business_staff')
      .select('id, name')
      .eq('business_id', businessId)
      .eq('status', 'active');
      
    if (staffError) {
      console.error("Error fetching staff relations:", staffError);
      throw new Error(`Error fetching staff relations: ${staffError.message}`);
    }
    
    console.log(`Found ${staffRelations?.length || 0} staff members for business`);
    
    // Initialize arrays and counters
    const staffMetrics = [];
    let totalJobs = 0;
    let totalEarnings = 0;
    
    // Process each staff member
    for (const staff of staffRelations || []) {
      console.log(`Processing staff member: ${staff.name} (${staff.id})`);
      
      try {
        // Get job cards for this staff member
        const { data: jobCards, error: jobsError } = await supabase
          .from('job_cards')
          .select(`
            id, 
            payment_amount, 
            payment_method, 
            start_time, 
            end_time,
            job_id
          `)
          .eq('staff_relation_id', staff.id)
          .gte('start_time', startDateString);
          
        if (jobsError) {
          console.error(`Error fetching job cards for staff ${staff.id}:`, jobsError);
          continue; // Skip this staff member but continue with the others
        }
        
        // Only process completed job cards
        const completedJobCards = jobCards?.filter(card => card.end_time) || [];
        console.log(`Found ${completedJobCards.length} completed job cards for ${staff.name}`);
        
        // Calculate metrics
        const staffJobs = completedJobCards.length;
        const staffEarnings = completedJobCards.reduce(
          (sum, card) => sum + (typeof card.payment_amount === 'number' ? card.payment_amount : 0), 
          0
        );
        
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
      } catch (err) {
        console.error(`Error processing staff ${staff.id}:`, err);
        // Continue with the next staff member
      }
    }
    
    // Sort by earnings (highest first)
    staffMetrics.sort((a, b) => b.totalEarnings - a.totalEarnings);
    
    console.log(`Completed staff performance summary. Found ${staffMetrics.length} staff with metrics.`);
    
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
