
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EditorProps } from "./types";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";
import LocationPicker from "@/components/events/location/LocationPicker";
import { toast } from "@/components/ui/toast";

const ContactEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const [useMapAddress, setUseMapAddress] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  
  const handleLocationChange = (value: string) => {
    // Create a synthetic event object that matches the expected type
    const syntheticEvent = {
      target: {
        name: 'address',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleShowMapChange = (checked: boolean) => {
    // Create a synthetic event object that matches the expected type
    const syntheticEvent = {
      target: {
        name: 'showMap',
        value: checked.toString() // Convert boolean to string
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(syntheticEvent);
  };
  
  const handleEnableContactFormChange = (checked: boolean) => {
    // Create a synthetic event object that matches the expected type
    const syntheticEvent = {
      target: {
        name: 'enableContactForm',
        value: checked.toString() // Convert boolean to string
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
        
        // Try to get a reverse geocoded address (in a real app)
        // For now, we'll just use the coordinates
        const locationStr = `Business Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;
        
        // Create a synthetic event object
        const syntheticEvent = {
          target: {
            name: 'address',
            value: locationStr
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleInputChange(syntheticEvent);
        
        // Also store coordinates for future reference
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

  return (
    <>
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
        <Label htmlFor="address">Business Address</Label>
        <div className="space-y-2">
          <LocationPicker
            value={contentData.address || ""}
            onChange={handleLocationChange}
            placeholder="123 Business Street, City, Country"
            className="w-full"
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={getCurrentLocation}
            disabled={isLocating}
          >
            <Navigation className="mr-2 h-4 w-4" />
            {isLocating ? "Getting your location..." : "Use Current Location"}
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
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
      
      <div className="flex items-center space-x-2 pt-2">
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
      
      {contentData.enableContactForm && (
        <div className="space-y-2 border rounded p-3 mt-2">
          <div className="text-sm font-medium">Contact Form Settings</div>
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
            <Input
              id="contactButtonColor"
              name="contactButtonColor"
              type="color"
              value={contentData.contactButtonColor || "#3B82F6"}
              onChange={handleInputChange}
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
        </div>
      )}
    </>
  );
};

export default ContactEditor;
