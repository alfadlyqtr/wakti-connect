
// Re-export all appointment service functions
export { fetchAppointments } from "./fetchService";
export { createAppointment } from "./createService";
export { respondToInvitation } from "./invitationService";
export { createNewAppointment } from "./baseService";
export type { Appointment, AppointmentTab, AppointmentFormData, AppointmentsResult, AppointmentStatus } from "./types";
