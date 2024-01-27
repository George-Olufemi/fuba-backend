import User from '../../models/user.model';
import {
  BadRequestException,
  logger,
  OkResponse,
  ValidationException,
} from '../../helper';
import { Types } from 'mongoose';
import { editProfileSchema } from '../../validations';
import { editProfilePayload } from '../../interface';
import { ValidationError } from 'joi';

export class EditProfileService {
  public async editProfile(userId: Types.ObjectId, payload: editProfilePayload) {
    if (!payload) throw new BadRequestException('Missing attribute');
    try {
      await editProfileSchema.validateAsync(payload);

      const user = await User.findByIdAndUpdate(userId, {
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber,
        bio: payload.bio,
        address: payload.address,
      });

      if (!user) throw new BadRequestException('An unexpected error occurred');

      return new OkResponse('Profile updated successfully');
    } catch (err: any) {
      console.log(err);

      logger.info(err.message);

      if (err instanceof ValidationError) {
        throw new ValidationException(err.details[0].message);
      }

      throw err;
    }
  }
}
