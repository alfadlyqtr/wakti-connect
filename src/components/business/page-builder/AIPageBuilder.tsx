
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wand2, Eye, Settings2, Save, RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useBusinessPage } from "@/hooks/useBusinessPage";
import { useAIPageGenerator } from "@/hooks/useAIPageGenerator";
import AIPreviewPane from "./ai-builder/AIPreviewPane";
import AIPromptSuggestions from "./ai-builder/AIPromptSuggestions";
import AIBuilderSettings from "./ai-builder/AIBuilderSettings";
import PageSettingsTab from "./PageSettingsTab";
import { useIsMobile } from "@/hooks/use-mobile";
import PageBuilderEmptyState from "./PageBuilderEmptyState";

const AIPageBuilder = () => {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("ai-builder");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  
  const { 
    ownerBusinessPage,
    ownerPageLoading, 
    updatePage,
    createPage,
    updateSection,
    pageSections,
    autoSavePage,
    autoSaveField,
    getPublicPageUrl
  } = useBusinessPage();
  
  const { 
    generatePageContent, 
    isGenerating, 
    generatedSections,
    lastGeneratedPrompt,
    resetGeneration,
    applyGeneratedContent
  } = useAIPageGenerator();

  // Focus on prompt input when component mounts
  useEffect(() => {
    if (promptInputRef.current && activeTab === "ai-builder") {
      promptInputRef.current.focus();
    }
  }, [activeTab]);

  // Handle input change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  // Handle prompt submission
  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what you'd like your page to include",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await generatePageContent(prompt, ownerBusinessPage?.id);
      
      toast({
        title: "Page content generated",
        description: "Review and apply the generated content",
      });
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Error generating content",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };
  
  // Handle applying generated content
  const handleApplyContent = async () => {
    if (!ownerBusinessPage || !generatedSections || generatedSections.length === 0) {
      toast({
        title: "No content to apply",
        description: "Please generate content first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await applyGeneratedContent(ownerBusinessPage.id, generatedSections);
      
      toast({
        title: "Content applied successfully",
        description: "Your business page has been updated",
      });
      
      // Switch to preview tab
      setActiveTab("preview");
      
    } catch (error: any) {
      console.error("Error applying content:", error);
      toast({
        title: "Error applying content",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  // Handle input for settings fields with auto-save
  const handleInputChangeWithAutoSave = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    autoSaveField(name, value);
  };

  // Handle toggle for settings with auto-save
  const handleToggleWithAutoSave = (name: string, checked: boolean) => {
    autoSaveField(name, checked);
  };

  if (ownerPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ownerBusinessPage) {
    return <PageBuilderEmptyState createPage={createPage} />;
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="ai-builder" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>AI Builder</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>Preview</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span className={isMobile ? "hidden" : "inline"}>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* AI Builder Tab */}
        <TabsContent value="ai-builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Page Builder</CardTitle>
              <CardDescription>
                Describe what you want on your business page and our AI will create it for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Textarea
                  ref={promptInputRef}
                  placeholder="Describe your business and what you want on your page... (e.g., 'Create a landing page for my hair salon with a booking system, contact form, and Instagram feed')"
                  value={prompt}
                  onChange={handlePromptChange}
                  className="min-h-[120px] resize-y"
                />
                
                <AIPromptSuggestions onSelectSuggestion={(suggestion) => setPrompt(prev => `${prev} ${suggestion}`.trim())} />
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setPrompt("")}
                    disabled={!prompt || isGenerating}
                  >
                    Clear
                  </Button>
                  <Button 
                    onClick={handleGenerateContent}
                    disabled={!prompt || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* AI Preview */}
              {generatedSections && generatedSections.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Generated Content Preview</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={resetGeneration}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleApplyContent}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Apply Changes
                      </Button>
                    </div>
                  </div>
                  
                  <AIPreviewPane 
                    sections={generatedSections} 
                    businessPage={ownerBusinessPage}
                  />
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      className="w-full max-w-sm" 
                      onClick={handleApplyContent}
                    >
                      Apply Changes to Your Business Page
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* AI Builder Settings */}
              <AIBuilderSettings />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <iframe 
            src={`${window.location.origin}/${ownerBusinessPage.page_slug}/preview`} 
            className="w-full h-[600px] border rounded-lg"
            title="Business page preview"
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <PageSettingsTab 
            pageData={ownerBusinessPage}
            businessId={ownerBusinessPage.business_id}
            handleInputChangeWithAutoSave={handleInputChangeWithAutoSave}
            handleToggleWithAutoSave={handleToggleWithAutoSave}
            getPublicPageUrl={getPublicPageUrl}
            updatePage={updatePage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPageBuilder;
