import { Types, Document } from 'mongoose';
import { ICourse } from '../course/types.course';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  refreshtoken?: string | null;
  courses?: (Types.ObjectId | ICourse)[];
}

export interface IUserPopulated extends Omit<IUser, 'courses'> {
  courses: ICourse[];
}

export interface updatedUserInfo extends Document {
  name?: string;
  email?: string;
  password?: string;
}
