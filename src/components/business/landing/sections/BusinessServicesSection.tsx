
import React from "react";

interface BusinessServicesSectionProps {
  content: Record<string, any>;
  businessId: string;
}

const BusinessServicesSection: React.FC<BusinessServicesSectionProps> = ({ 
  content, 
  businessId 
}) => {
  const { 
    title = "Our Services",
    description = "We offer a variety of professional services",
    showPrices = true,
    showDuration = true,
    displayAsCards = true
  } = content;
  
  // This would normally be fetched from the API based on the businessId
  const services = [
    {
      id: '1',
      name: 'Service 1',
      description: 'Description for service 1',
      price: 100,
      duration: 60
    },
    {
      id: '2',
      name: 'Service 2',
      description: 'Description for service 2',
      price: 75,
      duration: 45
    }
  ];
  
  if (!services || services.length === 0) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground">No services available at the moment.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        {displayAsCards ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-card rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mt-4">
                    {showPrices && (
                      <span className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                        ${service.price}
                      </span>
                    )}
                    
                    {showDuration && (
                      <span className="inline-flex items-center bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-medium">
                        {service.duration} min
                      </span>
                    )}
                  </div>
                  
                  <button className="mt-4 w-full bg-primary text-primary-foreground rounded-md py-2 px-4 font-medium hover:bg-primary/90 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-lg shadow-sm divide-y">
              {services.map(service => (
                <div key={service.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      {showPrices && (
                        <span className="font-semibold">${service.price}</span>
                      )}
                      
                      {showDuration && (
                        <span className="text-sm text-muted-foreground">{service.duration} min</span>
                      )}
                      
                      <button className="mt-2 bg-primary text-primary-foreground rounded-md py-1 px-3 text-sm font-medium hover:bg-primary/90 transition-colors">
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessServicesSection;
