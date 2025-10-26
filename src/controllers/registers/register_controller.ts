import { Request, Response } from "express";
import {
  serRegister,
  serCanselResgister,
  serShowRegisters,
  serShowOneRegister,
} from "../../services/registers/register._service";

export const register = async (req: Request, res: Response) => {
  try {
    return await serRegister(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const cancelRegister = async (req: Request, res: Response) => {
  try {
    return await serCanselResgister(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const showRegisters = async (req: Request, res: Response) => {
  try {
    return await serShowRegisters(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const showOneRegister = async (req: Request, res: Response) => {
  try {
    return await serShowOneRegister(req, res);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
