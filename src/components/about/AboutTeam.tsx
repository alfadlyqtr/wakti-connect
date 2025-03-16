
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeading } from "@/components/ui/section-heading";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const AboutTeam = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Alex Johnson",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Former product manager at Google, passionate about productivity tools and user experience."
    },
    {
      name: "Samantha Lee",
      role: "CTO & Co-Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Tech enthusiast with 10+ years experience in software development and cloud architecture."
    },
    {
      name: "Michael Torres",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Award-winning designer focused on creating intuitive and beautiful user interfaces."
    },
    {
      name: "Rachel Kim",
      role: "Head of Marketing",
      image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      bio: "Digital marketing specialist with a passion for growth strategies and customer engagement."
    }
  ];
  
  return (
    <SectionContainer className="bg-muted/30">
      <SectionHeading 
        title="Meet Our Team" 
        subtitle="The talented individuals behind WAKTI who are passionate about creating the best productivity tools."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-background rounded-lg border overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-square overflow-hidden">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-wakti-blue text-sm mb-2">{member.role}</p>
              <p className="text-muted-foreground text-sm">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default AboutTeam;
