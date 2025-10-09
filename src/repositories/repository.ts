import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { verify, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { Courses, Users } from "../models/models";
import { ICourse, IUser, env } from "../config/env";
//import Courses from "../models/course.model";
import userDB from "../userDB/userDB";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../utils/utils";
import { promises } from "dns";
import { ref } from "process";

// sing up
export const repSignUp = async (req: Request, res: Response) => {
  const info = req.body;
  try {
    const sameUser: IUser | null = await Users.findOne({
      email: req.body.email,
    });
    if (sameUser)
      return res
        .status(400)
        .json({ message: "this email has been registered before" });
    const user = await Users.create(info);
    const password: string = info.password;
    user.password = await hash(password, 10);
    await user.save();
    const accessToken: string = createAccessToken(String(user._id));
    const refreshToken: string = createRefreshToken(String(user._id));
    user.refreshtoken = refreshToken;
    await user.save();
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken, user.courses);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// login user
export const repLogin = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { name }: { name: string } = req.body;
  const { password } = req.body;
  try {
    const user = await Users.findOne({ name });
    if (!user) return res.status(400).json({ message: "User dosent Exist" });
    const valid = await compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "password is incorroct!" });
    // creating token
    const accessToken: string = createAccessToken(String(user._id));
    const refreshToken: string = createRefreshToken(String(user._id));
    user.refreshtoken = refreshToken;
    await user.save();
    // sending tokens
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken, user.courses);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update user
export const repUpdateUser = async (req: Request, res: Response) => {
  const info = req.body;
  try {
    const user = await Users.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    if (info.password) {
      info.password = await hash(info.password, 10);
    }
    const newUser = await Users.findByIdAndUpdate(req.userId, info, {
      new: true,
    });
    return res.status(200).json(newUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete user
export const repDeleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user: IUser | null = await Users.findByIdAndDelete(req.userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    return res.status(200).json({ message: "User deleted succussfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// register course
export const repRegisterCourse = async (req: Request, res: Response) => {
  const { name, duration, time, status } = req.query;
  try {
    const user = await Users.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    const sameCourse = user.courses.find((u) => {
      return u.name === name;
    });
    if (sameCourse)
      return res
        .status(400)
        .json({ message: "You have registered for this course before" });
    const info: ICourse = {
      name: String(name),
      duration: String(duration),
      time: String(time),
      status: String(status),
    };
    user.courses.push(info);
    await user.save();
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(200).json({ message: error.message });
  }
};

// update course
export const repUpdateCourse = async (req: Request, res: Response) => {
  const info = req.query;
  const { course_name } = req.params;
  try {
    const user = await Users.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    let course: ICourse | undefined = user.courses.find((u) => {
      return u.name === course_name;
    });
    if (!course)
      return res
        .status(400)
        .json({ message: "You havent registered for this course" });
    course.time = String(info.time);
    course.duration = String(info.duration);
    course.status = String(info.status);
    await user.save();
    return res.status(200).json(course);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete course
export const repDeleteCourse = async (req: Request, res: Response) => {
  const { course_name } = req.query;
  try {
    const user = await Users.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    const courseLengthBefore = user.courses.length;
    user.courses = user.courses.filter((u) => {
      return u.name !== course_name;
    });
    const courseLengthAfter = user.courses.length;
    if (courseLengthAfter === courseLengthBefore)
      return res
        .status(200)
        .json({ message: "You didnt registered this course" });
    await user.save();
    return true;
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show database
export const repShowDB = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user: IUser[] | null = await Users.find();
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(400).json({ messsage: error.message });
  }
};

// new accesstoken
export const repNewAccesstoken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshtoken: string = req.cookies.refreshtoken;
  if (!refreshtoken)
    return res.status(400).json({ message: "No refreshtoken provided" });
  try {
    const headers = req.headers["authorization"];
    if (!headers)
      return res.status(400).json({ message: "Please login or singup" });
    const refreshPayload: JwtPayload = verify(
      refreshtoken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    const user = await Users.findById(refreshPayload.userId);
    if (!user)
      return res.status(400).json({ message: "Please signup or login" });
    const refreshToken = createRefreshToken(user._id);
    const accessToken = createAccessToken(user._id);
    user.refreshtoken = refreshToken;
    await user.save();
    return res.status(200).json({ accesstoken: accessToken });
  } catch (error: any) {
    if (error instanceof TokenExpiredError)
      return res.status(400).json({ message: "Please login again" });
    return res.status(400).json({ message: error.message });
  }
};

// logout user
/*export const repLogout = async (req: Request, res: Response) => {
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
 */
