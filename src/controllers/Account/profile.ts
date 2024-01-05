import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import ProfileService from '../../services/Account/profile';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const profileService: ProfileService = new ProfileService();

class ProfileController {
  public async getProfileInfo(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userID = req.user?._id;
      const response = await profileService.getProfileInfo(userID);
      return res.status(200).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}

export default ProfileController;
