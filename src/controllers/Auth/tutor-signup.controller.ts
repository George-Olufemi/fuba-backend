import { Request, Response } from 'express';
import { CloudinaryService } from '../../helper/cloudinary';
import { ForbiddenException } from '../../helper';
import CustomErrorHandler from '../../helper/custom-error-handler';
import Utils from '../../utils/utils';
import { SignUpAsTutorService } from '../../services';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const utilsService: Utils = new Utils();
const cloudinaryService: CloudinaryService = new CloudinaryService();
const signUpAsTutorService: SignUpAsTutorService = new SignUpAsTutorService();

export class SignUpAsTutorController {
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
          throw new ForbiddenException(
            'Invalid file type. Only images (JPEG, JPG, PNG) are allowed.',
          );
        }

        const cloudinaryResponse: any = await cloudinaryService.upload(filePath, folder, {
          resource_type: 'image',
          public_id: fileName,
        });

        req.body.picture = cloudinaryResponse.secure_url;
      } else if (typeof req.body.picture === 'string') {
        profileImgUrl = req.body.picture;
      }

      const response = await signUpAsTutorService.signUpAsTutor(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}
