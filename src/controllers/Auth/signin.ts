import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import SignInService from '../../services/Auth/signin';

const signInService: SignInService = new SignInService();
const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();

class SignInController {
  public async login(req: Request, res: Response) {
    try {
      const response = await signInService.signIn(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}

export default SignInController;
