
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useAIChatOperations } from "@/hooks/ai/operations/useAIChatOperations";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantMessage } from "@/components/ai/message/AIAssistantMessage";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { SectionType } from "@/types/business.types";

interface AIPageBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPageGenerated?: (data: any) => void;
}

const questionnaire = [
  { id: "businessType", label: "What type of business do you have?", placeholder: "E.g., restaurant, salon, consulting, etc." },
  { id: "businessStyle", label: "What style do you prefer for your page?", placeholder: "E.g., modern, professional, playful, elegant, etc." },
  { id: "primaryColor", label: "What's your primary brand color?", placeholder: "E.g., blue, red, #FF5500, etc." },
  { id: "services", label: "What are your main services or products?", placeholder: "List your top services or products" },
  { id: "contactInfo", label: "Any specific contact information to include?", placeholder: "E.g., specific hours, phone, location, etc." },
];

// Basic section types to generate with the AI
const basicSectionTypes: SectionType[] = ['header', 'about', 'contact', 'hours', 'booking'];

export const AIPageBuilder: React.FC<AIPageBuilderProps> = ({ 
  open, 
  onOpenChange,
  onPageGenerated 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("questionnaire");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  const { messages, sendMessage, clearMessages } = useAIChatOperations(
    user?.id,
    user?.name || "there"
  );

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const generateFromQuestionnaire = async () => {
    setGenerating(true);
    setActiveTab("results");
    setIsPreviewReady(false);
    
    // Format the answers into a prompt
    const formattedPrompt = `
      Please help me create a business landing page with the following details:
      Business Type: ${answers.businessType || "Not specified"}
      Style Preference: ${answers.businessStyle || "Not specified"}
      Primary Color: ${answers.primaryColor || "Not specified"}
      Main Services: ${answers.services || "Not specified"}
      Contact Information: ${answers.contactInfo || "Not specified"}
      
      Based on this information, generate page content for a business landing page. Provide the results in structured format that I can easily use to populate my business page.
      
      Focus on generating content for: header section, about section, services, and contact information.
    `;
    
    try {
      await sendMessage.mutateAsync(formattedPrompt);
      setGenerating(false);
      setIsPreviewReady(true);
      
      // Create sample preview data
      setPreviewData({
        businessType: answers.businessType || "Business",
        primaryColor: answers.primaryColor || "#7C3AED",
        sections: basicSectionTypes
      });
      
    } catch (error) {
      console.error("Error generating page:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your page content. Please try again.",
      });
      setGenerating(false);
    }
  };

  const generateFromCustomPrompt = async () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter your instructions for the AI assistant.",
        variant: "destructive",
      });
      return;
    }
    
    setGenerating(true);
    setActiveTab("results");
    setIsPreviewReady(false);
    
    try {
      await sendMessage.mutateAsync(customPrompt);
      setGenerating(false);
      setIsPreviewReady(true);
      
      // Create sample preview data
      setPreviewData({
        businessType: "Custom Business",
        primaryColor: "#7C3AED",
        sections: basicSectionTypes
      });
      
    } catch (error) {
      console.error("Error generating page:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your page content. Please try again.",
      });
      setGenerating(false);
    }
  };

  const handleClose = () => {
    clearMessages();
    setAnswers({});
    setCustomPrompt("");
    setPreviewData(null);
    setIsPreviewReady(false);
    setActiveTab("questionnaire");
    onOpenChange(false);
  };

  const applyGeneratedContent = () => {
    // Let the parent component know we've generated content
    // It will handle creating the actual sections
    if (onPageGenerated) {
      // Create a simplified data structure that can be used to create sections
      const generatedData = {
        sections: basicSectionTypes,
        content: messages.filter(m => m.role === "assistant").map(m => m.content),
        businessInfo: {
          type: answers.businessType || "Business",
          color: answers.primaryColor || "#7C3AED",
        }
      };
      
      onPageGenerated(generatedData);
    }
    
    handleClose();
  };

  const renderPreview = () => {
    if (!isPreviewReady || !previewData) return null;
    
    return (
      <div className="mt-6 border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Generated Page Preview</h3>
        <div className="space-y-2">
          <p><strong>Business Type:</strong> {previewData.businessType}</p>
          <p><strong>Primary Color:</strong> <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: previewData.primaryColor }}></span> {previewData.primaryColor}</p>
          <p><strong>Sections:</strong></p>
          <ul className="list-disc pl-5">
            {previewData.sections.map((section: string) => (
              <li key={section} className="capitalize">{section}</li>
            ))}
          </ul>
        </div>
        <Button onClick={applyGeneratedContent} className="mt-4">
          Apply to My Page
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            AI Page Builder Assistant
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
            <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="questionnaire" className="space-y-4 m-0">
              {questionnaire.map((question) => (
                <div key={question.id}>
                  <Label htmlFor={question.id}>{question.label}</Label>
                  <Textarea
                    id={question.id}
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    rows={2}
                  />
                </div>
              ))}
              
              <Button 
                onClick={generateFromQuestionnaire}
                className="w-full mt-4"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Page Content
              </Button>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4 m-0">
              <div>
                <Label htmlFor="customPrompt">Describe your ideal business page</Label>
                <Textarea
                  id="customPrompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe your business and what you'd like on your page. Be as specific as possible about colors, sections, and content you want."
                  rows={8}
                />
              </div>
              
              <Button 
                onClick={generateFromCustomPrompt}
                className="w-full mt-4"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate From Description
              </Button>
            </TabsContent>

            <TabsContent value="results" className="space-y-4 m-0 h-full">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">
                    Our AI is crafting your page content...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-[300px] overflow-y-auto pr-2 mb-4">
                    {messages.map((message) => (
                      <AIAssistantMessage key={message.id} message={message} />
                    ))}
                  </div>
                  
                  {isPreviewReady && renderPreview()}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
