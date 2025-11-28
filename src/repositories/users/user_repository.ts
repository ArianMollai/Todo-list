import { hash, compare } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { verify, JwtPayload } from 'jsonwebtoken';
import { User } from '../../models/users/usermodel';
import { Course } from '../../models/courses/coursemodel';
import { Register } from '../../models/registrations/registermodel';
import { IUser, updatedUserInfo } from '../../types/user/types.user';
import { ICourse } from '../../types/course/types.course';
import { env } from '../../config/env';
import zxcvbn from 'zxcvbn';
import mongoose from 'mongoose';

// sing up
export const repSignUp = async (
  name: string,
  email: string,
  password: string,
) => {
  const sameUser: IUser | null = await User.findOne({
    email,
  });
  if (sameUser) {
    const err: any = new Error('this email has been registered before');
    err.statusCode = 403;
    throw err;
  }
  const strength = zxcvbn(password);
  if (strength.score < 3) {
    const err: any = new Error('Password is too weak');
    err.statusCode = 401;
    throw err;
  }
  const hashedPass = await hash(password, 10);
  const newUser: IUser | null = await User.create({
    name,
    email,
    password: hashedPass,
  });
  if (!newUser) {
    const err: any = new Error('Cant create user');
    err.statusCode = 403;
    throw err;
  }
  await newUser.populate<{ courses: ICourse[] }>(
    'courses',
    'name duration time status',
  );
  return newUser;
};

// login user
export const repLogin = async (
  name: string,
  password: string,
): Promise<IUser> => {
  const user: IUser | null = await User.findOne({ name }).populate<{
    courses: ICourse[];
  }>('courses', 'name duration time status');
  if (!user) {
    const err: any = new Error('User dosent Exist');
    err.statusCode = 404;
    throw err;
  }
  const valid = await compare(password, user.password);
  if (!valid) {
    const err: any = new Error('password is incorroct!');
    err.statusCode = 401;
    throw err;
  }
  return user;
};

// Update user
export const repUpdateUser = async (id: ObjectId, info: updatedUserInfo) => {
  const user: IUser | null = await User.findById(id);
  if (!user) {
    const err: any = new Error('User dosent Exist');
    err.statusCode = 404;
    throw err;
  }
  if (info.password) {
    info.password = await hash(info.password, 10);
  }
  const newUser: IUser | null = await User.findByIdAndUpdate(id, info, {
    new: true,
  }).populate<{ courses: ICourse[] }>('courses', 'name duration time status');

  return newUser;
};

// delete user
export const repDeleteUser = async (id: ObjectId) => {
  if (process.env.NODE_ENV === 'test') {
    const user: IUser | null = await User.findByIdAndDelete(id);
    if (!user) {
      const err: any = new Error('User dosent Exist');
      err.statusCode = 404;
      throw err;
    }
    await Register.deleteMany({ student: user._id });
    await Course.updateMany(
      { students: user._id },
      { $pull: { students: user._id } },
    );
    return user;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user: IUser | null =
      await User.findByIdAndDelete(id).session(session);
    if (!user) {
      const err: any = new Error('User dosent Exist');
      err.statusCode = 404;
      throw err;
    }

    await Register.deleteMany({ student: user._id }).session(session);
    await Course.updateMany(
      { students: user._id },
      { $pull: { students: user._id } },
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// logout
export const repLogOut = async (id: ObjectId) => {
  const user: IUser | null = await User.findById(id);
  if (!user) {
    const err: any = new Error('User dosent exists');
    err.statusCode = 404;
    throw err;
  }

  if (user.refreshtoken === null) {
    const err: any = new Error('You have logged out before');
    err.statusCode = 403;
    throw err;
  }

  user.refreshtoken = null;
  await user.save();

  return user;
};

// new accesstoken
export const repNewAccesstoken = async (refreshToken: string) => {
  if (!refreshToken) {
    const err: any = new Error('No refreshtoken provided');
    err.statusCode = 401;
    throw err;
  }
  const refreshPayload: JwtPayload = verify(
    refreshToken,
    env.REFRESH_TOKEN_SECRET!,
  ) as JwtPayload;
  if (!refreshPayload) {
    const err: any = new Error('Please login again');
    err.statusCode = 401;
    throw err;
  }
  const user = await User.findById(refreshPayload.userId);
  if (!user) {
    const err: any = new Error('User dosent Exist');
    err.statusCode = 404;
    throw err;
  }
  if (user.refreshtoken !== refreshToken) {
    const err: any = new Error('Invalid refreshtoken');
    err.statusCode = 401;
    throw err;
  }
  return user;
};

// show users
export const repShowUsers = async () => {
  const users: IUser[] = await User.find().populate(
    'courses',
    'name duration time status',
  );
  if (users.length === 0) {
    const err: any = new Error('No users found');
    err.statusCode = 404;
    throw err;
  }
  return users;
};

// show one user
export const repShowOneUser = async (name: string) => {
  const user: IUser[] | null = await User.find({ name }).populate<{
    courses: ICourse[];
  }>('courses', 'name duration time status');
  if ((user as IUser[]).length === 0) {
    const err: any = new Error('The user dosent exists');
    err.statusCode = 404;
    throw err;
  }
  return user;
};
