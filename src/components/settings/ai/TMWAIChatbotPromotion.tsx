
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bot, MessageSquare, Clock, ShoppingCart, Users, Globe, BrainCircuit, Store, Megaphone } from "lucide-react";

export const TMWAIChatbotPromotion: React.FC = () => {
  return (
    <Card className="border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bot className="h-6 w-6 text-wakti-blue" />
          Transform Your Business with TMW AI Chatbot
        </CardTitle>
        <CardDescription className="text-blue-700 font-medium">
          Enterprise-grade AI chatbot that works across multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-3">
            One AI chatbot, multiple platforms integration
          </h3>
          <p className="text-blue-700 mb-4 text-base">
            Seamlessly integrate TMW AI Chatbot with your WAKTI landing page, WhatsApp, 
            Instagram, Facebook, Telegram, and any website to provide powerful, personalized 
            customer experiences across all channels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-start gap-3 mb-2">
                <BrainCircuit className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">AI-Powered Intelligence</p>
                  <p className="text-sm text-blue-700">Advanced machine learning for natural conversations and personalized recommendations</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-start gap-3 mb-2">
                <Globe className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Multi-Platform Integration</p>
                  <p className="text-sm text-blue-700">Works with WhatsApp, Instagram, Facebook, Websites, and more</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-start gap-3 mb-2">
                <Store className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">E-Commerce Ready</p>
                  <p className="text-sm text-blue-700">Product recommendations, order tracking, and inventory management</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Automated Support</p>
                <p className="text-sm text-blue-700">Handles common questions instantly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Sales Assistance</p>
                <p className="text-sm text-blue-700">Guides customers to purchase</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Lead Generation</p>
                <p className="text-sm text-blue-700">Captures and qualifies prospects</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">24/7 Availability</p>
                <p className="text-sm text-blue-700">Works round the clock</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Megaphone className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Marketing Campaigns</p>
                <p className="text-sm text-blue-700">Promotes products and offers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-900 text-white p-4 rounded-lg mb-5">
            <p className="text-sm italic mb-1 font-medium">
              "TMW AI Chatbot leverages the latest ChatGPT technology, offering human-like conversations tailored 
              to your business needs. It learns from interactions to continuously improve its performance."
            </p>
            <p className="text-xs text-blue-200">
              - Used by leading businesses across Qatar and the Middle East
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
