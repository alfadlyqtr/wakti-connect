
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
