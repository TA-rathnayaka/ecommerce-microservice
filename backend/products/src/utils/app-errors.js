const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 401,
  FORBIDDEN: 403,
  // fixed: 403 is Forbidden (authenticated but not allowed)
  // 401 is Unauthorised (not authenticated) — both are useful so added both
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  constructor(name, statusCode, description, isOperational, errorStack, logingErrorResponse) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    // correct: ensures instanceof checks work properly after extending Error
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack || null;
    this.logError = logingErrorResponse || false;
    // fixed: errorStack and logError could be undefined — default to safe values
    Error.captureStackTrace(this, this.constructor);
    // fixed: was captureStackTrace(this) without second arg — stack trace was
    // including AppError constructor itself, second arg removes it from the trace
  }
}

// General API error
class APIError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = 'Internal Server Error',
    isOperational = true,
  ) {
    super(name, statusCode, description, isOperational);
  }
}

// 400 Bad Request
class BadRequestError extends AppError {
  constructor(description = 'Bad request', logingErrorResponse) {
    super('BAD REQUEST', STATUS_CODES.BAD_REQUEST, description, true, null, logingErrorResponse);
    // fixed: name was 'NOT FOUND' — wrong name for a bad request error
    // fixed: errorStack arg was false — should be null, false is misleading for a stack
  }
}

// 400 Validation Error
class ValidationError extends AppError {
  constructor(description = 'Validation Error', errorStack) {
    super('VALIDATION ERROR', STATUS_CODES.BAD_REQUEST, description, true, errorStack, true);
    // fixed: name was 'BAD REQUEST' — should be 'VALIDATION ERROR' to distinguish it
    // fixed: logingErrorResponse was not passed — validation errors should always be logged
  }
}

// 404 Not Found
class NotFoundError extends AppError {
  constructor(description = 'Resource not found') {
    super('NOT FOUND', STATUS_CODES.NOT_FOUND, description, true, null, false);
    // fixed: there was no NotFoundError class despite STATUS_CODES.NOT_FOUND existing
    // BadRequestError was incorrectly named 'NOT FOUND' — this is the correct home for it
  }
}

// 401 Unauthorised
class UnauthorisedError extends AppError {
  constructor(description = 'Unauthorised') {
    super('UNAUTHORISED', STATUS_CODES.UN_AUTHORISED, description, true, null, false);
    // fixed: no UnauthorisedError class existed despite UN_AUTHORISED being in STATUS_CODES
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