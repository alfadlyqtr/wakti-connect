
import { SectionType } from "@/types/business.types";

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: Record<string, any>;
  previewUrl?: string;
}

// Default templates by section type
const headerTemplates: SectionTemplate[] = [
  {
    id: 'header-default',
    name: 'Default Header',
    description: 'A clean, modern header with title and subtitle',
    category: 'Simple',
    content: {
      title: 'Welcome to Our Business',
      subtitle: 'Quality Services You Can Trust',
      description: 'Book our professional services today and experience the difference.',
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'lg'
    }
  },
  {
    id: 'header-centered',
    name: 'Centered Header',
    description: 'A centered header with larger text',
    category: 'Simple',
    content: {
      title: 'Your Business Name',
      subtitle: 'Your Tagline Here',
      description: 'A brief description of your services',
      text_alignment: 'center',
      background_color: '#f3f4f6',
      text_color: '#111827',
      padding: 'xl'
    }
  },
  {
    id: 'header-gradient',
    name: 'Gradient Background',
    description: 'Header with a colorful gradient background',
    category: 'Stylish',
    content: {
      title: 'Modern Solutions',
      subtitle: 'For Your Business Needs',
      description: 'We provide innovative solutions for your business requirements',
      text_alignment: 'center',
      background_color: '#4f46e5',
      gradient: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
      text_color: '#ffffff',
      padding: 'xl'
    }
  }
];

const aboutTemplates: SectionTemplate[] = [
  {
    id: 'about-simple',
    name: 'Simple About',
    description: 'A clean, straightforward about section',
    category: 'Simple',
    content: {
      title: 'About Us',
      description: 'We are a dedicated team of professionals committed to providing excellence in our services.',
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'md'
    }
  },
  {
    id: 'about-with-image',
    name: 'About with Image',
    description: 'About section with image and text side by side',
    category: 'With Image',
    content: {
      title: 'Our Story',
      description: 'Learn about our journey and what makes us different from others in the industry.',
      image_url: 'https://placehold.co/600x400',
      image_position: 'left',
      background_color: '#f9fafb',
      text_color: '#111827',
      padding: 'lg'
    }
  }
];

const contactTemplates: SectionTemplate[] = [
  {
    id: 'contact-basic',
    name: 'Basic Contact Form',
    description: 'Simple contact form with essential fields',
    category: 'Forms',
    content: {
      title: 'Contact Us',
      show_name: true,
      show_email: true,
      show_phone: true,
      show_message: true,
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'md'
    }
  },
  {
    id: 'contact-with-info',
    name: 'Contact with Info',
    description: 'Contact form with business information',
    category: 'Forms',
    content: {
      title: 'Get In Touch',
      subtitle: 'Have questions? Reach out to us directly.',
      show_name: true,
      show_email: true,
      show_phone: true,
      show_message: true,
      business_phone: '+1 (555) 123-4567',
      business_email: 'contact@example.com',
      business_address: '123 Business St, City',
      background_color: '#f8fafc',
      text_color: '#0f172a',
      padding: 'lg'
    }
  }
];

const galleryTemplates: SectionTemplate[] = [
  {
    id: 'gallery-grid',
    name: 'Grid Gallery',
    description: 'A responsive grid of images',
    category: 'Galleries',
    content: {
      title: 'Our Gallery',
      layout: 'grid',
      images_per_row: 3,
      gap: 'md',
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'md'
    }
  },
  {
    id: 'gallery-masonry',
    name: 'Masonry Gallery',
    description: 'An elegant masonry layout for your images',
    category: 'Galleries',
    content: {
      title: 'Image Gallery',
      layout: 'masonry',
      images_per_row: 4,
      gap: 'sm',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      padding: 'lg'
    }
  }
];

const hoursTemplates: SectionTemplate[] = [
  {
    id: 'hours-simple',
    name: 'Simple Hours',
    description: 'Clean display of business hours',
    category: 'Business Info',
    content: {
      title: 'Business Hours',
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed',
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'md'
    }
  },
  {
    id: 'hours-with-note',
    name: 'Hours with Note',
    description: 'Business hours with additional information',
    category: 'Business Info',
    content: {
      title: 'When We\'re Open',
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed',
      note: 'Hours may vary on holidays. Please call ahead for special hours.',
      background_color: '#f8fafc',
      text_color: '#1f2937',
      padding: 'lg'
    }
  }
];

const testimonialsTemplates: SectionTemplate[] = [
  {
    id: 'testimonials-simple',
    name: 'Simple Testimonials',
    description: 'Clean, card-based testimonials',
    category: 'Social Proof',
    content: {
      title: 'What Our Clients Say',
      layout: 'grid',
      testimonials_per_row: 3,
      show_avatar: true,
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'md'
    }
  },
  {
    id: 'testimonials-carousel',
    name: 'Testimonials Carousel',
    description: 'Sliding carousel of testimonials',
    category: 'Social Proof',
    content: {
      title: 'Customer Reviews',
      layout: 'carousel',
      show_avatar: true,
      show_rating: true,
      background_color: '#f3f4f6',
      text_color: '#111827',
      padding: 'lg'
    }
  }
];

const bookingTemplates: SectionTemplate[] = [
  {
    id: 'booking-simple',
    name: 'Simple Booking',
    description: 'Clean, minimalist booking section',
    category: 'Booking',
    content: {
      title: 'Book an Appointment',
      subtitle: 'Schedule your visit today',
      show_calendar: true,
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'md'
    }
  },
  {
    id: 'booking-with-services',
    name: 'Booking with Services',
    description: 'Booking section with services selection',
    category: 'Booking',
    content: {
      title: 'Reserve Your Spot',
      subtitle: 'Choose from our popular services',
      show_calendar: true,
      show_services: true,
      background_color: '#f9fafb',
      text_color: '#111827',
      padding: 'lg'
    }
  }
];

const instagramTemplates: SectionTemplate[] = [
  {
    id: 'instagram-feed',
    name: 'Instagram Feed',
    description: 'Display your latest Instagram posts',
    category: 'Social Media',
    content: {
      title: 'Follow Us on Instagram',
      posts_count: 6,
      show_caption: true,
      background_color: '#ffffff',
      text_color: '#1f2937',
      padding: 'md'
    }
  },
  {
    id: 'instagram-carousel',
    name: 'Instagram Carousel',
    description: 'Sliding carousel of Instagram posts',
    category: 'Social Media',
    content: {
      title: 'Latest from Our Instagram',
      layout: 'carousel',
      posts_count: 8,
      show_caption: false,
      background_color: '#f3f4f6',
      text_color: '#111827',
      padding: 'lg'
    }
  }
];

// Map all templates by section type
const allTemplates: Record<SectionType, SectionTemplate[]> = {
  header: headerTemplates,
  about: aboutTemplates,
  contact: contactTemplates,
  gallery: galleryTemplates,
  hours: hoursTemplates,
  testimonials: testimonialsTemplates,
  booking: bookingTemplates,
  instagram: instagramTemplates
};

// Get templates by section type
export const getTemplates = (sectionType: SectionType): SectionTemplate[] => {
  return allTemplates[sectionType] || [];
};
