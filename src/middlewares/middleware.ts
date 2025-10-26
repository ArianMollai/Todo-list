import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization: string | undefined = req.headers["authorization"];
    if (!authorization) return res.status(404).json("you need to login first!");
    const token: string = authorization.split(" ")[1];
    const accessPayload: JwtPayload | undefined = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    (req as any).userId = accessPayload.userId;
    next();
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
