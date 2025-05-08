
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GripVertical } from "lucide-react";
import { useBusinessPage, SocialStyle } from "../../context/BusinessPageContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";

export const SocialInlineSection = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const { visible, style, platforms } = pageData.socialInline;

  const toggleVisibility = () => {
    updateSectionData("socialInline", { visible: !visible });
  };

  const handleStyleChange = (value: string) => {
    if (value as SocialStyle) {
      updateSectionData("socialInline", { style: value as SocialStyle });
    }
  };

  const togglePlatform = (platform: keyof typeof platforms) => {
    updateSectionData("socialInline", {
      platforms: {
        ...platforms,
        [platform]: !platforms[platform]
      }
    });
  };

  return (
    <Card className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <CardHeader className="pl-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">4. Social Media Icons</CardTitle>
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
            <Label>Icon Style</Label>
            <ToggleGroup 
              type="single" 
              value={style}
              onValueChange={handleStyleChange}
              className="flex justify-start"
            >
              <ToggleGroupItem value="icon" aria-label="Icon style">
                Icon Only
              </ToggleGroupItem>
              <ToggleGroupItem value="button" aria-label="Button style">
                Button Style
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <Label>Social Platforms</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="whatsapp" 
                  checked={platforms.whatsapp} 
                  onCheckedChange={() => togglePlatform("whatsapp")}
                />
                <Label htmlFor="whatsapp">WhatsApp</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="whatsappBusiness" 
                  checked={platforms.whatsappBusiness}
                  onCheckedChange={() => togglePlatform("whatsappBusiness")}
                />
                <Label htmlFor="whatsappBusiness">WhatsApp Business</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="facebook" 
                  checked={platforms.facebook}
                  onCheckedChange={() => togglePlatform("facebook")}
                />
                <Label htmlFor="facebook">Facebook</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="instagram" 
                  checked={platforms.instagram}
                  onCheckedChange={() => togglePlatform("instagram")}
                />
                <Label htmlFor="instagram">Instagram</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="googleMaps" 
                  checked={platforms.googleMaps}
                  onCheckedChange={() => togglePlatform("googleMaps")}
                />
                <Label htmlFor="googleMaps">Google Maps</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="phone" 
                  checked={platforms.phone}
                  onCheckedChange={() => togglePlatform("phone")}
                />
                <Label htmlFor="phone">Phone</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email" 
                  checked={platforms.email}
                  onCheckedChange={() => togglePlatform("email")}
                />
                <Label htmlFor="email">Email</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
