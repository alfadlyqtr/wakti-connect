
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useBusinessData } from "@/hooks/useBusinessData";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import PublicLayout from "@/components/layout/PublicLayout";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Map } from "lucide-react";
import { BookingModalContent } from "@/components/business/landing/booking";
import BusinessSocialLinks from "@/components/business/landing/BusinessSocialLinks";
import { formatCurrency } from "@/utils/formatUtils";

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

const EnhancedBusinessLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Fetch business profile using the slug
  const { profile, socialLinks, error } = useBusinessData(slug);
  
  // Fetch booking templates if business profile is available
  const {
    templates,
    isLoading: isLoadingTemplates
  } = useBookingTemplates(profile?.id);
  
  // Select the template by ID
  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);
  
  const initials = profile?.business_name
    ? profile.business_name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    : '??';
  
  // Get currency formatter based on business locale (fallback to default)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-wakti-blue/10 to-transparent pt-10 pb-6">
        <SectionContainer className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-wakti-blue/20">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.business_name || ''} />
              ) : (
                <AvatarFallback className="text-2xl bg-wakti-blue/30">{initials}</AvatarFallback>
              )}
            </Avatar>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{profile?.business_name || 'Business Name'}</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                {profile?.display_name || 'Loading business information...'}
              </p>
            </div>
            
            {/* Social Media Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-4">
                <BusinessSocialLinks 
                  socialLinks={socialLinks} 
                  iconsStyle="colored"
                  size="default"
                />
              </div>
            )}
          </div>
        </SectionContainer>
      </div>

      {/* Booking Templates Section */}
      <SectionContainer>
        <SectionHeading 
          title="Our Services"
          subtitle="Book your appointment today"
        />
        
        {isLoadingTemplates ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
          </div>
        ) : templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <h3 className="text-xl font-bold">{template.name}</h3>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="mr-2 h-4 w-4" />
                        {formatDuration(template.duration)}
                      </div>
                      
                      {template.price && (
                        <div className="text-lg font-semibold text-gray-800">
                          {formatter.format(template.price)}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {template.description && (
                        <div className="text-sm text-gray-600">
                          {template.description}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setShowBookingModal(true);
                    }}
                  >
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No services available for booking at this time.
          </div>
        )}
      </SectionContainer>
      
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description || "Book your appointment"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && profile && (
            <BookingModalContent 
              template={selectedTemplate} 
              businessId={profile.id}
              onClose={() => setShowBookingModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
};

export default EnhancedBusinessLandingPage;
