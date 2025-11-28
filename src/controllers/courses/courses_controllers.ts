import { Request, Response, NextFunction } from 'express';
import {
  repNewCourse,
  repUpdateCourse,
  repDeleteCourse,
  repShowCourses,
  repShowOneCourse,
} from '../../repositories/courses/course_repository';
import { ICourse } from '../../types/course/types.course';

// creating course
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const course_name = req.body.name;
  const info = { ...req.query, name: course_name };
  try {
    const course: ICourse | null = await repNewCourse(
      (req as any).userId,
      info,
    );
    return res.status(200).json(course);
  } catch (error: any) {
    next(error);
  }
};

// updating course
export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.params as { name: string };
  const info = req.query;
  try {
    const course: ICourse | null = await repUpdateCourse(
      (req as any).userId,
      name,
      info as any,
    );
    return res.status(200).json(course);
  } catch (error: any) {
    next(error);
  }
};

// deleting course
export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.params;
  try {
    await repDeleteCourse((req as any).userId, name);
    return res.status(200).json({ message: 'Course deleted succussfully' });
  } catch (error: any) {
    next(error);
  }
};

// show courses
export const showCourses = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courses: ICourse[] | null = await repShowCourses();
    return res.status(200).json(courses);
  } catch (error: any) {
    next(error);
  }
};

// show one course
export const showOneCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.params;
  try {
    const course: ICourse[] | null = await repShowOneCourse(name);
    return res.status(200).json(course);
  } catch (error: any) {
    next(error);
  }
};
