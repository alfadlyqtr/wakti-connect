
// This is a new file to replace the existing one
// It contains section templates for the different section types
// The 'hours' templates have been removed

import { SectionType } from "@/types/business.types";

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  content: any;
  previewImageUrl?: string;
}

const headerTemplates: SectionTemplate[] = [
  {
    id: "header-default",
    name: "Default Header",
    description: "A simple header with title and subtitle",
    content: {
      title: "Welcome to Our Business",
      subtitle: "Providing quality services since 2020",
      alignment: "center"
    }
  },
  {
    id: "header-with-cta",
    name: "Header with CTA",
    description: "Header with call-to-action button",
    content: {
      title: "Welcome to Our Business",
      subtitle: "Providing quality services since 2020",
      buttonText: "Contact Us",
      buttonUrl: "#contact",
      alignment: "center"
    }
  }
];

const aboutTemplates: SectionTemplate[] = [
  {
    id: "about-default",
    name: "Default About",
    description: "Simple about section with text",
    content: {
      title: "About Us",
      description: "We are a team of professionals dedicated to providing the best service to our customers.",
      showContactForm: false
    }
  },
  {
    id: "about-with-contact",
    name: "About with Contact Form",
    description: "About section with integrated contact form",
    content: {
      title: "About Us",
      description: "We are a team of professionals dedicated to providing the best service to our customers.",
      showContactForm: true,
      contactTitle: "Get in Touch"
    }
  }
];

const contactTemplates: SectionTemplate[] = [
  {
    id: "contact-default",
    name: "Default Contact",
    description: "Simple contact form",
    content: {
      title: "Contact Us",
      description: "Fill out the form below and we'll get back to you as soon as possible.",
      showMap: false
    }
  },
  {
    id: "contact-with-map",
    name: "Contact with Map",
    description: "Contact form with Google Maps integration",
    content: {
      title: "Contact Us",
      description: "Fill out the form below and we'll get back to you as soon as possible.",
      showMap: true,
      address: "123 Business St, City, Country",
      coordinates: '{"lat": 40.7128, "lng": -74.0060}'
    }
  }
];

const galleryTemplates: SectionTemplate[] = [
  {
    id: "gallery-default",
    name: "Default Gallery",
    description: "Simple photo gallery",
    content: {
      title: "Our Gallery",
      description: "Check out some of our work",
      layout: "grid",
      images: []
    }
  },
  {
    id: "gallery-masonry",
    name: "Masonry Gallery",
    description: "Gallery with masonry layout",
    content: {
      title: "Our Work",
      description: "A showcase of our best projects",
      layout: "masonry",
      images: []
    }
  }
];

const testimonialsTemplates: SectionTemplate[] = [
  {
    id: "testimonials-default",
    name: "Default Testimonials",
    description: "Simple testimonials carousel",
    content: {
      title: "What Our Clients Say",
      description: "Hear from our satisfied customers",
      layout: "carousel",
      testimonials: [
        {
          id: "1",
          name: "John Doe",
          position: "CEO",
          content: "Working with this team has been amazing. They exceeded our expectations."
        },
        {
          id: "2",
          name: "Jane Smith",
          position: "Marketing Director",
          content: "The quality of work is outstanding. Highly recommend!"
        }
      ]
    }
  },
  {
    id: "testimonials-grid",
    name: "Testimonials Grid",
    description: "Testimonials in a grid layout",
    content: {
      title: "Client Testimonials",
      description: "What people are saying about us",
      layout: "grid",
      testimonials: [
        {
          id: "1",
          name: "John Doe",
          position: "CEO",
          content: "Working with this team has been amazing. They exceeded our expectations."
        },
        {
          id: "2",
          name: "Jane Smith",
          position: "Marketing Director",
          content: "The quality of work is outstanding. Highly recommend!"
        }
      ]
    }
  }
];

const bookingTemplates: SectionTemplate[] = [
  {
    id: "booking-default",
    name: "Default Booking",
    description: "Simple booking section",
    content: {
      title: "Book an Appointment",
      description: "Choose a service and book your appointment online",
      layout: "list",
      buttonText: "Book Now"
    }
  },
  {
    id: "booking-featured",
    name: "Featured Services",
    description: "Booking with featured services",
    content: {
      title: "Our Services",
      description: "Select from our popular services below",
      layout: "grid",
      buttonText: "Schedule Now",
      showPrices: true,
      showDurations: true
    }
  }
];

const instagramTemplates: SectionTemplate[] = [
  {
    id: "instagram-default",
    name: "Default Instagram Feed",
    description: "Simple Instagram feed",
    content: {
      title: "Follow Us on Instagram",
      description: "Check out our latest posts",
      username: "yourusername",
      layout: "grid",
      postsCount: 6
    }
  },
  {
    id: "instagram-carousel",
    name: "Instagram Carousel",
    description: "Instagram feed as carousel",
    content: {
      title: "Instagram Feed",
      description: "Stay updated with our latest posts",
      username: "yourusername",
      layout: "carousel",
      postsCount: 10
    }
  }
];

const chatbotTemplates: SectionTemplate[] = [
  {
    id: "chatbot-default",
    name: "Default Chatbot",
    description: "Simple chatbot integration",
    content: {
      title: "Need Help?",
      description: "Our chatbot is here to assist you",
      position: "right",
      buttonText: "Chat Now"
    }
  },
  {
    id: "chatbot-embedded",
    name: "Embedded Chatbot",
    description: "Chatbot embedded in the page",
    content: {
      title: "Live Assistance",
      description: "Get instant answers to your questions",
      position: "embedded",
      buttonText: "Start Chat"
    }
  }
];

// Export templates as a record with SectionType keys
export const sectionTemplates: Record<SectionType, SectionTemplate[]> = {
  header: headerTemplates,
  about: aboutTemplates,
  contact: contactTemplates,
  gallery: galleryTemplates,
  testimonials: testimonialsTemplates,
  booking: bookingTemplates,
  instagram: instagramTemplates,
  chatbot: chatbotTemplates
};

export default sectionTemplates;
