
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  Globe, 
  Heart,
  Shield,
  Zap,
} from "lucide-react";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Former product manager at Google, passionate about productivity tools and user experience."
    },
    {
      name: "Samantha Lee",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Tech enthusiast with 10+ years experience in software development and cloud architecture."
    },
    {
      name: "Michael Torres",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Award-winning designer focused on creating intuitive and beautiful user interfaces."
    },
    {
      name: "Rachel Kim",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Digital marketing specialist with a passion for growth strategies and customer engagement."
    }
  ];

  const values = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Efficiency First",
      description: "We believe your time is precious. Everything we build aims to save you time and boost your productivity."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Customer Obsessed",
      description: "Our customers are at the heart of every decision we make. Your success is our success."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Trust & Security",
      description: "We take data privacy seriously and implement robust security measures to protect your information."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Continuous Innovation",
      description: "We're constantly improving our platform with new features and enhancements based on user feedback."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Mindset",
      description: "We design for users across the world, considering diverse needs and accessibility requirements."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Passionate Team",
      description: "Our team is passionate about building tools that make a positive impact on how people work."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-wakti-blue to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
          <p className="text-xl max-w-3xl mx-auto mb-10 opacity-90">
            At WAKTI, we're on a mission to help individuals and businesses manage their time more effectively, 
            boost productivity, and achieve their goals with less stress.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-wakti-blue hover:bg-white/90"
            asChild
          >
            <Link to="/auth">Join Our Community</Link>
          </Button>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4">
                <p>
                  WAKTI was founded in 2022 by a team of productivity enthusiasts who were frustrated with 
                  juggling multiple tools for task management, scheduling, and communication.
                </p>
                <p>
                  We believed there had to be a better way to manage all these aspects of work in one unified platform. 
                  After months of research and development, we launched the first version of WAKTI with a simple goal: 
                  to create an all-in-one productivity solution that's powerful yet intuitive.
                </p>
                <p>
                  Today, WAKTI is used by thousands of individuals and businesses worldwide, from freelancers and 
                  small teams to large enterprises. We're constantly evolving our platform based on user feedback 
                  to make it the most effective productivity tool on the market.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="WAKTI team collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-background border rounded-lg p-4 shadow-lg w-32 h-32 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-wakti-blue">3K+</div>
                  <div className="text-sm text-muted-foreground">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at WAKTI, from product development to customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-background p-6 rounded-lg border hover:shadow-md transition-all">
                <div className="bg-wakti-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 text-wakti-blue">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The talented individuals behind WAKTI who are passionate about creating the best productivity tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-background rounded-lg border overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-wakti-blue text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-wakti-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of users who've already discovered the power of WAKTI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-wakti-blue hover:bg-white/90"
              asChild
            >
              <Link to="/auth">Get Started for Free</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
