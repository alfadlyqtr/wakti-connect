
// The appointment system has been deprecated
// This file is kept as a placeholder to prevent import errors

export const createAppointment = async () => {
  console.warn("The appointments system has been deprecated");
  return null;
};

export const fetchAppointments = async () => {
  console.warn("The appointments system has been deprecated");
  return { 
    appointments: [],
    userRole: "free"
  };
};
