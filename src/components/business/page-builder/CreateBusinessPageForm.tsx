
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { BusinessPage } from "@/types/business.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CreateBusinessPageFormProps {
  pageData: {
    page_title: string;
    page_slug: string;
    description: string;
    is_published: boolean;
    chatbot_enabled: boolean;
    primary_color: string;
    secondary_color: string;
  };
  handlePageDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  createPage: ReturnType<typeof useMutation<BusinessPage, Error, any>>;
  handleSavePageSettings: () => void;
}

const CreateBusinessPageForm: React.FC<CreateBusinessPageFormProps> = ({
  pageData,
  handlePageDataChange,
  createPage,
  handleSavePageSettings
}) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Create Your Business Landing Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Your Business Page</CardTitle>
          <CardDescription>
            Set up your business landing page to showcase your services and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page_title">Business Name</Label>
            <Input
              id="page_title"
              name="page_title"
              value={pageData.page_title}
              onChange={handlePageDataChange}
              placeholder="My Business"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page_slug">
              Page URL Slug
              <span className="text-xs text-muted-foreground ml-2">
                (e.g. my-business)
              </span>
            </Label>
            <div className="flex items-center">
              <div className="text-sm text-muted-foreground mr-2">
                /business/
              </div>
              <Input
                id="page_slug"
                name="page_slug"
                value={pageData.page_slug}
                onChange={handlePageDataChange}
                placeholder="my-business"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              name="description"
              value={pageData.description || ""}
              onChange={handlePageDataChange}
              placeholder="Describe your business in a few sentences"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePageSettings} disabled={createPage.isPending}>
            {createPage.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Page...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Business Page
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateBusinessPageForm;
