
// Types for the help data
export interface FAQ {
  question: string;
  answer: string;
  forAccountTypes: Array<'all' | 'free' | 'individual' | 'business'>;
}

export interface Guide {
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  url: string;
  forAccountTypes: Array<'all' | 'free' | 'individual' | 'business'>;
}

// FAQ data
export const helpFaqsData: FAQ[] = [
  {
    question: "What is WAKTI?",
    answer: "WAKTI is an all-in-one productivity and business management platform that includes task management, appointment booking, messaging, and business management tools. It's designed to help individuals and businesses organize their work and manage their operations efficiently.",
    forAccountTypes: ['all']
  },
  {
    question: "How do I create a task?",
    answer: "To create a task, navigate to the Tasks page from the sidebar, then click on the 'Add Task' button. Fill in the task details such as title, description, due date, and priority, then click 'Save'.",
    forAccountTypes: ['all']
  },
  {
    question: "Can I share tasks with other users?",
    answer: "Yes, you can share tasks with other WAKTI users. When creating or editing a task, use the 'Share with' option to select users from your contacts. They will receive a notification and can view and update the shared task.",
    forAccountTypes: ['all']
  },
  {
    question: "How do I set up recurring tasks?",
    answer: "To set up a recurring task, create a new task or edit an existing one, then enable the 'Recurring' option. You can set the frequency (daily, weekly, monthly), specify the recurrence pattern, and set an end date if needed.",
    forAccountTypes: ['individual', 'business']
  },
  {
    question: "What's the difference between Individual and Business plans?",
    answer: "The Individual plan offers unlimited tasks, appointments, and messaging with other users. The Business plan includes all Individual features plus a customizable business page, booking system, staff management, and advanced analytics.",
    forAccountTypes: ['all']
  },
  {
    question: "How do I upgrade my account?",
    answer: "To upgrade your account, go to the 'Upgrade' page from the sidebar or click on the upgrade banner at the bottom of the sidebar. Choose the plan that fits your needs and follow the payment steps to complete your subscription.",
    forAccountTypes: ['free']
  },
  {
    question: "How do I create a business page?",
    answer: "To create a business page, navigate to the 'Business Page' section from the sidebar. Click 'Create Business Page' and fill in your business details, customize your page appearance, and add services. Once you're satisfied with your page, you can publish it.",
    forAccountTypes: ['business']
  },
  {
    question: "How do I manage my staff?",
    answer: "As a business account owner, you can manage your staff by going to the 'Staff' section from the sidebar. Here you can add new staff members, assign roles and permissions, and link them to specific services that they can provide.",
    forAccountTypes: ['business']
  },
  {
    question: "How do I set up services for booking?",
    answer: "To set up services for booking, go to the 'Services' section from the sidebar. Click 'Add Service' to create a new service, fill in details like name, description, duration, and price. You can then assign staff members who can provide this service.",
    forAccountTypes: ['business']
  },
  {
    question: "Can I export my data from WAKTI?",
    answer: "Yes, you can export your data from WAKTI. Go to the 'Settings' page and look for the 'Export Data' option. You can choose what data to export (tasks, appointments, contacts, etc.) and the format (CSV, JSON).",
    forAccountTypes: ['all']
  },
  {
    question: "How do I create an event or appointment?",
    answer: "To create an event or appointment, go to the 'Events' section from the sidebar and click 'New Event'. Fill in the event details, set the date and time, add a location if needed, and save. You can also share the event with other users or make it publicly bookable.",
    forAccountTypes: ['all']
  },
  {
    question: "How secure is my data on WAKTI?",
    answer: "WAKTI takes data security seriously. We use industry-standard encryption for data transmission and storage, implement strict access controls, and regularly audit our security measures. Your data is only accessible to you and those you explicitly share it with.",
    forAccountTypes: ['all']
  }
];

// Guides data
export const helpGuidesData: Guide[] = [
  {
    title: "Getting Started with WAKTI",
    description: "Learn the basics of using WAKTI for productivity and task management",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/videos/getting-started",
    url: "https://docs.wakti.app/getting-started",
    forAccountTypes: ['all']
  },
  {
    title: "Task Management Mastery",
    description: "Advanced techniques for organizing and managing your tasks effectively",
    thumbnailUrl: "/placeholder.svg",
    url: "https://docs.wakti.app/task-management",
    forAccountTypes: ['all']
  },
  {
    title: "Creating and Managing Events",
    description: "How to create, customize and share calendar events",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/videos/events",
    url: "https://docs.wakti.app/events",
    forAccountTypes: ['all']
  },
  {
    title: "Setting Up Your Business Page",
    description: "Step-by-step guide to creating an attractive business page",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/videos/business-page",
    url: "https://docs.wakti.app/business-page",
    forAccountTypes: ['business']
  },
  {
    title: "Managing Your Team",
    description: "Best practices for adding and managing staff members",
    thumbnailUrl: "/placeholder.svg",
    url: "https://docs.wakti.app/team-management",
    forAccountTypes: ['business']
  },
  {
    title: "Setting Up Services",
    description: "How to create and configure bookable services for your business",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/videos/services",
    url: "https://docs.wakti.app/services",
    forAccountTypes: ['business']
  },
  {
    title: "Using Analytics & Reports",
    description: "Understanding and leveraging business performance data",
    thumbnailUrl: "/placeholder.svg",
    url: "https://docs.wakti.app/analytics",
    forAccountTypes: ['business']
  },
  {
    title: "Mobile Features & Tips",
    description: "Get the most out of WAKTI on your mobile device",
    thumbnailUrl: "/placeholder.svg",
    videoUrl: "https://example.com/videos/mobile",
    url: "https://docs.wakti.app/mobile",
    forAccountTypes: ['all']
  },
  {
    title: "Integrating with Other Tools",
    description: "Connect WAKTI with your favorite apps and services",
    thumbnailUrl: "/placeholder.svg",
    url: "https://docs.wakti.app/integrations",
    forAccountTypes: ['individual', 'business']
  }
];
