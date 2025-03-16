
import React from "react";
import { MailIcon, PhoneIcon, MapPinIcon, MessageSquare } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="bg-background rounded-lg border p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="bg-wakti-blue/10 p-2 rounded-lg mr-4">
            <MailIcon className="h-5 w-5 text-wakti-blue" />
          </div>
          <div>
            <p className="font-medium">Email</p>
            <a href="mailto:support@wakti.app" className="text-wakti-blue hover:underline">
              support@wakti.app
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-wakti-blue/10 p-2 rounded-lg mr-4">
            <PhoneIcon className="h-5 w-5 text-wakti-blue" />
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <a href="tel:+97444123456" className="hover:underline">
              +974 4412 3456
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-wakti-blue/10 p-2 rounded-lg mr-4">
            <MapPinIcon className="h-5 w-5 text-wakti-blue" />
          </div>
          <div>
            <p className="font-medium">Address</p>
            <address className="not-italic">
              WAKTI Headquarters<br />
              West Bay Tower<br />
              Doha, Qatar
            </address>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-wakti-blue/10 p-2 rounded-lg mr-4">
            <MessageSquare className="h-5 w-5 text-wakti-blue" />
          </div>
          <div>
            <p className="font-medium">Support Hours</p>
            <p>Sunday - Thursday<br />8AM - 5PM AST</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
