import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { verify, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { User } from "../../models/users/usermodel";
import { Course } from "../../models/courses/coursemodel";
import { Register } from "../../models/registrations/registermodel";
import { ICourse, IUser, env, IUserPopulated } from "../../config/env";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../../utils/utils";
import { triggerAsyncId } from "async_hooks";

// sing up
export const repSignUp = async (req: Request, res: Response) => {
  const info = req.body;
  try {
    const sameUser: IUser | null = await User.findOne({
      email: req.body.email,
    });
    if (sameUser)
      return res
        .status(400)
        .json({ message: "this email has been registered before" });
    info.password = await hash(info.password, 10);
    const newUser: IUser | null = await User.create(info);
    await newUser.populate<{ courses: ICourse[] }>(
      "courses",
      "name duration time status"
    );
    const accessToken: string = createAccessToken(newUser._id);
    const refreshToken: string = createRefreshToken(newUser._id);
    newUser.refreshtoken = refreshToken;
    await newUser.save();
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken, newUser.courses as ICourse[]);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// login user
export const repLogin = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  const { name }: { name: string } = req.body;
  const { password } = req.body;
  try {
    const user: IUser | null = await User.findOne({ name }).populate<{
      courses: ICourse[];
    }>("courses", "name duration time status");
    if (!user) return res.status(400).json({ message: "User dosent Exist" });
    const valid = await compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "password is incorroct!" });
    // creating token
    const accessToken: string = createAccessToken(user._id);
    const refreshToken: string = createRefreshToken(user._id);
    user.refreshtoken = refreshToken;
    await user.save();
    // sending tokens
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken, user.courses as ICourse[]);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update user
export const repUpdateUser = async (req: Request, res: Response) => {
  const info = req.body;
  try {
    const user: IUser | null = await User.findById((req as any).userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    if (info.password) {
      info.password = await hash(info.password, 10);
    }
    const newUser: IUser | null = await User.findByIdAndUpdate(
      (req as any).userId,
      info,
      {
        new: true,
      }
    ).populate<{ courses: ICourse[] }>("courses", "name duration time status");
    return res.status(200).json(newUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete user
export const repDeleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user: IUser | null = await User.findByIdAndDelete(
      (req as any).userId
    );
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    await Register.deleteMany({ student: user._id });
    await Course.updateMany(
      { students: user._id },
      { $pull: { students: user._id } }
    );
    return res.status(200).json({ message: "User deleted succussfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// new accesstoken
export const repNewAccesstoken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshtoken: string = req.cookies.refreshtoken;
  if (!refreshtoken)
    return res.status(400).json({ message: "No refreshtoken provided" });
  try {
    const headers = req.headers["authorization"];
    if (!headers)
      return res.status(400).json({ message: "Please login or singup" });
    const refreshPayload: JwtPayload = verify(
      refreshtoken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    const user = await User.findById(refreshPayload.userId);
    if (!user)
      return res.status(400).json({ message: "Please signup or login" });
    const refreshToken = createRefreshToken(user._id);
    const accessToken = createAccessToken(user._id);
    user.refreshtoken = refreshToken;
    await user.save();
    return res.status(200).json({ accesstoken: accessToken });
  } catch (error: any) {
    if (error instanceof TokenExpiredError)
      return res.status(400).json({ message: "Please login again" });
    return res.status(400).json({ message: error.message });
  }
};

// show users
export const repShowUsers = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find().populate(
      "courses",
      "name duration time status"
    );
    if (users.length === 0)
      return res.status(400).json({ message: "No users found" });
    return res.status(200).json(users);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show one user
export const repShowOneUser = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const user: IUser[] = await User.find({ name }).populate<{
      courses: ICourse[];
    }>("courses", "name duration time status");
    if (user.length === 0)
      return res.status(400).json({ message: "This user dosen't exists" });
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
