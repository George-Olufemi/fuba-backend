import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import VerifyEmailService from '../../services/Auth/verifyEmail.service';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const verifyEmailService: VerifyEmailService = new VerifyEmailService();

class VerifyEmailController {
  public async verifyUserEmail(req: Request, res: Response) {
    const emailVerificationFailPlaceholder: string =
      'https://global.discourse-cdn.com/auth0/original/3X/9/e/9e5239a51247ab46defa4564bacdc319efb6fb5d.png';
    const emailVerificationSuccessPlaceholder: string = 'https://fuba.vercel.app/login';
    try {
      const token = req.params.userToken;
      const response = await verifyEmailService.verifyUserEmail(token);
      if (response !== true) {
        return res.status(403).redirect(emailVerificationFailPlaceholder); // TODO: Use FUBA email not verified page
      } else {
        return res.status(200).redirect(emailVerificationSuccessPlaceholder);
      }
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}

export default VerifyEmailController;
