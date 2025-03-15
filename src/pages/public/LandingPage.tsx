
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <div className="max-w-lg">
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
                  Manage Your Time Efficiently with{" "}
                  <span className="text-wakti-blue">Wakti</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  The all-in-one platform for task management, appointments, and team collaboration. Designed for individuals and businesses to maximize productivity.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/auth">Get Started Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/features">Explore Features</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative rounded-xl overflow-hidden border border-border shadow-xl">
                <img
                  src="/placeholder.svg"
                  alt="Wakti Dashboard Preview"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" /></svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Task Management</h3>
              <p className="text-muted-foreground">Create, organize, and track your tasks with customizable priorities and deadlines.</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Appointment Booking</h3>
              <p className="text-muted-foreground">Schedule and manage appointments with an intuitive calendar interface.</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Business Solutions</h3>
              <p className="text-muted-foreground">Team management, client communication, and business analytics all in one place.</p>
            </div>
          </div>
          <div className="mt-12">
            <Button asChild>
              <Link to="/features">View All Features</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section Preview */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start with our free tier and upgrade as you grow.
          </p>
          <div className="flex justify-center mb-8">
            <Button asChild>
              <Link to="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-wakti-blue text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Wakti to manage their time efficiently.
          </p>
          <Button size="lg" variant="outline" className="bg-white text-wakti-blue hover:bg-white/90" asChild>
            <Link to="/auth">Sign Up For Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
