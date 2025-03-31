
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MailOpen, Phone } from "lucide-react";
import { useMarkSubmissionAsReadMutation } from "@/hooks/business-page/useContactSubmissionsQuery";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ContactSubmission {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

interface ContactSubmissionsProps {
  submissions: ContactSubmission[];
  isLoading: boolean;
}

const ContactSubmissions: React.FC<ContactSubmissionsProps> = ({ submissions, isLoading }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const markAsRead = useMarkSubmissionAsReadMutation();
  
  const handleMarkAsRead = async (submission: ContactSubmission) => {
    if (!submission.is_read) {
      try {
        await markAsRead.mutateAsync(submission.id);
      } catch (error) {
        console.error("Error marking submission as read:", error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border">
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] border rounded-lg bg-muted/20">
        <Mail className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Contact Submissions</h3>
        <p className="text-muted-foreground text-center max-w-md mt-2">
          When customers submit the contact form on your business page, their submissions will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card 
          key={submission.id} 
          className={`border ${!submission.is_read ? 'bg-accent/5' : ''}`}
          onClick={() => {
            setSelectedSubmission(submission);
            handleMarkAsRead(submission);
          }}
        >
          <CardContent className="p-4 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {submission.is_read ? (
                  <MailOpen className="h-4 w-4 text-muted-foreground mr-2" />
                ) : (
                  <Mail className="h-4 w-4 text-primary mr-2" />
                )}
                <div>
                  <h3 className="font-medium flex items-center">
                    {submission.name}
                    {!submission.is_read && (
                      <Badge variant="default" className="ml-2">New</Badge>
                    )}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3 mr-1" /> {submission.phone}
                  </div>
                  {submission.email && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 mr-1 inline-block" /> {submission.email}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(submission.created_at), 'MMM d, h:mm a')}
              </span>
            </div>
            
            {submission.message && (
              <p className="text-sm text-muted-foreground mt-3 border-t pt-2">
                {submission.message}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ContactSubmissions;
