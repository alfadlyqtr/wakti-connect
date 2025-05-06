
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BusinessPageSection } from "@/types/business.types";
import { Instagram } from "lucide-react";

interface InstagramSectionProps {
  section: BusinessPageSection;
}

const InstagramSection: React.FC<InstagramSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  
  const {
    title = "Follow Us on Instagram",
    description = "Check out our latest posts",
    username = "",
    feed_type = "recent",
    post_count = 6,
    show_profile = true
  } = content;
  
  // This is a placeholder component - in a real implementation, 
  // this would connect to Instagram's API or embed their feed
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
        
        {username ? (
          <div>
            {show_profile && (
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Instagram className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">@{username}</h3>
                    <a 
                      href={`https://instagram.com/${username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: post_count }).map((_, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  <Instagram className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Instagram className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Add your Instagram username to display your feed
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default InstagramSection;
