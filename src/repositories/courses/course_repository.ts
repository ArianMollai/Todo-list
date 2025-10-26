import { Request, Response } from "express";
import { Course } from "../../models/courses/coursemodel";
import { User } from "../../models/users/usermodel";
import { Register } from "../../models/registrations/registermodel";
import { ICourse, ICoursePopulated, IUser } from "../../config/env";

// new course
export const repNewCourse = async (req: Request, res: Response) => {
  const course_name = req.body;
  const info = req.query;
  try {
    const user: IUser | null = await User.findById((req as any).userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    info.name = course_name.name;
    const course: ICourse | null = await Course.create(info);
    await course.populate<{ students: IUser[] }>("students", "name email");
    return res.status(200).json(course);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// update course
export const repUpdateCourse = async (req: Request, res: Response) => {
  const { name } = req.params;
  const info = req.query;
  try {
    const user: IUser | null = await User.findById((req as any).userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    const course: ICourse | null = await Course.findOneAndUpdate(
      { name },
      info,
      {
        new: true,
      }
    ).populate<{ students: IUser[] }>("students", "name email");
    return res.status(400).json(course);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// delete course
export const repDeleteCourse = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const user: IUser | null = await User.findById((req as any).userId);
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    const deletedCourse = await Course.findOneAndDelete({ name });
    if (!deletedCourse)
      return res.status(400).json({ message: "this course dosent exists" });
    await User.updateMany(
      { students: user._id },
      { $pull: { students: user._id } }
    );
    await Register.deleteMany({
      course: deletedCourse._id,
    });
    await User.updateMany(
      { courses: deletedCourse._id },
      { $pull: { courses: deletedCourse._id } }
    );
    return res.status(200).json({ message: "Course deleted succuussfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show courses
export const repShowCourses = async (req: Request, res: Response) => {
  try {
    const courses: ICourse[] = await Course.find().populate<{
      students: IUser[];
    }>("students", "name email");
    if (courses.length === 0)
      return res.status(400).json({ message: "No course found" });
    return res.status(200).json(courses);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show one course
export const repShowOneCourse = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const course: ICourse[] | null = await Course.find({ name }).populate<{
      students: IUser[];
    }>("students", "name email");
    if (course.length === 0)
      return res.status(400).json({ message: "This course dosent exists" });
    return res.status(200).json(course);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
