import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  name: string;
  duration: string;
  time: string;
  status: string;
}

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

const courses: Model<ICourse> = mongoose.model<ICourse>(
  "courses",
  coursesSchema
);

export default courses;
