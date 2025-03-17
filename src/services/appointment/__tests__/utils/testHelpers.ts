
import { Appointment, UserProfile } from "../../types";

// Create a mock appointment for testing
export const createMockAppointment = (overrides?: Partial<Appointment>): Appointment => {
  const defaultUser: UserProfile = {
    id: "user-123",
    email: "test@example.com",
    display_name: "Test User"
  };
  
  return {
    id: "appt-123",
    user_id: "user-123",
    title: "Test Appointment",
    description: "Test Description",
    location: "Test Location",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    is_all_day: false,
    status: "scheduled",
    assignee_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: defaultUser,
    assignee: null,
    ...overrides
  };
};

// Mock the Supabase client
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            lt: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: jest.fn(() => ({
                  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
                  then: jest.fn().mockResolvedValue({ data: [], error: null })
                })),
                then: jest.fn().mockResolvedValue({ data: [], error: null })
              })),
              order: jest.fn(() => ({
                limit: jest.fn(() => ({
                  then: jest.fn().mockResolvedValue({ data: [], error: null })
                })),
                then: jest.fn().mockResolvedValue({ data: [], error: null })
              }))
            })),
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                then: jest.fn().mockResolvedValue({ data: [], error: null })
              })),
              then: jest.fn().mockResolvedValue({ data: [], error: null })
            }))
          })),
          lt: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn(() => ({
                then: jest.fn().mockResolvedValue({ data: [], error: null })
              })),
              then: jest.fn().mockResolvedValue({ data: [], error: null })
            }))
          })),
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              then: jest.fn().mockResolvedValue({ data: [], error: null })
            })),
            then: jest.fn().mockResolvedValue({ data: [], error: null })
          }))
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => ({
            then: jest.fn().mockResolvedValue({ data: [], error: null })
          })),
          then: jest.fn().mockResolvedValue({ data: [], error: null })
        }))
      })),
      rpc: jest.fn(() => ({
        then: jest.fn().mockResolvedValue({ data: "free", error: null })
      })),
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: "user-123" }
            }
          }
        })
      }
    })
  }
}));
