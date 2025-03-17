
// Data utility functions for business analytics

export const getTasksData = () => {
  return {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Completed",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "#22c55e",
      },
      {
        label: "In Progress",
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: "#3b82f6",
      },
      {
        label: "Pending",
        data: [15, 39, 25, 33, 12, 45],
        backgroundColor: "#f59e0b",
      },
    ],
  };
};

export const getStaffPerformanceData = () => {
  return {
    labels: ["Ahmed", "Sara", "John", "Emma", "Mohamed"],
    datasets: [
      {
        label: "Hours Worked",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "#3b82f6",
      }
    ],
  };
};

export const getRevenueData = () => {
  return {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [1200, 1500, 1800, 1600, 2100, 2400],
        backgroundColor: "#22c55e",
      }
    ],
  };
};

export const getCustomerGrowthData = () => {
  return {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Customers",
        data: [20, 25, 18, 30, 22, 35],
        backgroundColor: "#8b5cf6",
        borderColor: "#8b5cf6",
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      }
    ],
  };
};
