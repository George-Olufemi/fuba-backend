import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import { ProfileService } from '../../services';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const profileService: ProfileService = new ProfileService();

export class GetProfileController {
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
