
// Re-export all booking service functions
export { fetchBookings } from "./fetchService";
export { createBooking } from "./createService";
// Export the types from the types file
export type { Booking, BookingStatus } from "@/types/booking.types";
