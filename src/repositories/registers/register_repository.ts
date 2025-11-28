import { Register } from '../../models/registrations/registermodel';
import { Course } from '../../models/courses/coursemodel';
import { User } from '../../models/users/usermodel';
import { IRegister } from '../../types/register/types.register';
import { ICourse } from '../../types/course/types.course';
import { IUser } from '../../types/user/types.user';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

// register new course
export const repRegister = async (id: ObjectId, name: string) => {
  if (process.env.NODE_ENV === 'test') {
    const user: IUser | null = await User.findById(id);
    if (!user) {
      const err: any = new Error('User dosent exist');
      err.statusCode = 404;
      throw err;
    }

    const course: ICourse | null = await Course.findOne({ name });
    if (!course) {
      const err: any = new Error('course dosent exits');
      err.statusCode = 404;
      throw err;
    }

    const sameCourse = user.courses?.find((u) => {
      return String(u._id) === String(course._id);
    });
    if (sameCourse) {
      const err: any = new Error('You have registered for this course before');
      err.statusCode = 403;
      throw err;
    }

    user.courses?.push(course._id);
    course.students?.push(user._id);

    await user.save();
    await course.save();

    const registration = new Register({
      course: course._id,
      student: user._id,
    });

    await registration.save();

    await registration.populate({
      path: 'course',
      select: 'name duration time status',
    });

    await registration.populate({
      path: 'student',
      select: 'name email',
    });

    return registration;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user: IUser | null = await User.findById(id).session(session);
    if (!user) {
      const err: any = new Error('User dosent exist');
      err.statusCode = 404;
      throw err;
    }

    const course: ICourse | null = await Course.findOne({ name }).session(
      session,
    );
    if (!course) {
      const err: any = new Error('course dosent exits');
      err.statusCode = 404;
      throw err;
    }

    const sameCourse = user.courses?.find((u) => {
      return String(u._id) === String(course._id);
    });
    if (sameCourse) {
      const err: any = new Error('You have registered for this course before');
      err.statusCode = 403;
      throw err;
    }

    user.courses?.push(course._id);
    course.students?.push(user._id);

    await user.save({ session });
    await course.save({ session });

    const registration = new Register({
      course: course._id,
      student: user._id,
    });

    await registration.save({ session });

    await registration.populate({
      path: 'course',
      select: 'name duration time status',
      options: { session },
    });
    await registration.populate({
      path: 'student',
      select: 'name email',
      options: { session },
    });

    await session.commitTransaction();
    session.endSession();

    return registration;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// cancel registration
export const repCanselRegister = async (id: ObjectId, name: string) => {
  if (process.env.NODE_ENV === 'test') {
    const user: IUser | null = await User.findById(id);
    if (!user) {
      const err: any = new Error('User dosent exist');
      err.statusCode = 404;
      throw err;
    }

    const course: ICourse | null = await Course.findOne({ name });
    if (!course) {
      const err: any = new Error('course dosent exits');
      err.statusCode = 404;
      throw err;
    }

    const registration: IRegister | null = await Register.findOneAndDelete({
      student: user._id,
      course: course._id,
    });
    if (!registration) {
      const err: any = new Error(
        "You haven't regitered for this course before",
      );
      err.statusCode(403);
      throw err;
    }

    await User.updateMany(
      { courses: course._id },
      { $pull: { courses: course._id } },
    );

    await Course.updateMany(
      { students: user._id },
      { $pull: { students: user._id } },
    );

    const updatedUser: IUser | null = await User.findById(id);
    if (!updatedUser) {
      const err: any = new Error('User dosent exists');
      err.statusCode = 404;
      throw err;
    }

    await updatedUser.populate({
      path: 'courses',
      select: 'name duration time status',
    });

    return updatedUser;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user: IUser | null = await User.findById(id).session(session);
    if (!user) {
      const err: any = new Error('User dosent exist');
      err.statusCode = 404;
      throw err;
    }

    const course: ICourse | null = await Course.findOne({ name }).session(
      session,
    );
    if (!course) {
      const err: any = new Error('course dosent exits');
      err.statusCode = 404;
      throw err;
    }

    const deletedRegister = await Register.findOneAndDelete({
      course: course._id,
      student: user._id,
    }).session(session);
    if (!deletedRegister) {
      const err: any = new Error(
        "You haven't regitered for this course before",
      );
      err.statusCode = 403;
      throw err;
    }

    await Course.updateOne(
      { _id: course._id },
      { $pull: { students: user._id } },
    ).session(session);
    await User.updateOne(
      { _id: user._id },
      { $pull: { courses: course._id } },
    ).session(session);

    const updatedUser: IUser | null = await User.findById(id).session(session);
    if (!updatedUser) {
      const err: any = new Error('User dosent exists');
      err.statusCode = 404;
      throw err;
    }

    await updatedUser.populate({
      path: 'courses',
      select: 'name duration time status',
      options: { session },
    });

    await session.commitTransaction();
    session.endSession();

    return updatedUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// show registrations
export const repShowRegisters = async () => {
  const registers: IRegister[] = await Register.find().populate([
    { path: 'course', select: 'name duration time status' },
    { path: 'student', select: 'name email' },
  ]);
  if (registers.length === 0) {
    const err: any = new Error('NO registers found');
    err.statusCode = 404;
    throw err;
  }
  return registers;
};

// show one register
export const repShowOneRegister = async (info: {
  username: string;
  coursename: string;
}) => {
  const user: IUser | null = await User.findOne({ name: info.username });
  if (!user) {
    const err: any = new Error('User dosent exist');
    err.statusCode = 404;
    throw err;
  }

  const course: ICourse | null = await Course.findOne({
    name: info.coursename,
  });
  if (!course) {
    const err: any = new Error('course dosent exits');
    err.statusCode = 404;
    throw err;
  }
  const registers: IRegister | null = await Register.findOne({
    student: user._id,
    course: course._id,
  }).populate([
    { path: 'course', select: 'name duration time status' },
    { path: 'student', select: 'name email' },
  ]);
  if (!registers) {
    const err: any = new Error('No registers found');
    err.statusCode = 404;
    throw err;
  }
  return registers;
};
