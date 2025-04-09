
// Business reports utilities for real data handling

// Color palette for charts
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Utility function to calculate growth percentage
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Format numbers for display
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString();
};

// Helper to calculate period change text
export const getPeriodChangeText = (current: number, previous: number | null | undefined): string => {
  if (previous === null || previous === undefined) return '';
  
  const change = calculateGrowth(current, previous);
  if (change > 0) return `+${change}% from previous period`;
  if (change < 0) return `${change}% from previous period`;
  return 'No change from previous period';
};

// Format hours for display
export const formatHours = (totalHours: number | null | undefined): string => {
  if (totalHours === null || totalHours === undefined) return '—';
  
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);
  
  return `${hours}h ${minutes}m`;
};

// Adding placeholder data exports to resolve import errors
// These should eventually be replaced with real data fetching functions
export const bookingData: any[] = [];
export const servicePopularityData: any[] = [];
export const subscriberData: any[] = [];

