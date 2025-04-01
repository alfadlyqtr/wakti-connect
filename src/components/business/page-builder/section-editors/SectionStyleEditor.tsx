
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ColorInput } from "@/components/inputs/ColorInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Pencil, ImagePlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SectionStyleEditorProps {
  contentData: Record<string, any>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStyleChange: (name: string, value: string) => void;
}

const SectionStyleEditor: React.FC<SectionStyleEditorProps> = ({
  contentData,
  handleInputChange,
  handleStyleChange,
}) => {
  const isMobile = useIsMobile();
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB"
      });
      return;
    }
    
    try {
      // Convert to base64 for demo purposes
      // In production, you would upload to storage and get a URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const base64Img = event.target.result.toString();
          handleStyleChange("background_image_url", base64Img);
          toast({
            title: "Image uploaded",
            description: "Background image has been set"
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your image"
      });
    }
  };
  
  return (
    <Accordion type="single" collapsible className="mt-4 border rounded-lg">
      <AccordionItem value="section-styling">
        <AccordionTrigger className="px-4 hover:no-underline">
          <div className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            <span>Section Styling</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Background Image */}
            <div className="space-y-2">
              <Label htmlFor="background_image">Background Image</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="background_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                {contentData.background_image_url && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleStyleChange("background_image_url", "")}
                  >
                    Clear
                  </Button>
                )}
              </div>
              {contentData.background_image_url && (
                <div className="mt-2 border rounded-md p-2">
                  <img 
                    src={contentData.background_image_url} 
                    alt="Background preview" 
                    className="max-h-24 mx-auto"
                  />
                </div>
              )}
            </div>
            
            {/* Background Type */}
            <div className="space-y-2">
              <Label htmlFor="background_type">Background Type</Label>
              <Select
                value={contentData.background_type || "color"}
                onValueChange={(value) => handleStyleChange("background_type", value)}
              >
                <SelectTrigger id="background_type" className="w-full">
                  <SelectValue placeholder="Select background type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">Solid Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="pattern">Pattern</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Background Pattern */}
            {contentData.background_type === "pattern" && (
              <div className="space-y-2">
                <Label htmlFor="background_pattern">Background Pattern</Label>
                <Select
                  value={contentData.background_pattern || "dots"}
                  onValueChange={(value) => handleStyleChange("background_pattern", value)}
                >
                  <SelectTrigger id="background_pattern" className="w-full">
                    <SelectValue placeholder="Select pattern" />
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
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Background Color */}
            {(contentData.background_type === "color" || !contentData.background_type) && (
              <div className="space-y-2">
                <Label htmlFor="background_color">Background Color</Label>
                <ColorInput
                  id="background_color"
                  value={contentData.background_color || "#ffffff"}
                  onChange={(color) => handleStyleChange("background_color", color)}
                />
              </div>
            )}
            
            {/* Gradient Colors */}
            {contentData.background_type === "gradient" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gradient_start">Gradient Start Color</Label>
                  <ColorInput
                    id="gradient_start"
                    value={contentData.gradient_start || "#ffffff"}
                    onChange={(color) => handleStyleChange("gradient_start", color)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradient_end">Gradient End Color</Label>
                  <ColorInput
                    id="gradient_end"
                    value={contentData.gradient_end || "#e0e0e0"}
                    onChange={(color) => handleStyleChange("gradient_end", color)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradient_direction">Gradient Direction</Label>
                  <Select
                    value={contentData.gradient_direction || "to-r"}
                    onValueChange={(value) => handleStyleChange("gradient_direction", value)}
                  >
                    <SelectTrigger id="gradient_direction" className="w-full">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-r">Left to Right</SelectItem>
                      <SelectItem value="to-l">Right to Left</SelectItem>
                      <SelectItem value="to-t">Bottom to Top</SelectItem>
                      <SelectItem value="to-b">Top to Bottom</SelectItem>
                      <SelectItem value="to-tr">Bottom Left to Top Right</SelectItem>
                      <SelectItem value="to-tl">Bottom Right to Top Left</SelectItem>
                      <SelectItem value="to-br">Top Left to Bottom Right</SelectItem>
                      <SelectItem value="to-bl">Top Right to Bottom Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {/* Text Color */}
            <div className="space-y-2">
              <Label htmlFor="text_color">Text Color</Label>
              <ColorInput
                id="text_color"
                value={contentData.text_color || "#000000"}
                onChange={(color) => handleStyleChange("text_color", color)}
              />
            </div>
            
            {/* Padding */}
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select
                value={contentData.padding || "md"}
                onValueChange={(value) => handleStyleChange("padding", value)}
              >
                <SelectTrigger id="padding" className="w-full">
                  <SelectValue placeholder="Select padding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="xs">Extra Small</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Border Radius */}
            <div className="space-y-2">
              <Label htmlFor="border_radius">Border Radius</Label>
              <Select
                value={contentData.border_radius || "medium"}
                onValueChange={(value) => handleStyleChange("border_radius", value)}
              >
                <SelectTrigger id="border_radius" className="w-full">
                  <SelectValue placeholder="Select border radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="2xl">2XL</SelectItem>
                  <SelectItem value="full">Full (Rounded)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Shadow Effect */}
            <div className="space-y-2">
              <Label htmlFor="shadow_effect">Shadow Effect</Label>
              <Select
                value={contentData.shadow_effect || "none"}
                onValueChange={(value) => handleStyleChange("shadow_effect", value)}
              >
                <SelectTrigger id="shadow_effect" className="w-full">
                  <SelectValue placeholder="Select shadow effect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                  <SelectItem value="2xl">2XL</SelectItem>
                  <SelectItem value="inner">Inner Shadow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Border Style */}
            <div className="space-y-2">
              <Label htmlFor="border_style">Border Style</Label>
              <Select
                value={contentData.border_style || "none"}
                onValueChange={(value) => handleStyleChange("border_style", value)}
              >
                <SelectTrigger id="border_style" className="w-full">
                  <SelectValue placeholder="Select border style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="groove">Groove</SelectItem>
                  <SelectItem value="ridge">Ridge</SelectItem>
                  <SelectItem value="inset">Inset</SelectItem>
                  <SelectItem value="outset">Outset</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Border Width */}
            <div className="space-y-2">
              <Label htmlFor="border_width">Border Width</Label>
              <Select
                value={contentData.border_width || "1px"}
                onValueChange={(value) => handleStyleChange("border_width", value)}
              >
                <SelectTrigger id="border_width" className="w-full">
                  <SelectValue placeholder="Select border width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1px">1px</SelectItem>
                  <SelectItem value="2px">2px</SelectItem>
                  <SelectItem value="3px">3px</SelectItem>
                  <SelectItem value="4px">4px</SelectItem>
                  <SelectItem value="5px">5px</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Border Color */}
            <div className="space-y-2">
              <Label htmlFor="border_color">Border Color</Label>
              <ColorInput
                id="border_color"
                value={contentData.border_color || "#000000"}
                onChange={(color) => handleStyleChange("border_color", color)}
              />
            </div>
            
            {/* Section Style */}
            <div className="space-y-2">
              <Label htmlFor="section_style">Section Style</Label>
              <Select
                value={contentData.section_style || "default"}
                onValueChange={(value) => handleStyleChange("section_style", value)}
              >
                <SelectTrigger id="section_style" className="w-full">
                  <SelectValue placeholder="Select section style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="outlined">Outlined</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="floating">Floating</SelectItem>
                  <SelectItem value="glass">Glass Effect</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Content Alignment */}
            <div className="space-y-2">
              <Label htmlFor="content_alignment">Content Alignment</Label>
              <Select
                value={contentData.content_alignment || "center"}
                onValueChange={(value) => handleStyleChange("content_alignment", value)}
              >
                <SelectTrigger id="content_alignment" className="w-full">
                  <SelectValue placeholder="Select alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SectionStyleEditor;
