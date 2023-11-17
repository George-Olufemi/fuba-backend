import { Response } from 'express';
import {
  NotFoundException,
  Httpcode,
  BadRequestException,
  InternalServerException,
  UnauthorizedException,
  ForbiddenException,
  ConflictingException,
  ValidationException,
  RedirectException,
} from './error-handler';
import { logger } from './logger';

class CustomErrorHandler {
  async handleCustomError(err: any, res: Response) {
    if (err instanceof NotFoundException) {
      return res.status(Httpcode.NOT_FOUND).json({
        StatusCode: err.statusCode,
        Message: err.message,
      });
    }
    if (err instanceof BadRequestException) {
      return res.status(err.statusCode).json({
        StatusCode: err.statusCode,
        Message: err.message,
      });
    }
    if (err instanceof InternalServerException) {
      return res.status(Httpcode.INTERNAL_SERVER_ERROR).json({
        StatusCode: err.statusCode,
        Message: err.message,
      });
    }
    if (err instanceof UnauthorizedException) {
      return res.status(Httpcode.UNAUTHORIZED).json({
        StatusCode: err.statusCode,
        Message: err.message,
      });
    }
    if (err instanceof ForbiddenException) {
      return res.status(Httpcode.FORBIDDEN).json({
        StatusCode: err.statusCode,
        Message: err.message,
      });
    }
    if (err instanceof ConflictingException) {
      return res.status(Httpcode.CONFLICTING_ERROR).json({
        StatusCode: err.statusCode,
        Message: err.message,
      });
    }
    if (err instanceof ValidationException) {
      return res.status(Httpcode.VALIDATION_ERROR).json({
        StatusCode: err.statusCode,
        Message: err.message,
      });
    }
    if (err instanceof RedirectException) {
      return res.redirect(err.statusCode, err.redirectUrl);
    }
    // If the error is not one of the custom error classes, handle it as a generic internal server error
    logger.error(err);
    return res.status(Httpcode.INTERNAL_SERVER_ERROR).json({
      StatusCode: Httpcode.INTERNAL_SERVER_ERROR,
      Message: 'An error occurred while processing your request. Please try again later.',
    });
  }
}

export default CustomErrorHandler;
