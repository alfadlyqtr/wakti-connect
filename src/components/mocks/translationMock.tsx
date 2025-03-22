
import React from 'react';

// This is a standalone mock implementation of useTranslation
export const useTranslation = () => {
  // Get language from localStorage if available
  const language = localStorage.getItem('i18nextLng') || 'en';
  
  return {
    t: (key: string) => {
      // Very basic translations for common keys
      const translations: Record<string, Record<string, string>> = {
        en: {
          'task.today': 'Today',
          'dashboard.completed': 'completed',
          'dashboard.noTasksToday': 'No tasks for today',
          'dashboard.notifications': 'Notifications',
          'dashboard.unreadNotifications': 'Unread notifications',
          'dashboard.noNewNotifications': 'No new notifications',
          'dashboard.activity': 'Activity',
          'dashboard.businessAccount': 'Business Account',
          'dashboard.individualAccount': 'Individual Account',
          'dashboard.freeAccount': 'Free Account',
          'dashboard.businessDashboard': 'Business Dashboard',
          'dashboard.professionalDashboard': 'Professional Dashboard',
          'dashboard.personalDashboard': 'Personal Dashboard',
          'dashboard.welcomeBack': 'Welcome back',
          'dashboard.businessAdmin': 'Business Admin',
          'dashboard.professional': 'Professional',
          'dashboard.personalUser': 'Personal User',
          'calendar.noEvents': 'No events on',
          'calendar.tasks': 'Tasks',
          'calendar.bookings': 'Bookings',
          'dashboard.noTasks': 'Start creating tasks to manage your workload effectively',
          'task.createTask': 'Create Task',
          'common.there': 'there',
          'auth.termsAgreement': 'I agree to the Terms and Conditions',
          'auth.creatingAccount': 'Creating Account...',
          'auth.createAccount': 'Create Account',
          'auth.accountType': 'Account Type',
          'auth.free': 'Free',
          'auth.individual': 'Individual',
          'auth.business': 'Business',
          'auth.back': 'Back',
          'auth.login': 'Login',
          'auth.signUp': 'Sign Up',
          'auth.welcomeToWakti': 'Welcome to Wakti',
          'auth.manageEfficiently': 'Manage your tasks, appointments and business efficiently',
          'auth.continueWith': 'Or continue with',
          'auth.fullName': 'Full Name',
          'auth.email': 'Email',
          'auth.password': 'Password'
        },
        ar: {
          'task.today': 'اليوم',
          'dashboard.completed': 'مكتمل',
          'dashboard.noTasksToday': 'لا توجد مهام لليوم',
          'dashboard.notifications': 'الإشعارات',
          'dashboard.unreadNotifications': 'إشعارات غير مقروءة',
          'dashboard.noNewNotifications': 'لا توجد إشعارات جديدة',
          'dashboard.activity': 'النشاط',
          'dashboard.businessAccount': 'حساب تجاري',
          'dashboard.individualAccount': 'حساب فردي',
          'dashboard.freeAccount': 'حساب مجاني',
          'dashboard.businessDashboard': 'لوحة التحكم التجارية',
          'dashboard.professionalDashboard': 'لوحة التحكم المهنية',
          'dashboard.personalDashboard': 'لوحة التحكم الشخصية',
          'dashboard.welcomeBack': 'مرحبا بعودتك',
          'dashboard.businessAdmin': 'مدير الأعمال',
          'dashboard.professional': 'محترف',
          'dashboard.personalUser': 'مستخدم شخصي',
          'calendar.noEvents': 'لا توجد أحداث في',
          'calendar.tasks': 'المهام',
          'calendar.bookings': 'الحجوزات',
          'dashboard.noTasks': 'ابدأ بإنشاء المهام لإدارة عبء العمل بفعالية',
          'task.createTask': 'إنشاء مهمة',
          'common.there': 'هناك',
          'auth.termsAgreement': 'أوافق على الشروط والأحكام',
          'auth.creatingAccount': 'جاري إنشاء الحساب...',
          'auth.createAccount': 'إنشاء حساب',
          'auth.accountType': 'نوع الحساب',
          'auth.free': 'مجاني',
          'auth.individual': 'فردي',
          'auth.business': 'تجاري',
          'auth.back': 'رجوع',
          'auth.login': 'تسجيل الدخول',
          'auth.signUp': 'التسجيل',
          'auth.welcomeToWakti': 'مرحبًا بك في وكتي',
          'auth.manageEfficiently': 'إدارة المهام والمواعيد والأعمال بكفاءة',
          'auth.continueWith': 'أو أكمل بواسطة',
          'auth.fullName': 'الاسم الكامل',
          'auth.email': 'البريد الإلكتروني',
          'auth.password': 'كلمة المرور'
        }
      };
      
      return translations[language]?.[key] || key;
    },
    i18n: {
      language,
      changeLanguage: (lng: string) => {
        localStorage.setItem('i18nextLng', lng);
        return Promise.resolve();
      },
      exists: () => true,
    }
  };
};

export default useTranslation;
