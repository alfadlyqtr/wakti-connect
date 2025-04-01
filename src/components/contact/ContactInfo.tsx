
import React from "react";
import { 
  Mail, 
  Phone, 
  Clock 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ContactInfo = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-wakti-blue p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
          <p className="text-blue-100">
            Reach out to us through any of these channels
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex">
            <Mail className="h-5 w-5 text-wakti-blue mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Email</p>
              <a 
                href="mailto:support@wakti.co" 
                className="text-sm text-muted-foreground hover:text-wakti-blue"
              >
                support@wakti.co
              </a>
            </div>
          </div>
          
          <div className="flex">
            <Phone className="h-5 w-5 text-wakti-blue mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Phone</p>
              <a 
                href="tel:+97444123456" 
                className="text-sm text-muted-foreground hover:text-wakti-blue"
              >
                +974 4412 3456
              </a>
            </div>
          </div>
          
          <div className="flex">
            <Clock className="h-5 w-5 text-wakti-blue mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Working Hours</p>
              <p className="text-sm text-muted-foreground">
                Sunday - Thursday: 8AM - 5PM
              </p>
              <p className="text-sm text-muted-foreground">
                Friday - Saturday: Closed
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
