
import { Appointment, AppointmentStatus } from "@/services/appointment/types";

// Create a mock appointment for testing
export const createMockAppointment = (overrides?: Partial<Appointment>): Appointment => {
  return {
    id: "appt-123",
    user_id: "user-123",
    title: "Test Appointment",
    description: "Test Description",
    location: "Test Location",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    is_all_day: false,
    status: "scheduled" as AppointmentStatus,
    assignee_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

// Mock localStorage for testing
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
    removeItem: jest.fn(() => null),
    clear: jest.fn(() => null),
  },
  writable: true
});

// Mock the Supabase client
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn()
    }
  }
}));

// Initialize validateAppointmentStatus mock
jest.mock("../utils/statusValidator", () => ({
  validateAppointmentStatus: jest.fn((status) => status)
}));

// Initialize mapToAppointment mock
jest.mock("../utils/mappers", () => ({
  mapToAppointment: jest.fn((appt) => appt)
}));
