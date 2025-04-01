
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSectionEditor } from "@/hooks/useSectionEditor";
import { useTMWChatbot } from "@/hooks/tmw-chatbot";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatbotSection: React.FC = () => {
  const { section, contentData, updateContentField } = useSectionEditor();
  
  // Set up local state for the preview
  const [previewEnabled, setPreviewEnabled] = useState(contentData?.enabled || false);
  
  // Ensure default content values are set
  useEffect(() => {
    // Initialize default values if they don't exist
    if (contentData?.enabled === undefined) {
      updateContentField('enabled', true);
    }
    if (!contentData?.section_title) {
      updateContentField('section_title', 'Chat with Us');
    }
    if (!contentData?.chatbot_size) {
      updateContentField('chatbot_size', 'medium');
    }
    // Set default background pattern if not set
    if (contentData?.background_pattern === undefined) {
      updateContentField('background_pattern', 'none');
    }
    
    console.log("ChatbotSection initialized with content data:", contentData);
  }, [contentData, updateContentField]);
  
  // Create unique container ID for this section
  const chatbotContainerId = `tmw-chatbot-container-section-${section.id}`;
  
  // Initialize TMW Chatbot for preview
  useTMWChatbot(
    previewEnabled, 
    contentData?.chatbot_code,
    chatbotContainerId
  );
  
  const handleToggleChange = (checked: boolean) => {
    setPreviewEnabled(checked);
    updateContentField('enabled', checked);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    updateContentField(name, value);
  };
  
  const handleSelectChange = (field: string, value: string) => {
    console.log(`Setting ${field} to ${value}`);
    updateContentField(field, value);
  };
  
  // Apply pattern to preview container
  useEffect(() => {
    // This will help debug if pattern changes are recognized
    console.log("Background pattern updated:", contentData?.background_pattern);
  }, [contentData?.background_pattern]);
  
  // Get preview pattern styles for the container
  const getPreviewPatternStyle = () => {
    if (!contentData?.background_pattern || contentData.background_pattern === 'none') {
      return {};
    }
    
    const pattern = contentData.background_pattern;
    const backgroundPatternValue = 
      pattern === 'dots' ? 'radial-gradient(#00000022 1px, transparent 1px)' :
      pattern === 'grid' ? 'linear-gradient(to right, #00000011 1px, transparent 1px), linear-gradient(to bottom, #00000011 1px, transparent 1px)' :
      pattern === 'waves' ? 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 C 30 0, 70 0, 100 10 L 100 20 L 0 20 Z" fill="%2300000011"/%3E%3C/svg%3E")' :
      pattern === 'diagonal' ? 'repeating-linear-gradient(45deg, #00000011, #00000011 1px, transparent 1px, transparent 10px)' :
      pattern === 'circles' ? 'radial-gradient(circle, #00000011 10px, transparent 11px)' :
      pattern === 'triangles' ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0 L 30 52 L 60 0 Z" fill="%2300000011"/%3E%3C/svg%3E")' :
      pattern === 'hexagons' ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 15 L 15 0 L 45 0 L 60 15 L 60 45 L 45 60 L 15 60 L 0 45 Z" fill="%2300000011"/%3E%3C/svg%3E")' :
      pattern === 'stripes' ? 'repeating-linear-gradient(90deg, #00000011, #00000011 5px, transparent 5px, transparent 15px)' :
      pattern === 'zigzag' ? 'linear-gradient(135deg, #00000011 25%, transparent 25%) 0 0, linear-gradient(225deg, #00000011 25%, transparent 25%) 0 0' :
      pattern === 'confetti' ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Crect x="10" y="10" width="4" height="4" transform="rotate(45 12 12)" fill="%2300000022"/%3E%3Crect x="30" y="20" width="4" height="4" transform="rotate(30 32 22)" fill="%2300000022"/%3E%3Crect x="15" y="40" width="4" height="4" transform="rotate(60 17 42)" fill="%2300000022"/%3E%3Crect x="40" y="45" width="4" height="4" transform="rotate(12 42 47)" fill="%2300000022"/%3E%3C/svg%3E")' :
      pattern === 'bubbles' ? 'radial-gradient(circle at 25px 25px, #00000011 15px, transparent 16px), radial-gradient(circle at 75px 75px, #00000011 15px, transparent 16px)' : 'none';
      
    return {
      backgroundImage: backgroundPatternValue,
      backgroundSize: 'auto',
      backgroundRepeat: 'repeat'
    };
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>TMW AI Chatbot Section</CardTitle>
          <CardDescription>
            Add a TMW AI Chatbot to your business page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="chatbot_enabled">Enable Chatbot</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, the TMW AI Chatbot will be displayed in this section
              </p>
            </div>
            <Switch
              id="chatbot_enabled"
              checked={contentData?.enabled || false}
              onCheckedChange={handleToggleChange}
            />
          </div>
          
          {contentData?.enabled && (
            <>
              <div className="space-y-2 mt-4">
                <Label htmlFor="section_title">Section Title</Label>
                <Input
                  id="section_title"
                  name="section_title"
                  value={contentData?.section_title || ""}
                  onChange={handleInputChange}
                  placeholder="Our Chat Assistant"
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="section_description">Section Description (optional)</Label>
                <Textarea
                  id="section_description"
                  name="section_description"
                  value={contentData?.section_description || ""}
                  onChange={handleInputChange}
                  placeholder="Chat with our AI assistant to get quick answers"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="chatbot_size">Chatbot Size</Label>
                <Select 
                  value={contentData?.chatbot_size || "medium"}
                  onValueChange={(value) => handleSelectChange('chatbot_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chatbot size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="background_pattern">Background Pattern</Label>
                <Select 
                  value={contentData?.background_pattern || "none"}
                  onValueChange={(value) => handleSelectChange('background_pattern', value)}
                >
                  <SelectTrigger id="background_pattern">
                    <SelectValue placeholder="Select background pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="waves">Waves</SelectItem>
                    <SelectItem value="diagonal">Diagonal Lines</SelectItem>
                    <SelectItem value="circles">Circles</SelectItem>
                    <SelectItem value="triangles">Triangles</SelectItem>
                    <SelectItem value="hexagons">Hexagons</SelectItem>
                    <SelectItem value="stripes">Stripes</SelectItem>
                    <SelectItem value="zigzag">Zigzag</SelectItem>
                    <SelectItem value="confetti">Confetti</SelectItem>
                    <SelectItem value="bubbles">Bubbles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Paste the embed code provided by TMW AI Chatbot platform. 
                  This could be either a script tag or an iframe.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="chatbot_code">Chatbot Embed Code</Label>
                <Textarea
                  id="chatbot_code"
                  name="chatbot_code"
                  value={contentData?.chatbot_code || ""}
                  onChange={handleInputChange}
                  placeholder="Paste your TMW AI Chatbot embed code here"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2 mt-6">
                <Label>Chatbot Preview</Label>
                <div 
                  id={chatbotContainerId}
                  className="border border-dashed border-muted-foreground rounded-md p-4 min-h-[300px] flex items-center justify-center"
                  style={getPreviewPatternStyle()}
                >
                  {!contentData?.chatbot_code && (
                    <p className="text-muted-foreground">
                      Add your chatbot embed code to see a preview
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border mt-6">
                <h3 className="font-medium mb-2 text-primary flex items-center">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  Need an AI Chatbot?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get a powerful AI chatbot from TMW that can answer customer questions, assist with bookings, and provide 24/7 support.
                </p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 mb-3">
                  <li>Answer customer questions instantly, 24/7</li>
                  <li>Reduce support workload by automating inquiries</li>
                  <li>Boost conversions with real-time assistance</li>
                </ul>
                <a 
                  href="https://tmw.qa/ai-chat-bot/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary hover:underline text-sm font-medium"
                >
                  Learn more about TMW AI Chatbots <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotSection;
