
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInfoTab } from "./settings/ContactInfoTab";
import { WorkingHoursTab } from "./settings/WorkingHoursTab";
import { ChatbotTab } from "./settings/ChatbotTab";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Landing Page Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="contact">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="hours">Business Hours</TabsTrigger>
            <TabsTrigger value="chatbot">TMW AI Chatbot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact" className="space-y-4 pt-4">
            <ContactInfoTab />
          </TabsContent>
          
          <TabsContent value="hours" className="space-y-4 pt-4">
            <WorkingHoursTab />
          </TabsContent>
          
          <TabsContent value="chatbot" className="space-y-4 pt-4">
            <ChatbotTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
