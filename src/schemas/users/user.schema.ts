import { z } from 'zod';

// sing up
export const signUpSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email format'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
  }),
});

// login user
export const loginSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
  }),
});

// Update user
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z
      .string()
      .min(4, 'Password must be at least 4 characters')
      .optional(),
  }),
});

// show one user
export const showOneUserSchema = z.object({
  params: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});
