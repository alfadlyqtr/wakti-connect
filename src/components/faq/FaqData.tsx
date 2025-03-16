
import React from "react";
import { Link } from "react-router-dom";
import { FaqItem } from "@/components/ui/faq-section";

export const useGeneralFaqs = (): FaqItem[] => {
  return [
    {
      question: "What is WAKTI?",
      answer: (
        <p>
          WAKTI is an all-in-one productivity platform designed to help individuals and businesses 
          manage tasks, appointments, and team collaboration efficiently. It combines task management, 
          appointment scheduling, and business solutions in one unified platform.
        </p>
      ),
    },
    {
      question: "Is WAKTI free?",
      answer: (
        <p>
          WAKTI offers a free basic plan with limited features. For full access to all features, 
          we offer paid Individual and Business plans with various subscription options. 
          You can view our pricing details on our <Link to="/pricing" className="text-wakti-blue hover:underline">Pricing page</Link>.
        </p>
      ),
    },
    {
      question: "How do I book an appointment?",
      answer: (
        <p>
          Booking an appointment in WAKTI is simple. Once logged in, navigate to the Appointments 
          section in your dashboard, click "Create Appointment," fill in the required details, and send 
          invitations to attendees if needed. If you're booking with a business through WAKTI, 
          you can use their booking page to select available time slots.
        </p>
      ),
    }
  ];
};

export const useAccountFaqs = (): FaqItem[] => {
  return [
    {
      question: "Can I invite my team?",
      answer: (
        <p>
          Yes, Business plan subscribers can invite team members to their WAKTI workspace. 
          You can assign different roles (Admin, Co-Admin, Staff) with varying permission levels. 
          Each team member gets their own login credentials to access the shared workspace.
        </p>
      ),
    },
    {
      question: "What happens if I cancel my subscription?",
      answer: (
        <p>
          If you cancel your subscription, you'll continue to have access to your paid features until 
          the end of your current billing cycle. After that, your account will be downgraded to the 
          Free plan with limited functionality. Your data will be preserved, but you'll lose access 
          to premium features until you resubscribe.
        </p>
      ),
    },
    {
      question: "How secure is my data on WAKTI?",
      answer: (
        <p>
          WAKTI takes data security very seriously. We use industry-standard encryption, secure 
          authentication methods, and regular security audits to ensure your data is protected. 
          For more details about our security practices, please refer to our 
          <Link to="/privacy" className="text-wakti-blue hover:underline ml-1">Privacy Policy</Link>.
        </p>
      ),
    }
  ];
};

export const useTechnicalFaqs = (): FaqItem[] => {
  return [
    {
      question: "Can I access WAKTI on my mobile device?",
      answer: (
        <p>
          Yes, WAKTI is fully responsive and can be accessed on mobile devices through your web browser. 
          We're also developing dedicated mobile apps for iOS and Android to provide an enhanced mobile experience.
        </p>
      ),
    },
    {
      question: "Does WAKTI work in different languages?",
      answer: (
        <p>
          Currently, WAKTI supports English and Arabic languages. You can switch between languages 
          in your account settings. We're continuously working to add support for more languages.
        </p>
      ),
    },
    {
      question: "Can I integrate WAKTI with other tools I use?",
      answer: (
        <p>
          WAKTI offers integrations with popular productivity and communication tools. Business plan 
          subscribers can access our API for custom integrations. We're constantly expanding our 
          integration capabilities to enhance workflow efficiency.
        </p>
      ),
    }
  ];
};
