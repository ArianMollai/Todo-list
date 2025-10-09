import mongoose, { Schema, Document, Model } from "mongoose";
import { ICourse, IUser } from "../config/env";

/* export interface ICourse extends Document {
  name: string;
  duration: string;
  time: string;
  status: string;
}

export interface IUser extends Document {
  name: String;
  email: String;
  password: String;
  refreshtoken: String;
  courses: Course[];
} */

const coursesSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Enter the course name:"],
    default: "undifined",
  },
  duration: {
    type: String,
    required: true,
    default: "0 M",
  },
  time: {
    type: String,
    required: true,
    default: "00:00",
  },
  status: {
    type: String,
    required: true,
    default: "not active",
  },
});

const userSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    requierd: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    requierd: true,
  },
  refreshtoken: {
    type: String,
    default: null,
  },
  courses: {
    type: [
      {
        name: { type: String },
        time: { type: String },
        duration: { type: String },
        status: { type: String },
      },
    ],
    default: [],
  },
});

export const Courses: Model<ICourse> = mongoose.model<ICourse>(
  "courses",
  coursesSchema
);
export const Users: Model<IUser> = mongoose.model<IUser>("users", userSchema);

//export default courses;
