
import { supabase } from "@/integrations/supabase/client";

// This function generates dummy data for the growth charts
export const getGrowthTrendsData = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    labels,
    datasets: [
      {
        label: 'Subscribers',
        data: [10, 15, 20, 25, 30, 35],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ],
  };
};

// This function generates dummy data for the service distribution chart
export const getServiceDistributionData = () => {
  return {
    labels: ['Consultation', 'Treatment', 'Checkup', 'Followup', 'Other'],
    datasets: [
      {
        data: [25, 20, 15, 10, 5],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
};

// Add the missing function for staff performance data
export const getStaffPerformanceData = async () => {
  try {
    // Attempt to get real data from the database
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData?.session?.user) {
      console.log("No authenticated user found, using fallback data");
      return getFallbackStaffPerformanceData();
    }
    
    // Query the business_staff_activity table which contains staff performance data
    const { data, error } = await supabase
      .from('business_staff_activity')
      .select('staff_name, hours_worked')
      .eq('business_id', sessionData.session.user.id)
      .order('hours_worked', { ascending: false })
      .limit(10);
      
    if (error || !data || data.length === 0) {
      console.log("No staff performance data found, using fallback data");
      return getFallbackStaffPerformanceData();
    }
    
    return {
      labels: data.map(item => item.staff_name),
      datasets: [
        {
          data: data.map(item => item.hours_worked),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching staff performance data:", error);
    return getFallbackStaffPerformanceData();
  }
};

// Fallback function to provide data if the DB query fails
const getFallbackStaffPerformanceData = () => {
  return {
    labels: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'],
    datasets: [
      {
        data: [38, 32, 28, 24, 20],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  };
};

// Function to refresh analytics data from the database
export const refreshBusinessAnalytics = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('populate_initial_business_analytics');
    
    if (error) {
      console.error("Error refreshing analytics data:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in refreshBusinessAnalytics:", error);
    return false;
  }
};
