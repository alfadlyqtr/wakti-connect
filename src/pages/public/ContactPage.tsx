
import React from "react";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/ContactForm";
import ContactFaq from "@/components/contact/ContactFaq";
import SocialLinks from "@/components/contact/SocialLinks";
import { MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <ContactHero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Contact Information & Social Links */}
          <div className="space-y-6">
            <ContactInfo />
            <SocialLinks />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-20 rounded-lg overflow-hidden border h-[400px] relative bg-muted flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            {/* Google Maps would be embedded here in production */}
            <div className="w-full h-full bg-slate-200"></div>
          </div>
          <div className="relative z-10 text-center">
            <MapPin className="h-12 w-12 text-wakti-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Visit Our Office</h3>
            <p className="text-muted-foreground">
              West Bay, Doha, Qatar
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <ContactFaq />
      </div>
    </div>
  );
};

export default ContactPage;
