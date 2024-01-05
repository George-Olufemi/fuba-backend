import {
  NotFoundException,
  BadRequestException,
  ConflictingException,
  OkResponse,
  logger,
  ValidationException,
} from '../../helper';
import { signInPayload } from '../../interface';
import { signInSchema } from '../../validations';
import User from '../../models/user.model';
import Utils from '../../utils/utils';
import TokenService from '../../helper/token';
import { ValidationError } from 'joi';

const utilsService: Utils = new Utils();
const tokenService: TokenService = new TokenService();

class SignInService {
  public async signIn(payload: signInPayload) {
    const omittedFields: string = '-createdAt -updatedAt -__v +password';
    try {
      await signInSchema.validateAsync(payload);

      const user = await User.findOne({ email: payload.email }).select(omittedFields);

      if (!user) {
        throw new NotFoundException('User not found, check email and try again.');
      }

      if (!user.isEmailVerified) {
        throw new BadRequestException('Email address is not verified');
      }

      const isPasswordValid = await utilsService.dehashPayload(
        payload.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new ConflictingException(
          'Incorrect email or password, check fields and try again.',
        );
      }

      const tokenArgs = { id: user._id, email: user.email };
      const accessToken = await tokenService.generateAccessToken(tokenArgs);

      return new OkResponse('Access token generated', {
        user,
        accessToken,
      });
    } catch (err: any) {
      logger.error(err.message);

      if (err instanceof ValidationError) {
        throw new ValidationException(err.details[0].message);
      }

      throw err;
    }
  }
}

export default SignInService;
