
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Twitter, Instagram, Linkedin, Globe } from "lucide-react";

const SocialLinks = () => {
  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com", color: "text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com", color: "text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com", color: "text-pink-600" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com", color: "text-blue-700" },
    { name: "Website", icon: Globe, href: "https://tmw.qa", color: "text-green-600" }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium mb-4">Follow Us</h3>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              asChild
            >
              <a 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <link.icon className={`h-4 w-4 ${link.color}`} />
                {link.name}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinks;
