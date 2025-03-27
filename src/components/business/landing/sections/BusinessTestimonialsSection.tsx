
import React from "react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  role?: string;
  company?: string;
}

interface BusinessTestimonialsSectionProps {
  content: Record<string, any>;
}

const BusinessTestimonialsSection: React.FC<BusinessTestimonialsSectionProps> = ({ 
  content 
}) => {
  const { 
    title = "What Our Customers Say",
    description = "Here's what our satisfied customers have to say about our services",
    testimonials = [],
    displayStyle = "cards"
  } = content;

  if (!testimonials.length) {
    return null; // Don't render if no testimonials
  }

  const renderTestimonials = () => {
    switch (displayStyle) {
      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial: Testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow animate-fade-in"
              >
                <div className="mb-4">
                  <div className="text-amber-500 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-muted-foreground italic mb-4">"{testimonial.text}"</blockquote>
                
                <div className="font-medium">
                  <div className="text-primary">{testimonial.name}</div>
                  {(testimonial.role || testimonial.company) && (
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}{testimonial.role && testimonial.company ? ', ' : ''}{testimonial.company}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'carousel':
        // Simple carousel - in production you'd want a proper carousel component
        return (
          <div className="overflow-hidden relative">
            <div className="flex overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
              {testimonials.map((testimonial: Testimonial) => (
                <div 
                  key={testimonial.id}
                  className="min-w-[300px] max-w-sm flex-shrink-0 mx-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md snap-center animate-fade-in"
                >
                  <blockquote className="text-muted-foreground italic mb-4">"{testimonial.text}"</blockquote>
                  
                  <div className="font-medium">
                    <div className="text-primary">{testimonial.name}</div>
                    {(testimonial.role || testimonial.company) && (
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}{testimonial.role && testimonial.company ? ', ' : ''}{testimonial.company}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'simple':
      default:
        return (
          <div className="space-y-6">
            {testimonials.map((testimonial: Testimonial) => (
              <div key={testimonial.id} className="border-l-4 border-primary pl-4 animate-fade-in">
                <blockquote className="text-muted-foreground italic mb-2">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="font-medium">
                  <span className="text-primary">{testimonial.name}</span>
                  {(testimonial.role || testimonial.company) && (
                    <span className="text-sm text-muted-foreground">
                      {' — '}{testimonial.role}{testimonial.role && testimonial.company ? ', ' : ''}{testimonial.company}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <section className="py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>
      
      <div className="max-w-6xl mx-auto px-4">
        {renderTestimonials()}
      </div>
    </section>
  );
};

export default BusinessTestimonialsSection;
