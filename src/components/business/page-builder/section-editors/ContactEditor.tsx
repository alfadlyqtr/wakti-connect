
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EditorProps } from "./types";
import LocationPicker from "@/components/events/location/LocationPicker";

const ContactEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
  const [useMapAddress, setUseMapAddress] = useState(true);
  
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
        <LocationPicker
          value={contentData.address || ""}
          onChange={handleLocationChange}
          placeholder="123 Business Street, City, Country"
          className="w-full"
        />
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
    </>
  );
};

export default ContactEditor;
