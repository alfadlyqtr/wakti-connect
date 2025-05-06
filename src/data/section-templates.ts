
import { SectionType } from "@/types/business.types";

// Define the structure of a section template
export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl?: string;
  content: any;
  category?: string;
}

// Generate a unique ID for templates
const generateId = () => `template_${Math.random().toString(36).substr(2, 9)}`;

// Header section templates
const headerTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Header",
    description: "A simple header with title and subtitle",
    content: {
      title: "Welcome to Our Business",
      subtitle: "We provide quality services",
      description: "Learn more about what we offer and how we can help you.",
      buttonText: "Learn More",
      buttonLink: "#about"
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Call to Action Header",
    description: "Header with prominent CTA button",
    content: {
      title: "Transform Your Experience",
      subtitle: "Professional services tailored to your needs",
      description: "We're dedicated to delivering exceptional results for every client.",
      buttonText: "Get Started Today",
      buttonLink: "#contact"
    },
    category: "Business"
  },
  {
    id: generateId(),
    name: "Minimal Header",
    description: "Clean and minimal header design",
    content: {
      title: "Simply Better",
      subtitle: "",
      description: "Less is more. Quality over quantity.",
      buttonText: "",
      buttonLink: ""
    },
    category: "Minimal"
  }
];

// About section templates
const aboutTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic About",
    description: "Simple about section with text",
    content: {
      title: "About Us",
      description: "Learn about our story and mission",
      content: "<p>We are a dedicated team of professionals committed to providing the best service possible. Our journey began with a simple idea: to create solutions that make a difference in people's lives.</p><p>With years of experience in the industry, we've built a reputation for excellence and reliability.</p>"
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "About with Image",
    description: "About section with image and text",
    content: {
      title: "Our Story",
      description: "The journey that made us who we are today",
      content: "<p>Founded in 2015, our company has grown from a small startup to a leading provider in the industry. We believe in innovation, quality, and customer satisfaction above all else.</p><p>Our team consists of experts who are passionate about their work and committed to excellence.</p>",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60"
    },
    category: "Media"
  },
  {
    id: generateId(),
    name: "Mission & Values",
    description: "Focus on company mission and core values",
    content: {
      title: "Mission & Values",
      description: "What drives us forward",
      content: "<h3>Our Mission</h3><p>To provide innovative solutions that empower our clients to achieve their goals.</p><h3>Our Values</h3><ul><li><strong>Integrity</strong> - We conduct business with honesty and transparency</li><li><strong>Excellence</strong> - We strive for the highest quality in everything we do</li><li><strong>Innovation</strong> - We embrace change and continuously seek improvement</li><li><strong>Teamwork</strong> - We believe in the power of collaboration</li></ul>"
    },
    category: "Business"
  }
];

// Contact section templates
const contactTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Contact",
    description: "Simple contact form with info",
    content: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you",
      description: "Fill out the form below and we'll get back to you as soon as possible.",
      email: "contact@example.com",
      phone: "(123) 456-7890",
      address: "123 Business Street, City, State, ZIP",
      hours: "Monday - Friday: 9am - 5pm\nWeekends: Closed"
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Business Contact",
    description: "Professional contact section with form",
    content: {
      title: "Get in Touch",
      subtitle: "Contact our team",
      description: "Have questions or ready to start working with us? Contact us today!",
      email: "info@yourbusiness.com",
      phone: "(555) 123-4567",
      address: "500 Corporate Avenue, Suite 100, Business City, 12345",
      hours: "Monday - Thursday: 8am - 6pm\nFriday: 8am - 5pm\nSaturday - Sunday: Closed"
    },
    category: "Business"
  },
  {
    id: generateId(),
    name: "Contact with Social Media",
    description: "Contact information with social media links",
    content: {
      title: "Connect With Us",
      subtitle: "Multiple ways to reach out",
      description: "Choose the most convenient way to contact us or follow us on social media.",
      email: "hello@companyname.com",
      phone: "(987) 654-3210",
      address: "789 Main Street, Downtown, City, 54321",
      hours: "Monday - Friday: 10am - 7pm\nSaturday: 11am - 5pm\nSunday: Closed",
      socialMedia: [
        { platform: "Instagram", url: "https://instagram.com/yourbusiness" },
        { platform: "Facebook", url: "https://facebook.com/yourbusiness" },
        { platform: "Twitter", url: "https://twitter.com/yourbusiness" }
      ]
    },
    category: "Social"
  }
];

