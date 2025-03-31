
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
import { ColorPicker } from "@/components/inputs/ColorPicker";
import { ColorInput } from "@/components/inputs/ColorInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

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
            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="background_color">Background Color</Label>
              <ColorInput
                id="background_color"
                value={contentData.background_color || "#ffffff"}
                onChange={(color) => handleStyleChange("background_color", color)}
              />
            </div>
            
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
                  <SelectItem value="full">Full</SelectItem>
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
