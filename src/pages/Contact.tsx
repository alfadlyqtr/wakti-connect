
import React from "react";
import { Helmet } from "react-helmet-async";
import ContactForm from "@/components/contact/ContactForm";
import Container from "@/components/ui/container";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | WAKTI</title>
      </Helmet>
      
      <div className="bg-background py-10">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
            <p className="text-muted-foreground mb-8 text-center">
              Have questions or feedback? We'd love to hear from you. Use the form below to get in touch with our team.
            </p>
            
            <ContactForm />
          </div>
        </Container>
      </div>
    </>
  );
};

export default Contact;
