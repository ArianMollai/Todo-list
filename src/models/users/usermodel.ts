import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../../config/env";
import { ref } from "process";

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
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "courses",
    },
  ],
});

export const User: Model<IUser> = mongoose.model<IUser>("users", userSchema);
