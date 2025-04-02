
import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "@/components/ui/container";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import SocialLinks from "@/components/contact/SocialLinks";
import ContactFaq from "@/components/contact/ContactFaq";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | WAKTI</title>
        <meta
          name="description"
          content="Get in touch with WAKTI. We're here to help with any questions about our productivity platform."
        />
      </Helmet>

      <Container>
        <div className="py-10 md:py-16">
          <ContactHero />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            <ContactForm />
            
            <div className="space-y-8">
              <ContactInfo />
              <SocialLinks />
            </div>
          </div>
          
          <ContactFaq />
        </div>
      </Container>
    </>
  );
};

export default Contact;
