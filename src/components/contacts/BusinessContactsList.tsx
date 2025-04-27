
import React from "react";
import { useContacts } from "@/hooks/useContacts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const BusinessContactsList = () => {
  const { 
    contacts,
    isLoading,
    deleteContact
  } = useContacts();

  // Filter to only show business contacts
  const businessContacts = React.useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(contact => 
      contact.contactProfile?.accountType === 'business'
    );
  }, [contacts]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Business Contacts</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {businessContacts.length} {businessContacts.length === 1 ? 'business' : 'businesses'}
        </span>
      </div>

      {businessContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessContacts.map((contact) => {
            // Ensure we have proper avatar display names
            const businessName = contact.contactProfile?.businessName || contact.contactProfile?.displayName || "Business";
            const initials = businessName.slice(0, 2).toUpperCase();
            
            return (
              <Card key={contact.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={contact.contactProfile?.avatarUrl || ''} />
                        <AvatarFallback>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link 
                          to={`/business/${contact.contactId}`} 
                          className="font-medium hover:underline text-primary flex items-center gap-1"
                        >
                          <Building2 className="h-3 w-3" />
                          {businessName}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Added: {new Date(contact.created_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteContact.mutate(contact.contactId)}
                      disabled={deleteContact.isPending}
                    >
                      {deleteContact.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">You don't have any business contacts</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add business contacts to access their pages and services
          </p>
        </div>
      )}
    </div>
  );
};

export default BusinessContactsList;
