import { Request, Response } from "express";
import { compare } from "bcryptjs";
import { verify, JwtPayload } from "jsonwebtoken";
import Courses from "../models/models";
import { Course, User, env } from "../config/env";
//import Courses from "../models/course.model";
import userDB from "../userDB/userDB";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../utils/utils";

// login user
export const repLogin = async (
  req: Request,
  res: Response,
  name: string,
  password: string
): Promise<void | Response> => {
  try {
    const user: User | undefined = (userDB as User[]).find((user) => {
      return user.name === name;
    });
    if (!user) return res.status(400).json({ message: "User dosent Exist" });
    const valid = await compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "password is incorroct!" });
    // creating token
    const accessToken: string = createAccessToken(user.id);
    const refreshToken: string = createRefreshToken(user.id);
    user.refreshtoken = refreshToken;
    // sending tokens
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// logout user
export const repLogout = async (req: Request, res: Response) => {
  const token: string | undefined = req.cookies.refreshtoken;
  if (!token) return res.status(400).json("no user to logout!");
  const payload: JwtPayload | null = verify(
    token,
    env.REFRESH_TOKEN_SECRET!
  ) as JwtPayload;

  const user: User | undefined = (userDB as User[]).find((user: User) => {
    return user.id === payload.userId;
  });
  if (!user || !user.refreshtoken)
    return res.status(400).json("no user to logout!");
  await res.clearCookie("refreshtoken");
  user.refreshtoken = null;
  return user;
};

// show all courses
export const repCourses = async (res: Response) => {
  try {
    return await Courses.find({});
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

// show one course
export const repCourse = async (
  name: string,
  res: Response
): Promise<Course | Response> => {
  try {
    const course: Course | null = await Courses.findOne({ name });
    if (!course) return res.status(400).json({ message: "course not exists" });
    return course;
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// creating course
export const repCreate = async (
  info: Course,
  name: string,
  res: Response
): Promise<Course | Response> => {
  try {
    const sameCourse = await Courses.findOne({ name });
    if (sameCourse) return res.status(400).json({ message: "existed already" });
    const newCourse = await Courses.create(info);
    return newCourse;
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

// updating course
export const repUpdate = async (
  name: string,
  info: Partial<Course>,
  res: Response
): Promise<Course | Response> => {
  const updatedCourse: Course | null = await Courses.findOneAndUpdate(
    { name },
    info
  );
  if (!updatedCourse)
    return res.status(400).json({ message: "course not exists!" });
  const newName: string | undefined = info.name;
  if (newName) {
    const course: Course | null = await Courses.findOne({ name: newName });
    return course as Course;
  } else {
    const course: Course | null = await Courses.findOne({ name });
    return course as Course;
  }
};

// deleting course
export const repDelete = async (
  name: string,
  res: Response
): Promise<object | Response> => {
  try {
    const deletedCourse: Course | null = await Courses.findOneAndDelete({
      name,
    });
    if (!deletedCourse)
      return res.status(400).json({ message: "course not exists" });
    return deletedCourse;
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// new Aceesstoken
export const repNewAcessToken = async (req: Request, res: Response) => {
  try {
    const token: string | undefined = req.cookies.refreshtoken;
    if (!token) return res.status(400).json({ Accesstoken: " " });
    const payload: JwtPayload | undefined = (await verify(
      token,
      env.REFRESH_TOKEN_SECRET!
    )) as JwtPayload;
    if (!payload.userId) return res.status(400).json({ Accesstoken: " " });
    const user: User | undefined = userDB.find((u) => {
      return u.id === payload.userId;
    });
    if (!user) return res.status(400).json({ message: "user dosen't exists" });
    if (token !== user.refreshtoken)
      return res.status(400).json({ message: "You need to login" });
    const accessToken: string = createAccessToken(user.id);
    const refreshToken: string = createRefreshToken(user.id);
    user.refreshtoken = refreshToken;
    sendRefreshToken(res, refreshToken);
    return res.json({ accessToken });
  } catch (error: any) {
    return res.json({ message: error.message });
  }
};
