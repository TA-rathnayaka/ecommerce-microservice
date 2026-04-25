import { createLogger, transports } from 'winston';
import { AppError } from './app-errors.js';

const LogErrors = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app_error.log' })
  ]
});

class ErrorLogger {
  constructor() {}

  async logError(err) {
    console.log('==================== Start Error Logger ===============');
    LogErrors.log({
      level: 'error',
      message: `${new Date().toISOString()} - ${err.message || JSON.stringify(err)}`,
      // fixed: removed `private: true` — not a valid winston field
      // fixed: new Date() serializes poorly in JSON — use toISOString()
      // fixed: JSON.stringify(err) on an Error object produces "{}" — log message instead
    });
    console.log('==================== End Error Logger ===============');
    return false;
  }

  isTrustError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}

// fixed: moved process event listeners to module level — registering them
// inside the error handler middleware meant a new listener was added on
// every single request, causing massive memory leaks and duplicate handling
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  // throw so uncaughtException handler below can catch and log it
  throw reason;
});

process.on('uncaughtException', (error) => {
  const errorLogger = new ErrorLogger();
  errorLogger.logError(error);
  if (!errorLogger.isTrustError(error)) {
    // not an operational error — something is badly wrong, exit and let
    // the process manager (pm2, docker) restart the service
    console.error('Non-operational error — shutting down:', error);
    process.exit(1);
  }
  // fixed: second uncaughtException listener was shadowing the first
  // and referencing the wrong variable (err instead of error)
});

const ErrorHandler = async (err, req, res, next) => {
  const errorLogger = new ErrorLogger();

  await errorLogger.logError(err);

  if (errorLogger.isTrustError(err)) {
    // operational/known error — safe to return details to client
    const message = err.errorStack || err.message;
    return res.status(err.statusCode || 500).json({ success: false, message });
    // fixed: was checking err.errorStack separately with duplicate res.status calls
  }

  // unknown error — don't leak internals to client
  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
    // fixed: was using err.statusCode and err.message on untrusted errors
    // which could expose internal details or crash if statusCode is undefined
  });

  // fixed: removed next() at the end — unreachable after return,
  // and error handlers should not call next() after sending a response
};

export default ErrorHandler;