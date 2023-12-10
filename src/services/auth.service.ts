import {
  logger,
  ValidationException,
  Httpcode,
  BadRequestException,
  OkResponse,
  NotFoundException,
  ForbiddenException,
  ConflictingException,
} from '../helper';
import { ValidationError } from 'joi';
import {
  onboardingLearnerSchema,
  onboardingTutorSchema,
  signInSchema,
} from '../validations';
import { tutorsPayload, Role, learnersPayload, signInPayload } from '../interface';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import EmailHandlerService from '../helper/email-handler';
import TokenService from '../helper/token';
import { JwtPayload } from 'jsonwebtoken';

const emailHandler: EmailHandlerService = new EmailHandlerService();
const tokenService: TokenService = new TokenService();

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
          role: Role.Tutor,
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
          role: Role.Learner,
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

  public async signIn(payload: signInPayload) {
    try {
      await signInSchema.validateAsync(payload);
      const user = await User.findOne({ email: payload.email });
      if (!user) {
        throw new NotFoundException({
          httpCode: Httpcode.NOT_FOUND,
          description:
            'User with email address does not exist, check email and try again',
        });
      }
      if (user.isEmailVerified != true) {
        throw new BadRequestException({
          httpCode: Httpcode.BAD_REQUEST,
          description:
            'Email address is not verified, kindly verify email address and try again',
        });
      }
      const isPasswordValid = await this.dehashPassword(payload.password, user.password);
      if (!isPasswordValid) {
        throw new ConflictingException({
          httpCode: Httpcode.CONFLICTING_ERROR,
          description: 'Incorrect password, check password and try again',
        });
      }

      const tokenArgs = { id: user._id, email: user.email };
      const accessToken = await tokenService.generateAccessToken(tokenArgs);

      return new OkResponse('User role and access token provided', { role: user.role, accessToken });
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

  public async verifyUserEmail(token: string): Promise<boolean> {
    try {
      const userToken = (await tokenService.validateVerificationToken(
        token,
      )) as JwtPayload;
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
          description: 'User was not found',
        });
      }
      if (user.isEmailVerified == true) {
        throw new ForbiddenException({
          httpCode: Httpcode.FORBIDDEN,
          description: 'This email address has been validated',
        });
      }

      await User.findOneAndUpdate(
        { email: userToken.email },
        { isEmailVerified: true },
        { new: true },
      );

      return true;
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

  private async hashPassword(password: string): Promise<string> {
    const salt = Number(process.env.SALT);
    return await bcrypt.hash(password, salt);
  }

  private async dehashPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
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
