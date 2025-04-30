
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SHARE_TABS, ShareTab } from '@/types/form.types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, Link, QrCode, Search, User, Users } from 'lucide-react';
import { useContactSearch } from '@/hooks/useContactSearch';
import { InvitationRecipient } from '@/types/invitation.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventShareFormProps {
  onSubmit: (data: { invitations: InvitationRecipient[] }) => void;
  initialData?: any;
}

export const EventShareForm: React.FC<EventShareFormProps> = ({ onSubmit, initialData }) => {
  const [activeTab, setActiveTab] = useState<ShareTab>(SHARE_TABS.RECIPIENTS);
  const [recipients, setRecipients] = useState<InvitationRecipient[]>([]);
  const [emailInput, setEmailInput] = useState<string>('');
  const { 
    searchQuery, 
    searchResults, 
    isSearching, 
    handleSearchChange, 
    clearSearch 
  } = useContactSearch();
  
  const handleAddEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && emailRegex.test(emailInput)) {
      const newRecipient: InvitationRecipient = {
        id: `email-${Date.now()}`,
        name: emailInput,
        email: emailInput,
        type: 'email',
      };
      
      setRecipients([...recipients, newRecipient]);
      setEmailInput('');
    }
  };
  
  const handleAddContact = (contact: any) => {
    const newRecipient: InvitationRecipient = {
      id: contact.id,
      name: contact.fullName || contact.displayName,
      userId: contact.id,
      type: 'user'
    };
    
    setRecipients([...recipients, newRecipient]);
    clearSearch();
  };
  
  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };
  
  const handleSubmit = () => {
    onSubmit({ invitations: recipients });
  };
  
  const renderShareTab = () => {
    switch (activeTab) {
      case SHARE_TABS.RECIPIENTS:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Add Wakti Contacts</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox" 
                    className="w-full justify-between"
                  >
                    <span>Search contacts...</span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search contacts..." 
                      className="h-9" 
                      value={searchQuery}
                      onValueChange={handleSearchChange}
                    />
                    <CommandEmpty>
                      {isSearching ? (
                        <div className="py-6 text-center text-sm">Searching...</div>
                      ) : (
                        <div className="py-6 text-center text-sm">No contacts found</div>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((contact) => (
                        <CommandItem
                          key={contact.id}
                          value={contact.id}
                          onSelect={() => handleAddContact(contact)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>{contact.fullName || contact.displayName}</span>
                          {recipients.some(r => r.id === contact.id) && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Add by Email</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter email address" 
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddEmail}>Add</Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Recipients ({recipients.length})</Label>
                {recipients.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setRecipients([])}
                    className="h-6 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              {recipients.length > 0 ? (
                <div className="border rounded-md p-2 max-h-[160px] overflow-y-auto">
                  <div className="space-y-2">
                    {recipients.map(recipient => (
                      <div 
                        key={recipient.id} 
                        className="flex items-center justify-between bg-muted/50 p-2 rounded-sm text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {recipient.type === 'user' ? (
                            <User className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Link className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span>{recipient.name}</span>
                          <Badge variant="outline" className="text-xs py-0 px-1">
                            {recipient.type === 'user' ? 'Wakti User' : 'Email'}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveRecipient(recipient.id)}
                          className="h-6 w-6 p-0"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border rounded-md flex items-center justify-center p-8 text-center text-sm text-muted-foreground">
                  <div>
                    <Users className="mx-auto h-6 w-6 mb-2 opacity-50" />
                    <p>No recipients added yet</p>
                    <p className="text-xs mt-1 max-w-[200px] mx-auto">
                      Search for contacts or add email addresses
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case SHARE_TABS.QRCODE:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-sm text-muted-foreground mb-4">
              QR code will be generated after the event is created
            </p>
            <Button disabled>Generate QR Code</Button>
          </div>
        );
      case SHARE_TABS.LINK:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <Link className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-sm text-muted-foreground mb-4">
              A shareable link will be available after the event is created
            </p>
            <Button disabled>Generate Link</Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Share Event</h3>
      </div>
      
      <Card>
        <CardContent className="pt-6 pb-4">
          <Tabs defaultValue="recipients" onValueChange={(v) => setActiveTab(v as ShareTab)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value={SHARE_TABS.RECIPIENTS}>
                <Users className="h-4 w-4 mr-2" />
                Recipients
              </TabsTrigger>
              <TabsTrigger value={SHARE_TABS.QRCODE}>
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value={SHARE_TABS.LINK}>
                <Link className="h-4 w-4 mr-2" />
                Link
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {renderShareTab()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Button 
        type="button" 
        className="w-full"
        onClick={handleSubmit} 
        disabled={activeTab === SHARE_TABS.RECIPIENTS && recipients.length === 0}
      >
        {activeTab === SHARE_TABS.RECIPIENTS ? (
          <>Send Invitations</>
        ) : (
          <>Save & Continue</>
        )}
      </Button>
    </div>
  );
};
