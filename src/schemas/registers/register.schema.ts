import { z } from 'zod';

// register new course
export const registerNewCourseSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

// cancel registration
export const cancelRegisterationSchema = z.object({
  params: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

// show one register
export const showOneRegistrationSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Name is required'),
    coursename: z.string().min(1, 'Name is required'),
  }),
});
