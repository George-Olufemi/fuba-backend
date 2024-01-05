import mongoose, { Schema } from 'mongoose';
import { IUser, Role } from '../interface';

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    picture: { type: String },
    role: {
      type: String,
      enum: Role,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

const user = mongoose.model<IUser>('User', UserSchema);
export default user;
