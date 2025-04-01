
import { BusinessPageSection } from "@/types/business.types";

// Define template interfaces
interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  section_type: string;
  thumbnail?: string;
  content: Record<string, any>;
}

// Header Section Templates
const headerTemplates: SectionTemplate[] = [
  {
    id: "header-standard",
    name: "Standard Header",
    description: "A clean, modern header with title and subtitle",
    section_type: "header",
    thumbnail: "/templates/header-standard.jpg",
    content: {
      title: "Welcome to Our Business",
      subtitle: "We provide quality products and services",
      description: "Learn more about what we can do for you",
      buttonText: "Contact Us",
      buttonLink: "#contact",
      alignment: "center",
      overlayOpacity: 80,
      textColor: "dark"
    }
  },
  {
    id: "header-background",
    name: "Image Background Header",
    description: "Header with a full-width background image",
    section_type: "header",
    thumbnail: "/templates/header-background.jpg",
    content: {
      title: "Welcome to Our Business",
      subtitle: "Premium Services for You",
      description: "Discover our range of professional services",
      buttonText: "Book Now",
      buttonLink: "#booking",
      alignment: "center",
      overlayOpacity: 60,
      textColor: "light",
      backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0"
    }
  }
];

// About Section Templates
const aboutTemplates: SectionTemplate[] = [
  {
    id: "about-standard",
    name: "Standard About",
    description: "Simple about section with text and image",
    section_type: "about",
    thumbnail: "/templates/about-standard.jpg",
    content: {
      title: "About Us",
      content: "<p>We are a dedicated team of professionals committed to providing the best services to our customers. Our years of experience in the industry allow us to deliver exceptional results.</p>",
      image: null,
      layout: "image-right"
    }
  },
  {
    id: "about-team",
    name: "Team About",
    description: "About section with team information",
    section_type: "about",
    thumbnail: "/templates/about-team.jpg",
    content: {
      title: "Our Story",
      content: "<p>Founded in 2020, our business has grown from a small local service to a recognized brand in the industry. We take pride in our work and the relationships we build with our clients.</p>",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      layout: "image-left"
    }
  }
];

// Contact Section Templates
const contactTemplates: SectionTemplate[] = [
  {
    id: "contact-standard",
    name: "Standard Contact",
    description: "Basic contact form with information",
    section_type: "contact",
    thumbnail: "/templates/contact-standard.jpg",
    content: {
      title: "Contact Us",
      subtitle: "We'd love to hear from you",
      address: "123 Business St, City, Country",
      phone: "+1 234 567 890",
      email: "contact@business.com",
      showForm: true,
      showMap: true
    }
  },
  {
    id: "contact-simple",
    name: "Simple Contact",
    description: "Contact information without form",
    section_type: "contact",
    thumbnail: "/templates/contact-simple.jpg",
    content: {
      title: "Get in Touch",
      subtitle: "Contact us today",
      address: "123 Business St, City, Country",
      phone: "+1 234 567 890",
      email: "contact@business.com",
      showForm: false,
      showMap: false
    }
  }
];

// Gallery Section Templates
const galleryTemplates: SectionTemplate[] = [
  {
    id: "gallery-grid",
    name: "Grid Gallery",
    description: "Gallery with grid layout",
    section_type: "gallery",
    thumbnail: "/templates/gallery-grid.jpg",
    content: {
      title: "Our Gallery",
      images: [],
      layout: "grid",
      columns: 3
    }
  },
  {
    id: "gallery-masonry",
    name: "Masonry Gallery",
    description: "Gallery with masonry layout",
    section_type: "gallery",
    thumbnail: "/templates/gallery-masonry.jpg",
    content: {
      title: "Photo Gallery",
      images: [],
      layout: "masonry",
      columns: 4
    }
  }
];

