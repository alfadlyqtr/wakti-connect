
import { z } from 'zod';

export const staffFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  position: z.string().min(2, { message: 'Position must be at least 2 characters' }),
  role: z.enum(['admin', 'co-admin', 'staff'], { 
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  permissions: z.record(z.boolean()).optional()
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
