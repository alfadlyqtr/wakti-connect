
import { SectionType } from "@/types/business.types";

// Template interface
export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  content: Record<string, any>;
  category?: string;
  previewUrl?: string;
}

// Get section templates based on section type
export const getTemplates = (sectionType: SectionType): SectionTemplate[] => {
  switch (sectionType) {
    case 'header':
      return [
        {
          id: 'simple-header',
          name: 'Simple Header',
          description: 'A clean, minimal header with title and subtitle',
          category: 'Basic',
          content: {
            title: 'Business Name',
            subtitle: 'Your tagline here',
            showButton: true,
            buttonText: 'Book Now',
            background_color: '#ffffff',
            text_color: '#1f2937'
          }
        },
        {
          id: 'detailed-header',
          name: 'Detailed Header',
          description: 'Header with title, subtitle and description',
          category: 'Basic',
          content: {
            title: 'Business Name',
            subtitle: 'Professional Services',
            description: 'We provide top-quality services to meet all your needs.',
            showButton: true,
            buttonText: 'Get Started',
            background_color: '#f8fafc',
            text_color: '#1f2937'
          }
        },
        {
          id: 'bold-header',
          name: 'Bold Header',
          description: 'High contrast header with strong colors',
          category: 'Creative',
          content: {
            title: 'Bold Business',
            subtitle: 'Stand Out From The Crowd',
            description: 'Make a statement with our professional services.',
            showButton: true,
            buttonText: 'Explore Services',
            background_color: '#18181b',
            text_color: '#ffffff'
          }
        }
      ];
      
    case 'about':
      return [
        {
          id: 'story',
          name: 'Our Story',
          description: 'Share your business journey',
          category: 'Basic',
          content: {
            title: 'Our Story',
            content: '<p>Founded in [year], our business has grown from a small idea to a trusted brand. We are committed to excellence in everything we do.</p>'
          }
        },
        {
          id: 'team',
          name: 'About Our Team',
          description: 'Introduce your team members',
          category: 'Basic',
          content: {
            title: 'Meet Our Team',
            content: '<p>Our experienced team is dedicated to providing excellent service. With years of industry experience, we bring expertise and passion to every project.</p>'
          }
        }
      ];
      
    case 'contact':
      return [
        {
          id: 'basic',
          name: 'Basic Contact',
          description: 'Simple contact information',
          category: 'Basic',
          content: {
            title: 'Contact Us',
            description: 'We would love to hear from you!',
            email: 'contact@example.com',
            phone: '+1 (123) 456-7890',
            enableContactForm: true,
            contactFormTitle: 'Send us a message',
            contactButtonLabel: 'Send Message',
            contactButtonColor: '#3B82F6'
          }
        },
        {
          id: 'full',
          name: 'Full Contact Details',
          description: 'Complete contact information with address',
          category: 'Basic',
          content: {
            title: 'Get In Touch',
            description: 'We\'re here to answer any questions you might have.',
            email: 'contact@example.com',
            phone: '+1 (123) 456-7890',
            address: '123 Business Street, City, Country',
            enableContactForm: true,
            contactFormTitle: 'Send us a message',
            contactButtonLabel: 'Send Message',
            contactButtonColor: '#3B82F6',
            contactSuccessMessage: 'Thank you for your message. We\'ll get back to you soon!'
          }
        }
      ];
      
    case 'hours':
      return [
        {
          id: 'standard',
          name: 'Standard Hours',
          description: 'Monday-Friday business hours',
          category: 'Basic',
          content: {
            title: 'Business Hours',
            hours: {
              monday: { open: "09:00", close: "17:00", closed: false },
              tuesday: { open: "09:00", close: "17:00", closed: false },
              wednesday: { open: "09:00", close: "17:00", closed: false },
              thursday: { open: "09:00", close: "17:00", closed: false },
              friday: { open: "09:00", close: "17:00", closed: false },
              saturday: { open: "10:00", close: "15:00", closed: false },
              sunday: { open: "10:00", close: "15:00", closed: true }
            }
          }
        },
        {
          id: 'extended',
          name: 'Extended Hours',
          description: 'Extended evening and weekend hours',
          category: 'Basic',
          content: {
            title: 'Our Working Hours',
            hours: {
              monday: { open: "08:00", close: "20:00", closed: false },
              tuesday: { open: "08:00", close: "20:00", closed: false },
              wednesday: { open: "08:00", close: "20:00", closed: false },
              thursday: { open: "08:00", close: "20:00", closed: false },
              friday: { open: "08:00", close: "22:00", closed: false },
              saturday: { open: "09:00", close: "22:00", closed: false },
              sunday: { open: "10:00", close: "18:00", closed: false }
            }
          }
        }
      ];
      
    case 'gallery':
      return [
        {
          id: 'basic-gallery',
          name: 'Simple Gallery',
          description: 'A basic gallery layout',
          category: 'Basic',
          content: {
            title: 'Our Gallery',
            description: 'Check out our work',
            images: []
          }
        },
        {
          id: 'portfolio',
          name: 'Portfolio Gallery',
          description: 'Gallery with image captions',
          category: 'Basic',
          content: {
            title: 'Portfolio',
            description: 'Showcasing our best work',
            showCaptions: true,
            images: []
          }
        }
      ];
      
    case 'testimonials':
      return [
        {
          id: 'basic-testimonials',
          name: 'Simple Testimonials',
          description: 'Basic testimonials layout',
          category: 'Basic',
          content: {
            title: 'Customer Testimonials',
            description: 'What our clients say about us',
            testimonials: [
              {
                name: 'John Smith',
                position: 'Customer',
                text: 'Great service and excellent quality work!',
                rating: 5
              },
              {
                name: 'Jane Doe',
                position: 'Client',
                text: 'Very professional and timely service.',
                rating: 5
              }
            ]
          }
        },
        {
          id: 'detailed-testimonials',
          name: 'Detailed Testimonials',
          description: 'Testimonials with avatar and ratings',
          category: 'Creative',
          content: {
            title: 'What Our Clients Say',
            description: 'Real feedback from real customers',
            showAvatars: true,
            showRatings: true,
            testimonials: [
              {
                name: 'John Smith',
                position: 'Customer',
                text: 'Great service and excellent quality work!',
                rating: 5
              },
              {
                name: 'Jane Doe',
                position: 'Client',
                text: 'Very professional and timely service.',
                rating: 5
              },
              {
                name: 'Michael Johnson',
                position: 'Customer',
                text: 'Exceeded my expectations. Will definitely use again!',
                rating: 5
              }
            ]
          }
        }
      ];
      
    case 'booking':
      return [
        {
          id: 'basic-booking',
          name: 'Simple Booking Section',
          description: 'Basic booking section',
          category: 'Basic',
          content: {
            title: 'Book Our Services',
            description: 'Select from our available services',
            buttonText: 'Book Now'
          }
        },
        {
          id: 'featured-booking',
          name: 'Featured Bookings',
          description: 'Highlight specific services',
          category: 'Basic',
          content: {
            title: 'Book Our Popular Services',
            description: 'Choose from our most requested services',
            showFeaturedOnly: true,
            buttonText: 'Book Appointment'
          }
        }
      ];
      
    case 'instagram':
      return [
        {
          id: 'basic-instagram',
          name: 'Instagram Feed',
          description: 'Basic Instagram feed',
          category: 'Basic',
          content: {
            title: 'Follow Us on Instagram',
            description: 'Check out our latest posts',
            username: 'yourusername',
            postsCount: 6
          }
        },
        {
          id: 'featured-instagram',
          name: 'Featured Instagram Posts',
          description: 'Show highlighted Instagram posts',
          category: 'Basic',
          content: {
            title: 'Our Instagram Highlights',
            description: 'Our most popular content on Instagram',
            username: 'yourusername',
            postsCount: 9,
            showCaptions: true
          }
        }
      ];
      
    default:
      return [];
  }
};
