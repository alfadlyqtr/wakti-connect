
import { useState, useEffect } from 'react';
import { BookingTab } from '@/types/booking.types';

/**
 * Hook to manage the active tab state for the bookings page
 */
export const useBookingsTabState = () => {
  const [activeTab, setActiveTab] = useState<BookingTab>('all-bookings');
  const isStaff = localStorage.getItem('isStaff') === 'true';
  
  // For staff users, we force the tab to always be 'all-bookings'
  useEffect(() => {
    if (isStaff) {
      setActiveTab('all-bookings');
    }
  }, [isStaff]);
  
  // For staff users, this will be a no-op since we're enforcing 'all-bookings'
  const handleSetActiveTab = (tab: BookingTab) => {
    if (!isStaff) {
      setActiveTab(tab);
    }
  };
  
  return {
    activeTab,
    setActiveTab: handleSetActiveTab
  };
};

export default useBookingsTabState;
