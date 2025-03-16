
import React from "react";
import { Link } from "react-router-dom";
import { 
  ClipboardCheck, 
  Calendar, 
  MessageSquare, 
  Users, 
  Bell, 
  BarChart4, 
  Briefcase, 
  Clock,
  Share2,
  Search,
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";

const FeatureSection = ({ 
  icon, 
  title, 
  description, 
  color = "bg-wakti-blue/10 text-wakti-blue" 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color?: string;
}) => (
  <div className="flex flex-col items-start gap-4 p-6 rounded-xl border hover:shadow-md transition-all">
    <div className={`p-2 rounded-lg ${color}`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const FeatureDetail = ({ title, features }: { title: string; features: string[] }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <span className="text-green-500 mr-2">✅</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

const FeaturesPage = () => {
  const features = [
    {
      icon: <ClipboardCheck size={24} />,
      title: "Task Management",
      description: "Create, edit, prioritize, and share tasks with teammates. Track progress with status updates and to-do lists.",
      color: "bg-wakti-blue/10 text-wakti-blue"
    },
    {
      icon: <Calendar size={24} />,
      title: "Appointment Booking",
      description: "Schedule personal appointments or offer bookable services to clients with a customizable booking system.",
      color: "bg-green-500/10 text-green-500"
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Messaging System",
      description: "Communicate with team members, clients, and contacts through our secure messaging platform.",
      color: "bg-indigo-500/10 text-indigo-500"
    },
    {
      icon: <Users size={24} />,
      title: "Contact Management",
      description: "Organize your contacts and connections with comprehensive contact management tools.",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      icon: <Briefcase size={24} />,
      title: "Business Dashboard",
      description: "Manage your business with a customizable mini landing page and business management tools.",
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      icon: <LayoutDashboard size={24} />,
      title: "Role-Based Access",
      description: "Different dashboard views and permissions for free users, individuals, and businesses.",
      color: "bg-cyan-500/10 text-cyan-500"
    },
    {
      icon: <Bell size={24} />,
      title: "Notifications & Alerts",
      description: "Stay updated with real-time notifications for tasks, messages, and appointment changes.",
      color: "bg-rose-500/10 text-rose-500"
    },
    {
      icon: <BarChart4 size={24} />,
      title: "Business Analytics",
      description: "Track performance, engagement, and growth with comprehensive business analytics.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: <Clock size={24} />,
      title: "Work Hour Tracking",
      description: "Monitor staff working hours and track daily earnings for better business management.",
      color: "bg-teal-500/10 text-teal-500"
    },
    {
      icon: <Share2 size={24} />,
      title: "Sharing Capabilities",
      description: "Share tasks, events, and appointments with team members or contacts easily.",
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      icon: <Search size={24} />,
      title: "Powerful Search",
      description: "Find tasks, appointments, contacts, and messages quickly with our advanced search feature.",
      color: "bg-violet-500/10 text-violet-500"
    },
    {
      icon: <CheckCircle2 size={24} />,
      title: "Task Status Tracking",
      description: "Track task progress with custom statuses: Pending, Completed, and In Progress.",
      color: "bg-emerald-500/10 text-emerald-500"
    }
  ];

  const taskManagementFeatures = [
    "Daily, Weekly, Monthly, and Quarterly Task Views",
    "Drag & Drop Sorting Between Categories",
    "Priority-Based Task Colors (High, Urgent, Medium, Normal)",
    "To-Do List (Subtasks for Each Task)",
    "Team Task Assignment",
    "Task History & Visual Charts"
  ];

  const appointmentFeatures = [
    "Create and Manage Services",
    "Shareable Booking Pages (Custom Branding, Logo, Colors, Fonts)",
    "Manage & Assign Appointments",
    "Automatic Appointment Reminders"
  ];

  const dashboardFeatures = [
    "Dashboard with Task & Appointment Summary",
    "User Role Management (Individuals, Businesses, Staff)",
    "Dark Mode & Light Mode Switcher",
    "Bilingual Support (Arabic & English)"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <SectionContainer className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features for Everyone</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Discover how WAKTI helps individuals and businesses manage tasks, appointments, 
          and communications all in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/auth">Try For Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/pricing">View Pricing</Link>
          </Button>
        </div>
      </SectionContainer>

      {/* Feature Detail Section */}
      <SectionContainer className="bg-muted/30 mb-12">
        <h2 className="text-3xl font-bold mb-8">Core Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-wakti-blue/10 p-3 rounded-full text-wakti-blue">
                <ClipboardCheck size={28} />
              </div>
              <h2 className="text-2xl font-bold">Task Management</h2>
            </div>
            <FeatureDetail title="" features={taskManagementFeatures} />
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500/10 p-3 rounded-full text-green-500">
                <Calendar size={28} />
              </div>
              <h2 className="text-2xl font-bold">Appointment Scheduling</h2>
            </div>
            <FeatureDetail title="" features={appointmentFeatures} />
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-500/10 p-3 rounded-full text-purple-500">
                <LayoutDashboard size={28} />
              </div>
              <h2 className="text-2xl font-bold">Dashboard & User Management</h2>
            </div>
            <FeatureDetail title="" features={dashboardFeatures} />
          </div>
        </div>
      </SectionContainer>

      {/* All Features Grid */}
      <SectionContainer className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">All Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureSection
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </SectionContainer>

      {/* CTA Section */}
      <section className="py-16 px-4 rounded-xl bg-gradient-to-r from-wakti-blue to-blue-600 text-white mb-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of individuals and businesses who use WAKTI to streamline their productivity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-wakti-blue hover:bg-white/90" asChild>
              <Link to="/auth">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <SectionContainer className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-10">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-4 px-6 text-left">Feature</th>
                <th className="py-4 px-6 text-center">Free</th>
                <th className="py-4 px-6 text-center">Individual</th>
                <th className="py-4 px-6 text-center">Business</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Task Management</td>
                <td className="py-4 px-6 text-center">View Only</td>
                <td className="py-4 px-6 text-center">Full Access</td>
                <td className="py-4 px-6 text-center">Team Access</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Appointment Booking</td>
                <td className="py-4 px-6 text-center">View Only</td>
                <td className="py-4 px-6 text-center">Full Access</td>
                <td className="py-4 px-6 text-center">Business-wide</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Messaging</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">Limited</td>
                <td className="py-4 px-6 text-center">Full Access</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Business Dashboard</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">Full Access</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6 font-medium">Staff Management</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">Full Access</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-center mt-8">
          <Button asChild>
            <Link to="/pricing">View Full Pricing Details</Link>
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
};

export default FeaturesPage;
