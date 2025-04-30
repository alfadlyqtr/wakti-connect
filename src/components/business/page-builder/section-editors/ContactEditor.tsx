
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ContactEditorProps {
  data: any;
  onChange: (data: any) => void;
}

const ContactEditor: React.FC<ContactEditorProps> = ({ data, onChange }) => {
  const [showLocation, setShowLocation] = useState(Boolean(data?.location));
  
  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleLocationChange = (location: string) => {
    handleChange("location", location);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={data?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Contact Us"
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={data?.subtitle || ""}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          placeholder="Get in touch with our team"
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data?.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
          rows={4}
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-location">Show Location</Label>
          <Switch
            id="show-location"
            checked={showLocation}
            onCheckedChange={(checked) => {
              setShowLocation(checked);
              if (!checked) handleChange("location", "");
            }}
          />
        </div>
        
        {showLocation && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label htmlFor="location">Location Address</Label>
                <Input
                  id="location"
                  value={data?.location || ""}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  placeholder="123 Business Ave, City, State"
                  className="w-full"
                />
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Enter a full address to enable map display</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <Label htmlFor="email">Contact Email</Label>
        <Input
          id="email"
          value={data?.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="contact@example.com"
          type="email"
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="phone">Contact Phone</Label>
        <Input
          id="phone"
          value={data?.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="(123) 456-7890"
        />
      </div>
    </div>
  );
};

export default ContactEditor;
