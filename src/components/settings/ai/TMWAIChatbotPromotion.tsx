
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, Bot, MessageSquare, Clock, ShoppingCart, 
  Users, Globe, BrainCircuit, Store, Megaphone, 
  Smartphone, Instagram, Facebook, Building, BarChart
} from "lucide-react";

export const TMWAIChatbotPromotion: React.FC = () => {
  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bot className="h-6 w-6 text-wakti-blue" />
          Transform Your Business with TMW AI Chatbot
        </CardTitle>
        <CardDescription className="text-blue-700 font-medium">
          Enterprise-grade AI assistant powered by advanced ChatGPT technology
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            One AI solution for all your business needs
          </h3>
          <p className="text-blue-700 mb-4 text-base">
            TMW AI Chatbot is a comprehensive business solution that transforms customer engagement,
            sales, marketing, and operations across all your digital channels. Powered by the latest ChatGPT
            technology, it delivers human-like conversations personalized to your business requirements.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-start gap-3 mb-2">
                <BrainCircuit className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Advanced AI Intelligence</p>
                  <p className="text-sm text-blue-700">Leverages cutting-edge Large Language Models for natural, contextual conversations and complex problem-solving</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-start gap-3 mb-2">
                <Globe className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Omnichannel Integration</p>
                  <p className="text-sm text-blue-700">Seamlessly connects with WhatsApp, Instagram, Facebook, Telegram, Websites, and your WAKTI business page</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-start gap-3 mb-2">
                <Store className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Business Automation</p>
                  <p className="text-sm text-blue-700">Handles bookings, answers FAQs, manages inventory, and processes orders without human intervention</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">24/7 Customer Service</p>
                <p className="text-xs text-blue-700">Immediate responses at any time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Sales Automation</p>
                <p className="text-xs text-blue-700">Converts inquiries into sales</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Lead Generation</p>
                <p className="text-xs text-blue-700">Qualifies prospects automatically</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <BarChart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Analytics & Insights</p>
                <p className="text-xs text-blue-700">Customer behavior tracking</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Megaphone className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Marketing Campaigns</p>
                <p className="text-xs text-blue-700">Automated outreach and follow-ups</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Business Intelligence</p>
                <p className="text-xs text-blue-700">Data-driven decision making</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Mobile App Integration</p>
                <p className="text-xs text-blue-700">Works with all mobile platforms</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Appointment Scheduling</p>
                <p className="text-xs text-blue-700">Automated booking management</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center">
              <Instagram className="h-6 w-6 text-pink-600 mb-2" />
              <p className="text-sm font-medium text-center">Instagram Integration</p>
              <p className="text-xs text-center text-muted-foreground">Direct message automation</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center">
              <Facebook className="h-6 w-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-center">Facebook Messenger</p>
              <p className="text-xs text-center text-muted-foreground">Automated customer interactions</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg flex flex-col items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="h-6 w-6 text-green-600 mb-2"
              >
                <path 
                  d="M17.6 6.32C16.16 4.9 14.13 4.07 12 4.07 7.64 4.07 4.07 7.64 4.07 12c0 1.31.31 2.58.93 3.74L4 20l4.41-1.15C9.5 19.54 10.71 19.83 12 19.83c4.36 0 7.93-3.57 7.93-7.93 0-2.12-.83-4.14-2.33-5.58zM12 18.53c-1.19 0-2.36-.3-3.39-.86l-.24-.14-2.5.66.66-2.41-.15-.24c-.63-1.05-.95-2.26-.95-3.54 0-3.67 2.98-6.65 6.65-6.65 1.78 0 3.45.69 4.71 1.94 1.25 1.26 1.94 2.93 1.94 4.71 0 3.67-2.98 6.65-6.65 6.65zm3.62-4.97c-.2-.1-1.18-.58-1.36-.65-.18-.06-.32-.1-.45.1-.13.2-.5.65-.62.78-.11.13-.23.15-.43.05-.2-.1-.85-.31-1.62-.99-.6-.53-1-1.19-1.12-1.39-.12-.2-.01-.31.09-.41.09-.09.2-.24.3-.36.1-.12.13-.21.2-.35.06-.14.03-.26-.02-.36-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.33-.45-.34-.11-.01-.25-.01-.38-.01-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66 0 .98.71 1.92.81 2.05.1.13 1.4 2.13 3.39 2.99.47.2.84.32 1.13.41.48.15.91.13 1.25.08.38-.06 1.18-.48 1.35-.95.17-.46.17-.86.12-.95-.05-.09-.19-.14-.39-.24z"
                />
              </svg>
              <p className="text-sm font-medium text-center">WhatsApp Business</p>
              <p className="text-xs text-center text-muted-foreground">Instant messaging solutions</p>
            </div>
          </div>
          
          <div className="bg-blue-900 text-white p-4 rounded-lg mb-5">
            <p className="text-sm italic mb-1 font-medium">
              "TMW AI Chatbot delivers enterprise-grade AI capabilities that go far beyond basic chatbots. 
              It's a complete business solution that handles customer service, sales, marketing, and operations 
              across all digital channels. Our clients have seen up to 35% increase in conversions and 60% reduction 
              in support costs."
            </p>
            <p className="text-xs text-blue-200">
              - Trusted by leading businesses across Qatar and the Middle East
            </p>
          </div>
          
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3">
            <ExternalLink className="h-4 w-4 mr-2" />
            Explore TMW AI Chatbot Solutions
          </Button>
          
          <p className="text-xs text-center mt-3 text-blue-600">
            <a href="https://tmw.qa/ai-chat-bot/" target="_blank" rel="noopener noreferrer" className="underline">
              Visit tmw.qa/ai-chat-bot for detailed information and pricing
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
