import { Types, Document } from 'mongoose';
import { IUser } from '../user/types.user';

export interface ICourse extends Document {
  _id: Types.ObjectId;
  name: string;
  time: string;
  duration: string;
  status: string;
  students?: (Types.ObjectId | IUser)[];
}

export interface ICoursePopulated extends Omit<ICourse, 'students'> {
  students: IUser[];
}

export interface courseUpdatedInfo extends Document {
  name?: string;
  duration?: string;
  time?: string;
  status?: string;
}
