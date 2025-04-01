
import { SectionType } from "@/types/business.types";

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  previewUrl: string;
  content: any;
}

// Define templates for each section type
const headerTemplates: SectionTemplate[] = [
  {
    id: 'header-standard',
    name: 'Standard Header',
    description: 'A clean, professional header with logo and title',
    category: 'Professional',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Business Name',
      subtitle: 'Professional services',
      alignment: 'center',
      logo_size: 'medium'
    }
  },
  {
    id: 'header-modern',
    name: 'Modern Header',
    description: 'A modern header with accent colors',
    category: 'Modern',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Business Name',
      subtitle: 'Modern approach to business',
      alignment: 'left',
      logo_size: 'large'
    }
  }
];

const aboutTemplates: SectionTemplate[] = [
  {
    id: 'about-simple',
    name: 'Simple About',
    description: 'A brief, clean about section',
    category: 'Essential',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'About Us',
      description: 'We are a dedicated team committed to providing the best service to our clients.',
      layout: 'text-only'
    }
  },
  {
    id: 'about-with-image',
    name: 'About with Image',
    description: 'About section with an image',
    category: 'Enhanced',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'About Our Business',
      description: 'Learn more about who we are and our mission to serve you better.',
      image_url: '/placeholder.svg',
      layout: 'image-left'
    }
  }
];

const contactTemplates: SectionTemplate[] = [
  {
    id: 'contact-basic',
    name: 'Basic Contact',
    description: 'Simple contact form with essential fields',
    category: 'Essential',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      show_email: true,
      show_phone: true,
      form_fields: ['name', 'email', 'message']
    }
  },
  {
    id: 'contact-detailed',
    name: 'Detailed Contact',
    description: 'Comprehensive contact form with additional fields',
    category: 'Enhanced',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Contact Our Team',
      subtitle: 'We\'d love to hear from you',
      show_email: true,
      show_phone: true,
      show_address: true,
      form_fields: ['name', 'email', 'phone', 'subject', 'message']
    }
  }
];

const galleryTemplates: SectionTemplate[] = [
  {
    id: 'gallery-grid',
    name: 'Grid Gallery',
    description: 'Display images in a clean grid layout',
    category: 'Basic',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Our Gallery',
      layout: 'grid',
      columns: 3,
      items: [
        { image_url: '/placeholder.svg', caption: 'Image 1' },
        { image_url: '/placeholder.svg', caption: 'Image 2' },
        { image_url: '/placeholder.svg', caption: 'Image 3' }
      ]
    }
  },
  {
    id: 'gallery-masonry',
    name: 'Masonry Gallery',
    description: 'Dynamic masonry layout for varied image sizes',
    category: 'Advanced',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Photo Gallery',
      layout: 'masonry',
      items: [
        { image_url: '/placeholder.svg', caption: 'Image 1', size: 'medium' },
        { image_url: '/placeholder.svg', caption: 'Image 2', size: 'large' },
        { image_url: '/placeholder.svg', caption: 'Image 3', size: 'small' }
      ]
    }
  }
];

const hoursTemplates: SectionTemplate[] = [
  {
    id: 'hours-standard',
    name: 'Standard Hours',
    description: 'Clear display of business hours',
    category: 'Basic',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Business Hours',
      days: [
        { day: 'Monday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Tuesday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Wednesday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Thursday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Friday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Saturday', open: 'Closed', close: 'Closed' },
        { day: 'Sunday', open: 'Closed', close: 'Closed' }
      ]
    }
  },
  {
    id: 'hours-with-notes',
    name: 'Hours with Notes',
    description: 'Business hours with additional notes or special hours',
    category: 'Enhanced',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'When We\'re Open',
      show_notes: true,
      notes: 'Closed on public holidays',
      days: [
        { day: 'Monday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Tuesday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Wednesday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Thursday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Friday', open: '9:00 AM', close: '5:00 PM' },
        { day: 'Saturday', open: '10:00 AM', close: '2:00 PM' },
        { day: 'Sunday', open: 'Closed', close: 'Closed' }
      ]
    }
  }
];

const testimonialsTemplates: SectionTemplate[] = [
  {
    id: 'testimonials-simple',
    name: 'Simple Testimonials',
    description: 'Clean testimonials display',
    category: 'Basic',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'What Our Clients Say',
      layout: 'list',
      items: [
        { 
          name: 'John Doe', 
          role: 'Client', 
          text: 'Excellent service, highly recommended!',
          rating: 5
        },
        { 
          name: 'Jane Smith', 
          role: 'Customer', 
          text: 'Very professional and efficient.',
          rating: 4
        }
      ]
    }
  },
  {
    id: 'testimonials-cards',
    name: 'Testimonial Cards',
    description: 'Testimonials displayed as cards with images',
    category: 'Enhanced',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Client Testimonials',
      layout: 'cards',
      show_images: true,
      items: [
        { 
          name: 'John Doe', 
          role: 'Client', 
          text: 'Working with this team was a pleasure from start to finish.',
          image_url: '/placeholder.svg',
          rating: 5
        },
        { 
          name: 'Jane Smith', 
          role: 'Customer', 
          text: 'Exceeded my expectations in every way.',
          image_url: '/placeholder.svg',
          rating: 5
        }
      ]
    }
  }
];

const bookingTemplates: SectionTemplate[] = [
  {
    id: 'booking-simple',
    name: 'Simple Booking',
    description: 'Basic booking section',
    category: 'Basic',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Book Now',
      subtitle: 'Schedule your appointment',
      show_calendar: true,
      button_text: 'Check Availability'
    }
  },
  {
    id: 'booking-detailed',
    name: 'Detailed Booking',
    description: 'Comprehensive booking section with service selection',
    category: 'Advanced',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Book Your Appointment',
      subtitle: 'Choose a service and time that works for you',
      show_calendar: true,
      show_services: true,
      button_text: 'Book Now'
    }
  }
];

const instagramTemplates: SectionTemplate[] = [
  {
    id: 'instagram-feed',
    name: 'Instagram Feed',
    description: 'Display your Instagram feed',
    category: 'Social',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Follow Us on Instagram',
      username: '@yourbusiness',
      post_count: 6,
      layout: 'grid'
    }
  },
  {
    id: 'instagram-carousel',
    name: 'Instagram Carousel',
    description: 'Carousel of Instagram posts',
    category: 'Social',
    previewUrl: '/placeholder.svg',
    content: {
      title: 'Instagram Highlights',
      username: '@yourbusiness',
      post_count: 8,
      layout: 'carousel'
    }
  }
];

// Map section types to their templates
const templateMap: Record<SectionType, SectionTemplate[]> = {
  header: headerTemplates,
  about: aboutTemplates,
  contact: contactTemplates,
  gallery: galleryTemplates,
  hours: hoursTemplates,
  testimonials: testimonialsTemplates,
  booking: bookingTemplates,
  instagram: instagramTemplates
};

// Function to get templates for a specific section type
export const getTemplates = (sectionType: SectionType): SectionTemplate[] => {
  return templateMap[sectionType] || [];
};

export default {
  getTemplates
};
