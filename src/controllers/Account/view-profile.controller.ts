import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import { ViewProfileService } from '../../services';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const viewProfileService: ViewProfileService = new ViewProfileService();

export class GetProfileController {
  public async getProfileInfo(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userID = req.user?._id;
      const response = await viewProfileService.getProfileInfo(userID);
      return res.status(200).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}
