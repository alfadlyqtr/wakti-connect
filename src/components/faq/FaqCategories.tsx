
import React from "react";
import { FaqSection, FaqItem } from "@/components/ui/faq-section";
import { Link } from "react-router-dom";

interface FaqCategoriesProps {
  generalFaqs: FaqItem[];
  accountFaqs: FaqItem[];
  technicalFaqs: FaqItem[];
}

const FaqCategories = ({ 
  generalFaqs, 
  accountFaqs, 
  technicalFaqs 
}: FaqCategoriesProps) => {
  return (
    <div className="space-y-16">
      <FaqSection 
        title="General Questions" 
        faqs={generalFaqs} 
      />
      
      <FaqSection 
        title="Account & Billing" 
        faqs={accountFaqs} 
      />
      
      <FaqSection 
        title="Technical Support" 
        faqs={technicalFaqs} 
      />
    </div>
  );
};

export default FaqCategories;
