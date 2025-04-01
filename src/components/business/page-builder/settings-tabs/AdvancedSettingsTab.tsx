import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ColorInput } from "@/components/inputs/ColorInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AdvancedSettingsTabProps {
  pageData: {
    id?: string;
    chatbot_enabled?: boolean;
    chatbot_code?: string;
    show_subscribe_button?: boolean;
    subscribe_button_text?: string;
    subscribe_button_position?: string;
    subscribe_button_style?: string;
    subscribe_button_size?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleToggleWithAutoSave: (name: string, checked: boolean) => void;
  updatePage: any;
}

const AdvancedSettingsTab: React.FC<AdvancedSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave,
  handleToggleWithAutoSave,
  updatePage
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [localChanges, setLocalChanges] = useState<Partial<AdvancedSettingsTabProps['pageData']>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalChanges(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    handleInputChangeWithAutoSave(e);
  };
  
  const handleLocalToggleChange = (name: string, checked: boolean) => {
    setLocalChanges(prev => ({ ...prev, [name]: checked }));
    setIsDirty(true);
    
    handleToggleWithAutoSave(name, checked);
  };

  const handleLocalSelectChange = (name: string, value: string) => {
    setLocalChanges(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    
    handleInputChangeWithAutoSave({
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };
  
  const handleSaveChanges = async () => {
    if (!pageData.id || !isDirty) {
      toast({
        title: "No changes to save",
        description: "No changes were detected in the advanced settings."
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updatePage.mutateAsync({
        pageId: pageData.id,
        data: localChanges
      });
      
      toast({
        title: "Advanced settings saved",
        description: "Your changes have been successfully saved."
      });
      
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving advanced settings:", error);
      toast({
        variant: "destructive",
        title: "Error saving settings",
        description: "There was a problem saving your changes. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getButtonPreviewStyles = () => {
    const style: React.CSSProperties = {
      backgroundColor: 
        pageData.subscribe_button_style === 'gradient' 
          ? `linear-gradient(135deg, ${pageData.primary_color || '#3B82F6'} 0%, ${pageData.secondary_color || '#10B981'} 100%)`
          : pageData.subscribe_button_style === 'outline' ? 'transparent' 
          : pageData.subscribe_button_style === 'minimal' ? 'transparent'
          : pageData.primary_color || '#3B82F6',
      color: pageData.subscribe_button_style === 'outline' || pageData.subscribe_button_style === 'minimal' 
          ? pageData.primary_color || '#3B82F6'
          : '#ffffff',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      fontSize: pageData.subscribe_button_size === 'small' ? '0.875rem' : 
              pageData.subscribe_button_size === 'large' ? '1.125rem' : '1rem',
      height: pageData.subscribe_button_size === 'small' ? '32px' : 
              pageData.subscribe_button_size === 'large' ? '48px' : '40px',
      minWidth: pageData.subscribe_button_size === 'small' ? '80px' : 
              pageData.subscribe_button_size === 'large' ? '140px' : '120px',
      border: pageData.subscribe_button_style === 'outline' ? `2px solid ${pageData.primary_color || '#3B82F6'}` : 'none',
      boxShadow: pageData.subscribe_button_style === 'minimal' ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    };
    
    return style;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscribe Button</CardTitle>
          <CardDescription>
            Configure your page's subscribe button to gain more followers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show_subscribe_button">Show Subscribe Button</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, visitors can subscribe to your business updates
                    </p>
                  </div>
                  <Switch
                    id="show_subscribe_button"
                    checked={pageData.show_subscribe_button !== false}
                    onCheckedChange={(checked) => handleLocalToggleChange('show_subscribe_button', checked)}
                  />
                </div>
                
                {pageData.show_subscribe_button !== false && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="subscribe_button_text">Button Text</Label>
                      <Input
                        id="subscribe_button_text"
                        name="subscribe_button_text"
                        value={pageData.subscribe_button_text || "Subscribe"}
                        onChange={handleLocalInputChange}
                        placeholder="Subscribe"
                      />
                      <p className="text-xs text-muted-foreground">
                        Customize what text appears on the subscribe button
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subscribe_button_position">Button Position</Label>
                      <Select 
                        value={pageData.subscribe_button_position || 'both'} 
                        onValueChange={(value) => handleLocalSelectChange('subscribe_button_position', value)}
                      >
                        <SelectTrigger id="subscribe_button_position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top Only</SelectItem>
                          <SelectItem value="floating">Floating Only</SelectItem>
                          <SelectItem value="both">Both (Top & Floating)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Choose where to display the subscribe button on your page
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="appearance">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subscribe_button_style">Button Style</Label>
                  <Select 
                    value={pageData.subscribe_button_style || 'gradient'} 
                    onValueChange={(value) => handleLocalSelectChange('subscribe_button_style', value)}
                  >
                    <SelectTrigger id="subscribe_button_style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="default">Solid</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subscribe_button_size">Button Size</Label>
                  <Select 
                    value={pageData.subscribe_button_size || 'default'} 
                    onValueChange={(value) => handleLocalSelectChange('subscribe_button_size', value)}
                  >
                    <SelectTrigger id="subscribe_button_size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Button Preview</Label>
                  <div className="p-4 border rounded-md flex items-center justify-center">
                    <div style={getButtonPreviewStyles()}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      {pageData.subscribe_button_text || "Subscribe"}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="button_background_color">Custom Background Color</Label>
                  <ColorInput
                    id="button_background_color"
                    value={pageData.primary_color || "#3B82F6"}
                    onChange={(color) => handleLocalSelectChange("primary_color", color)}
                  />
                  <p className="text-xs text-muted-foreground">
                    For gradient buttons, this is the start color
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="button_gradient_end">Gradient End Color</Label>
                  <ColorInput
                    id="button_gradient_end"
                    value={pageData.secondary_color || "#10B981"}
                    onChange={(color) => handleLocalSelectChange("secondary_color", color)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only used for gradient style buttons
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TMW AI Chatbot</CardTitle>
          <CardDescription>
            Integrate the TMW AI Chatbot with your business page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="chatbot_enabled">Enable Chatbot</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, the TMW AI Chatbot will be displayed on your page
              </p>
            </div>
            <Switch
              id="chatbot_enabled"
              checked={!!pageData.chatbot_enabled}
              onCheckedChange={(checked) => handleLocalToggleChange('chatbot_enabled', checked)}
            />
          </div>
          
          {pageData.chatbot_enabled && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="chatbot_code">Chatbot Embed Code</Label>
              <Textarea
                id="chatbot_code"
                name="chatbot_code"
                value={pageData.chatbot_code || ""}
                onChange={handleLocalInputChange}
                placeholder="Paste your TMW AI Chatbot embed code here"
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste the embed code provided by TMW AI Chatbot platform
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        type="button"
        onClick={handleSaveChanges}
        disabled={isSaving || !isDirty}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Advanced Settings
          </>
        )}
      </Button>
    </div>
  );
};

export default AdvancedSettingsTab;
