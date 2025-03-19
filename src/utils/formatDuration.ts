
export const formatDuration = (start: string, end: string | null): string => {
  if (!end) return "In progress";
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMillis = endDate.getTime() - startDate.getTime();
  
  const hours = Math.floor(diffMillis / (1000 * 60 * 60));
  const minutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};
