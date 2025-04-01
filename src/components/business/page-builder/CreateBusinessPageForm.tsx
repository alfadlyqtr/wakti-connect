
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, BriefcaseBusiness } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateSlug } from "@/utils/string-utils";
import { BusinessPage } from "@/types/business.types";

interface CreateBusinessPageFormProps {
  pageData: Partial<BusinessPage>;
  handlePageDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  createPage: any;
  handleSavePageSettings: () => void;
}

const CreateBusinessPageForm: React.FC<CreateBusinessPageFormProps> = ({
  pageData,
  handlePageDataChange,
  createPage,
  handleSavePageSettings
}) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pageData.page_title) {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please provide a title for your business page",
      });
      return;
    }
    
    setIsCreating(true);
    
    // Generate a slug if none exists
    const dataToSave = {
      ...pageData,
      business_id: session?.user.id,
      page_slug: pageData.page_slug || generateSlug(pageData.page_title)
    };
    
    createPage.mutate(dataToSave, {
      onSuccess: () => {
        setIsCreating(false);
      },
      onError: (error: any) => {
        setIsCreating(false);
        toast({
          variant: "destructive",
          title: "Error creating page",
          description: error.message || "Something went wrong. Please try again."
        });
      }
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BriefcaseBusiness className="h-6 w-6 text-primary" />
            <CardTitle>Create Your Business Page</CardTitle>
          </div>
          <CardDescription>
            Set up your public business page to showcase your services and connect with customers.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="page_title">Page Title*</Label>
              <Input
                id="page_title"
                name="page_title"
                value={pageData.page_title}
                onChange={handlePageDataChange}
                placeholder="Your Business Name"
                required
              />
              <p className="text-sm text-muted-foreground">
                This will be displayed as the title of your business page.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={pageData.description}
                onChange={handlePageDataChange}
                placeholder="Tell us about your business..."
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                A brief description of your business that will be shown on your page.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex">
                  <Input
                    type="color"
                    id="primary_color"
                    name="primary_color"
                    value={pageData.primary_color}
                    onChange={handlePageDataChange}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={pageData.primary_color}
                    onChange={handlePageDataChange}
                    name="primary_color"
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex">
                  <Input
                    type="color"
                    id="secondary_color"
                    name="secondary_color"
                    value={pageData.secondary_color}
                    onChange={handlePageDataChange}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={pageData.secondary_color}
                    onChange={handlePageDataChange}
                    name="secondary_color"
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Business Page'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateBusinessPageForm;
