import mongoose, { Schema } from 'mongoose';
import { IUser, Position } from '../interface';

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
    position: {
      type: String,
      enum: Position,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const user = mongoose.model<IUser>('User', UserSchema);
export default user;
