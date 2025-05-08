
import React from "react";
import { useBusinessPage } from "../../context/BusinessPageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ChatbotTab = () => {
  const { pageData, updateSectionData } = useBusinessPage();
  const [embedCode, setEmbedCode] = React.useState(pageData.chatbot.embedCode);

  const handleSave = () => {
    updateSectionData("chatbot", { embedCode });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">TMW AI Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chatbot-code">TMW AI Chatbot Embed Code</Label>
            <Textarea
              id="chatbot-code"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder="Paste your TMW AI Chatbot embed code here"
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
          
          <Button onClick={handleSave}>Save Chatbot Code</Button>
        </div>
      </CardContent>
    </Card>
  );
};
