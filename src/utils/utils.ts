import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { sign } from 'jsonwebtoken';
import 'dotenv/config';
import { ICourse } from '../types/course/types.course';
import { env } from '../config/env';

export const createAccessToken = (userId: Types.ObjectId): string => {
  return sign({ userId }, env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (userId: Types.ObjectId): string => {
  return sign({ userId }, env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
  });
};

export const sendAccessToken = (
  req: Request,
  res: Response,
  accessToken: string,
  courses: ICourse[],
): Response => {
  return res.status(200).json({
    message: 'Wellcome in',
    name: req.body.name,
    accessToken,
    courses: [courses],
  });
};

export const sendRefreshToken = (res: Response, refreshToken: string): void => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/api/v1/users/access_token',
  });
};
