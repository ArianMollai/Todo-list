import { Request, Response } from "express";
import {
  serNewCourse,
  serUpdateCourse,
  serDeleteCourse,
  serShowCourses,
  serShowOneCourse,
} from "../../services/courses/courses_service";
import { ICourse } from "../../config/env";

// creating course
export const createCourse = async (req: Request, res: Response) => {
  try {
    return await serNewCourse(req, res);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// updating course
export const updateCourse = async (req: Request, res: Response) => {
  const { name } = req.params as { name: string };
  const info = req.body;
  try {
    const course: ICourse | Response = await serUpdateCourse(req, res);
    res.json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// deleting course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    return await serDeleteCourse(req, res);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// show courses
export const showCourses = async (req: Request, res: Response) => {
  try {
    return await serShowCourses(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show one course
export const showOneCourse = async (req: Request, res: Response) => {
  try {
    return await serShowOneCourse(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
