
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqPage = () => {
  const [category, setCategory] = useState<string>("general");

  const faqCategories = [
    { id: "general", name: "General" },
    { id: "pricing", name: "Pricing & Plans" },
    { id: "features", name: "Features" },
    { id: "account", name: "Account & Security" },
    { id: "business", name: "Business Users" },
  ];

  const faqItems = {
    general: [
      {
        question: "What is WAKTI?",
        answer: "WAKTI is an all-in-one productivity platform that combines task management, appointment scheduling, messaging, and business tools in one seamless interface. It's designed to help individuals and businesses streamline their workflow and boost productivity."
      },
      {
        question: "Who can use WAKTI?",
        answer: "WAKTI is designed for everyone! We have plans for individuals looking to organize their personal tasks and appointments, as well as robust features for businesses of all sizes to manage their team, services, and clients."
      },
      {
        question: "Is WAKTI available on mobile devices?",
        answer: "Yes! WAKTI is fully responsive and works on desktop, tablet, and mobile devices. We also offer dedicated mobile apps for iOS and Android for a seamless on-the-go experience."
      },
      {
        question: "How do I get started with WAKTI?",
        answer: "Getting started is easy! Simply sign up for a free account, and you'll be guided through a simple onboarding process to set up your profile and preferences. You can start using basic features immediately and upgrade to a paid plan whenever you're ready."
      },
      {
        question: "Can I import data from other tools?",
        answer: "Yes, WAKTI supports importing data from popular productivity tools like Asana, Trello, Google Calendar, and more. Once you've created your account, you'll find import options in your settings."
      }
    ],
    pricing: [
      {
        question: "How much does WAKTI cost?",
        answer: "WAKTI offers three main plans: Free (with limited features), Individual ($9.99/month), and Business ($29.99/month). We also offer custom Enterprise plans for larger organizations. You can view detailed pricing information on our Pricing page."
      },
      {
        question: "Can I try WAKTI before subscribing?",
        answer: "Absolutely! Our Free plan allows you to explore basic features at no cost. Additionally, our paid plans come with a 14-day free trial, so you can test all features before committing."
      },
      {
        question: "Do you offer any discounts?",
        answer: "Yes, we offer discounted annual billing (save 20% compared to monthly billing), as well as special pricing for non-profits, educational institutions, and startups. Contact our sales team for more information."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), as well as PayPal. For Business and Enterprise plans, we also support invoice payment."
      },
      {
        question: "Can I change or cancel my plan?",
        answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time from your account settings. If you cancel a paid plan, you'll continue to have access until the end of your current billing period."
      }
    ],
    features: [
      {
        question: "What task management features does WAKTI offer?",
        answer: "WAKTI offers comprehensive task management including creating, editing, and prioritizing tasks, setting deadlines, adding to-do lists inside tasks, organizing with labels, sharing tasks with teammates, and tracking status (Pending, In Progress, Completed)."
      },
      {
        question: "How does the appointment booking system work?",
        answer: "Our appointment system allows you to create personal appointments and reminders, send event invitations to other users, and for business users, offer bookable services to clients. Clients can book through your public booking page or via the WAKTI AI Chatbot integration."
      },
      {
        question: "Can I communicate with my team or clients through WAKTI?",
        answer: "Yes! WAKTI includes a built-in messaging system that allows you to communicate with other WAKTI users in your contacts. Business users can message staff members and clients, while Individual users can message their contacts and subscribed businesses."
      },
      {
        question: "What makes WAKTI different from other productivity tools?",
        answer: "Unlike specialized tools that focus on just task management or appointment scheduling, WAKTI brings everything together in one platform. This eliminates the need to switch between multiple apps and ensures all your productivity data is connected and accessible."
      },
      {
        question: "Can I customize WAKTI to match my workflow?",
        answer: "Absolutely! WAKTI is highly customizable, from color-coded task labels to personalized dashboard views. Business users get even more customization options, including a mini landing page and custom service offerings."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "You can sign up by visiting our website and clicking the 'Sign Up' button. You can create an account using your email address, Google account, or other social login options."
      },
      {
        question: "Is my data secure with WAKTI?",
        answer: "Yes, we take security seriously. WAKTI uses industry-standard encryption, secure data centers, and follows best practices for data protection. We never share your data with third parties without your explicit permission."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account and all associated data at any time through your account settings. Please note that account deletion is permanent and cannot be undone."
      },
      {
        question: "How do I reset my password?",
        answer: "If you forget your password, you can reset it by clicking the 'Forgot Password' link on the login page. We'll send a password reset link to your registered email address."
      },
      {
        question: "Can I share my account with other people?",
        answer: "For security reasons, we recommend not sharing your account credentials. Instead, Business plan users can add team members with their own accounts and assign appropriate access levels."
      }
    ],
    business: [
      {
        question: "What features are exclusive to Business users?",
        answer: "Business users get access to team task assignments, staff management, work hour tracking, service management, business analytics, customizable business profile pages, and the ability to embed the WAKTI AI Chatbot for bookings."
      },
      {
        question: "How many team members can I add to my Business account?",
        answer: "The standard Business plan includes up to 5 team members. You can add additional members for a small monthly fee per user, or contact us about our custom Enterprise plans for larger teams."
      },
      {
        question: "Can I control what my team members can access?",
        answer: "Yes, WAKTI offers role-based permissions for Business accounts. You can assign roles (Admin, Co-Admin, Staff) to control exactly what each team member can view and modify."
      },
      {
        question: "How does the business analytics feature work?",
        answer: "Business analytics provides insights into your team's productivity, client engagement, service popularity, and revenue trends. You can view data in customizable dashboards and export reports for further analysis."
      },
      {
        question: "Can clients book appointments without creating a WAKTI account?",
        answer: "Yes! Your business gets a public booking page that clients can access without creating an account. For even more convenience, you can embed the WAKTI AI Chatbot on your website to handle bookings."
      }
    ]
  };

  const currentFaqs = faqItems[category as keyof typeof faqItems];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about WAKTI's features, pricing, and account management.
          </p>
        </section>

        {/* FAQ Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {faqCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              onClick={() => setCategory(cat.id)}
              className={category === cat.id ? "bg-wakti-blue" : ""}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            {currentFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions */}
        <section className="bg-muted rounded-xl p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@wakti.app">Email Us</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FaqPage;
