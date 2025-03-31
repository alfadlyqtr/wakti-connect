import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EditorProps } from "./types";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import LocationPicker from "@/components/events/location/LocationPicker";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorInput } from "@/components/inputs/ColorInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const [isLocating, setIsLocating] = useState(false);
  
  const handleLocationChange = (value: string) => {
    const syntheticEvent = {
      target: {
        name: 'address',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleShowMapChange = (checked: boolean) => {
    const syntheticEvent = {
      target: {
        name: 'showMap',
        value: checked.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleEnableContactFormChange = (checked: boolean) => {
    const syntheticEvent = {
      target: {
        name: 'enableContactForm',
        value: checked.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleColorChange = (name: string, value: string) => {
    const syntheticEvent = {
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const locationStr = `Business Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
        
        const syntheticEvent = {
          target: {
            name: 'address',
            value: locationStr
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(syntheticEvent);
        
        const coordsEvent = {
          target: {
            name: 'coordinates',
            value: JSON.stringify({ lat: latitude, lng: longitude })
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(coordsEvent);
        
        toast({
          title: "Location Found",
          description: "Your current location has been added"
        });
        
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        
        let errorMessage = "Failed to get your location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  const handleSectionTemplateSelect = (templateId: string) => {
    const templates: Record<string, Record<string, any>> = {
      "simple": {
        title: "Contact Us",
        description: "Get in touch with us for any inquiries",
        email: "contact@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Business Street, City, State",
        showMap: true,
        contactFormTitle: "Send us a message",
        contactButtonLabel: "Send Message",
        contactButtonColor: "#3B82F6",
        formBackground: "#f5f5f5",
        formBorderRadius: "8px",
        layout: "sideBySide"
      },
      "modern": {
        title: "Get In Touch",
        description: "We'd love to hear from you! Reach out using the form below.",
        email: "hello@yourbusiness.com",
        phone: "+1 (123) 456-7890",
        address: "1234 Modern Ave, Suite 100, City, Country",
        showMap: true,
        contactFormTitle: "Send your message",
        contactButtonLabel: "Submit",
        contactButtonColor: "#6366F1",
        formBackground: "#ffffff",
        formBorderRadius: "12px",
        inputBorderRadius: "8px",
        inputBorderColor: "#e5e7eb",
        inputBackground: "#f9fafb",
        labelColor: "#4B5563",
        layout: "sideBySide"
      },
      "minimal": {
        title: "Contact",
        description: "We're here to help",
        email: "support@company.com",
        phone: "+1 (800) 123-4567",
        address: "100 Business Park, Floor 2, City",
        showMap: false,
        contactFormTitle: "Message Us",
        contactButtonLabel: "Send",
        contactButtonColor: "#000000",
        formBackground: "#ffffff",
        formBorderRadius: "0px",
        inputBorderRadius: "0px",
        inputBorderColor: "#000000",
        inputBackground: "#ffffff",
        labelColor: "#000000",
        layout: "formTop"
      },
      "colorful": {
        title: "Say Hello!",
        description: "We love hearing from our customers",
        email: "hello@brand.co",
        phone: "+1 (555) 987-6543",
        address: "500 Creative Avenue, City, State",
        showMap: true,
        contactFormTitle: "Drop Us a Line",
        contactButtonLabel: "Send it!",
        contactButtonColor: "#8B5CF6",
        formBackground: "#F5F3FF",
        formBorderRadius: "16px",
        inputBorderRadius: "8px",
        inputBorderColor: "#C4B5FD",
        inputBackground: "#ffffff",
        labelColor: "#6D28D9",
        layout: "formBottom"
      }
    };
    
    if (templates[templateId]) {
      Object.entries(templates[templateId]).forEach(([key, value]) => {
        const event = {
          target: {
            name: key,
            value: typeof value === 'boolean' ? value.toString() : value
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(event);
      });
      
      toast({
        title: "Template Applied",
        description: "The contact section has been updated with the selected template."
      });
    }
  };

  return (
    <Tabs defaultValue="content">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
        <TabsTrigger value="form" className="flex-1">Form</TabsTrigger>
        <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Section Title</Label>
          <Input
            id="title"
            name="title"
            value={contentData.title || ""}
            onChange={handleInputChange}
            placeholder="Contact Information"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Section Description</Label>
          <Textarea
            id="description"
            name="description"
            value={contentData.description || ""}
            onChange={handleInputChange}
            placeholder="Get in touch with us for any inquiries"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="layout">Layout</Label>
          <Select
            value={contentData.layout || "sideBySide"}
            onValueChange={(value) => {
              const event = {
                target: {
                  name: 'layout',
                  value
                }
              } as React.ChangeEvent<HTMLInputElement>;
              handleInputChange(event);
            }}
          >
            <SelectTrigger id="layout">
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sideBySide">Side by Side</SelectItem>
              <SelectItem value="formTop">Form on Top</SelectItem>
              <SelectItem value="formBottom">Form on Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 mt-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="address" className="font-medium">Business Address</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="flex items-center"
            >
              <Navigation className="mr-2 h-4 w-4" />
              {isLocating ? "Getting location..." : "Use Current Location"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <LocationPicker
              value={contentData.address || ""}
              onChange={handleLocationChange}
              placeholder="123 Business Street, City, Country"
              className="w-full"
            />
            
            {contentData.coordinates && (
              <div className="text-xs text-muted-foreground">
                <MapPin className="inline h-3 w-3 mr-1" />
                Location coordinates saved
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={contentData.phone || ""}
            onChange={handleInputChange}
            placeholder="+123 456 7890"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={contentData.email || ""}
            onChange={handleInputChange}
            placeholder="contact@yourbusiness.com"
            type="email"
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-4 mt-2 border-t">
          <Switch 
            id="showMap" 
            checked={contentData.showMap !== false}
            onCheckedChange={handleShowMapChange}
          />
          <Label htmlFor="showMap">Show Google Map</Label>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch 
            id="enableContactForm" 
            checked={contentData.enableContactForm !== false}
            onCheckedChange={handleEnableContactFormChange}
          />
          <Label htmlFor="enableContactForm">Enable Contact Form</Label>
        </div>
      </TabsContent>
      
      <TabsContent value="form" className="space-y-4">
        {contentData.enableContactForm !== false ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="contactFormTitle">Form Title</Label>
              <Input
                id="contactFormTitle"
                name="contactFormTitle"
                value={contentData.contactFormTitle || "Send us a message"}
                onChange={handleInputChange}
                placeholder="Send us a message"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactButtonLabel">Submit Button Label</Label>
              <Input
                id="contactButtonLabel"
                name="contactButtonLabel"
                value={contentData.contactButtonLabel || "Send Message"}
                onChange={handleInputChange}
                placeholder="Send Message"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactButtonColor">Button Color</Label>
              <ColorInput
                id="contactButtonColor"
                value={contentData.contactButtonColor || "#3B82F6"}
                onChange={(color) => handleColorChange("contactButtonColor", color)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactSuccessMessage">Success Message</Label>
              <Textarea
                id="contactSuccessMessage"
                name="contactSuccessMessage"
                value={contentData.contactSuccessMessage || "Thank you for your message. We'll get back to you soon!"}
                onChange={handleInputChange}
                placeholder="Thank you for your message. We'll get back to you soon!"
                rows={2}
              />
            </div>
            
            <div className="pt-4 mt-2 border-t space-y-4">
              <h3 className="font-medium">Form Styling</h3>
              
              <div className="space-y-2">
                <Label htmlFor="formBackground">Form Background Color</Label>
                <ColorInput
                  id="formBackground"
                  value={contentData.formBackground || "#f5f5f5"}
                  onChange={(color) => handleColorChange("formBackground", color)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="formBorderRadius">Form Border Radius</Label>
                <Input
                  id="formBorderRadius"
                  name="formBorderRadius"
                  value={contentData.formBorderRadius || "8px"}
                  onChange={handleInputChange}
                  placeholder="8px"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="formPadding">Form Padding</Label>
                <Input
                  id="formPadding"
                  name="formPadding"
                  value={contentData.formPadding || "20px"}
                  onChange={handleInputChange}
                  placeholder="20px"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inputBorderColor">Input Border Color</Label>
                <ColorInput
                  id="inputBorderColor"
                  value={contentData.inputBorderColor || "#e2e2e2"}
                  onChange={(color) => handleColorChange("inputBorderColor", color)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inputBorderRadius">Input Border Radius</Label>
                <Input
                  id="inputBorderRadius"
                  name="inputBorderRadius"
                  value={contentData.inputBorderRadius || "4px"}
                  onChange={handleInputChange}
                  placeholder="4px"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inputBackground">Input Background Color</Label>
                <ColorInput
                  id="inputBackground"
                  value={contentData.inputBackground || "#ffffff"}
                  onChange={(color) => handleColorChange("inputBackground", color)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inputTextColor">Input Text Color</Label>
                <ColorInput
                  id="inputTextColor"
                  value={contentData.inputTextColor || "#333333"}
                  onChange={(color) => handleColorChange("inputTextColor", color)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="labelColor">Label Color</Label>
                <ColorInput
                  id="labelColor"
                  value={contentData.labelColor || "#333333"}
                  onChange={(color) => handleColorChange("labelColor", color)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-4 border rounded-md">
            <p className="text-muted-foreground">Enable the contact form in the Content tab to access form styling options.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => handleEnableContactFormChange(true)}
            >
              Enable Contact Form
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="templates" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => handleSectionTemplateSelect("simple")}
          >
            <h3 className="font-medium mb-2">Simple</h3>
            <p className="text-sm text-muted-foreground">A clean and simple contact section with side-by-side layout.</p>
            <div className="mt-2 text-xs p-1 border rounded bg-blue-50 text-blue-600">Standard contact form with map</div>
          </div>
          
          <div 
            className="border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => handleSectionTemplateSelect("modern")}
          >
            <h3 className="font-medium mb-2">Modern</h3>
            <p className="text-sm text-muted-foreground">A contemporary design with rounded elements and subtle colors.</p>
            <div className="mt-2 text-xs p-1 border rounded bg-indigo-50 text-indigo-600">Stylish contact form with clean inputs</div>
          </div>
          
          <div 
            className="border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => handleSectionTemplateSelect("minimal")}
          >
            <h3 className="font-medium mb-2">Minimal</h3>
            <p className="text-sm text-muted-foreground">A minimalist black and white design with form on top.</p>
            <div className="mt-2 text-xs p-1 border rounded bg-gray-50 text-gray-600">Elegant monochrome styling</div>
          </div>
          
          <div 
            className="border rounded-md p-4 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => handleSectionTemplateSelect("colorful")}
          >
            <h3 className="font-medium mb-2">Colorful</h3>
            <p className="text-sm text-muted-foreground">A vibrant purple-themed design with form on bottom.</p>
            <div className="mt-2 text-xs p-1 border rounded bg-purple-50 text-purple-600">Playful and engaging style</div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ContactEditor;