// Hours Section Templates
const hoursTemplates: SectionTemplate[] = [
  {
    id: "hours-standard",
    name: "Standard Hours",
    description: "Basic business hours display",
    section_type: "hours",
    thumbnail: "/templates/hours-standard.jpg",
    content: {
      title: "Business Hours",
      days: [
        { day: "Monday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Tuesday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Wednesday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Thursday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Friday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Saturday", hours: "10:00 AM - 2:00 PM", closed: false },
        { day: "Sunday", hours: "Closed", closed: true }
      ],
      notes: "Holiday hours may vary"
    }
  },
  {
    id: "hours-with-info",
    name: "Hours with Info",
    description: "Business hours with additional information",
    section_type: "hours",
    thumbnail: "/templates/hours-with-info.jpg",
    content: {
      title: "When We're Open",
      days: [
        { day: "Monday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Tuesday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Wednesday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Thursday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Friday", hours: "9:00 AM - 5:00 PM", closed: false },
        { day: "Saturday", hours: "Closed", closed: true },
        { day: "Sunday", hours: "Closed", closed: true }
      ],
      notes: "Walk-ins welcome during business hours. Appointments recommended for services over 1 hour."
    }
  }
];

// Testimonials Section Templates
const testimonialsTemplates: SectionTemplate[] = [
  {
    id: "testimonials-cards",
    name: "Testimonial Cards",
    description: "Testimonials in card format",
    section_type: "testimonials",
    thumbnail: "/templates/testimonials-cards.jpg",
    content: {
      title: "What Our Clients Say",
      testimonials: [
        { name: "John Doe", position: "CEO, Company A", text: "Great service! Would highly recommend.", avatar: null, rating: 5 },
        { name: "Jane Smith", position: "Manager, Company B", text: "Professional and timely service every time.", avatar: null, rating: 5 }
      ],
      style: "cards"
    }
  },
  {
    id: "testimonials-quotes",
    name: "Quote Testimonials",
    description: "Testimonials displayed as quotes",
    section_type: "testimonials",
    thumbnail: "/templates/testimonials-quotes.jpg",
    content: {
      title: "Client Testimonials",
      testimonials: [
        { name: "Alex Johnson", position: "Customer", text: "I've been a client for over a year now, and the service never disappoints.", avatar: null, rating: 5 },
        { name: "Sarah Thompson", position: "Regular Client", text: "The team is always friendly and delivers excellent results.", avatar: null, rating: 4 }
      ],
      style: "quotes"
    }
  }
];

// Booking Section Templates
const bookingTemplates: SectionTemplate[] = [
  {
    id: "booking-simple",
    name: "Simple Booking",
    description: "Basic booking section with service selection",
    section_type: "booking",
    thumbnail: "/templates/booking-simple.jpg",
    content: {
      title: "Book Your Appointment",
      subtitle: "Select from our available services",
      buttonText: "Book Now",
      displayMode: "list"
    }
  },
  {
    id: "booking-featured",
    name: "Featured Services Booking",
    description: "Booking with featured services highlighted",
    section_type: "booking",
    thumbnail: "/templates/booking-featured.jpg",
    content: {
      title: "Our Services",
      subtitle: "Book your appointment today",
      buttonText: "Schedule Now",
      displayMode: "cards"
    }
  }
];

// Instagram Section Templates
const instagramTemplates: SectionTemplate[] = [
  {
    id: "instagram-feed",
    name: "Instagram Feed",
    description: "Display your latest Instagram posts",
    section_type: "instagram",
    thumbnail: "/templates/instagram-feed.jpg",
    content: {
      title: "Follow Us on Instagram",
      username: "yourusername",
      postCount: 6,
      showCaption: true
    }
  },
  {
    id: "instagram-minimal",
    name: "Minimal Instagram",
    description: "Clean Instagram feed display",
    section_type: "instagram",
    thumbnail: "/templates/instagram-minimal.jpg",
    content: {
      title: "Instagram",
      username: "yourusername",
      postCount: 4,
      showCaption: false
    }
  }
];

// Export all templates by section type
export const sectionTemplates = {
  header: headerTemplates,
  about: aboutTemplates,
  contact: contactTemplates,
  gallery: galleryTemplates,
  hours: hoursTemplates,
  testimonials: testimonialsTemplates,
  booking: bookingTemplates,
  instagram: instagramTemplates
};

// Export a flat array of all templates
export const allSectionTemplates = [
  ...headerTemplates,
  ...aboutTemplates,
  ...contactTemplates,
  ...galleryTemplates,
  ...hoursTemplates,
  ...testimonialsTemplates,
  ...bookingTemplates,
  ...instagramTemplates
];

// Get templates by section type
export const getTemplatesByType = (type: string) => {
  return sectionTemplates[type as keyof typeof sectionTemplates] || [];
};

// Find template by ID
export const findTemplateById = (id: string) => {
  return allSectionTemplates.find(template => template.id === id);
};

export default sectionTemplates;
