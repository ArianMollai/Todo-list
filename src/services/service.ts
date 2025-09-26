import { Response, Request } from "express";
import {
  repCourses,
  repCourse,
  repCreate,
  repUpdate,
  repDelete,
  repNewAcessToken,
  repLogin,
  repLogout,
} from "../repositories/repository";
import { Course } from "../config/env";

export const serLogin = async (
  req: Request,
  res: Response,
  name: string,
  password: string
) => {
  return await repLogin(req, res, name, password);
};

export const serLogout = async (req: Request, res: Response) => {
  return await repLogout(req, res);
};

export const serGetAllCourses = async (res: Response) => {
  return await repCourses(res);
};

export const serGetOneCourse = async (
  name: string,
  res: Response
): Promise<Course | Response> => {
  return await repCourse(name, res);
};

export const serCreateCourse = async (
  info: Course,
  name: string,
  res: Response
): Promise<Course | Response> => {
  return await repCreate(info, name, res);
};

export const serUpdateCourse = async (
  name: string,
  info: object,
  res: Response
): Promise<Course | Response> => {
  return await repUpdate(name, info, res);
};

export const serDeleteCourse = async (
  name: string,
  res: Response
): Promise<object | null> => {
  return await repDelete(name, res);
};

export const serNewAccessToken = async (req: Request, res: Response) => {
  return await repNewAcessToken(req, res);
};
