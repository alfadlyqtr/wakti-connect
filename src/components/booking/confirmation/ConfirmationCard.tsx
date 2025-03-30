import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookingWithRelations } from "@/types/booking.types";
import { Calendar, Clock, MapPin, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import BookingServiceInfo from "./BookingServiceInfo";
import BookingReferenceDisplay from "./BookingReferenceDisplay";
import ConfirmationAnimation from "./ConfirmationAnimation";
import AccountPromotionCard from "./AccountPromotionCard";
import CalendarExportOptions from "./CalendarExportOptions";
import BookingDetailsCard from "./BookingDetailsCard";
import { supabase } from "@/integrations/supabase/client";
import { BusinessProfile } from "@/types/business.types";
import { useBusinessSubscribers } from "@/hooks/useBusinessSubscribers";
import PoweredByWAKTI from "@/components/common/PoweredByWAKTI";
import { useBusinessStyling } from "@/hooks/useBusinessStyling";

interface ConfirmationCardProps {
  booking: BookingWithRelations;
  serviceName: string;
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ booking, serviceName }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showPromotion, setShowPromotion] = useState(false);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const { isSubscribed, subscribe } = useBusinessSubscribers(booking.business_id);
  const [businessLocation, setBusinessLocation] = useState<string | null>(null);
  const { styling, isLoading: stylingLoading } = useBusinessStyling(booking.business_id);
  
  useEffect(() => {
    if (styling.primaryColor) {
      document.documentElement.style.setProperty('--primary', styling.primaryColor);
    }
    if (styling.secondaryColor) {
      document.documentElement.style.setProperty('--secondary', styling.secondaryColor);
    }
    
    return () => {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--secondary');
    };
  }, [styling]);
  
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!booking.business_id) return;

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('business_name, avatar_url, id, street_address, city, state_province, country')
          .eq('id', booking.business_id)
          .single();

        if (profileError) throw profileError;
        
        if (profileData) {
          setBusinessProfile({
            id: profileData.id,
            business_name: profileData.business_name || "Business",
            avatar_url: profileData.avatar_url || undefined,
            account_type: "business"
          });
          
          setBusinessLogo(profileData.avatar_url || styling.logoUrl || null);
          
          if (profileData.street_address || profileData.city) {
            const locationParts = [
              profileData.street_address,
              profileData.city,
              profileData.state_province,
              profileData.country
            ].filter(Boolean);
            
            if (locationParts.length > 0) {
              setBusinessLocation(locationParts.join(', '));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    };

    fetchBusinessDetails();
  }, [booking.business_id, styling]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowPromotion(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      console.log("Auto-adding booking to WAKTI user calendar");
      setShowCalendarOptions(true);
    }
  }, [isAuthenticated]);
  
  const handleCalendarExport = () => {
    setShowPromotion(false);
    setShowCalendarOptions(true);
  };
  
  const handleDone = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleSubscribe = () => {
    if (isAuthenticated && businessProfile) {
      subscribe.mutate(booking.business_id);
    } else {
      navigate("/login", { 
        state: { from: window.location.pathname, subscribeAfter: booking.business_id } 
      });
    }
  };

  const handleOpenMaps = () => {
    if (businessLocation) {
      const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(businessLocation)}`;
      window.open(mapUrl, '_blank');
    }
  };

  return (
    <Card className="w-full shadow-md overflow-hidden border-primary/10">
      <CardHeader className="text-center bg-primary/5 pb-6">
        {businessLogo && (
          <div className="flex justify-center mb-4">
            <img 
              src={businessLogo} 
              alt={businessProfile?.business_name || "Business"} 
              className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
            />
          </div>
        )}
        <ConfirmationAnimation />
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <BookingServiceInfo booking={booking} serviceName={serviceName} />
        
        <BookingDetailsCard booking={booking} />
        
        <BookingReferenceDisplay bookingId={booking.id} />
        
        {businessLocation && (
          <div className="mt-4 border rounded-md p-3 bg-muted/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{businessLocation}</span>
              </div>
              <Button size="sm" variant="outline" onClick={handleOpenMaps}>
                View Map
              </Button>
            </div>
          </div>
        )}
        
        <CalendarExportOptions booking={booking} serviceName={serviceName} />
        
        {showPromotion && !isAuthenticated && (
          <AccountPromotionCard onCalendarExport={handleCalendarExport} />
        )}
        
        {!isSubscribed && isAuthenticated && businessProfile && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={handleSubscribe}
              className="w-full sm:w-auto"
              disabled={subscribe.isPending}
            >
              <Heart className="mr-2 h-4 w-4" />
              Subscribe to {businessProfile.business_name}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Get updates about services and special offers
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 p-6 pt-0">
        <Button 
          className="w-full" 
          onClick={handleDone}
        >
          {isAuthenticated ? "Go to Dashboard" : "Return to Home"}
        </Button>
      </CardFooter>
      
      <PoweredByWAKTI variant="colored" />
    </Card>
  );
};

export default ConfirmationCard;
