
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

const ContactFaq = () => {
  const { t } = useTranslation();
  
  const faqItems = [
    {
      question: "What is WAKTI?",
      answer: "WAKTI is an all-in-one productivity and business management platform that includes task management, appointment booking, messaging, business dashboard, and more. It helps individuals and businesses streamline their workflow and improve efficiency."
    },
    {
      question: "How much does WAKTI cost?",
      answer: "WAKTI offers a free plan with limited features, an Individual Plan (QAR 20/month or QAR 200/year), and a Business Plan (QAR 45/month or QAR 400/year). Each plan offers different features tailored to different user needs."
    },
    {
      question: "Can I try WAKTI before subscribing?",
      answer: "Yes, you can sign up for our free plan to explore the basic features of WAKTI. This gives you the opportunity to experience the platform before upgrading to a paid subscription."
    },
    {
      question: "How can I upgrade my subscription?",
      answer: "You can upgrade your subscription at any time by going to your account settings and selecting the 'Subscription' tab. From there, you can choose the plan that best suits your needs."
    },
    {
      question: "Is my data secure with WAKTI?",
      answer: "Yes, at WAKTI, we take security seriously. We implement industry-standard security measures to protect your data. All data is encrypted both in transit and at rest."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">{t("contact.frequentlyAskedQuestions")}</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ContactFaq;
