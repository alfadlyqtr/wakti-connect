
import React from "react";
import { BusinessPageSection } from "@/types/business.types";
import { Card, CardContent } from "@/components/ui/card";
import { User, Star } from "lucide-react";

interface BusinessTestimonialsProps {
  section: BusinessPageSection;
}

const BusinessTestimonials = ({ section }: BusinessTestimonialsProps) => {
  const content = section.section_content || {};
  
  const {
    title = "Testimonials",
    testimonials = []
  } = content;
  
  if (!testimonials || testimonials.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No testimonials available</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {testimonial.avatar ? (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  {testimonial.rating && (
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground">"{testimonial.text}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessTestimonials;
