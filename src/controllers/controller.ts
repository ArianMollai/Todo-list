import { Request, Response } from "express";
import { User, Course } from "../config/env";
import "dotenv/config";
import {
  serGetAllCourses,
  serGetOneCourse,
  serCreateCourse,
  serUpdateCourse,
  serDeleteCourse,
  serNewAccessToken,
  serLogin,
  serLogout,
} from "../services/service";
import { rmSync } from "fs";

// login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password }: { name: string; password: string } = req.body;
    const user = await serLogin(req, res, name, password);
    res.json(user);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

// logout user
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const user = await serLogout(req, res);
    res.json({ message: "user logged out" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// showimg all courses
export const showCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courses: Course[] | Response = await serGetAllCourses(res);
    res.json(courses);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

// show one course
export const showCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.params;
  try {
    const course: Course | Response = await serGetOneCourse(name, res);
    res.json(course);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

// creating course
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const info: Course = req.body;
  const { name } = req.body as { name: string };
  try {
    const course: Course | Response = await serCreateCourse(info, name, res);
    res.json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// updating course
export const updateCourse = async (req: Request, res: Response) => {
  const { name } = req.params as { name: string };
  const info = req.body;
  try {
    const course: Course | Response = await serUpdateCourse(name, info, res);
    res.json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// deleting course
export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.params as { name: string };
  try {
    const course = await serDeleteCourse(name, res);
    res.status(200).json({ message: "Deleted succussfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// new access token from refresh token
export const newAccessToken = async (req: Request, res: Response) => {
  try {
    const accessToken: string | Response = await serNewAccessToken(req, res);
    return res.json({ token: accessToken });
  } catch (error: any) {
    res.json({ message: error.message });
  }
};
