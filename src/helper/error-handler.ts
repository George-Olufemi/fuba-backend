export enum Httpcode {
  REDIRECT = 302,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICTING_ERROR = 409,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER_ERROR = 500,
}

interface ErrorMsgArgs {
  name?: string;
  httpCode: Httpcode;
  description: string;
}

class NotFoundException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = Httpcode.NOT_FOUND;
  }
}

class UnauthorizedException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = Httpcode.UNAUTHORIZED;
  }
}

class InternalServerException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = Httpcode.INTERNAL_SERVER_ERROR;
  }
}

class BadRequestException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = Httpcode.BAD_REQUEST;
  }
}

class ForbiddenException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = Httpcode.FORBIDDEN;
  }
}

class ConflictingException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = Httpcode.CONFLICTING_ERROR;
  }
}

class ValidationException extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = Httpcode.VALIDATION_ERROR;
  }
}

class RedirectException extends Error {
  statusCode: number;
  redirectUrl: string;

  constructor(description: string, redirectUrl: string) {
    super(description);
    this.name = 'Redirect Exception';
    this.statusCode = Httpcode.REDIRECT;
    this.redirectUrl = redirectUrl;
  }
}

export {
  NotFoundException,
  UnauthorizedException,
  InternalServerException,
  BadRequestException,
  ForbiddenException,
  ConflictingException,
  ValidationException,
  RedirectException,
};
