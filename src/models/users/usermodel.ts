import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../../types/user/types.user';

const userSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [1, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'invalid email format'],
  },
  password: {
    type: String,
    minLength: [4, 'password must at least be 4 characters'],
    required: [true, 'password is required'],
  },
  refreshtoken: {
    type: String,
    default: null,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'courses',
    },
  ],
});

export const User: Model<IUser> = mongoose.model<IUser>('users', userSchema);
