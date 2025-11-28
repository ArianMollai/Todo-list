import { Request, Response, NextFunction } from 'express';
import {
  repRegister,
  repCanselRegister,
  repShowRegisters,
  repShowOneRegister,
} from '../../repositories/registers/register_repository';
import { IRegister } from '../../types/register/types.register';
import { IUser } from '../../types/user/types.user';

// new register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;
  try {
    const registeration: IRegister | null = await repRegister(
      (req as any).userId,
      name,
    );
    return res.status(200).json(registeration);
  } catch (error: any) {
    next(error);
  }
};

// cancel register
export const cancelRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.params;
  try {
    const updatedUser: IUser | null = await repCanselRegister(
      (req as any).userId,
      name,
    );
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    next(error);
  }
};

// show registers
export const showRegisters = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registrations: IRegister[] | null = await repShowRegisters();
    return res.status(200).json(registrations);
  } catch (error: any) {
    next(error);
  }
};

export const showOneRegister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const info = req.body;
  try {
    const register: IRegister | null = await repShowOneRegister(info);
    return res.status(200).json(register);
  } catch (error: any) {
    next(error);
  }
};