// Gallery section templates
const galleryTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Gallery",
    description: "Simple image gallery",
    content: {
      title: "Our Gallery",
      images: [
        { url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&auto=format&fit=crop&q=60", alt: "Gallery image 1" },
        { url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&auto=format&fit=crop&q=60", alt: "Gallery image 2" },
        { url: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&auto=format&fit=crop&q=60", alt: "Gallery image 3" },
        { url: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=800&auto=format&fit=crop&q=60", alt: "Gallery image 4" },
        { url: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800&auto=format&fit=crop&q=60", alt: "Gallery image 5" },
        { url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=60", alt: "Gallery image 6" }
      ]
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Portfolio Gallery",
    description: "Professional portfolio layout",
    content: {
      title: "Our Portfolio",
      images: [
        { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60", alt: "Portfolio project 1" },
        { url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60", alt: "Portfolio project 2" },
        { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60", alt: "Portfolio project 3" },
        { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60", alt: "Portfolio project 4" },
        { url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60", alt: "Portfolio project 5" },
        { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60", alt: "Portfolio project 6" }
      ]
    },
    category: "Business"
  }
];

// Hours section templates
const hoursTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Hours",
    description: "Simple business hours display",
    content: {
      title: "Business Hours",
      hours: [
        { day: "Monday", hours: "9:00 AM - 5:00 PM" },
        { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
        { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
        { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
        { day: "Friday", hours: "9:00 AM - 5:00 PM" },
        { day: "Saturday", hours: "10:00 AM - 3:00 PM" },
        { day: "Sunday", hours: "Closed" }
      ]
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Hours with Note",
    description: "Business hours with special note",
    content: {
      title: "When We're Open",
      hours: [
        { day: "Monday", hours: "8:00 AM - 6:00 PM" },
        { day: "Tuesday", hours: "8:00 AM - 6:00 PM" },
        { day: "Wednesday", hours: "8:00 AM - 6:00 PM" },
        { day: "Thursday", hours: "8:00 AM - 8:00 PM" },
        { day: "Friday", hours: "8:00 AM - 8:00 PM" },
        { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
        { day: "Sunday", hours: "Closed" }
      ],
      note: "Extended hours available by appointment. Holiday hours may vary."
    },
    category: "Business"
  }
];

// Testimonials section templates
const testimonialsTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Testimonials",
    description: "Simple testimonials display",
    content: {
      title: "What Our Clients Say",
      testimonials: [
        {
          text: "Working with this company was an amazing experience. They delivered everything on time and exceeded our expectations.",
          name: "John Smith",
          title: "CEO, Example Corp"
        },
        {
          text: "The team was professional and responsive. I would highly recommend their services to anyone.",
          name: "Sarah Johnson",
          title: "Marketing Director"
        },
        {
          text: "Outstanding service and attention to detail. Will definitely use their services again.",
          name: "Michael Brown",
          title: "Small Business Owner"
        }
      ]
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Featured Testimonials",
    description: "Highlighted client testimonials",
    content: {
      title: "Client Success Stories",
      testimonials: [
        {
          text: "This team transformed our business processes and helped us increase revenue by 30% within the first year.",
          name: "Robert Chen",
          title: "CFO, Enterprise Solutions"
        },
        {
          text: "The attention to detail and personalized approach made all the difference. Truly a game-changer for our company.",
          name: "Emily Rodriguez",
          title: "Operations Manager"
        },
        {
          text: "We've worked with many service providers over the years, but none have delivered results like this team. Exceptional work!",
          name: "David Wilson",
          title: "Project Director, Global Initiatives"
        },
        {
          text: "From start to finish, the experience was seamless. They understood our needs and delivered beyond our expectations.",
          name: "Jessica Thompson",
          title: "Head of Innovation"
        }
      ]
    },
    category: "Business"
  }
];

// Booking section templates
const bookingTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Booking",
    description: "Simple booking section",
    content: {
      title: "Book an Appointment",
      description: "Schedule a time that works for you.",
      buttonText: "Book Now"
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Consultation Booking",
    description: "Booking section for consultations",
    content: {
      title: "Book a Consultation",
      description: "Schedule a free 30-minute consultation with one of our experts to discuss your needs.",
      buttonText: "Schedule Now",
      showAvailability: true
    },
    category: "Business"
  }
];

// Instagram section templates
const instagramTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Instagram Feed",
    description: "Simple Instagram feed display",
    content: {
      title: "Follow Us on Instagram",
      username: "yourbusinessname",
      postCount: 6
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Featured Instagram",
    description: "Instagram feed with call to action",
    content: {
      title: "See What We're Sharing",
      username: "businesshandle",
      postCount: 9,
      description: "Follow us for updates, behind-the-scenes content, and special offers!",
      buttonText: "Follow Us",
      buttonLink: "https://instagram.com/businesshandle"
    },
    category: "Social"
  }
];

// Chatbot section templates
const chatbotTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Chatbot",
    description: "Simple chatbot integration",
    content: {
      title: "Ask Us Anything",
      description: "Our virtual assistant is here to help 24/7.",
      chatbotType: "iframe"
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Support Chatbot",
    description: "Customer support chatbot",
    content: {
      title: "Need Help?",
      description: "Get instant answers to your questions with our support assistant.",
      chatbotType: "script",
      buttonText: "Start Chat"
    },
    category: "Support"
  }
];

// Links section templates
const linksTemplates: SectionTemplate[] = [
  {
    id: generateId(),
    name: "Basic Links",
    description: "Simple list of important links",
    content: {
      title: "Important Links",
      description: "Quick access to essential resources",
      links: [
        { title: "Our Services", url: "#services" },
        { title: "About Us", url: "#about" },
        { title: "Contact", url: "#contact" },
        { title: "FAQ", url: "#faq" }
      ]
    },
    category: "Simple"
  },
  {
    id: generateId(),
    name: "Resource Links",
    description: "Links to resources and documents",
    content: {
      title: "Resources & Downloads",
      description: "Access our helpful resources and documentation",
      links: [
        { title: "Service Catalog (PDF)", url: "#catalog" },
        { title: "Client Onboarding Guide", url: "#guide" },
        { title: "Terms of Service", url: "#terms" },
        { title: "Privacy Policy", url: "#privacy" },
        { title: "Support Center", url: "#support" }
      ]
    },
    category: "Business"
  },
  {
    id: generateId(),
    name: "Social Media Links",
    description: "Links to social media profiles",
    content: {
      title: "Connect With Us",
      description: "Follow us on social media",
      links: [
        { title: "Facebook", url: "https://facebook.com/example" },
        { title: "Instagram", url: "https://instagram.com/example" },
        { title: "Twitter", url: "https://twitter.com/example" },
        { title: "LinkedIn", url: "https://linkedin.com/company/example" },
        { title: "YouTube", url: "https://youtube.com/c/example" }
      ]
    },
    category: "Social"
  }
];

// Collated templates object
const templates: Record<SectionType, SectionTemplate[]> = {
  header: headerTemplates,
  about: aboutTemplates,
  contact: contactTemplates,
  gallery: galleryTemplates,
  hours: hoursTemplates,
  testimonials: testimonialsTemplates,
  booking: bookingTemplates,
  instagram: instagramTemplates,
  chatbot: chatbotTemplates,
  links: linksTemplates
};

// Helper function to get templates for a specific section type or all templates
export const getTemplates = (sectionType?: SectionType) => {
  if (sectionType) {
    return templates[sectionType] || [];
  }
  
  // Return all templates if no section type is specified
  return Object.values(templates).flat();
};

