
import React, { useState } from "react";
import { Flag, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";

interface ReportBlockSectionProps {
  targetUserId?: string;
}

const ReportBlockSection: React.FC<ReportBlockSectionProps> = ({ targetUserId }) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportReason, setReportReason] = useState("inappropriate");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleReport = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to report a user.",
        variant: "destructive"
      });
      return;
    }
    
    if (!reportDetails.trim()) {
      toast({
        title: "Details required",
        description: "Please provide details about your report.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Report submitted",
        description: "Thank you for your report. We will review it shortly."
      });
      
      setReportOpen(false);
      setReportDetails("");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBlock = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to block a user.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would send this to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "User blocked",
        description: "You will no longer see content from this user."
      });
      
      setBlockOpen(false);
    } catch (error) {
      console.error("Error blocking user:", error);
      toast({
        title: "Action failed",
        description: "There was a problem blocking this user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2 mt-2">
      <div className="flex flex-row justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1 text-muted-foreground hover:text-destructive"
          onClick={() => setReportOpen(true)}
        >
          <Flag className="h-3.5 w-3.5" />
          Report abuse
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1 text-muted-foreground hover:text-destructive"
          onClick={() => setBlockOpen(true)}
        >
          <Ban className="h-3.5 w-3.5" />
          Block user
        </Button>
      </div>
      
      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report inappropriate content</DialogTitle>
            <DialogDescription>
              Please provide details about why you are reporting this user or content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-reason">Reason for report</Label>
              <RadioGroup 
                id="report-reason" 
                value={reportReason} 
                onValueChange={setReportReason}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inappropriate" id="inappropriate" />
                  <Label htmlFor="inappropriate" className="font-normal">Inappropriate content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="harassment" id="harassment" />
                  <Label htmlFor="harassment" className="font-normal">Harassment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spam" id="spam" />
                  <Label htmlFor="spam" className="font-normal">Spam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="font-normal">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-details">Details</Label>
              <Textarea
                id="report-details"
                placeholder="Please provide specific details about the issue..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setReportOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReport}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? "Submitting..." : "Submit report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Block Dialog */}
      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Block this user?</DialogTitle>
            <DialogDescription>
              You will no longer see content from this user. This action can be reversed later from your settings.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setBlockOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBlock}
              disabled={isSubmitting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isSubmitting ? "Blocking..." : "Block user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportBlockSection;
