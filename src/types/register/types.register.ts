import { Types, Document } from 'mongoose';
import { ICourse } from '../course/types.course';
import { IUser } from '../user/types.user';

export interface IRegister extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  date: Date;
}

export interface IRegisterPopulated
  extends Omit<IRegister, 'course' | 'student'> {
  course: ICourse;
  student: IUser;
}
