
import React from 'react';

// Mock i18n functions for components that use react-i18next
export const useTranslation = () => {
  return {
    t: (key: string, options?: any) => {
      // Basic translation mapping for common keys
      const translations: Record<string, string> = {
        'auth.login': 'Login',
        'auth.signUp': 'Sign Up',
        'auth.welcomeToWakti': 'Welcome to WAKTI',
        'auth.manageEfficiently': 'Manage your business efficiently',
        'auth.fullName': 'Full Name',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.termsAgreement': 'I agree to the Terms and Conditions',
        'auth.createAccount': 'Create Account',
        'auth.creatingAccount': 'Creating Account...',
        'auth.accountType': 'Account Type',
        'auth.free': 'Free',
        'auth.individual': 'Individual',
        'auth.business': 'Business',
        'auth.back': 'Back',
        'auth.continueWith': 'Or continue with',
        'calendar.tasks': 'Tasks',
        'calendar.bookings': 'Bookings',
        'dashboard.welcome.morning': 'Good Morning',
        'dashboard.welcome.afternoon': 'Good Afternoon',
        'dashboard.welcome.evening': 'Good Evening',
        'dashboard.welcome.overview': 'Here\'s an overview of your day',
        'common.there': 'there',
        'common.logOut': 'Log Out',
        'common.logIn': 'Log In',
        'common.signUp': 'Sign Up',
        'common.wakti': 'WAKTI',
        'dashboard.settings': 'Settings',
        'dashboard.noTasks': 'You have no tasks in this category',
        'task.createTask': 'Create Task',
      };
      
      // Return the translation or the key itself as fallback
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
      changeLanguage: (lng: string) => Promise.resolve(),
    }
  };
};

// I18nextProvider mock component
export const I18nextProvider: React.FC<{i18n: any; children: React.ReactNode}> = ({ children }) => {
  return <>{children}</>;
};

// withTranslation mock function
export const withTranslation = () => (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { t } = useTranslation();
    return <Component t={t} {...props} />;
  };
};

export default { useTranslation, I18nextProvider, withTranslation };
