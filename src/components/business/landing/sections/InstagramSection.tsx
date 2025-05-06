
import React from "react";
import { BusinessPageSection } from "@/types/business.types";

interface InstagramSectionProps {
  section: BusinessPageSection;
}

const InstagramSection: React.FC<InstagramSectionProps> = ({ section }) => {
  const content = section.section_content || {};
  
  const {
    title = "Follow Us on Instagram",
    description = "Check out our latest posts",
    username = "",
    posts = []
  } = content;
  
  if (!username && (!posts || posts.length === 0)) {
    return null;
  }
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
      {description && <p className="text-center mb-6">{description}</p>}
      
      {username && (
        <div className="text-center mb-6">
          <a 
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline"
          >
            @{username}
          </a>
        </div>
      )}
      
      {posts && posts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post: any, index: number) => (
            <a 
              key={index}
              href={post.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square overflow-hidden"
            >
              <img 
                src={post.image} 
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </a>
          ))}
        </div>
      )}
    </section>
  );
};

export default InstagramSection;
