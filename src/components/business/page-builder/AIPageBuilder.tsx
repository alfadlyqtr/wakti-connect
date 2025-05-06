
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Wand2, Loader2, Settings2, Eye, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useBusinessPage } from "@/hooks/business-page";
import AIPromptSuggestions from "./ai-builder/AIPromptSuggestions";
import AIPreviewPane from "./ai-builder/AIPreviewPane";
import AIBuilderSettings from "./ai-builder/AIBuilderSettings";
import PagePreviewTab from "./PagePreviewTab";
import { useAIPageGenerator } from "@/hooks/useAIPageGenerator";
import PageBuilderEmptyState from "./PageBuilderEmptyState";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AIPageBuilder: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const { user } = useAuth();
  const { 
    ownerBusinessPage, 
    ownerPageLoading, 
    createPage,
    getPublicPageUrl
  } = useBusinessPage();
  
  const { 
    generatePageContent, 
    applyGeneratedContent, 
    isGenerating, 
    generatedSections, 
    lastGeneratedPrompt,
    resetGeneration
  } = useAIPageGenerator();

  // Create URL state to show in the builder
  const [publicUrl, setPublicUrl] = useState<string>("#");
  
  // Update the URL whenever the page slug changes
  useEffect(() => {
    if (ownerBusinessPage?.page_slug) {
      setPublicUrl(getPublicPageUrl());
    }
  }, [ownerBusinessPage?.page_slug, getPublicPageUrl]);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }
    
    if (!ownerBusinessPage?.id) {
      toast({
        title: "No business page found",
        description: "Please create a business page first",
        variant: "destructive",
      });
      return;
    }
    
    setIsPrompting(true);
    
    try {
      await generatePageContent(prompt, ownerBusinessPage.id);
      toast({
        title: "Content generated",
        description: "Review the preview and apply changes when ready",
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPrompting(false);
    }
  };
  
  const handleApply = async () => {
    if (!generatedSections || !ownerBusinessPage?.id) {
      toast({
        title: "No content to apply",
        description: "Generate content first before applying",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await applyGeneratedContent(ownerBusinessPage.id, generatedSections);
      toast({
        title: "Changes applied",
        description: "Your business page has been updated",
        variant: "success",
      });
      resetGeneration();
    } catch (error: any) {
      console.error("Error applying changes:", error);
      toast({
        title: "Failed to apply changes",
        description: error.message || "An error occurred while applying changes",
        variant: "destructive",
      });
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(current => current ? `${current}\n${suggestion}` : suggestion);
  };

  // View page in new tab
  const handleViewPage = () => {
    if (publicUrl !== '#') {
      window.open(publicUrl, '_blank');
    } else {
      toast({
        title: "Page URL not available",
        description: "Please make sure your page has a valid slug",
        variant: "destructive",
      });
    }
  };
  
  if (ownerPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!ownerBusinessPage) {
    // If no business page exists yet, show the empty state with page creation form
    return (
      <PageBuilderEmptyState 
        createPage={(data) => createPage.mutateAsync(data)}
      />
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Business Page Builder</h1>
          <p className="text-muted-foreground">
            Describe what you want on your business page and let AI create it for you.
          </p>
        </div>

        {/* View Page Button */}
        {publicUrl !== '#' && (
          <Button 
            onClick={handleViewPage}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Your Live Page
          </Button>
        )}
      </div>

      {/* Page URL Display */}
      {publicUrl !== '#' && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="flex items-center justify-between">
            <span className="font-medium">Your public page URL: <span className="text-blue-700">{publicUrl}</span></span>
            <Button variant="outline" size="sm" onClick={() => {
              navigator.clipboard.writeText(publicUrl);
              toast({ title: "URL copied to clipboard" });
            }}>
              Copy URL
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="prompt">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prompt" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Prompt
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Content Preview
          </TabsTrigger>
          <TabsTrigger value="live-preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Live Preview
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompt" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder="Describe your business page. For example: 'Create a page for my hair salon with an about section, gallery, contact form, and booking feature.'"
                className="min-h-[200px] resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <AIPromptSuggestions onSelectSuggestion={handleSelectSuggestion} />
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  disabled={isPrompting}
                  onClick={() => setPrompt("")}
                >
                  Clear
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={isPrompting || !prompt.trim()}
                >
                  {isPrompting || isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {lastGeneratedPrompt && (
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium text-sm">Last prompt:</p>
              <p className="text-sm text-muted-foreground">{lastGeneratedPrompt}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 mt-4">
          {generatedSections ? (
            <>
              <AIPreviewPane 
                sections={generatedSections}
                businessPage={ownerBusinessPage}
              />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={resetGeneration}>
                  Cancel
                </Button>
                <Button onClick={handleApply}>
                  Apply Changes
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-2">
                  <Wand2 className="mx-auto h-12 w-12 text-muted-foreground/60" />
                  <h3 className="text-lg font-medium">No Preview Available</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate content first to see a preview
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* New Live Preview Tab */}
        <TabsContent value="live-preview" className="mt-4">
          <PagePreviewTab getPublicPageUrl={getPublicPageUrl} />
          <div className="flex justify-end mt-4">
            <Button onClick={handleViewPage} className="mt-4">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <AIBuilderSettings businessPage={ownerBusinessPage} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPageBuilder;
