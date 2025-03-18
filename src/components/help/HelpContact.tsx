
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Clock, Mail, MessageSquare, PhoneCall } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface HelpContactProps {
  accountType: string;
}

export const HelpContact = ({ accountType }: HelpContactProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Support request submitted",
        description: "We've received your message and will respond shortly.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: ""
      });
      setSubmitting(false);
    }, 1500);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Contact Support</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
              <CardDescription>
                Fill out the form below and our team will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                        {accountType === 'business' && (
                          <SelectItem value="business">Business Features</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                {accountType === 'free' && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Limited Support for Free Accounts</AlertTitle>
                    <AlertDescription>
                      Free accounts have access to email support with longer response times.
                      Upgrade to Individual or Business plan for priority support.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Support Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Options</CardTitle>
              <CardDescription>
                Choose your preferred way to get help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Email Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Send us an email at support@wakti.app
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Response time: 24-48 hours
                  </p>
                </div>
              </div>
              
              {(accountType === 'individual' || accountType === 'business') && (
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Live Chat</h4>
                    <p className="text-sm text-muted-foreground">
                      Chat with our support team in real-time
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available Mon-Fri, 9am-5pm UTC
                    </p>
                  </div>
                </div>
              )}
              
              {accountType === 'business' && (
                <div className="flex items-start space-x-3">
                  <PhoneCall className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Phone Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Call us at +1-555-WAKTI-BIZ
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available Mon-Fri, 9am-5pm UTC
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Response Times</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                    <li>Free: 2-3 business days</li>
                    <li>Individual: 1 business day</li>
                    <li>Business: 4-8 hours</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button variant="outline" className="w-full" asChild>
            <a href="https://docs.wakti.app" target="_blank" rel="noopener noreferrer">
              Visit Documentation
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
