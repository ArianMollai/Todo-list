import mongoose, { Schema, Model } from 'mongoose';
import { IRegister } from '../../types/register/types.register';

const registerSchema: Schema = new Schema<IRegister>({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'courses',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Register: Model<IRegister> = mongoose.model<IRegister>(
  'registrations',
  registerSchema,
);
