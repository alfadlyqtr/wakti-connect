
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
            <a href="tel:+1234567890" className="hover:underline">
              +1 (234) 567-890
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
              123 Productivity Street<br />
              San Francisco, CA 94103<br />
              United States
            </address>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-wakti-blue/10 p-2 rounded-lg mr-4">
            <MessageSquare className="h-5 w-5 text-wakti-blue" />
          </div>
          <div>
            <p className="font-medium">Support Hours</p>
            <p>Monday - Friday<br />9AM - 6PM EST</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
