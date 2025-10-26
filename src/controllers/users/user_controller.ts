import { Request, Response } from "express";
import {
  serSignUp,
  serLogin,
  serUpdateUser,
  serDeleteUser,
  serNewAccesstoken,
  serShowUsers,
  serShowOneUser,
} from "../../services/users/user_service";

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

// update user
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

// new access token
export const newAccessToken = async (req: Request, res: Response) => {
  try {
    return await serNewAccesstoken(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show users
export const showUsers = async (req: Request, res: Response) => {
  try {
    return await serShowUsers(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show one user
export const showOneUser = async (req: Request, res: Response) => {
  try {
    return await serShowOneUser(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
