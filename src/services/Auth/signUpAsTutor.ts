import {
  OkResponse,
  BadRequestException,
  logger,
  ValidationException,
} from '../../helper';
import { tutorsPayload, Role } from '../../interface';
import { onboardingTutorSchema } from '../../validations';
import User from '../../models/user.model';
import Utils from '../../utils/utils';
import { ValidationError } from 'joi';
import EmailHandlerService from '../../helper/email-handler';

const utilsService: Utils = new Utils();
const emailHandler: EmailHandlerService = new EmailHandlerService();

class SignUpAsTutorService {
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

  private async sendVerificationMail(email: string): Promise<void> {
    const sendMail = await emailHandler.sendVerificationMail(email);
    if (!sendMail) {
      throw new BadRequestException(
        'An error occurred with our mailing service, kindly try again later',
      );
    }
  }
}

export default SignUpAsTutorService;
