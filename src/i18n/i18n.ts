
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Default translations
const resources = {
  en: {
    translation: {
      'auth.login': 'Login',
      'auth.signUp': 'Sign Up',
      'auth.welcomeToWakti': 'Welcome to WAKTI',
      'auth.manageEfficiently': 'Manage your tasks, appointments and business efficiently',
      'auth.continueWith': 'or continue with',
      'auth.back': 'Back',
      'auth.fullName': 'Full Name',
      'auth.email': 'Email',
      'auth.password': 'Password',
      
      'cta.title': 'Ready to boost your productivity?',
      'cta.description': 'Join thousands of users already using WAKTI to manage their tasks and business efficiently.',
      'cta.button': 'Get Started Free',
      
      'taskStatus.pending': 'Pending',
      'taskStatus.inProgress': 'In Progress',
      'taskStatus.completed': 'Completed',
      'taskStatus.canceled': 'Canceled',
      'taskStatus.onHold': 'On Hold',
      
      // Add more translations as needed
    }
  },
  ar: {
    translation: {
      'auth.login': 'تسجيل الدخول',
      'auth.signUp': 'انشاء حساب',
      'auth.welcomeToWakti': 'مرحباً بك في واكتي',
      'auth.manageEfficiently': 'أدر مهامك ومواعيدك وأعمالك بكفاءة',
      'auth.continueWith': 'أو الاستمرار باستخدام',
      'auth.back': 'رجوع',
      'auth.fullName': 'الاسم الكامل',
      'auth.email': 'البريد الإلكتروني',
      'auth.password': 'كلمة المرور',
      
      // Add more translations as needed
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
