
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg",
      bio: "Alex founded Wakti with a vision to transform how individuals and businesses manage their time and tasks."
    },
    {
      name: "Sarah Chen",
      role: "Chief Product Officer",
      image: "/placeholder.svg",
      bio: "Sarah leads product development and ensures Wakti delivers intuitive and powerful solutions for our users."
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      image: "/placeholder.svg",
      bio: "Michael oversees our technical architecture and implementation, ensuring Wakti is robust, secure, and scalable."
    },
    {
      name: "Jessica Kim",
      role: "Head of Customer Success",
      image: "/placeholder.svg",
      bio: "Jessica ensures our customers receive exceptional support and maximize value from the Wakti platform."
    }
  ];

  const values = [
    {
      title: "User-Centric Design",
      description: "We put our users at the center of everything we create, focusing on intuitive interfaces and meaningful features."
    },
    {
      title: "Continuous Improvement",
      description: "We're never satisfied with the status quo, constantly innovating and improving our platform."
    },
    {
      title: "Transparency",
      description: "We believe in honest communication with our users about our services, pricing, and roadmap."
    },
    {
      title: "Empowerment",
      description: "We aim to empower individuals and businesses to achieve more through efficient time and task management."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/90">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Wakti</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're on a mission to help individuals and businesses maximize productivity through intelligent time and task management.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4">
                <p>
                  Wakti was founded in 2023 with a simple but powerful vision: to create a comprehensive platform that transforms how people manage their time, tasks, and business operations.
                </p>
                <p>
                  Our founder, Alex Johnson, experienced firsthand the challenges of juggling multiple task management and scheduling tools while running a small business. This frustration led to the creation of Wakti—a unified solution that brings together task management, appointment scheduling, and business operations.
                </p>
                <p>
                  Since our launch, we've grown to serve thousands of users across 30+ countries, from individual freelancers to medium-sized businesses with complex team structures.
                </p>
                <p>
                  Today, we're a team of 15 passionate individuals dedicated to continuously improving and expanding the Wakti platform to meet the evolving needs of our diverse user base.
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-xl overflow-hidden border border-border shadow-xl">
                <img
                  src="/placeholder.svg"
                  alt="Wakti Team"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border border-border shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-wakti-blue mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-wakti-blue text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us on Our Journey</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Try Wakti today and experience the difference our platform can make for your productivity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="bg-white text-wakti-blue hover:bg-white/90" asChild>
              <Link to="/auth">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
