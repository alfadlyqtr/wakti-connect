
import React from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactSidebar from "@/components/contact/ContactSidebar";
import ContactForm from "@/components/ContactForm";
import ContactFaq from "@/components/contact/ContactFaq";

const ContactPage = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto">
        {/* Hero Section */}
        <ContactHero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Contact Information & Social Links */}
          <ContactSidebar />

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <ContactFaq />
      </div>
    </div>
  );
};

export default ContactPage;
