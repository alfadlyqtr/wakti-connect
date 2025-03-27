
import React from "react";
import InstagramEmbed from "react-instagram-embed";

interface BusinessInstagramSectionProps {
  content: Record<string, any>;
}

const BusinessInstagramSection: React.FC<BusinessInstagramSectionProps> = ({ content }) => {
  const { 
    title = "Follow Us on Instagram",
    description = "Check out our latest posts and updates",
    instagramUrl,
    hideCaption = false,
    centeredContent = true,
    maxWidth = 500
  } = content;

  if (!instagramUrl) return null;

  return (
    <section className="py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      <div className={centeredContent ? "flex justify-center animate-fade-in" : "animate-fade-in"}>
        <div style={{ maxWidth: `${maxWidth}px` }} className="w-full">
          <InstagramEmbed
            url={instagramUrl}
            clientAccessToken="123|456" // This is a placeholder, actual token needed in production
            hideCaption={hideCaption}
            containerTagName="div"
            injectScript
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </section>
  );
};

export default BusinessInstagramSection;
