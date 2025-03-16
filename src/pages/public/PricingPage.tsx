
import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionContainer } from "@/components/ui/section-container";
import { FaqSection, FaqItem } from "@/components/ui/faq-section";

const PricingPage = () => {
  const pricingPlans = [
    {
      name: "Free",
      description: "For individuals just getting started",
      price: "$0",
      period: "forever",
      features: [
        "View-only access to tasks",
        "View-only access to appointments",
        "Accept invitations",
        "Subscribe to 1 business",
        "View notifications"
      ],
      buttonText: "Sign Up Free",
      buttonLink: "/auth?tab=register&plan=free",
      highlight: false,
    },
    {
      name: "Individual",
      description: "For personal productivity",
      price: "$9.99",
      period: "per month",
      features: [
        "Create, edit, and delete tasks",
        "Share tasks with other users",
        "Create and send invitations",
        "Full appointment scheduling",
        "Unlimited contacts",
        "Message individuals & businesses",
        "Priority support"
      ],
      buttonText: "Start 14-Day Trial",
      buttonLink: "/auth?tab=register&plan=individual",
      highlight: true,
    },
    {
      name: "Business",
      description: "For teams and businesses",
      price: "$29.99",
      period: "per month",
      features: [
        "All Individual features",
        "Assign tasks to staff",
        "Track staff logins & hours",
        "Public booking system",
        "Staff management",
        "Service management",
        "Business analytics",
        "Customizable business profile",
        "Premium support"
      ],
      buttonText: "Start 14-Day Trial",
      buttonLink: "/auth?tab=register&plan=business",
      highlight: false,
    },
  ];

  const pricingFaqs: FaqItem[] = [
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: (
        <p>
          Yes, you can upgrade or downgrade your plan at any time. The changes will take effect at
          the start of your next billing cycle. If you upgrade mid-cycle, you'll be charged a prorated
          amount for the remainder of the current billing period.
        </p>
      ),
    },
    {
      question: "Are there any long-term contracts?",
      answer: (
        <p>
          No, all WAKTI plans are billed monthly with no long-term commitment. You can cancel at
          any time. We also offer annual billing options with a discount for those who prefer to pay yearly.
        </p>
      ),
    },
    {
      question: "What payment methods do you accept?",
      answer: (
        <p>
          We accept all major credit cards including Visa, Mastercard, and American Express. For Business
          plans, we also offer invoice billing with net-30 terms. Contact our sales team for more information.
        </p>
      ),
    },
    {
      question: "Is there a free trial available?",
      answer: (
        <p>
          Yes, both our Individual and Business plans come with a 14-day free trial. You'll need to provide
          payment information to start the trial, but you won't be charged until the trial period ends.
          You can cancel anytime during the trial period.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <SectionContainer className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Transparent Pricing for Everyone</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. Start with our free tier and upgrade as you grow.
        </p>
      </SectionContainer>

      <SectionContainer className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.highlight
                  ? "border-wakti-blue shadow-lg relative overflow-hidden"
                  : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-wakti-blue text-white px-4 py-1 text-sm font-medium">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-wakti-blue shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.highlight ? "bg-wakti-blue hover:bg-wakti-blue/90" : ""
                  }`}
                  asChild
                >
                  <Link to={plan.buttonLink}>{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer className="mb-12 bg-muted/30 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Compare Plans in Detail</h2>
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
                <td className="py-4 px-6 font-medium" colSpan={4}>
                  <span className="font-bold">Task Management</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Create & Edit Tasks</td>
                <td className="py-4 px-6 text-center">View Only</td>
                <td className="py-4 px-6 text-center">✓</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Task Prioritization</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">✓</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Share Tasks</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">✓</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Assign Tasks to Team</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              
              <tr className="border-b">
                <td className="py-4 px-6 font-medium" colSpan={4}>
                  <span className="font-bold">Appointments</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Schedule Appointments</td>
                <td className="py-4 px-6 text-center">View Only</td>
                <td className="py-4 px-6 text-center">✓</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Booking Page</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">Basic</td>
                <td className="py-4 px-6 text-center">Custom</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Service Management</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              
              <tr className="border-b">
                <td className="py-4 px-6 font-medium" colSpan={4}>
                  <span className="font-bold">Team & Business</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Staff Management</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">✓</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Analytics</td>
                <td className="py-4 px-6 text-center">—</td>
                <td className="py-4 px-6 text-center">Basic</td>
                <td className="py-4 px-6 text-center">Advanced</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-6">Support</td>
                <td className="py-4 px-6 text-center">Email</td>
                <td className="py-4 px-6 text-center">Priority</td>
                <td className="py-4 px-6 text-center">Premium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionContainer>

      <SectionContainer>
        <FaqSection 
          title="Frequently Asked Questions" 
          subtitle="Have more questions about our pricing plans? Here are some answers."
          faqs={pricingFaqs} 
        />
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Still have questions about our pricing?{" "}
            <Link to="/contact" className="text-wakti-blue hover:underline">
              Contact us
            </Link>{" "}
            for more information.
          </p>
        </div>
      </SectionContainer>
    </div>
  );
};

export default PricingPage;
