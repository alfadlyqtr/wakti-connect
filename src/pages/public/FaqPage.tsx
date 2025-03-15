
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const FaqPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      category: "General",
      faqs: [
        {
          question: "What is Wakti?",
          answer: "Wakti is an all-in-one platform for task management, appointment scheduling, and team collaboration. Our platform is designed for both individuals and businesses to maximize productivity and streamline workflow."
        },
        {
          question: "How much does Wakti cost?",
          answer: "Wakti offers three pricing tiers: Free, Individual ($9.99/month), and Business ($29.99/month). Each tier offers different features tailored to different needs. Visit our Pricing page for more details."
        },
        {
          question: "Is there a free trial for paid plans?",
          answer: "Yes, we offer a 14-day free trial for both our Individual and Business plans. No credit card is required to start your trial."
        },
        {
          question: "Can I upgrade or downgrade my plan at any time?",
          answer: "Yes, you can change your subscription plan at any time. When upgrading, you'll have immediate access to new features. When downgrading, your new plan will take effect at the end of your current billing cycle."
        }
      ]
    },
    {
      category: "Features",
      faqs: [
        {
          question: "What's the difference between the Free, Individual, and Business plans?",
          answer: "The Free plan provides view-only access to tasks and appointments. The Individual plan adds full task and appointment management, messaging, and contacts. The Business plan includes team management, staff assignment, business analytics, and more advanced features for organizations."
        },
        {
          question: "Can I share tasks with other users?",
          answer: "Yes, on the Individual and Business plans, you can share tasks with other Wakti users who are in your contacts list."
        },
        {
          question: "Does Wakti work on mobile devices?",
          answer: "Yes, Wakti is fully responsive and works on desktops, tablets, and mobile phones. We're also developing dedicated mobile apps for iOS and Android that will be released soon."
        },
        {
          question: "Can I integrate Wakti with other tools I use?",
          answer: "We currently offer integrations with Google Calendar, Microsoft Office 365, and Slack. We're continuously adding new integrations based on user feedback."
        }
      ]
    },
    {
      category: "Account & Security",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "You can sign up for a Wakti account by visiting our Sign Up page. You can register using your email address, or through Google or Facebook authentication."
        },
        {
          question: "Is my data secure with Wakti?",
          answer: "Yes, we take security seriously. Wakti uses industry-standard encryption for all data, both in transit and at rest. We never share your data with third parties without your explicit consent."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account at any time from your Account Settings page. Please note that account deletion is permanent and all your data will be removed from our systems."
        },
        {
          question: "What happens to my data if I cancel my subscription?",
          answer: "If you downgrade from a paid plan to the free plan, you'll still have access to view your existing data, but won't be able to add new items or edit existing ones. If you delete your account, all your data will be permanently removed."
        }
      ]
    },
    {
      category: "Business-Specific",
      faqs: [
        {
          question: "How many team members can I add to a Business account?",
          answer: "The standard Business plan includes up to 10 team members. For larger teams, please contact our sales team for custom pricing."
        },
        {
          question: "Can I set different permission levels for team members?",
          answer: "Yes, in the Business plan, you can assign different roles (Admin, Co-Admin, Staff) to team members with varying permission levels."
        },
        {
          question: "How does the appointment booking system work for businesses?",
          answer: "Business accounts can create bookable services, assign them to staff members, and manage customer appointments. Customers can book these services through your business profile page or via direct invitation links."
        },
        {
          question: "What analytics are available in the Business plan?",
          answer: "Business accounts have access to analytics including customer engagement, staff performance, appointment statistics, and booking conversion rates."
        }
      ]
    }
  ];

  // Filter FAQs based on search term
  const filteredFaqs = searchTerm 
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about Wakti and how it works.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((category, i) => (
            <div key={i} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, j) => (
                  <AccordionItem key={j} value={`item-${i}-${j}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any FAQs matching your search. Try different keywords or ask us directly.
            </p>
          </div>
        )}

        <div className="mt-16 bg-muted/60 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            If you couldn't find the answer you were looking for, our support team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
