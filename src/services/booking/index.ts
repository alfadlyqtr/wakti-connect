
import { fetchBookings } from "./fetchService";
import { createBooking as createBookingService } from "./createService";
import { BookingWithRelations, BookingFormData, BookingTab } from "@/types/booking.types";

export {
  fetchBookings,
  createBookingService as createBooking,
  // Re-export types
  type BookingWithRelations,
  type BookingFormData,
  type BookingTab
};
