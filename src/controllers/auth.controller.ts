import AuthService from '../services/auth.service';
import CustomErrorHandler from '../helper/custom-error-handler';
import { Request, Response } from 'express';
import Utils from '../utils/utils';
import { ForbiddenException, Httpcode } from '../helper';
import Cloudinary from '../helper/cloudinary';

const authService: AuthService = new AuthService();
const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const utilsService: Utils = new Utils();
const cloudinaryService: Cloudinary = new Cloudinary();

class AuthController {
  public async onboardingTutor(req: Request, res: Response) {
    try {
      let profileImgUrl: string;
      const allowedImageTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

      if (req.file) {
        const fileName: string = await utilsService.randomFileName();
        const folder: string = 'Images';
        const filePath: Buffer = req.file.buffer;
        const mimeType: string = req.file.mimetype;

        if (!allowedImageTypes.includes(mimeType)) {
          throw new ForbiddenException({
            httpCode: Httpcode.FORBIDDEN,
            description: 'Invalid file type. Only images (JPEG, JPG, PNG) are allowed.',
          });
        }

        const cloudinaryResponse: any = await cloudinaryService.uploadImageToCloud(
          filePath,
          folder,
          {
            resource_type: 'image',
            public_id: fileName,
          },
        );

        req.body.picture = cloudinaryResponse.secure_url;
      } else if (typeof req.body.picture === 'string') {
        profileImgUrl = req.body.picture;
      }

      const response = await authService.signUpAsTutor(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }

  public async onboardingLearner(req: Request, res: Response) {
    try {
      const response = await authService.signUpAsLearner(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const response = await authService.signIn(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }

  public async verifyUserEmail(req: Request, res: Response) {
    const emailVerificationFailPlaceholder: string =
      'https://global.discourse-cdn.com/auth0/original/3X/9/e/9e5239a51247ab46defa4564bacdc319efb6fb5d.png';
    const emailVerificationSuccessPlaceholder: string =
      'https://supertokens.com/img/email-verification-success.png';
    try {
      const token = req.params.userToken;
      const response = await authService.verifyUserEmail(token);
      if (response !== true) {
        return res.status(403).redirect(emailVerificationFailPlaceholder); // TODO: Use FUBA email not verified page
      } else {
        return res.status(200).redirect(emailVerificationSuccessPlaceholder); // TODO: Redirect user to login page
      }
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}

export default AuthController;
