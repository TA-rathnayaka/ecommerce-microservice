// utils/error-handler.js (shopping service)
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
      // fixed: removed invalid `private: true` winston field
      // fixed: toISOString() for proper timestamp
      // fixed: log err.message — JSON.stringify(Error) produces {}
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

// fixed: moved process listeners to module level
// registering inside the middleware added a new listener on every request — memory leak
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  throw reason;
});

process.on('uncaughtException', (error) => {
  const errorLogger = new ErrorLogger();
  errorLogger.logError(error);
  if (!errorLogger.isTrustError(error)) {
    console.error('Non-operational error — shutting down:', error);
    process.exit(1);
    // fixed: was left empty with a comment — non-operational errors must exit
  }
});

const ErrorHandler = async (err, req, res, next) => {
  const errorLogger = new ErrorLogger();
  await errorLogger.logError(err);

  if (errorLogger.isTrustError(err)) {
    const message = err.errorStack || err.message;
    return res.status(err.statusCode || 500).json({ success: false, message });
    // fixed: duplicate res.status calls collapsed into one
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
    // fixed: untrusted errors no longer leak err.message to client
  });
};

export default ErrorHandler;