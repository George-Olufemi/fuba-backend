import { JwtPayload } from 'jsonwebtoken';
import {
  BadRequestException,
  ForbiddenException,
  logger,
  ValidationException,
  NotFoundException,
} from '../../helper';
import TokenService from '../../helper/token';
import User from '../../models/user.model';
import { ValidationError } from 'joi';

const tokenService: TokenService = new TokenService();

class VerifyEmailService {
  public async verifyUserEmail(token: string): Promise<boolean> {
    try {
      const userToken = (await tokenService.validateVerificationToken(
        token,
      )) as JwtPayload;

      if (Date.now() > userToken.exp! * 1000) {
        throw new BadRequestException(
          'Token expired, kindly request for another verification link',
        );
      }

      const user = await User.findOne({ email: userToken.email });

      if (!user) {
        throw new NotFoundException('User associated with token does not exist.');
      }

      if (user.isEmailVerified == true) {
        throw new ForbiddenException(
          'The provided email address has been validated, kindly navigate to sign in route.',
        );
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
        throw new ValidationException(err.details[0].message);
      }
      throw err;
    }
  }
}

export default VerifyEmailService;
