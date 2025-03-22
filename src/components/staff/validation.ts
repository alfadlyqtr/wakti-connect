
import { z } from 'zod';

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

export const staffFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  position: z.string().min(2, { message: 'Position must be at least 2 characters' }),
  role: z.enum(['admin', 'co-admin', 'staff'], { 
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  permissions: z.record(z.boolean()).optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  isCoAdmin: z.boolean().default(false),
  isServiceProvider: z.boolean().default(false),
  avatar: z.any().optional()
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
