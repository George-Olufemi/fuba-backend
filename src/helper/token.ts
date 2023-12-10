import jwt, { TokenExpiredError } from 'jsonwebtoken';
import {
  InternalServerException,
  Httpcode,
  BadRequestException,
  ConflictingException,
} from './error-handler';
import { logger } from './logger';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
dotenv.config();

const isLocalEnv = process.env.NODE_ENV === 'Develop';
const url = isLocalEnv ? 'http://localhost:8070' : process.env.BASE_URL || '';

interface TokenArgs {
  id: Types.ObjectId;
  email: string;
}

class TokenService {
  public async generateVerificationToken(email: string): Promise<string> {
    try {
      const jwtSecret = process.env.JWT_SECRET as string;
      const TTL = '20min';
      if (!jwtSecret) {
        throw new InternalServerException({
          httpCode: Httpcode.INTERNAL_SERVER_ERROR,
          description: 'JWT secret is not configured',
        });
      }
      const token = jwt.sign({ email }, jwtSecret, { expiresIn: TTL });
      if (!token) {
        throw new BadRequestException({
          httpCode: Httpcode.BAD_REQUEST,
          description: 'Failed to generate verification token',
        });
      }
      const verificationLink = `${url}/api/auth/activate-account/${token}`;
      return verificationLink;
    } catch (err: any) {
      logger.error(err.message);
      throw new InternalServerException({
        httpCode: Httpcode.INTERNAL_SERVER_ERROR,
        description: 'An unexpected error occured, try again in two minutes',
      });
    }
  }

  public async validateVerificationToken(
    token: string,
  ): Promise<string | jwt.JwtPayload> {
    try {
      const jwtSecret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (err: any) {
      logger.error(`Failed to validate token: ${err.message}`);
      if (err instanceof TokenExpiredError) {
        throw new BadRequestException({
          httpCode: Httpcode.BAD_REQUEST,
          description: 'Token has expired',
        });
      }
      throw new InternalServerException({
        httpCode: Httpcode.INTERNAL_SERVER_ERROR,
        description: 'An unexpected error occured, try again in two minutes',
      });
    }
  }

  public async generateAccessToken(tokenArg: TokenArgs): Promise<string> {
    try {
      const jwtSecret = process.env.JWT_SECRET as string;
      if (!jwtSecret) {
        throw new InternalServerException({
          httpCode: Httpcode.INTERNAL_SERVER_ERROR,
          description: 'JWT secret is not configured',
        });
      }
      const token = jwt.sign(tokenArg, jwtSecret, { expiresIn: '60min' });
      if (!token) {
        throw new ConflictingException({
          httpCode: Httpcode.CONFLICTING_ERROR,
          description: 'Failed to generate token',
        });
      }
      return token;
    } catch (err: any) {
      logger.error(err.message);
      throw new InternalServerException({
        httpCode: Httpcode.INTERNAL_SERVER_ERROR,
        description: 'An unexpected error occured, try again in two minutes',
      });
    }
  }
}

export default TokenService;
