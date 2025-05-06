
import React from "react";

const BusinessHours = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Business Hours</h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <h3 className="font-medium mb-2">Monday</h3>
              <p className="text-gray-700">9:00 AM - 5:00 PM</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-2">Tuesday</h3>
              <p className="text-gray-700">9:00 AM - 5:00 PM</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-2">Wednesday</h3>
              <p className="text-gray-700">9:00 AM - 5:00 PM</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-2">Thursday</h3>
              <p className="text-gray-700">9:00 AM - 5:00 PM</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-2">Friday</h3>
              <p className="text-gray-700">9:00 AM - 5:00 PM</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-2">Saturday</h3>
              <p className="text-gray-700">10:00 AM - 3:00 PM</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-2">Sunday</h3>
              <p className="text-gray-700">Closed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessHours;
