import { Request, Response, NextFunction } from "express";
import userDB from "../userDB/userDB";
import { JwtPayload, verify } from "jsonwebtoken";
import { sign } from "jsonwebtoken";
import "dotenv/config";
import { env, User, Course } from "../config/env";

export const createAccessToken = (userId: number): string => {
  return sign({ userId }, env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (userId: number): string => {
  return sign({ userId }, env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export const sendAccessToken = (
  req: Request,
  res: Response,
  accessToken: string
): Response => {
  return res.json({
    message: "User logged in successfully",
    name: req.body.name,
    accessToken,
  });
};

export const sendRefreshToken = (res: Response, refreshToken: string): void => {
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    //path: "/refresh_token",
  });
};
