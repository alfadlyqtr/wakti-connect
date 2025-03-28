
import React from "react";
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

const BookingTemplateSection: React.FC = () => {
  const { contentData, handleInputChange, setContentData, setIsDirty } = useSectionEditor();
  const { templates, isLoading } = useBookingTemplates();
  const [selectedTemplates, setSelectedTemplates] = React.useState<string[]>(
    contentData.selectedTemplates || []
  );

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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const publishedTemplates = templates.filter(t => t.is_published);

  return (
    <Tabs defaultValue="content">
      <TabsList className="mb-4">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="templates">Select Templates</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
    </Tabs>
  );
};

export default BookingTemplateSection;
