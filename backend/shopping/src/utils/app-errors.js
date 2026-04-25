// utils/app-errors.js (shopping service)
const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 401,
  FORBIDDEN: 403,
  // fixed: 403 is Forbidden, 401 is Unauthorised — both added
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  constructor(name, statusCode, description, isOperational, errorStack, logingErrorResponse) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack || null;
    this.logError = logingErrorResponse || false;
    Error.captureStackTrace(this, this.constructor);
    // fixed: missing second arg meant constructor appeared in stack trace
  }
}

class APIError extends AppError {
  constructor(name, statusCode = STATUS_CODES.INTERNAL_ERROR, description = 'Internal Server Error', isOperational = true) {
    super(name, statusCode, description, isOperational);
  }
}

class BadRequestError extends AppError {
  constructor(description = 'Bad request', logingErrorResponse) {
    super('BAD REQUEST', STATUS_CODES.BAD_REQUEST, description, true, null, logingErrorResponse);
    // fixed: name was 'NOT FOUND' — wrong name for a bad request error
  }
}

class ValidationError extends AppError {
  constructor(description = 'Validation Error', errorStack) {
    super('VALIDATION ERROR', STATUS_CODES.BAD_REQUEST, description, true, errorStack, true);
    // fixed: name was 'BAD REQUEST' — should be 'VALIDATION ERROR'
  }
}

class NotFoundError extends AppError {
  constructor(description = 'Resource not found') {
    super('NOT FOUND', STATUS_CODES.NOT_FOUND, description, true, null, false);
    // fixed: class was missing despite NOT_FOUND existing in STATUS_CODES
  }
}

class UnauthorisedError extends AppError {
  constructor(description = 'Unauthorised') {
    super('UNAUTHORISED', STATUS_CODES.UN_AUTHORISED, description, true, null, false);
    // fixed: class was missing despite UN_AUTHORISED existing in STATUS_CODES
  }
}

export {
  AppError,
  APIError,
  BadRequestError,
  ValidationError,
  NotFoundError,
  UnauthorisedError,
  STATUS_CODES,
};