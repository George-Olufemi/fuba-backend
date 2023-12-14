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
      return res.status(err.statusCode).json({
        status: false,
        error: 'NOT_FOUND',
        message: err.message,
      });
    }
    if (err instanceof BadRequestException) {
      return res.status(err.statusCode).json({
        status: false,
        error: 'BAD_REQUEST',
        message: err.message,
      });
    }
    if (err instanceof InternalServerException) {
      return res.status(err.statusCode).json({
        status: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message,
      });
    }
    if (err instanceof UnauthorizedException) {
      return res.status(err.statusCode).json({
        status: false,
        error: 'UNAUTHORIZED',
        message: err.message,
      });
    }
    if (err instanceof ForbiddenException) {
      return res.status(err.statusCode).json({
        status: false,
        error: 'FORBIDDEN_ERROR',
        message: err.message,
      });
    }
    if (err instanceof ConflictingException) {
      return res.status(err.statusCode).json({
        status: false,
        error: 'CONFLICTING_ERROR',
        message: err.message,
      });
    }
    if (err instanceof ValidationException) {
      return res.status(err.statusCode).json({
        status: false,
        error: 'VALIDATION_ERROR',
        message: err.message,
      });
    }
    if (err instanceof RedirectException) {
      return res.redirect(err.statusCode, err.redirectUrl);
    }
    // If the error is not one of the custom error classes, handle it as a generic internal server error
    logger.error(err);
    return res.status(Httpcode.INTERNAL_SERVER_ERROR).json({
      status: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while processing your request. Please try again later.',
    });
  }
}

export default CustomErrorHandler;
