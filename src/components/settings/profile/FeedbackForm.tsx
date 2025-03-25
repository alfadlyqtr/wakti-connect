
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";
import { Separator } from "@/components/ui/separator";
import ReportBlockSection from "./ReportBlockSection";

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please write your feedback before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to submit feedback.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store feedback in the database (goes to user_feedback table)
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          content: feedback
        });
        
      if (error) throw error;
      
      toast({
        title: "Feedback received",
        description: "Thank you for your feedback! We appreciate your input."
      });
      
      // Reset the form
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Textarea
          placeholder="We'd love to hear your thoughts on how we can improve WAKTI..."
          className="min-h-[120px] border-gray-300 focus-visible:ring-wakti-blue"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        
        <div className="flex justify-between items-center">
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-wakti-blue hover:bg-wakti-blue/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
        
        <Separator className="my-2" />
        <ReportBlockSection />
      </div>
    </form>
  );
};

export default FeedbackForm;
