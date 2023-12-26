import {
  OkResponse,
  BadRequestException,
  logger,
  ValidationException,
} from '../../helper';
import { tutorsPayload, Role, learnersPayload } from '../../interface';
import { onboardingTutorSchema, onboardingLearnerSchema } from '../../validations';
import User from '../../models/user.model';
import Utils from '../../utils/utils';
import { ValidationError } from 'joi';
import EmailHandlerService from '../../helper/email-handler';

const utilsService: Utils = new Utils();
const emailHandler: EmailHandlerService = new EmailHandlerService();

class RegisterService {
  public async signUpAsTutor(payload: tutorsPayload): Promise<OkResponse> {
    try {
      await onboardingTutorSchema.validateAsync(payload);

      const user = await User.findOne({ email: payload.email });

      if (user) {
        throw new BadRequestException(
          'An account associated with the provided email address already exist.',
        );
      }

      const hashedPassword = await utilsService.hashPayload(payload.password);

      const newUser = await User.create({
        fullName: payload.fullName,
        email: payload.email,
        picture: payload.picture,
        password: hashedPassword,
        role: Role.Tutor,
      });

      if (newUser) {
        await this.sendVerificationMail(payload.email);
        return new OkResponse('Check inbox for verification mail');
      }
    } catch (err: any) {
      logger.error(err.message);

      if (err instanceof ValidationError) {
        throw new ValidationException(err.details[0].message);
      }

      throw err;
    }
  }

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
        'An error occured with our mailing service, kindly try again later',
      );
    }
  }
}

export default RegisterService;
