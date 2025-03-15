
import React from "react";
import { Link } from "react-router-dom";
import { 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Bell, 
  Users, 
  BarChart, 
  Clock,
  Briefcase,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturesPage = () => {
  const featureSections = [
    {
      title: "Task Management",
      description: "Powerful tools to organize and track your daily tasks",
      icon: <CheckSquare className="h-10 w-10 text-wakti-blue mb-4" />,
      features: [
        "Create, edit, delete, and snooze tasks",
        "Track task status: Pending, Completed, In Progress",
        "Prioritize tasks with High, Urgent, Medium, Normal levels",
        "Create To-Do lists inside tasks",
        "Drag & drop sorting between daily, weekly, monthly categories",
        "Share tasks with other users",
        "Color-coded task labels"
      ]
    },
    {
      title: "Appointment & Booking",
      description: "Seamless scheduling for individuals and businesses",
      icon: <Calendar className="h-10 w-10 text-wakti-blue mb-4" />,
      features: [
        "Create personal appointments & reminders",
        "Send event invitations to other app users",
        "Business service booking management",
        "Staff assignment for services",
        "Manage customer appointments",
        "Customizable event cards with images and styling",
        "Share via WhatsApp, Email, SMS, or Direct Link"
      ]
    },
    {
      title: "Messaging & Contacts",
      description: "Stay connected with your network",
      icon: <MessageSquare className="h-10 w-10 text-wakti-blue mb-4" />,
      features: [
        "Message other individual users in your contacts",
        "Message businesses you're subscribed to",
        "For businesses: message customers & staff",
        "View subscribers & customers list",
        "Search for other individuals or businesses",
        "Privacy controls for messaging and visibility"
      ]
    },
    {
      title: "Business Dashboard",
      description: "Comprehensive tools for business management",
      icon: <Briefcase className="h-10 w-10 text-wakti-blue mb-4" />,
      features: [
        "Public Business Profile Page viewable without login",
        "Fully customizable landing page with logo & images",
        "Set business hours & contact information",
        "List services & booking options",
        "Add social media links",
        "Customize backgrounds & buttons",
        "TMW AI Chatbot Integration"
      ]
    },
    {
      title: "Business Management",
      description: "Tools to manage your team and operations",
      icon: <Settings className="h-10 w-10 text-wakti-blue mb-4" />,
      features: [
        "Assign tasks to staff members",
        "Track staff working hours with Start & End Day Tracking",
        "Staff can log daily earnings for walk-in customers",
        "Manage Staff Permissions (Admin, Co-Admin, Staff)",
        "View Subscribers & Customer Engagement Analytics"
      ]
    },
    {
      title: "Notifications & Alerts",
      description: "Stay updated with real-time notifications",
      icon: <Bell className="h-10 w-10 text-wakti-blue mb-4" />,
      features: [
        "Real-time notifications for task updates & reminders",
        "Alerts for new messages & invites",
        "Booking confirmations & changes notifications",
        "Fixed top bar for notifications on all devices"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/90">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features for Everyone</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover all the tools and capabilities that make Wakti the perfect solution for individuals and businesses.
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Features Sections */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {featureSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <div className="flex flex-col items-start">
                  {section.icon}
                  <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground mb-6">{section.description}</p>
                </div>
                <ul className="space-y-2">
                  {section.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2">
                      <div className="bg-wakti-blue/10 text-wakti-blue p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-wakti-blue text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Sign up today and start exploring all that Wakti has to offer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="bg-white text-wakti-blue hover:bg-white/90" asChild>
              <Link to="/auth">Sign Up Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
