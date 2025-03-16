
export interface Feature {
  name: string;
  included: boolean;
}

export interface PlanFeaturesData {
  free: Feature[];
  individual: Feature[];
  business: Feature[];
}

export const planFeatures: PlanFeaturesData = {
  free: [
    { name: "View-only access to tasks", included: true },
    { name: "View-only access to appointments", included: true },
    { name: "Limited notifications", included: true },
    { name: "Basic dashboard", included: true },
    { name: "Full task creation & management", included: false },
    { name: "Appointment scheduling", included: false },
    { name: "Messaging capabilities", included: false },
    { name: "Staff management", included: false },
  ],
  individual: [
    { name: "Full task management", included: true },
    { name: "Full appointment scheduling", included: true },
    { name: "Custom event creation & sharing", included: true },
    { name: "Messaging capabilities", included: true },
    { name: "Contact management", included: true },
    { name: "Full notifications", included: true },
    { name: "Priority support", included: true },
    { name: "Staff management", included: false },
    { name: "Business analytics", included: false },
  ],
  business: [
    { name: "Everything in Individual plan", included: true },
    { name: "Team task assignments", included: true },
    { name: "Business-wide appointments", included: true },
    { name: "Staff management", included: true },
    { name: "Work logs & tracking", included: true },
    { name: "Service management", included: true },
    { name: "Business analytics & reports", included: true },
    { name: "Premium support", included: true },
  ],
};
