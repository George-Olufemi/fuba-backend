import { NotFoundException, OkResponse, logger } from '../../helper';
import { Types } from 'mongoose';
import User from '../../models/user.model';

class ProfileService {
  public async getProfileInfo(userID: Types.ObjectId) {
    const omittedFields: string = '-password -createdAt -updatedAt -__v';
    const user = await User.findById({ _id: userID }).select(omittedFields);
    if (!user) throw new NotFoundException('User with provided ID was not found');
    try {
      return new OkResponse('Profile Information', user);
    } catch (err: any) {
      logger.error(err.message);
      throw err;
    }
  }
}

export default ProfileService;
