
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface TestimonialsSectionProps {
  section: BusinessPageSection;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  
  const {
    title = "What Our Clients Say",
    testimonials = []
  } = content;
  
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial: any, index: number) => (
          <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
            <p className="italic mb-4">{testimonial.text}</p>
            <div className="font-semibold">{testimonial.name}</div>
            {testimonial.title && (
              <div className="text-sm text-muted-foreground">{testimonial.title}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
