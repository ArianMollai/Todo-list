import { Response, Request } from "express";
import {
  repSignUp,
  repLogin,
  repUpdateUser,
  repDeleteUser,
  repRegisterCourse,
  repUpdateCourse,
  repDeleteCourse,
  repShowDB,
  repNewAccesstoken,
} from "../repositories/repository";

export const serSignUp = async (req: Request, res: Response) => {
  return await repSignUp(req, res);
};

export const serLogin = async (req: Request, res: Response) => {
  return await repLogin(req, res);
};

export const serUpdateUser = async (req: Request, res: Response) => {
  return await repUpdateUser(req, res);
};

export const serDeleteUser = async (req: Request, res: Response) => {
  return await repDeleteUser(req, res);
};

export const serRegisterCourse = async (req: Request, res: Response) => {
  return await repRegisterCourse(req, res);
};

export const serUpdateCourse = async (req: Request, res: Response) => {
  return await repUpdateCourse(req, res);
};

export const serDeleteCourse = async (req: Request, res: Response) => {
  return await repDeleteCourse(req, res);
};

export const serShowDB = async (req: Request, res: Response) => {
  return await repShowDB(req, res);
};

export const serNewAccesstoken = async (req: Request, res: Response) => {
  return await repNewAccesstoken(req, res);
};
/*export const serLogout = async (req: Request, res: Response) => {
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
 */
