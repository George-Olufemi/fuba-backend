import { Types } from 'mongoose';

export enum Position {
    Tutor = 'Tutor',
    Learner = 'Learner'
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    isEmailVerified: boolean;
    password: string;
    picture: string;
    position: Position;
}