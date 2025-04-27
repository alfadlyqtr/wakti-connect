
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search, User, Mail, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InvitationRecipient } from '@/types/invitation.types';
import { useContactSearch } from '@/hooks/useContactSearch';
import { UserContact } from '@/types/invitation.types';
import { useContacts } from '@/hooks/useContacts';

interface RecipientSelectorProps {
  selectedRecipients: InvitationRecipient[];
  onAddRecipient: (recipient: InvitationRecipient) => void;
  onRemoveRecipient: (index: number) => void;
}

const RecipientSelector: React.FC<RecipientSelectorProps> = ({
  selectedRecipients,
  onAddRecipient,
  onRemoveRecipient,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchUsers, searchResults, isSearching } = useContactSearch();
  const { contacts } = useContacts();
  
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 3) {
      await searchUsers(value);
    }
  };
  
  const handleAddContact = (contact: UserContact) => {
    const recipientExists = selectedRecipients.some(r => 
      (r.userId && r.userId === contact.contact_id) || (r.id === contact.contact_id)
    );
    
    if (recipientExists) return;
    
    onAddRecipient({
      id: contact.contact_id,
      userId: contact.contact_id,
      name: contact.contactProfile?.displayName || contact.contactProfile?.fullName || 'Contact',
      type: 'user'
    });
  };
  
  const handleAddSearchResult = (result: any) => {
    const recipientExists = selectedRecipients.some(r => 
      (r.userId && r.userId === result.id) || (r.id === result.id)
    );
    
    if (recipientExists) return;
    
    onAddRecipient({
      id: result.id,
      userId: result.id,
      name: result.displayName || result.fullName || result.email,
      email: result.email,
      type: 'user'
    });
    
    setSearchTerm("");
  };
  
  const handleAddEmail = () => {
    if (!searchTerm || !searchTerm.includes('@')) return;
    
    const emailExists = selectedRecipients.some(r => r.email === searchTerm);
    if (emailExists) return;
    
    onAddRecipient({
      id: `email-${Date.now()}`,
      name: searchTerm,
      email: searchTerm,
      type: 'email'
    });
    
    setSearchTerm("");
  };
  
  return (
    <div className="space-y-4">
      {/* Recipients list */}
      {selectedRecipients.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedRecipients.map((recipient, index) => (
            <Badge key={recipient.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              {recipient.type === 'email' ? <Mail className="h-3 w-3" /> : <User className="h-3 w-3" />}
              <span>{recipient.name}</span>
              <button 
                onClick={() => onRemoveRecipient(index)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Search input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search contacts or enter email..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        {searchTerm.includes('@') && (
          <Button 
            type="button" 
            size="sm" 
            variant="outline"
            onClick={handleAddEmail}
          >
            <Mail className="h-4 w-4 mr-2" />
            Add Email
          </Button>
        )}
      </div>
      
      {/* Search results and contacts */}
      <ScrollArea className="h-[200px] rounded-md border">
        {searchTerm.length >= 3 ? (
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-medium mb-2">Search Results</h3>
            
            {isSearching ? (
              <div className="text-center p-4">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map(result => (
                  <div 
                    key={result.id} 
                    className="flex justify-between items-center p-2 hover:bg-accent/20 rounded-md cursor-pointer"
                    onClick={() => handleAddSearchResult(result)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={result.avatarUrl || ''} />
                        <AvatarFallback>{result.displayName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{result.displayName || result.fullName}</p>
                        <p className="text-xs text-muted-foreground">{result.email}</p>
                      </div>
                    </div>
                    <Button type="button" size="sm" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No results found
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-medium mb-2">Your Contacts</h3>
            
            {contacts && contacts.length > 0 ? (
              <div className="space-y-2">
                {contacts.map(contact => (
                  <div 
                    key={contact.id} 
                    className="flex justify-between items-center p-2 hover:bg-accent/20 rounded-md cursor-pointer"
                    onClick={() => handleAddContact(contact)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contact.contactProfile?.avatarUrl || ''} />
                        <AvatarFallback>
                          {contact.contactProfile?.displayName?.charAt(0) ||
                           contact.contactProfile?.fullName?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {contact.contactProfile?.displayName || 
                           contact.contactProfile?.fullName || 'Contact'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contact.contactProfile?.email || ''}
                        </p>
                      </div>
                    </div>
                    <Button type="button" size="sm" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No contacts found
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RecipientSelector;
