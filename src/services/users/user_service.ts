import { Request, response, Response } from "express";
import {
  repSignUp,
  repLogin,
  repUpdateUser,
  repDeleteUser,
  repNewAccesstoken,
  repShowUsers,
  repShowOneUser,
} from "../../repositories/users/user_repository";

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

export const serNewAccesstoken = async (req: Request, res: Response) => {
  return await repNewAccesstoken(req, res);
};

export const serShowUsers = async (req: Request, res: Response) => {
  return await repShowUsers(req, res);
};

export const serShowOneUser = async (req: Request, res: Response) => {
  return await repShowOneUser(req, res);
};
