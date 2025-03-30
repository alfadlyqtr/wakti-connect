
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useBookingTemplates } from "@/hooks/useBookingTemplates";
import { Loader2, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import BookingModalContent from "@/components/business/landing/booking/BookingModalContent";

interface BusinessBookingTemplatesSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessBookingTemplatesSection: React.FC<BusinessBookingTemplatesSectionProps> = ({ content, businessId }) => {
  const {
    title = "Book an Appointment",
    subtitle = "Schedule a time to meet with us",
    layout = "cards", // grid, list, carousel, or cards
    buttonText = "Book Now", // Default button text
    showBookButton = true, // Control if book buttons are shown
  } = content;

  const { templates, isLoading, error } = useBookingTemplates(businessId);
  const { formatCurrency } = useCurrencyFormat({ businessId });
  
  // State for booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // For debugging
  React.useEffect(() => {
    console.log("BusinessBookingTemplatesSection mounted");
    console.log("Content:", content);
    console.log("BusinessId:", businessId);
    console.log("Templates:", templates);
    console.log("IsLoading:", isLoading);
    console.log("Error:", error);
  }, [content, businessId, templates, isLoading, error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !templates || templates.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}
        <div className="text-center py-6 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No booking templates available.</p>
        </div>
      </div>
    );
  }

  const handleBookNow = (template: any) => {
    // Validate template before opening modal
    if (!template || !template.id) {
      console.error("Invalid template selected for booking", template);
      toast({
        title: "Error",
        description: "Unable to process booking request. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Opening booking modal for template: ${template.id}: ${template.name}`);
    setSelectedTemplate(template);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}

      <Tabs defaultValue={layout || "cards"} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="carousel">Carousel</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        {/* Cards Layout (New) */}
        <TabsContent value="cards" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 h-full">
                <CardHeader className="bg-gradient-to-br from-primary/20 to-primary/5 p-6">
                  <h3 className="text-xl font-semibold">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {template.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-4 flex-grow">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="font-medium">{template.duration} minutes</span>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      {template.price ? formatCurrency(template.price) : "Free"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {template.details && (
                      <div className="text-sm text-muted-foreground">
                        {template.details}
                      </div>
                    )}
                  </div>
                </CardContent>
                {showBookButton && (
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => handleBookNow(template)}
                      size="lg"
                    >
                      <Calendar className="mr-2 h-4 w-4" /> {buttonText}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Grid Layout */}
        <TabsContent value="grid" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden flex flex-col">
                <CardHeader className="bg-primary/5 p-4">
                  <h3 className="text-lg font-medium">{template.name}</h3>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {template.description || "No description available"}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-medium">
                        {template.duration} minutes
                      </span>
                      <span className="text-primary font-bold">
                        {template.price ? formatCurrency(template.price) : "Free"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                {showBookButton && (
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => handleBookNow(template)}
                    >
                      <Calendar className="mr-2 h-4 w-4" /> {buttonText}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* List Layout */}
        <TabsContent value="list" className="w-full">
          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end space-y-1">
                    <span className="text-sm">{template.duration} minutes</span>
                    <span className="text-primary font-bold">
                      {template.price ? formatCurrency(template.price) : "Free"}
                    </span>
                    {showBookButton && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleBookNow(template)}
                      >
                        <Calendar className="mr-2 h-4 w-4" /> {buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Carousel Layout */}
        <TabsContent value="carousel" className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {templates.map((template) => (
                <CarouselItem key={template.id} className="sm:basis-1/2 lg:basis-1/3">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="bg-primary/5 p-4">
                      <h3 className="text-lg font-medium">{template.name}</h3>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {template.description || "No description available"}
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm font-medium">
                            {template.duration} minutes
                          </span>
                          <span className="text-primary font-bold">
                            {template.price ? formatCurrency(template.price) : "Free"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    {showBookButton && (
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          className="w-full" 
                          onClick={() => handleBookNow(template)}
                        >
                          <Calendar className="mr-2 h-4 w-4" /> {buttonText}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </TabsContent>
      </Tabs>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Fill out the details to book your appointment
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <BookingModalContent 
              businessId={businessId}
              template={selectedTemplate}
              onClose={() => setIsBookingModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessBookingTemplatesSection;
