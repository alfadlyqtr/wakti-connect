
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface TestimonialsSectionProps {
  section: BusinessPageSection;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  
  const {
    title = "What Our Clients Say",
    description = "",
    testimonials = []
  } = content;
  
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial: any, index: number) => (
            <div key={index} className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="relative">
                <span className="text-4xl text-primary/20 absolute -top-4 -left-2">"</span>
                <p className="italic relative z-10 mb-4">
                  {testimonial.text}
                </p>
                <span className="text-4xl text-primary/20 absolute -bottom-4 -right-2">"</span>
              </div>
              
              <div className="mt-6 flex items-center">
                {testimonial.image ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold mr-4">
                    {testimonial.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  {testimonial.title && (
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
