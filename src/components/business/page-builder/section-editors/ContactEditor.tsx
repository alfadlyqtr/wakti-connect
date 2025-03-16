
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorProps } from "./types";

const ContactEditor: React.FC<EditorProps> = ({ contentData, handleInputChange }) => {
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
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={contentData.address || ""}
          onChange={handleInputChange}
          placeholder="123 Business Street, City, Country"
          rows={2}
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
    </>
  );
};

export default ContactEditor;
