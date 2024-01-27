import { NotFoundException, OkResponse, logger } from '../../helper';
import { Types } from 'mongoose';
import User from '../../models/user.model';

export class ProfileService {
  public async getProfileInfo(userID: Types.ObjectId) {
    const omittedFields: string = '-password -__v';
    const user = await User.findById(userID).select(omittedFields);
    if (!user) throw new NotFoundException('User not found');
    try {
      return new OkResponse('Profile information', user);
    } catch (err: any) {
      logger.error(err.message);
      throw err;
    }
  }
}
