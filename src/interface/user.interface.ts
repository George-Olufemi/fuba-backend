import { Types } from 'mongoose';

export enum Role {
  Tutor = 'Tutor',
  Learner = 'Learner',
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  picture: string;
  role: Role;
  course: Types.ObjectId;
}

export interface tutorsPayload {
  fullName: string;
  email: string;
  picture: string;
  password: string;
  confirmPassword: string;
}

export interface learnersPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface signInPayload {
  email: string;
  password: string;
}
