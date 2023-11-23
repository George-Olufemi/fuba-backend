import {
  logger,
  ValidationException,
  Httpcode,
  BadRequestException,
  OkResponse,
  NotFoundException,
  ForbiddenException,
} from '../helper';
import { ValidationError } from 'joi';
import { onboardingLearnerSchema, onboardingTutorSchema } from '../validations';
import { tutorsPayload, Position, learnersPayload } from '../interface';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import EmailHandlerService from '../helper/email-handler';
import UtilsService from '../helper/utils';
import { JwtPayload } from 'jsonwebtoken';

const emailHandler: EmailHandlerService = new EmailHandlerService();
const utilsService: UtilsService = new UtilsService();

class AuthService {
  public async signUpAsTutor(payload: tutorsPayload): Promise<OkResponse> {
    try {
      await onboardingTutorSchema.validateAsync(payload);
      const user = await User.findOne({ email: payload.email });
      if (!user) {
        const hashedPassword = await this.hashPassword(payload.password);
        await User.create({
          fullName: payload.fullName,
          email: payload.email,
          picture: payload.picture,
          password: hashedPassword,
          position: Position.Tutor,
        });
        await this.sendVerificationMail(payload.email);
        return new OkResponse('Check provided email inbox for verification mail');
      }
      throw new BadRequestException({
        httpCode: Httpcode.BAD_REQUEST,
        description: 'User with email already exist',
      });
    } catch (err: any) {
      logger.error(err.message);
      if (err instanceof ValidationError) {
        throw new ValidationException({
          httpCode: Httpcode.VALIDATION_ERROR,
          description: err.details[0].message,
        });
      }
      throw err;
    }
  }

  public async signUpAsLearner(payload: learnersPayload): Promise<OkResponse> {
    try {
      await onboardingLearnerSchema.validateAsync(payload);
      const user = await User.findOne({ email: payload.email });
      if (!user) {
        const hashedPassword = await this.hashPassword(payload.password);
        await User.create({
          fullName: payload.fullName,
          email: payload.email,
          password: hashedPassword,
          position: Position.Learner,
        });
        await this.sendVerificationMail(payload.email);
        return new OkResponse('Check provided email inbox for verification mail');
      }
      throw new BadRequestException({
        httpCode: Httpcode.BAD_REQUEST,
        description: 'User with email already exist',
      });
    } catch (err: any) {
      logger.error(err.message);
      if (err instanceof ValidationError) {
        throw new ValidationException({
          httpCode: Httpcode.VALIDATION_ERROR,
          description: err.details[0].message,
        });
      }
      throw err;
    }
  }

  public async signIn(payload: any) {
    return 'This is the login service';
  }

  public async verifyUserEmail(token: string): Promise<boolean> {
    try {
      const userToken = (await utilsService.validateVerificationToken(token)) as JwtPayload;
      if (Date.now() > userToken.exp! * 1000) {
        throw new BadRequestException({
          httpCode: Httpcode.BAD_REQUEST,
          description: 'Token expired, kindly request for another verification link',
        });
      }
      const user = await User.findOne({ email: userToken.email });
      if (!user) {
        throw new NotFoundException({
          httpCode: Httpcode.NOT_FOUND,
          description: 'User was not found'
        });
      }
      if (user.isEmailVerified == true) {
        throw new ForbiddenException({
          httpCode: Httpcode.FORBIDDEN,
          description: 'This email address has been validated'
        });
      }

      await User.findOneAndUpdate(
        { email: userToken.email },
        { isEmailVerified: true },
        { new: true }
      );
      
      return true;

    } catch(err:any) {
      logger.error(err.message);
      if (err instanceof ValidationError) {
        throw new ValidationException({
          httpCode: Httpcode.VALIDATION_ERROR,
          description: err.details[0].message,
        });
      }
      throw err;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = Number(process.env.SALT);
    return await bcrypt.hash(password, salt);
  }

  private async sendVerificationMail(email: string): Promise<void> {
    const sendMail = await emailHandler.sendVerificationMail(email);
    if (!sendMail) {
      throw new BadRequestException({
        httpCode: Httpcode.BAD_REQUEST,
        description: 'An error occured with our mailing service, kindly try again later',
      });
    }
  }
}

export default AuthService;
