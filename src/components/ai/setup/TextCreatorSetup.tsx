
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface TextCreatorSetupProps {
  onChange: (settings: Record<string, any>) => void;
}

export const TextCreatorSetup: React.FC<TextCreatorSetupProps> = ({ onChange }) => {
  const [settings, setSettings] = useState({
    fullName: "",
    jobTitle: "",
    companyName: "",
    emailAddress: "",
    phoneNumber: "",
    communicationStyle: "balanced",
    detailLevel: "balanced",
    contentTypes: {
      emailSignature: true,
      emailTemplates: true,
      businessDocuments: false,
      socialMedia: false,
      presentationContent: false,
    },
    personalNotes: ""
  });

  const handleChange = (field: string, value: any) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    onChange(newSettings);
  };

  const handleContentTypeChange = (type: string, checked: boolean) => {
    const newContentTypes = { ...settings.contentTypes, [type]: checked };
    const newSettings = { ...settings, contentTypes: newContentTypes };
    setSettings(newSettings);
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Text Creator Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Provide your information to help the AI create personalized text content for you.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Your Full Name</Label>
          <Input 
            id="fullName" 
            placeholder="John Doe" 
            value={settings.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input 
            id="jobTitle" 
            placeholder="Marketing Manager" 
            value={settings.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="companyName">Company or Organization</Label>
          <Input 
            id="companyName" 
            placeholder="ABC Corporation" 
            value={settings.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input 
              id="emailAddress" 
              placeholder="john.doe@example.com" 
              type="email"
              value={settings.emailAddress}
              onChange={(e) => handleChange("emailAddress", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              placeholder="+1 (555) 123-4567" 
              value={settings.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Communication Style</Label>
          <RadioGroup 
            value={settings.communicationStyle} 
            onValueChange={(value) => handleChange("communicationStyle", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="formal" id="formal_content" />
              <Label htmlFor="formal_content" className="cursor-pointer">Formal & Professional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="casual_content" />
              <Label htmlFor="casual_content" className="cursor-pointer">Casual & Conversational</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_content" />
              <Label htmlFor="balanced_content" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Detail Level</Label>
          <RadioGroup 
            value={settings.detailLevel} 
            onValueChange={(value) => handleChange("detailLevel", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id="concise_content" />
              <Label htmlFor="concise_content" className="cursor-pointer">Concise & Brief</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed_content" />
              <Label htmlFor="detailed_content" className="cursor-pointer">Detailed & Comprehensive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced_detail_content" />
              <Label htmlFor="balanced_detail_content" className="cursor-pointer">Balanced</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Content Types</Label>
          <p className="text-sm text-muted-foreground">
            Select the types of content you'd like help creating
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emailSignature" 
                checked={settings.contentTypes.emailSignature}
                onCheckedChange={(checked) => 
                  handleContentTypeChange("emailSignature", checked as boolean)
                }
              />
              <Label htmlFor="emailSignature" className="cursor-pointer">Email Signatures</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emailTemplates" 
                checked={settings.contentTypes.emailTemplates}
                onCheckedChange={(checked) => 
                  handleContentTypeChange("emailTemplates", checked as boolean)
                }
              />
              <Label htmlFor="emailTemplates" className="cursor-pointer">Email Templates</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="businessDocuments" 
                checked={settings.contentTypes.businessDocuments}
                onCheckedChange={(checked) => 
                  handleContentTypeChange("businessDocuments", checked as boolean)
                }
              />
              <Label htmlFor="businessDocuments" className="cursor-pointer">Business Documents</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="socialMedia" 
                checked={settings.contentTypes.socialMedia}
                onCheckedChange={(checked) => 
                  handleContentTypeChange("socialMedia", checked as boolean)
                }
              />
              <Label htmlFor="socialMedia" className="cursor-pointer">Social Media Content</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="presentationContent" 
                checked={settings.contentTypes.presentationContent}
                onCheckedChange={(checked) => 
                  handleContentTypeChange("presentationContent", checked as boolean)
                }
              />
              <Label htmlFor="presentationContent" className="cursor-pointer">Presentation Content</Label>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <Label htmlFor="personalNotes">Additional Notes</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Any specific preferences for your content that the AI should know
          </p>
          <Textarea 
            id="personalNotes"
            placeholder="Example: I prefer a concise writing style with bullet points when appropriate."
            rows={3}
            value={settings.personalNotes}
            onChange={(e) => handleChange("personalNotes", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
