
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

const AIBuilderSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [creativity, setCreativity] = useState(50);
  const [includeBooking, setIncludeBooking] = useState(true);
  const [includeChatbot, setIncludeChatbot] = useState(false);
  const [designStyle, setDesignStyle] = useState("modern");
  const [colorScheme, setColorScheme] = useState("automatic");

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-2 h-auto">
          <span className="font-medium">Advanced Settings</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base">AI Generation Settings</CardTitle>
            <CardDescription>
              Customize how the AI generates your page content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="creativity-slider">Creativity Level</Label>
                <span className="text-sm text-muted-foreground">{creativity}%</span>
              </div>
              <Slider
                id="creativity-slider"
                min={0}
                max={100}
                step={10}
                defaultValue={[creativity]}
                onValueChange={(value) => setCreativity(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher values create more unique content, lower values make more conservative designs
              </p>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="booking-switch">Include Booking System</Label>
                  <p className="text-xs text-muted-foreground">Allow customers to book appointments</p>
                </div>
                <Switch
                  id="booking-switch"
                  checked={includeBooking}
                  onCheckedChange={setIncludeBooking}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="chatbot-switch">Include TMW AI Chatbot</Label>
                  <p className="text-xs text-muted-foreground">Add an AI chatbot to your page</p>
                </div>
                <Switch
                  id="chatbot-switch"
                  checked={includeChatbot}
                  onCheckedChange={setIncludeChatbot}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="design-style">Design Style</Label>
                <Select value={designStyle} onValueChange={setDesignStyle}>
                  <SelectTrigger id="design-style" className="w-full">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern & Clean</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="minimal">Minimalist</SelectItem>
                    <SelectItem value="bold">Bold & Vibrant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="color-scheme">Color Scheme</Label>
                <Select value={colorScheme} onValueChange={setColorScheme}>
                  <SelectTrigger id="color-scheme" className="w-full">
                    <SelectValue placeholder="Select colors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic (from logo)</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AIBuilderSettings;
