import React from "react";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import LocationPicker from "@/components/events/location/LocationPicker";

interface ContactEditorProps {
  contentData: Record<string, any>;
  handleInputChange: (name: string, value: any) => void;
}

const ContactEditor: React.FC<ContactEditorProps> = ({ contentData, handleInputChange }) => {
  const handleAddSocialMedia = () => {
    const currentSocial = contentData.socialMedia || [];
    handleInputChange('socialMedia', [
      ...currentSocial,
      { platform: '', url: '' }
    ]);
  };

  const handleRemoveSocialMedia = (index: number) => {
    const currentSocial = [...(contentData.socialMedia || [])];
    currentSocial.splice(index, 1);
    handleInputChange('socialMedia', currentSocial);
  };

  const handleSocialMediaChange = (index: number, field: string, value: string) => {
    const currentSocial = [...(contentData.socialMedia || [])];
    currentSocial[index] = {
      ...currentSocial[index],
      [field]: value
    };
    handleInputChange('socialMedia', currentSocial);
  };

  // Modified handlers for standard inputs to match the expected function signature
  const handleStandardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e.target.name || e.target.id, e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          name="title"
          value={contentData.title || ''}
          onChange={handleStandardInputChange}
          placeholder="Contact Us"
        />
        <FormDescription>
          The main heading for your contact section
        </FormDescription>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          name="subtitle"
          value={contentData.subtitle || ''}
          onChange={handleStandardInputChange}
          placeholder="Get in touch with us"
        />
        <FormDescription>
          A short subtitle that appears below the main heading
        </FormDescription>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={contentData.description || ''}
          onChange={handleStandardInputChange}
          placeholder="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
          rows={3}
        />
        <FormDescription>
          A brief description of how customers can contact you
        </FormDescription>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contact" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contentData.email || ''}
              onChange={handleStandardInputChange}
              placeholder="your@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={contentData.phone || ''}
              onChange={handleStandardInputChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <LocationPicker 
              location={contentData.address || ''} 
              locationTitle="" 
              onLocationChange={(location) => handleInputChange('address', location)}
              value={contentData.address}
              onChange={handleInputChange}
              className="mt-2" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">Business Hours</Label>
            <Textarea
              id="hours"
              name="hours"
              value={contentData.hours || ''}
              onChange={handleStandardInputChange}
              placeholder="Monday - Friday: 9am - 5pm&#10;Saturday: 10am - 4pm&#10;Sunday: Closed"
              rows={4}
            />
            <FormDescription>
              Enter each day on a new line
            </FormDescription>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4 pt-4">
          {(contentData.socialMedia || []).map((social: any, index: number) => (
            <Card key={index} className="border border-input">
              <CardContent className="pt-4 px-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Label>Social Media Platform {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSocialMedia(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`platform-${index}`}>Platform</Label>
                    <Input
                      id={`platform-${index}`}
                      value={social.platform || ''}
                      onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                      placeholder="Instagram"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`url-${index}`}>URL</Label>
                    <Input
                      id={`url-${index}`}
                      value={social.url || ''}
                      onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                      placeholder="https://instagram.com/yourbusiness"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddSocialMedia}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Social Media
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactEditor;
