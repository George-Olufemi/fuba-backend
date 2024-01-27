import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import { SignUpAsLearnerService } from '../../services';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const learnerSignupController: SignUpAsLearnerService = new SignUpAsLearnerService();

export class SignUpAsLearnerController {
  public async onboardingLearner(req: Request, res: Response) {
    try {
      const response = await learnerSignupController.signUpAsLearner(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}
