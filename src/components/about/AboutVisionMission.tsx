
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";

const AboutVisionMission = () => {
  return (
    <SectionContainer className="bg-muted/30">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-card p-8 rounded-lg border">
          <h3 className="text-2xl font-bold mb-4 text-wakti-blue">Our Vision</h3>
          <p className="text-muted-foreground">
            We envision a world where people and businesses spend less time on managing their work 
            and more time on doing what they love. WAKTI aims to become the leading productivity 
            platform that simplifies work management across diverse industries.
          </p>
        </div>
        
        <div className="bg-card p-8 rounded-lg border">
          <h3 className="text-2xl font-bold mb-4 text-wakti-blue">Our Mission</h3>
          <p className="text-muted-foreground">
            Our mission is to create intuitive tools that enhance productivity and streamline workflows. 
            We're committed to building solutions that are accessible, powerful, and adaptable to the 
            evolving needs of our users, from individuals to large enterprises.
          </p>
        </div>
      </div>
      
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-center">How WAKTI Helps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <h4 className="text-xl font-semibold mb-3">For Individuals</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Simplify personal task management and scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Keep track of appointments and deadlines</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Improve personal productivity and focus</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Reduce stress with better time management</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h4 className="text-xl font-semibold mb-3">For Businesses</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Streamline team coordination and task assignment</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Manage staff scheduling and appointments</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Track performance with comprehensive analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Enhance customer experience with booking system</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutVisionMission;
