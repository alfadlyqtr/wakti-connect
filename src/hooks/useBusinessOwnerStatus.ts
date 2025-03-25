
import { useState, useEffect } from 'react';
import { isBusinessOwner } from '@/utils/jobsUtils';

const useBusinessOwnerStatus = () => {
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [isCheckingBusinessStatus, setIsCheckingBusinessStatus] = useState(true);
  
  useEffect(() => {
    const checkBusinessStatus = async () => {
      try {
        setIsCheckingBusinessStatus(true);
        const businessOwner = await isBusinessOwner();
        setIsBusinessAccount(businessOwner);
      } catch (error) {
        console.error("Error checking business status:", error);
      } finally {
        setIsCheckingBusinessStatus(false);
      }
    };
    
    checkBusinessStatus();
  }, []);
  
  return { isBusinessAccount, isCheckingBusinessStatus };
};

export default useBusinessOwnerStatus;
