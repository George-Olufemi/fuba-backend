import AuthService from '../services/auth.service';
import CustomErrorHandler from '../helper/custom-error-handler';
import { Request, Response } from 'express';

const authService: AuthService = new AuthService();
const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();

class AuthController {
  public async onboardingTutor(_req: Request, res: Response) {
    try {
      const response = await authService.signUpAsTutor();
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }

  public async onboardingLearner(_req: Request, res: Response) {
    try {
      const response = await authService.signUpAsLearner();
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }

  public async login(_req: Request, res: Response) {
    try {
      const response = await authService.signIn();
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}

export default AuthController;
