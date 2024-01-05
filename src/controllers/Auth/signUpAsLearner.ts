import { Request, Response } from 'express';
import CustomErrorHandler from '../../helper/custom-error-handler';
import SignUpAsLearner from '../../services/Auth/signUpAsLearner';

const customErrorHandler: CustomErrorHandler = new CustomErrorHandler();
const signUpAsLearner: SignUpAsLearner = new SignUpAsLearner();

class SignUpAsLearnerController {
  public async onboardingLearner(req: Request, res: Response) {
    try {
      const response = await signUpAsLearner.signUpAsLearner(req.body);
      return res.status(201).json(response);
    } catch (err: any) {
      return await customErrorHandler.handleCustomError(err, res);
    }
  }
}

export default SignUpAsLearnerController;
