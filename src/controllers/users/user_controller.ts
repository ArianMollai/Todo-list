import { Request, Response, NextFunction } from 'express';
import {
  repSignUp,
  repLogin,
  repUpdateUser,
  repDeleteUser,
  repLogOut,
  repShowUsers,
  repShowOneUser,
  repNewAccesstoken,
} from '../../repositories/users/user_repository';
import {
  sendAccessToken,
  sendRefreshToken,
  createAccessToken,
  createRefreshToken,
} from '../../utils/utils';
import { ICourse } from '../../types/course/types.course';
import { IUser } from '../../types/user/types.user';
import { error } from 'console';

// sign up
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const info = req.body;
  try {
    const newUser: IUser = await repSignUp(
      info.name,
      info.email,
      info.password,
    );
    const accessToken: string = createAccessToken(newUser._id);
    const refreshToken: string = createRefreshToken(newUser._id);
    newUser.refreshtoken = refreshToken;
    await newUser.save();
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken, newUser.courses as ICourse[]);
  } catch (error: any) {
    next(error);
  }
};

// login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const info = req.body;
  const user = await repLogin(info.name, info.password);
  // creating token
  const accessToken: string = createAccessToken(user._id);
  const refreshToken: string = createRefreshToken(user._id);
  user.refreshtoken = refreshToken;
  await user.save();
  // sending tokens
  sendRefreshToken(res, refreshToken);
  sendAccessToken(req, res, accessToken, user.courses as ICourse[]);
  next(error);
};

// update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const info = req.body;
  try {
    const updatedUser = await repUpdateUser((req as any).userId, info);
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    next(error);
  }
};

// delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await repDeleteUser((req as any).userId);
    return res.status(200).json({ message: 'User deleted succussfully' });
  } catch (error: any) {
    next(error);
  }
};

//logout
export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await repLogOut((req as any).userId);

    res.clearCookie('refreshtoken');

    return res.status(200).json({ message: 'Logged out succussfully' });
  } catch (error: any) {
    next(error);
  }
};

// new access token
export const newAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshtoken: string = req.cookies?.refreshtoken;
  try {
    const user: IUser | null = await repNewAccesstoken(refreshtoken);
    if (!user) throw error;
    const refreshToken = createRefreshToken(user._id);
    const accessToken = createAccessToken(user._id);
    user.refreshtoken = refreshToken;
    await user.save();
    sendRefreshToken(res, refreshToken);
    return res.status(200).json({ accessToken });
  } catch (error: any) {
    next(error);
  }
};

// show users
export const showUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users: IUser[] | null = await repShowUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    next(error);
  }
};

// show one user
export const showOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.params;
  try {
    const user: IUser[] | null = await repShowOneUser(name);
    return res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
};
