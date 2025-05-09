
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth/index";

const SimpleBusinessPageBuilder = () => {
  const { user } = useAuth();
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  
  const [formData, setFormData] = useState({
    slug: "",
    email: "",
    whatsapp: "",
    whatsappBusiness: "",
    phone: "",
    facebookId: "",
    googleLocation: "",
    instagramId: "",
    chatbotCode: "",
    businessHours: {
      monday: { open: "09:00", close: "17:00", isOpen: true },
      tuesday: { open: "09:00", close: "17:00", isOpen: true },
      wednesday: { open: "09:00", close: "17:00", isOpen: true },
      thursday: { open: "09:00", close: "17:00", isOpen: true },
      friday: { open: "09:00", close: "17:00", isOpen: true },
      saturday: { open: "10:00", close: "15:00", isOpen: false },
      sunday: { open: "10:00", close: "15:00", isOpen: false }
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // This would save the data to your backend
    console.log("Saving business page data:", formData);
    setIsSetupOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {isSetupOpen ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Landing Page Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Business Page URL</Label>
              <div className="flex">
                <span className="bg-slate-100 px-3 py-2 text-sm border border-r-0 rounded-l-md">
                  wakti.qa/
                </span>
                <Input 
                  id="slug" 
                  name="slug" 
                  placeholder="your-business-name" 
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                placeholder="your@email.com" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input 
                id="whatsapp" 
                name="whatsapp" 
                placeholder="+1234567890" 
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappBusiness">WhatsApp Business</Label>
              <Input 
                id="whatsappBusiness" 
                name="whatsappBusiness" 
                placeholder="+1234567890" 
                value={formData.whatsappBusiness}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone" 
                placeholder="+1234567890" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookId">Facebook ID</Label>
              <Input 
                id="facebookId" 
                name="facebookId" 
                placeholder="your.facebook.id" 
                value={formData.facebookId}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleLocation">Google Maps Location</Label>
              <Input 
                id="googleLocation" 
                name="googleLocation" 
                placeholder="https://goo.gl/maps/example" 
                value={formData.googleLocation}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramId">Instagram ID</Label>
              <Input 
                id="instagramId" 
                name="instagramId" 
                placeholder="your_instagram" 
                value={formData.instagramId}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chatbotCode">TMW AI Chatbot Code</Label>
              <Textarea 
                id="chatbotCode" 
                name="chatbotCode" 
                placeholder="Paste your TMW chatbot embed code here" 
                value={formData.chatbotCode}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="pt-4 border-t">
              <Label className="text-lg font-medium">Business Hours</Label>
              <div className="grid gap-4 mt-2">
                {Object.entries(formData.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="font-medium capitalize">{day}</div>
                    <div className="flex items-center space-x-4">
                      <Switch 
                        checked={hours.isOpen} 
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              [day]: {
                                ...prev.businessHours[day as keyof typeof prev.businessHours],
                                isOpen: checked
                              }
                            }
                          }));
                        }}
                      />
                      <span className="text-sm text-muted-foreground w-14">
                        {hours.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save Landing Page</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Business Page Builder</h1>
          <p className="text-muted-foreground mb-8">
            Your business landing page has been set up. You can edit it or publish it using the buttons below.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setIsSetupOpen(true)}>Edit Settings</Button>
            <Button>Publish Page</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleBusinessPageBuilder;
