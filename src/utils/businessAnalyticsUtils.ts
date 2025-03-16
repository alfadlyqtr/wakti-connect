
// Chart data utility functions for business analytics

export const getAppointmentsData = () => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Appointments',
      data: [12, 19, 15, 17, 21, 25, 22, 26, 24, 28, 25, 32],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }
  ]
});

export const getStaffPerformanceData = () => ({
  labels: ['Alice', 'Bob', 'Charlie', 'Dana', 'Edward'],
  datasets: [
    {
      label: 'Hours Worked',
      data: [37, 42, 35, 28, 45],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1,
    }
  ]
});

export const getGrowthTrendsData = () => ({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  datasets: [
    {
      label: 'Subscribers',
      data: [15, 18, 22, 25, 30, 35, 42, 50],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    },
    {
      label: 'Tasks Completed',
      data: [8, 12, 18, 25, 32, 38, 45, 55],
      borderColor: 'rgb(255, 159, 64)',
      tension: 0.1,
      fill: false
    }
  ]
});

export const getServiceDistributionData = () => ({
  labels: ['Haircut', 'Coloring', 'Styling', 'Spa', 'Nails'],
  datasets: [
    {
      label: 'Service Bookings',
      data: [35, 25, 22, 18, 15],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }
  ]
});
