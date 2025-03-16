
import React from "react";
import { Button } from "@/components/ui/button";

const ContactFaq = () => {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">How do I upgrade my plan?</h3>
          <p className="text-muted-foreground">
            You can upgrade your plan at any time from your account settings. Visit the Billing section to view available plans and make changes.
          </p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
          <p className="text-muted-foreground">
            Yes, we offer a 14-day money-back guarantee if you're not satisfied with your paid plan. Contact our support team to process your refund.
          </p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Can I change my plan later?</h3>
          <p className="text-muted-foreground">
            Absolutely! You can upgrade, downgrade, or cancel your plan at any time through your account settings.
          </p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">How do I get support?</h3>
          <p className="text-muted-foreground">
            You can reach our support team via email at support@wakti.app or through the in-app chat feature available to all users.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <Button variant="outline" asChild>
          <a href="/faq">View All FAQs</a>
        </Button>
      </div>
    </section>
  );
};

export default ContactFaq;
