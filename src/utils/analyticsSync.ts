
import { supabase } from "@/integrations/supabase/client";

export const syncServiceDistribution = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      console.error("No authenticated session");
      return false;
    }
    
    // Get all services for this business
    const { data: services, error: servicesError } = await supabase
      .from('business_services')
      .select('id, name')
      .eq('business_id', session.session.user.id);
      
    if (servicesError) {
      console.error("Error fetching services:", servicesError);
      return false;
    }
    
    if (!services || services.length === 0) {
      console.log("No services found to sync");
      return false;
    }
    
    // Delete any old service_distribution records with hardcoded names
    const { error: deleteError } = await supabase
      .from('business_service_distribution')
      .delete()
      .eq('business_id', session.session.user.id)
      .in('service_name', ['Consulting', 'Design', 'Development', 'Maintenance', 'Other', 'Treatment', 'Checkup', 'Followup']);
      
    if (deleteError) {
      console.error("Error deleting old service distribution records:", deleteError);
    }
    
    // Create new records for each actual service
    const serviceRecords = services.map(service => ({
      business_id: session.session.user.id,
      service_name: service.name,
      usage_count: 5 + Math.floor(Math.random() * 20), // Random placeholder data
      time_range: 'month'
    }));
    
    const { error: insertError } = await supabase
      .from('business_service_distribution')
      .upsert(serviceRecords);
      
    if (insertError) {
      console.error("Error inserting service distribution records:", insertError);
      return false;
    }
    
    console.log("Service distribution records synced successfully");
    return true;
  } catch (error) {
    console.error("Error syncing service distribution:", error);
    return false;
  }
};

export const ensureAnalyticsData = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      console.error("No authenticated session");
      return false;
    }
    
    // Check if we have any business_analytics record
    const { data: analytics, error: analyticsError } = await supabase
      .from('business_analytics')
      .select('id')
      .eq('business_id', session.session.user.id)
      .maybeSingle();
      
    if (analyticsError) {
      console.error("Error checking analytics:", analyticsError);
    }
    
    if (!analytics) {
      // Call the function to initialize analytics data
      const { data, error } = await supabase
        .rpc('populate_initial_business_analytics', {
          business_id_param: session.session.user.id
        });
        
      if (error) {
        console.error("Error initializing analytics:", error);
        return false;
      }
      
      console.log("Analytics initialized successfully");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error ensuring analytics data:", error);
    return false;
  }
};
