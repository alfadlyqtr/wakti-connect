
import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Mail, MailOpen, User, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState<string>("all");
  const markAsRead = useMarkSubmissionAsReadMutation();
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  
  const unreadSubmissions = submissions.filter(submission => !submission.is_read);
  const readSubmissions = submissions.filter(submission => submission.is_read);
  
  const handleMarkAsRead = async (submissionId: string) => {
    try {
      await markAsRead.mutateAsync(submissionId);
      // Selection will be maintained because the submission object reference changes
    } catch (error) {
      console.error("Error marking submission as read:", error);
    }
  };
  
  const displaySubmissions = activeTab === "all" 
    ? submissions 
    : activeTab === "unread" 
      ? unreadSubmissions 
      : readSubmissions;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
      <div className="col-span-1 border rounded-lg overflow-hidden flex flex-col">
        <div className="bg-card border-b p-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all">
                All
                <Badge variant="outline" className="ml-2">{submissions.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge variant="outline" className="ml-2">{unreadSubmissions.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="read">
                Read
                <Badge variant="outline" className="ml-2">{readSubmissions.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="overflow-y-auto flex-1 divide-y">
          {displaySubmissions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No {activeTab} submissions</p>
            </div>
          ) : (
            displaySubmissions.map((submission) => (
              <div 
                key={submission.id}
                className={`p-4 cursor-pointer hover:bg-accent/10 transition-colors ${
                  selectedSubmission?.id === submission.id ? 'bg-accent/20' : ''
                }`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {submission.is_read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground mr-2" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary mr-2" />
                    )}
                    <h3 className="font-medium truncate">{submission.name}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(submission.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {submission.message || 'No message provided'}
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1" /> {submission.phone}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2 overflow-hidden">
        {selectedSubmission ? (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {selectedSubmission.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {!selectedSubmission.is_read && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarkAsRead(selectedSubmission.id)}
                      className="text-xs flex items-center"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription className="flex items-center justify-between">
                <span className="flex items-center">
                  Submitted on {format(new Date(selectedSubmission.created_at), 'MMMM d, yyyy h:mm a')}
                </span>
                {!selectedSubmission.is_read && (
                  <Badge variant="default" className="ml-2">New</Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Phone Number</p>
                    <p className="text-sm bg-muted p-2 rounded">
                      <a href={`tel:${selectedSubmission.phone}`} className="hover:underline">
                        {selectedSubmission.phone}
                      </a>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm bg-muted p-2 rounded">
                      {selectedSubmission.email ? (
                        <a href={`mailto:${selectedSubmission.email}`} className="hover:underline">
                          {selectedSubmission.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Not provided</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Message</p>
                  <div className="bg-muted p-3 rounded min-h-[100px]">
                    {selectedSubmission.message ? (
                      <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No message provided</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${selectedSubmission.phone}`}>
                    Call {selectedSubmission.phone}
                  </a>
                </Button>
                {selectedSubmission.email && (
                  <Button size="sm" asChild>
                    <a href={`mailto:${selectedSubmission.email}`}>
                      Reply via Email
                    </a>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full border rounded-lg bg-muted/20 p-6">
            <MailOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Select a Submission</h3>
            <p className="text-muted-foreground text-center max-w-md mt-2">
              Select a contact submission from the list to view its details here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSubmissions;
