
import React from "react";
import { SectionContainer } from "@/components/ui/section-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Twitter } from "lucide-react";

const AboutTeam = () => {
  const teamMembers = [
    {
      name: "Ahmed Al-Thani",
      role: "Founder & CEO",
      bio: "Former tech executive with 15+ years experience in digital transformation and software development across the MENA region.",
      imagePath: "/placeholder.svg",
      initials: "AA"
    },
    {
      name: "Sara Al-Mahmoud",
      role: "Chief Product Officer",
      bio: "Product strategist with expertise in UX design and user research, passionate about creating intuitive productivity tools.",
      imagePath: "/placeholder.svg",
      initials: "SM"
    },
    {
      name: "Mohammed Hassan",
      role: "CTO",
      bio: "Full-stack developer and system architect with a background in building scalable SaaS platforms for regional enterprises.",
      imagePath: "/placeholder.svg",
      initials: "MH"
    },
    {
      name: "Fatima Al-Jasim",
      role: "Head of Customer Success",
      bio: "Customer experience specialist focused on ensuring WAKTI users get the most value from our platform through training and support.",
      imagePath: "/placeholder.svg",
      initials: "FJ"
    }
  ];

  return (
    <SectionContainer className="py-16 bg-muted/30">
      <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        The passionate people behind WAKTI who are dedicated to creating the best productivity platform for individuals and businesses.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-background p-6 rounded-lg border text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={member.imagePath} alt={member.name} />
              <AvatarFallback className="bg-wakti-blue text-white text-xl">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
            <p className="text-wakti-blue mb-3">{member.role}</p>
            <p className="text-muted-foreground text-sm mb-4">
              {member.bio}
            </p>
            
            <div className="flex justify-center space-x-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default AboutTeam;
