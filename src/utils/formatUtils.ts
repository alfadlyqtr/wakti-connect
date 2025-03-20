
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDateTimeToISO = (
  date: Date, 
  startTime: string, 
  endTime?: string
): { start_time: string, end_time?: string } => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const [startHour, startMinute] = startTime.split(':');
  const startTimestamp = `${year}-${month}-${day}T${startHour}:${startMinute}:00`;
  
  let endTimestamp;
  if (endTime) {
    const [endHour, endMinute] = endTime.split(':');
    endTimestamp = `${year}-${month}-${day}T${endHour}:${endMinute}:00`;
  }
  
  return {
    start_time: startTimestamp,
    end_time: endTimestamp
  };
};
