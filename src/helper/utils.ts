import jwt from 'jsonwebtoken';
import { InternalServerException, Httpcode, BadRequestException } from './error-handler';
import { logger } from './logger';
import * as dotenv from 'dotenv';
dotenv.config();

const isLocalEnv = process.env.NODE_ENV === 'Develop';
const url = isLocalEnv ? 'http://localhost:8080' : process.env.BASE_URL || '';

class UtilsService {
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
}

export default UtilsService;
