
import React from "react";
import { Link } from "react-router-dom";
import { FaqSection, FaqItem } from "@/components/ui/faq-section";

const pricingFaqs: FaqItem[] = [
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer: (
      <p>
        Yes, you can upgrade or downgrade your plan at any time. The changes will take effect at
        the start of your next billing cycle. If you upgrade mid-cycle, you'll be charged a prorated
        amount for the remainder of the current billing period.
      </p>
    ),
  },
  {
    question: "Are there any long-term contracts?",
    answer: (
      <p>
        No, all WAKTI plans are billed monthly with no long-term commitment. You can cancel at
        any time. We also offer annual billing options with a discount for those who prefer to pay yearly.
      </p>
    ),
  },
  {
    question: "What payment methods do you accept?",
    answer: (
      <p>
        We accept all major credit cards including Visa, Mastercard, and American Express. For Business
        plans, we also offer invoice billing with net-30 terms. Contact our sales team for more information.
      </p>
    ),
  },
  {
    question: "Is there a free trial available?",
    answer: (
      <p>
        Yes, both our Individual and Business plans come with a 14-day free trial. You'll need to provide
        payment information to start the trial, but you won't be charged until the trial period ends.
        You can cancel anytime during the trial period.
      </p>
    ),
  },
];

const PricingFaqs = () => {
  return (
    <>
      <FaqSection 
        title="Frequently Asked Questions" 
        subtitle="Have more questions about our pricing plans? Here are some answers."
        faqs={pricingFaqs} 
      />
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-6">
          Still have questions about our pricing?{" "}
          <Link to="/contact" className="text-wakti-blue hover:underline">
            Contact us
          </Link>{" "}
          for more information.
        </p>
      </div>
    </>
  );
};

export default PricingFaqs;
