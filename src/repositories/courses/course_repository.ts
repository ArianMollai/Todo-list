import { Course } from '../../models/courses/coursemodel';
import { User } from '../../models/users/usermodel';
import { Register } from '../../models/registrations/registermodel';
import { ICourse, courseUpdatedInfo } from '../../types/course/types.course';
import { IUser } from '../../types/user/types.user';
import mongoose, { ObjectId } from 'mongoose';

// new course
export const repNewCourse = async (id: ObjectId, info: object) => {
  const user: IUser | null = await User.findById(id);
  if (!user) {
    const err: any = new Error('User dosent exists');
    err.statusCode = 404;
    throw err;
  }
  const course: ICourse | null = await Course.create(info);
  if (!course) {
    const err: any = new Error('Couldnt create course');
    err.statusCode = 500;
    throw err;
  }
  await course.populate<{ students: IUser[] }>('students', 'name email');
  return course;
};

// update course
export const repUpdateCourse = async (
  id: ObjectId,
  name: string,
  info: courseUpdatedInfo,
) => {
  const user: IUser | null = await User.findById(id);
  if (!user) {
    const err: any = new Error('User dosent exists');
    err.statusCode = 404;
    throw err;
  }
  const course: ICourse | null = await Course.findOneAndUpdate({ name }, info, {
    new: true,
  }).populate<{ students: IUser[] }>('students', 'name email');
  if (!course) {
    const err: any = new Error('course not found');
    err.statusCode = 404;
    throw err;
  }
  return course;
};

// delete course
export const repDeleteCourse = async (id: ObjectId, name: string) => {
  if (process.env.NODE_ENV == 'test') {
    const user: IUser | null = await User.findById(id);
    if (!user) {
      const err: any = new Error('User dosent exists');
      err.statusCode = 404;
      throw err;
    }

    const deletedCourse = await Course.findOneAndDelete({ name });
    if (!deletedCourse) {
      const err: any = new Error('This course dosent exists');
      err.statusCode = 404;
      throw err;
    }

    await User.updateMany(
      { courses: deletedCourse._id },
      { $pull: { courses: deletedCourse._id } },
    );

    await Register.deleteMany({ course: deletedCourse._id });

    return deletedCourse;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user: IUser | null = await User.findById(id).session(session);
    if (!user) {
      const err: any = new Error('User dosent exists');
      err.statusCode = 404;
      throw err;
    }
    const deletedCourse = await Course.findOneAndDelete({ name }).session(
      session,
    );
    if (!deletedCourse) {
      const err: any = new Error('this course dosent exists');
      err.statusCode = 404;
      throw err;
    }
    await Register.deleteMany({
      course: deletedCourse._id,
    }).session(session);
    await User.updateMany(
      { courses: deletedCourse._id },
      { $pull: { courses: deletedCourse._id } },
    ).session(session);
    await session.commitTransaction();
    session.endSession();
    return deletedCourse;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// show courses
export const repShowCourses = async () => {
  const courses: ICourse[] = await Course.find().populate<{
    students: IUser[];
  }>('students', 'name email');
  if (courses.length === 0) {
    const err: any = new Error('No course found');
    err.statusCode = 404;
    throw err;
  }
  return courses;
};

// show one course
export const repShowOneCourse = async (name: string) => {
  const course: ICourse[] | null = await Course.find({ name }).populate<{
    students: IUser[];
  }>('students', 'name email');
  if ((course as ICourse[]).length === 0) {
    const err: any = new Error('This course dosent exists');
    err.statusCode = 404;
    throw err;
  }
  return course;
};
