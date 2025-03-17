
// Generate sample growth data for business dashboard analytics
export const getGrowthTrendsData = () => {
  // Sample data for business growth trends
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Subscribers',
        data: [20, 40, 60, 80, 120, 157],
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        borderColor: 'rgba(37, 99, 235, 1)',
      }
    ]
  };
};

// Generate sample service distribution data for business dashboard analytics
export const getServiceDistributionData = () => {
  // Sample data for service distribution
  return {
    labels: ['Consulting', 'Design', 'Development', 'Maintenance'],
    datasets: [
      {
        label: 'Service Distribution',
        data: [35, 25, 30, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderWidth: 1,
      }
    ]
  };
};

// Generate sample staff performance data for business dashboard analytics
export const getStaffPerformanceData = () => {
  // Sample data for staff performance
  return {
    labels: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Tom Brown'],
    datasets: [
      {
        label: 'Hours Worked',
        data: [37, 42, 35, 28, 40],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      }
    ]
  };
};
