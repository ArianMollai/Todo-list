import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import userDB from "../userDB/userDB";
import { User, env } from "../config/env";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization: string | undefined = req.headers["authorization"];
  if (!authorization) return res.status(404).json("you need to login first!");
  const token: string = authorization.split(" ")[1];
  const accessPayload: JwtPayload | undefined = verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!
  ) as JwtPayload;
  if (!accessPayload) return res.status(400).json("you need to login first!");
  const refreshToken: string | undefined = req.cookies.refreshtoken;
  if (!refreshToken) return res.status(400).json("you need to login first!");
  const user: User | undefined = userDB.find((user) => {
    return user.id === accessPayload.userId;
  });
  next();
};
