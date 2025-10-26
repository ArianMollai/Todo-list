import { Request, Response } from "express";
import {
  repNewCourse,
  repUpdateCourse,
  repDeleteCourse,
  repShowCourses,
  repShowOneCourse,
} from "../../repositories/courses/course_repository";

export const serNewCourse = async (req: Request, res: Response) => {
  return await repNewCourse(req, res);
};

export const serUpdateCourse = async (req: Request, res: Response) => {
  return await repUpdateCourse(req, res);
};

export const serDeleteCourse = async (req: Request, res: Response) => {
  return await repDeleteCourse(req, res);
};

export const serShowCourses = async (req: Request, res: Response) => {
  return await repShowCourses(req, res);
};

export const serShowOneCourse = async (req: Request, res: Response) => {
  return await repShowOneCourse(req, res);
};
