import { Request, Response } from "express";
import {
  repRegister,
  repCanselRegister,
  repShowRegisters,
  repShowOneRegister,
} from "../../repositories/registers/register_repository";

export const serRegister = async (req: Request, res: Response) => {
  return await repRegister(req, res);
};

export const serCanselResgister = async (req: Request, res: Response) => {
  return await repCanselRegister(req, res);
};

export const serShowRegisters = async (req: Request, res: Response) => {
  return await repShowRegisters(req, res);
};

export const serShowOneRegister = async (req: Request, res: Response) => {
  return await repShowOneRegister(req, res);
};
