
// Chart data for business reports
export const subscriberData = [
  { month: 'Jan', subscribers: 5 },
  { month: 'Feb', subscribers: 12 },
  { month: 'Mar', subscribers: 18 },
  { month: 'Apr', subscribers: 25 },
  { month: 'May', subscribers: 31 },
  { month: 'Jun', subscribers: 35 },
];

export const bookingData = [
  { month: 'Jan', bookings: 8 },
  { month: 'Feb', bookings: 15 },
  { month: 'Mar', bookings: 22 },
  { month: 'Apr', bookings: 30 },
  { month: 'May', bookings: 27 },
  { month: 'Jun', bookings: 36 },
];

export const servicePopularityData = [
  { name: 'Consultation', value: 35 },
  { name: 'Treatment', value: 25 },
  { name: 'Checkup', value: 20 },
  { name: 'Followup', value: 15 },
  { name: 'Other', value: 5 },
];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Utility function to calculate growth percentage
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};
