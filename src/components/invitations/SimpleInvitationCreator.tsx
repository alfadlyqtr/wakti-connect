
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BackgroundSelector } from "./BackgroundSelector";
import { TextStyler } from "./TextStyler";
import { LocationInput } from "./LocationInput";
import { InvitationPreview } from "./InvitationPreview";
import { InvitationShareOptions } from "./InvitationShareOptions";
import { SimpleInvitation } from "@/types/invitation-simple.types";
import { createSimpleInvitation } from "@/services/invitation/simple-invitations";
import { Loader2 } from "lucide-react";
import { BackgroundType } from "@/types/invitation.types";
import { useNavigate } from "react-router-dom";

type TabValue = "details" | "design" | "share";

export const SimpleInvitationCreator: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInvitation, setCreatedInvitation] = useState<SimpleInvitation | null>(null);
  
  const [invitation, setInvitation] = useState<Partial<SimpleInvitation>>({
    title: "",
    description: "",
    datetime: "",
    location: "",
    location_url: "",
    background_type: "solid",
    background_value: "#ffffff",
    font_family: "Inter, sans-serif",
    font_size: "16px",
    text_color: "#000000",
  });

  const updateInvitation = (field: keyof SimpleInvitation, value: any) => {
    setInvitation((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleBackgroundChange = (type: BackgroundType, value: string) => {
    updateInvitation("background_type", type);
    updateInvitation("background_value", value);
  };

  const handleCreateInvitation = async () => {
    try {
      setIsSubmitting(true);
      
      if (!invitation.title) {
        setActiveTab("details");
        return;
      }

      const result = await createSimpleInvitation(invitation as any);
      if (result) {
        setCreatedInvitation(result);
        setActiveTab("share");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/events");
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabValue)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="share" disabled={!createdInvitation}>Share</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Form */}
            <div>
              <TabsContent value="details" className="m-0">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      value={invitation.title}
                      onChange={(e) => updateInvitation("title", e.target.value)}
                      placeholder="Enter invitation title"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="datetime">Date & Time</Label>
                    <Input 
                      id="datetime"
                      type="datetime-local"
                      value={invitation.datetime}
                      onChange={(e) => updateInvitation("datetime", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={invitation.description}
                      onChange={(e) => updateInvitation("description", e.target.value)}
                      placeholder="Enter invitation details"
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                  
                  <LocationInput 
                    location={invitation.location || ""}
                    locationUrl={invitation.location_url || ""}
                    onLocationChange={(val) => updateInvitation("location", val)}
                    onLocationUrlChange={(val) => updateInvitation("location_url", val)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="design" className="space-y-6 m-0">
                <BackgroundSelector 
                  backgroundType={invitation.background_type as BackgroundType}
                  backgroundValue={invitation.background_value || "#ffffff"}
                  onBackgroundChange={handleBackgroundChange}
                />
                
                <TextStyler 
                  fontFamily={invitation.font_family || "Inter, sans-serif"}
                  fontSize={invitation.font_size || "16px"}
                  textColor={invitation.text_color || "#000000"}
                  onFontFamilyChange={(val) => updateInvitation("font_family", val)}
                  onFontSizeChange={(val) => updateInvitation("font_size", val)}
                  onTextColorChange={(val) => updateInvitation("text_color", val)}
                />
              </TabsContent>
              
              <TabsContent value="share" className="m-0">
                {createdInvitation?.share_link && (
                  <InvitationShareOptions shareLink={createdInvitation.share_link} />
                )}
              </TabsContent>
            </div>
            
            {/* Right column: Preview */}
            <div>
              <InvitationPreview invitation={invitation} />
            </div>
          </div>
          
          {/* Footer buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleCancel} type="button">
              Cancel
            </Button>
            
            <div className="flex gap-2">
              {activeTab !== "details" && (
                <Button
                  variant="outline"
                  onClick={() => setActiveTab(activeTab === "design" ? "details" : "design")}
                  type="button"
                >
                  Previous
                </Button>
              )}
              
              {activeTab !== "share" && (
                activeTab === "design" ? (
                  <Button
                    onClick={handleCreateInvitation}
                    disabled={isSubmitting || !invitation.title}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Invitation'
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setActiveTab("design")}
                    type="button"
                  >
                    Next
                  </Button>
                )
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
