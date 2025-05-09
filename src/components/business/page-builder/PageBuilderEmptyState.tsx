
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface PageBuilderEmptyStateProps {
  createPage: (data: any) => Promise<any>;
}

const PageBuilderEmptyState: React.FC<PageBuilderEmptyStateProps> = ({ createPage }) => {
  const [pageName, setPageName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  
  const handleCreatePage = async () => {
    if (!pageName.trim()) {
      toast({
        title: "Page name required",
        description: "Please enter a name for your business page",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      await createPage({
        userId: user?.id,  // Changed from business_id to userId to match the API
        pageData: {        // Added pageData object to match the mutation function
          pageSetup: {
            businessName: pageName,
            alignment: "center",
            visible: true
          },
          logo: { url: "", shape: "circle", alignment: "center", visible: true },
          bookings: { viewStyle: "grid", templates: [], visible: true },
          socialInline: { 
            style: "icon", 
            platforms: {
              whatsapp: false,
              whatsappBusiness: false,
              facebook: false,
              instagram: false,
              googleMaps: false,
              phone: false,
              email: false
            },
            visible: true
          },
          workingHours: { 
            layout: "card", 
            hours: [], 
            visible: true
          },
          chatbot: { 
            position: "right", 
            embedCode: "", 
            visible: false
          },
          theme: {
            backgroundColor: "#ffffff",
            textColor: "#000000",
            fontStyle: "sans-serif"
          },
          socialSidebar: { 
            position: "right", 
            platforms: {
              whatsapp: false,
              whatsappBusiness: false,
              facebook: false,
              instagram: false,
              googleMaps: false,
              phone: false,
              email: false
            },
            visible: false
          },
          contactInfo: {
            email: "",
            whatsapp: "",
            whatsappBusiness: "",
            phone: "",
            facebook: "",
            googleMaps: "",
            instagram: ""
          },
          sectionOrder: ["pageSetup", "logo", "bookings", "socialInline", "workingHours"],
          published: false
        }
      });
      
      toast({
        title: "Business page created",
        description: "You can now start building your page",
      });
    } catch (error: any) {
      console.error("Error creating page:", error);
      toast({
        title: "Error creating page",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Business Page</CardTitle>
          <CardDescription>
            Get started by creating a business page that you can customize using our AI-powered builder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-name">Business Page Name</Label>
            <Input
              id="page-name"
              placeholder="Enter your business name"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleCreatePage}
            disabled={isCreating || !pageName.trim()}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Create Business Page
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageBuilderEmptyState;
