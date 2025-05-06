
import React from "react";

interface BusinessTestimonialsSectionProps {
  content: Record<string, any>;
  primaryColor?: string;
}

const BusinessTestimonialsSection: React.FC<BusinessTestimonialsSectionProps> = ({ content, primaryColor }) => {
  const { 
    title = "What Our Clients Say",
    description = "Read testimonials from our satisfied customers",
    testimonials = [
      {
        name: "John Smith",
        role: "Regular Customer",
        image: "",
        comment: "Excellent service! I've been coming here for years and have never been disappointed."
      },
      {
        name: "Emma Johnson",
        role: "New Client",
        image: "",
        comment: "Very professional and friendly staff. Will definitely be back!"
      },
      {
        name: "Michael Brown",
        role: "Business Partner",
        image: "",
        comment: "A pleasure to work with. Very knowledgeable and responsive team."
      }
    ],
    layout = "grid" // or "slider"
  } = content;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                {testimonial.image ? (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold mr-4"
                    style={primaryColor ? { backgroundColor: `${primaryColor}20`, color: primaryColor } : {}}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="relative">
                <span 
                  className="text-4xl text-primary/20 absolute -top-4 -left-2"
                  style={primaryColor ? { color: `${primaryColor}20` } : {}}
                >
                  "
                </span>
                <p className="italic relative z-10">
                  {testimonial.comment}
                </p>
                <span 
                  className="text-4xl text-primary/20 absolute -bottom-8 -right-2"
                  style={primaryColor ? { color: `${primaryColor}20` } : {}}
                >
                  "
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessTestimonialsSection;
