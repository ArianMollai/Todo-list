import dotenv from "dotenv";
import { Types, Document } from "mongoose";
dotenv.config();

interface Env {
  PORT: number;
  MONGO_URI: string;
  ACCESS_TOKEN_SECRET: string | undefined;
  REFRESH_TOKEN_SECRET: string | undefined;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  refreshtoken?: string | null;
  courses?: (Types.ObjectId | ICourse)[];
}

export interface ICourse extends Document {
  _id: Types.ObjectId;
  name: string;
  time: string;
  duration: string;
  status: string;
  students?: (Types.ObjectId | IUser)[];
}

export interface IRegister extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  date: Date;
}

export const env: Env = {
  PORT: Number(process.env.PORT) || 3000,
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://armollaie82_db_user:31FdW05ReWaDRo7g@courses.qesxmpj.mongodb.net/?retryWrites=true&w=majority&appName=courses",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

export interface ICoursePopulated extends Omit<ICourse, "students"> {
  students: IUser[];
}

export interface IUserPopulated extends Omit<IUser, "courses"> {
  courses: ICourse[];
}

export interface IRegisterPopulated
  extends Omit<IRegister, "course" | "student"> {
  course: ICourse;
  student: IUser;
}
