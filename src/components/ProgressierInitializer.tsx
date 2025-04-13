
import { useEffect } from 'react';
import { ensureNotificationPermission } from '@/utils/progressierNotifications';

const ProgressierInitializer = () => {
  useEffect(() => {
    // Initialize Progressier and request permissions
    const initializeProgressier = async () => {
      try {
        // Wait a moment to ensure the script is loaded
        setTimeout(async () => {
          await ensureNotificationPermission();
          console.log('Progressier initialized and permissions checked');
        }, 2000);
      } catch (error) {
        console.error('Error initializing Progressier:', error);
      }
    };

    initializeProgressier();
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default ProgressierInitializer;
