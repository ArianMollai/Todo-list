import { Request, Response } from "express";
import { IUser, ICourse } from "../config/env";
import "dotenv/config";
import {
  serUpdateUser,
  serDeleteUser,
  serRegisterCourse,
  serUpdateCourse,
  serDeleteCourse,
  serShowDB,
  serLogin,
  serNewAccesstoken,
} from "../services/service";
import { serSignUp } from "../services/service";

// sign up
export const signUp = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    return await serSignUp(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// login user
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await serLogin(req, res);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    return await serUpdateUser(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    return await serDeleteUser(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// register course
export const registerCourse = async (req: Request, res: Response) => {
  try {
    return await serRegisterCourse(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// update course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    return await serUpdateCourse(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const deletedCourse = await serDeleteCourse(req, res);
    return res.status(200).json({ message: "Course deleted succussfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show database
export const showDB = async (req: Request, res: Response) => {
  try {
    return await serShowDB(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// new accesstoken
export const newAccessToken = async (req: Request, res: Response) => {
  try {
    return await serNewAccesstoken(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// logout user
/*export const logoutUser = async (req: Request, res: Response) => {
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
    const courses: ICourse[] | Response = await serGetAllCourses(res);
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
    const course: ICourse | Response = await serGetOneCourse(name, res);
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
  const info: ICourse = req.body;
  const { name } = req.body as { name: string };
  try {
    const course: ICourse | Response = await serCreateCourse(info, name, res);
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
    const course: ICourse | Response = await serUpdateCourse(name, info, res);
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
 */
