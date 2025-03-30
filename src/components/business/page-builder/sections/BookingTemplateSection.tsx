
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { Label } from "@/components/ui/label";
import { BookingTemplateCard } from "@/components/business/page-builder/components/BookingTemplateCard";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { Button } from "@/components/ui/button";
import { BookingTemplateWithRelations } from "@/types/booking.types";
import { useAuth } from "@/hooks/auth";

const BookingTemplateSection: React.FC = () => {
  const { contentData, handleInputChange, setContentData, setIsDirty } = useSectionEditor();
  const { user } = useAuth();
  const { templates, isLoading } = useBookingTemplates(user?.id);
  const [selectedTemplates, setSelectedTemplates] = React.useState<string[]>(
    contentData.selectedTemplates || []
  );

  // Update the content data when templates are loaded
  useEffect(() => {
    if (templates?.length > 0 && selectedTemplates.length === 0 && contentData.selectedTemplates?.length === 0) {
      // Auto-select published templates if none are selected
      const publishedTemplateIds = templates
        .filter(t => t.is_published)
        .map(t => t.id);
      
      if (publishedTemplateIds.length > 0) {
        setSelectedTemplates(publishedTemplateIds);
        setContentData({
          ...contentData,
          selectedTemplates: publishedTemplateIds
        });
        setIsDirty(true);
      }
    }
  }, [templates, contentData, selectedTemplates.length, setContentData, setIsDirty]);

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => {
      const newSelection = prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId];
      
      // Update content data
      const newContentData = {
        ...contentData,
        selectedTemplates: newSelection
      };
      
      setContentData(newContentData);
      setIsDirty(true);
      
      return newSelection;
    });
  };

  const handleDisplayChange = (value: string) => {
    setContentData({
      ...contentData,
      displayAs: value
    });
    setIsDirty(true);
  };

  const handleInputChangeWithOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    setIsDirty(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter to show only published templates
  const publishedTemplates = (templates as BookingTemplateWithRelations[])?.filter(t => t.is_published) || [];

  return (
    <Tabs defaultValue="content">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="templates">Select Templates</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="button">Button Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              name="title"
              value={contentData.title || "Our Booking Services"}
              onChange={handleInputChange}
              placeholder="Section Title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Section Description</Label>
            <Textarea
              id="description"
              name="description"
              value={contentData.description || "Book our services online"}
              onChange={handleInputChange}
              placeholder="Description"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              name="buttonText"
              value={contentData.buttonText || "Book Now"}
              onChange={handleInputChange}
              placeholder="Button Text"
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="templates">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select which booking templates to display on your business page.
            Only published templates can be selected.
          </p>
          
          {publishedTemplates.length === 0 ? (
            <div className="p-8 text-center border rounded-lg">
              <p className="text-muted-foreground">
                No published booking templates found. Create and publish templates 
                in the Booking section first.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/dashboard/bookings?tab=templates'}
              >
                Go to Booking Templates
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {publishedTemplates.map(template => (
                <Card key={template.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <BookingTemplateCard template={template} preview={true} />
                      </div>
                      <div className="ml-4">
                        <Switch
                          checked={selectedTemplates.includes(template.id)}
                          onCheckedChange={() => handleTemplateToggle(template.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="appearance">
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayAs">Display Layout</Label>
            <Select 
              value={contentData.displayAs || "grid"} 
              onValueChange={handleDisplayChange}
            >
              <SelectTrigger id="displayAs">
                <SelectValue placeholder="Select display style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showDuration">Show Duration</Label>
            <Switch
              id="showDuration"
              name="showDuration"
              checked={contentData.showDuration !== false}
              onCheckedChange={(checked) => {
                setContentData({
                  ...contentData,
                  showDuration: checked
                });
                setIsDirty(true);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showPrice">Show Price</Label>
            <Switch
              id="showPrice"
              name="showPrice"
              checked={contentData.showPrice !== false}
              onCheckedChange={(checked) => {
                setContentData({
                  ...contentData,
                  showPrice: checked
                });
                setIsDirty(true);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showDescription">Show Description</Label>
            <Switch
              id="showDescription"
              name="showDescription"
              checked={contentData.showDescription !== false}
              onCheckedChange={(checked) => {
                setContentData({
                  ...contentData,
                  showDescription: checked
                });
                setIsDirty(true);
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="displayAsCards">Display as Cards</Label>
            <Switch
              id="displayAsCards"
              name="displayAsCards"
              checked={contentData.displayAsCards !== false}
              onCheckedChange={(checked) => {
                setContentData({
                  ...contentData,
                  displayAsCards: checked
                });
                setIsDirty(true);
              }}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="button">
        <div className="space-y-4">
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              name="buttonText"
              value={contentData.buttonText || "Book Now"}
              onChange={handleInputChangeWithOptions}
              placeholder="Book Now"
            />
          </div>
          
          <div>
            <Label htmlFor="buttonColor">Button Color</Label>
            <div className="flex gap-2">
              <Input
                id="buttonColor"
                name="buttonColor"
                type="color"
                value={contentData.buttonColor || "#7C3AED"}
                onChange={handleInputChangeWithOptions}
                className="w-20"
              />
              <Input
                name="buttonColor"
                value={contentData.buttonColor || "#7C3AED"}
                onChange={handleInputChangeWithOptions}
                placeholder="#7C3AED"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="buttonTextColor">Button Text Color</Label>
            <div className="flex gap-2">
              <Input
                id="buttonTextColor"
                name="buttonTextColor"
                type="color"
                value={contentData.buttonTextColor || "#FFFFFF"}
                onChange={handleInputChangeWithOptions}
                className="w-20"
              />
              <Input
                name="buttonTextColor"
                value={contentData.buttonTextColor || "#FFFFFF"}
                onChange={handleInputChangeWithOptions}
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label>Preview</Label>
            <div className="mt-2">
              <Button 
                style={{
                  backgroundColor: contentData.buttonColor || undefined,
                  color: contentData.buttonTextColor || undefined
                }}
              >
                {contentData.buttonText || "Book Now"}
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default BookingTemplateSection;
