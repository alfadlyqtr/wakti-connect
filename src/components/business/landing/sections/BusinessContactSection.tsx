
import React from "react";

interface BusinessContactSectionProps {
  content: Record<string, any>;
  businessName?: string;
  businessAddress?: string;
  businessPhoneNumber?: string;
  businessEmail?: string;
}

const BusinessContactSection: React.FC<BusinessContactSectionProps> = ({ 
  content,
  businessName,
  businessAddress,
  businessPhoneNumber,
  businessEmail
}) => {
  const {
    title = "Contact Us",
    subtitle = "We'd love to hear from you",
    description = "Fill out the form below to get in touch with us.",
    email = businessEmail || "",
    phone = businessPhoneNumber || "",
    address = businessAddress || "",
    hours = ""
  } = content || {};
  
  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          {description && (
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-background rounded-lg shadow-sm p-6 border border-border">
            <h3 className="text-xl font-medium mb-4">Send us a message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md"
                  rows={5}
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-6">
            {email && (
              <div className="flex items-center p-4 bg-background rounded-lg border border-border">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>
                </div>
              </div>
            )}
            
            {phone && (
              <div className="flex items-center p-4 bg-background rounded-lg border border-border">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <a href={`tel:${phone}`} className="text-primary hover:underline">{phone}</a>
                </div>
              </div>
            )}
            
            {address && (
              <div className="flex items-center p-4 bg-background rounded-lg border border-border">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">{address}</p>
                </div>
              </div>
            )}
            
            {hours && (
              <div className="flex items-center p-4 bg-background rounded-lg border border-border">
                <div className="mr-4 bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{hours}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessContactSection;
