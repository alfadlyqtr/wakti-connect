
import React from "react";
import { SectionType } from "../types";

interface TestimonialsSectionProps {
  section: SectionType;
  isActive: boolean;
  onClick: () => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ section, isActive, onClick }) => {
  const testimonials = section.content.testimonials || [
    {
      name: "John Smith",
      role: "Customer",
      text: "Excellent service! I've been coming here for years and have never been disappointed."
    },
    {
      name: "Emma Johnson",
      role: "New Client",
      text: "Very professional and friendly staff. Will definitely be back!"
    },
    {
      name: "Michael Brown",
      role: "Business Partner",
      text: "A pleasure to work with. Very knowledgeable and responsive team."
    }
  ];

  return (
    <div 
      className={`relative transition-all ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'}`}
      onClick={onClick}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-4 text-center">{section.title}</h2>
        <p className="text-gray-600 mb-8 text-center">{section.subtitle}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
              
              <p className="italic">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Editing
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
