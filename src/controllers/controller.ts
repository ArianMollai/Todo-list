import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { User, Course } from "../config/env";
import "dotenv/config";
import { JwtPayload, verify } from "jsonwebtoken";
import userDB from "../userDB/userDB";
import {
  repLogin,
  repLogout,
  repCourses,
  repCourse,
  repCreate,
  repUpdate,
  repDelete,
} from "../repositories/repository";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
  isAuth,
} from "../utils/utils";

// login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password }: { name: string; password: string } = req.body;
    const user: User | undefined = await repLogin(req);
    //creating token
    const accessToken: string = createAccessToken(user.id);
    const refreshToken: string = createRefreshToken(user.id);
    user.refreshtoken = refreshToken;
    // sending tokens
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken, refreshToken);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

// logout user
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId: number | undefined = isAuth(req);
    const user = await repLogout(userId as number);
    res.clearCookie("refreshtoken");
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
    const userId: number | undefined = isAuth(req);
    const courses: Course[] | undefined = await repCourses();
    res.json(courses);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

// show one course
export const showCourse = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const userId: number | undefined = isAuth(req);
    const course: Course | null = await repCourse(name);
    res.json(course);
  } catch (error: any) {
    res.json({ message: error.message });
  }
};

// creating course
export const createCourse = async (req: Request, res: Response) => {
  const info: Course = req.body;
  const { name } = req.body as { name: string };
  try {
    const userId: number | undefined = isAuth(req);
    const sameUser: User | undefined = (userDB as User[]).find((user) => {
      return user.name === name;
    });
    if (sameUser) throw new Error("This course is registered before");
    const course: Course = await repCreate(info);
    res.json(course);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// updating course
export const updateCourse = async (req: Request, res: Response) => {
  const { name } = req.params as { name: string };
  try {
    const userId: number = isAuth(req);
    const course: Course | null = await repUpdate(name, req);
    const updatedCourse = await repCourse(name);
    res.json(updatedCourse);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// deleting course
export const deleteCourse = async (req: Request, res: Response) => {
  const { name } = req.params as { name: string };
  try {
    const userId: number = isAuth(req);
    const course = await repDelete(name);
    res.status(200).json({ message: "Deleted succussfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// new access token from refresh token
export const newAccessToken = async (req: Request, res: Response) => {
  const token: string | undefined = req.cookies.refreshtoken;
  if (!token) return res.status(400).json({ Accesstoken: " " });
  let payload: JwtPayload | undefined;
  try {
    payload = verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
  const user: User | undefined = (userDB as User[]).find((user) => {
    return user.id === payload.userId;
  });
  if (!user) return res.status(400).json({ Accesstoken: " " });
  if (user.refreshtoken !== token)
    return res.status(400).json({ Accesstoken: " " });
  const accessToken: string = createAccessToken(user.id);
  const refreshToken: string = createRefreshToken(user.id);
  user.refreshtoken = refreshToken;
  sendRefreshToken(res, refreshToken);
  res.json({ Accesstoken: accessToken });
};
