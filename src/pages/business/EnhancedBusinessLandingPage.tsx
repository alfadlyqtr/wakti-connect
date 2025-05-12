
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useBusinessData } from "@/hooks/useBusinessData";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { SectionContainer } from "@/components/ui/section-container";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Clock, Map } from "lucide-react";
import { BookingModalContent } from "@/components/business/landing/booking";
import BusinessSocialLinks from "@/components/business/landing/BusinessSocialLinks";
import PoweredByWAKTI from "@/components/common/PoweredByWAKTI";
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
  
  if (isLoadingTemplates) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Small WAKTI logo in top corner */}
        <div className="p-4">
          <Link to="/" className="inline-block">
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
              alt="WAKTI" 
              className="w-8 h-8 rounded-md"
            />
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center items-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin"></div>
        </div>
        
        <PoweredByWAKTI variant="minimal" />
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Small WAKTI logo in top corner */}
        <div className="p-4">
          <Link to="/" className="inline-block">
            <img 
              src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
              alt="WAKTI" 
              className="w-8 h-8 rounded-md"
            />
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <h2 className="text-2xl font-bold mb-2">Business not found</h2>
          <p className="text-muted-foreground">The business you're looking for doesn't exist or is no longer available.</p>
        </div>
        
        <PoweredByWAKTI variant="minimal" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Small WAKTI logo in top corner */}
      <div className="p-4">
        <Link to="/" className="inline-block">
          <img 
            src="/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png" 
            alt="WAKTI" 
            className="w-8 h-8 rounded-md"
          />
        </Link>
      </div>

      <div className="flex-1">
        {/* Enhanced Hero Section with Gradient */}
        <div className="bg-gradient-to-b from-wakti-blue/10 via-wakti-blue/5 to-transparent pt-12 pb-10">
          <SectionContainer className="text-center">
            <div className="flex flex-col items-center space-y-5">
              <Avatar className="w-28 h-28 border-4 border-wakti-blue/20 shadow-lg">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.business_name || ''} />
                ) : (
                  <AvatarFallback className="text-3xl bg-wakti-blue/30">{initials}</AvatarFallback>
                )}
              </Avatar>
              
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-wakti-blue to-wakti-navy">
                  {profile?.business_name || 'Business Name'}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                  {profile?.display_name || 'Loading business information...'}
                </p>
              </div>
              
              {/* Social Media Links */}
              {socialLinks && socialLinks.length > 0 && (
                <div className="mt-5 animate-fade-in">
                  <BusinessSocialLinks 
                    socialLinks={socialLinks} 
                    iconsStyle="colored"
                    size="large"
                  />
                </div>
              )}
            </div>
          </SectionContainer>
        </div>

        {/* Booking Templates Section */}
        <SectionContainer className="py-14">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-3 text-wakti-navy">Our Services</h2>
            <p className="text-muted-foreground">Book your appointment today and experience our premium services</p>
          </div>
          
          {templates && templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                  <CardHeader className="pb-2 bg-gradient-to-r from-wakti-blue/5 to-transparent">
                    <h3 className="text-xl font-bold">{template.name}</h3>
                  </CardHeader>
                  
                  <CardContent className="pb-2 pt-4">
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-2 h-4 w-4 text-wakti-blue" />
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
                      className="w-full bg-wakti-blue hover:bg-wakti-navy" 
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
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                No services available for booking at this time.
              </p>
            </div>
          )}
        </SectionContainer>
      </div>
      
      {/* Power by WAKTI footer */}
      <PoweredByWAKTI variant="colored" />
      
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
    </div>
  );
};

export default EnhancedBusinessLandingPage;
