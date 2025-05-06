
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-gray-700">
              Please feel free to contact us through this form or using our contact information.
            </p>
            
            <form className="space-y-4">
              <div>
                <Input placeholder="Name" className="border-gray-300" />
              </div>
              <div>
                <Input placeholder="Email Address" type="email" className="border-gray-300" />
              </div>
              <div>
                <Input placeholder="Phone" type="tel" className="border-gray-300" />
              </div>
              <div>
                <Input placeholder="Subject" className="border-gray-300" />
              </div>
              <div>
                <Textarea 
                  placeholder="Message" 
                  className="border-gray-300 min-h-[120px]" 
                />
              </div>
              <div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto px-8"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Our Location</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">1234 Street Name, City, State</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">contact@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
