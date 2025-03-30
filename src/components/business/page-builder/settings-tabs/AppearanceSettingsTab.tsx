
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface AppearanceSettingsTabProps {
  pageData: {
    primary_color: string;
    secondary_color: string;
    page_pattern?: string;
    text_color?: string;
    font_family?: string;
    border_radius?: string;
    background_color?: string;
    content_max_width?: string;
    section_spacing?: string;
    subscribe_button_position?: string;
    subscribe_button_style?: string;
    subscribe_button_size?: string;
    social_icons_style?: string;
    social_icons_size?: string;
    social_icons_position?: string;
  };
  handleInputChangeWithAutoSave: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AppearanceSettingsTab: React.FC<AppearanceSettingsTabProps> = ({
  pageData,
  handleInputChangeWithAutoSave
}) => {
  // Helper function to handle select changes
  const handleSelectChange = (name: string, value: string) => {
    // Create a synthetic event to update the property
    handleInputChangeWithAutoSave({
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Helper function to handle color changes
  const handleColorChange = (name: string, value: string) => {
    handleInputChangeWithAutoSave({
      target: {
        name,
        value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Tabs defaultValue="colors">
      <TabsList className="mb-4">
        <TabsTrigger value="colors">Colors</TabsTrigger>
        <TabsTrigger value="typography">Typography</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="buttons">Buttons</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
      </TabsList>
      
      <TabsContent value="colors" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
            <CardDescription>
              Customize the colors used in your business page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primary_color"
                    name="primary_color"
                    type="color"
                    value={pageData.primary_color}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.primary_color}
                    onChange={handleInputChangeWithAutoSave}
                    name="primary_color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondary_color"
                    name="secondary_color"
                    type="color"
                    value={pageData.secondary_color}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.secondary_color}
                    onChange={handleInputChangeWithAutoSave}
                    name="secondary_color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text_color">Text Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="text_color"
                    name="text_color"
                    type="color"
                    value={pageData.text_color || '#000000'}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.text_color || '#000000'}
                    onChange={handleInputChangeWithAutoSave}
                    name="text_color"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="background_color">Page Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="background_color"
                    name="background_color"
                    type="color"
                    value={pageData.background_color || '#ffffff'}
                    onChange={handleInputChangeWithAutoSave}
                    className="w-12 h-9 p-1"
                  />
                  <Input
                    type="text"
                    value={pageData.background_color || '#ffffff'}
                    onChange={handleInputChangeWithAutoSave}
                    name="background_color"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg border">
              <div className="text-center">
                <h3 className="font-medium mb-2">Preview</h3>
                <div 
                  className="h-20 rounded-md flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${pageData.primary_color} 0%, ${pageData.secondary_color} 100%)`,
                    color: pageData.text_color || '#000000'
                  }}
                >
                  <span className="font-medium">Color Scheme Preview</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="typography" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Typography Settings</CardTitle>
            <CardDescription>
              Customize the fonts and text styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="font_family">Font Family</Label>
                <Select 
                  value={pageData.font_family || 'sans-serif'} 
                  onValueChange={(value) => handleSelectChange('font_family', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                    <SelectItem value="cairo">Cairo</SelectItem>
                    <SelectItem value="redrose">Red Rose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 p-4 rounded-lg border">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Font Preview</h3>
                  <p className={`font-${pageData.font_family || 'sans-serif'} text-lg`}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className={`font-${pageData.font_family || 'sans-serif'} text-sm mt-2`}>
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="layout" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Layout Settings</CardTitle>
            <CardDescription>
              Customize the layout and spacing of your page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="border_radius">Border Radius</Label>
                <Select 
                  value={pageData.border_radius || 'medium'} 
                  onValueChange={(value) => handleSelectChange('border_radius', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select border radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (0px)</SelectItem>
                    <SelectItem value="small">Small (4px)</SelectItem>
                    <SelectItem value="medium">Medium (8px)</SelectItem>
                    <SelectItem value="large">Large (12px)</SelectItem>
                    <SelectItem value="full">Full (9999px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="page_pattern">Background Pattern</Label>
                <Select 
                  value={pageData.page_pattern || 'none'} 
                  onValueChange={(value) => handleSelectChange('page_pattern', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="waves">Waves</SelectItem>
                    <SelectItem value="diagonal">Diagonal Lines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="content_max_width">Content Max Width</Label>
                <Select 
                  value={pageData.content_max_width || '1200px'} 
                  onValueChange={(value) => handleSelectChange('content_max_width', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800px">Narrow (800px)</SelectItem>
                    <SelectItem value="1000px">Medium (1000px)</SelectItem>
                    <SelectItem value="1200px">Wide (1200px)</SelectItem>
                    <SelectItem value="100%">Full Width (100%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="section_spacing">Section Spacing</Label>
                <Select 
                  value={pageData.section_spacing || 'default'} 
                  onValueChange={(value) => handleSelectChange('section_spacing', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select spacing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 p-4 rounded-lg border">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Pattern Preview</h3>
                  <div 
                    className="h-20 rounded-md flex items-center justify-center"
                    style={{ 
                      borderRadius: 
                        pageData.border_radius === 'none' ? '0px' :
                        pageData.border_radius === 'small' ? '4px' :
                        pageData.border_radius === 'medium' ? '8px' :
                        pageData.border_radius === 'large' ? '12px' :
                        pageData.border_radius === 'full' ? '9999px' : '8px',
                      backgroundImage: 
                        pageData.page_pattern === 'dots' ? 'radial-gradient(#00000022 1px, transparent 1px)' :
                        pageData.page_pattern === 'grid' ? 'linear-gradient(to right, #00000011 1px, transparent 1px), linear-gradient(to bottom, #00000011 1px, transparent 1px)' :
                        pageData.page_pattern === 'waves' ? 'url("data:image/svg+xml,%3Csvg width="100" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 10 C 30 0, 70 0, 100 10 L 100 20 L 0 20 Z" fill="%2300000011"/%3E%3C/svg%3E")' :
                        pageData.page_pattern === 'diagonal' ? 'repeating-linear-gradient(45deg, #00000011, #00000011 1px, transparent 1px, transparent 10px)' : 'none',
                      backgroundSize: 
                        pageData.page_pattern === 'dots' ? '20px 20px' :
                        pageData.page_pattern === 'grid' ? '20px 20px' :
                        pageData.page_pattern === 'waves' ? '100px 20px' :
                        pageData.page_pattern === 'diagonal' ? '14px 14px' : 'auto',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <span className="font-medium">Pattern Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="buttons" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Subscribe Button Settings</CardTitle>
            <CardDescription>
              Customize the appearance and behavior of the subscribe button
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subscribe_button_position">Button Position</Label>
                <Select 
                  value={pageData.subscribe_button_position || 'both'} 
                  onValueChange={(value) => handleSelectChange('subscribe_button_position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top Only</SelectItem>
                    <SelectItem value="floating">Floating Only</SelectItem>
                    <SelectItem value="both">Both (Top & Floating)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subscribe_button_style">Button Style</Label>
                <Select 
                  value={pageData.subscribe_button_style || 'gradient'} 
                  onValueChange={(value) => handleSelectChange('subscribe_button_style', value)}
                >
                  <SelectTrigger>
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
              
              <div>
                <Label htmlFor="subscribe_button_size">Button Size</Label>
                <Select 
                  value={pageData.subscribe_button_size || 'default'} 
                  onValueChange={(value) => handleSelectChange('subscribe_button_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 p-4 rounded-lg border">
                <div className="text-center space-y-4">
                  <h3 className="font-medium mb-2">Button Preview</h3>
                  
                  <div className="flex justify-center">
                    <div 
                      className="px-4 py-2 font-medium rounded-md flex items-center justify-center gap-2"
                      style={{
                        background: pageData.subscribe_button_style === 'gradient' 
                          ? `linear-gradient(135deg, ${pageData.primary_color} 0%, ${pageData.secondary_color} 100%)`
                          : pageData.subscribe_button_style === 'outline' ? 'transparent' 
                          : pageData.subscribe_button_style === 'minimal' ? 'transparent'
                          : pageData.primary_color,
                        color: pageData.subscribe_button_style === 'outline' || pageData.subscribe_button_style === 'minimal' 
                          ? pageData.primary_color 
                          : pageData.text_color || '#ffffff',
                        borderRadius: 
                          pageData.border_radius === 'none' ? '0px' :
                          pageData.border_radius === 'small' ? '4px' :
                          pageData.border_radius === 'medium' ? '8px' :
                          pageData.border_radius === 'large' ? '12px' :
                          pageData.border_radius === 'full' ? '9999px' : '8px',
                        boxShadow: pageData.subscribe_button_style === 'minimal' ? 'none' : '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
                        border: pageData.subscribe_button_style === 'outline' ? `2px solid ${pageData.primary_color}` : 'none',
                        height: pageData.subscribe_button_size === 'small' ? '32px' : 
                                pageData.subscribe_button_size === 'large' ? '48px' : '40px',
                        minWidth: pageData.subscribe_button_size === 'small' ? '80px' : 
                                 pageData.subscribe_button_size === 'large' ? '140px' : '120px',
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      Subscribe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="social" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Icons</CardTitle>
            <CardDescription>
              Customize how your social media links appear on your page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="social_icons_style">Icon Style</Label>
                <Select 
                  value={pageData.social_icons_style || 'default'} 
                  onValueChange={(value) => handleSelectChange('social_icons_style', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="colored">Colored</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="outlined">Outlined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="social_icons_size">Icon Size</Label>
                <Select 
                  value={pageData.social_icons_size || 'default'} 
                  onValueChange={(value) => handleSelectChange('social_icons_size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="social_icons_position">Icons Position</Label>
                <Select 
                  value={pageData.social_icons_position || 'footer'} 
                  onValueChange={(value) => handleSelectChange('social_icons_position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="sidebar">Sidebar (Desktop Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4 p-4 rounded-lg border">
                <div className="text-center">
                  <h3 className="font-medium mb-2">Social Icons Preview</h3>
                  <div className="flex justify-center gap-2">
                    {['facebook', 'instagram', 'twitter'].map(platform => {
                      const buttonStyle = pageData.social_icons_style === 'colored' 
                        ? { backgroundColor: platform === 'facebook' ? '#1877F2' : platform === 'instagram' ? '#E4405F' : '#1DA1F2', color: 'white' }
                        : pageData.social_icons_style === 'outlined' 
                          ? { border: '1px solid #ccc' } 
                          : pageData.social_icons_style === 'rounded'
                            ? { backgroundColor: '#f3f4f6' }
                            : {};
                            
                      const iconSize = pageData.social_icons_size === 'small' ? 16 : 
                                       pageData.social_icons_size === 'large' ? 24 : 20;
                                       
                      const buttonSize = pageData.social_icons_size === 'small' ? { width: '32px', height: '32px' } :
                                         pageData.social_icons_size === 'large' ? { width: '48px', height: '48px' } :
                                         { width: '40px', height: '40px' };
                      
                      return (
                        <div 
                          key={platform}
                          className="flex items-center justify-center rounded-full transition-transform hover:scale-110"
                          style={{
                            ...buttonStyle,
                            ...buttonSize,
                            borderRadius: '9999px'
                          }}
                        >
                          <div style={{ width: `${iconSize}px`, height: `${iconSize}px` }}></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AppearanceSettingsTab;
