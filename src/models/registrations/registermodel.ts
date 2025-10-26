import mongoose, { Schema, Document, Model } from "mongoose";
import { IRegister } from "../../config/env";

const registerSchema: Schema = new Schema<IRegister>({
  student: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Register: Model<IRegister> = mongoose.model<IRegister>(
  "registrations",
  registerSchema
);
