import { Request, Response } from "express";
import { Register } from "../../models/registrations/registermodel";
import { Course } from "../../models/courses/coursemodel";
import { User } from "../../models/users/usermodel";
import {
  ICourse,
  IRegister,
  IUser,
  IRegisterPopulated,
} from "../../config/env";
import { realpathSync } from "fs";
import { info } from "console";

// register new course
export const repRegister = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const user: IUser | null = await User.findById((req as any).userId);
    if (!user) return res.status(400).json({ message: "User dosent exist" });
    const course: ICourse | null = await Course.findOne({ name });
    if (!course)
      return res.status(400).json({ messgae: "course dosent exits" });
    const sameCourse = user.courses?.find((u) => {
      return String(u._id) === String(course._id);
    });
    if (sameCourse)
      return res
        .status(400)
        .json({ messsage: "You have registered for this course before" });
    user.courses?.push(course._id);
    course.students?.push(user._id);
    await user.save();
    await course.save();
    const info = { course: course._id, student: user._id };
    const registration: IRegister = await Register.create(info);
    const populatedRegister = await registration.populate([
      { path: "course", select: "name duration time status" },
      { path: "student", select: "name email" },
    ]);
    return res.status(200).json(populatedRegister);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// cancel registration
export const repCanselRegister = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const user: IUser | null = await User.findById((req as any).userId);
    if (!user) return res.status(400).json({ message: "User dosent exist" });
    const course: ICourse | null = await Course.findOne({ name });
    if (!course)
      return res.status(400).json({ messega: "This course dosent exists" });
    const deletedRegister = await Register.findOneAndDelete({
      course: course._id,
      student: user._id,
    });
    if (!deletedRegister)
      return res
        .status(400)
        .json({ message: "You haven't regitered for this course before" });
    user.courses = user.courses?.filter((u) => {
      return String(u._id) !== String(course._id);
    });
    await Course.updateMany(
      { students: user._id },
      { $pull: { students: user._id } }
    );
    await user.populate("courses", "name duration time status");
    await user.save();
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show registrations
export const repShowRegisters = async (req: Request, res: Response) => {
  try {
    const registers: IRegister[] = await Register.find().populate([
      { path: "course", select: "name duration time status" },
      { path: "student", select: "name email" },
    ]);
    if (registers.length === 0)
      return res.status(400).json({ message: "NO registers found" });
    return res.status(200).json(registers);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

// show one register
export const repShowOneRegister = async (req: Request, res: Response) => {
  const info = req.body;
  try {
    const user: IUser | null = await User.findOne({ name: info.username });
    if (!user) return res.status(400).json({ message: "User dosent exists" });
    const course: ICourse | null = await Course.findOne({
      name: info.coursename,
    });
    if (!course)
      return res.status(400).json({ message: "Course dosent exists" });
    const registers: IRegister[] = await Register.find({
      student: user._id,
      course: course._id,
    }).populate([
      { path: "course", select: "name duration time status" },
      { path: "student", select: "name email" },
    ]);
    if (registers.length === 0)
      return res.status(400).json({ message: "No registers found" });
    return res.status(200).json(registers);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
