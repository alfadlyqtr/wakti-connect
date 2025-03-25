
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bot, MessageSquare, Clock, ShoppingCart, Users } from "lucide-react";

export const TMWAIChatbotPromotion: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-wakti-blue" />
          Enhance Your Business with TMW AI Chatbot
        </CardTitle>
        <CardDescription>
          Power up your customer experience with an AI chatbot that never sleeps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Your own AI chatbot for multiple platforms
          </h3>
          <p className="text-blue-700 mb-4">
            Get a powerful AI chatbot that can be integrated with your WAKTI landing page, 
            WhatsApp, Instagram, Facebook, or any website.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Customer Service</p>
                <p className="text-sm text-blue-700">Handle inquiries instantly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Order Tracking</p>
                <p className="text-sm text-blue-700">Let customers check status</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Customer Support</p>
                <p className="text-sm text-blue-700">Resolve issues quickly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">24/7 Availability</p>
                <p className="text-sm text-blue-700">Never sleeps, always ready</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-blue-800 italic mb-4">
            "TMW AI Chatbot is powered by ChatGPT technology, providing intelligent, 
            human-like conversations for your customers."
          </p>
          
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            Explore TMW AI Chatbot
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
