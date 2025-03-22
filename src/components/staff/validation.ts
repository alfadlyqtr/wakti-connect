
export const validateStaffFields = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Invalid email address';
  }
  
  return errors;
};
