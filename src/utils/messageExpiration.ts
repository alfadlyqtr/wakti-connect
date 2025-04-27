
/**
 * Checks if a message has expired based on its timestamp
 * Messages older than 30 days could be considered expired
 * 
 * @param timestamp ISO timestamp string
 * @returns boolean
 */
export const isMessageExpired = (timestamp: string): boolean => {
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // Calculate difference in days
  const diffTime = now.getTime() - messageDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // Messages older than 30 days are considered expired
  return diffDays > 30;
};

/**
 * Get the remaining time until a message expires
 * 
 * @param timestamp ISO timestamp string
 * @returns string describing remaining time
 */
export const getMessageExpirationTime = (timestamp: string): string => {
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // Calculate difference in days
  const diffTime = now.getTime() - messageDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  const daysRemaining = Math.floor(30 - diffDays);
  
  if (daysRemaining <= 0) {
    return 'Expired';
  } else if (daysRemaining === 1) {
    return 'Expires tomorrow';
  } else {
    return `Expires in ${daysRemaining} days`;
  }
};
