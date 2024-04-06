import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { IUser, Role } from '../interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Httpcode } from '../helper';

const JWT_SECRET = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      // @ts-ignore
      user?: IUser;
    }
  }
}

export class ProtectMiddleware {
  public async authorize(req: Request, res: Response, next: NextFunction) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await User.findOne({ _id: decoded.id });
        if (!user) {
          return res.status(Httpcode.UNAUTHORIZED).json({
            status: false,
            error: 'UNAUTHORIZED',
            message: 'User not found based on the provided token.',
          });
        }
        req.user = user;
        next();
      } catch (err: any) {
        return res.status(Httpcode.UNAUTHORIZED).json({
          status: false,
          error: 'UNAUTHORIZED',
          message: 'Invalid Token',
        });
      }
    }

    if (!token) {
      return res.status(Httpcode.UNAUTHORIZED).json({
        status: false,
        error: 'UNAUTHORIZED',
        message: 'Not authorized, no token',
      });
    }
  }

  public async requireTutorRole(req: Request, res: Response, next: NextFunction) {
    const userRole = req.user?.role;

    if (userRole !== Role.Tutor) {
      return res.status(Httpcode.FORBIDDEN).json({
        status: false,
        error: 'FORBIDDEN',
        message: 'Only tutors are allowed to access this resource.',
      });
    }
    next();
  }
}
