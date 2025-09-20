import { Request } from "express";
import { compare } from "bcryptjs";
import Courses from "../models/models";
import { Course, User } from "../config/env";
//import Courses from "../models/course.model";
import userDB from "../userDB/userDB";

// login user
export const repLogin = async (req: Request) => {
  const { name, password }: { name: string; password: string } = req.body;
  const user: User | undefined = (userDB as User[]).find((user) => {
    return user.name === name;
  });
  if (!user) throw new Error("User dosent Exist");
  const valid = await compare(password, user.password);
  if (!valid) throw new Error("password is incorroct!");
  return user;
};

// logout user
export const repLogout = (userId: number) => {
  const user: User | undefined = (userDB as User[]).find((user: User) => {
    return user.id === userId;
  });
  if (!user || !user.refreshtoken) throw new Error("no user to logout!");
  user.refreshtoken = null;
  return user;
};

// fetching courses
export const repCourses = async () => {
  const courses: Course[] = await Courses.find({});
  if (!courses) throw new Error("courses not exists");
  return courses;
};

// fetching one course
export const repCourse = async (name: string) => {
  const course: Course | null = await Courses.findOne({ name });
  if (!course) throw new Error("course not exists");
  return course;
};

// creating course
export const repCreate = async (info: Course) => {
  const newCourse: Course = await Courses.create(info);
  if (!newCourse) throw new Error("Can't create user");
  return newCourse;
};

// updating course
export const repUpdate = async (name: string, req: Request) => {
  const updatedCourse: Course | null = await Courses.findOneAndUpdate(
    { name },
    req.body
  );
  if (!updatedCourse) throw new Error("course not exists!");
  return updatedCourse;
};

// deleting course
export const repDelete = async (name: string) => {
  const deletedCourse = await Courses.findOneAndDelete({ name });
  if (!deletedCourse) throw new Error("course not exists");
  return deletedCourse;
};
