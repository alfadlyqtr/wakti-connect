
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';
import EmptyMessagesState from '@/components/messages/EmptyMessagesState';
import ChatInterface from '@/components/messages/ChatInterface';
import { useDashboardUserProfile } from '@/hooks/useDashboardUserProfile';

const DashboardMessages = () => {
  const isMobile = useIsMobile();
  const { profileData, profileLoading, userRole } = useDashboardUserProfile();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  
  const canSendMessages = userRole === 'business' || userRole === 'individual';
  
  // Mock contacts list for UI development
  const mockContacts = [
    { id: 1, name: 'John Doe', avatar: '/placeholder.svg', unread: 2 },
    { id: 2, name: 'Jane Smith', avatar: '/placeholder.svg', unread: 0 },
    { id: 3, name: 'Business Name', avatar: '/placeholder.svg', unread: 5, isSubscription: true },
  ];
  
  const handleSendMessage = (message) => {
    console.log('Sending message:', message);
    // Implementation would connect to backend
  };
  
  // If the user is on a free plan and can't send messages, we'll show a different empty state
  if (userRole === 'free') {
    return (
      <div className="h-full flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center p-0">
            <EmptyMessagesState 
              canSendMessages={false}
              userType={userRole}
            />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Mobile users will see either the contacts list or the chat, not both simultaneously
  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>
            {selectedContact && isMobile ? selectedContact.name : 'Messages'}
          </CardTitle>
          {isMobile && selectedContact && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedContact(null)}
              className="mr-2"
            >
              Back to contacts
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex">
          {/* Contacts sidebar - hidden on mobile when a chat is selected */}
          {(!isMobile || !selectedContact) && (
            <div className={`border-r ${isMobile ? 'w-full' : 'w-1/3'}`}>
              <div className="p-3 border-b">
                <Input placeholder="Search contacts..." className="w-full" />
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {mockContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center p-3 border-b hover:bg-muted cursor-pointer"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="relative">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="h-10 w-10 rounded-full bg-muted"
                      />
                      {contact.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{contact.name}</span>
                        <span className="text-xs text-muted-foreground">12:34 PM</span>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {contact.isSubscription ? 'Business account' : 'Last message preview...'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat area - full width on mobile when selected */}
          {(!isMobile || selectedContact) && (
            <div className={`flex flex-col ${isMobile ? 'w-full' : 'w-2/3'}`}>
              {selectedContact ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    {/* Message bubbles would go here */}
                    <div className="flex justify-center my-8">
                      <span className="text-xs text-center bg-muted px-3 py-1 rounded-full">
                        Today
                      </span>
                    </div>
                    
                    {/* Empty chat state */}
                    <div className="text-center text-muted-foreground py-10">
                      <p>No messages yet.</p>
                      <p className="text-sm">Send a message to start the conversation.</p>
                    </div>
                  </div>
                  
                  <ChatInterface
                    onSendMessage={handleSendMessage}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    <p>Select a contact to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMessages;
