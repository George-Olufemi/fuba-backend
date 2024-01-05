import {
  OkResponse,
  BadRequestException,
  logger,
  ValidationException,
} from '../../helper';
import { Role, learnersPayload } from '../../interface';
import { onboardingLearnerSchema } from '../../validations';
import User from '../../models/user.model';
import Utils from '../../utils/utils';
import { ValidationError } from 'joi';
import EmailHandlerService from '../../helper/email-handler';

const utilsService: Utils = new Utils();
const emailHandler: EmailHandlerService = new EmailHandlerService();

class SignUpAsLearnerService {
  public async signUpAsLearner(payload: learnersPayload): Promise<OkResponse> {
    try {
      await onboardingLearnerSchema.validateAsync(payload);

      const user = await User.findOne({ email: payload.email });

      if (!user) {
        const hashedPassword = await utilsService.hashPayload(payload.password);
        await User.create({
          fullName: payload.fullName,
          email: payload.email,
          password: hashedPassword,
          role: Role.Learner,
        });

        await this.sendVerificationMail(payload.email);
        return new OkResponse('Check email inbox for verification mail');
      }

      throw new BadRequestException('The provided email address is already in use.');
    } catch (err: any) {
      logger.error(err.message);

      if (err instanceof ValidationError) {
        throw new ValidationException(err.details[0].message);
      }

      throw err;
    }
  }

  private async sendVerificationMail(email: string): Promise<void> {
    const sendMail = await emailHandler.sendVerificationMail(email);
    if (!sendMail) {
      throw new BadRequestException(
        'An error occurred with our mailing service, kindly try again later',
      );
    }
  }
}

export default SignUpAsLearnerService;
