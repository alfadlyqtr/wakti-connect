import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useContacts } from "@/hooks/useContacts";
import { InvitationRecipient, UserContact } from "@/types/invitation.types";
import { PlusCircle, X, Check, User, Mail } from "lucide-react";

interface RecipientSelectorProps {
  selectedRecipients: InvitationRecipient[];
  onAddRecipient: (recipient: InvitationRecipient) => void;
  onRemoveRecipient: (index: number) => void;
}

const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  selectedRecipients,
  onAddRecipient,
  onRemoveRecipient
}) => {
  const [emailInput, setEmailInput] = useState("");
  const { contacts, isLoading } = useContacts();
  
  const handleEmailAdd = () => {
    if (!emailInput || !emailInput.includes('@')) return;
    
    onAddRecipient({
      id: `email-${Date.now()}`, // Generate a unique ID
      name: emailInput,
      email: emailInput,
      type: 'email'
    });
    
    setEmailInput("");
  };
  
  const handleContactSelect = (contact: UserContact) => {
    const name = contact.contactProfile?.fullName || 
                 contact.contactProfile?.displayName || 
                 "User";
    
    onAddRecipient({
      id: contact.contactId,
      name,
      type: 'user', // Changed from 'contact' to 'user' to match the type definition
      userId: contact.contactId // Add userId for event submission
    });
  };
  
  const isContactSelected = (contactId: string) => {
    return selectedRecipients.some(
      r => (r.type === 'user' && r.id === contactId) || r.userId === contactId
    );
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Recipients</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Select who should receive this invitation
        </p>
      </div>
      
      {/* Selected Recipients */}
      {selectedRecipients.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Selected Recipients</Label>
          <div className="flex flex-wrap gap-2">
            {selectedRecipients.map((recipient, index) => (
              <div 
                key={`${recipient.type}-${recipient.id || recipient.email}`}
                className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
              >
                {recipient.type === 'user' ? (
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>{recipient.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1"
                  onClick={() => onRemoveRecipient(index)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Tabs defaultValue="contacts">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Contacts</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-pulse text-sm text-muted-foreground">
                Loading contacts...
              </div>
            </div>
          ) : contacts && contacts.length > 0 ? (
            <ScrollArea className="h-48 rounded-md border">
              <div className="p-4 space-y-3">
                {contacts.map(contact => (
                  <div key={contact.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`contact-${contact.contactId}`}
                      checked={isContactSelected(contact.contactId)}
                      onCheckedChange={(checked) => {
                        if (checked && !isContactSelected(contact.contactId)) {
                          handleContactSelect(contact);
                        }
                      }}
                    />
                    <Label
                      htmlFor={`contact-${contact.contactId}`}
                      className="flex items-center gap-2 cursor-pointer text-sm flex-1"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={contact.contactProfile?.avatarUrl || ''} />
                        <AvatarFallback>
                          {(contact.contactProfile?.fullName || contact.contactProfile?.displayName || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {contact.contactProfile?.fullName || contact.contactProfile?.displayName || 'User'}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <User className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                You don't have any contacts yet.
              </p>
              <Button variant="link" size="sm">
                Add Contacts
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="email" className="mt-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Invite people via email. They'll receive a link to view your invitation.
            </p>
            
            <div className="flex items-center space-x-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleEmailAdd}
                disabled={!emailInput.includes('@')}
                className="flex-shrink-0"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>
                <Check className="h-3 w-3 inline-block mr-1" /> 
                Recipients will receive an email with a link to view the invitation
              </p>
              <p>
                <Check className="h-3 w-3 inline-block mr-1" /> 
                They will need a WAKTI account to interact with the invitation
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipientSelector;
