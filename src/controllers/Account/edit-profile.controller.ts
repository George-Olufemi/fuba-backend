import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import { EditProfileService } from '../../services';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const editProfileService: EditProfileService = new EditProfileService();

export class EditProfileController {
  public async editProfile(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user?._id;
      const response = await editProfileService.editProfile(userId, req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}
