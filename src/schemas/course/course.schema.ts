import { z } from 'zod';

// new course
export const newCourseSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Course name required'),
  }),
  query: z.object({
    duration: z.enum(['10H', '50H', '100H', '150H']),
    time: z.enum(['9:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']),
    status: z.enum(['not started', 'in progress', 'completed']),
  }),
});

// update course
export const updateCourseSchema = z.object({
  params: z.object({
    name: z.string().min(1),
  }),
  query: z.object({
    name: z.string().min(1),
    duration: z.enum(['10H', '50H', '100H', '150H']),
    time: z.enum(['9:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']),
    status: z.enum(['not started', 'in progress', 'completed']),
  }),
});

// delete course
export const deleteCourseSchema = z.object({
  params: z.object({
    name: z.string().min(1),
  }),
});

// show one course
export const showOneCourseSchema = z.object({
  params: z.object({
    name: z.string().min(1),
  }),
});
