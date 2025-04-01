
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SubscribeButtonGeneral from "./SubscribeButtonGeneral";
import SubscribeButtonAppearance from "./SubscribeButtonAppearance";
import SubscribeButtonAdvanced from "./SubscribeButtonAdvanced";

interface SubscribeButtonCardProps {
  pageData: {
    show_subscribe_button?: boolean;
    subscribe_button_text?: string;
    subscribe_button_position?: string;
    subscribe_button_style?: string;
    subscribe_button_size?: string;
    primary_color?: string;
    secondary_color?: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleChange: (name: string, checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
  getButtonPreviewStyles: () => React.CSSProperties;
}

const SubscribeButtonCard: React.FC<SubscribeButtonCardProps> = ({
  pageData,
  handleInputChange,
  handleToggleChange,
  handleSelectChange,
  getButtonPreviewStyles
}) => {
  return (
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
            <SubscribeButtonGeneral 
              showSubscribeButton={pageData.show_subscribe_button !== false}
              buttonText={pageData.subscribe_button_text || ""}
              buttonPosition={pageData.subscribe_button_position || ""}
              handleInputChange={handleInputChange}
              handleToggleChange={handleToggleChange}
              handleSelectChange={handleSelectChange}
            />
          </TabsContent>
          
          <TabsContent value="appearance">
            <SubscribeButtonAppearance 
              buttonStyle={pageData.subscribe_button_style || ""}
              buttonSize={pageData.subscribe_button_size || ""}
              buttonText={pageData.subscribe_button_text || ""}
              primaryColor={pageData.primary_color || ""}
              secondaryColor={pageData.secondary_color || ""}
              handleSelectChange={handleSelectChange}
              getButtonPreviewStyles={getButtonPreviewStyles}
            />
          </TabsContent>
          
          <TabsContent value="advanced">
            <SubscribeButtonAdvanced 
              primaryColor={pageData.primary_color || ""}
              secondaryColor={pageData.secondary_color || ""}
              handleSelectChange={handleSelectChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SubscribeButtonCard;
