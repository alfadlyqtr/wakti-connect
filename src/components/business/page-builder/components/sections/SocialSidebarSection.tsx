
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBusinessPage, Position } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";

export const SocialSidebarSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { visible, position, platforms } = pageData.socialSidebar;

  const toggleVisibility = () => {
    updateSectionData("socialSidebar", { visible: !visible });
  };

  const handlePositionChange = (value: string) => {
    if (value as Position) {
      updateSectionData("socialSidebar", { position: value as Position });
    }
  };

  const togglePlatform = (platform: keyof typeof platforms) => {
    updateSectionData("socialSidebar", {
      platforms: {
        ...platforms,
        [platform]: !platforms[platform]
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">8. Social Media Icons (Fixed Sidebar)</CardTitle>
          <Switch 
            checked={visible} 
            onCheckedChange={toggleVisibility}
            aria-label="Toggle visibility"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Position</Label>
            <ToggleGroup 
              type="single" 
              value={position}
              onValueChange={handlePositionChange}
              className="flex justify-start"
            >
              <ToggleGroupItem value="left" aria-label="Left position">
                Left
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right position">
                Right
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label>Social Platforms</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sidebar-whatsapp" 
                  checked={platforms.whatsapp} 
                  onCheckedChange={() => togglePlatform("whatsapp")}
                />
                <Label htmlFor="sidebar-whatsapp">WhatsApp</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sidebar-whatsappBusiness" 
                  checked={platforms.whatsappBusiness}
                  onCheckedChange={() => togglePlatform("whatsappBusiness")}
                />
                <Label htmlFor="sidebar-whatsappBusiness">WhatsApp Business</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sidebar-facebook" 
                  checked={platforms.facebook}
                  onCheckedChange={() => togglePlatform("facebook")}
                />
                <Label htmlFor="sidebar-facebook">Facebook</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sidebar-instagram" 
                  checked={platforms.instagram}
                  onCheckedChange={() => togglePlatform("instagram")}
                />
                <Label htmlFor="sidebar-instagram">Instagram</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sidebar-googleMaps" 
                  checked={platforms.googleMaps}
                  onCheckedChange={() => togglePlatform("googleMaps")}
                />
                <Label htmlFor="sidebar-googleMaps">Google Maps</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sidebar-phone" 
                  checked={platforms.phone}
                  onCheckedChange={() => togglePlatform("phone")}
                />
                <Label htmlFor="sidebar-phone">Phone</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sidebar-email" 
                  checked={platforms.email}
                  onCheckedChange={() => togglePlatform("email")}
                />
                <Label htmlFor="sidebar-email">Email</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
