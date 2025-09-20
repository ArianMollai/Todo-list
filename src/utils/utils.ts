import { Request, Response } from "express";
import userDB from "../userDB/userDB";
import { JwtPayload, verify } from "jsonwebtoken";
import { sign } from "jsonwebtoken";
import "dotenv/config";
import { env, User, Course } from "../config/env";

export const isAuth = (req: Request) => {
  const authorization: string | undefined = req.headers["authorization"];
  if (!authorization) throw new Error("you need to login first!");
  const token: string = authorization.split(" ")[1];
  const payload: JwtPayload = verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as { userId: number };
  const user: User | undefined = userDB.find((user) => {
    return user.id === payload.userId;
  });
  if (!user?.refreshtoken) throw new Error("you need to login first!");
  return user.id;
};

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
  accessToken: string,
  refreshToken: string
): Response => {
  return res.send({
    message: "User logged in successfully",
    name: req.body.name,
    accessToken,
    refreshToken,
  });
};

export const sendRefreshToken = (res: Response, refreshToken: string): void => {
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    //path: "/refresh_token",
  });
};
