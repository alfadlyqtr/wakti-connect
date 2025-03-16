
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import FaqHeader from "@/components/faq/FaqHeader";
import FaqCategories from "@/components/faq/FaqCategories";
import FaqCta from "@/components/faq/FaqCta";
import { useGeneralFaqs, useAccountFaqs, useTechnicalFaqs } from "@/components/faq/FaqData";

const FaqPage = () => {
  const generalFaqs = useGeneralFaqs();
  const accountFaqs = useAccountFaqs();
  const technicalFaqs = useTechnicalFaqs();

  return (
    <div className="min-h-screen py-8">
      <SectionContainer>
        <FaqHeader 
          title="Frequently Asked Questions"
          description="Find answers to common questions about WAKTI and how it can help streamline your productivity."
        />
        
        <FaqCategories 
          generalFaqs={generalFaqs}
          accountFaqs={accountFaqs}
          technicalFaqs={technicalFaqs}
        />
        
        <FaqCta 
          title="Still have questions?"
          description="Our support team is here to help you with any other questions you might have."
          buttonText="Contact Us"
          buttonLink="/contact"
        />
      </SectionContainer>
    </div>
  );
};

export default FaqPage;
