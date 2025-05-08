
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ContactInfoTab = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { contactInfo } = pageData;

  const [formState, setFormState] = React.useState(contactInfo);

  const handleInputChange = (field: keyof typeof contactInfo, value: string) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleSaveField = (field: keyof typeof contactInfo) => {
    updateSectionData("contactInfo", { [field]: formState[field] });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={formState.email} 
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <Button onClick={() => handleSaveField("email")}>Save</Button>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formState.phone} 
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <Button onClick={() => handleSaveField("phone")}>Save</Button>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input 
                id="whatsapp" 
                type="tel" 
                value={formState.whatsapp} 
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <Button onClick={() => handleSaveField("whatsapp")}>Save</Button>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="whatsappBusiness">WhatsApp Business Number</Label>
              <Input 
                id="whatsappBusiness" 
                type="tel" 
                value={formState.whatsappBusiness} 
                onChange={(e) => handleInputChange("whatsappBusiness", e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <Button onClick={() => handleSaveField("whatsappBusiness")}>Save</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="facebook">Facebook ID</Label>
              <Input 
                id="facebook" 
                value={formState.facebook} 
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                placeholder="your.facebook.page"
              />
            </div>
            <Button onClick={() => handleSaveField("facebook")}>Save</Button>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="instagram">Instagram ID</Label>
              <Input 
                id="instagram" 
                value={formState.instagram} 
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="your_instagram_handle"
              />
            </div>
            <Button onClick={() => handleSaveField("instagram")}>Save</Button>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="googleMaps">Google Maps URL</Label>
              <Input 
                id="googleMaps" 
                value={formState.googleMaps} 
                onChange={(e) => handleInputChange("googleMaps", e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
            <Button onClick={() => handleSaveField("googleMaps")}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
