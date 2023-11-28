import AuthService from '../services/auth.service';
import CustomErrorHandler from '../helper/custom-error-handler';
import { Request, Response } from 'express';

const authService: AuthService = new AuthService();
const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();

class AuthController {
  public async onboardingTutor(req: Request, res: Response) {
    try {
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
