
import React from "react";
import ContactInfo from "./ContactInfo";
import SocialLinks from "./SocialLinks";

const ContactSidebar = () => {
  return (
    <div className="lg:col-span-1 space-y-8">
      <ContactInfo />
      <SocialLinks />
    </div>
  );
};

export default ContactSidebar;
