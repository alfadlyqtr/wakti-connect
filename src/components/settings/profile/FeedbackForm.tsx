
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/auth";

const MAX_CHARS = 50;

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setFeedback(value);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast({
        title: "Empty feedback",
        description: "Please enter some feedback before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user?.id) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to submit feedback.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store feedback in database or send to an API endpoint
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          content: feedback,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast({
        title: "Feedback received",
        description: "Thank you for your feedback!"
      });
      
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "Could not submit your feedback. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Textarea
          placeholder="Share your suggestions or feedback..."
          value={feedback}
          onChange={handleChange}
          className="min-h-[80px] resize-none"
        />
        <div className="flex items-center justify-between">
          <span className={`text-xs ${feedback.length >= MAX_CHARS ? 'text-red-500' : 'text-muted-foreground'}`}>
            {feedback.length}/{MAX_CHARS} characters
          </span>
          <Button 
            type="submit" 
            disabled={isSubmitting || !feedback.trim()}
            className="bg-wakti-blue hover:bg-wakti-blue/90"
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FeedbackForm;
