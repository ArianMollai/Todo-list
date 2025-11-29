import mongoose, { Schema, Model } from 'mongoose';
import { ICourse } from '../../types/course/types.course';

const coursesSchema: Schema = new Schema<ICourse>({
  name: {
    type: String,
    required: [true, 'Enter the course name:'],
    minLength: [1, 'Name is required'],
  },
  duration: {
    type: String,
    required: true,
    default: '0 M',
  },
  time: {
    type: String,
    required: true,
    default: '00:00',
  },
  status: {
    type: String,
    required: true,
    default: 'not active',
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
});

export const Course: Model<ICourse> = mongoose.model<ICourse>(
  'courses',
  coursesSchema,
);
